import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  ShoppingBag,
} from 'lucide-react';
import { Course, Language, Project } from '../types/isb';
import { t, uiText } from '../i18n/translations';
import { SafeImage } from '../components/SafeImage';

export type IsbButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
export type IsbButtonSize = 'sm' | 'md' | 'lg';

interface IsbButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IsbButtonVariant;
  size?: IsbButtonSize;
  fullWidth?: boolean;
}

export const IsbButton: React.FC<IsbButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}) => {
  const sizeClass =
    size === 'sm'
      ? 'h-8 px-3.5 text-xs gap-1.5'
      : size === 'lg'
      ? 'h-12 px-6 text-sm gap-2'
      : 'h-10 px-5 text-xs sm:text-[13px] gap-2';

  const variantClass: Record<IsbButtonVariant, string> = {
    primary: 'bg-[#223981] text-white hover:bg-[#192B63] border border-transparent',
    accent: 'bg-[#027D3D] text-white hover:bg-[#026832] border border-transparent',
    secondary: 'bg-white text-[#141923] border border-black/15 hover:bg-[#F2F4F8]',
    ghost: 'bg-transparent text-[#223981] border border-transparent hover:bg-[#223981]/8',
    danger: 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] hover:bg-[#FEE2E2]',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-semibold whitespace-nowrap shrink-0 isb-transition isb-focus-ring cursor-pointer disabled:opacity-45 disabled:pointer-events-none ${sizeClass} ${variantClass[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

interface IsbFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  ltr?: boolean;
}

export const IsbField: React.FC<IsbFieldProps> = ({
  label,
  hint,
  error,
  ltr = false,
  id,
  className = '',
  ...rest
}) => {
  const inputId = id || `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-xs font-semibold text-[#141923]">
        {label}
      </label>
      <input
        id={inputId}
        dir={ltr ? 'ltr' : undefined}
        aria-invalid={Boolean(error)}
        className={`w-full h-11 px-3.5 text-sm bg-white rounded-md border isb-transition focus:outline-none ${
          error
            ? 'border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
            : 'border-black/15 focus:border-[#223981] focus:ring-2 focus:ring-[#223981]/15'
        } ${ltr ? 'font-mono-tech text-[13px]' : ''} ${className}`}
        {...rest}
      />
      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-[#DC2626] font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : (
        hint && <p className="text-xs text-[#525C6E]">{hint}</p>
      )}
    </div>
  );
};

interface IsbSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

export const IsbSelect: React.FC<IsbSelectProps> = ({
  label,
  id,
  className = '',
  children,
  ...rest
}) => {
  const selectId = id || `select-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-xs font-semibold text-[#141923]">
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full h-11 px-3.5 text-sm bg-white rounded-md border border-black/15 isb-transition focus:outline-none focus:border-[#223981] focus:ring-2 focus:ring-[#223981]/15 ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
};

interface IsbStatusNoticeProps {
  tone: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
}

export const IsbStatusNotice: React.FC<IsbStatusNoticeProps> = ({ tone, title, children }) => {
  const map = {
    success: {
      bg: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]',
      Icon: CheckCircle2,
    },
    warning: {
      bg: 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]',
      Icon: AlertTriangle,
    },
    error: {
      bg: 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]',
      Icon: AlertCircle,
    },
    info: {
      bg: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A8A]',
      Icon: Info,
    },
  }[tone];

  const Icon = map.Icon;
  return (
    <div className={`p-3.5 rounded-lg border flex items-start gap-2.5 text-xs ${map.bg}`}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="space-y-0.5 leading-relaxed">
        {title && <div className="font-bold">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

interface IsbProjectCardProps {
  project: Project;
  lang: Language;
  onSelect: (slug: string) => void;
}

export const IsbProjectCard: React.FC<IsbProjectCardProps> = ({
  project,
  lang,
  onSelect,
}) => {
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(project.slug)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project.slug);
        }
      }}
      className="bg-white border border-black/10 rounded-xl overflow-hidden cursor-pointer group flex flex-col justify-between isb-transition hover:border-[#223981]/35 isb-focus-ring"
    >
      <div>
        <div className="aspect-[16/10] bg-[#0B1536] overflow-hidden">
          <SafeImage
            src={project.heroImage}
            alt={t(project.title, lang)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
        <div className="p-6 space-y-2.5">
          {/* Zero-Pill Inline Swiss Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#525C6E] font-mono-tech">
            <span>{project.indexNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
            {project.energyGrade && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#027A3B] font-semibold">{project.energyGrade}</span>
              </>
            )}
            {project.seroSabzTier && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-sans text-[#8A6914] font-semibold">
                  {t(project.seroSabzTier, lang)}
                </span>
              </>
            )}
          </div>

          <h3 className="text-lg font-bold text-[#141923] group-hover:text-[#223981] transition-colors text-balance">
            {t(project.title, lang)}
          </h3>
          <p className="text-xs text-[#525C6E]">{t(project.location, lang)}</p>
          <p className="text-sm text-[#525C6E] line-clamp-2 leading-relaxed">
            {t(project.summary, lang)}
          </p>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-black/5 flex items-center justify-between text-xs">
        <span className="text-[#525C6E] truncate max-w-[65%]">{t(project.architect, lang)}</span>
        <span className="font-semibold text-[#223981] inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
          <span>{t(uiText.common.readMore, lang)}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};

interface IsbCourseCardProps {
  course: Course;
  lang: Language;
  priceLabel: string;
  isEnrolled?: boolean;
  inCart?: boolean;
  onView: (slug: string) => void;
  onAction: (courseId: string) => void;
}

export const IsbCourseCard: React.FC<IsbCourseCardProps> = ({
  course,
  lang,
  priceLabel,
  isEnrolled = false,
  inCart = false,
  onView,
  onAction,
}) => {
  return (
    <article className="bg-white border border-black/10 rounded-xl overflow-hidden flex flex-col justify-between isb-transition hover:border-[#223981]/35">
      <div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => onView(course.slug)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onView(course.slug);
            }
          }}
          className="aspect-[16/10] bg-[#0B1536] overflow-hidden cursor-pointer isb-focus-ring"
        >
          <SafeImage
            src={course.posterImage}
            alt={t(course.title, lang)}
            className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
        <div className="p-6 space-y-2.5">
          {/* Zero-Pill Inline Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#525C6E] font-mono-tech">
            <span className="uppercase">{course.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-sans">{t(course.duration, lang)}</span>
            <span aria-hidden="true">·</span>
            <span className="uppercase">{course.format}</span>
          </div>

          <h3
            role="button"
            tabIndex={0}
            onClick={() => onView(course.slug)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onView(course.slug);
              }
            }}
            className="text-lg font-bold text-[#141923] hover:text-[#223981] transition-colors cursor-pointer text-balance isb-focus-ring rounded"
          >
            {t(course.title, lang)}
          </h3>
          <p className="text-xs text-[#525C6E]">{t(course.instructor, lang)}</p>
          <p className="text-sm text-[#525C6E] line-clamp-2 leading-relaxed">
            {t(course.shortDescription, lang)}
          </p>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-black/5 flex items-center justify-between gap-3">
        <div className="text-sm font-bold text-[#141923] tabular-nums">{priceLabel}</div>
        <IsbButton
          type="button"
          size="sm"
          variant={isEnrolled ? 'secondary' : inCart ? 'accent' : 'primary'}
          onClick={() => onAction(course.id)}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>
            {isEnrolled
              ? lang === 'fa'
                ? 'داشبورد'
                : 'Dashboard'
              : inCart
              ? lang === 'fa'
                ? 'تسویه حساب'
                : 'Checkout'
              : lang === 'fa'
              ? 'ثبت‌نام'
              : 'Enroll'}
          </span>
        </IsbButton>
      </div>
    </article>
  );
};
