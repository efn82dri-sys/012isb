import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  hashPassword,
  loadDb,
  sanitizeUser,
  saveDb,
  StoredUser,
  verifyPassword,
} from './src/server/store';
import { COMPANY_INFO } from './src/data/isbCatalogue';
import { Order, User } from './src/types/isb';

const PORT = 3000;
const SESSION_COOKIE = 'isb_session';

function resolveSessionSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16) {
    return process.env.SESSION_SECRET;
  }
  const secretPath = path.resolve(process.cwd(), 'data', '.session-secret');
  try {
    if (fs.existsSync(secretPath)) {
      const existing = fs.readFileSync(secretPath, 'utf-8').trim();
      if (existing.length >= 32) return existing;
    }
    fs.mkdirSync(path.dirname(secretPath), { recursive: true });
    const generated = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(secretPath, generated, { mode: 0o600 });
    return generated;
  } catch {
    return crypto.randomBytes(32).toString('hex');
  }
}

const SESSION_SECRET = resolveSessionSecret();

const rateBuckets = new Map<string, { count: number; resetAt: number }>();
const verifyingOrderLocks = new Set<string>();

function rateLimit(maxHits: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    if (rateBuckets.size > 500) {
      for (const [k, v] of rateBuckets) {
        if (now > v.resetAt) rateBuckets.delete(k);
      }
    }
    const bucket = rateBuckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (bucket.count >= maxHits) {
      return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
    }
    bucket.count += 1;
    return next();
  };
}

function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const k = part.slice(0, idx).trim();
      const v = decodeURIComponent(part.slice(idx + 1).trim());
      out[k] = v;
    }
  }
  return out;
}

function signSessionToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string | undefined): string | null {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as {
      uid: string;
      exp: number;
    };
    if (Date.now() > decoded.exp) return null;
    return decoded.uid;
  } catch {
    return null;
  }
}

function isHttpsRequest(req: Request): boolean {
  return req.secure || req.headers['x-forwarded-proto'] === 'https';
}

function setSessionCookie(req: Request, res: Response, userId: string) {
  const token = signSessionToken(userId);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isHttpsRequest(req),
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function getAuthenticatedUser(req: Request): StoredUser | null {
  const cookies = parseCookies(req);
  const uid = verifySessionToken(cookies[SESSION_COOKIE]);
  if (!uid) return null;
  const db = loadDb();
  return db.users.find((u) => u.id === uid) || null;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  (req as Request & { currentUser: StoredUser }).currentUser = user;
  return next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrator access required' });
  }
  (req as Request & { currentUser: StoredUser }).currentUser = user;
  return next();
}

function cleanStr(val: unknown, maxLen = 500): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

function normalizeSlug(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

function getBaseUrl(req: Request): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, '');
  const host = req.get('host') || `localhost:${PORT}`;
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  return `${proto}://${host}`;
}

