import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, uiText } from '../i18n/translations';
import { SafeImage } from '../components/SafeImage';

interface ServicesPageProps {
  slug?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ slug }) => {
  const { lang, services, projects, departments, navigate } = useApp();
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  if (slug) {
    const srv = services.find((s) => s.slug === slug);
    if (!srv) {
      return (
        <div className="pt-32 pb-20 max-w-[1360px] mx-auto px-6 text-center space-y-4">
          <h1 className="text-2xl font-bold">{lang === 'fa' ? 'خدمت مورد نظر یافت نشد' : 'Service not found'}</h1>
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="px-4 py-2 rounded-md bg-[#223981] text-white text-sm cursor-pointer"
          >
            {lang === 'fa' ? 'بازگشت به فهرست خدمات' : 'All Services'}
          </button>
        </div>
      );
    }

    const dept = departments.find((d) => d.id === srv.department);
    const relatedProjects = projects.filter((p) => srv.relatedProjectSlugs.includes(p.slug));

    return (
      <div className="pt-24 pb-20 bg-[#FAFBFD]">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-12">
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="text-xs font-semibold text-[#223981] hover:underline cursor-pointer"
          >
            {lang === 'fa' ? '→ بازگشت به همه خدمات' : '← Back to All Services'}
          </button>

          <div className="bg-white border border-black/10 rounded-xl p-8 lg:p-12 space-y-6">
            <div className="flex items-center gap-3 text-xs font-mono-tech text-[#027A3B]">
              <span>{srv.index}</span>
              <span>·</span>
              <span className="font-sans text-[#223981]">{dept && t(dept.title, lang)}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#141923]">{t(srv.title, lang)}</h1>
            <p className="text-base text-[#525C6E] max-w-3xl leading-relaxed">
              {t(srv.detailedDescription, lang)}
            </p>

            <div className="pt-6 border-t border-black/10 space-y-3">
              <h2 className="text-base font-bold text-[#141923]">
                {lang === 'fa' ? 'خروجی‌ها و مستندات فنی' : 'Technical Deliverables'}
              </h2>
              <ul className="space-y-2.5">
                {srv.deliverables.map((del, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-[#141923]">
                    <CheckCircle2 className="w-4 h-4 text-[#03A54E] shrink-0" />
                    <span>{t(del, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="px-6 py-3 rounded-md bg-[#223981] text-white text-sm font-semibold hover:bg-[#192b63] cursor-pointer"
              >
                {t(uiText.home.ctaButton, lang)}
              </button>
            </div>
          </div>

          {relatedProjects.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#141923]">
                {lang === 'fa' ? 'پروژه‌های مرتبط با این خدمت' : 'Projects Applying This Service'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((p) => (
                  <article
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/projects/${p.slug}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/projects/${p.slug}`);
                      }
                    }}
                    className="bg-white border border-black/10 rounded-lg overflow-hidden cursor-pointer group isb-focus-ring"
                  >
                    <div className="aspect-[16/10] bg-[#0B1536] overflow-hidden">
                      <SafeImage
                        src={p.heroImage}
                        alt={t(p.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 space-y-1.5">
                      <div className="text-xs font-mono-tech text-[#525C6E]">
                        {p.indexNumber} · {p.year}
                      </div>
                      <h3 className="text-base font-bold text-[#141923] group-hover:text-[#223981]">
                        {t(p.title, lang)}
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#FAFBFD]">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-12">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-mono-tech text-[#223981] font-semibold">
            {t(uiText.nav.services, lang)}
          </p>
          <h1 className="text-3xl lg:text-5xl font-bold text-[#141923]">
            {lang === 'fa' ? 'خدمات تخصصی معماری، انرژی و پایداری' : 'Engineering & Architectural Services'}
          </h1>
          <p className="text-base text-[#525C6E] leading-relaxed">
            {lang === 'fa'
              ? 'مجموعه کامل خدمات مشاوره، شبیه‌سازی، بهینه‌سازی و اخذ گواهینامه‌های ملی و بین‌المللی ساختمان.'
              : 'Full-spectrum consultancy covering simulation, façade optimization, MEP systems, and national/international certifications.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <article
              key={srv.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/services/${srv.slug}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/services/${srv.slug}`);
                }
              }}
              className="bg-white border border-black/10 rounded-lg p-6 hover:border-[#223981] transition-colors cursor-pointer flex flex-col justify-between space-y-6 group isb-focus-ring"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-xs font-semibold text-[#223981]">
                    {srv.index}
                  </span>
                  <span className="text-xs text-[#027A3B] font-medium">
                    {departments.find((d) => d.id === srv.department) &&
                      t(departments.find((d) => d.id === srv.department)!.title, lang)}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#141923] group-hover:text-[#223981]">
                  {t(srv.title, lang)}
                </h2>
                <p className="text-sm text-[#525C6E] leading-relaxed">
                  {t(srv.shortDescription, lang)}
                </p>
              </div>
              <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#223981]">
                <span>{lang === 'fa' ? 'مشاهده جزئیات و پروژه‌ها' : 'Service Details'}</span>
                <ArrowIcon className="w-4 h-4" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
