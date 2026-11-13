import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Globe,
  Menu,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, uiText } from '../i18n/translations';
import { IsbLogo } from './IsbLogo';
import { SafeImage } from './SafeImage';

export const Navbar: React.FC = () => {
  const {
    lang,
    toggleLang,
    route,
    navigate,
    departments,
    user,
    cart,
    cartOpen,
    openCart,
    closeCart,
    courses,
    removeFromCart,
    formatPrice,
  } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deptMenuOpen, setDeptMenuOpen] = useState(false);

  const isHomeTop = false;

  useEffect(() => {
    setMobileOpen(false);
    setDeptMenuOpen(false);
  }, [route]);

  useEffect(() => {
    if (!cartOpen && !mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (cartOpen) closeCart();
        if (mobileOpen) setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [cartOpen, mobileOpen, closeCart]);

  const handleNav = (to: string) => {
    setMobileOpen(false);
    setDeptMenuOpen(false);
    closeCart();
    navigate(to);
  };

  const cartCourses = courses.filter((c) => cart.includes(c.id));
  const cartSubtotal = cartCourses.reduce((sum, c) => sum + c.priceToman, 0);
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  const navLinkClass = (active: boolean) =>
    `text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
      active
        ? isHomeTop
          ? 'text-white border-[#03A54E]'
          : 'text-[#223981] border-[#223981]'
        : isHomeTop
        ? 'text-white/85 border-transparent hover:text-white'
        : 'text-[#141923]/80 border-transparent hover:text-[#223981]'
    }`;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
          isHomeTop
            ? 'bg-[#0B1536]/80 border-b border-white/10'
            : 'bg-white/95 border-b border-black/10'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-5 lg:px-10 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Official ISB Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="flex items-center shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#03A54E] rounded"
            aria-label={t(uiText.brandName, lang)}
          >
            <IsbLogo tone={isHomeTop ? 'white' : 'brand'} />
          </button>

          {/* Zone 2: Clean Single-Line Navigation */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label={lang === 'fa' ? 'ناوبری اصلی' : 'Primary navigation'}
          >
            <button
              type="button"
              onClick={() => handleNav('/projects')}
              className={`${navLinkClass(route.startsWith('/projects'))} cursor-pointer`}
            >
              {t(uiText.nav.projects, lang)}
            </button>

            <div
              className="relative"
              onMouseEnter={() => setDeptMenuOpen(true)}
              onMouseLeave={() => setDeptMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setDeptMenuOpen((v) => !v)}
                className={`inline-flex items-center gap-1 cursor-pointer ${navLinkClass(
                  route.startsWith('/departments')
                )}`}
              >
                <span>{t(uiText.nav.departments, lang)}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {deptMenuOpen && (
                <div className="absolute top-full start-0 pt-2 w-[340px]">
                  <div className="bg-white border border-black/10 shadow-xl rounded-lg p-2 text-[#141923]">
                    {departments.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleNav(`/departments/${d.id}`)}
                        className="w-full text-start p-3 rounded-md hover:bg-[#F2F4F8] transition-colors cursor-pointer block"
                      >
                        <div className="flex items-center gap-2 text-xs font-mono-tech text-[#223981]">
                          <span>{d.index}</span>
                          <span>·</span>
                          <span className="font-sans font-semibold text-sm text-[#141923]">
                            {t(d.title, lang)}
                          </span>
                        </div>
                        <p className="text-xs text-[#525C6E] mt-1 line-clamp-1">
                          {t(d.subtitle, lang)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNav('/services')}
              className={`${navLinkClass(route.startsWith('/services'))} cursor-pointer`}
            >
              {t(uiText.nav.services, lang)}
            </button>

            <button
              type="button"
              onClick={() => handleNav('/academy')}
              className={`${navLinkClass(route.startsWith('/academy'))} cursor-pointer`}
            >
              {t(uiText.nav.academy, lang)}
            </button>

            <button
              type="button"
              onClick={() => handleNav('/insights')}
              className={`${navLinkClass(route.startsWith('/insights'))} cursor-pointer`}
            >
              {t(uiText.nav.insights, lang)}
            </button>

            <button
              type="button"
              onClick={() => handleNav('/about')}
              className={`${navLinkClass(route.startsWith('/about'))} cursor-pointer`}
            >
              {t(uiText.nav.about, lang)}
            </button>
          </nav>

          {/* Zone 3: Language, Cart, Account & Primary CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleLang}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                isHomeTop
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-black/15 text-[#141923] hover:bg-[#F2F4F8]'
              }`}
              aria-label="Switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'EN' : 'فا'}</span>
            </button>

            <button
              type="button"
              onClick={openCart}
              className={`relative p-2 rounded-md transition-colors cursor-pointer ${
                isHomeTop
                  ? 'text-white hover:bg-white/10'
                  : 'text-[#141923] hover:bg-[#F2F4F8]'
              }`}
              aria-label={t(uiText.nav.cart, lang)}
              aria-expanded={cartOpen}
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -end-0.5 w-4 h-4 rounded-full bg-[#03A54E] text-white text-[10px] font-mono-tech tabular-nums flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNav(user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/auth')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                isHomeTop
                  ? 'text-white/90 hover:bg-white/10'
                  : 'text-[#141923] hover:bg-[#F2F4F8]'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>
                {user
                  ? user.role === 'admin'
                    ? t(uiText.nav.admin, lang)
                    : user.name.split(' ')[0]
                  : t(uiText.nav.login, lang)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/contact')}
              className={`hidden md:inline-flex items-center px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isHomeTop
                  ? 'bg-[#027D3D] text-white hover:bg-[#026832]'
                  : 'bg-[#223981] text-white hover:bg-[#192b63]'
              }`}
            >
              {t(uiText.nav.contact, lang)}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={`lg:hidden p-2 rounded-md cursor-pointer ${
                isHomeTop ? 'text-white' : 'text-[#141923]'
              }`}
              aria-label="Toggle Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Architectural Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1536] text-white flex flex-col justify-between p-6 overflow-y-auto lg:hidden">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <IsbLogo tone="white" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-md bg-white/10 text-white cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 flex flex-col gap-3">
              {[
                { label: t(uiText.nav.projects, lang), to: '/projects' },
                { label: t(uiText.nav.services, lang), to: '/services' },
                { label: t(uiText.nav.academy, lang), to: '/academy' },
                { label: t(uiText.nav.insights, lang), to: '/insights' },
                { label: t(uiText.nav.about, lang), to: '/about' },
                { label: t(uiText.nav.contact, lang), to: '/contact' },
              ].map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => handleNav(item.to)}
                  className="text-start text-2xl font-semibold py-2 border-b border-white/10 hover:text-[#03A54E] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4">
                <p className="text-xs text-white/50 mb-2">{t(uiText.nav.departments, lang)}</p>
                <div className="flex flex-col gap-2">
                  {departments.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleNav(`/departments/${d.id}`)}
                      className="text-start text-sm text-white/85 py-1.5 hover:text-white cursor-pointer"
                    >
                      {d.index}. {t(d.title, lang)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleNav(user ? '/dashboard' : '/auth')}
              className="w-full py-3 px-4 rounded-md bg-white text-[#0B1536] font-semibold text-sm text-center cursor-pointer"
            >
              {user ? t(uiText.nav.account, lang) : t(uiText.nav.login, lang)}
            </button>
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => handleNav('/admin')}
                className="w-full py-3 px-4 rounded-md bg-[#027D3D] hover:bg-[#026832] text-white font-semibold text-sm text-center cursor-pointer"
              >
                {t(uiText.nav.admin, lang)}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Slide-Over Shopping Bag Drawer */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#0B1536]/55 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label={t(uiText.nav.cart, lang)}
          onClick={closeCart}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl border-s border-black/10 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-[#223981]" />
                <h2 className="text-base font-bold text-[#141923]">
                  {lang === 'fa' ? 'سبد خرید آکادمی ISB' : 'ISB Academy Bag'}
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#F2F4F8] text-xs font-mono-tech text-[#223981] tabular-nums">
                  {cartCourses.length}
                </span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-2 rounded-md text-[#525C6E] hover:bg-[#F2F4F8] hover:text-[#141923] cursor-pointer"
                aria-label={lang === 'fa' ? 'بستن سبد خرید' : 'Close bag'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartCourses.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#F2F4F8] flex items-center justify-center text-[#223981]">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#141923]">
                      {lang === 'fa' ? 'سبد خرید شما خالی است' : 'Your academy bag is empty'}
                    </p>
                    <p className="text-xs text-[#525C6E] max-w-xs leading-relaxed">
                      {lang === 'fa'
                        ? 'دوره‌های تخصصی مبحث ۱۹، شبیه‌سازی انرژی و استاندارد سرو سبز را برای شروع انتخاب کنید.'
                        : 'Browse applied courses in Chapter 19 compliance, DesignBuilder simulation, and Sero Sabz certification.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNav('/academy')}
                    className="px-5 py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold hover:bg-[#192B63] cursor-pointer"
                  >
                    {lang === 'fa' ? 'مشاهده دوره‌های آکادمی' : 'Explore ISB Academy'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-3.5 rounded-xl border border-black/10 bg-[#FAFBFD] flex items-start gap-3.5"
                    >
                      <button
                        type="button"
                        onClick={() => handleNav(`/academy/${course.slug}`)}
                        className="w-20 h-16 rounded-lg overflow-hidden bg-[#0B1536] shrink-0 cursor-pointer"
                      >
                        <SafeImage
                          src={course.posterImage}
                          alt={t(course.title, lang)}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <div className="flex-1 min-w-0 space-y-1">
                        <button
                          type="button"
                          onClick={() => handleNav(`/academy/${course.slug}`)}
                          className="text-start text-xs font-bold text-[#141923] hover:text-[#223981] line-clamp-2 cursor-pointer"
                        >
                          {t(course.title, lang)}
                        </button>
                        <div className="text-[11px] text-[#525C6E]">
                          {t(course.duration, lang)} · {course.format}
                        </div>
                        <div className="text-xs font-bold font-mono-tech text-[#223981] tabular-nums pt-0.5">
                          {formatPrice(course.priceToman)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(course.id)}
                        className="p-1.5 rounded-md text-[#525C6E] hover:text-red-600 hover:bg-red-50 shrink-0 cursor-pointer"
                        aria-label={lang === 'fa' ? 'حذف دوره از سبد' : 'Remove course'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartCourses.length > 0 && (
              <div className="p-6 border-t border-black/10 bg-[#FAFBFD] space-y-4">
                <div className="flex items-center justify-between text-xs text-[#525C6E]">
                  <span>{lang === 'fa' ? 'جمع کل قابل پرداخت' : 'Estimated Subtotal'}</span>
                  <span className="text-lg font-bold font-mono-tech text-[#141923] tabular-nums">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-black/10 flex items-center gap-2 text-[11px] text-[#525C6E]">
                  <ShieldCheck className="w-4 h-4 text-[#03A54E] shrink-0" />
                  <span>
                    {lang === 'fa'
                      ? 'فعال‌سازی آنی دسترسی منابع پس از تأیید تراکنش بانکی'
                      : 'Instant course & workbook unlock after server verification'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleNav('/checkout')}
                    className="w-full py-3 px-4 rounded-md bg-[#027D3D] text-white text-xs font-semibold hover:bg-[#026832] inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {lang === 'fa' ? 'ادامه و تسویه حساب' : 'Proceed to Checkout'}
                    </span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
