import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Lock,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { Order } from '../types/isb';
import { SafeImage } from '../components/SafeImage';
import { IsbButton, IsbStatusNotice } from '../design-system/components';

export const CheckoutPage: React.FC = () => {
  const {
    lang,
    cart,
    courses,
    removeFromCart,
    clearCart,
    user,
    authLoading,
    navigate,
    formatPrice,
    route,
  } = useApp();

  const [step, setStep] = useState<'cart' | 'gateway' | 'result'>('cart');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [authority, setAuthority] = useState('');
  const [gatewayMode, setGatewayMode] = useState<'zarinpal-sandbox' | 'zarinpal-live'>('zarinpal-sandbox');
  const [resultStatus, setResultStatus] = useState<'paid' | 'failed' | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [error, setError] = useState('');
  const [ownedCourseIds, setOwnedCourseIds] = useState<string[]>([]);

  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  // Fetch student's already-verified courses to warn against duplicate checkout items
  useEffect(() => {
    if (!user) {
      setOwnedCourseIds([]);
      return;
    }
    fetch('/api/dashboard')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.enrollments) {
          setOwnedCourseIds(d.enrollments.map((e: { courseId: string }) => e.courseId));
        }
      })
      .catch(() => {});
  }, [user]);

  // Resume existing pending/failed order when ?retryOrderId= is provided
  useEffect(() => {
    const query = route.split('?')[1] || '';
    const params = new URLSearchParams(query);
    const retryOrderId = params.get('retryOrderId');
    if (!retryOrderId) return;

    if (!authLoading && !user) {
      navigate(`/auth?next=${encodeURIComponent(`/checkout?retryOrderId=${retryOrderId}`)}`);
      return;
    }
    if (!user) return;

    let cancelled = false;
    setRetryLoading(true);
    setError('');

    (async () => {
      try {
        const ordRes = await fetch(`/api/orders/${encodeURIComponent(retryOrderId)}`);
        const ordData = await ordRes.json();
        if (!ordRes.ok) {
          if (!cancelled) {
            setError(
              ordData.error ||
                (lang === 'fa'
                  ? 'امکان بازیابی سفارش مورد نظر وجود ندارد.'
                  : 'Unable to load the requested order.')
            );
          }
          return;
        }

        const loadedOrder = ordData.order as Order;
        if (loadedOrder.status === 'paid') {
          if (!cancelled) {
            setActiveOrder(loadedOrder);
            setAuthority(loadedOrder.authority || '');
            setResultStatus('paid');
            setStep('result');
          }
          return;
        }

        const initRes = await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: loadedOrder.id }),
        });
        const initData = await initRes.json();
        if (!initRes.ok) {
          if (!cancelled) {
            setError(initData.error || 'Payment initiation failed.');
          }
          return;
        }

        if (!cancelled) {
          setActiveOrder(loadedOrder);
          setAuthority(initData.authority);
          setGatewayMode(initData.gateway === 'zarinpal-live' ? 'zarinpal-live' : 'zarinpal-sandbox');
          setStep('gateway');
        }
      } catch {
        if (!cancelled) {
          setError(
            lang === 'fa'
              ? 'خطای شبکه هنگام اتصال به درگاه برای سفارش قبلی.'
              : 'Network error resuming order payment.'
          );
        }
      } finally {
        if (!cancelled) setRetryLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [route, user, authLoading, navigate, lang]);

  const cartCourses = useMemo(
    () => courses.filter((c) => cart.includes(c.id)),
    [courses, cart]
  );
  const alreadyOwnedInCart = useMemo(
    () => cartCourses.filter((c) => ownedCourseIds.includes(c.id)),
    [cartCourses, ownedCourseIds]
  );
  const totalToman = useMemo(
    () => cartCourses.reduce((sum, c) => sum + c.priceToman, 0),
    [cartCourses]
  );

  const handleProceedToPayment = async () => {
    setError('');
    if (!user) {
      navigate('/auth?next=/checkout');
      return;
    }
    if (alreadyOwnedInCart.length > 0) {
      setError(
        lang === 'fa'
          ? 'برخی دوره‌های سبد خرید قبلاً توسط شما خریداری شده‌اند. لطفاً ابتدا آن‌ها را حذف کنید.'
          : 'Please remove courses you already own before creating an order.'
      );
      return;
    }
    setLoading(true);
    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseIds: cartCourses.map((c) => c.id) }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setError(orderData.error || 'Could not create order.');
        return;
      }

      const initRes = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderData.order.id }),
      });
      const initData = await initRes.json();
      if (!initRes.ok) {
        setError(initData.error || 'Payment initiation failed.');
        return;
      }

      setActiveOrder(orderData.order);
      setAuthority(initData.authority);
      setGatewayMode(initData.gateway === 'zarinpal-live' ? 'zarinpal-live' : 'zarinpal-sandbox');
      setStep('gateway');
    } catch {
      setError(lang === 'fa' ? 'خطا در اتصال به درگاه پرداخت.' : 'Network error initiating checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetrySameOrder = async () => {
    if (!activeOrder) return;
    setLoading(true);
    setError('');
    try {
      const initRes = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: activeOrder.id }),
      });
      const initData = await initRes.json();
      if (!initRes.ok) {
        setError(initData.error || 'Could not re-initiate payment.');
        return;
      }
      setAuthority(initData.authority);
      setGatewayMode(initData.gateway === 'zarinpal-live' ? 'zarinpal-live' : 'zarinpal-sandbox');
      setStep('gateway');
    } catch {
      setError(lang === 'fa' ? 'خطای شبکه هنگام شروع مجدد درگاه.' : 'Network error retrying payment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxVerify = async (outcome: 'success' | 'failed') => {
    if (!activeOrder) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeOrder.id,
          authority,
          outcome,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Verification failed.');
        return;
      }
      setActiveOrder(data.order);
      setResultStatus(data.verified ? 'paid' : 'failed');
      setStep('result');
      if (data.verified) {
        clearCart();
      }
    } catch {
      setError(lang === 'fa' ? 'خطا در تأیید تراکنش بانکی.' : 'Network error verifying transaction.');
    } finally {
      setLoading(false);
    }
  };

  const stepsMeta = [
    { id: 'cart' as const, index: '01', fa: 'سبد خرید', en: 'Shopping Bag' },
    { id: 'gateway' as const, index: '02', fa: 'درگاه پرداخت', en: 'Payment Terminal' },
    { id: 'result' as const, index: '03', fa: 'تأیید تراکنش', en: 'Verification' },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] min-h-[85vh]">
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        {/* Header + 3-Step Indicator */}
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-mono-tech text-[#223981] font-semibold">
              ISB ACADEMY CHECKOUT
            </p>
            <h1 className="text-3xl font-bold text-[#141923]">
              {step === 'cart'
                ? lang === 'fa'
                  ? 'سبد خرید و خلاصه سفارش'
                  : 'Shopping Bag & Order Summary'
                : step === 'gateway'
                ? lang === 'fa'
                  ? 'درگاه پرداخت امن زرین‌پال (Sandbox)'
                  : 'Zarinpal Payment Terminal (Sandbox)'
                : lang === 'fa'
                ? 'نتیجه و رسید تراکنش'
                : 'Transaction Verification & Receipt'}
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stepsMeta.map((s) => {
              const isCurrent = step === s.id;
              const isPast =
                (step === 'gateway' && s.id === 'cart') ||
                (step === 'result' && (s.id === 'cart' || s.id === 'gateway'));
              return (
                <div
                  key={s.id}
                  className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                    isCurrent
                      ? 'bg-[#223981] text-white border-[#223981] font-semibold'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                      : 'bg-white text-[#525C6E] border-black/10'
                  }`}
                >
                  <span className="font-mono-tech text-[11px]">{s.index}</span>
                  <span className="truncate">{lang === 'fa' ? s.fa : s.en}</span>
                </div>
              );
            })}
          </div>
        </div>

        {error && <IsbStatusNotice tone="error">{error}</IsbStatusNotice>}

        {retryLoading && (
          <div className="bg-white border border-black/10 rounded-xl p-10 text-center space-y-3" aria-busy="true">
            <RefreshCw className="w-7 h-7 text-[#223981] mx-auto animate-spin" />
            <p className="text-sm text-[#525C6E]">
              {lang === 'fa'
                ? 'در حال بازیابی سفارش و ایجاد توکن درگاه پرداخت...'
                : 'Loading your order and initializing gateway session...'}
            </p>
          </div>
        )}

        {/* STEP 1: SHOPPING BAG */}
        {!retryLoading && step === 'cart' && (
          <div className="bg-white border border-black/10 rounded-xl p-6 lg:p-8 space-y-6">
            {cartCourses.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <BookOpen className="w-10 h-10 text-[#223981]/60 mx-auto" />
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-[#141923]">
                    {lang === 'fa' ? 'سبد خرید شما خالی است' : 'Your shopping bag is empty'}
                  </h2>
                  <p className="text-xs text-[#525C6E]">
                    {lang === 'fa'
                      ? 'برای خرید دوره‌های تخصصی مبحث ۱۹، شبیه‌سازی انرژی و سرو سبز وارد آکادمی شوید.'
                      : 'Explore ISB Academy courses to add training programs to your bag.'}
                  </p>
                </div>
                <IsbButton type="button" variant="primary" onClick={() => navigate('/academy')}>
                  {lang === 'fa' ? 'مشاهده دوره‌های آکادمی' : 'Explore ISB Academy'}
                </IsbButton>
              </div>
            ) : (
              <>
                {alreadyOwnedInCart.length > 0 && (
                  <IsbStatusNotice
                    tone="warning"
                    title={lang === 'fa' ? 'دوره تکراری در سبد' : 'Already Enrolled Course in Bag'}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span>
                        {lang === 'fa'
                          ? 'شما قبلاً این دوره را خریداری کرده‌اید و دسترسی آن در داشبورد فعال است.'
                          : 'You already have verified access to one or more courses in your bag.'}
                      </span>
                      <button
                        type="button"
                        onClick={() => alreadyOwnedInCart.forEach((c) => removeFromCart(c.id))}
                        className="font-bold underline cursor-pointer"
                      >
                        {lang === 'fa' ? 'حذف موارد خریداری‌شده' : 'Remove Owned Items'}
                      </button>
                    </div>
                  </IsbStatusNotice>
                )}

                <div className="divide-y divide-black/10">
                  {cartCourses.map((c) => {
                    const owned = ownedCourseIds.includes(c.id);
                    return (
                      <div key={c.id} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-16 h-12 rounded-md overflow-hidden bg-[#0B1536] shrink-0">
                            <SafeImage
                              src={c.posterImage}
                              alt={t(c.title, lang)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => navigate(`/academy/${c.slug}`)}
                              className="text-start text-sm font-bold text-[#141923] hover:text-[#223981] truncate block max-w-full cursor-pointer"
                            >
                              {t(c.title, lang)}
                            </button>
                            <div className="text-xs text-[#525C6E] mt-0.5 flex flex-wrap items-center gap-2">
                              <span>{t(c.duration, lang)}</span>
                              {owned && (
                                <span className="text-amber-700 font-semibold">
                                  · {lang === 'fa' ? 'قبلاً خریداری شده' : 'Already Owned'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-bold font-mono-tech text-[#223981] tabular-nums">
                            {formatPrice(c.priceToman)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(c.id)}
                            className="p-1.5 rounded-md text-[#525C6E] hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            aria-label={lang === 'fa' ? 'حذف دوره' : 'Remove item'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-black/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#525C6E]">
                    <span>{lang === 'fa' ? 'تعداد دوره‌ها' : 'Selected Courses'}</span>
                    <span className="font-mono-tech tabular-nums">{cartCourses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#141923]">
                      {lang === 'fa' ? 'مبلغ قابل پرداخت:' : 'Payable Total:'}
                    </span>
                    <span className="text-xl font-bold font-mono-tech text-[#223981] tabular-nums">
                      {formatPrice(totalToman)}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F2F4F8] text-xs text-[#525C6E] flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#03A54E] shrink-0 mt-0.5" />
                  <span>
                    {lang === 'fa'
                      ? 'محاسبه مبلغ به‌صورت کاملاً سمت سرور (Server-Authoritative) انجام می‌شود و تا دریافت کد تأیید ۱۰۰ از درگاه، منابع دوره باز نمی‌شوند.'
                      : 'Pricing is validated server-side. Course materials unlock strictly after server verification of gateway Status 100.'}
                  </span>
                </div>

                <IsbButton
                  type="button"
                  variant="accent"
                  size="lg"
                  fullWidth
                  onClick={handleProceedToPayment}
                  disabled={loading || alreadyOwnedInCart.length > 0}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {loading
                      ? lang === 'fa'
                        ? 'در حال ثبت سفارش...'
                        : 'Preparing Checkout...'
                      : user
                      ? lang === 'fa'
                        ? 'ثبت سفارش و اتصال به درگاه (Sandbox)'
                        : 'Create Order & Proceed to Gateway (Sandbox)'
                      : lang === 'fa'
                      ? 'ورود به حساب و تکمیل خرید'
                      : 'Sign In & Complete Purchase'}
                  </span>
                </IsbButton>
              </>
            )}
          </div>
        )}

        {/* STEP 2: GATEWAY PAYMENT TERMINAL */}
        {!retryLoading && step === 'gateway' && activeOrder && (
          <div className="bg-white border border-black/10 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#0B1536] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono-tech">
                <Lock className="w-4 h-4 text-[#03A54E]" />
                <span>
                  {gatewayMode === 'zarinpal-live'
                    ? 'ZARINPAL LIVE TERMINAL'
                    : 'ZARINPAL SANDBOX TERMINAL'}
                </span>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded bg-white/10 font-mono-tech">
                HTTPS · TLS VERIFIED
              </span>
            </div>

            <div className="p-6 lg:p-8 space-y-6">
              <IsbStatusNotice
                tone="info"
                title={
                  lang === 'fa'
                    ? 'حالت شبیه‌ساز درگاه پرداخت (Sandbox Environment)'
                    : 'Sandbox Payment Environment Active'
                }
              >
                {lang === 'fa'
                  ? 'در نبود کلید واقعی درگاه (ZARINPAL_MERCHANT_ID)، می‌توانید هر دو سناریوی «تراکنش موفق (کد ۱۰۰)» و «تراکنش ناموفق / لغو (کد ۲۲-)» را مستقیماً آزمایش کنید.'
                  : 'Running in isolated Sandbox mode until production ZARINPAL_MERCHANT_ID credentials are configured. Test both verified (Status 100) and cancelled/failed (Status -22) server verification paths.'}
              </IsbStatusNotice>

              <div className="rounded-lg border border-black/10 bg-[#FAFBFD] p-4 space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <span className="text-[#525C6E]">
                    {lang === 'fa' ? 'پذیرنده:' : 'Merchant:'}
                  </span>
                  <span className="font-semibold text-[#141923]">
                    {lang === 'fa' ? 'آکادمی گروه بنای پایدار ایران‌زمین (ISB)' : 'ISB Group Academy'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <span className="text-[#525C6E]">
                    {lang === 'fa' ? 'شماره سفارش:' : 'Order ID:'}
                  </span>
                  <span className="font-mono-tech font-bold text-[#141923]">{activeOrder.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <span className="text-[#525C6E]">
                    {lang === 'fa' ? 'توکن Authority:' : 'Gateway Authority:'}
                  </span>
                  <span className="font-mono-tech text-[#223981]">{authority}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <span className="text-[#525C6E]">
                    {lang === 'fa' ? 'اقلام سفارش:' : 'Courses:'}
                  </span>
                  <span className="font-medium text-[#141923] text-end max-w-[65%]">
                    {activeOrder.items
                      .map((i) => (lang === 'fa' ? i.titleFa : i.titleEn))
                      .join('، ')}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-semibold text-[#141923]">
                    {lang === 'fa' ? 'مبلغ تراکنش:' : 'Payable Amount:'}
                  </span>
                  <span className="font-mono-tech font-bold text-base text-[#223981] tabular-nums">
                    {formatPrice(activeOrder.totalToman)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <IsbButton
                  type="button"
                  variant="accent"
                  size="lg"
                  disabled={loading}
                  onClick={() => handleSandboxVerify('success')}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {loading
                      ? lang === 'fa'
                        ? 'در حال تأیید...'
                        : 'Verifying...'
                      : lang === 'fa'
                      ? 'پرداخت موفق (Status 100)'
                      : 'Simulate Verified Payment (100)'}
                  </span>
                </IsbButton>

                <IsbButton
                  type="button"
                  variant="danger"
                  size="lg"
                  disabled={loading}
                  onClick={() => handleSandboxVerify('failed')}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {lang === 'fa'
                      ? 'خطا / انصراف کاربر (Status -22)'
                      : 'Simulate Failed / Cancel (-22)'}
                  </span>
                </IsbButton>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: VERIFICATION RESULT */}
        {!retryLoading && step === 'result' && activeOrder && (
          <div className="bg-white border border-black/10 rounded-xl p-6 lg:p-10 space-y-6">
            {resultStatus === 'paid' ? (
              <>
                <div className="text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#03A54E] mx-auto" />
                  <h2 className="text-2xl font-bold text-[#141923]">
                    {lang === 'fa' ? 'تراکنش با موفقیت تأیید شد' : 'Transaction Verified & Courses Unlocked'}
                  </h2>
                  <p className="text-sm text-[#525C6E] max-w-md mx-auto">
                    {lang === 'fa'
                      ? 'کد پیگیری بانکی سمت سرور ثبت گردید و فایل‌ها، جزوه‌ها و پیگیری سرفصل‌ها برای حساب شما فعال شد.'
                      : 'Payment has been verified against the gateway. Course materials, workbooks, and progress tracking are now active.'}
                  </p>
                </div>

                {/* Official Receipt Table */}
                <div className="rounded-xl bg-[#FAFBFD] border border-black/10 p-5 space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-black/5">
                    <span className="text-[#525C6E]">{lang === 'fa' ? 'شماره سفارش:' : 'Order ID:'}</span>
                    <span className="font-mono-tech font-bold text-[#141923]">{activeOrder.id}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-black/5">
                    <span className="text-[#525C6E]">{lang === 'fa' ? 'کد رهگیری (RefID):' : 'Ref ID:'}</span>
                    <span className="font-mono-tech font-bold text-[#027A3B] tabular-nums">
                      {activeOrder.refId}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-black/5">
                    <span className="text-[#525C6E]">{lang === 'fa' ? 'شناسه Authority:' : 'Authority:'}</span>
                    <span className="font-mono-tech text-[#141923]">{activeOrder.authority}</span>
                  </div>
                  {activeOrder.cardMask && (
                    <div className="flex justify-between py-1.5 border-b border-black/5">
                      <span className="text-[#525C6E]">{lang === 'fa' ? 'شماره کارت:' : 'Card Mask:'}</span>
                      <span className="font-mono-tech text-[#141923]" dir="ltr">
                        {activeOrder.cardMask}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-1.5 border-b border-black/5">
                    <span className="text-[#525C6E]">{lang === 'fa' ? 'وضعیت درگاه:' : 'Gateway Code:'}</span>
                    <span className="font-mono-tech font-semibold text-emerald-700">
                      Status {activeOrder.gatewayStatus || '100'} · {activeOrder.gatewayMessage || 'Verified'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1.5">
                    <span className="font-semibold text-[#141923]">
                      {lang === 'fa' ? 'مبلغ پرداخت‌شده:' : 'Total Paid:'}
                    </span>
                    <span className="font-mono-tech font-bold text-[#223981] tabular-nums">
                      {formatPrice(activeOrder.totalToman)}
                    </span>
                  </div>
                </div>

                {/* Unlocked Course Quick Links */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-mono-tech font-semibold text-[#525C6E]">
                    {lang === 'fa' ? 'دوره‌های فعال‌شده:' : 'UNLOCKED COURSES:'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeOrder.items.map((item) => {
                      const courseObj = courses.find((c) => c.id === item.courseId);
                      return (
                        <button
                          key={item.courseId}
                          type="button"
                          onClick={() =>
                            navigate(courseObj ? `/academy/${courseObj.slug}` : '/dashboard')
                          }
                          className="p-3.5 rounded-lg border border-black/10 bg-white hover:border-[#03A54E] text-start flex items-center justify-between gap-2 cursor-pointer transition-colors"
                        >
                          <span className="text-xs font-bold text-[#141923] line-clamp-1">
                            {lang === 'fa' ? item.titleFa : item.titleEn}
                          </span>
                          <ArrowIcon className="w-3.5 h-3.5 text-[#03A54E] shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <IsbButton type="button" variant="primary" size="lg" onClick={() => navigate('/dashboard')}>
                    {lang === 'fa' ? 'ورود به داشبورد آموزشی و دانلود فایل‌ها' : 'Open Dashboard & Downloads'}
                  </IsbButton>
                </div>
              </>
            ) : (
              <div className="text-center space-y-5">
                <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#141923]">
                    {lang === 'fa' ? 'پرداخت ناموفق یا لغو شد' : 'Payment Failed or Cancelled'}
                  </h2>
                  <p className="text-sm text-[#525C6E] max-w-md mx-auto">
                    {lang === 'fa'
                      ? 'تراکنش توسط درگاه تأیید نشد و دسترسی دوره فعال نگردید. سفارش شما با وضعیت Failed ثبت شده و می‌توانید مجدداً تلاش کنید.'
                      : 'The gateway rejected or cancelled verification, so paid course access remains locked. You can retry the gateway immediately.'}
                  </p>
                </div>

                <div className="max-w-md mx-auto rounded-lg bg-[#FEF2F2] border border-[#FECACA] p-3.5 text-xs font-mono-tech text-[#991B1B] space-y-1">
                  <div>Order: {activeOrder.id}</div>
                  <div>
                    Status: {activeOrder.gatewayStatus || '-22'} ·{' '}
                    {activeOrder.gatewayMessage || 'Transaction Cancelled / Verification Failed'}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <IsbButton
                    type="button"
                    variant="accent"
                    disabled={loading}
                    onClick={handleRetrySameOrder}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'تلاش مجدد پرداخت' : 'Retry Payment Gateway'}</span>
                  </IsbButton>
                  <IsbButton type="button" variant="secondary" onClick={() => setStep('cart')}>
                    {lang === 'fa' ? 'بازگشت به سبد خرید' : 'Return to Bag'}
                  </IsbButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
