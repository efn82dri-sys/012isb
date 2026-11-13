import React from 'react';
import { ArrowDown, Layers, Shield, SunMedium } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getStoryCopy } from './heroSceneConfig';
import { PerformanceCounters } from './PerformanceCounters';
import { ISBBrandReveal } from './ISBBrandReveal';
import { SafeImage } from '../SafeImage';

/**
 * Simplified, high-contrast, silky smooth vertical architectural journey for:
 * - Mobile touch viewports (< 768px) to guarantee responsive scrolling without heavy shader stalls
 * - Devices lacking WebGL
 * - Users requesting reduced motion (prefers-reduced-motion)
 */
export const MobileSceneFallback: React.FC = () => {
  const { lang } = useApp();
  const copy = getStoryCopy(lang);

  return (
    <div className="bg-[#FAFBFD] text-[#141923]">
      {/* SCENE 01 — ARCHITECTURAL ARRIVAL */}
      <section className="relative min-h-[92vh] pt-24 pb-14 px-6 flex flex-col justify-between bg-[#DCE5F0] overflow-hidden">
        <SafeImage
          src="/images/projects/mehregan-hero.webp"
          alt={lang === 'fa' ? 'ساختمان پایدار ISB' : 'ISB Contemporary Glass Architecture'}
          priority
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFBFD]/85 via-[#DCE5F0]/75 to-[#FAFBFD]" />

        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-tech text-[#223981]">
          <span>{copy.cornerTopLeft}</span>
          <span>{copy.cornerBottomLeft}</span>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-5 my-auto py-8">
          <div className="text-[11px] font-mono-tech tracking-[0.18em] text-[#027A3B] font-semibold">
            {copy.cornerTopRight}
          </div>
          <h1
            className="font-bold text-[#0B1536] tracking-tight text-balance"
            style={{ fontSize: 'clamp(2rem, 7vw, 3.25rem)', lineHeight: 1.15 }}
          >
            {copy.scene01.headline}
          </h1>
          <p lang="fa" dir="rtl" className="text-lg font-semibold text-[#223981]">
            {copy.scene01.secondary}
          </p>
          <p className="text-sm sm:text-base text-[#364154] leading-relaxed">
            {copy.scene01.thesis}
          </p>
          <div className="pt-2 inline-flex items-center gap-2 text-xs font-mono-tech text-[#027A3B] font-semibold">
            <ArrowDown className="w-4 h-4" />
            <span>{copy.scrollPrompt}</span>
          </div>
        </div>
      </section>

      {/* SCENE 02 — CINEMATIC FLY-THROUGH */}
      <section className="py-16 px-6 bg-[#0B1536] text-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-[11px] font-mono-tech tracking-[0.2em] text-[#4ADE80]">
            {copy.scene02.eyebrow}
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-balance">
            {copy.scene02.headline}
          </h2>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            {copy.scene02.caption}
          </p>
          <div className="aspect-[16/10] rounded-xl overflow-hidden border border-white/15">
            <SafeImage
              src="/images/projects/vista-plaza-hero.webp"
              alt={copy.scene02.headline}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SCENE 03 — THREE COORDINATED ARCHITECTURAL SYSTEMS */}
      <section className="py-16 px-6 bg-[#FAFBFD]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="text-[11px] font-mono-tech tracking-[0.2em] text-[#027A3B] font-semibold">
              {copy.scene03.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0B1536] tracking-tight text-balance">
              {copy.scene03.headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {copy.scene03.layers.map((layer, idx) => {
              const Icon = idx === 0 ? Layers : idx === 1 ? SunMedium : Shield;
              return (
                <div
                  key={layer.index}
                  className="p-6 rounded-xl bg-white border border-black/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-xs font-bold text-[#223981]">
                      {layer.index}
                    </span>
                    <Icon className="w-4 h-4 text-[#027A3B]" />
                  </div>
                  <h3 className="text-base font-bold text-[#141923]">{layer.title}</h3>
                  <ul className="space-y-1.5 text-xs text-[#525C6E]">
                    {layer.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SCENE 04 — FROSTED INTERIOR CLARITY */}
      <section className="py-16 px-6 bg-[#EEF3F9]">
        <div className="max-w-3xl mx-auto rounded-2xl bg-white/85 border border-black/10 p-7 sm:p-10 space-y-4">
          <p className="text-[11px] font-mono-tech tracking-[0.2em] text-[#027A3B] font-semibold">
            {copy.scene04.eyebrow}
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0B1536] tracking-tight">
            {copy.scene04.headline}
          </h2>
          <p className="text-sm sm:text-base text-[#364154] leading-relaxed">
            {copy.scene04.copy}
          </p>
          <div className="aspect-[16/9] rounded-xl overflow-hidden border border-black/10 pt-2">
            <SafeImage
              src="/images/projects/kerman-school-hero.webp"
              alt={copy.scene04.headline}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SCENE 05 — VERIFIED PERFORMANCE METRICS */}
      <section className="py-16 px-6 bg-[#07102B]">
        <PerformanceCounters counterProgress={1} visibleAlpha={1} compact />
      </section>

      {/* SCENE 07 — ISB BRAND REVEAL & ENTRY */}
      <ISBBrandReveal revealProgress={1} curtainProgress={1} alwaysVisible />
    </div>
  );
};
