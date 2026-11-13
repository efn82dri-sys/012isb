import React from 'react';
import { Award, Building2, CheckCircle2, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { SERO_SABZ_TIERS, SERO_SABZ_WEIGHTS } from '../data/isbCatalogue';
import { SafeImage } from '../components/SafeImage';

export const AboutPage: React.FC = () => {
  const { lang, team, navigate } = useApp();

  const ceo = team.find((m) => m.id === 'sara-atashi');
  const coreTeam = team.filter((m) => !m.isAdvisor && m.id !== 'sara-atashi');
  const advisors = team.filter((m) => m.isAdvisor);

  return (
    <div className="pt-24 pb-20 bg-[#FAFBFD]">
      {/* Header */}
      <section className="max-w-[1360px] mx-auto px-6 lg:px-10 pb-16 hairline-b">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs text-[#223981] font-semibold">
            {lang === 'fa' ? 'درباره گروه ساختمانی بنای پایدار ایران‌زمین' : 'About ISB Group'}
          </p>
          <h1 className="text-3xl lg:text-5xl font-bold text-[#141923] leading-tight text-balance">
            {lang === 'fa'
              ? 'پیوند یکپارچه میان معماری، دانش انرژی و عملکرد مهندسی ساختمان'
              : 'Connecting Architectural Creativity with Building Physics & Engineering Precision'}
          </h1>
          <p className="text-base lg:text-lg text-[#525C6E] leading-relaxed">
            {lang === 'fa'
              ? 'گروه ساختمانی بنای پایدار ایران‌زمین در سال ۱۳۹۹، با پشتوانه بیش از دو دهه تجربه در حوزه معماری، طراحی و اجرای نما و دکوراسیون داخلی و با هدف ایجاد پیوندی یکپارچه میان معماری، انرژی و عملکرد ساختمان تأسیس شد.'
              : 'Founded in 2020 (1399 SH) on more than two decades of architectural, façade, and interior practice, Iran Sustainable Building Group (ISB) serves property owners, developers, and architects with simulation-backed consultancy.'}
          </p>
        </div>
      </section>

      {/* Approach, Vision & Philosophy */}
      <section className="max-w-[1360px] mx-auto px-6 lg:px-10 py-16 hairline-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-lg border border-black/10 space-y-4">
            <div className="flex items-center gap-2.5 text-[#223981]">
              <Building2 className="w-5 h-5" />
              <h2 className="text-xl font-bold text-[#141923]">
                {lang === 'fa' ? 'رویکرد اجرایی ISB' : 'Our Engineering Approach'}
              </h2>
            </div>
            <p className="text-sm text-[#525C6E] leading-relaxed">
              {lang === 'fa'
                ? 'رویکرد گروه بنای پایدار بر ارزیابی جامع پروژه‌ها از مرحله طراحی تا بهره‌برداری، انطباق با الزامات مقررات ملی ساختمان و ارائه راهکارهای اجرایی برای ارتقای عملکرد انرژی، آسایش حرارتی و بصری، کیفیت محیط داخلی و پایداری پوسته ساختمان استوار است. گزینه‌های مختلف طراحی به‌صورت کمی بررسی شده و نتایج در قالب گزارش‌های فنی و قابل‌فهم در اختیار کارفرما قرار می‌گیرد.'
                : 'Our methodology spans schematic design through operations—evaluating compliance with national codes and quantifying energy, thermal/visual comfort, indoor environmental quality, and envelope durability so every decision rests on verified engineering data.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-black/10 space-y-4">
            <div className="flex items-center gap-2.5 text-[#03A54E]">
              <Award className="w-5 h-5" />
              <h2 className="text-xl font-bold text-[#141923]">
                {lang === 'fa' ? 'چشم‌انداز و مأموریت' : 'Vision & Mission'}
              </h2>
            </div>
            <p className="text-sm text-[#525C6E] leading-relaxed">
              {lang === 'fa'
                ? 'چشم‌انداز گروه بنای پایدار، توسعه نظام ارزیابی، ممیزی و رتبه‌بندی ساختمان‌ها بر اساس میزان انطباق با مقررات ملی ساختمان، ضوابط بالادستی، معیارهای ساختمان سبز و استانداردهای معتبر بین‌المللی پایداری است.'
                : 'Our vision is to advance systematic building auditing, simulation, and green rating across Iran’s construction industry—aligning national building codes and Sero Sabz benchmarks with global sustainability standards.'}
            </p>
          </div>
        </div>
      </section>

      {/* Leadership & Team */}
      <section className="max-w-[1360px] mx-auto px-6 lg:px-10 py-16 hairline-b space-y-12">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-[#223981]" />
          <h2 className="text-2xl lg:text-3xl font-bold text-[#141923]">
            {lang === 'fa' ? 'مدیریت و تیم تخصصی معماری و انرژی' : 'Leadership & Core Team'}
          </h2>
        </div>

        {ceo && (
          <div className="bg-white border border-black/10 rounded-xl p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#223981]/20 shrink-0 bg-[#132152]">
              <SafeImage
                src={ceo.photo}
                alt={t(ceo.name, lang)}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#027A3B]">{t(ceo.role, lang)}</div>
              <h3 className="text-2xl font-bold text-[#141923]">{t(ceo.name, lang)}</h3>
              <p className="text-sm text-[#525C6E] leading-relaxed max-w-3xl">
                {t(ceo.bio, lang)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreTeam.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-black/10 rounded-lg p-6 space-y-2.5"
            >
              <div className="text-xs font-semibold text-[#223981]">{t(member.role, lang)}</div>
              <h3 className="text-lg font-bold text-[#141923]">{t(member.name, lang)}</h3>
              <p className="text-xs text-[#525C6E] leading-relaxed">{t(member.bio, lang)}</p>
            </div>
          ))}
        </div>

        {/* Scientific Advisors */}
        <div className="pt-6 space-y-6">
          <h3 className="text-xl font-bold text-[#141923]">
            {lang === 'fa' ? 'تیم مشاور علمی (مرکز تحقیقات راه، مسکن و شهرسازی)' : 'Scientific Advisory Board'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advisors.map((adv) => (
              <div
                key={adv.id}
                className="bg-[#0B1536] text-white rounded-lg p-6 space-y-2.5"
              >
                <div className="text-xs font-semibold text-[#4ADE80]">{t(adv.role, lang)}</div>
                <h4 className="text-lg font-bold">{t(adv.name, lang)}</h4>
                <p className="text-xs text-white/75 leading-relaxed">{t(adv.bio, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sero Sabz Framework Summary */}
      <section className="max-w-[1360px] mx-auto px-6 lg:px-10 py-16 space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#141923]">
            {lang === 'fa' ? 'استاندارد سرو سبز و سطوح رتبه‌بندی' : 'Sero Sabz Rating Tiers & Domains'}
          </h2>
          <p className="text-sm text-[#525C6E]">
            {lang === 'fa'
              ? 'نظام ارزیابی ساختمان‌های سبز ایران در چهار سطح امتیازی و هشت حوزه تخصصی.'
              : 'Four certification tiers across eight weighted sustainability domains.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERO_SABZ_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="bg-white border border-black/10 rounded-lg p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-[#141923]">{t(tier.title, lang)}</span>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tier.color }}
                  aria-hidden="true"
                />
              </div>
              <p className="text-xs font-mono-tech font-semibold text-[#223981]">
                {t(tier.score, lang)}
              </p>
              <p className="text-xs text-[#525C6E]">{t(tier.desc, lang)}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
          {SERO_SABZ_WEIGHTS.map((w) => (
            <div
              key={w.id}
              className="p-3 bg-white border border-black/10 rounded-md text-center space-y-1"
            >
              <div className="text-lg font-bold font-mono-tech text-[#027A3B]">{w.weight}%</div>
              <div className="text-[11px] text-[#141923] font-medium">{t(w.label, lang)}</div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#223981] text-white text-sm font-semibold hover:bg-[#192b63] cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#03A54E]" />
            <span>{lang === 'fa' ? 'مشاوره ارزیابی پروژه شما' : 'Consult on Your Project'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
