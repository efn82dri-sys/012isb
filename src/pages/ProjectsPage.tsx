import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, uiText } from '../i18n/translations';
import { DepartmentId, ProjectCategory } from '../types/isb';
import { SafeImage } from '../components/SafeImage';

type EnergyGradeFilter = 'all' | 'ECZn' | 'EC++' | 'EC+' | 'EC';

function getEditorialCardLayout(index: number, total: number): {
  colClass: string;
  aspectClass: string;
  isWideSpotlight: boolean;
} {
  if (total === 1) {
    return {
      colClass: 'md:col-span-12 lg:col-span-12',
      aspectClass: 'aspect-[16/9] lg:aspect-[21/9]',
      isWideSpotlight: true,
    };
  }

  if (total === 2) {
    return index === 0
      ? {
          colClass: 'md:col-span-7 lg:col-span-7',
          aspectClass: 'aspect-[16/10] lg:aspect-[16/10]',
          isWideSpotlight: true,
        }
      : {
          colClass: 'md:col-span-5 lg:col-span-5',
          aspectClass: 'aspect-[16/10] lg:aspect-[4/3]',
          isWideSpotlight: false,
        };
  }

  // Tablet layout: if total is odd, give lead plate full width on tablet so pairs below stay balanced
  const mdClass =
    total % 2 === 1
      ? index === 0
        ? 'md:col-span-12'
        : 'md:col-span-6'
      : 'md:col-span-6';

  // Desktop asymmetric editorial monograph bands
  if (index === 0) {
    return {
      colClass: `${mdClass} lg:col-span-8`,
      aspectClass: 'aspect-[16/10] lg:aspect-[16/9]',
      isWideSpotlight: true,
    };
  }
  if (index === 1) {
    return {
      colClass: `${mdClass} lg:col-span-4`,
      aspectClass: 'aspect-[16/10] lg:aspect-[4/4]',
      isWideSpotlight: false,
    };
  }

  if (total === 3 && index === 2) {
    return {
      colClass: `${mdClass} lg:col-span-12`,
      aspectClass: 'aspect-[16/10] lg:aspect-[21/9]',
      isWideSpotlight: true,
    };
  }

  if (index === 2) {
    return {
      colClass: `${mdClass} lg:col-span-5`,
      aspectClass: 'aspect-[16/10] lg:aspect-[5/4]',
      isWideSpotlight: false,
    };
  }
  if (index === 3) {
    return {
      colClass: `${mdClass} lg:col-span-7`,
      aspectClass: 'aspect-[16/10] lg:aspect-[16/10]',
      isWideSpotlight: true,
    };
  }

  // Remaining items (index >= 4): pack cleanly in 3-up or asymmetric 7+5 / 12 trailing bands
  const rem = total - 4;
  const rIdx = index - 4;
  const mod = rem % 3;

  if (mod === 1 && rIdx === rem - 1) {
    return {
      colClass: `${mdClass} lg:col-span-12`,
      aspectClass: 'aspect-[16/10] lg:aspect-[21/9]',
      isWideSpotlight: true,
    };
  }

  if (mod === 2 && rIdx >= rem - 2) {
    const isFirstOfPair = rIdx === rem - 2;
    return {
      colClass: `${mdClass} ${isFirstOfPair ? 'lg:col-span-7' : 'lg:col-span-5'}`,
      aspectClass: isFirstOfPair ? 'aspect-[16/10] lg:aspect-[16/10]' : 'aspect-[16/10] lg:aspect-[5/4]',
      isWideSpotlight: isFirstOfPair,
    };
  }

  return {
    colClass: `${mdClass} lg:col-span-4`,
    aspectClass: 'aspect-[16/10]',
    isWideSpotlight: false,
  };
}

