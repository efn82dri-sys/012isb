import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollDirectorProps {
  runwayRef: React.RefObject<HTMLElement | null>;
  onProgress: (progress: number) => void;
}

/**
 * GSAP ScrollTrigger scrub coordinator.
 * Binds vertical scroll position smoothly & deterministically in both directions
 * without scroll hijacking.
 */
export const ScrollDirector: React.FC<ScrollDirectorProps> = ({
  runwayRef,
  onProgress,
}) => {
  useEffect(() => {
    const el = runwayRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          onProgress(self.progress);
        },
      });
    }, el);

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, [runwayRef, onProgress]);

  return null;
};

/**
 * Helper to smoothly scroll the user directly to any normalized scene target.
 */
export function scrollToNormalizedProgress(
  runwayEl: HTMLElement | null,
  targetProgress: number,
  reducedMotion: boolean
) {
  if (!runwayEl) return;
  const rect = runwayEl.getBoundingClientRect();
  const topAbsolute = window.scrollY + rect.top;
  const scrollableDistance = Math.max(1, runwayEl.offsetHeight - window.innerHeight);
  const destinationY = topAbsolute + targetProgress * scrollableDistance;

  window.scrollTo({
    top: destinationY,
    behavior: reducedMotion ? 'auto' : 'smooth',
  });
}
