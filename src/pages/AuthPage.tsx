import React, { useState } from 'react';
import { KeyRound, LogOut, MailCheck, RefreshCw, ShieldCheck, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IsbButton, IsbField, IsbStatusNotice } from '../design-system/components';

export const AuthPage: React.FC = () => {
  const { lang, navigate, refreshAuth, user, authLoading, logout } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [sandboxHint, setSandboxHint] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [needsVerify, setNeedsVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const params = new URLSearchParams(window.location.search);
  const nextPath = params.get('next') || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (lang === 'fa' ? 'ورود ناموفق بود.' : 'Login failed.'));
      } else {
        await refreshAuth();
        navigate(data.user.role === 'admin' && !params.get('next') ? '/admin' : nextPath);
      }
    } catch {
      setError(lang === 'fa' ? 'خطا در برقراری ارتباط با سرور.' : 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (lang === 'fa' ? 'ثبت‌نام ناموفق بود.' : 'Registration failed.'));
      } else {
        await refreshAuth();
        setNeedsVerify(true);
        setSandboxHint(data.sandboxVerificationCode || '');
        setMessage(
          lang === 'fa'
            ? 'حساب کاربری ایجاد شد. لطفاً کد ۶ رقمی تأیید ایمیل را وارد کنید.'
            : 'Account created. Enter your 6-digit verification code to activate full access.'
        );
      }
    } catch {
      setError(lang === 'fa' ? 'خطا در برقراری ارتباط با سرور.' : 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verifyCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (lang === 'fa' ? 'کد تأیید معتبر نیست.' : 'Verification failed.'));
      } else {
        await refreshAuth();
        setNeedsVerify(false);
        navigate(nextPath);
      }
    } catch {
      setError(lang === 'fa' ? 'خطا در ارتباط با سرور.' : 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setMessage('');
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not resend verification code.');
      } else {
        setSandboxHint(data.sandboxVerificationCode || '');
        setMessage(
          lang === 'fa'
            ? 'کد تأیید جدید صادر شد.'
            : 'A new 6-digit verification code has been issued.'
        );
      }
    } catch {
      setError(lang === 'fa' ? 'خطا در ارتباط با سرور.' : 'Network error.');
    } finally {
      setResending(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (!sandboxHint && !resetToken) {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to generate reset token.');
        } else {
          if (data.sandboxResetToken) {
            setSandboxHint(data.sandboxResetToken);
          }
          setMessage(
            lang === 'fa'
              ? 'کد بازیابی رمز عبور صادر شد. کد و رمز جدید را وارد کنید.'
              : 'Reset code generated. Enter the code and your new password below.'
          );
        }
      } else {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token: resetToken.trim(), newPassword: password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || (lang === 'fa' ? 'تغییر رمز ناموفق بود.' : 'Reset failed.'));
        } else {
          setMode('login');
          setResetToken('');
          setSandboxHint('');
          setPassword('');
          setMessage(
            lang === 'fa'
              ? 'رمز عبور با موفقیت تغییر یافت. اکنون وارد شوید.'
              : 'Password updated successfully. Please sign in.'
          );
        }
      }
    } catch {
      setError(lang === 'fa' ? 'خطا در ارتباط با سرور.' : 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setMode('login');
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setMessage('');
  };

  // Already signed-in session state (when not actively finalizing verification screen from registration)
  if (!authLoading && user && !needsVerify) {
    return (
      <div className="pt-28 pb-20 bg-[#FAFBFD] min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-black/10 rounded-xl p-6 lg:p-8 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#027A3B] font-semibold">
              <UserCheck className="w-4 h-4" />
              <span>ACTIVE SESSION · {user.role.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#141923]">{user.name}</h1>
            <p className="text-xs font-mono-tech text-[#525C6E]" dir="ltr">
              {user.email}
            </p>
          </div>

          {error && <IsbStatusNotice tone="error">{error}</IsbStatusNotice>}
          {message && <IsbStatusNotice tone="success">{message}</IsbStatusNotice>}

          {!user.emailVerified && (
            <div className="p-4 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#92400E]">
                <MailCheck className="w-4 h-4 shrink-0" />
                <span>
                  {lang === 'fa'
                    ? 'ایمیل حساب شما هنوز تأیید نشده است.'
                    : 'Your email address is pending verification.'}
                </span>
              </div>
              {sandboxHint && (
                <div className="p-2.5 rounded bg-white border border-black/10 text-xs text-[#223981]">
                  {lang === 'fa' ? 'کد تأیید:' : 'Sandbox code:'}{' '}
                  <span className="font-mono-tech font-bold">{sandboxHint}</span>
                </div>
              )}
              <form onSubmit={handleVerifyEmail} className="space-y-2.5">
                <IsbField
                  label={lang === 'fa' ? 'کد ۶ رقمی تأیید' : '6-Digit Code'}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  required
                  ltr
                  placeholder="123456"
                />
                <div className="flex items-center gap-2">
                  <IsbButton type="submit" size="sm" variant="accent" disabled={loading}>
                    {loading
                      ? lang === 'fa'
                        ? 'در حال بررسی...'
                        : 'Verifying...'
                      : lang === 'fa'
                      ? 'تأیید ایمیل'
                      : 'Verify Email'}
                  </IsbButton>
                  <IsbButton
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={resending}
                    onClick={handleResendVerification}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'ارسال مجدد کد' : 'Resend Code'}</span>
                  </IsbButton>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2.5">
            <IsbButton
              type="button"
              variant="primary"
              fullWidth
              onClick={() => navigate(user.role === 'admin' ? '/admin' : nextPath)}
            >
              {user.role === 'admin'
                ? lang === 'fa'
                  ? 'ورود به پنل مدیریت CMS'
                  : 'Open Admin CMS'
                : lang === 'fa'
                ? 'ورود به داشبورد کاربری'
                : 'Go to Learning Dashboard'}
            </IsbButton>
            {user.role === 'admin' && (
              <IsbButton
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => navigate('/dashboard')}
              >
                {lang === 'fa' ? 'مشاهده داشبورد آموزشی' : 'View Academy Dashboard'}
              </IsbButton>
            )}
            <IsbButton
              type="button"
              variant="ghost"
              fullWidth
              onClick={async () => {
                await logout();
                setSandboxHint('');
                setMessage('');
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'خروج و تغییر حساب کاربری' : 'Sign Out & Switch Account'}</span>
            </IsbButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#FAFBFD] min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-black/10 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="space-y-1.5">
          <p className="text-xs font-mono-tech text-[#223981] font-semibold">
            ISB ACADEMY ACCOUNT
          </p>
          <h1 className="text-2xl font-bold text-[#141923]">
            {needsVerify
              ? lang === 'fa'
                ? 'تأیید ایمیل حساب کاربری'
                : 'Verify Your Email'
              : mode === 'login'
              ? lang === 'fa'
                ? 'ورود به حساب کاربری'
                : 'Sign In to ISB'
              : mode === 'register'
              ? lang === 'fa'
                ? 'ایجاد حساب دانشجویی'
                : 'Create Student Account'
              : lang === 'fa'
              ? 'بازیابی رمز عبور'
              : 'Reset Password'}
          </h1>
        </div>

        {error && <IsbStatusNotice tone="error">{error}</IsbStatusNotice>}
        {message && <IsbStatusNotice tone="success">{message}</IsbStatusNotice>}

        {needsVerify ? (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            {sandboxHint && (
              <div className="p-3.5 rounded-lg bg-[#F2F4F8] border border-black/10 text-xs text-[#223981] space-y-1">
                <div className="font-semibold">
                  {lang === 'fa' ? 'کد تأیید محیط آزمایشی:' : 'Sandbox verification code:'}
                </div>
                <div className="font-mono-tech text-base font-bold tracking-widest">
                  {sandboxHint}
                </div>
              </div>
            )}

            <IsbField
              label={lang === 'fa' ? 'کد ۶ رقمی تأیید' : '6-Digit Verification Code'}
              type="text"
              required
              ltr
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="123456"
            />

            <IsbButton type="submit" variant="accent" fullWidth disabled={loading}>
              {loading
                ? lang === 'fa'
                  ? 'در حال تأیید...'
                  : 'Verifying...'
                : lang === 'fa'
                ? 'تأیید ایمیل و ورود به داشبورد'
                : 'Verify & Continue'}
            </IsbButton>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                disabled={resending}
                onClick={handleResendVerification}
                className="inline-flex items-center gap-1.5 text-[#223981] font-semibold hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  {resending
                    ? lang === 'fa'
                      ? 'در حال ارسال...'
                      : 'Sending...'
                    : lang === 'fa'
                    ? 'ارسال مجدد کد'
                    : 'Resend Code'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate(nextPath)}
                className="text-[#525C6E] hover:text-[#141923] cursor-pointer"
              >
                {lang === 'fa' ? 'ادامه بدون تأیید فعلی' : 'Continue to Dashboard'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#F2F4F8] rounded-lg text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setMessage('');
                }}
                className={`py-2 rounded-md font-semibold cursor-pointer ${
                  mode === 'login' ? 'bg-white text-[#141923] shadow-sm' : 'text-[#525C6E]'
                }`}
              >
                {lang === 'fa' ? 'ورود' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                  setMessage('');
                }}
                className={`py-2 rounded-md font-semibold cursor-pointer ${
                  mode === 'register' ? 'bg-white text-[#141923] shadow-sm' : 'text-[#525C6E]'
                }`}
              >
                {lang === 'fa' ? 'ثبت‌نام' : 'Register'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setError('');
                  setMessage('');
                }}
                className={`py-2 rounded-md font-semibold cursor-pointer ${
                  mode === 'forgot' ? 'bg-white text-[#141923] shadow-sm' : 'text-[#525C6E]'
                }`}
              >
                {lang === 'fa' ? 'بازیابی رمز' : 'Reset'}
              </button>
            </div>

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <IsbField
                  label={lang === 'fa' ? 'ایمیل' : 'Email'}
                  type="email"
                  required
                  ltr
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
                <IsbField
                  label={lang === 'fa' ? 'رمز عبور' : 'Password'}
                  type="password"
                  required
                  ltr
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <IsbButton type="submit" variant="primary" fullWidth disabled={loading}>
                  {loading
                    ? lang === 'fa'
                      ? 'در حال ورود...'
                      : 'Signing In...'
                    : lang === 'fa'
                    ? 'ورود به حساب'
                    : 'Sign In'}
                </IsbButton>

                {/* Role-Based Sandbox Quick-Fill Panel */}
                <div className="pt-4 border-t border-black/10 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#141923]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#03A54E]" />
                    <span>
                      {lang === 'fa'
                        ? 'حساب‌های آزمایشی کنترل دسترسی نقش‌محور (RBAC):'
                        : 'Sandbox Role-Based Accounts (Click to Fill):'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      {
                        roleFa: 'دانشجو (حساب استاندارد آکادمی)',
                        roleEn: 'Student (Standard Academy Role)',
                        email: 'student@isb.group',
                        pass: 'ISBStudent#2026',
                      },
                      {
                        roleFa: 'مدرس آکادمی (دسترسی منابع آموزشی)',
                        roleEn: 'Instructor (Teaching Materials)',
                        email: 'instructor@isb.group',
                        pass: 'ISBInstructor#2026',
                      },
                      {
                        roleFa: 'مدیر سیستم (پنل CMS و سفارش‌ها)',
                        roleEn: 'Admin (CMS & Full Access)',
                        email: 'admin@isb.group',
                        pass: 'ISBAdmin#2026',
                      },
                    ].map((acct) => (
                      <button
                        key={acct.email}
                        type="button"
                        onClick={() => fillDemoAccount(acct.email, acct.pass)}
                        className="p-2.5 rounded-lg border border-black/10 bg-[#FAFBFD] hover:border-[#223981]/40 text-start flex items-center justify-between gap-2 text-[11px] cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-[#141923]">
                            {lang === 'fa' ? acct.roleFa : acct.roleEn}
                          </div>
                          <div className="font-mono-tech text-[#525C6E]" dir="ltr">
                            {acct.email}
                          </div>
                        </div>
                        <KeyRound className="w-3.5 h-3.5 text-[#223981] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <IsbField
                  label={lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <IsbField
                  label={lang === 'fa' ? 'ایمیل' : 'Email'}
                  type="email"
                  required
                  ltr
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <IsbField
                  label={lang === 'fa' ? 'شماره تماس' : 'Phone'}
                  type="tel"
                  ltr
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0915..."
                />
                <IsbField
                  label={lang === 'fa' ? 'رمز عبور (حداقل ۶ کاراکتر)' : 'Password (min 6 chars)'}
                  type="password"
                  required
                  minLength={6}
                  ltr
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <IsbButton type="submit" variant="accent" fullWidth disabled={loading}>
                  {loading
                    ? lang === 'fa'
                      ? 'در حال ایجاد حساب...'
                      : 'Creating Account...'
                    : lang === 'fa'
                    ? 'ثبت‌نام و دریافت کد تأیید'
                    : 'Create Account'}
                </IsbButton>
              </form>
            )}

            {mode === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-4">
                {sandboxHint && (
                  <div className="p-3 rounded-md bg-[#F2F4F8] text-xs text-[#223981]">
                    {lang === 'fa' ? 'کد بازیابی آزمایشی:' : 'Sandbox reset code:'}{' '}
                    <span className="font-mono-tech font-bold">{sandboxHint}</span>
                  </div>
                )}

                <IsbField
                  label={lang === 'fa' ? 'ایمیل حساب کاربری' : 'Account Email'}
                  type="email"
                  required
                  ltr
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {sandboxHint && (
                  <>
                    <IsbField
                      label={lang === 'fa' ? 'کد بازیابی' : 'Reset Code'}
                      type="text"
                      required
                      ltr
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                    />
                    <IsbField
                      label={lang === 'fa' ? 'رمز عبور جدید' : 'New Password'}
                      type="password"
                      required
                      minLength={6}
                      ltr
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </>
                )}

                <IsbButton type="submit" variant="primary" fullWidth disabled={loading}>
                  {loading
                    ? lang === 'fa'
                      ? 'در حال پردازش...'
                      : 'Processing...'
                    : sandboxHint
                    ? lang === 'fa'
                      ? 'تغییر رمز عبور'
                      : 'Update Password'
                    : lang === 'fa'
                    ? 'ارسال کد بازیابی'
                    : 'Request Reset Code'}
                </IsbButton>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
