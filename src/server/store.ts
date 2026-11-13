import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Article,
  ConsultationRequest,
  Course,
  Department,
  Enrollment,
  Order,
  Project,
  ServiceItem,
  TeamMember,
  User,
} from '../types/isb';
import {
  INITIAL_ARTICLES,
  INITIAL_COURSES,
  INITIAL_DEPARTMENTS,
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_TEAM,
} from '../data/isbCatalogue';

export interface StoredUser extends User {
  passwordHash: string;
  passwordSalt: string;
  verificationCode?: string;
  resetToken?: string;
  resetExpiresAt?: number;
}

export interface DatabaseState {
  projects: Project[];
  departments: Department[];
  team: TeamMember[];
  services: ServiceItem[];
  courses: Course[];
  articles: Article[];
  users: StoredUser[];
  orders: Order[];
  enrollments: Enrollment[];
  consultations: ConsultationRequest[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'isb-db.json');

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return { hash: derived, salt: actualSalt };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt);
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(storedHash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function createInitialState(): DatabaseState {
  const adminCreds = hashPassword('ISBAdmin#2026');
  const studentCreds = hashPassword('ISBStudent#2026');
  const instructorCreds = hashPassword('ISBInstructor#2026');
  const now = new Date().toISOString();

  return {
    projects: INITIAL_PROJECTS,
    departments: INITIAL_DEPARTMENTS,
    team: INITIAL_TEAM,
    services: INITIAL_SERVICES,
    courses: INITIAL_COURSES,
    articles: INITIAL_ARTICLES,
    users: [
      {
        id: 'usr-admin-01',
        name: 'مدیر سامانه ISB',
        email: 'admin@isb.group',
        phone: '09151213005',
        role: 'admin',
        emailVerified: true,
        createdAt: now,
        passwordHash: adminCreds.hash,
        passwordSalt: adminCreds.salt,
      },
      {
        id: 'usr-instructor-01',
        name: 'دکتر سارا آتشی گلستان',
        email: 'instructor@isb.group',
        phone: '09151213005',
        role: 'instructor',
        emailVerified: true,
        createdAt: now,
        passwordHash: instructorCreds.hash,
        passwordSalt: instructorCreds.salt,
      },
      {
        id: 'usr-student-01',
        name: 'مهندس نمونه آکادمی',
        email: 'student@isb.group',
        phone: '09150000000',
        role: 'student',
        emailVerified: true,
        createdAt: now,
        passwordHash: studentCreds.hash,
        passwordSalt: studentCreds.salt,
      },
    ],
    orders: [],
    enrollments: [],
    consultations: [],
  };
}

let cachedDb: DatabaseState | null = null;

export function loadDb(): DatabaseState {
  if (cachedDb) return cachedDb;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial = createInitialState();
    saveDb(initial);
    cachedDb = initial;
    return cachedDb;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseState;
    if (Array.isArray(parsed.users) && !parsed.users.some((u) => u.email === 'instructor@isb.group')) {
      const instructorCreds = hashPassword('ISBInstructor#2026');
      parsed.users.push({
        id: 'usr-instructor-01',
        name: 'دکتر سارا آتشی گلستان',
        email: 'instructor@isb.group',
        phone: '09151213005',
        role: 'instructor',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        passwordHash: instructorCreds.hash,
        passwordSalt: instructorCreds.salt,
      });
      saveDb(parsed);
    }
    cachedDb = parsed;
    return cachedDb;
  } catch {
    const fallback = createInitialState();
    saveDb(fallback);
    cachedDb = fallback;
    return fallback;
  }
}

export function saveDb(next: DatabaseState): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(next, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
  cachedDb = next;
}

export function sanitizeUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}
