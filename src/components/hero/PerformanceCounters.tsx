import React from 'react';
import { useApp } from '../../context/AppContext';
import { getStoryCopy } from './heroSceneConfig';

interface PerformanceCountersProps {
  /** Scroll-normalized 0..1 progress inside Scene 05 */
  counterProgress: number;
  /** Overall opacity 0..1 of Scene 05 */
  visibleAlpha: number;
  /** Compact layout flag for mobile/reduced fallback */
  compact?: boolean;
}

/**
 * Scene 05 — Data and Performance
 * Deterministic, reversible scroll-driven numerical counters using strictly
 * verified company figures from ISB Group's live catalogue.
 */
export const PerformanceCounters: React.FC<PerformanceCountersProps> = ({
  counterProgress,
  visibleAlpha,
  compact = false,
}) => {
  const { lang, projects, departments, courses } = useApp();
  const copy = getStoryCopy(lang).scene05;

  const formatNum = (val: number) =>
    new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(val);

  const rawMetrics = [
    {
      target: projects.length,
      suffix: '',
      label: copy.labels.projects,
    },
    {
      target: 20,
      suffix: '+',
      label: copy.labels.experience,
    },
    {
      target: departments.length,
      suffix: '',
      label: copy.labels.disciplines,
    },
    {
      target: courses.length,
      suffix: '',
      label: copy.labels.programs,
    },
  ];

  // Smooth ease-out curve so numbers settle decisively as scroll passes 75%
  const eased = 1 - Math.pow(1 - Math.min(1, Math.max(0, counterProgress)), 3);

  return (
    <div
      style={{
        opacity: visibleAlpha,
        transform: `translateY(${(1 - Math.min(1, visibleAlpha)) * 18}px)`,
      }}
      className={`w-full transition-none ${
        compact ? 'space-y-6' : 'max-w-5xl mx-auto px-6 lg:px-10 space-y-8'
      }`}
    >
      <div className="space-y-2 text-center">
        <p className="text-[11px] sm:text-xs font-mono-tech tracking-[0.22em] text-[#4ADE80] uppercase">
          {copy.eyebrow}
        </p>
        <h2
          className="font-bold text-white tracking-tight text-balance"
          style={{
            fontSize: compact ? 'clamp(1.65rem, 6vw, 2.25rem)' : 'clamp(2.1rem, 3.8vw, 3.35rem)',
          }}
        >
          {copy.headline}
        </h2>
      </div>

      {/* Sharp Accessible HTML Metrics Positioned Clearly in Front of Cylindrical Surface */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {rawMetrics.map((m, idx) => {
          const current = Math.max(0, Math.round(m.target * eased));
          return (
            <div
              key={idx}
              className="rounded-xl bg-[#0B1536]/85 border border-white/15 p-5 sm:p-6 text-center space-y-2 shadow-2xl"
            >
              <div
                dir="ltr"
                className="font-mono-tech font-bold text-white tabular-nums tracking-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.05 }}
              >
                {formatNum(current)}
                {m.suffix && <span className="text-[#4ADE80]">{m.suffix}</span>}
              </div>
              <div className="h-px w-8 mx-auto bg-[#03A54E]/70" aria-hidden="true" />
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium">
                {m.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
