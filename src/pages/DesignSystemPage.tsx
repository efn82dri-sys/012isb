import React, { useState } from 'react';
import {
  Award,
  Check,
  CheckSquare,
  Copy,
  CreditCard,
  Lock,
  Monitor,
  Receipt,
  ShieldCheck,
  Smartphone,
  Square,
  Tablet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ISB_DESIGN_TOKENS } from '../design-system/tokens';
import {
  IsbButton,
  IsbCourseCard,
  IsbField,
  IsbProjectCard,
  IsbSelect,
  IsbStatusNotice,
} from '../design-system/components';
import { IsbLogo } from '../components/IsbLogo';

export const DesignSystemPage: React.FC = () => {
  const { lang, toggleLang, projects, courses, formatPrice, navigate } = useApp();
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [formEmail, setFormEmail] = useState('architect@isb.group');
  const [formErrorDemo, setFormErrorDemo] = useState(true);
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'verify' | 'reset'>('login');
  const [checkedMod, setCheckedMod] = useState<number[]>([0, 1]);

  const copyToken = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const activeGrid = ISB_DESIGN_TOKENS.grid[viewportMode];
  const colCount = activeGrid.columns;

  const sampleProject = projects[0];
  const sampleCourse = courses[0];

  return (
    <div className="pt-24 pb-24 bg-[#FAFBFD] text-[#141923]">
      {/* HEADER */}
      <section className="max-w-[1360px] mx-auto px-6 lg:px-10 pb-12 hairline-b">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-mono-tech text-[#223981] font-semibold">
              00 · ISB DESIGN SYSTEM & UI/UX ARCHITECTURE
            </p>
            <h1
              className="font-bold tracking-tight text-balance leading-[1.15]"
              style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.85rem)' }}
            >
              {lang === 'fa'
                ? 'نظام طراحی فیگما و معماری رابط کاربری گروه ISB'
                : 'ISB Figma Design System & UI/UX Architecture'}
            </h1>
            <p className="text-sm sm:text-base text-[#525C6E] max-w-2xl leading-relaxed">
              {lang === 'fa'
                ? 'مبتنی بر نشان رسمی، الگوی هندسی و کاتالوگ فنی گروه بنای پایدار ایران‌زمین — با ساختار شبکه‌بندی سوئیسی، تایپوگرافی دوزبانه (فارسی RTL / انگلیسی LTR) و مشخصات دقیق دسکتاپ، تبلت و موبایل.'
                : 'Grounded directly in the official ISB stepped emblem, geometric pattern, and Mashhad technical catalogue — engineered with Swiss grid discipline across Desktop (1440px), Tablet (768px), and Mobile (390px).'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <IsbButton variant="secondary" size="sm" onClick={toggleLang}>
              {lang === 'fa' ? 'Switch to English (LTR)' : 'تغییر به فارسی (RTL)'}
            </IsbButton>
            <IsbButton variant="primary" size="sm" onClick={() => navigate('/')}>
              {lang === 'fa' ? 'مشاهده هیرو سه‌بعدی' : 'View 3D Hero'}
            </IsbButton>
          </div>
        </div>
      </section>

      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-20 pt-14">
        {/* 01. OFFICIAL VISUAL IDENTITY & LOGO SYSTEM */}
        <section className="space-y-6 pb-14 hairline-b">
          <div className="space-y-1">
            <span className="text-xs font-mono-tech text-[#027A3B] font-semibold">01 · BRAND IDENTITY</span>
            <h2 className="text-2xl font-bold">
              {lang === 'fa' ? 'هویت بصری رسمی و نشان هندسی ISB' : 'Official Visual Identity & Geometric Emblem'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Positive Brand Lockup */}
            <div className="bg-white border border-black/10 rounded-xl p-8 flex flex-col justify-between gap-6">
              <div className="text-xs font-mono-tech text-[#525C6E]">
                POSITIVE LOCKUP · #223981 ON #FFFFFF
              </div>
              <div className="py-4 flex items-center justify-center bg-[#FAFBFD] border border-black/5 rounded-lg">
                <IsbLogo variant="horizontal" tone="brand" />
              </div>
              <p className="text-xs text-[#525C6E] leading-relaxed">
                {lang === 'fa'
                  ? 'حداقل ارتفاع دیجیتال ۲۴ پیکسل · حریم امن برابر با ضخامت ساقه مرکزی نشان.'
                  : 'Minimum digital height 24px · Clear space equal to central stem width around all four sides.'}
              </p>
            </div>

            {/* Reversed Dark Navy Lockup */}
            <div className="bg-[#0B1536] text-white border border-white/10 rounded-xl p-8 flex flex-col justify-between gap-6">
              <div className="text-xs font-mono-tech text-[#4ADE80]">
                REVERSED LOCKUP · #FFFFFF ON #0B1536
              </div>
              <div className="py-4 flex items-center justify-center bg-[#07102B] border border-white/10 rounded-lg">
                <IsbLogo variant="stacked" tone="white" />
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {lang === 'fa'
                  ? 'نمای معکوس سفید روی سرمه‌ای معماری برای هدر صفحه اصلی، فوتر و کارت‌های تاریک.'
                  : 'Reversed white lockup over architectural deep navy for hero headers, footers, and dark telemetry frames.'}
              </p>
            </div>

            {/* Official Brand Pattern */}
            <div className="bg-[#223981] text-white border border-white/10 rounded-xl p-8 flex flex-col justify-between gap-6 overflow-hidden relative">
              <div className="text-xs font-mono-tech text-white/80">
                OFFICIAL PATTERN · #03A54E ON #223981
              </div>
              <div className="h-24 rounded-lg overflow-hidden border border-white/15 bg-[#1E3980]">
                <img
                  src="/images/brand/isb-pattern-green-on-blue.webp"
                  alt="Official ISB green-on-blue architectural pattern"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                {lang === 'fa'
                  ? 'الگوی هندسی رسمی برگرفته از پترن کاتالوگ برای جلد اسناد و جداکننده‌های برند.'
                  : 'Authentic repeating architectural monogram pattern preserved directly from the brand manual.'}
              </p>
            </div>
          </div>
        </section>

        {/* 02. DESIGN TOKENS & COLOR VARIABLES */}
        <section className="space-y-6 pb-14 hairline-b">
          <div className="space-y-1">
            <span className="text-xs font-mono-tech text-[#027A3B] font-semibold">
              02 · COLOR VARIABLES (60-30-10 BUDGET)
            </span>
            <h2 className="text-2xl font-bold">
              {lang === 'fa' ? 'متغیرهای رنگ و نظام کنتراست' : 'Color Variables & Contrast Discipline'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ISB_DESIGN_TOKENS.colors.brand).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => copyToken(item.hex)}
                className="bg-white border border-black/10 rounded-xl p-4 flex items-start gap-4 text-start hover:border-[#223981]/40 isb-transition cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-lg shrink-0 border border-black/10"
                  style={{ backgroundColor: item.hex }}
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold font-mono-tech text-[#141923]">
                      {item.hex}
                    </span>
                    <span className="text-[11px] font-mono-tech text-[#525C6E] inline-flex items-center gap-1">
                      {copiedHex === item.hex ? (
                        <Check className="w-3 h-3 text-[#03A54E]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copiedHex === item.hex ? 'Copied' : 'Copy'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#223981]">{key}</p>
                  <p className="text-xs text-[#525C6E] leading-relaxed">{item.role}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Neutrals & Semantic Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {Object.entries(ISB_DESIGN_TOKENS.colors.semantic).map(([k, s]) => (
              <div
                key={k}
                className="p-4 rounded-xl border border-black/10 bg-white space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tech uppercase text-[#525C6E]">{k}</span>
                  <span className="text-xs font-mono-tech font-bold" style={{ color: s.hex }}>
                    {s.hex}
                  </span>
                </div>
                <div
                  className="px-2.5 py-1.5 rounded text-xs font-semibold"
                  style={{ backgroundColor: s.bg, color: s.text }}
                >
                  {s.labelEn}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 03. TYPOGRAPHY HIERARCHY */}
        <section className="space-y-6 pb-14 hairline-b">
          <div className="space-y-1">
            <span className="text-xs font-mono-tech text-[#027A3B] font-semibold">
              03 · TYPOGRAPHY HIERARCHY (2+1 SYSTEM)
            </span>
            <h2 className="text-2xl font-bold">
              {lang === 'fa'
                ? 'تایپوگرافی سوئیسی دوزبانه (Vazirmatn + Plus Jakarta Sans + JetBrains Mono)'
                : 'Bilingual Swiss Typography Scale'}
            </h2>
          </div>

          <div className="bg-white border border-black/10 rounded-xl divide-y divide-black/10 overflow-hidden">
            {ISB_DESIGN_TOKENS.typography.scale.map((row) => (
              <div
                key={row.token}
                className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
              >
                <div className="lg:col-span-3 space-y-0.5">
                  <div className="text-xs font-mono-tech font-bold text-[#223981]">
                    {row.token}
                  </div>
                  <div className="text-xs text-[#525C6E]">{row.role}</div>
                </div>
                <div className="lg:col-span-4 font-mono-tech text-xs text-[#525C6E] space-y-0.5">
                  <div>Desktop: {row.desktop}</div>
                  <div>
                    Tablet: {row.tablet} · Mobile: {row.mobile}
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <div
                    className="text-[#141923] truncate"
                    style={{
                      fontSize:
                        row.token === 'display-hero'
                          ? '2rem'
                          : row.token === 'heading-1'
                          ? '1.75rem'
                          : row.token === 'heading-2'
                          ? '1.375rem'
                          : row.token === 'heading-3'
                          ? '1.125rem'
                          : row.token === 'meta-caption'
                          ? '0.75rem'
                          : '1rem',
                      fontWeight: Number(row.weight),
                      lineHeight: 1.3,
                    }}
                  >
                    {lang === 'fa'
                      ? 'طراحی پایدار و مهندسی هوشمند ساختمان'
                      : 'Integrated Architecture & Building Intelligence'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 04. RESPONSIVE GRID SPECIFICATIONS (DESKTOP 1440 / TABLET 768 / MOBILE 390) */}
        <section className="space-y-6 pb-14 hairline-b">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono-tech text-[#027A3B] font-semibold">
                04 · RESPONSIVE GRID SPECS
              </span>
              <h2 className="text-2xl font-bold">
                {lang === 'fa'
                  ? 'مشخصات شبکه‌بندی دسکتاپ، تبلت و موبایل'
                  : 'Desktop (1440px), Tablet (768px) & Mobile (390px) Grid'}
              </h2>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#F2F4F8] rounded-lg border border-black/10">
              {[
                { id: 'desktop' as const, icon: Monitor, label: 'Desktop 1440' },
                { id: 'tablet' as const, icon: Tablet, label: 'Tablet 768' },
                { id: 'mobile' as const, icon: Smartphone, label: 'Mobile 390' },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setViewportMode(v.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                      viewportMode === v.id
                        ? 'bg-white text-[#223981] shadow-xs'
                        : 'text-[#525C6E] hover:text-[#141923]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono-tech text-[#525C6E]">
              <span>Breakpoint: {activeGrid.breakpoint}</span>
              <span>·</span>
              <span>Columns: {activeGrid.columns}</span>
              <span>·</span>
              <span>Gutter: {activeGrid.gutter}</span>
              <span>·</span>
              <span>Outer Margin: {activeGrid.outerMargin}</span>
              <span>·</span>
              <span>Nav Height: {activeGrid.navHeight}</span>
            </div>

            <div
              className="mx-auto border border-[#223981]/25 bg-[#FAFBFD] rounded-lg p-4 transition-all"
              style={{
                maxWidth:
                  viewportMode === 'mobile'
                    ? '390px'
                    : viewportMode === 'tablet'
                    ? '768px'
                    : '100%',
              }}
            >
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: colCount }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-24 rounded bg-[#223981]/10 border border-[#223981]/20 flex items-center justify-center text-[11px] font-mono-tech text-[#223981] font-semibold"
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 05. NAVIGATION & BUTTONS */}
        <section className="space-y-8 pb-14 hairline-b">
          <div className="space-y-1">
            <span className="text-xs font-mono-tech text-[#027A3B] font-semibold">
              05 · NAVIGATION & BUTTONS
            </span>
            <h2 className="text-2xl font-bold">
              {lang === 'fa' ? 'ساختار ناوبری سه‌بخشی و دکمه‌های استاندارد' : '3-Zone Navigation Contract & Button Matrix'}
            </h2>
          </div>

          {/* Navigation Specimens */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0B1536] text-white px-6 h-16 flex items-center justify-between gap-6">
              <IsbLogo tone="white" />
              <div className="hidden md:flex items-center gap-6 text-xs font-medium text-white/85">
                <span className="border-b-2 border-[#03A54E] py-1 text-white">Projects</span>
                <span>Departments</span>
                <span>Services</span>
                <span>Academy</span>
                <span>About</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 text-xs border border-white/20 rounded-md">EN / فا</span>
                <span className="px-4 py-2 text-xs font-semibold bg-[#027D3D] rounded-md">Contact</span>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-black/10 bg-white text-[#141923] px-6 h-16 flex items-center justify-between gap-6">
              <IsbLogo tone="brand" />
              <div className="hidden md:flex items-center gap-6 text-xs font-medium text-[#141923]/80">
                <span className="border-b-2 border-[#223981] py-1 text-[#223981]">Projects</span>
                <span>Departments</span>
                <span>Services</span>
                <span>Academy</span>
                <span>About</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 text-xs border border-black/15 rounded-md">EN / فا</span>
                <span className="px-4 py-2 text-xs font-semibold bg-[#223981] text-white rounded-md">
                  Contact
                </span>
              </div>
            </div>
          </div>

          {/* Button Matrix */}
          <div className="bg-white border border-black/10 rounded-xl p-6 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <IsbButton variant="primary" size="lg">Primary Brand (lg)</IsbButton>
              <IsbButton variant="accent" size="md">Sustainability CTA (md)</IsbButton>
              <IsbButton variant="secondary" size="md">Secondary Outline</IsbButton>
              <IsbButton variant="ghost" size="sm">Editorial Ghost (sm)</IsbButton>
              <IsbButton variant="danger" size="sm">Refund / Destructive</IsbButton>
              <IsbButton variant="primary" disabled>Disabled State</IsbButton>
            </div>
          </div>
        </section>

        {/* 06. PROJECT CARDS & COURSE CARDS */}
        <section className="space-y-6 pb-14 hairline-b">
          <div className="space-y-1">
            <span className="text-xs font-mono-tech text-[#027A3B] font-semibold">
              06 · PROJECT & COURSE CARDS
            </span>
            <h2 className="text-2xl font-bold">
              {lang === 'fa' ? 'کارت پروژه معماری و کارت دوره آکادمی' : 'Project Monograph & Academy Course Cards'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {sampleProject && (
              <IsbProjectCard
                project={sampleProject}
                lang={lang}
                onSelect={(slug) => navigate(`/projects/${slug}`)}
              />
            )}
            {sampleCourse && (
              <IsbCourseCard
                course={sampleCourse}
                lang={lang}
                priceLabel={formatPrice(sampleCourse.priceToman)}
                onView={(slug) => navigate(`/academy/${slug}`)}
                onAction={() => navigate(`/academy/${sampleCourse.slug}`)}
              />
            )}
          </div>
        </section>

        {/* 07. FORMS & VALIDATION */}
        <section className="space-y-6 pb-14 hairline-b">
          <div className="space-y-1">
            <span className="text-xs font-mono-tech text-[#027A3B] font-semibold">
              07 · PRECISION FORMS & VALIDATION
            </span>
            <h2 className="text-2xl font-bold">
              {lang === 'fa' ? 'فرم‌ها، فیلدهای ورودی و بازخورد خطا' : 'Form Inputs, Selectors & Semantic Alerts'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-black/10 rounded-xl p-6 lg:p-8">
            <div className="space-y-4">
              <IsbField
                label={lang === 'fa' ? 'ایمیل مهندسی (حالت استاندارد)' : 'Engineering Email (Default)'}
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                ltr
                hint={lang === 'fa' ? 'اطلاعات تایید به این نشانی ارسال می‌شود.' : 'Verification codes are dispatched here.'}
              />
              <IsbField
                label={lang === 'fa' ? 'شماره تماس (نمونه خطای اعتبارسنجی)' : 'Phone Number (Validation Error State)'}
                defaultValue="0915"
                ltr
                error={
                  formErrorDemo
                    ? lang === 'fa'
                      ? 'شماره تماس باید حداقل ۱۱ رقم معتبر باشد.'
                      : 'Enter a valid 11-digit phone number.'
                    : undefined
                }
              />
              <IsbSelect label={lang === 'fa' ? 'دپارتمان تخصصی' : 'Engineering Department'}>
                <option>Department A — Architecture & Sustainable Design</option>
                <option>Department B — Energy & Building Systems</option>
                <option>Department C — Structural & Earthquake Design</option>
              </IsbSelect>
              <IsbButton
                size="sm"
                variant="secondary"
                onClick={() => setFormErrorDemo((v) => !v)}
              >
                {lang === 'fa' ? 'تغییر وضعیت خطا' : 'Toggle Error State'}
              </IsbButton>
            </div>

            <div className="space-y-3">
              <IsbStatusNotice tone="success" title={lang === 'fa' ? 'تأیید تراکنش' : 'Payment Verified'}>
                {lang === 'fa'
                  ? 'دسترسی کامل به سرفصل‌ها و فایل‌های شبیه‌سازی فعال شد.'
                  : 'Enrollment unlocked and receipt ID generated.'}
              </IsbStatusNotice>
              <IsbStatusNotice tone="warning" title={lang === 'fa' ? 'درگاه آزمایشی زرین‌پال' : 'Zarinpal Sandbox Mode'}>
                {lang === 'fa'
                  ? 'در انتظار تنظیم کد پذیرنده تجاری برای تراکنش واقعی.'
                  : 'Running deterministic server-verified sandbox flow until merchant key is supplied.'}
              </IsbStatusNotice>
              <IsbStatusNotice tone="error" title={lang === 'fa' ? 'خطای احراز هویت' : 'Authentication Notice'}>
                {lang === 'fa'
                  ? 'کد تأیید نامعتبر یا منقضی شده است.'
                  : 'Verification code is invalid or expired.'}
              </IsbStatusNotice>
              <IsbStatusNotice tone="info" title={lang === 'fa' ? 'دپارتمان سازه (CMS)' : 'Department C Notice'}>
                {lang === 'fa'
                  ? 'اطلاعات تیم و پروژه‌های سازه از طریق پنل مدیریت به‌روزرسانی می‌شود.'
                  : 'Department C team and structural case studies are managed exclusively via Admin CMS.'}
              </IsbStatusNotice>
            </div>
          </div>
        </section>

        {/* 08. AUTHENTICATION, DASHBOARD & CHECKOUT COMPONENT ARCHITECTURE */}
        <section className="space-y-8">
          <div className="space-y-1">
            <span className="text-xs font-mono-tech text-[#027A3B] font-semibold">
              08 · AUTH, DASHBOARD & CHECKOUT COMPONENTS
            </span>
            <h2 className="text-2xl font-bold">
              {lang === 'fa'
                ? 'کامپوننت‌های احراز هویت، داشبورد آموزشی و تسویه حساب'
                : 'Authentication, Student Dashboard & Checkout Specs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Authentication Screen Spec */}
            <div className="lg:col-span-5 bg-white border border-black/10 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech font-bold text-[#223981]">
                  AUTH SCREEN COMPONENT
                </span>
                <Lock className="w-4 h-4 text-[#525C6E]" />
              </div>

              <div className="grid grid-cols-4 gap-1 p-1 bg-[#F2F4F8] rounded-lg">
                {(['login', 'register', 'verify', 'reset'] as const).map((tKey) => (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setAuthTab(tKey)}
                    className={`py-1.5 text-[11px] font-semibold rounded-md capitalize cursor-pointer ${
                      authTab === tKey ? 'bg-white text-[#223981]' : 'text-[#525C6E]'
                    }`}
                  >
                    {tKey}
                  </button>
                ))}
              </div>

              {authTab === 'login' && (
                <div className="space-y-3">
                  <IsbField label="Email" defaultValue="student@isb.group" ltr />
                  <IsbField label="Password" type="password" defaultValue="••••••••••" ltr />
                  <IsbButton fullWidth variant="primary">Sign In</IsbButton>
                </div>
              )}
              {authTab === 'register' && (
                <div className="space-y-3">
                  <IsbField label="Full Name" defaultValue="مهندس سارا رضایی" />
                  <IsbField label="Email" defaultValue="engineer@studio.ir" ltr />
                  <IsbField label="Phone" defaultValue="09151234567" ltr />
                  <IsbButton fullWidth variant="accent">Create Account</IsbButton>
                </div>
              )}
              {authTab === 'verify' && (
                <div className="space-y-3">
                  <IsbStatusNotice tone="info">Enter 6-digit email verification code.</IsbStatusNotice>
                  <IsbField label="Verification Code" defaultValue="482910" ltr />
                  <IsbButton fullWidth variant="primary">Verify Email</IsbButton>
                </div>
              )}
              {authTab === 'reset' && (
                <div className="space-y-3">
                  <IsbField label="Registered Email" defaultValue="student@isb.group" ltr />
                  <IsbField label="Reset Token" defaultValue="A7F2C91B" ltr />
                  <IsbButton fullWidth variant="primary">Update Password</IsbButton>
                </div>
              )}
            </div>

            {/* Dashboard & Checkout Spec */}
            <div className="lg:col-span-7 space-y-6">
              {/* Dashboard Progress + Certificate Specimen */}
              <div className="bg-white border border-black/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono-tech font-bold text-[#223981]">
                      DASHBOARD MODULE & CERTIFICATE SPEC
                    </div>
                    <h3 className="text-base font-bold mt-1">
                      {lang === 'fa' ? 'شبیه‌سازی انرژی در DesignBuilder' : 'DesignBuilder & Chapter 19 Energy Simulation'}
                    </h3>
                  </div>
                  <span className="text-sm font-bold font-mono-tech text-[#027A3B] tabular-nums">
                    {Math.round((checkedMod.length / 3) * 100)}%
                  </span>
                </div>

                <div className="w-full h-2 bg-[#F2F4F8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#03A54E] transition-all"
                    style={{ width: `${Math.round((checkedMod.length / 3) * 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    '01. Weather & Climate',
                    '02. Dynamic Modeling',
                    '03. EC Grade Reporting',
                  ].map((label, idx) => {
                    const done = checkedMod.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setCheckedMod((prev) =>
                            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                          )
                        }
                        className={`p-2.5 rounded-lg border text-start flex items-center gap-2 text-xs cursor-pointer ${
                          done
                            ? 'bg-[#03A54E]/10 border-[#03A54E]/30 text-[#141923]'
                            : 'bg-[#FAFBFD] border-black/10 text-[#525C6E]'
                        }`}
                      >
                        {done ? (
                          <CheckSquare className="w-4 h-4 text-[#03A54E] shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 shrink-0" />
                        )}
                        <span className="font-medium truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-black/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-[#223981]">
                    <Award className="w-4 h-4 text-[#03A54E]" />
                    <span>CERT CODE: ISB-CERT-4A9F2C</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-[#525C6E]">
                    <Receipt className="w-4 h-4" />
                    <span>ORDER: ISB-M82K-419 · PAID</span>
                  </div>
                </div>
              </div>

              {/* Checkout Stepper + Gateway Specimen */}
              <div className="bg-white border border-black/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tech font-bold text-[#223981]">
                    CHECKOUT & ZARINPAL GATEWAY SPEC
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#03A54E]" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono-tech">
                  <div className="p-2 rounded bg-[#223981] text-white font-semibold">01 · Cart Review</div>
                  <div className="p-2 rounded bg-[#027D3D] text-white font-semibold">02 · Sandbox Pay</div>
                  <div className="p-2 rounded bg-[#F2F4F8] text-[#525C6E]">03 · Receipt & Unlock</div>
                </div>

                <div className="p-4 rounded-lg bg-[#FAFBFD] border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono-tech text-[#525C6E]">
                      AUTHORITY: A00000000000000000000000000041C9A2
                    </div>
                    <div className="text-sm font-bold text-[#141923] mt-0.5 tabular-nums">
                      {formatPrice(2800000)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <IsbButton size="sm" variant="accent">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Confirm Paid</span>
                    </IsbButton>
                    <IsbButton size="sm" variant="danger">Simulate Fail</IsbButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
