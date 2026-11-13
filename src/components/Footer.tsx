import React from 'react';
import { Instagram, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/isbCatalogue';
import { t, uiText } from '../i18n/translations';
import { IsbLogo } from './IsbLogo';

export const Footer: React.FC = () => {
  const { lang, navigate, departments } = useApp();

  return (
    <footer className="bg-[#0B1536] text-white border-t border-white/10">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5 space-y-4">
            <IsbLogo tone="white" />
            <p className="text-base font-semibold text-white/95 pt-1">
              {t(uiText.brandName, lang)}
            </p>
            <p className="text-sm text-white/70 max-w-md leading-relaxed">
              {lang === 'fa'
                ? 'تلفیق تجربه معماری، دانش انرژی و شبیه‌سازی عملکرد ساختمان برای ارتقای کیفیت ساخت‌وساز و گسترش رویکردهای پایدار در صنعت ساختمان.'
                : 'Connecting architectural design, building physics, and structural engineering to deliver measurable, resilient, and sustainable buildings.'}
            </p>
            <p className="text-xs tracking-wider text-[#4ADE80] font-medium pt-1">
              Smart Solutions for Sustainable Buildings
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold text-white/50">
              {t(uiText.nav.departments, lang)}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {departments.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/departments/${d.id}`)}
                    className="text-white/80 hover:text-white transition-colors text-start cursor-pointer"
                  >
                    {t(d.title, lang)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold text-white/50">
              {lang === 'fa' ? 'دسترسی سریع' : 'Platform'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: t(uiText.nav.projects, lang), to: '/projects' },
                { label: t(uiText.nav.services, lang), to: '/services' },
                { label: t(uiText.nav.academy, lang), to: '/academy' },
                { label: t(uiText.nav.insights, lang), to: '/insights' },
                { label: t(uiText.nav.about, lang), to: '/about' },
              ].map((link) => (
                <li key={link.to}>
                  <button
                    type="button"
                    onClick={() => navigate(link.to)}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-white/50">
              {t(uiText.nav.contact, lang)}
            </h3>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#03A54E] shrink-0 mt-1" />
                <span className="leading-relaxed">{t(COMPANY_INFO.address, lang)}</span>
              </div>
              <div className="flex items-center gap-2.5 font-mono-tech" dir="ltr">
                <Phone className="w-4 h-4 text-[#03A54E] shrink-0" />
                <span>09151213005 · 09339039563</span>
              </div>
              <a
                href={COMPANY_INFO.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
                dir="ltr"
              >
                <Instagram className="w-4 h-4 text-[#03A54E]" />
                <span>{COMPANY_INFO.instagram}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/55">
          <p>
            © {new Date().getFullYear()} {t(uiText.brandName, lang)} (ISB Group)
          </p>
          <p>
            {lang === 'fa'
              ? 'تأسیس ۱۳۹۹ · مشهد، ایران'
              : 'Established 2020 (1399 SH) · Mashhad, Iran'}
          </p>
        </div>
      </div>
    </footer>
  );
};
