import React from 'react';

interface IsbLogoProps {
  variant?: 'horizontal' | 'stacked' | 'mark';
  tone?: 'brand' | 'white';
  className?: string;
  showWordmark?: boolean;
}

/**
 * Geometric SVG reproduction of the official ISB Group emblem & wordmark
 * from `isb_logo_and_patern_d4f53c9c.pdf` preserving exact proportions.
 */
export const IsbLogo: React.FC<IsbLogoProps> = ({
  variant = 'horizontal',
  tone = 'brand',
  className = '',
  showWordmark = true,
}) => {
  const fill = tone === 'white' ? '#FFFFFF' : '#223981';

  const emblem = (
    <svg
      viewBox="0 0 80 120"
      className={variant === 'mark' ? 'h-full w-auto' : 'h-9 w-auto shrink-0'}
      fill="none"
      aria-hidden="true"
    >
      {/* Stepped architectural shield silhouette with central leaf/nib stem */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40 6L49.5 13V21.5L58.5 27.5V37.5L68 43.5V66.5C68 83.2 56.8 96.4 43.5 99.6V109L36.5 114V99.6C23.2 96.4 12 83.2 12 66.5V43.5L21.5 37.5V27.5L30.5 21.5V13L40 6ZM40 16.5L37 18.8V26L28 31.8V41.5L19.5 46.8V66.5C19.5 79.4 27.4 89.2 36.5 91.8V82L43.5 76.5V91.8C52.6 89.2 60.5 79.4 60.5 66.5V46.8L52 41.5V31.8L43 26V18.8L40 16.5Z"
        fill={fill}
      />
    </svg>
  );

  if (variant === 'mark' || !showWordmark) {
    return <span className={`inline-flex items-center ${className}`}>{emblem}</span>;
  }

  return (
    <span
      dir="ltr"
      className={`inline-flex ${
        variant === 'stacked' ? 'flex-col items-center gap-1.5' : 'flex-row items-center gap-2.5'
      } select-none ${className}`}
    >
      {emblem}
      <span className="flex flex-col leading-none">
        <span
          className="text-[19px] font-bold tracking-[0.04em] lowercase"
          style={{ color: fill, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          isb
        </span>
        <span
          className="text-[9px] font-semibold tracking-[0.26em] uppercase mt-0.5"
          style={{ color: fill, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          GROUP
        </span>
      </span>
    </span>
  );
};
