import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../i18n/translations';
import { SafeImage } from '../SafeImage';
import {
  SceneStateSnapshot,
  computeSceneState,
} from './heroSceneConfig';
import { ScrollDirector, scrollToNormalizedProgress } from './ScrollDirector';
import { HeroTypography } from './HeroTypography';
import { MobileSceneFallback } from './MobileSceneFallback';

const ArchitecturalScene = lazy(() =>
  import('./ArchitecturalScene').then((m) => ({ default: m.ArchitecturalScene }))
);

interface Capabilities {
  webglSupported: boolean;
  isSoftwareGl: boolean;
}

function probeWebGL(): Capabilities {
  if (typeof document === 'undefined') {
    return { webglSupported: false, isSoftwareGl: true };
  }
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return { webglSupported: false, isSoftwareGl: true };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return { webglSupported: true, isSoftwareGl };
  } catch {
    return { webglSupported: false, isSoftwareGl: true };
  }
}

export const HeroExperience: React.FC = () => {
  const { lang, projects, departments, courses, navigate, formatPrice } = useApp();
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [osReducedMotion, setOsReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [manualReducedMotion, setManualReducedMotion] = useState(false);
  const reducedMotion = osReducedMotion || manualReducedMotion;

  const caps = useMemo(() => probeWebGL(), []);
  const [webglFailed, setWebglFailed] = useState(!caps.webglSupported);
  const [sceneReady, setSceneReady] = useState(!caps.webglSupported);

  // High-frequency ref for 60fps 3D render loop (zero React re-renders per frame)
  const sceneStateRef = useRef<SceneStateSnapshot>(computeSceneState(0));
  // UI snapshot state for crisp HTML typography synchronization
  const [sceneState, setSceneState] = useState<SceneStateSnapshot>(() => computeSceneState(0));
  const runwayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMq = (e: MediaQueryListEvent) => setOsReducedMotion(e.matches);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('resize', onResize);
      mq.removeEventListener('change', onMq);
    };
  }, []);

  const handleScrollProgress = useCallback((rawProgress: number) => {
    const next = computeSceneState(rawProgress);
    sceneStateRef.current = next;
    setSceneState(next);
  }, []);

  const handleJumpToScene = useCallback(
    (targetProgress: number) => {
      scrollToNormalizedProgress(runwayRef.current, targetProgress, reducedMotion);
    },
    [reducedMotion]
  );

  const useSimplifiedJourney = isMobile || webglFailed || reducedMotion;
  const featuredProjects = projects.slice(0, 3);
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="bg-[#FAFBFD] text-[#141923]">
      {/* ACCESSIBILITY MOTION PREFERENCE TOGGLE */}
      <div className="fixed bottom-4 end-4 z-40 hidden md:block">
        <button
          type="button"
          onClick={() => setManualReducedMotion((v) => !v)}
          aria-pressed={reducedMotion}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/95 border border-black/15 text-[#141923] text-[11px] font-medium shadow-md hover:bg-[#F2F4F8] cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#223981]" />
          <span>
            {reducedMotion
              ? lang === 'fa'
                ? 'بازگشت به صحنه سه‌بعدی'
                : 'Enable 3D Scroll'
              : lang === 'fa'
              ? 'حالت ایستا / کاهش حرکت'
              : 'Reduced Motion'}
          </span>
        </button>
      </div>

      {useSimplifiedJourney ? (
        <MobileSceneFallback />
      ) : (
        <section
          ref={runwayRef}
          aria-label={
            lang === 'fa'
              ? 'تجربه اسکرول سه‌بعدی معماری ISB'
              : 'ISB Scroll-Driven 3D Architectural Experience'
          }
          className="relative w-full h-[760vh]"
        >
          <ScrollDirector runwayRef={runwayRef} onProgress={handleScrollProgress} />

          {/* STICKY FULL-VIEWPORT 3D & EDITORIAL STAGE */}
          <div className="sticky top-0 w-full h-[100dvh] overflow-hidden bg-[#D7E2EE]">
            {/* Lazy-loaded 3D Architectural Environment */}
            <div className="absolute inset-0 z-0">
              <Suspense fallback={null}>
                <ArchitecturalScene
                  sceneStateRef={sceneStateRef}
                  isSoftwareGl={caps.isSoftwareGl}
                  isMobile={isMobile}
                  reducedMotion={reducedMotion}
                  onReady={() => setSceneReady(true)}
                  onWebglError={() => {
                    setWebglFailed(true);
                    setSceneReady(true);
                  }}
                />
              </Suspense>
            </div>

            {/* Subtle Non-Blocking Corner Indicator While WebGL Initializes */}
            {!sceneReady && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-16 end-6 z-10 text-[11px] font-mono-tech text-[#0B1536]/75 bg-white/80 border border-black/10 rounded-md px-3 py-1.5"
              >
                {lang === 'fa' ? 'آماده‌سازی مدل سه‌بعدی...' : 'INITIALIZING 3D ARCHITECTURE...'}
              </div>
            )}

            {/* Synchronized Semantic HTML Typography, Metrics & Scene 07 Brand Reveal */}
            <HeroTypography
              sceneState={sceneState}
              onJumpToScene={handleJumpToScene}
            />
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* SEAMLESS TRANSITION INTO MAIN HOMEPAGE ARCHITECTURAL CONTENT       */}
      {/* ================================================================= */}
      <section className="py-20 lg:py-28 border-t border-black/10 bg-[#FAFBFD]">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-16">
          {/* Core Disciplines Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-xs font-mono-tech tracking-wider text-[#027A3B] font-semibold">
                {lang === 'fa' ? 'سه دپارتمان هم‌راستا' : 'THREE INTEGRATED DISCIPLINES'}
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#141923] tracking-tight text-balance">
                {lang === 'fa'
                  ? 'هم‌افزایی معماری، انرژی و مهندسی سازه در پروژه‌های واقعی'
                  : 'Integrated Practice Across Architecture, Building Energy & Structural Design'}
              </h2>
            </div>
            <div className="lg:col-span-5 lg:text-end">
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold hover:bg-[#192B63] cursor-pointer"
              >
                <span>{lang === 'fa' ? 'مشاهده تمامی خدمات مهندسی' : 'Explore All Services'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/departments/${dept.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/departments/${dept.id}`);
                  }
                }}
                className="isb-focus-ring p-7 rounded-xl bg-white border border-black/10 hover:border-[#223981]/40 transition-colors cursor-pointer space-y-4"
              >
                <div className="flex items-center justify-between text-xs font-mono-tech text-[#223981]">
                  <span>{dept.index}</span>
                  <span>ISB GROUP</span>
                </div>
                <h3 className="text-lg font-bold text-[#141923]">{t(dept.title, lang)}</h3>
                <p className="text-xs text-[#525C6E] leading-relaxed line-clamp-3">
                  {t(dept.description, lang)}
                </p>
              </div>
            ))}
          </div>

          {/* Selected Case Studies */}
          <div className="space-y-8 pt-6 border-t border-black/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-mono-tech text-[#027A3B] font-semibold">
                  {lang === 'fa' ? 'پرونده‌های منتخب' : 'SELECTED CASE STUDIES'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#141923] tracking-tight">
                  {lang === 'fa' ? 'پروژه‌های مستند و ممیزی‌شده' : 'Documented Architectural & Energy Works'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#223981] hover:underline cursor-pointer"
              >
                <span>{lang === 'fa' ? 'همه پروژه‌ها' : 'All Projects'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <article
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/projects/${project.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/projects/${project.slug}`);
                    }
                  }}
                  className="isb-focus-ring group rounded-xl bg-white border border-black/10 overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#0B1536] overflow-hidden">
                      <SafeImage
                        src={project.heroImage}
                        alt={t(project.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="text-[11px] font-mono-tech text-[#525C6E]">
                        {project.year} · {t(project.location, lang)}
                      </div>
                      <h3 className="text-base font-bold text-[#141923] group-hover:text-[#223981] transition-colors">
                        {t(project.title, lang)}
                      </h3>
                      <p className="text-xs text-[#525C6E] line-clamp-2 leading-relaxed">
                        {t(project.summary, lang)}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 py-3.5 border-t border-black/10 text-xs font-semibold text-[#027A3B] flex items-center justify-between gap-2">
                    <span className="truncate">
                      {project.metrics[0]
                        ? t(project.metrics[0].label, lang)
                        : lang === 'fa'
                        ? 'پرونده مستند'
                        : 'Documented Study'}
                    </span>
                    <span dir="ltr" className="font-mono-tech shrink-0">
                      {project.metrics[0]
                        ? `${project.metrics[0].value}${project.metrics[0].unit ? ` ${project.metrics[0].unit}` : ''}`
                        : project.energyGrade || project.year}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ISB Academy Highlights */}
          <div className="space-y-8 pt-6 border-t border-black/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-mono-tech text-[#027A3B] font-semibold">
                  {lang === 'fa' ? 'آکادمی تخصصی ISB' : 'ISB ACADEMY'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#141923] tracking-tight">
                  {lang === 'fa' ? 'آموزش استانداردهای انرژی و ساختمان سبز' : 'Applied Building Science & Certification Training'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/academy')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#223981] hover:underline cursor-pointer"
              >
                <span>{lang === 'fa' ? 'ورود به آکادمی' : 'Enter Academy'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <article
                  key={course.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/academy/${course.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/academy/${course.slug}`);
                    }
                  }}
                  className="isb-focus-ring group rounded-xl bg-white border border-black/10 overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#0B1536] overflow-hidden">
                      <SafeImage
                        src={course.posterImage}
                        alt={t(course.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="text-[11px] font-mono-tech text-[#525C6E]">
                        {t(course.duration, lang)} · {course.format}
                      </div>
                      <h3 className="text-base font-bold text-[#141923] group-hover:text-[#223981] transition-colors line-clamp-2">
                        {t(course.title, lang)}
                      </h3>
                    </div>
                  </div>
                  <div className="px-5 py-3.5 border-t border-black/10 flex items-center justify-between text-xs font-semibold">
                    <span className="font-mono-tech text-[#223981] tabular-nums">
                      {formatPrice(course.priceToman)}
                    </span>
                    <span className="text-[#027A3B]">
                      {lang === 'fa' ? 'مشاهده سرفصل' : 'View Syllabus'}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
