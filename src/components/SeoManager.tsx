import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertRouteJsonLd(payload: Record<string, unknown> | null) {
  const id = 'isb-route-jsonld';
  const existing = document.getElementById(id);
  if (!payload) {
    existing?.remove();
    return;
  }
  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

export const SeoManager: React.FC = () => {
  const { route, lang, projects, courses, articles, services, departments } = useApp();

  useEffect(() => {
    const cleanPath = route.split('?')[0].replace(/\/+$/, '') || '/';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const canonicalUrl = `${origin}${cleanPath === '/' ? '/' : cleanPath}`;

    let title =
      lang === 'fa'
        ? 'ISB Group | گروه ساختمانی بنای پایدار ایران‌زمین — معماری، انرژی و پایداری'
        : 'ISB Group | Iran Sustainable Building Group — Architecture, Energy & Structure';
    let description =
      lang === 'fa'
        ? 'گروه ساختمانی بنای پایدار ایران‌زمین (ISB Group) — تلفیق معماری، شبیه‌سازی انرژی، سیستم‌های ساختمان، مهندسی سازه و آکادمی تخصصی ساختمان‌های پایدار.'
        : 'Iran Sustainable Building Group (ISB Group) — Integrating architectural creativity, building physics, energy simulation, structural engineering, and ISB Academy.';
    let jsonLd: Record<string, unknown> | null = null;

    if (cleanPath === '/projects') {
      title =
        lang === 'fa'
          ? 'آرشیو پروژه‌ها و مطالعات موردی | ISB Group'
          : 'Architectural & Engineering Case Studies | ISB Group';
      description =
        lang === 'fa'
          ? 'مطالعات موردی معماری، بهینه‌سازی انرژی مبحث ۱۹ و پروژه‌های گواهینامه سرو سبز گروه ساختمانی ISB.'
          : 'Explore verified ISB Group architectural and building energy simulation case studies.';
    } else if (cleanPath.startsWith('/projects/')) {
      const slug = cleanPath.slice('/projects/'.length);
      const proj = projects.find((p) => p.slug === slug);
      if (proj) {
        title = `${t(proj.title, lang)} | ISB Group`;
        description = t(proj.summary, lang);
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: t(proj.title, lang),
          description: t(proj.summary, lang),
          image: proj.heroImage ? `${origin}${proj.heroImage}` : undefined,
          creator: { '@type': 'Organization', name: t(proj.architect, lang) },
          locationCreated: t(proj.location, lang),
          url: canonicalUrl,
        };
      }
    } else if (cleanPath === '/academy') {
      title =
        lang === 'fa'
          ? 'آکادمی تخصصی ISB | دوره‌های مبحث ۱۹، شبیه‌سازی انرژی و سرو سبز'
          : 'ISB Academy | Building Science, Chapter 19 & Energy Simulation Courses';
      description =
        lang === 'fa'
          ? 'ثبت‌نام آنلاین در دوره‌های کاربردی DesignBuilder، مبحث ۱۹ مقررات ملی ساختمان، جداره‌های سبز و استاندارد سرو سبز.'
          : 'Enroll in applied building physics, Chapter 19, DesignBuilder, and Sero Sabz certification courses.';
    } else if (cleanPath.startsWith('/academy/')) {
      const slug = cleanPath.slice('/academy/'.length);
      const course = courses.find((c) => c.slug === slug);
      if (course) {
        title = `${t(course.title, lang)} | ISB Academy`;
        description = t(course.shortDescription, lang);
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: t(course.title, lang),
          description: t(course.shortDescription, lang),
          provider: {
            '@type': 'Organization',
            name: 'ISB Academy — Iran Sustainable Building Group',
            sameAs: origin,
          },
          offers: {
            '@type': 'Offer',
            price: course.priceToman,
            priceCurrency: 'IRR',
            availability: course.isAvailable
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          },
        };
      }
    } else if (cleanPath.startsWith('/departments/')) {
      const slug = cleanPath.slice('/departments/'.length);
      const dept = departments.find((d) => d.id === slug);
      if (dept) {
        title = `${t(dept.title, lang)} | ISB Group`;
        description = t(dept.description, lang);
      }
    } else if (cleanPath === '/services') {
      title =
        lang === 'fa'
          ? 'خدمات مهندسی و مشاوره معماری پایدار | ISB Group'
          : 'Engineering & Architectural Consultancy Services | ISB Group';
    } else if (cleanPath.startsWith('/services/')) {
      const slug = cleanPath.slice('/services/'.length);
      const srv = services.find((s) => s.slug === slug);
      if (srv) {
        title = `${t(srv.title, lang)} | ISB Group`;
        description = t(srv.shortDescription, lang);
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: t(srv.title, lang),
          description: t(srv.detailedDescription, lang),
          provider: { '@type': 'Organization', name: 'ISB Group' },
          url: canonicalUrl,
        };
      }
    } else if (cleanPath === '/insights') {
      title =
        lang === 'fa'
          ? 'پژوهش، مقالات فنی و تحلیل‌های مهندسی | ISB Group'
          : 'Research & Technical Insights | ISB Group';
    } else if (cleanPath.startsWith('/insights/')) {
      const slug = cleanPath.slice('/insights/'.length);
      const art = articles.find((a) => a.slug === slug);
      if (art) {
        title = `${t(art.title, lang)} | ISB Insights`;
        description = t(art.excerpt, lang);
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: t(art.title, lang),
          description: t(art.excerpt, lang),
          author: { '@type': 'Person', name: t(art.author, lang) },
          image: art.image ? `${origin}${art.image}` : undefined,
          url: canonicalUrl,
        };
      }
    } else if (cleanPath === '/about') {
      title =
        lang === 'fa'
          ? 'درباره گروه ساختمانی بنای پایدار ایران‌زمین (ISB Group)'
          : 'About ISB Group | Leadership, Advisors & Sero Sabz Framework';
    } else if (cleanPath === '/contact') {
      title =
        lang === 'fa'
          ? 'تماس و درخواست مشاوره تخصصی پروژه | ISB Group'
          : 'Contact & Project Consultation | ISB Group';
    } else if (cleanPath === '/design-system') {
      title = 'ISB Figma Design System & UI Architecture | ISB Group';
    } else if (cleanPath === '/auth') {
      title = lang === 'fa' ? 'ورود و ثبت‌نام | آکادمی ISB' : 'Sign In & Register | ISB Academy';
    } else if (cleanPath === '/dashboard') {
      title = lang === 'fa' ? 'داشبورد آموزشی دانشجو | ISB Academy' : 'Student Dashboard | ISB Academy';
    } else if (cleanPath === '/checkout') {
      title = lang === 'fa' ? 'تسویه حساب و درگاه پرداخت | ISB Academy' : 'Checkout | ISB Academy';
    } else if (cleanPath === '/admin') {
      title = lang === 'fa' ? 'پنل مدیریت محتوا (CMS) | ISB Group' : 'Admin CMS Console | ISB Group';
    }

    document.title = title;
    upsertCanonical(canonicalUrl);
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:locale', lang === 'fa' ? 'fa_IR' : 'en_US');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertRouteJsonLd(jsonLd);
  }, [route, lang, projects, courses, articles, services, departments]);

  return null;
};
