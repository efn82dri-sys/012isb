import React, { useCallback, useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  LogOut,
  MailCheck,
  Receipt,
  RefreshCw,
  Settings,
  ShieldCheck,
  Square,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { CourseResource, Enrollment, Order } from '../types/isb';
import { IsbButton, IsbField, IsbStatusNotice } from '../design-system/components';

export const DashboardPage: React.FC = () => {
  const { lang, user, authLoading, navigate, logout, courses, formatPrice, refreshAuth } =
    useApp();

  const [tab, setTab] = useState<'courses' | 'certificates' | 'orders' | 'profile'>('courses');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashLoading, setDashLoading] = useState<boolean>(true);
  const [dashError, setDashError] = useState<string>('');

  const [busyModuleKey, setBusyModuleKey] = useState<string | null>(null);
  const [moduleError, setModuleError] = useState<string>('');

  // Expandable protected materials panel per enrolled course
  const [expandedCourseMaterials, setExpandedCourseMaterials] = useState<Record<string, boolean>>({});
  const [courseResourcesMap, setCourseResourcesMap] = useState<Record<string, CourseResource[]>>({});
  const [resourcesLoadingId, setResourcesLoadingId] = useState<string | null>(null);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  // Email verification inline state for newly registered unverified users
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyFeedback, setVerifyFeedback] = useState('');
  const [verifySandboxCode, setVerifySandboxCode] = useState('');

  // Profile form state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  const loadDashboard = useCallback(async () => {
    if (!user) return;
    setDashLoading(true);
    setDashError('');
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (!res.ok) {
        setDashError(
          data.error ||
            (lang === 'fa' ? 'خطا در دریافت اطلاعات داشبورد.' : 'Failed to load dashboard data.')
        );
        return;
      }
      setEnrollments(data.enrollments || []);
      setOrders(data.orders || []);
    } catch {
      setDashError(
        lang === 'fa'
          ? 'خطای شبکه در ارتباط با سرور آکادمی.'
          : 'Network error fetching dashboard.'
      );
    } finally {
      setDashLoading(false);
    }
  }, [user, lang]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?next=/dashboard');
      return;
    }
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || '');
      loadDashboard();
    }
  }, [user, authLoading, navigate, loadDashboard]);

  const toggleModule = async (courseId: string, moduleIndex: number) => {
    const key = `${courseId}:${moduleIndex}`;
    setBusyModuleKey(key);
    setModuleError('');
    try {
      const res = await fetch(`/api/enrollments/${courseId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleIndex }),
      });
      const data = await res.json();
      if (!res.ok) {
        setModuleError(
          data.error ||
            (lang === 'fa'
              ? 'امکان به‌روزرسانی پیشرفت این سرفصل وجود ندارد.'
              : 'Could not update module progress.')
        );
        return;
      }
      setEnrollments((prev) =>
        prev.map((e) => (e.courseId === courseId ? data.enrollment : e))
      );
    } catch {
      setModuleError(
        lang === 'fa' ? 'خطا در ثبت پیشرفت سرفصل.' : 'Network error updating progress.'
      );
    } finally {
      setBusyModuleKey(null);
    }
  };

  const toggleCourseMaterials = async (courseId: string, courseSlug: string) => {
    const nextOpen = !expandedCourseMaterials[courseId];
    setExpandedCourseMaterials((prev) => ({ ...prev, [courseId]: nextOpen }));
    if (!nextOpen || courseResourcesMap[courseId]) return;

    setResourcesLoadingId(courseId);
    try {
      const res = await fetch(`/api/courses/${courseSlug}/materials`);
      if (res.ok) {
        const data = await res.json();
        setCourseResourcesMap((prev) => ({ ...prev, [courseId]: data.resources || [] }));
      }
    } finally {
      setResourcesLoadingId(null);
    }
  };

  const handleDownloadMaterial = async (courseSlug: string, resItem: CourseResource) => {
    const key = `${courseSlug}:${resItem.id}`;
    setDownloadingKey(key);
    try {
      const res = await fetch(`/api/courses/${courseSlug}/materials/${resItem.id}/download`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setDashError(err.error || 'Download unauthorized.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${courseSlug}-${resItem.id}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setDashError(lang === 'fa' ? 'خطا در دانلود فایل دوره.' : 'Network error downloading file.');
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleResendCode = async () => {
    setVerifyBusy(true);
    setVerifyFeedback('');
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setVerifySandboxCode(data.sandboxVerificationCode || '');
        setVerifyFeedback(
          lang === 'fa' ? 'کد تأیید جدید صادر شد.' : 'New verification code generated.'
        );
      }
    } finally {
      setVerifyBusy(false);
    }
  };

  const handleInlineVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyBusy(true);
    setVerifyFeedback('');
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verifyCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVerifyFeedback(data.error || 'Verification failed.');
      } else {
        await refreshAuth();
        setVerifyCode('');
        setVerifySandboxCode('');
      }
    } finally {
      setVerifyBusy(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(false);
    setProfileError('');
    setProfileSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileName, phone: profilePhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(
          data.error || (lang === 'fa' ? 'خطا در ذخیره پروفایل.' : 'Profile update failed.')
        );
      } else {
        await refreshAuth();
        setProfileSaved(true);
      }
    } catch {
      setProfileError(lang === 'fa' ? 'خطای شبکه.' : 'Network error.');
    } finally {
      setProfileSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="pt-28 pb-20 bg-[#FAFBFD] min-h-[85vh]">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-6" aria-busy="true">
          <div className="h-32 rounded-xl bg-[#0B1536]/15 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-white border border-black/10 animate-pulse" />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-white border border-black/10 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const certificates = enrollments.filter((e) => e.certificateCode);
  const completedCoursesCount = enrollments.filter((e) => e.progressPercent === 100).length;
  const paidOrdersCount = orders.filter((o) => o.status === 'paid').length;
  const isStaff = user.role === 'instructor' || user.role === 'admin';

  return (
    <div className="pt-24 pb-20 bg-[#FAFBFD] min-h-[85vh]">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-8">
        {/* Account Header Banner */}
        <div className="bg-[#0B1536] text-white rounded-xl p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#7FE0A9] font-mono-tech">
              <span>{user.role.toUpperCase()}</span>
              <span>·</span>
              <span dir="ltr">{user.email}</span>
              {user.emailVerified && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-[#4ADE80]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED</span>
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">{user.name}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user.role === 'admin' && (
              <IsbButton type="button" variant="accent" size="sm" onClick={() => navigate('/admin')}>
                {lang === 'fa' ? 'پنل مدیریت CMS' : 'Open Admin CMS'}
              </IsbButton>
            )}
            <IsbButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/academy')}
            >
              {lang === 'fa' ? 'مرور دوره‌های آکادمی' : 'Browse Academy'}
            </IsbButton>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-md bg-white/10 text-white text-xs font-semibold hover:bg-white/20 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'خروج' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Email Verification Reminder Banner */}
        {!user.emailVerified && (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-[#92400E]">
                <MailCheck className="w-4 h-4 shrink-0" />
                <span>
                  {lang === 'fa'
                    ? 'ایمیل حساب کاربری شما هنوز تأیید نشده است'
                    : 'Verify your email address'}
                </span>
              </div>
              <p className="text-xs text-[#92400E]/90">
                {lang === 'fa'
                  ? 'برای تکمیل امنیت حساب و صدور گواهینامه‌های رسمی آکادمی، کد ۶ رقمی ارسال‌شده را ثبت کنید.'
                  : 'Confirm your 6-digit verification code for certificate issuance and account security.'}
                {verifySandboxCode && (
                  <span className="font-mono-tech font-bold ms-2">
                    ({verifySandboxCode})
                  </span>
                )}
                {verifyFeedback && <span className="ms-2 font-semibold">· {verifyFeedback}</span>}
              </p>
            </div>

            <form onSubmit={handleInlineVerify} className="flex flex-wrap items-center gap-2 shrink-0">
              <input
                type="text"
                required
                dir="ltr"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="123456"
                className="h-9 w-28 px-3 text-xs font-mono-tech bg-white border border-amber-300 rounded-md"
              />
              <IsbButton type="submit" size="sm" variant="accent" disabled={verifyBusy}>
                {lang === 'fa' ? 'تأیید' : 'Verify'}
              </IsbButton>
              <IsbButton
                type="button"
                size="sm"
                variant="secondary"
                disabled={verifyBusy}
                onClick={handleResendCode}
              >
                {lang === 'fa' ? 'ارسال کد' : 'Send Code'}
              </IsbButton>
            </form>
          </div>
        )}

        {/* Grounded Summary Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: lang === 'fa' ? 'دوره‌های فعال' : 'Enrolled Courses',
              value: enrollments.length,
            },
            {
              label: lang === 'fa' ? 'دوره‌های تکمیل‌شده' : 'Completed Courses',
              value: completedCoursesCount,
            },
            {
              label: lang === 'fa' ? 'گواهینامه‌های صادره' : 'Certificates Earned',
              value: certificates.length,
            },
            {
              label: lang === 'fa' ? 'تراکنش‌های موفق' : 'Verified Orders',
              value: paidOrdersCount,
            },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-black/10 rounded-xl p-5 space-y-1">
              <div className="text-xs text-[#525C6E] font-medium">{stat.label}</div>
              <div className="text-2xl font-bold font-mono-tech text-[#141923] tabular-nums">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {dashError && (
          <IsbStatusNotice tone="error" title={lang === 'fa' ? 'خطای سامانه' : 'Dashboard Error'}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>{dashError}</span>
              <button
                type="button"
                onClick={loadDashboard}
                className="inline-flex items-center gap-1 font-bold underline cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'بارگذاری مجدد' : 'Retry'}</span>
              </button>
            </div>
          </IsbStatusNotice>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            {
              id: 'courses' as const,
              icon: BookOpen,
              fa: `دوره‌های من (${enrollments.length})`,
              en: `My Courses (${enrollments.length})`,
            },
            {
              id: 'certificates' as const,
              icon: Award,
              fa: `گواهینامه‌ها (${certificates.length})`,
              en: `Certificates (${certificates.length})`,
            },
            {
              id: 'orders' as const,
              icon: Receipt,
              fa: `سفارش‌ها و رسیدها (${orders.length})`,
              en: `Orders & Receipts (${orders.length})`,
            },
            {
              id: 'profile' as const,
              icon: Settings,
              fa: 'تنظیمات پروفایل',
              en: 'Profile Settings',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  tab === item.id
                    ? 'bg-[#223981] text-white'
                    : 'bg-white border border-black/10 text-[#525C6E] hover:text-[#141923]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{lang === 'fa' ? item.fa : item.en}</span>
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {dashLoading ? (
          <div className="space-y-4" aria-busy="true">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-48 rounded-xl bg-white border border-black/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* TAB 1: MY COURSES */}
            {tab === 'courses' && (
              <div className="space-y-6">
                {moduleError && <IsbStatusNotice tone="error">{moduleError}</IsbStatusNotice>}

                {/* Staff Teaching Portal Banner for Instructor / Admin RBAC */}
                {isStaff && (
                  <div className="bg-white border border-[#223981]/25 rounded-xl p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-[#03A54E]" />
                        <div>
                          <h2 className="text-base font-bold text-[#141923]">
                            {user.role === 'admin'
                              ? lang === 'fa'
                                ? 'دسترسی کامل کادر مدیریت به منابع تمامی دوره‌ها'
                                : 'Admin Teaching & Resource Inspection Access'
                              : lang === 'fa'
                              ? 'پنل مدرس: دسترسی مستقیم به منابع تخصصی دوره‌ها'
                              : 'Instructor Access: Course Materials & Workbooks'}
                          </h2>
                          <p className="text-xs text-[#525C6E]">
                            {lang === 'fa'
                              ? 'حساب‌های دارای نقش مدرس یا ادمین می‌توانند فایل‌های تمامی دوره‌های منتشرشده را بررسی و دانلود کنند.'
                              : 'Accounts with Instructor or Admin privileges have verified access to inspect all course resource packages.'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {courses.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => navigate(`/academy/${c.slug}`)}
                          className="p-3.5 rounded-lg border border-black/10 bg-[#FAFBFD] hover:border-[#223981]/40 text-start cursor-pointer transition-colors"
                        >
                          <div className="text-xs font-bold text-[#141923] line-clamp-1">
                            {t(c.title, lang)}
                          </div>
                          <div className="text-[11px] text-[#223981] font-semibold mt-1">
                            {lang === 'fa' ? 'مشاهده و دانلود منابع →' : 'Inspect Materials →'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {enrollments.length === 0 ? (
                  <div className="p-10 bg-white border border-black/10 rounded-xl text-center space-y-4">
                    <BookOpen className="w-10 h-10 text-[#223981]/60 mx-auto" />
                    <div className="space-y-1">
                      <h2 className="text-base font-bold text-[#141923]">
                        {lang === 'fa'
                          ? 'هنوز دوره خریداری‌شده‌ای در حساب شما ثبت نشده است'
                          : 'No verified course enrollments yet'}
                      </h2>
                      <p className="text-xs text-[#525C6E]">
                        {lang === 'fa'
                          ? 'پس از انتخاب دوره و تکمیل پرداخت در درگاه، سرفصل‌ها و فایل‌های تخصصی در اینجا فعال می‌شوند.'
                          : 'Once you complete a verified course purchase, syllabus progress and downloadable workbooks appear here.'}
                      </p>
                    </div>
                    <IsbButton
                      type="button"
                      variant="primary"
                      onClick={() => navigate('/academy')}
                    >
                      {lang === 'fa' ? 'مشاهده دوره‌های آکادمی' : 'Browse ISB Academy'}
                    </IsbButton>
                  </div>
                ) : (
                  enrollments.map((enr) => {
                    const course = courses.find((c) => c.id === enr.courseId);
                    if (!course) return null;
                    const materialsExpanded = !!expandedCourseMaterials[course.id];
                    const resources = courseResourcesMap[course.id] || [];
                    const isLoadingRes = resourcesLoadingId === course.id;

                    return (
                      <div
                        key={enr.id}
                        className="bg-white border border-black/10 rounded-xl p-6 space-y-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <button
                              type="button"
                              onClick={() => navigate(`/academy/${course.slug}`)}
                              className="text-start text-lg font-bold text-[#141923] hover:text-[#223981] cursor-pointer"
                            >
                              {t(course.title, lang)}
                            </button>
                            <p className="text-xs text-[#525C6E] mt-1">
                              {t(course.instructor, lang)} · {t(course.duration, lang)}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-bold font-mono-tech text-[#027A3B] tabular-nums">
                              {enr.progressPercent}%
                            </span>
                            <IsbButton
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => toggleCourseMaterials(course.id, course.slug)}
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>
                                {lang === 'fa' ? 'فایل‌ها و جزوه‌ها' : 'Course Materials'}
                              </span>
                              {materialsExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </IsbButton>
                          </div>
                        </div>

                        <div className="w-full h-2 bg-[#F2F4F8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#03A54E] transition-all duration-300"
                            style={{ width: `${enr.progressPercent}%` }}
                          />
                        </div>

                        {/* Interactive Syllabus Modules */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {course.syllabus.map((mod, mIdx) => {
                            const done = enr.completedModules.includes(mIdx);
                            const isBusy = busyModuleKey === `${course.id}:${mIdx}`;
                            return (
                              <button
                                key={mIdx}
                                type="button"
                                disabled={isBusy}
                                onClick={() => toggleModule(course.id, mIdx)}
                                className={`p-3 rounded-lg border text-start flex items-center justify-between gap-2.5 text-xs cursor-pointer transition-colors disabled:opacity-60 ${
                                  done
                                    ? 'bg-[#03A54E]/10 border-[#03A54E]/30 text-[#141923]'
                                    : 'bg-[#FAFBFD] border-black/10 text-[#525C6E] hover:border-black/25'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {done ? (
                                    <CheckSquare className="w-4 h-4 text-[#03A54E] shrink-0" />
                                  ) : (
                                    <Square className="w-4 h-4 shrink-0" />
                                  )}
                                  <span className="font-medium">{t(mod.title, lang)}</span>
                                </div>
                                <span className="font-mono-tech text-[11px] opacity-75 shrink-0">
                                  {t(mod.duration, lang)}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Direct Course Downloads Drawer */}
                        {materialsExpanded && (
                          <div className="pt-4 border-t border-black/10 space-y-3">
                            <h3 className="text-xs font-mono-tech font-semibold text-[#223981]">
                              {lang === 'fa'
                                ? 'منابع قابل دانلود (تأییدشده برای شما):'
                                : 'VERIFIED COURSE DOWNLOADS:'}
                            </h3>
                            {isLoadingRes ? (
                              <div className="h-14 rounded-lg bg-[#F2F4F8] animate-pulse" />
                            ) : resources.length === 0 ? (
                              <p className="text-xs text-[#525C6E]">
                                {lang === 'fa'
                                  ? 'فایلی ثبت نشده است.'
                                  : 'No resources found.'}
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {resources.map((resItem) => {
                                  const dKey = `${course.slug}:${resItem.id}`;
                                  return (
                                    <div
                                      key={resItem.id}
                                      className="p-3.5 rounded-lg bg-[#FAFBFD] border border-black/10 flex items-center justify-between gap-3"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <FileText className="w-4 h-4 text-[#223981] shrink-0" />
                                        <div className="min-w-0">
                                          <div className="text-xs font-semibold text-[#141923] truncate">
                                            {t(resItem.title, lang)}
                                          </div>
                                          <div className="text-[11px] font-mono-tech text-[#525C6E] tabular-nums">
                                            {resItem.type} · {resItem.size}
                                          </div>
                                        </div>
                                      </div>
                                      <IsbButton
                                        type="button"
                                        size="sm"
                                        variant="primary"
                                        disabled={downloadingKey === dKey}
                                        onClick={() =>
                                          handleDownloadMaterial(course.slug, resItem)
                                        }
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>{lang === 'fa' ? 'دانلود' : 'Download'}</span>
                                      </IsbButton>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: CERTIFICATES */}
            {tab === 'certificates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.length === 0 ? (
                  <div className="col-span-full p-12 bg-white border border-black/10 rounded-xl text-center space-y-3">
                    <Award className="w-10 h-10 text-[#223981]/60 mx-auto" />
                    <h2 className="text-base font-bold text-[#141923]">
                      {lang === 'fa' ? 'هنوز گواهینامه‌ای صادر نشده است' : 'No certificates issued yet'}
                    </h2>
                    <p className="text-xs text-[#525C6E] max-w-md mx-auto">
                      {lang === 'fa'
                        ? 'با تکمیل ۱۰۰٪ سرفصل‌های هر دوره در تب «دوره‌های من»، گواهینامه دیجیتال با کد رهگیری یکتا در اینجا ظاهر می‌شود.'
                        : 'Complete 100% of a course’s modules under My Courses to automatically unlock your verifiable certificate.'}
                    </p>
                  </div>
                ) : (
                  certificates.map((cert) => {
                    const course = courses.find((c) => c.id === cert.courseId);
                    return (
                      <div
                        key={cert.id}
                        className="bg-white border-2 border-[#223981]/25 rounded-xl p-6 lg:p-8 space-y-4 relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono-tech text-[#027A3B] font-bold">
                            VERIFIED CERTIFICATE
                          </span>
                          <span className="text-xs font-mono-tech px-2.5 py-1 rounded bg-[#F2F4F8] text-[#223981] font-bold">
                            {cert.certificateCode}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-[#141923]">
                          {course && t(course.title, lang)}
                        </h3>
                        <div className="pt-2 border-t border-black/10 text-xs text-[#525C6E] space-y-1">
                          <div>
                            {lang === 'fa' ? 'صادر شده برای:' : 'Awarded to:'}{' '}
                            <strong className="text-[#141923]">{user.name}</strong>
                          </div>
                          <div>
                            {lang === 'fa' ? 'مرجع صادرکننده:' : 'Issuing Authority:'}{' '}
                            {lang === 'fa'
                              ? 'آکادمی تخصصی گروه بنای پایدار ایران‌زمین (ISB)'
                              : 'ISB Group Sustainable Building Academy'}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 3: ORDERS & RECEIPTS */}
            {tab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="p-12 bg-white border border-black/10 rounded-xl text-center space-y-3">
                    <Receipt className="w-10 h-10 text-[#223981]/60 mx-auto" />
                    <h2 className="text-base font-bold text-[#141923]">
                      {lang === 'fa' ? 'سفارشی ثبت نشده است' : 'No orders recorded yet'}
                    </h2>
                    <p className="text-xs text-[#525C6E]">
                      {lang === 'fa'
                        ? 'تمامی فاکتورها و کدهای پیگیری بانکی پس از ثبت سفارش در اینجا نگهداری می‌شوند.'
                        : 'All order receipts and gateway RefIDs appear here once checkout begins.'}
                    </p>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white border border-black/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="text-xs font-mono-tech text-[#223981] font-semibold flex flex-wrap items-center gap-2">
                          <span>{ord.id}</span>
                          {ord.refId && (
                            <>
                              <span>·</span>
                              <span className="text-[#027A3B]">RefID: {ord.refId}</span>
                            </>
                          )}
                          {ord.cardMask && (
                            <>
                              <span>·</span>
                              <span dir="ltr">{ord.cardMask}</span>
                            </>
                          )}
                        </div>
                        <div className="text-sm font-bold text-[#141923]">
                          {ord.items.map((i) => (lang === 'fa' ? i.titleFa : i.titleEn)).join('، ')}
                        </div>
                        <div className="text-xs text-[#525C6E] flex flex-wrap items-center gap-2">
                          <span>
                            {new Date(ord.createdAt).toLocaleDateString(
                              lang === 'fa' ? 'fa-IR' : 'en-US'
                            )}
                          </span>
                          <span>·</span>
                          <span className="font-mono-tech">{ord.gateway}</span>
                          {ord.gatewayMessage && (
                            <>
                              <span>·</span>
                              <span>{ord.gatewayMessage}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <span className="text-sm font-bold font-mono-tech text-[#141923] tabular-nums">
                          {formatPrice(ord.totalToman)}
                        </span>

                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded font-mono-tech ${
                            ord.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ord.status === 'failed'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {ord.status.toUpperCase()}
                        </span>

                        {(ord.status === 'pending' || ord.status === 'failed') && (
                          <IsbButton
                            type="button"
                            size="sm"
                            variant="accent"
                            onClick={() =>
                              navigate(`/checkout?retryOrderId=${encodeURIComponent(ord.id)}`)
                            }
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>{lang === 'fa' ? 'تکمیل / تلاش مجدد' : 'Complete Payment'}</span>
                          </IsbButton>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: PROFILE SETTINGS */}
            {tab === 'profile' && (
              <form
                onSubmit={handleSaveProfile}
                className="max-w-lg bg-white border border-black/10 rounded-xl p-6 lg:p-8 space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-[#141923]">
                    {lang === 'fa' ? 'ویرایش اطلاعات کاربری' : 'Update Account Profile'}
                  </h2>
                  <p className="text-xs text-[#525C6E]">
                    {lang === 'fa'
                      ? 'نام درج‌شده در این بخش عیناً روی گواهینامه‌های آکادمی چاپ می‌شود.'
                      : 'Your display name appears directly on issued ISB Academy certificates.'}
                  </p>
                </div>

                {profileError && <IsbStatusNotice tone="error">{profileError}</IsbStatusNotice>}
                {profileSaved && (
                  <IsbStatusNotice tone="success">
                    {lang === 'fa' ? 'تغییرات پروفایل با موفقیت ذخیره شد.' : 'Profile updated successfully.'}
                  </IsbStatusNotice>
                )}

                <IsbField
                  label={lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />

                <IsbField
                  label={lang === 'fa' ? 'شماره تماس' : 'Phone'}
                  type="tel"
                  ltr
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                />

                <IsbButton type="submit" variant="primary" disabled={profileSaving}>
                  {profileSaving
                    ? lang === 'fa'
                      ? 'در حال ذخیره...'
                      : 'Saving...'
                    : lang === 'fa'
                    ? 'ذخیره اطلاعات'
                    : 'Save Changes'}
                </IsbButton>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
