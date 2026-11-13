import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  HERO_SCENE_SEGMENTS,
  SceneStateSnapshot,
  getStoryCopy,
} from './heroSceneConfig';
import { PerformanceCounters } from './PerformanceCounters';
import { ISBBrandReveal } from './ISBBrandReveal';

interface HeroTypographyProps {
  sceneState: SceneStateSnapshot;
  onJumpToScene: (targetProgress: number) => void;
}

/**
 * Semantic, accessible HTML/CSS architectural typography layer synchronized
 * strictly with ScrollDirector progress across Scenes 01–07.
 */
export const HeroTypography: React.FC<HeroTypographyProps> = ({
  sceneState,
  onJumpToScene,
}) => {
  const { lang } = useApp();
  const copy = getStoryCopy(lang);
  const {
    progress,
    activeScene,
    activeSceneIndex,
    arrivalAlpha,
    flythroughAlpha,
    explodedOverlayAlpha,
    frostedAlpha,
    interiorRiseProgress,
    performanceAlpha,
    performanceCounterProgress,
    apertureAlpha,
    brandAlpha,
    brandCurtainProgress,
    skyNightFactor,
  } = sceneState;

  const isDarkAtmosphere = skyNightFactor > 0.45;
  const cornerText = isDarkAtmosphere ? 'text-white/75' : 'text-[#0B1536]/80';
  const cornerMuted = isDarkAtmosphere ? 'text-white/55' : 'text-[#141923]/60';
  const progressPct = Math.round(progress * 100);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between">
      {/* FIXED ARCHITECTURAL CORNER METADATA (Clears top 64px navbar cleanly) */}
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 pt-20 flex items-start justify-between gap-4">
        <div className={`text-[11px] font-mono-tech tracking-[0.18em] ${cornerText} transition-colors duration-300`}>
          <span>{copy.cornerTopLeft}</span>
          <span className={`block mt-0.5 text-[10px] ${cornerMuted}`}>
            {copy.cornerBottomLeft}
          </span>
        </div>

        <div className={`text-end text-[11px] font-mono-tech tracking-[0.16em] ${cornerText} transition-colors duration-300`}>
          <span className="hidden sm:inline">{copy.cornerTopRight}</span>
          <span className="sm:hidden">ISB GROUP</span>
          <span dir="ltr" className={`block mt-0.5 text-[10px] tabular-nums ${cornerMuted}`}>
            SCENE {activeSceneIndex} / 07 · {progressPct}%
          </span>
        </div>
      </div>

      {/* CENTER & SECTIONAL STORYTELLING LAYERS */}
      <div className="relative flex-1 flex items-center">
        {/* ============================================================ */}
        {/* SCENE 01 — ARCHITECTURAL ARRIVAL                              */}
        {/* ============================================================ */}
        {arrivalAlpha > 0.01 && (
          <div
            style={{
              opacity: arrivalAlpha,
              transform: `translateY(${(1 - arrivalAlpha) * 18}px)`,
            }}
            className="w-full max-w-[1360px] mx-auto px-6 lg:px-10"
          >
            <div className="max-w-xl p-6 sm:p-8 rounded-xl bg-[#FAFBFD]/82 border border-[#223981]/12 shadow-lg space-y-4">
              <div className="text-[11px] font-mono-tech tracking-[0.2em] text-[#223981] font-semibold">
                {copy.cornerTopLeft} · {copy.cornerTopRight}
              </div>

              <h1
                className="font-bold text-[#0B1536] tracking-tight text-balance"
                style={{
                  fontSize: 'clamp(2.2rem, 4.3vw, 3.75rem)',
                  lineHeight: lang === 'fa' ? 1.2 : 1.06,
                }}
              >
                {copy.scene01.headline}
              </h1>

              <p
                lang="fa"
                dir="rtl"
                className="text-base sm:text-xl font-semibold text-[#223981]"
              >
                {copy.scene01.secondary}
              </p>

              <p className="text-sm sm:text-base text-[#364154] leading-relaxed">
                {copy.scene01.thesis}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-mono-tech text-[#027A3B] font-semibold">
                <ArrowDown className="w-4 h-4 shrink-0" />
                <span>{copy.scrollPrompt}</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCENE 02 — CINEMATIC FLY-THROUGH                             */}
        {/* ============================================================ */}
        {flythroughAlpha > 0.01 && (
          <div
            style={{
              opacity: flythroughAlpha,
              transform: `translateY(${(1 - flythroughAlpha) * 20}px)`,
            }}
            className="w-full max-w-[1360px] mx-auto px-6 lg:px-10 flex justify-center text-center"
          >
            <div className="max-w-2xl px-7 py-6 rounded-xl bg-[#0B1536]/75 border border-white/15 shadow-2xl space-y-2.5">
              <p className="text-[11px] font-mono-tech tracking-[0.22em] text-[#4ADE80]">
                {copy.scene02.eyebrow}
              </p>
              <h2
                className="font-bold text-white tracking-tight text-balance"
                style={{ fontSize: 'clamp(1.85rem, 3.6vw, 3.1rem)', lineHeight: 1.15 }}
              >
                {copy.scene02.headline}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {copy.scene02.caption}
              </p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCENE 03 — EXPLODED ARCHITECTURAL SYSTEM                      */}
        {/* ============================================================ */}
        {explodedOverlayAlpha > 0.01 && (
          <div
            style={{ opacity: explodedOverlayAlpha }}
            className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 h-full flex flex-col justify-between py-6"
          >
            <div className="max-w-xl bg-[#FAFBFD]/88 border border-[#223981]/15 rounded-xl p-5 shadow-lg space-y-1.5">
              <p className="text-[11px] font-mono-tech tracking-[0.2em] text-[#027A3B] font-semibold">
                {copy.scene03.eyebrow}
              </p>
              <h2
                className="font-bold text-[#0B1536] tracking-tight text-balance"
                style={{ fontSize: 'clamp(1.65rem, 3vw, 2.55rem)', lineHeight: 1.14 }}
              >
                {copy.scene03.headline}
              </h2>
            </div>

            {/* Coordinated Discipline Technical Cards Positioned Along Bottom Edges (Never Covering Central Building) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pb-12">
              {copy.scene03.layers.map((layer) => (
                <div
                  key={layer.index}
                  className="rounded-xl bg-[#FAFBFD]/90 border border-[#223981]/15 p-4 shadow-md space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-mono-tech font-bold" style={{ color: layer.accent === '#03A54E' ? '#027A3B' : layer.accent }}>
                    <span>{layer.index}</span>
                    <span>·</span>
                    <span className="font-sans text-sm text-[#0B1536]">{layer.title}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-[#434F63]">
                    {layer.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCENE 04 — FROSTED GLASS INTERIOR REVEAL                     */}
        {/* ============================================================ */}
        {frostedAlpha > 0.01 && (
          <div
            style={{
              opacity: frostedAlpha,
              transform: `translateY(${(1 - interiorRiseProgress) * 28}px)`,
            }}
            className="w-full max-w-[1360px] mx-auto px-6 lg:px-10"
          >
            <div className="max-w-lg rounded-xl bg-[#FAFBFD]/88 border border-[#223981]/15 p-6 sm:p-7 shadow-xl space-y-3">
              <p className="text-[11px] font-mono-tech tracking-[0.2em] text-[#027A3B] font-semibold">
                {copy.scene04.eyebrow}
              </p>
              <h2
                className="font-bold text-[#0B1536] tracking-tight text-balance"
                style={{ fontSize: 'clamp(1.85rem, 3.4vw, 2.9rem)', lineHeight: 1.15 }}
              >
                {copy.scene04.headline}
              </h2>
              <p className="text-sm sm:text-base text-[#364154] leading-relaxed">
                {copy.scene04.copy}
              </p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCENE 05 — DATA AND PERFORMANCE                              */}
        {/* ============================================================ */}
        {performanceAlpha > 0.01 && (
          <div className="w-full">
            <PerformanceCounters
              counterProgress={performanceCounterProgress}
              visibleAlpha={performanceAlpha}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* SCENE 06 — LIGHT APERTURE TRANSITION                         */}
        {/* ============================================================ */}
        {apertureAlpha > 0.01 && (
          <div
            style={{ opacity: apertureAlpha }}
            className="w-full text-center px-6 space-y-2"
          >
            <p className="text-[11px] font-mono-tech tracking-[0.26em] text-[#4ADE80]">
              {copy.scene06.eyebrow}
            </p>
            <p className="text-xs sm:text-sm font-mono-tech tracking-[0.18em] text-white/90">
              {copy.scene06.label}
            </p>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* SCENE 07 — ISB BRAND REVEAL & CURTAIN ENTRY                    */}
      {/* ============================================================== */}
      <ISBBrandReveal
        revealProgress={brandAlpha}
        curtainProgress={brandCurtainProgress}
      />

      {/* COMPACT INTERACTIVE SCROLL CHAPTER RAIL (Bottom Edge, Reversible Jump) */}
      <div className="relative z-40 pb-4 px-4 flex justify-center pointer-events-none">
        <nav
          aria-label={lang === 'fa' ? 'فهرست صحنه‌های تجربه سه‌بعدی' : 'Architectural story chapters'}
          className="pointer-events-auto inline-flex items-center gap-1 p-1.5 rounded-xl bg-[#0B1536]/92 border border-white/15 shadow-2xl overflow-x-auto max-w-[94vw]"
        >
          {HERO_SCENE_SEGMENTS.map((seg) => {
            const isActive = activeScene === seg.id;
            const targetP = seg.end === 1 ? 0.97 : (seg.start + seg.end) * 0.5;
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => onJumpToScene(targetP)}
                aria-current={isActive ? 'step' : undefined}
                className={`px-2.5 py-1.5 min-h-[34px] rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#027D3D] text-white'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="font-mono-tech text-[10px] opacity-85">{seg.index}</span>
                <span className="hidden md:inline">{seg.label[lang]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
