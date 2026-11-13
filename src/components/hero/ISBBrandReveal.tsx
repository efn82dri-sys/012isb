import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IsbLogo } from '../IsbLogo';
import { getStoryCopy } from './heroSceneConfig';

interface ISBBrandRevealProps {
  /** Normalized 0..1 visibility of Scene 07 */
  revealProgress: number;
  /** Curtain opening progress 0..1 */
  curtainProgress: number;
  /** Optional inline static mode for reduced-motion / mobile end section */
  alwaysVisible?: boolean;
}

const WORDMARK_LETTERS = ['i', 's', 'b'];

/**
 * Scene 07 — ISB Brand Reveal & Website Entry
 * Uses the exact uploaded ISB emblem with letter-by-letter upward reveal,
 * an architectural shutter curtain transition, and primary entry CTAs.
 */
export const ISBBrandReveal: React.FC<ISBBrandRevealProps> = ({
  revealProgress,
  curtainProgress,
  alwaysVisible = false,
}) => {
  const { lang, navigate } = useApp();
  const copy = getStoryCopy(lang).scene07;
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  const alpha = alwaysVisible ? 1 : revealProgress;
  const curtain = alwaysVisible ? 1 : curtainProgress;
  const active = alpha > 0.02;

  return (
    <div
      aria-hidden={!active}
      style={{ opacity: alpha }}
      className={`${
        alwaysVisible ? 'relative py-20' : 'absolute inset-0 z-30'
      } flex items-center justify-center overflow-hidden ${
        active ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Architectural Curtain Reveal Panels (Split left & right from center) */}
      {!alwaysVisible && (
        <>
          <div
            aria-hidden="true"
            style={{
              transform: `translateX(${-curtain * 100}%)`,
            }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[#07102B] z-10 border-r border-white/10"
          />
          <div
            aria-hidden="true"
            style={{
              transform: `translateX(${curtain * 100}%)`,
            }}
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[#07102B] z-10 border-l border-white/10"
          />
        </>
      )}

      {/* Brand Identity Stage */}
      <div className="relative z-0 w-full h-full bg-[#0B1536] flex flex-col items-center justify-center px-6 sm:px-10 text-center">
        {/* Subtle official geometric brand pattern texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/brand/isb-pattern-green-on-blue.webp)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07102B]/70 via-transparent to-[#07102B]/90"
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          {/* Official Uploaded Emblem + Staggered Letter-by-Letter Upward Wordmark Reveal */}
          <div
            dir="ltr"
            className="inline-flex flex-col items-center gap-3 select-none"
          >
            <div
              style={{
                opacity: Math.min(1, curtain * 1.4),
                transform: `translateY(${(1 - Math.min(1, curtain * 1.4)) * 22}px)`,
              }}
              className="h-20 sm:h-24 flex items-center justify-center"
            >
              <IsbLogo variant="mark" tone="white" className="h-full" showWordmark={false} />
            </div>

            <div className="flex flex-col items-center leading-none">
              <div className="flex items-baseline gap-0.5 overflow-hidden py-1">
                {WORDMARK_LETTERS.map((ch, idx) => {
                  const start = idx * 0.14;
                  const letterAlpha = Math.max(
                    0,
                    Math.min(1, (curtain - start) / 0.45)
                  );
                  return (
                    <span
                      key={ch}
                      style={{
                        opacity: letterAlpha,
                        transform: `translateY(${(1 - letterAlpha) * 28}px)`,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                      className="inline-block text-4xl sm:text-5xl font-bold tracking-[0.06em] lowercase text-white"
                    >
                      {ch}
                    </span>
                  );
                })}
              </div>
              <span
                style={{
                  opacity: Math.max(0, Math.min(1, (curtain - 0.36) / 0.4)),
                  transform: `translateY(${(1 - Math.max(0, Math.min(1, (curtain - 0.36) / 0.4))) * 14}px)`,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                className="text-xs sm:text-sm font-semibold tracking-[0.38em] uppercase text-[#4ADE80] mt-1"
              >
                GROUP
              </span>
            </div>
          </div>

          {/* Final Brand Statement */}
          <div
            style={{
              opacity: Math.max(0, Math.min(1, (curtain - 0.28) / 0.45)),
              transform: `translateY(${(1 - Math.max(0, Math.min(1, (curtain - 0.28) / 0.45))) * 16}px)`,
            }}
            className="space-y-3"
          >
            <h2
              className="font-bold text-white tracking-tight text-balance"
              style={{ fontSize: 'clamp(1.85rem, 4.2vw, 3.5rem)', lineHeight: 1.12 }}
            >
              {copy.statement}
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-xl mx-auto leading-relaxed">
              {copy.substatement}
            </p>
          </div>

          {/* Required Three Primary Entry Points */}
          <div
            style={{
              opacity: Math.max(0, Math.min(1, (curtain - 0.42) / 0.45)),
              transform: `translateY(${(1 - Math.max(0, Math.min(1, (curtain - 0.42) / 0.45))) * 16}px)`,
            }}
            className="pt-2 flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-6 py-3 min-h-[44px] rounded-md bg-[#027D3D] hover:bg-[#026832] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{copy.ctas.architecture}</span>
              <ArrowIcon className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/departments/energy')}
              className="px-6 py-3 min-h-[44px] rounded-md bg-white text-[#0B1536] hover:bg-white/90 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{copy.ctas.engineering}</span>
              <ArrowIcon className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/academy')}
              className="px-6 py-3 min-h-[44px] rounded-md border border-white/30 text-white hover:bg-white/10 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{copy.ctas.academy}</span>
              <ArrowIcon className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
