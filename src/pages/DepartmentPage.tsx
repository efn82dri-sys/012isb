import React from 'react';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, uiText } from '../i18n/translations';
import { DepartmentId } from '../types/isb';
import { SafeImage } from '../components/SafeImage';

interface DepartmentPageProps {
  slug: string;
}

export const DepartmentPage: React.FC<DepartmentPageProps> = ({ slug }) => {
  const { lang, departments, services, team, projects, navigate } = useApp();
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  const dept = departments.find((d) => d.id === (slug as DepartmentId)) || departments[0];
  const deptServices = services.filter((s) => s.department === dept.id);
  const deptTeam = team.filter(
    (m) => m.department === dept.id || (dept.id === 'energy' && (m.id === 'sara-atashi' || m.isAdvisor))
  );
  const deptProjects = projects.filter((p) => p.departments.includes(dept.id));

  return (
    <div className="pt-24 pb-20 bg-[#FAFBFD]">
      <section className="bg-[#0B1536] text-white py-16 lg:py-20">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-5">
          <div className="flex items-center gap-3 text-xs text-[#4ADE80]">
            <span>{lang === 'fa' ? 'دپارتمان تخصصی' : 'Department'}</span>
            <span>·</span>
            <span className="font-mono-tech">{dept.index}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold">{t(dept.title, lang)}</h1>
          <p className="text-base lg:text-lg text-white/80 max-w-3xl leading-relaxed">
            {t(dept.description, lang)}
          </p>

          {/* Department switcher */}
          <div className="pt-4 flex flex-wrap gap-2">
            {departments.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => navigate(`/departments/${d.id}`)}
                className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  d.id === dept.id
                    ? 'bg-[#027D3D] text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {d.index}. {t(d.title, lang)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 py-14 space-y-16">
        {dept.cmsNotice && (
          <div className="p-5 rounded-lg bg-white border border-[#223981]/25 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#223981] shrink-0 mt-0.5" />
            <div className="text-sm text-[#141923] leading-relaxed">
              <p>{t(dept.cmsNotice, lang)}</p>
            </div>
          </div>
        )}

        {/* Core Capabilities */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#141923]">
            {lang === 'fa' ? 'حوزه‌های تخصصی و خدمات کلیدی' : 'Core Capabilities'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dept.capabilities.map((cap, i) => (
              <div
                key={i}
                className="p-5 bg-white border border-black/10 rounded-lg flex items-start gap-3"
              >
                <span className="font-mono-tech text-xs text-[#223981] font-semibold mt-0.5">
                  0{i + 1}
                </span>
                <span className="text-sm font-medium text-[#141923]">{t(cap, lang)}</span>
              </div>
            ))}
          </div>

          {deptServices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {deptServices.map((srv) => (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => navigate(`/services/${srv.slug}`)}
                  className="text-start p-5 bg-[#F2F4F8] hover:bg-white border border-black/10 rounded-lg transition-colors cursor-pointer space-y-2"
                >
                  <div className="text-xs font-mono-tech text-[#027A3B]">{srv.index}</div>
                  <div className="text-base font-bold text-[#141923]">{t(srv.title, lang)}</div>
                  <p className="text-xs text-[#525C6E] leading-relaxed">
                    {t(srv.shortDescription, lang)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Department Team */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#141923]">
            {lang === 'fa' ? 'اعضای تخصصی دپارتمان' : 'Department Specialists'}
          </h2>
          {deptTeam.length === 0 ? (
            <div className="p-8 bg-white border border-dashed border-black/20 rounded-lg text-center space-y-3">
              <p className="text-sm text-[#525C6E]">
                {lang === 'fa'
                  ? 'در حال حاضر پروفایل مهندسین این دپارتمان در انتظار ثبت از طریق پنل مدیریت (CMS) است.'
                  : 'Team profiles for this department are managed via the Admin CMS and currently empty.'}
              </p>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#223981] text-white text-xs font-semibold cursor-pointer"
              >
                {lang === 'fa' ? 'مدیریت در پنل CMS' : 'Manage in Admin CMS'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptTeam.map((m) => (
                <div key={m.id} className="bg-white border border-black/10 rounded-lg p-6 space-y-2">
                  <div className="text-xs font-semibold text-[#027A3B]">{t(m.role, lang)}</div>
                  <h3 className="text-lg font-bold text-[#141923]">{t(m.name, lang)}</h3>
                  <p className="text-xs text-[#525C6E] leading-relaxed">{t(m.bio, lang)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Department Projects */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#141923]">
            {lang === 'fa' ? 'پروژه‌های مرتبط دپارتمان' : 'Relevant Department Projects'}
          </h2>
          {deptProjects.length === 0 ? (
            <div className="p-8 bg-white border border-dashed border-black/20 rounded-lg text-center space-y-3">
              <p className="text-sm text-[#525C6E]">
                {lang === 'fa'
                  ? 'پروژه‌های سازه‌ای از طریق پنل مدیریت (CMS) قابل افزودن هستند.'
                  : 'Structural engineering projects can be published through the Admin CMS.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deptProjects.map((p) => (
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
                  <div className="p-5 space-y-2">
                    <div className="text-xs font-mono-tech text-[#525C6E]">
                      {p.indexNumber} · {p.year}
                    </div>
                    <h3 className="text-base font-bold text-[#141923] group-hover:text-[#223981]">
                      {t(p.title, lang)}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#223981]">
                      {t(uiText.common.readMore, lang)}
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="p-8 rounded-xl bg-[#223981] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">
              {lang === 'fa' ? `مشاوره تخصصی با دپارتمان ${t(dept.title, lang)}` : `Consult with ${t(dept.title, lang)}`}
            </h3>
            <p className="text-sm text-white/80">
              {lang === 'fa'
                ? 'اطلاعات پروژه خود را برای ارزیابی اولیه ارسال کنید.'
                : 'Share your project scope for an engineering review.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="px-6 py-3 rounded-md bg-[#027D3D] text-white text-sm font-semibold hover:bg-[#026832] cursor-pointer shrink-0"
          >
            {t(uiText.home.ctaButton, lang)}
          </button>
        </section>
      </div>
    </div>
  );
};
