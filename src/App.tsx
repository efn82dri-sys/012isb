import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ConsultationAssistant } from './components/ConsultationAssistant';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SeoManager } from './components/SeoManager';

const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const DesignSystemPage = lazy(() =>
  import('./pages/DesignSystemPage').then((m) => ({ default: m.DesignSystemPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const DepartmentPage = lazy(() =>
  import('./pages/DepartmentPage').then((m) => ({ default: m.DepartmentPage }))
);
const ServicesPage = lazy(() =>
  import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage }))
);
const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const ProjectDetailPage = lazy(() =>
  import('./pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage }))
);
const AcademyPage = lazy(() =>
  import('./pages/AcademyPage').then((m) => ({ default: m.AcademyPage }))
);
const InsightsPage = lazy(() =>
  import('./pages/InsightsPage').then((m) => ({ default: m.InsightsPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const AuthPage = lazy(() =>
  import('./pages/AuthPage').then((m) => ({ default: m.AuthPage }))
);
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const AdminCmsPage = lazy(() =>
  import('./pages/AdminCmsPage').then((m) => ({ default: m.AdminCmsPage }))
);

const RouteLoadingFallback: React.FC<{ isHero: boolean; lang: 'fa' | 'en' }> = ({
  isHero,
  lang,
}) => {
  if (isHero) {
    return (
      <div
        className="w-full min-h-[100dvh] bg-[#D7E2EE] text-[#0B1536] flex items-center px-6 lg:px-10 pt-20"
        aria-busy="true"
      >
        <div className="max-w-[1360px] w-full mx-auto">
          <div className="max-w-xl p-8 rounded-xl bg-[#FAFBFD]/85 border border-[#223981]/12 space-y-3">
            <p className="text-[11px] font-mono-tech tracking-[0.2em] text-[#223981] font-semibold">
              ISB / 2026
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#0B1536]">
              {lang === 'fa' ? 'آینده را مهندسی می‌کنیم.' : "WE DESIGN WHAT'S NEXT."}
            </h1>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="pt-28 pb-24 max-w-[1360px] mx-auto px-6 lg:px-10 space-y-6" aria-busy="true">
      <div className="h-10 w-64 bg-black/5 rounded-md animate-pulse" />
      <div className="h-48 w-full bg-white border border-black/10 rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-56 bg-white border border-black/10 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
};

const AppRouter: React.FC = () => {
  const { route, lang, navigate } = useApp();
  const cleanPath = route.split('?')[0].replace(/\/+$/, '') || '/';

  const renderPage = () => {
    if (cleanPath === '/') {
      return <HomePage />;
    }
    if (cleanPath === '/design-system') {
      return <DesignSystemPage />;
    }
    if (cleanPath === '/about') {
      return <AboutPage />;
    }
    if (cleanPath.startsWith('/departments/')) {
      const slug = cleanPath.slice('/departments/'.length);
      return <DepartmentPage slug={slug} />;
    }
    if (cleanPath === '/services') {
      return <ServicesPage />;
    }
    if (cleanPath.startsWith('/services/')) {
      const slug = cleanPath.slice('/services/'.length);
      return <ServicesPage slug={slug} />;
    }
    if (cleanPath === '/projects') {
      return <ProjectsPage />;
    }
    if (cleanPath.startsWith('/projects/')) {
      const slug = cleanPath.slice('/projects/'.length);
      return <ProjectDetailPage slug={slug} />;
    }
    if (cleanPath === '/academy') {
      return <AcademyPage />;
    }
    if (cleanPath.startsWith('/academy/')) {
      const slug = cleanPath.slice('/academy/'.length);
      return <AcademyPage slug={slug} />;
    }
    if (cleanPath === '/insights') {
      return <InsightsPage />;
    }
    if (cleanPath.startsWith('/insights/')) {
      const slug = cleanPath.slice('/insights/'.length);
      return <InsightsPage slug={slug} />;
    }
    if (cleanPath === '/contact') {
      return <ContactPage />;
    }
    if (cleanPath === '/auth') {
      return <AuthPage />;
    }
    if (cleanPath === '/dashboard') {
      return <DashboardPage />;
    }
    if (cleanPath === '/checkout') {
      return <CheckoutPage />;
    }
    if (cleanPath === '/admin') {
      return <AdminCmsPage />;
    }

    return (
      <div className="pt-36 pb-24 max-w-[1360px] mx-auto px-6 text-center space-y-5">
        <div className="text-sm font-mono-tech text-[#223981] font-semibold">404</div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#141923]">
          {lang === 'fa' ? 'صفحه مورد نظر یافت نشد' : 'Page Not Found'}
        </h1>
        <p className="text-sm text-[#525C6E] max-w-md mx-auto">
          {lang === 'fa'
            ? 'نشانی وارد شده در پلتفرم ISB Group وجود ندارد.'
            : 'The requested URL does not match a page on ISB Group.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold cursor-pointer"
        >
          {lang === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFD] text-[#141923]">
      <SeoManager />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[#223981] focus:text-white focus:text-xs focus:font-semibold"
      >
        {lang === 'fa' ? 'رفتن به محتوای اصلی' : 'Skip to main content'}
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <ErrorBoundary lang={lang} onResetHome={() => navigate('/')}>
          <Suspense fallback={<RouteLoadingFallback isHero={cleanPath === '/'} lang={lang} />}>
            {renderPage()}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      {cleanPath !== '/' && <ConsultationAssistant />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
