import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Maximize2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, uiText } from '../i18n/translations';
import { SafeImage } from '../components/SafeImage';
import { ProjectCategory } from '../types/isb';

interface ProjectDetailPageProps {
  slug: string;
}

type GalleryTab = 'all' | 'diagram' | 'photo';

const CATEGORY_LABELS: Record<ProjectCategory, { fa: string; en: string }> = {
  residential: { fa: 'مسکونی', en: 'Residential' },
  industrial: { fa: 'صنعتی', en: 'Industrial' },
  institutional: { fa: 'اداری و عمومی', en: 'Institutional' },
  educational: { fa: 'آموزشی', en: 'Educational' },
  'urban-landscape': { fa: 'منظر و شهری', en: 'Urban & Landscape' },
};

function classifyPlateKind(src: string, captionFa: string, captionEn: string): 'diagram' | 'photo' {
  const hay = `${src} ${captionFa} ${captionEn}`.toLowerCase();
  if (
    hay.includes('/diagrams/') ||
    hay.includes('cutaway') ||
    hay.includes('-bim') ||
    hay.includes('-sda') ||
    hay.includes('daylight') ||
    hay.includes('-wall') ||
    hay.includes('thermal') ||
    hay.includes('-cert') ||
    hay.includes('diagram') ||
    hay.includes('simulation') ||
    hay.includes('دیاگرام') ||
    hay.includes('شبیه‌سازی') ||
    hay.includes('مقطع') ||
    hay.includes('گواهینامه') ||
    hay.includes('حرارتی')
  ) {
    return 'diagram';
  }
  return 'photo';
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug }) => {
  const { lang, projects, departments, services, navigate } = useApp();
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  const [galleryTab, setGalleryTab] = useState<GalleryTab>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const project = projects.find((p) => p.slug === slug);

  // Reset filters/lightbox when navigating between case studies
  useEffect(() => {
    setGalleryTab('all');
    setLightboxIndex(null);
  }, [slug]);

  const linkedServices = useMemo(() => {
    if (!project) return [];
    return project.services
      .map((key) => services.find((s) => s.id === key || s.slug === key))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
  }, [project, services]);

  const classifiedGallery = useMemo(() => {
    if (!project) return [];
    const base = project.galleryImages.length
      ? project.galleryImages
      : project.heroImage
      ? [{ src: project.heroImage, caption: project.title }]
      : [];
    return base.map((item, idx) => ({
      ...item,
      plateNumber: String(idx + 1).padStart(2, '0'),
      kind: classifyPlateKind(item.src, item.caption.fa, item.caption.en),
    }));
  }, [project]);

  const hasBothMediaTypes = useMemo(() => {
    const hasDiagrams = classifiedGallery.some((g) => g.kind === 'diagram');
    const hasPhotos = classifiedGallery.some((g) => g.kind === 'photo');
    return hasDiagrams && hasPhotos;
  }, [classifiedGallery]);

  const visibleGallery = useMemo(() => {
    if (galleryTab === 'all') return classifiedGallery;
    return classifiedGallery.filter((g) => g.kind === galleryTab);
  }, [classifiedGallery, galleryTab]);

  // Ensure hero plate opens smoothly in the lightbox even if galleryImages doesn't repeat heroImage
  const lightboxPlates = useMemo(() => {
    if (!project) return [];
    const list = [...classifiedGallery];
    if (project.heroImage && !list.some((item) => item.src === project.heroImage)) {
      list.unshift({
        src: project.heroImage,
        caption: project.title,
        plateNumber: '00',
        kind: 'photo',
      });
    }
    return list;
  }, [project, classifiedGallery]);

  // Keyboard controls & body scroll-lock for fullscreen Lightbox
  useEffect(() => {
    if (lightboxIndex === null || lightboxPlates.length === 0) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + (lang === 'fa' ? -1 : 1) + lightboxPlates.length) % lightboxPlates.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + (lang === 'fa' ? 1 : -1) + lightboxPlates.length) % lightboxPlates.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, lightboxPlates.length, lang]);

  const related = useMemo(() => {
    if (!project) return [];
    return projects
      .filter((p) => p.id !== project.id)
      .map((candidate) => {
        let score = 0;
        if (candidate.category === project.category) score += 4;
        for (const d of candidate.departments) {
          if (project.departments.includes(d)) score += 2;
        }
        for (const s of candidate.services) {
          if (project.services.includes(s)) score += 1;
        }
        return { candidate, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.candidate);
  }, [project, projects]);

  if (!project) {
    return (
      <div className="pt-32 pb-20 max-w-[1360px] mx-auto px-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">{lang === 'fa' ? 'پروژه یافت نشد' : 'Project not found'}</h1>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="px-5 py-2.5 rounded-md bg-[#223981] text-white text-sm cursor-pointer"
        >
          {t(uiText.home.viewAllProjects, lang)}
        </button>
      </div>
    );
  }

  const energyLadder: ('ECZn' | 'EC++' | 'EC+' | 'EC')[] = ['ECZn', 'EC++', 'EC+', 'EC'];
  const catLabel = CATEGORY_LABELS[project.category];
  const heroLightboxIdx = Math.max(
    0,
    lightboxPlates.findIndex((p) => p.src === project.heroImage)
  );

  return (
    <div className="pt-20 pb-24 bg-[#FAFBFD]">
      {/* Editorial Dark-Navy Hero Plate */}
      <section className="bg-[#0B1536] text-white">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 py-12 lg:py-16 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="text-xs font-semibold text-white/75 hover:text-white cursor-pointer"
            >
              {lang === 'fa' ? '→ بازگشت به آرشیو پروژه‌ها' : '← Back to All Projects'}
            </button>

            <div className="text-xs font-mono-tech text-white/60 uppercase tracking-wider">
              {lang === 'fa' ? catLabel.fa : catLabel.en}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-3">
              <div className="text-xs text-[#4ADE80] tabular-nums flex flex-wrap items-center gap-1.5">
                <span className="font-mono-tech">{project.indexNumber} · {project.year}</span>
                <span>·</span>
                <span>{t(project.location, lang)}</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold leading-tight text-balance">
                {t(project.title, lang)}
              </h1>
              <p className="text-base text-white/80 max-w-2xl leading-relaxed">
                {t(project.summary, lang)}
              </p>
            </div>

            {project.energyGrade && (
              <div className="lg:col-span-4 bg-[#111F4E] border border-white/10 rounded-xl p-5 space-y-2.5">
                <div className="text-xs text-white/65">
                  {lang === 'fa' ? 'رده انرژی مبحث ۱۹' : 'Chapter 19 Energy Grade'}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {energyLadder.map((grade) => {
                    const active = project.energyGrade === grade;
                    return (
                      <div
                        key={grade}
                        className={`py-2 text-center font-mono-tech text-xs rounded ${
                          active
                            ? 'bg-[#027D3D] text-white font-bold'
                            : 'bg-white/5 text-white/45'
                        }`}
                      >
                        {grade}
                      </div>
                    );
                  })}
                </div>
                {project.seroSabzTier && (
                  <p className="text-xs text-[#F2C94C] font-semibold pt-1">
                    {t(project.seroSabzTier, lang)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 pb-10">
          <button
            type="button"
            onClick={() => setLightboxIndex(heroLightboxIdx)}
            className="w-full block relative aspect-[16/8] rounded-xl overflow-hidden bg-[#132152] border border-white/10 cursor-zoom-in group text-start"
            aria-label={lang === 'fa' ? 'بزرگ‌نمایی تصویر شاخص' : 'Expand hero image'}
          >
            <SafeImage
              src={project.heroImage}
              alt={t(project.title, lang)}
              priority
              className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500"
            />
            <span className="absolute bottom-4 end-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/65 text-white text-xs font-medium opacity-85 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'نمایش تمام‌صفحه' : 'Full View'}</span>
            </span>
          </button>
        </div>
      </section>

      {/* Architectural Dossier Metadata Strip */}
      <section className="bg-white hairline-b">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-sm">
          <div>
            <div className="text-xs text-[#525C6E]">{t(uiText.common.architect, lang)}</div>
            <div className="font-semibold text-[#141923] mt-1">{t(project.architect, lang)}</div>
          </div>
          <div>
            <div className="text-xs text-[#525C6E]">{t(uiText.common.location, lang)}</div>
            <div className="font-semibold text-[#141923] mt-1">{t(project.location, lang)}</div>
          </div>
          <div>
            <div className="text-xs text-[#525C6E]">{t(uiText.common.year, lang)}</div>
            <div className="font-semibold text-[#141923] font-mono-tech mt-1 tabular-nums">
              {project.year}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#525C6E]">{t(uiText.nav.departments, lang)}</div>
            <div className="font-semibold text-[#223981] mt-1 flex flex-wrap gap-x-2 gap-y-1">
              {project.departments.map((did, idx) => {
                const d = departments.find((x) => x.id === did);
                return (
                  <React.Fragment key={did}>
                    {idx > 0 && <span className="text-[#525C6E]/40">·</span>}
                    <button
                      type="button"
                      onClick={() => navigate(`/departments/${did}`)}
                      className="hover:underline cursor-pointer text-start"
                    >
                      {d ? t(d.title, lang) : did}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#525C6E]">
              {lang === 'fa' ? 'طبقه‌بندی و رده' : 'Classification'}
            </div>
            <div className="font-semibold text-[#141923] mt-1">
              <span>{lang === 'fa' ? catLabel.fa : catLabel.en}</span>
              {project.energyGrade && (
                <span className="font-mono-tech text-[#027A3B]"> · {project.energyGrade}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Editorial Narrative, Scope, Metrics & Services */}
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 py-14 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Narrative & Strategies Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-mono-tech text-[#223981] font-semibold uppercase tracking-wider">
                {lang === 'fa' ? 'فصل ۰۱ · تحلیل عملکردی' : 'SECTION 01 · ARCHITECTURAL MONOGRAPH'}
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#141923]">
                {lang === 'fa'
                  ? 'روایت مهندسی و عملکردی پروژه'
                  : 'Architectural & Engineering Narrative'}
              </h2>
              <p className="text-base text-[#141923]/85 leading-[1.9] max-w-prose ltr:first-letter:text-4xl ltr:first-letter:font-bold ltr:first-letter:text-[#223981] ltr:first-letter:float-left ltr:first-letter:mr-2.5 ltr:first-letter:leading-none">
                {t(project.narrative, lang)}
              </p>
            </div>

            {project.designStrategies.length > 0 && (
              <div className="pt-6 border-t border-black/10 space-y-4">
                <h3 className="text-lg font-bold text-[#141923]">
                  {lang === 'fa'
                    ? 'راهبردهای طراحی و بهینه‌سازی'
                    : 'Design & Optimization Strategies'}
                </h3>
                <ul className="space-y-3">
                  {project.designStrategies.map((st, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#525C6E] leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#03A54E] shrink-0 mt-1" />
                      <span>{t(st, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Scope of Work & Verified Quantitative Metrics Column */}
          <div className="lg:col-span-5 space-y-6">
            {project.scopeOfWork.length > 0 && (
              <div className="bg-white border border-black/10 rounded-xl p-6 space-y-4">
                <h3 className="text-base font-bold text-[#141923]">
                  {lang === 'fa' ? 'حوزه همکاری گروه ISB' : 'ISB Scope of Work'}
                </h3>
                <ul className="space-y-3 text-sm text-[#525C6E]">
                  {project.scopeOfWork.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="font-mono-tech text-xs text-[#223981] font-bold mt-0.5 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="leading-relaxed">{t(item, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.metrics.length > 0 && (
              <div className="bg-white border border-black/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-[#141923]">
                    {lang === 'fa' ? 'شاخص‌های کمی تأییدشده' : 'Verified Technical Metrics'}
                  </h3>
                  <span className="text-[11px] text-[#027A3B] font-semibold">
                    <span className="font-mono-tech">{project.metrics.length}</span>{' '}
                    {lang === 'fa' ? 'شاخص' : 'KPIs'}
                  </span>
                </div>
                <div className="divide-y divide-black/5">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-medium text-[#141923]">{t(m.label, lang)}</div>
                        {m.note && (
                          <div className="text-[11px] text-[#525C6E] mt-0.5">{t(m.note, lang)}</div>
                        )}
                      </div>
                      <div className="text-end shrink-0">
                        <span className="text-lg font-bold font-mono-tech text-[#223981] tabular-nums">
                          {m.value}
                        </span>
                        {m.unit && (
                          <span className="text-[11px] text-[#525C6E] ms-1 font-mono-tech">
                            {m.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Linked Engineering & Architectural Services Section */}
        {linkedServices.length > 0 && (
          <section className="pt-10 hairline-t space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-mono-tech text-[#223981] font-semibold uppercase tracking-wider">
                  {lang === 'fa' ? 'فصل ۰۲ · خدمات ارائه‌شده' : 'SECTION 02 · DELIVERED DISCIPLINES'}
                </div>
                <h2 className="text-2xl font-bold text-[#141923]">
                  {lang === 'fa'
                    ? 'خدمات تخصصی مهندسی و معماری در این پروژه'
                    : 'Engineering & Architectural Services Applied'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold hover:bg-[#192b63] cursor-pointer self-start sm:self-auto"
              >
                <span>{t(uiText.home.ctaButton, lang)}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {linkedServices.map((srv) => {
                const deptObj = departments.find((d) => d.id === srv.department);
                return (
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
                    className="bg-white border border-black/10 rounded-xl p-6 flex flex-col justify-between gap-4 cursor-pointer group hover:border-[#223981]/40 transition-colors isb-focus-ring"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-[#525C6E]">
                        <span className="font-mono-tech font-bold text-[#027A3B]">{srv.index}</span>
                        <span>·</span>
                        <span className="text-[#223981] font-medium truncate">
                          {deptObj ? t(deptObj.title, lang) : srv.department}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#141923] group-hover:text-[#223981] transition-colors">
                        {t(srv.title, lang)}
                      </h3>
                      <p className="text-xs text-[#525C6E] leading-relaxed line-clamp-2">
                        {t(srv.shortDescription, lang)}
                      </p>
                      {srv.deliverables.length > 0 && (
                        <ul className="pt-2 space-y-1 border-t border-black/5">
                          {srv.deliverables.slice(0, 2).map((del, idx) => (
                            <li key={idx} className="text-[11px] text-[#525C6E] flex items-start gap-1.5">
                              <Layers className="w-3 h-3 text-[#03A54E] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{t(del, lang)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-[#223981] inline-flex items-center gap-1">
                      <span>{lang === 'fa' ? 'مشاهده جزئیات خدمت' : 'Explore Service Scope'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Photography & Technical Diagrams Gallery */}
        {classifiedGallery.length > 0 && (
          <section className="pt-10 hairline-t space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-mono-tech text-[#223981] font-semibold uppercase tracking-wider">
                  {lang === 'fa' ? 'فصل ۰۳ · مستندات بصری و فنی' : 'SECTION 03 · PLATES & TECHNICAL DIAGRAMS'}
                </div>
                <h2 className="text-2xl font-bold text-[#141923]">
                  {lang === 'fa'
                    ? 'تصاویر معماری، مقاطع فنی و خروجی شبیه‌سازی'
                    : 'Photography, Technical Diagrams & Simulation Output'}
                </h2>
              </div>

              {hasBothMediaTypes && (
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all' as const, fa: 'همه مستندات', en: 'All Plates' },
                    { id: 'diagram' as const, fa: 'دیاگرام‌ها و مقاطع فنی', en: 'Technical Diagrams' },
                    { id: 'photo' as const, fa: 'تصاویر معماری', en: 'Photography' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setGalleryTab(tab.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
                        galleryTab === tab.id
                          ? 'bg-[#223981] text-white'
                          : 'bg-[#F2F4F8] text-[#525C6E] hover:text-[#141923]'
                      }`}
                    >
                      {lang === 'fa' ? tab.fa : tab.en}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleGallery.map((img) => {
                const viewerIdx = lightboxPlates.findIndex((p) => p.src === img.src);
                const isLeadDiagram = visibleGallery.length >= 2 && img.kind === 'diagram' && visibleGallery.length === 2;
                return (
                  <figure
                    key={`${img.plateNumber}-${img.src}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setLightboxIndex(viewerIdx >= 0 ? viewerIdx : 0)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setLightboxIndex(viewerIdx >= 0 ? viewerIdx : 0);
                      }
                    }}
                    className={`${
                      isLeadDiagram ? 'lg:col-span-2' : ''
                    } bg-white border border-black/10 rounded-xl overflow-hidden cursor-zoom-in group flex flex-col justify-between isb-focus-ring`}
                  >
                    <div className="aspect-[4/3] bg-[#F2F4F8] overflow-hidden relative">
                      <SafeImage
                        src={img.src}
                        alt={t(img.caption, lang)}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <span className="absolute bottom-3 end-3 p-2 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <figcaption className="p-4 space-y-1.5 border-t border-black/5">
                      <div className="text-[11px] text-[#525C6E] flex items-center gap-2">
                        <span className="font-mono-tech font-semibold text-[#223981]">PLATE {img.plateNumber}</span>
                        <span>·</span>
                        <span className={img.kind === 'diagram' ? 'text-[#027A3B] font-semibold' : ''}>
                          {img.kind === 'diagram'
                            ? lang === 'fa'
                              ? 'دیاگرام / تحلیل فنی'
                              : 'TECHNICAL DIAGRAM'
                            : lang === 'fa'
                            ? 'تصویر معماری'
                            : 'ARCHITECTURE'}
                        </span>
                      </div>
                      <div className="text-xs text-[#141923]/85 leading-relaxed">
                        {t(img.caption, lang)}
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Case Studies */}
        {related.length > 0 && (
          <section className="pt-10 hairline-t space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#141923]">
                {lang === 'fa' ? 'پروژه‌های مرتبط و هم‌خانواده' : 'Related Case Studies'}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="text-xs font-semibold text-[#223981] inline-flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{t(uiText.home.viewAllProjects, lang)}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => {
                const relMetric = rel.metrics[0];
                return (
                  <article
                    key={rel.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/projects/${rel.slug}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/projects/${rel.slug}`);
                      }
                    }}
                    className="bg-white border border-black/10 rounded-xl overflow-hidden cursor-pointer group flex flex-col justify-between hover:border-[#223981]/40 transition-colors isb-focus-ring"
                  >
                    <div>
                      <div className="aspect-[16/10] bg-[#0B1536] overflow-hidden">
                        <SafeImage
                          src={rel.heroImage}
                          alt={t(rel.title, lang)}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 space-y-2">
                        <div className="text-xs font-mono-tech text-[#525C6E] tabular-nums">
                          <span>{rel.indexNumber}</span>
                          <span> · </span>
                          <span>{rel.year}</span>
                          {rel.energyGrade && (
                            <>
                              <span> · </span>
                              <span className="text-[#027A3B] font-bold">{rel.energyGrade}</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-[#141923] group-hover:text-[#223981] transition-colors">
                          {t(rel.title, lang)}
                        </h3>
                        <p className="text-xs text-[#525C6E]">{t(rel.location, lang)}</p>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 border-t border-black/5 flex items-center justify-between text-xs">
                      {relMetric ? (
                        <span className="font-mono-tech font-semibold text-[#223981] tabular-nums">
                          {relMetric.value} {relMetric.unit || ''}
                        </span>
                      ) : (
                        <span className="text-[#525C6E] truncate max-w-[60%]">
                          {t(rel.architect, lang)}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#223981]">
                        <span>{t(uiText.common.readMore, lang)}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Immersive Lightbox Modal with Prev/Next Stepping & Thumbnail Strip */}
      {lightboxIndex !== null && lightboxPlates[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 lg:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between text-white/80 text-xs font-mono-tech"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tabular-nums">
              PLATE {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
              {String(lightboxPlates.length).padStart(2, '0')} · {t(project.title, lang)}
            </div>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-md bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image Viewer + Prev/Next */}
          <div
            className="flex-1 flex items-center justify-center relative my-4 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxPlates.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + lightboxPlates.length) % lightboxPlates.length
                  )
                }
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 cursor-pointer shrink-0 mx-2"
                aria-label="Previous plate"
              >
                {lang === 'fa' ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
            )}

            <div className="max-w-5xl w-full max-h-full flex flex-col items-center justify-center space-y-3">
              <SafeImage
                src={lightboxPlates[lightboxIndex].src}
                alt={t(lightboxPlates[lightboxIndex].caption, lang)}
                className="max-w-full max-h-[68vh] object-contain rounded-lg"
              />
              <p className="text-center text-sm text-white/90 max-w-2xl leading-relaxed">
                {t(lightboxPlates[lightboxIndex].caption, lang)}
              </p>
            </div>

            {lightboxPlates.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % lightboxPlates.length)}
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 cursor-pointer shrink-0 mx-2"
                aria-label="Next plate"
              >
                {lang === 'fa' ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          {/* Thumbnail Strip */}
          {lightboxPlates.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto py-1"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxPlates.map((plate, idx) => (
                <button
                  key={`${plate.src}-${idx}`}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-16 h-11 rounded overflow-hidden border transition-all cursor-pointer shrink-0 ${
                    idx === lightboxIndex
                      ? 'border-[#03A54E] opacity-100 scale-105'
                      : 'border-white/20 opacity-55 hover:opacity-90'
                  }`}
                >
                  <SafeImage
                    src={plate.src}
                    alt={t(plate.caption, lang)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