export const ProjectsPage: React.FC = () => {
  const { lang, projects, departments, services, navigate } = useApp();
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  const [category, setCategory] = useState<'all' | ProjectCategory>('all');
  const [year, setYear] = useState<string>('all');
  const [dept, setDept] = useState<'all' | DepartmentId>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [energyGrade, setEnergyGrade] = useState<EnergyGradeFilter>('all');
  const [query, setQuery] = useState('');

  const years = useMemo(() => {
    const set = new Set(projects.map((p) => p.year).filter(Boolean));
    return Array.from(set);
  }, [projects]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    for (const p of projects) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [projects]);

  const serviceByKey = useMemo(() => {
    const map = new Map<string, (typeof services)[number]>();
    for (const s of services) {
      map.set(s.id, s);
      map.set(s.slug, s);
    }
    return map;
  }, [services]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (year !== 'all' && p.year !== year) return false;
      if (dept !== 'all' && !p.departments.includes(dept)) return false;
      if (energyGrade !== 'all' && p.energyGrade !== energyGrade) return false;
      if (serviceFilter !== 'all') {
        const targetService = serviceByKey.get(serviceFilter);
        const matchesService = p.services.some(
          (sid) =>
            sid === serviceFilter ||
            (targetService && (sid === targetService.id || sid === targetService.slug))
        );
        if (!matchesService) return false;
      }
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const linkedServicesText = p.services
          .map((sid) => {
            const s = serviceByKey.get(sid);
            return s ? `${s.title.fa} ${s.title.en}` : '';
          })
          .join(' ');
        const hay = `${p.title.fa} ${p.title.en} ${p.location.fa} ${p.location.en} ${p.architect.fa} ${p.architect.en} ${p.summary.fa} ${p.summary.en} ${linkedServicesText}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [projects, category, year, dept, serviceFilter, energyGrade, query, serviceByKey]);

  const categories: { id: 'all' | ProjectCategory; fa: string; en: string }[] = [
    { id: 'all', fa: 'همه پروژه‌ها', en: 'All Projects' },
    { id: 'residential', fa: 'مسکونی', en: 'Residential' },
    { id: 'industrial', fa: 'صنعتی', en: 'Industrial' },
    { id: 'institutional', fa: 'اداری و عمومی', en: 'Institutional' },
    { id: 'educational', fa: 'آموزشی', en: 'Educational' },
    { id: 'urban-landscape', fa: 'منظر و شهری', en: 'Urban & Landscape' },
  ];

  const hasActiveFilters =
    category !== 'all' ||
    year !== 'all' ||
    dept !== 'all' ||
    serviceFilter !== 'all' ||
    energyGrade !== 'all' ||
    query.trim().length > 0;

  const resetFilters = () => {
    setCategory('all');
    setYear('all');
    setDept('all');
    setServiceFilter('all');
    setEnergyGrade('all');
    setQuery('');
  };

  return (
    <div className="pt-24 pb-24 bg-[#FAFBFD]">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-10">
        {/* Editorial Header */}
        <header className="pb-8 border-b border-black/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 space-y-3">
            <p className="text-xs text-[#223981] font-semibold tracking-wider uppercase tabular-nums">
              <span>{t(uiText.nav.projects, lang)}</span>
              <span className="font-mono-tech"> · {projects.length}</span>
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-[#141923] leading-[1.15]">
              {lang === 'fa'
                ? 'آرشیو پروژه‌ها و مطالعات موردی'
                : 'Architectural & Engineering Case Studies'}
            </h1>
            <p className="text-base text-[#525C6E] max-w-2xl leading-relaxed">
              {lang === 'fa'
                ? 'مجموعه پروژه‌های مستندشده از کاتالوگ رسمی گروه ISB در حوزه‌های معماری، شبیه‌سازی انرژی، بهینه‌سازی پوسته و ممیزی سرو سبز.'
                : 'Verified architectural and engineering monographs from the official ISB catalogue spanning energy modeling, façade physics, and Sero Sabz certification.'}
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="text-xs text-[#525C6E] tabular-nums">
              {lang === 'fa'
                ? `نمایش ${filtered.length} از ${projects.length} مطالعه موردی`
                : `SHOWING ${filtered.length} OF ${projects.length} MONOGRAPHS`}
            </div>
          </div>
        </header>

        {/* Smart Project Discovery Filter Bar */}
        <section
          aria-label={lang === 'fa' ? 'فیلتر و جستجوی پروژه‌ها' : 'Project discovery filters'}
          className="bg-white border border-black/10 rounded-xl p-4 lg:p-6 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                      active
                        ? 'bg-[#223981] text-white'
                        : 'bg-[#F2F4F8] text-[#525C6E] hover:text-[#141923]'
                    }`}
                  >
                    <span>{lang === 'fa' ? cat.fa : cat.en}</span>
                    <span
                      className={`font-mono-tech text-[11px] tabular-nums ${
                        active ? 'text-white/75' : 'text-[#525C6E]/75'
                      }`}
                    >
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#223981] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'پاک‌کردن فیلترها' : 'Reset Filters'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-black/5">
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-[#525C6E] absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  lang === 'fa'
                    ? 'جستجو در نام پروژه، موقعیت، معمار یا خدمات...'
                    : 'Search project, location, architect, or service...'
                }
                className="w-full h-10 ps-9 pe-3 text-xs border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
              />
            </div>

            <select
              value={dept}
              onChange={(e) => setDept(e.target.value as 'all' | DepartmentId)}
              aria-label={t(uiText.nav.departments, lang)}
              className="h-10 px-3 text-xs border border-black/15 rounded-md bg-white focus:outline-none focus:border-[#223981]"
            >
              <option value="all">
                {lang === 'fa' ? 'همه دپارتمان‌ها' : 'All Departments'}
              </option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {t(d.title, lang)}
                </option>
              ))}
            </select>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              aria-label={t(uiText.nav.services, lang)}
              className="h-10 px-3 text-xs border border-black/15 rounded-md bg-white focus:outline-none focus:border-[#223981]"
            >
              <option value="all">
                {lang === 'fa' ? 'همه خدمات مهندسی' : 'All Engineering Services'}
              </option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.index} · {t(s.title, lang)}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={energyGrade}
                onChange={(e) => setEnergyGrade(e.target.value as EnergyGradeFilter)}
                aria-label={lang === 'fa' ? 'رده انرژی' : 'Energy Grade'}
                className="h-10 px-2.5 text-xs border border-black/15 rounded-md bg-white focus:outline-none focus:border-[#223981] font-mono-tech"
              >
                <option value="all">
                  {lang === 'fa' ? 'همه رده‌ها' : 'All Grades'}
                </option>
                <option value="ECZn">ECZn</option>
                <option value="EC++">EC++</option>
                <option value="EC+">EC+</option>
                <option value="EC">EC</option>
              </select>

              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                aria-label={t(uiText.common.year, lang)}
                className="h-10 px-2.5 text-xs border border-black/15 rounded-md bg-white focus:outline-none focus:border-[#223981] tabular-nums"
              >
                <option value="all">{lang === 'fa' ? 'همه سال‌ها' : 'All Years'}</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Asymmetric Editorial Monograph Grid */}
        {filtered.length === 0 ? (
          <div className="p-14 bg-white border border-black/10 rounded-xl text-center space-y-4">
            <p className="text-sm text-[#525C6E]">
              {lang === 'fa'
                ? 'پروژه‌ای با فیلترهای انتخاب‌شده یافت نشد.'
                : 'No case studies match the selected filters.'}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold cursor-pointer"
            >
              {lang === 'fa' ? 'نمایش همه پروژه‌ها' : 'Show All Projects'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-7">
            {filtered.map((proj, idx) => {
              const layout = getEditorialCardLayout(idx, filtered.length);
              const primaryMetric = proj.metrics[0];
              const categoryMeta = categories.find((c) => c.id === proj.category);

              return (
                <article
                  key={proj.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/projects/${proj.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/projects/${proj.slug}`);
                    }
                  }}
                  className={`${layout.colClass} bg-white border border-black/10 rounded-xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-colors hover:border-[#223981]/40 isb-focus-ring`}
                >
                  <div>
                    <div className={`${layout.aspectClass} bg-[#0B1536] overflow-hidden relative`}>
                      <SafeImage
                        src={proj.heroImage}
                        alt={t(proj.title, lang)}
                        priority={idx === 0}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>

                    <div className={`${layout.isWideSpotlight ? 'p-6 lg:p-8' : 'p-6'} space-y-3`}>
                      {/* Unboxed Swiss Metadata Line */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#525C6E] tabular-nums">
                        <span className="font-mono-tech font-semibold text-[#223981]">{proj.indexNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tech">{proj.year}</span>
                        {categoryMeta && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>
                              {lang === 'fa' ? categoryMeta.fa : categoryMeta.en}
                            </span>
                          </>
                        )}
                        {proj.energyGrade && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tech text-[#027A3B] font-bold">{proj.energyGrade}</span>
                          </>
                        )}
                        {proj.seroSabzTier && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#8A6914] font-semibold">
                              {t(proj.seroSabzTier, lang)}
                            </span>
                          </>
                        )}
                      </div>

                      <h2
                        className={`${
                          layout.isWideSpotlight ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl'
                        } font-bold text-[#141923] group-hover:text-[#223981] transition-colors text-balance`}
                      >
                        {t(proj.title, lang)}
                      </h2>

                      <p className="text-xs text-[#525C6E]">{t(proj.location, lang)}</p>

                      <p
                        className={`text-sm text-[#525C6E] leading-relaxed ${
                          layout.isWideSpotlight ? 'line-clamp-3 max-w-2xl' : 'line-clamp-2'
                        }`}
                      >
                        {t(proj.summary, lang)}
                      </p>

                      {/* Verified Key Metric & Engineering Scope Preview */}
                      {(primaryMetric || proj.services.length > 0 || proj.galleryImages.length > 0) && (
                        <div className="pt-3 border-t border-black/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                          {primaryMetric ? (
                            <div className="flex items-baseline gap-2">
                              <span className="font-mono-tech font-bold text-[#223981] text-sm tabular-nums">
                                {primaryMetric.value}
                              </span>
                              {primaryMetric.unit && (
                                <span className="font-mono-tech text-[11px] text-[#525C6E]">
                                  {primaryMetric.unit}
                                </span>
                              )}
                              <span className="text-[#525C6E] truncate max-w-[200px]">
                                · {t(primaryMetric.label, lang)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-mono-tech text-[11px] text-[#525C6E] uppercase">
                              {proj.departments.join(' · ')}
                            </span>
                          )}

                          <div className="text-[11px] text-[#525C6E] tabular-nums">
                            {proj.services.length > 0 && (
                              <span>
                                <span className="font-mono-tech">{proj.services.length}</span>{' '}
                                {lang === 'fa' ? 'خدمت' : 'Services'}
                              </span>
                            )}
                            {proj.services.length > 0 && proj.galleryImages.length > 0 && (
                              <span> · </span>
                            )}
                            {proj.galleryImages.length > 0 && (
                              <span>
                                <span className="font-mono-tech">{proj.galleryImages.length}</span>{' '}
                                {lang === 'fa' ? 'تصویر/نمودار' : 'Plates'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-black/5 flex items-center justify-between text-xs bg-[#FAFBFD]/60">
                    <span className="text-[#525C6E] truncate max-w-[65%]">
                      {t(proj.architect, lang)}
                    </span>
                    <span className="font-semibold text-[#223981] inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                      <span>
                        {lang === 'fa' ? 'مطالعه موردی' : 'Case Study'}
                      </span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