function csrfOriginGuard(req: Request, res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.headers.origin;
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const reqHost = req.get('host');
      if (reqHost && originHost !== reqHost) {
        return res.status(403).json({ error: 'Cross-origin state mutation blocked.' });
      }
    } catch {
      return res.status(403).json({ error: 'Invalid Origin header.' });
    }
  }
  return next();
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });
  app.use('/api', csrfOriginGuard);
  app.use(express.json({ limit: '6mb' }));

  // Ensure uploads directory exists
  const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // --- SEO Routes ---
  app.get('/robots.txt', (req, res) => {
    const base = getBaseUrl(req);
    res.type('text/plain').send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n`
    );
  });

  app.get('/sitemap.xml', (req, res) => {
    const db = loadDb();
    const base = getBaseUrl(req);
    const staticRoutes = [
      '/',
      '/about',
      '/departments/architecture',
      '/departments/energy',
      '/departments/structure',
      '/services',
      '/projects',
      '/academy',
      '/insights',
      '/contact',
    ];
    const urls = [
      ...staticRoutes,
      ...db.projects.map((p) => `/projects/${p.slug}`),
      ...db.courses.map((c) => `/academy/${c.slug}`),
      ...db.articles.map((a) => `/insights/${a.slug}`),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${base}${u}</loc></url>`)
      .join('\n')}\n</urlset>`;
    res.type('application/xml').send(xml);
  });

  // --- Public Content Endpoint ---
  app.get('/api/content', (_req, res) => {
    const db = loadDb();
    res.json({
      projects: db.projects,
      departments: db.departments,
      team: db.team,
      services: db.services,
      courses: db.courses,
      articles: db.articles,
    });
  });

  // --- Authentication Routes ---
  app.get('/api/auth/me', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.json({ user: null });
    return res.json({ user: sanitizeUser(user) });
  });

  app.post('/api/auth/register', rateLimit(15, 60_000), (req, res) => {
    const name = cleanStr(req.body?.name, 120);
    const email = cleanStr(req.body?.email, 160).toLowerCase();
    const phone = cleanStr(req.body?.phone, 30);
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!name || !email.includes('@') || password.length < 6) {
      return res.status(400).json({
        error: 'Valid name, email, and password (min 6 characters) are required.',
      });
    }

    const db = loadDb();
    if (db.users.some((u) => u.email === email)) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const { hash, salt } = hashPassword(password);
    const verificationCode = String(crypto.randomInt(100000, 999999));
    const newUser: StoredUser = {
      id: `usr-${crypto.randomUUID().slice(0, 8)}`,
      name,
      email,
      phone,
      role: 'student',
      emailVerified: false,
      verificationCode,
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      passwordSalt: salt,
    };

    db.users.push(newUser);
    saveDb(db);
    setSessionCookie(req, res, newUser.id);

    return res.status(201).json({
      user: sanitizeUser(newUser),
      sandboxVerificationCode: verificationCode,
    });
  });

  app.post('/api/auth/login', rateLimit(20, 60_000), (req, res) => {
    const email = cleanStr(req.body?.email, 160).toLowerCase();
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    const db = loadDb();
    const user = db.users.find((u) => u.email === email);
    if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    setSessionCookie(req, res, user.id);
    return res.json({ user: sanitizeUser(user) });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie(SESSION_COOKIE, { path: '/', secure: isHttpsRequest(req), sameSite: 'lax' });
    res.json({ ok: true });
  });

  app.post('/api/auth/verify-email', rateLimit(10, 60_000), requireAuth, (req, res) => {
    const currentUser = (req as Request & { currentUser: StoredUser }).currentUser;
    const code = cleanStr(req.body?.code, 16);
    const db = loadDb();
    const target = db.users.find((u) => u.id === currentUser.id);
    if (!target) return res.status(404).json({ error: 'User not found' });

    if (target.emailVerified) {
      return res.json({ user: sanitizeUser(target) });
    }
    if (!code || code !== target.verificationCode) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }
    target.emailVerified = true;
    target.verificationCode = undefined;
    saveDb(db);
    return res.json({ user: sanitizeUser(target) });
  });

  app.post('/api/auth/resend-verification', requireAuth, rateLimit(6, 60_000), (req, res) => {
    const currentUser = (req as Request & { currentUser: StoredUser }).currentUser;
    const db = loadDb();
    const target = db.users.find((u) => u.id === currentUser.id);
    if (!target) return res.status(404).json({ error: 'User not found' });
    if (target.emailVerified) {
      return res.json({ user: sanitizeUser(target), alreadyVerified: true });
    }
    const verificationCode = String(crypto.randomInt(100000, 999999));
    target.verificationCode = verificationCode;
    saveDb(db);
    return res.json({
      ok: true,
      sandboxVerificationCode: verificationCode,
    });
  });

  app.post('/api/auth/forgot-password', rateLimit(10, 60_000), (req, res) => {
    const email = cleanStr(req.body?.email, 160).toLowerCase();
    const db = loadDb();
    const user = db.users.find((u) => u.email === email);
    if (!user) {
      return res.json({
        ok: true,
        message: 'If the email exists, a reset code has been generated.',
      });
    }
    const token = crypto.randomBytes(4).toString('hex').toUpperCase();
    user.resetToken = token;
    user.resetExpiresAt = Date.now() + 30 * 60 * 1000;
    saveDb(db);
    return res.json({
      ok: true,
      sandboxResetToken: token,
    });
  });

  app.post('/api/auth/reset-password', rateLimit(10, 60_000), (req, res) => {
    const email = cleanStr(req.body?.email, 160).toLowerCase();
    const token = cleanStr(req.body?.token, 32).toUpperCase();
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const db = loadDb();
    const user = db.users.find((u) => u.email === email);
    if (
      !user ||
      !user.resetToken ||
      user.resetToken !== token ||
      !user.resetExpiresAt ||
      Date.now() > user.resetExpiresAt
    ) {
      return res.status(400).json({ error: 'Invalid or expired reset code.' });
    }
    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.passwordSalt = salt;
    user.resetToken = undefined;
    user.resetExpiresAt = undefined;
    saveDb(db);
    return res.json({ ok: true });
  });

  app.patch('/api/auth/profile', requireAuth, (req, res) => {
    const currentUser = (req as Request & { currentUser: StoredUser }).currentUser;
    const name = cleanStr(req.body?.name, 120);
    const phone = cleanStr(req.body?.phone, 30);
    const db = loadDb();
    const user = db.users.find((u) => u.id === currentUser.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (name) user.name = name;
    user.phone = phone;
    saveDb(db);
    return res.json({ user: sanitizeUser(user) });
  });

  // Helper: strictly verify user access to a course (RBAC role OR verified paid order enrollment)
  function isUserVerifiedForCourse(
    db: ReturnType<typeof loadDb>,
    user: StoredUser,
    courseId: string
  ): boolean {
    if (user.role === 'admin' || user.role === 'instructor') return true;
    return db.enrollments.some(
      (e) =>
        e.userId === user.id &&
        e.courseId === courseId &&
        db.orders.some(
          (o) => o.id === e.orderId && o.userId === user.id && o.status === 'paid'
        )
    );
  }

  function buildCourseResources(courseId: string) {
    return [
      {
        id: 'res-handbook',
        category: 'handbook' as const,
        title: {
          fa: 'دفترچه فنی و خلاصه جامع سرفصل‌های دوره (TXT / Markdown)',
          en: 'Complete Technical Handbook & Syllabus Guide (TXT / Markdown)',
        },
        type: 'TECHNICAL GUIDE',
        size: 'Verified Course Pack',
      },
      {
        id: 'res-checklist',
        category: 'checklist' as const,
        title: {
          fa: 'چک‌لیست مهندسی، اهداف آموزشی و تمرین‌های عملی دوره',
          en: 'Engineering Checklist, Objectives & Applied Worksheet',
        },
        type: 'COMPLIANCE CHECKLIST',
        size: `COURSE · ${courseId.toUpperCase()}`,
      },
    ];
  }

  // --- Orders & Payment Gateway (Server-Authoritative & Idempotent) ---
  app.post('/api/orders', requireAuth, (req, res) => {
    const user = (req as Request & { currentUser: StoredUser }).currentUser;
    const courseIds = Array.isArray(req.body?.courseIds) ? (req.body.courseIds as string[]) : [];
    const uniqueIds = Array.from(new Set(courseIds)).filter(Boolean);
    if (uniqueIds.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const db = loadDb();
    const selectedCourses = uniqueIds
      .map((cid) => db.courses.find((c) => c.id === cid && c.isAvailable))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));

    if (selectedCourses.length === 0) {
      return res.status(400).json({ error: 'No valid available courses selected.' });
    }

    const unownedCourses = selectedCourses.filter(
      (c) =>
        !db.enrollments.some(
          (e) =>
            e.userId === user.id &&
            e.courseId === c.id &&
            db.orders.some((o) => o.id === e.orderId && o.status === 'paid')
        )
    );

    if (unownedCourses.length === 0) {
      return res.status(409).json({
        error: 'You already own all selected courses in your cart.',
      });
    }

    const items = unownedCourses.map((c) => ({
      courseId: c.id,
      titleFa: c.title.fa,
      titleEn: c.title.en,
      priceToman: c.priceToman,
    }));
    const totalToman = items.reduce((acc, item) => acc + item.priceToman, 0);

    const hasLiveZarinpal = Boolean(process.env.ZARINPAL_MERCHANT_ID);

    const order: Order = {
      id: `ISB-${Date.now().toString(36).toUpperCase()}-${crypto.randomInt(100, 999)}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      items,
      totalToman,
      status: 'pending',
      gateway: hasLiveZarinpal ? 'zarinpal-live' : 'zarinpal-sandbox',
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(order);
    saveDb(db);
    return res.status(201).json({ order });
  });

  app.get('/api/orders/:orderId', requireAuth, (req, res) => {
    const user = (req as Request & { currentUser: StoredUser }).currentUser;
    const db = loadDb();
    const order = db.orders.find(
      (o) => o.id === req.params.orderId && (o.userId === user.id || user.role === 'admin')
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    return res.json({ order });
  });

  app.post('/api/payments/initiate', rateLimit(25, 60_000), requireAuth, async (req, res) => {
    const user = (req as Request & { currentUser: StoredUser }).currentUser;
    const orderId = cleanStr(req.body?.orderId, 80);
    const db = loadDb();
    const order = db.orders.find((o) => o.id === orderId && o.userId === user.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (order.status === 'paid') {
      return res.status(400).json({ error: 'Order is already paid.' });
    }
    if (order.status === 'refunded') {
      return res.status(400).json({ error: 'Refunded orders cannot be re-initiated.' });
    }

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (merchantId && order.totalToman > 0) {
      try {
        const callbackUrl = `${process.env.APP_URL || 'http://localhost:3000'}/checkout?orderId=${encodeURIComponent(order.id)}`;
        const zRes = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchant_id: merchantId,
            amount: order.totalToman * 10, // Toman -> Rial
            callback_url: callbackUrl,
            description: `ISB Academy Order ${order.id}`,
            metadata: { email: user.email, mobile: user.phone || undefined },
          }),
        });
        const zData = (await zRes.json()) as {
          data?: { code?: number; authority?: string };
        };
        if (zData?.data?.code === 100 && zData.data.authority) {
          order.status = 'pending';
          order.authority = zData.data.authority;
          order.gateway = 'zarinpal-live';
          saveDb(db);
          return res.json({
            mode: 'zarinpal-configured',
            gateway: order.gateway,
            orderId: order.id,
            authority: order.authority,
            paymentUrl: `https://www.zarinpal.com/pg/StartPay/${order.authority}`,
            amountToman: order.totalToman,
          });
        }
      } catch {
        return res.status(502).json({
          error: 'Could not reach live Zarinpal payment gateway.',
        });
      }
    }

    const authority = `A000000000000000000000000000${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
    order.status = 'pending';
    order.authority = authority;
    order.gateway = 'zarinpal-sandbox';
    saveDb(db);

    return res.json({
      mode: 'sandbox',
      gateway: 'zarinpal-sandbox',
      orderId: order.id,
      authority,
      amountToman: order.totalToman,
    });
  });

  app.post('/api/payments/verify', rateLimit(25, 60_000), requireAuth, async (req, res) => {
    const user = (req as Request & { currentUser: StoredUser }).currentUser;
    const orderId = cleanStr(req.body?.orderId, 80);
    const authority = cleanStr(req.body?.authority, 120);
    const outcome = req.body?.outcome === 'failed' ? 'failed' : 'success';

    if (!orderId || verifyingOrderLocks.has(orderId)) {
      return res.status(409).json({ error: 'Payment verification already in progress for this order.' });
    }
    verifyingOrderLocks.add(orderId);
    try {
      const db = loadDb();
      const order = db.orders.find((o) => o.id === orderId && o.userId === user.id);
      if (!order) return res.status(404).json({ error: 'Order not found.' });

      // Idempotent confirmation if already paid
      if (order.status === 'paid') {
        return res.json({ order, verified: true, alreadyProcessed: true });
      }

      if (order.status === 'refunded') {
        return res.status(400).json({ error: 'Refunded orders cannot be verified.' });
      }

      if (!order.authority || order.authority !== authority) {
        return res.status(400).json({ error: 'Invalid payment authority token.' });
      }

    const nowIso = new Date().toISOString();
    const merchantId = process.env.ZARINPAL_MERCHANT_ID;

    if (merchantId && order.gateway === 'zarinpal-live' && order.totalToman > 0) {
      if (outcome === 'failed') {
        order.status = 'failed';
        order.gatewayStatus = '-22';
        order.gatewayMessage = 'Payment cancelled before gateway completion.';
        order.verifiedAt = nowIso;
        saveDb(db);
        return res.json({ order, verified: false });
      }
      try {
        const vRes = await fetch('https://api.zarinpal.com/pg/v4/payment/verify.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchant_id: merchantId,
            amount: order.totalToman * 10,
            authority,
          }),
        });
        const vData = (await vRes.json()) as {
          data?: { code?: number; ref_id?: number; card_pan?: string };
        };
        if (vData?.data?.code !== 100 && vData?.data?.code !== 101) {
          order.status = 'failed';
          order.gatewayStatus = String(vData?.data?.code || '-50');
          order.gatewayMessage = 'Zarinpal live verification declined.';
          order.verifiedAt = nowIso;
          saveDb(db);
          return res.json({ order, verified: false });
        }
        order.refId = String(vData.data.ref_id || crypto.randomInt(10000000, 99999999));
        order.cardMask = vData.data.card_pan || undefined;
        order.gatewayStatus = String(vData.data.code);
        order.gatewayMessage = 'Verified via Zarinpal Live Gateway';
      } catch {
        return res.status(502).json({ error: 'Payment gateway verification request failed.' });
      }
    } else {
      if (outcome === 'failed') {
        order.status = 'failed';
        order.gatewayStatus = '-22';
        order.gatewayMessage = 'Transaction declined or cancelled in Sandbox gateway.';
        order.verifiedAt = nowIso;
        saveDb(db);
        return res.json({ order, verified: false });
      }
      order.refId = String(crypto.randomInt(10000000, 99999999));
      order.cardMask = '6037-99**-****-4210';
      order.gatewayStatus = '100';
      order.gatewayMessage =
        order.totalToman === 0
          ? 'Free enrollment confirmed'
          : 'Verified via ISB Zarinpal Sandbox Gateway';
    }

    order.status = 'paid';
    order.paidAt = nowIso;
    order.verifiedAt = nowIso;

    for (const item of order.items) {
      const exists = db.enrollments.some(
        (e) =>
          e.userId === user.id &&
          e.courseId === item.courseId &&
          db.orders.some((o) => o.id === e.orderId && o.status === 'paid')
      );
      if (!exists) {
        db.enrollments.push({
          id: `enr-${crypto.randomUUID().slice(0, 8)}`,
          userId: user.id,
          courseId: item.courseId,
          orderId: order.id,
          progressPercent: 0,
          completedModules: [],
          enrolledAt: nowIso,
        });
      }
    }

    saveDb(db);
    return res.json({ order, verified: true });
    } finally {
      verifyingOrderLocks.delete(orderId);
    }
  });

  // --- Protected Student Dashboard & Course Access ---
  app.get('/api/dashboard', requireAuth, (req, res) => {
    const user = (req as Request & { currentUser: StoredUser }).currentUser;
    const db = loadDb();
    const orders = db.orders.filter((o) => o.userId === user.id);
    const paidOrderIds = new Set(orders.filter((o) => o.status === 'paid').map((o) => o.id));
    const enrollments = db.enrollments.filter(
      (e) => e.userId === user.id && paidOrderIds.has(e.orderId)
    );
    res.json({
      enrollments,
      orders,
      role: user.role,
    });
  });

  app.post('/api/enrollments/:courseId/progress', requireAuth, (req, res) => {
    const user = (req as Request & { currentUser: StoredUser }).currentUser;
    const { courseId } = req.params;
    const moduleIndex = Number(req.body?.moduleIndex);
    const db = loadDb();

    if (!isUserVerifiedForCourse(db, user, courseId)) {
      return res.status(403).json({
        error: 'Verified purchase required to track course progress.',
      });
    }

    const enrollment = db.enrollments.find(
      (e) =>
        e.userId === user.id &&
        e.courseId === courseId &&
        db.orders.some((o) => o.id === e.orderId && o.status === 'paid')
    );
    if (!enrollment) {
      return res.status(403).json({ error: 'Course not unlocked for this account.' });
    }
    const course = db.courses.find((c) => c.id === courseId);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    if (Number.isInteger(moduleIndex) && moduleIndex >= 0 && moduleIndex < course.syllabus.length) {
      if (!enrollment.completedModules.includes(moduleIndex)) {
        enrollment.completedModules.push(moduleIndex);
      } else {
        enrollment.completedModules = enrollment.completedModules.filter((m) => m !== moduleIndex);
      }
    }

    const totalModules = Math.max(1, course.syllabus.length);
    enrollment.progressPercent = Math.round(
      (enrollment.completedModules.length / totalModules) * 100
    );
    if (enrollment.progressPercent === 100 && !enrollment.certificateCode) {
      enrollment.certificateCode = `ISB-CERT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    }

    saveDb(db);
    return res.json({ enrollment });
  });

  app.get('/api/courses/:slug/materials', requireAuth, (req, res) => {
    const user = (req as Request & { currentUser: StoredUser }).currentUser;
    const db = loadDb();
    const course = db.courses.find((c) => c.slug === req.params.slug);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (!isUserVerifiedForCourse(db, user, course.id)) {
      return res.status(403).json({
        error: 'Verified course purchase required to access paid course materials.',
      });
    }

    return res.json({
      courseId: course.id,
      resources: buildCourseResources(course.id),
    });
  });

  app.get('/api/courses/:slug/materials/:resourceId/download', requireAuth, (req, res) => {
    const user = (req as Request & { currentUser: StoredUser }).currentUser;
    const db = loadDb();
    const course = db.courses.find((c) => c.slug === req.params.slug);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (!isUserVerifiedForCourse(db, user, course.id)) {
      return res.status(403).json({
        error: 'Verified purchase required to download course materials.',
      });
    }

    const resources = buildCourseResources(course.id);
    const resource = resources.find((r) => r.id === req.params.resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Course resource not found.' });
    }

    const contentLines = [
      `ISB ACADEMY — PROTECTED COURSE RESOURCE`,
      `==================================================`,
      `Course (EN): ${course.title.en}`,
      `Course (FA): ${course.title.fa}`,
      `Instructor:  ${course.instructor.en} (${course.instructorRole.en})`,
      `Issued To:   ${user.name} <${user.email}> [${user.role.toUpperCase()}]`,
      `Resource:    ${resource.title.en}`,
      `==================================================`,
      ``,
      `1. COURSE OVERVIEW`,
      `------------------`,
      course.overview.en,
      ``,
      course.overview.fa,
      ``,
      `2. LEARNING OBJECTIVES`,
      `----------------------`,
      ...course.objectives.map((o, i) => `  ${i + 1}. ${o.en}\n     ${o.fa}`),
      ``,
      `3. SYLLABUS & TECHNICAL MODULES`,
      `-------------------------------`,
      ...course.syllabus.flatMap((mod, idx) => [
        `  Module ${idx + 1}: ${mod.title.en} (${mod.duration.en})`,
        `  ${mod.title.fa}`,
        ...mod.topics.map((tp) => `    - ${tp.en} | ${tp.fa}`),
        ``,
      ]),
      `4. REQUIREMENTS & PREPARATION`,
      `-----------------------------`,
      ...course.requirements.map((r) => `  * ${r.en} | ${r.fa}`),
      ``,
      `© Iran Sustainable Building Group (ISB Group) — Mashhad, Iran`,
    ];

    const filename = `${course.slug}-${resource.id}.txt`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(contentLines.join('\n'));
  });

  // --- Consultation Requests ---
  app.post('/api/consultations', rateLimit(10, 60_000), (req, res) => {
    const name = cleanStr(req.body?.name, 120);
    const email = cleanStr(req.body?.email, 160);
    const phone = cleanStr(req.body?.phone, 30);
    const organization = cleanStr(req.body?.organization, 160);
    const department =
      req.body?.department === 'architecture' ||
      req.body?.department === 'energy' ||
      req.body?.department === 'structure'
        ? req.body.department
        : 'energy';
    const projectLocation = cleanStr(req.body?.projectLocation, 160);
    const message = cleanStr(req.body?.message, 2000);
    const consentAccepted = Boolean(req.body?.consentAccepted);

    if (!name || !email.includes('@') || !phone || !message || !consentAccepted) {
      return res.status(400).json({
        error: 'Name, valid email, phone, project brief, and privacy consent are required.',
      });
    }

    const db = loadDb();
    const record = {
      id: `cns-${crypto.randomUUID().slice(0, 8)}`,
      name,
      email,
      phone,
      organization,
      department,
      projectLocation,
      message,
      consentAccepted,
      createdAt: new Date().toISOString(),
    };
    db.consultations.unshift(record);
    saveDb(db);
    return res.status(201).json({ consultation: record });
  });

  // --- Admin CMS Endpoints ---
  app.post('/api/cms/upload', requireAdmin, (req, res) => {
    const dataUrl = typeof req.body?.dataUrl === 'string' ? req.body.dataUrl : '';
    const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) {
      return res.status(400).json({ error: 'Only PNG, JPEG, or WEBP base64 images are permitted.' });
    }
    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const buf = Buffer.from(match[2], 'base64');
    if (buf.byteLength > 4 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image must be smaller than 4 MB.' });
    }
    const filename = `cms-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), buf);
    return res.status(201).json({ url: `/uploads/${filename}` });
  });

  app.post('/api/cms/projects', requireAdmin, (req, res) => {
    const db = loadDb();
    const p = req.body;
    if (!p?.title?.fa || !p?.slug) {
      return res.status(400).json({ error: 'Project title and slug are required.' });
    }
    const cleanSlug = String(p.slug)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '');
    if (!cleanSlug) {
      return res.status(400).json({ error: 'A valid URL slug is required.' });
    }
    if (db.projects.some((existing) => existing.slug === cleanSlug)) {
      return res.status(409).json({ error: 'A project with this slug already exists.' });
    }
    const project = {
      ...p,
      slug: cleanSlug,
      id: p.id || `proj-${crypto.randomUUID().slice(0, 8)}`,
      departments: Array.isArray(p.departments) && p.departments.length ? p.departments : ['architecture'],
      services: Array.isArray(p.services) ? p.services : [],
      galleryImages: Array.isArray(p.galleryImages) ? p.galleryImages : [],
      scopeOfWork: Array.isArray(p.scopeOfWork) ? p.scopeOfWork : [],
      designStrategies: Array.isArray(p.designStrategies) ? p.designStrategies : [],
      metrics: Array.isArray(p.metrics) ? p.metrics : [],
      energyGrade: p.energyGrade || undefined,
      seroSabzTier: p.seroSabzTier?.fa || p.seroSabzTier?.en ? p.seroSabzTier : undefined,
    };
    db.projects.unshift(project);
    saveDb(db);
    return res.status(201).json({ project });
  });

  app.put('/api/cms/projects/:id', requireAdmin, (req, res) => {
    const db = loadDb();
    const idx = db.projects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });
    const incoming = req.body || {};
    const merged = { ...db.projects[idx], ...incoming, id: req.params.id };
    if ('energyGrade' in incoming && !incoming.energyGrade) {
      delete merged.energyGrade;
    }
    if ('seroSabzTier' in incoming && (!incoming.seroSabzTier?.fa && !incoming.seroSabzTier?.en)) {
      delete merged.seroSabzTier;
    }
    db.projects[idx] = merged;
    saveDb(db);
    return res.json({ project: db.projects[idx] });
  });

  app.delete('/api/cms/projects/:id', requireAdmin, (req, res) => {
    const db = loadDb();
    db.projects = db.projects.filter((p) => p.id !== req.params.id);
    saveDb(db);
    return res.json({ ok: true });
  });

  app.post('/api/cms/team', requireAdmin, (req, res) => {
    const db = loadDb();
    const m = req.body || {};
    const nameFa = cleanStr(m?.name?.fa, 160);
    const roleFa = cleanStr(m?.role?.fa, 160);
    if (!nameFa || !roleFa) {
      return res.status(400).json({ error: 'Name and role are required.' });
    }
    const validDept = ['architecture', 'energy', 'structure', 'management', 'advisor'].includes(m.department)
      ? m.department
      : 'architecture';
    const member = {
      id: `tm-${crypto.randomUUID().slice(0, 8)}`,
      name: { fa: nameFa, en: cleanStr(m?.name?.en, 160) || nameFa },
      role: { fa: roleFa, en: cleanStr(m?.role?.en, 160) || roleFa },
      department: validDept,
      bio: { fa: cleanStr(m?.bio?.fa, 1000), en: cleanStr(m?.bio?.en, 1000) || cleanStr(m?.bio?.fa, 1000) },
      photo: cleanStr(m?.photo, 300) || undefined,
      isAdvisor: Boolean(m.isAdvisor || validDept === 'advisor'),
    };
    db.team.push(member);
    saveDb(db);
    return res.status(201).json({ member });
  });

  app.delete('/api/cms/team/:id', requireAdmin, (req, res) => {
    const db = loadDb();
    const before = db.team.length;
    db.team = db.team.filter((m) => m.id !== req.params.id);
    if (db.team.length === before) return res.status(404).json({ error: 'Team member not found' });
    saveDb(db);
    return res.json({ ok: true });
  });

  app.put('/api/cms/departments/:id', requireAdmin, (req, res) => {
    const db = loadDb();
    const idx = db.departments.findIndex((d) => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Department not found' });
    const body = req.body || {};
    const current = db.departments[idx];
    db.departments[idx] = {
      ...current,
      title: body.title?.fa
        ? { fa: cleanStr(body.title.fa, 200), en: cleanStr(body.title.en, 200) || current.title.en }
        : current.title,
      subtitle: body.subtitle?.fa
        ? { fa: cleanStr(body.subtitle.fa, 300), en: cleanStr(body.subtitle.en, 300) || current.subtitle.en }
        : current.subtitle,
      description: body.description?.fa
        ? { fa: cleanStr(body.description.fa, 1500), en: cleanStr(body.description.en, 1500) || current.description.en }
        : current.description,
      capabilities: Array.isArray(body.capabilities)
        ? body.capabilities
            .slice(0, 20)
            .map((c: { fa?: unknown; en?: unknown }) => ({
              fa: cleanStr(c?.fa, 300),
              en: cleanStr(c?.en, 300),
            }))
            .filter((c: { fa: string; en: string }) => c.fa || c.en)
        : current.capabilities,
    };
    saveDb(db);
    return res.json({ department: db.departments[idx] });
  });

  app.post('/api/cms/courses', requireAdmin, (req, res) => {
    const db = loadDb();
    const c = req.body || {};
    const titleFa = cleanStr(c?.title?.fa, 200);
    const cleanSlug = normalizeSlug(c?.slug);
    if (!titleFa || !cleanSlug) {
      return res.status(400).json({ error: 'Course title and valid URL slug are required.' });
    }
    if (db.courses.some((existing) => existing.slug === cleanSlug)) {
      return res.status(409).json({ error: 'A course with this slug already exists.' });
    }
    const priceToman = Math.max(0, Math.round(Number(c.priceToman) || 0));
    const course = {
      ...c,
      id: `course-${crypto.randomUUID().slice(0, 8)}`,
      slug: cleanSlug,
      title: { fa: titleFa, en: cleanStr(c?.title?.en, 200) || titleFa },
      priceToman,
      isAvailable: c.isAvailable !== false,
      objectives: Array.isArray(c.objectives) ? c.objectives : [],
      syllabus: Array.isArray(c.syllabus) ? c.syllabus : [],
      targetAudience: Array.isArray(c.targetAudience) ? c.targetAudience : [],
      requirements: Array.isArray(c.requirements) ? c.requirements : [],
      faqs: Array.isArray(c.faqs) ? c.faqs : [],
    };
    db.courses.unshift(course);
    saveDb(db);
    return res.status(201).json({ course });
  });

  app.put('/api/cms/courses/:id', requireAdmin, (req, res) => {
    const db = loadDb();
    const idx = db.courses.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Course not found' });
    const incoming = req.body || {};
    const updated = { ...db.courses[idx] };
    if (typeof incoming.isAvailable === 'boolean') updated.isAvailable = incoming.isAvailable;
    if (incoming.priceToman !== undefined) {
      updated.priceToman = Math.max(0, Math.round(Number(incoming.priceToman) || 0));
    }
    if (incoming.title?.fa) {
      updated.title = {
        fa: cleanStr(incoming.title.fa, 200),
        en: cleanStr(incoming.title.en, 200) || updated.title.en,
      };
    }
    db.courses[idx] = updated;
    saveDb(db);
    return res.json({ course: db.courses[idx] });
  });

  app.post('/api/cms/articles', requireAdmin, (req, res) => {
    const db = loadDb();
    const a = req.body || {};
    const titleFa = cleanStr(a?.title?.fa, 240);
    const cleanSlug = normalizeSlug(a?.slug);
    if (!titleFa || !cleanSlug) {
      return res.status(400).json({ error: 'Article title and valid URL slug are required.' });
    }
    if (db.articles.some((existing) => existing.slug === cleanSlug)) {
      return res.status(409).json({ error: 'An article with this slug already exists.' });
    }
    const article = {
      ...a,
      id: `art-${crypto.randomUUID().slice(0, 8)}`,
      slug: cleanSlug,
      title: { fa: titleFa, en: cleanStr(a?.title?.en, 240) || titleFa },
      body: Array.isArray(a.body) ? a.body : [],
    };
    db.articles.unshift(article);
    saveDb(db);
    return res.status(201).json({ article });
  });

  app.get('/api/cms/overview', requireAdmin, (_req, res) => {
    const db = loadDb();
    const users: User[] = db.users.map(sanitizeUser);
    res.json({
      orders: db.orders,
      enrollments: db.enrollments,
      consultations: db.consultations,
      users,
    });
  });

  app.post('/api/cms/orders/:id/refund', requireAdmin, (req, res) => {
    const db = loadDb();
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = 'refunded';
    db.enrollments = db.enrollments.filter((e) => e.orderId !== order.id);
    saveDb(db);
    return res.json({ order });
  });

  // --- Server-Side Gemini Consultation Assistant ---
  app.post('/api/ai/consult', rateLimit(15, 60_000), async (req, res) => {
    const question = cleanStr(req.body?.question, 800);
    const lang = req.body?.lang === 'en' ? 'en' : 'fa';
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const db = loadDb();
    const contextSummary = {
      company: COMPANY_INFO,
      departments: db.departments.map((d) => ({
        id: d.id,
        title: d.title,
        capabilities: d.capabilities,
      })),
      projects: db.projects.map((p) => ({
        title: p.title,
        location: p.location,
        year: p.year,
        energyGrade: p.energyGrade,
        seroSabzTier: p.seroSabzTier,
        metrics: p.metrics,
      })),
      courses: db.courses.map((c) => ({
        title: c.title,
        duration: c.duration,
        priceToman: c.priceToman,
        instructor: c.instructor,
      })),
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error:
          lang === 'fa'
            ? 'دستیار هوشمند در حال حاضر در انتظار تنظیم کلید سرور است. لطفاً از ناوبری خدمات یا فرم مشاوره مستقیم استفاده کنید.'
            : 'The consultation assistant is awaiting server API key configuration. Please use our Service Navigator or direct consultation form.',
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction =
        lang === 'fa'
          ? `شما دستیار اطلاع‌رسانی عمومی گروه ساختمانی بنای پایدار ایران‌زمین (ISB Group) هستید. فقط بر اساس داده‌های تأییدشده کاتالوگ که در اختیار شماست پاسخ دهید. هرگز آمار پروژه، گواهینامه، جایزه یا سوابق مهندسین را جعل نکنید. در پایان هر پاسخ کوتاه تأکید کنید که این راهنمایی اطلاع‌رسانی است و جایگزین مشاوره یا تأییدیه رسمی مهندسی سازه و انرژی نیست. داده‌های رسمی:\n${JSON.stringify(
              contextSummary
            )}`
          : `You are the public information assistant for ISB Group (Iran Sustainable Building Group). Answer strictly using the verified catalogue data provided below. Never fabricate project metrics, awards, certifications, or staff credentials. Clearly note that this guidance is informational and does not constitute certified structural or energy engineering sign-off. Verified data:\n${JSON.stringify(
              contextSummary
            )}`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: question,
        config: {
          systemInstruction,
        },
      });

      return res.json({
        answer: response.text || '',
        disclaimer:
          lang === 'fa'
            ? 'توضیح: این پاسخ صرفاً راهنمای اولیه بر پایه اطلاعات عمومی ISB است و جایگزین محاسبات و تأییدیه رسمی مهندسی نیست.'
            : 'Note: This guidance is informational based on public ISB data and does not replace certified engineering consultation.',
      });
    } catch (err) {
      console.error('AI consultation request failed:', err);
      return res.status(502).json({
        error:
          lang === 'fa'
            ? 'سرویس دستیار هوشمند موقتاً در دسترس نیست. لطفاً از ناوبری خدمات یا فرم مشاوره استفاده کنید.'
            : 'The consultation service is temporarily unavailable. Please use our Service Navigator or direct consultation form.',
      });
    }
  });

  // --- Vite Dev Middleware / Production Static ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ISB Digital Architecture server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
