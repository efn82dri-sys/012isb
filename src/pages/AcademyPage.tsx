import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Lock,
  RefreshCw,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, uiText } from '../i18n/translations';
import { SafeImage } from '../components/SafeImage';
import { IsbButton, IsbStatusNotice } from '../design-system/components';
import { Course, CourseResource, TeamMember } from '../types/isb';

interface AcademyPageProps {
  slug?: string;
}

const FORMAT_LABELS: Record<Course['format'], { fa: string; en: string }> = {
  'live-online': { fa: 'آنلاین زنده', en: 'Live Online' },
  workshop: { fa: 'کارگاه تخصصی', en: 'Workshop' },
  recorded: { fa: 'ویدئویی ضبط‌شده', en: 'Recorded' },
};

const CATEGORY_TABS: { id: string; fa: string; en: string }[] = [
  { id: 'all', fa: 'همه دوره‌ها', en: 'All Courses' },
  { id: 'regulations', fa: 'مقررات ملی و مبحث ۱۹', en: 'Regulations & Ch.19' },
  { id: 'simulation', fa: 'شبیه‌سازی انرژی', en: 'Energy Simulation' },
  { id: 'green-building', fa: 'ساختمان و جداره‌های سبز', en: 'Green Building' },
  { id: 'certification', fa: 'گواهینامه سرو سبز', en: 'Sero Sabz Rating' },
];

function matchCourseInstructors(course: Course, team: TeamMember[]): TeamMember[] {
  const haystackEn = course.instructor.en.toLowerCase();
  const haystackFa = course.instructor.fa;
  return team.filter((member) => {
    const enLast = member.name.en.split(' ').filter((w) => w.length > 3).pop()?.toLowerCase() || '';
    const faLast = member.name.fa.split(' ').pop() || '';
    const matchesEn =
      member.name.en.toLowerCase() === haystackEn ||
      (enLast.length > 3 && haystackEn.includes(enLast));
    const matchesFa =
      member.name.fa === haystackFa || (faLast.length > 2 && haystackFa.includes(faLast));
    return matchesEn || matchesFa;
  });
}

export const AcademyPage: React.FC<AcademyPageProps> = ({ slug }) => {
  const {
    lang,
    courses,
    team,
    departments,
    contentLoading,
    navigate,
    addToCart,
    cart,
    user,
    formatPrice,
  } = useApp();

  const [category, setCategory] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [interest, setInterest] = useState<'architect' | 'energy' | 'developer'>('architect');
  const [selectedInstructor, setSelectedInstructor] = useState<TeamMember | null>(null);

  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [completedModuleMap, setCompletedModuleMap] = useState<Record<string, number[]>>({});

  const [materialsLoading, setMaterialsLoading] = useState<boolean>(false);
  const [materialsError, setMaterialsError] = useState<string>('');
  const [materialsLockedReason, setMaterialsLockedReason] = useState<'unauth' | 'unpaid' | null>(null);
  const [protectedResources, setProtectedResources] = useState<CourseResource[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setEnrolledIds([]);
      setCompletedModuleMap({});
      return;
    }
    fetch('/api/dashboard')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.enrollments) {
          setEnrolledIds(d.enrollments.map((e: { courseId: string }) => e.courseId));
          const map: Record<string, number[]> = {};
          for (const e of d.enrollments as { courseId: string; completedModules: number[] }[]) {
            map[e.courseId] = e.completedModules || [];
          }
          setCompletedModuleMap(map);
        }
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!selectedInstructor) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedInstructor(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedInstructor]);

  const activeCourse = slug ? courses.find((c) => c.slug === slug) : null;
  const isStaffAccess = user?.role === 'admin' || user?.role === 'instructor';
  const isStudentEnrolled = activeCourse ? enrolledIds.includes(activeCourse.id) : false;
  const hasCourseAccess = isStudentEnrolled || isStaffAccess;

  const fetchProtectedMaterials = useCallback(async () => {
    if (!activeCourse) return;
    setMaterialsLoading(true);
    setMaterialsError('');
    setMaterialsLockedReason(null);

    try {
      const res = await fetch(`/api/courses/${activeCourse.slug}/materials`);
      if (res.status === 401) {
        setMaterialsLockedReason('unauth');
        setProtectedResources([]);
        return;
      }
      if (res.status === 403) {
        setMaterialsLockedReason('unpaid');
        setProtectedResources([]);
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setMaterialsError(
          errData.error ||
            (lang === 'fa'
              ? 'خطا در دریافت منابع آموزشی دوره.'
              : 'Failed to load course materials.')
        );
        return;
      }
      const data = await res.json();
      setProtectedResources(Array.isArray(data.resources) ? data.resources : []);
    } catch {
      setMaterialsError(
        lang === 'fa'
          ? 'خطا در ارتباط با سرور برای دریافت منابع دوره.'
          : 'Network error while verifying material access.'
      );
    } finally {
      setMaterialsLoading(false);
    }
  }, [activeCourse, lang]);

  useEffect(() => {
    if (activeCourse) {
      fetchProtectedMaterials();
    } else {
      setProtectedResources([]);
      setMaterialsLockedReason(null);
      setMaterialsError('');
    }
  }, [activeCourse, user, fetchProtectedMaterials]);

  const handleDownloadResource = async (courseSlug: string, resItem: CourseResource) => {
    setDownloadingId(resItem.id);
    setMaterialsError('');
    try {
      const res = await fetch(`/api/courses/${courseSlug}/materials/${resItem.id}/download`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMaterialsError(
          data.error ||
            (lang === 'fa'
              ? 'امکان دانلود این فایل برای حساب شما فعال نیست.'
              : 'Download blocked or unauthorized.')
        );
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
      setMaterialsError(
        lang === 'fa'
          ? 'خطای شبکه هنگام دریافت فایل.'
          : 'Network error while downloading file.'
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // Resolve real ISB Academy instructors linked directly from team + courses
  const academyInstructors = useMemo(() => {
    const map = new Map<string, { member: TeamMember; taughtCourses: Course[] }>();
    for (const course of courses) {
      const matched = matchCourseInstructors(course, team);
      for (const m of matched) {
        const existing = map.get(m.id);
        if (existing) {
          existing.taughtCourses.push(course);
        } else {
          map.set(m.id, { member: m, taughtCourses: [course] });
        }
      }
    }
    return Array.from(map.values());
  }, [courses, team]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = courses.filter((c) => {
      if (category !== 'all' && c.category !== category) return false;
      if (formatFilter !== 'all' && c.format !== formatFilter) return false;
      if (q) {
        const hay = [
          c.title.fa,
          c.title.en,
          c.shortDescription.fa,
          c.shortDescription.en,
          c.instructor.fa,
          c.instructor.en,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.priceToman - b.priceToman);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.priceToman - a.priceToman);
    }
    return list;
  }, [courses, category, formatFilter, searchQuery, sortBy]);

  const recommendedCourse = useMemo(() => {
    if (interest === 'energy') {
      return courses.find((c) => c.slug === 'chapter-19-designbuilder') || courses[0];
    }
    if (interest === 'developer') {
      return courses.find((c) => c.slug === 'sero-sabz-rating-system') || courses[0];
    }
    return courses.find((c) => c.slug === 'green-facades-sustainable-architecture') || courses[0];
  }, [courses, interest]);

  const getDeptTitle = (deptId: string) => {
    const dept = departments.find((d) => d.id === deptId);
    return dept ? t(dept.title, lang) : deptId;
  };

  // ==========================
  // COURSE DETAIL PAGE VIEW
  // ==========================
  if (slug) {
    if (!activeCourse) {
      return (
        <div className="pt-32 pb-20 bg-[#FAFBFD] min-h-[75vh] px-6">
          <div className="max-w-lg mx-auto bg-white border border-black/10 rounded-xl p-10 text-center space-y-4">
            <BookOpen className="w-10 h-10 text-[#223981] mx-auto" />
            <h1 className="text-2xl font-bold text-[#141923]">
              {lang === 'fa' ? 'دوره مورد نظر یافت نشد' : 'Course not found'}
            </h1>
            <p className="text-sm text-[#525C6E]">
              {lang === 'fa'
                ? 'ممکن است عنوان یا نشانی این دوره در آکادمی ISB تغییر کرده باشد.'
                : 'This course slug may have moved or been archived.'}
            </p>
            <IsbButton type="button" onClick={() => navigate('/academy')}>
              {lang === 'fa' ? 'بازگشت به فهرست دوره‌ها' : 'Back to Academy Catalog'}
            </IsbButton>
          </div>
        </div>
      );
    }

    const inCart = cart.includes(activeCourse.id);
    const linkedInstructors = matchCourseInstructors(activeCourse, team);
    const relatedCourses = courses
      .filter((c) => c.id !== activeCourse.id)
      .sort((a, b) => Number(b.category === activeCourse.category) - Number(a.category === activeCourse.category))
      .slice(0, 3);
    const completedForCourse = completedModuleMap[activeCourse.id] || [];

    const handleEnrollNow = () => {
      if (hasCourseAccess) {
        navigate('/dashboard');
        return;
      }
      addToCart(activeCourse.id, false);
      navigate('/checkout');
    };

    return (
      <div className="pt-20 pb-20 bg-[#FAFBFD]">
        {/* Hero Header */}
        <section className="bg-[#0B1536] text-white py-14 lg:py-20">
          <div className="max-w-[1360px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <button
                type="button"
                onClick={() => navigate('/academy')}
                className="text-xs font-semibold text-white/75 hover:text-white cursor-pointer"
              >
                {lang === 'fa' ? '→ بازگشت به آکادمی ISB' : '← Back to ISB Academy'}
              </button>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#7FE0A9] font-mono-tech">
                <span className="uppercase">{activeCourse.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-sans">{t(activeCourse.duration, lang)}</span>
                <span aria-hidden="true">·</span>
                <span className="font-sans">{t(FORMAT_LABELS[activeCourse.format], lang)}</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-balance">
                {t(activeCourse.title, lang)}
              </h1>
              <p className="text-base text-white/80 leading-relaxed">
                {t(activeCourse.overview, lang)}
              </p>

              {/* Clickable Instructor Attribution */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
                <span className="text-white/55">
                  {lang === 'fa' ? 'مدرس / تیم ارائه:' : 'Instructor:'}
                </span>
                {linkedInstructors.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {linkedInstructors.map((inst) => (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => setSelectedInstructor(inst)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#03A54E]" />
                        <span>{t(inst.name, lang)}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="font-semibold text-white">
                    {t(activeCourse.instructor, lang)}
                  </span>
                )}
              </div>

              {/* Price & Purchase Controls */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <div className="text-2xl font-bold font-mono-tech text-[#7FE0A9] tabular-nums">
                  {formatPrice(activeCourse.priceToman)}
                </div>

                <IsbButton type="button" size="lg" variant="accent" onClick={handleEnrollNow}>
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {hasCourseAccess
                      ? lang === 'fa'
                        ? 'مشاهده در داشبورد آموزشی'
                        : 'Open Learning Dashboard'
                      : inCart
                      ? lang === 'fa'
                        ? 'ادامه تسویه حساب'
                        : 'Proceed to Checkout'
                      : t(uiText.common.enrollNow, lang)}
                  </span>
                </IsbButton>

                {!hasCourseAccess && !inCart && (
                  <button
                    type="button"
                    onClick={() => addToCart(activeCourse.id, true)}
                    className="h-12 px-5 rounded-md border border-white/25 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {lang === 'fa' ? 'افزودن به سبد خرید' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#132152] border border-white/15 shadow-2xl">
                <SafeImage
                  src={activeCourse.posterImage}
                  alt={t(activeCourse.title, lang)}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            {/* Learning Objectives */}
            <section className="bg-white border border-black/10 rounded-xl p-6 lg:p-8 space-y-4">
              <h2 className="text-xl font-bold text-[#141923]">
                {lang === 'fa' ? 'اهداف و دستاوردهای دوره' : 'Learning Objectives'}
              </h2>
              <ul className="space-y-3">
                {activeCourse.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#141923]/85">
                    <CheckCircle2 className="w-4 h-4 text-[#03A54E] shrink-0 mt-1" />
                    <span>{t(obj, lang)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Curriculum */}
            <section className="bg-white border border-black/10 rounded-xl p-6 lg:p-8 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-[#141923]">
                  {lang === 'fa' ? 'سرفصل‌های آموزشی' : 'Course Curriculum'}
                </h2>
                <span className="text-xs font-mono-tech text-[#525C6E] tabular-nums">
                  {activeCourse.syllabus.length} {lang === 'fa' ? 'بخش' : 'Modules'}
                </span>
              </div>

              <div className="space-y-4">
                {activeCourse.syllabus.map((mod, idx) => {
                  const isModDone = completedForCourse.includes(idx);
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border space-y-2.5 ${
                        isModDone
                          ? 'bg-[#ECFDF5]/60 border-[#03A54E]/35'
                          : 'bg-[#FAFBFD] border-black/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {isModDone && <CheckCircle2 className="w-4 h-4 text-[#03A54E] shrink-0" />}
                          <h3 className="font-bold text-sm text-[#141923]">
                            {t(mod.title, lang)}
                          </h3>
                        </div>
                        <span className="text-xs font-mono-tech text-[#223981] font-medium shrink-0">
                          {t(mod.duration, lang)}
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#525C6E]">
                        {mod.topics.map((topic, ti) => (
                          <li key={ti}>• {t(topic, lang)}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Protected Course Resources (Server-Enforced RBAC + Verified Payment) */}
            <section className="bg-white border border-black/10 rounded-xl p-6 lg:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-[#141923]">
                    {lang === 'fa'
                      ? 'فایل‌ها، جزوه‌ها و منابع تخصصی دوره'
                      : 'Protected Course Materials & Downloads'}
                  </h2>
                  <p className="text-xs text-[#525C6E]">
                    {lang === 'fa'
                      ? 'کنترل دسترسی مبتنی بر نقش کاربری و تأیید پرداخت سمت سرور'
                      : 'Access strictly gated by server-side RBAC & payment verification'}
                  </p>
                </div>

                {hasCourseAccess ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isStaffAccess
                        ? lang === 'fa'
                          ? 'دسترسی کادر آموزشی'
                          : 'Staff Access'
                        : lang === 'fa'
                        ? 'تأیید خرید فعال'
                        : 'Verified Purchase'}
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#F2F4F8] text-xs font-semibold text-[#525C6E]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'قفل‌شده' : 'Locked'}</span>
                  </span>
                )}
              </div>

              {materialsLoading ? (
                <div className="space-y-3" aria-busy="true">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-16 rounded-lg bg-[#F2F4F8] animate-pulse border border-black/5"
                    />
                  ))}
                </div>
              ) : materialsError ? (
                <IsbStatusNotice
                  tone="error"
                  title={lang === 'fa' ? 'خطا در بررسی دسترسی منابع' : 'Resource Verification Error'}
                >
                  <div className="space-y-2">
                    <p>{materialsError}</p>
                    <button
                      type="button"
                      onClick={fetchProtectedMaterials}
                      className="inline-flex items-center gap-1.5 font-semibold underline cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{lang === 'fa' ? 'تلاش مجدد' : 'Retry'}</span>
                    </button>
                  </div>
                </IsbStatusNotice>
              ) : materialsLockedReason === 'unauth' ? (
                <div className="p-6 rounded-xl bg-[#FAFBFD] border border-dashed border-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#141923]">
                      <Lock className="w-4 h-4 text-[#223981]" />
                      <span>
                        {lang === 'fa'
                          ? 'برای مشاهده یا خرید منابع وارد حساب خود شوید'
                          : 'Sign in required to access or unlock resources'}
                      </span>
                    </div>
                    <p className="text-xs text-[#525C6E]">
                      {lang === 'fa'
                        ? 'فایل‌های PDF استاندارد، بسته‌های شبیه‌سازی و ویدئوهای دوره تنها برای دانشجویان دارای پرداخت تأییدشده آزاد است.'
                        : 'PDF handbooks, simulation files, and recordings require an authenticated account with a verified purchase.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <IsbButton
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/auth?next=/academy/${activeCourse.slug}`)}
                    >
                      {t(uiText.nav.login, lang)}
                    </IsbButton>
                    <IsbButton type="button" size="sm" variant="accent" onClick={handleEnrollNow}>
                      {t(uiText.common.enrollNow, lang)}
                    </IsbButton>
                  </div>
                </div>
              ) : materialsLockedReason === 'unpaid' ? (
                <div className="p-6 rounded-xl bg-[#FAFBFD] border border-dashed border-[#223981]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#141923]">
                      <Lock className="w-4 h-4 text-[#223981]" />
                      <span>
                        {lang === 'fa'
                          ? 'منابع تخصصی پس از تسویه و تأیید پرداخت باز می‌شوند'
                          : 'Protected materials unlock after verified checkout'}
                      </span>
                    </div>
                    <p className="text-xs text-[#525C6E]">
                      {lang === 'fa'
                        ? 'شما با حساب دانشجویی وارد شده‌اید اما هنوز پرداخت تأییدشده‌ای برای این دوره ثبت نشده است.'
                        : 'You are signed in, but our server shows no verified paid enrollment for this course yet.'}
                    </p>
                  </div>
                  <IsbButton
                    type="button"
                    size="sm"
                    variant="accent"
                    onClick={handleEnrollNow}
                    className="shrink-0"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'ثبت‌نام و پرداخت' : 'Enroll & Unlock'}</span>
                  </IsbButton>
                </div>
              ) : protectedResources.length === 0 ? (
                <div className="p-6 rounded-lg bg-[#FAFBFD] border border-black/10 text-xs text-[#525C6E] text-center">
                  {lang === 'fa'
                    ? 'در حال حاضر فایلی برای این دوره ثبت نشده است.'
                    : 'No downloadable files attached to this course yet.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {protectedResources.map((resItem) => (
                    <div
                      key={resItem.id}
                      className="p-4 rounded-lg bg-[#FAFBFD] border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-md bg-[#223981]/10 text-[#223981] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#141923]">
                            {t(resItem.title, lang)}
                          </div>
                          <div className="text-xs text-[#525C6E] font-mono-tech mt-0.5 tabular-nums">
                            {resItem.type} · {resItem.size}
                          </div>
                        </div>
                      </div>
                      <IsbButton
                        type="button"
                        size="sm"
                        variant="primary"
                        disabled={downloadingId === resItem.id}
                        onClick={() => handleDownloadResource(activeCourse.slug, resItem)}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>
                          {downloadingId === resItem.id
                            ? lang === 'fa'
                              ? 'در حال دریافت...'
                              : 'Downloading...'
                            : lang === 'fa'
                            ? 'دانلود فایل'
                            : 'Download'}
                        </span>
                      </IsbButton>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* FAQs */}
            {activeCourse.faqs.length > 0 && (
              <section className="bg-white border border-black/10 rounded-xl p-6 lg:p-8 space-y-4">
                <h2 className="text-xl font-bold text-[#141923]">
                  {lang === 'fa' ? 'پرسش‌های متداول' : 'Frequently Asked Questions'}
                </h2>
                <div className="space-y-4">
                  {activeCourse.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="space-y-1 border-b border-black/5 pb-3 last:border-0"
                    >
                      <h3 className="text-sm font-bold text-[#141923]">{t(faq.question, lang)}</h3>
                      <p className="text-xs text-[#525C6E] leading-relaxed">
                        {t(faq.answer, lang)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Info */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Linked Instructor Card(s) */}
            <div className="bg-white border border-black/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#223981]">
                <UserCheck className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#141923]">
                  {linkedInstructors.length > 1
                    ? lang === 'fa'
                      ? 'مدرسین دوره'
                      : 'Course Instructors'
                    : lang === 'fa'
                    ? 'مدرس دوره'
                    : 'Instructor'}
                </h3>
              </div>

              {linkedInstructors.length > 0 ? (
                <div className="space-y-4 divide-y divide-black/10">
                  {linkedInstructors.map((inst, idx) => (
                    <div key={inst.id} className={idx > 0 ? 'pt-4 space-y-2.5' : 'space-y-2.5'}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0B1536] shrink-0 border border-black/10">
                          {inst.photo ? (
                            <SafeImage
                              src={inst.photo}
                              alt={t(inst.name, lang)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                              {t(inst.name, lang).slice(0, 2)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#141923]">
                            {t(inst.name, lang)}
                          </p>
                          <p className="text-xs text-[#223981] font-medium">
                            {t(inst.role, lang)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-[#525C6E] leading-relaxed line-clamp-3">
                        {t(inst.bio, lang)}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedInstructor(inst)}
                        className="text-xs font-semibold text-[#223981] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>
                          {lang === 'fa' ? 'مشاهده رزومه کامل مدرس' : 'View Instructor Profile'}
                        </span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#141923]">
                    {t(activeCourse.instructor, lang)}
                  </p>
                  <p className="text-xs text-[#525C6E] leading-relaxed">
                    {t(activeCourse.instructorRole, lang)}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white border border-black/10 rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#223981]">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#141923]">
                  {lang === 'fa' ? 'مخاطبین دوره' : 'Target Audience'}
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-[#525C6E]">
                {activeCourse.targetAudience.map((aud, idx) => (
                  <li key={idx}>• {t(aud, lang)}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-black/10 rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#223981]">
                <Clock className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#141923]">
                  {lang === 'fa' ? 'پیش‌نیازها' : 'Requirements'}
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-[#525C6E]">
                {activeCourse.requirements.map((req, idx) => (
                  <li key={idx}>• {t(req, lang)}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0B1536] text-white rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#7FE0A9] text-xs font-semibold">
                <Award className="w-4 h-4" />
                <span>{lang === 'fa' ? 'گواهینامه معتبر دیجیتال' : 'Verified Certificate'}</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                {lang === 'fa'
                  ? 'پس از تکمیل ۱۰۰٪ سرفصل‌های دوره در داشبورد دانشجو، گواهینامه تخصصی با کد پیگیری یکتا صادر می‌شود.'
                  : 'Complete all course modules inside your Student Dashboard to receive a verifiable ISB digital certificate.'}
              </p>
            </div>
          </aside>
        </div>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <section className="max-w-[1360px] mx-auto px-6 lg:px-10 pt-6 border-t border-black/10 space-y-6">
            <h2 className="text-xl font-bold text-[#141923]">
              {lang === 'fa' ? 'سایر دوره‌های مرتبط آکادمی ISB' : 'Related Academy Programs'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCourses.map((rc) => (
                <article
                  key={rc.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/academy/${rc.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/academy/${rc.slug}`);
                    }
                  }}
                  className="bg-white border border-black/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#223981]/35 isb-transition flex flex-col justify-between isb-focus-ring"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#0B1536] overflow-hidden">
                      <SafeImage
                        src={rc.posterImage}
                        alt={t(rc.title, lang)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 space-y-1.5">
                      <div className="text-[11px] text-[#525C6E]">
                        {t(rc.duration, lang)} · {t(FORMAT_LABELS[rc.format], lang)}
                      </div>
                      <h3 className="text-base font-bold text-[#141923] line-clamp-2">
                        {t(rc.title, lang)}
                      </h3>
                    </div>
                  </div>
                  <div className="px-5 py-3.5 border-t border-black/5 flex items-center justify-between text-xs font-bold text-[#223981] tabular-nums">
                    <span>{formatPrice(rc.priceToman)}</span>
                    <span className="text-[#027A3B] font-sans">
                      {t(uiText.common.enrollNow, lang)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Instructor Modal */}
        {selectedInstructor && (
          <InstructorModal
            instructor={selectedInstructor}
            lang={lang}
            deptTitle={getDeptTitle(selectedInstructor.department)}
            taughtCourses={courses.filter((c) =>
              matchCourseInstructors(c, [selectedInstructor]).length > 0
            )}
            formatPrice={formatPrice}
            onClose={() => setSelectedInstructor(null)}
            onSelectCourse={(courseSlug) => {
              setSelectedInstructor(null);
              navigate(`/academy/${courseSlug}`);
            }}
          />
        )}
      </div>
    );
  }

  // ==========================
  // ACADEMY CATALOG VIEW
  // ==========================
  const hasActiveFilters =
    category !== 'all' || formatFilter !== 'all' || searchQuery.trim() !== '' || sortBy !== 'default';

  const resetFilters = () => {
    setCategory('all');
    setFormatFilter('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="pt-24 pb-20 bg-[#FAFBFD]">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-14">
        {/* Top Hero + Recommender */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs text-[#027A3B] font-semibold">
              {t(uiText.nav.academy, lang)}
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-[#141923] text-balance">
              {lang === 'fa'
                ? 'آکادمی تخصصی معماری پایدار و شبیه‌سازی انرژی'
                : 'ISB Academy — Specialized Building Science Education'}
            </h1>
            <p className="text-base text-[#525C6E] leading-relaxed">
              {lang === 'fa'
                ? 'دوره‌های کاربردی مبحث نوزدهم، DesignBuilder، مصالح نوین پایدار و استاندارد ملی سرو سبز با تدریس اعضای تخصصی ISB.'
                : 'Applied professional programs in Chapter 19, DesignBuilder simulation, sustainable façades, and Sero Sabz certification.'}
            </p>
          </div>

          {/* Smart Course Recommendation */}
          <div className="lg:col-span-5 bg-white border border-black/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#223981]">
              <Sparkles className="w-4 h-4 text-[#03A54E]" />
              <span>
                {lang === 'fa'
                  ? 'پیشنهاد هوشمند دوره متناسب با تخصص شما'
                  : 'Smart Course Recommender'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'architect' as const, fa: 'معمار / طراح', en: 'Architect' },
                { id: 'energy' as const, fa: 'مشاور انرژی / تأسیسات', en: 'Energy / MEP' },
                { id: 'developer' as const, fa: 'کارفرما / ارزیاب', en: 'Developer' },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setInterest(role.id)}
                  className={`py-1.5 px-2 text-xs rounded border cursor-pointer transition-colors ${
                    interest === role.id
                      ? 'border-[#223981] bg-[#223981]/10 text-[#223981] font-semibold'
                      : 'border-black/10 text-[#525C6E] hover:border-black/25'
                  }`}
                >
                  {lang === 'fa' ? role.fa : role.en}
                </button>
              ))}
            </div>
            {recommendedCourse && (
              <button
                type="button"
                onClick={() => navigate(`/academy/${recommendedCourse.slug}`)}
                className="w-full text-start p-3 rounded-lg bg-[#F2F4F8] hover:bg-[#E7EBF3] transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-[11px] text-[#027A3B] font-semibold">
                    {lang === 'fa' ? 'پیشنهاد ویژه:' : 'Recommended:'}
                  </div>
                  <div className="text-xs font-bold text-[#141923] mt-0.5">
                    {t(recommendedCourse.title, lang)}
                  </div>
                </div>
                <span className="text-xs font-mono-tech font-bold text-[#223981] tabular-nums shrink-0">
                  {formatPrice(recommendedCourse.priceToman)}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Discovery Filter Bar (Search + Category + Format + Sort) */}
        <div className="bg-white border border-black/10 rounded-xl p-4 lg:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-[#525C6E] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'fa'
                    ? 'جستجو بر اساس عنوان دوره، مدرس یا مبحث تخصصی...'
                    : 'Search courses by title, instructor, or topic...'
                }
                className="w-full h-10 ps-10 pe-3.5 text-sm bg-[#FAFBFD] border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                aria-label={lang === 'fa' ? 'نوع برگزاری' : 'Course format'}
                className="w-full h-10 px-3 text-xs font-medium bg-[#FAFBFD] border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
              >
                <option value="all">{lang === 'fa' ? 'همه فرمت‌ها' : 'All Formats'}</option>
                <option value="live-online">{t(FORMAT_LABELS['live-online'], lang)}</option>
                <option value="workshop">{t(FORMAT_LABELS['workshop'], lang)}</option>
                <option value="recorded">{t(FORMAT_LABELS['recorded'], lang)}</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'default' | 'price-asc' | 'price-desc')
                }
                aria-label={lang === 'fa' ? 'مرتب‌سازی' : 'Sort courses'}
                className="w-full h-10 px-3 text-xs font-medium bg-[#FAFBFD] border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
              >
                <option value="default">
                  {lang === 'fa' ? 'ترتیب پیش‌فرض آکادمی' : 'Featured Order'}
                </option>
                <option value="price-asc">
                  {lang === 'fa' ? 'شهریه: کم به زیاد' : 'Price: Low to High'}
                </option>
                <option value="price-desc">
                  {lang === 'fa' ? 'شهریه: زیاد به کم' : 'Price: High to Low'}
                </option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-black/5">
            <div className="flex flex-wrap gap-2">
              {CATEGORY_TABS.map((tab) => {
                const count =
                  tab.id === 'all'
                    ? courses.length
                    : courses.filter((c) => c.category === tab.id).length;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-md cursor-pointer transition-colors inline-flex items-center gap-1.5 ${
                      category === tab.id
                        ? 'bg-[#223981] text-white'
                        : 'bg-[#FAFBFD] border border-black/10 text-[#525C6E] hover:text-[#141923]'
                    }`}
                  >
                    <span>{lang === 'fa' ? tab.fa : tab.en}</span>
                    <span className="font-mono-tech text-[11px] opacity-80 tabular-nums">
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#223981] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'پاک‌کردن فیلترها' : 'Reset Filters'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Course Grid / Loading / Empty State */}
        {contentLoading && courses.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-96 rounded-xl bg-white border border-black/10 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-black/10 rounded-xl p-12 text-center space-y-4">
            <Search className="w-10 h-10 text-[#525C6E]/60 mx-auto" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#141923]">
                {lang === 'fa'
                  ? 'دوره‌ای با فیلترهای انتخابی یافت نشد'
                  : 'No courses match your filters'}
              </h2>
              <p className="text-xs text-[#525C6E]">
                {lang === 'fa'
                  ? 'معیارهای جستجو یا دسته‌بندی را تغییر دهید تا همه دوره‌های آکادمی نمایش داده شوند.'
                  : 'Clear the search query or select a different category to see available courses.'}
              </p>
            </div>
            <IsbButton type="button" variant="primary" size="sm" onClick={resetFilters}>
              {lang === 'fa' ? 'نمایش همه دوره‌ها' : 'Show All Courses'}
            </IsbButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, idx) => {
              const enrolled = enrolledIds.includes(course.id) || isStaffAccess;
              const inCart = cart.includes(course.id);
              const matchedInsts = matchCourseInstructors(course, team);

              return (
                <article
                  key={course.id}
                  className="bg-white border border-black/10 rounded-xl overflow-hidden flex flex-col justify-between isb-transition hover:border-[#223981]/35 group"
                >
                  <div>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/academy/${course.slug}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/academy/${course.slug}`);
                        }
                      }}
                      className="aspect-[4/3] bg-[#0B1536] overflow-hidden cursor-pointer isb-focus-ring"
                    >
                      <SafeImage
                        src={course.posterImage}
                        alt={t(course.title, lang)}
                        priority={idx === 0}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-2.5">
                      {/* Zero-pill inline metadata */}
                      <div className="text-xs text-[#525C6E] font-mono-tech flex flex-wrap items-center gap-2">
                        <span className="uppercase">{course.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans">{t(course.duration, lang)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans">{t(FORMAT_LABELS[course.format], lang)}</span>
                      </div>

                      <h2
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/academy/${course.slug}`)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`/academy/${course.slug}`);
                          }
                        }}
                        className="text-lg font-bold text-[#141923] hover:text-[#223981] cursor-pointer transition-colors text-balance isb-focus-ring rounded"
                      >
                        {t(course.title, lang)}
                      </h2>

                      <div className="text-xs text-[#525C6E]">
                        {matchedInsts.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => setSelectedInstructor(matchedInsts[0])}
                            className="text-[#223981] font-medium hover:underline text-start cursor-pointer"
                          >
                            {t(course.instructor, lang)}
                          </button>
                        ) : (
                          <span>{t(course.instructor, lang)}</span>
                        )}
                      </div>

                      <p className="text-xs text-[#525C6E] leading-relaxed line-clamp-2">
                        {t(course.shortDescription, lang)}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-black/5 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold font-mono-tech text-[#141923] tabular-nums">
                      {formatPrice(course.priceToman)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/academy/${course.slug}`)}
                        className="px-3 py-1.5 rounded-md border border-black/15 text-xs font-semibold text-[#141923] hover:bg-[#F2F4F8] cursor-pointer"
                      >
                        {lang === 'fa' ? 'جزئیات' : 'Details'}
                      </button>

                      {enrolled ? (
                        <IsbButton
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate('/dashboard')}
                        >
                          {lang === 'fa' ? 'دسترسی فعال ✓' : 'Enrolled ✓'}
                        </IsbButton>
                      ) : inCart ? (
                        <IsbButton
                          type="button"
                          size="sm"
                          variant="accent"
                          onClick={() => navigate('/checkout')}
                        >
                          {lang === 'fa' ? 'تسویه حساب' : 'Checkout'}
                        </IsbButton>
                      ) : (
                        <IsbButton
                          type="button"
                          size="sm"
                          variant="primary"
                          onClick={() => addToCart(course.id, true)}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{lang === 'fa' ? 'سبد خرید' : 'Add to Cart'}</span>
                        </IsbButton>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Faculty & Instructor Profiles Section (Authenticated from Catalogue Team) */}
        {academyInstructors.length > 0 && (
          <section className="pt-8 border-t border-black/10 space-y-6">
            <div className="space-y-1.5">
              <p className="text-xs font-mono-tech text-[#027A3B] font-semibold">
                ISB ACADEMY FACULTY
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#141923]">
                {lang === 'fa'
                  ? 'مدرسین و متخصصین علمی آکادمی'
                  : 'Academy Faculty & Lead Instructors'}
              </h2>
              <p className="text-sm text-[#525C6E] max-w-2xl">
                {lang === 'fa'
                  ? 'تمامی دوره‌ها توسط پژوهشگران، طراحان ارشد و مشاوران رسمی انرژی و معماری گروه ISB تدریس می‌شوند.'
                  : 'Every program is taught directly by ISB Group practitioners, building physics researchers, and senior architects.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {academyInstructors.map(({ member, taughtCourses }) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setSelectedInstructor(member)}
                  className="bg-white border border-black/10 rounded-xl p-6 text-start hover:border-[#223981]/40 isb-transition flex flex-col justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0B1536] border border-black/10 shrink-0">
                        {member.photo ? (
                          <SafeImage
                            src={member.photo}
                            alt={t(member.name, lang)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                            {t(member.name, lang).slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#141923] group-hover:text-[#223981] transition-colors">
                          {t(member.name, lang)}
                        </h3>
                        <p className="text-xs text-[#223981] font-medium line-clamp-2 mt-0.5">
                          {t(member.role, lang)}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#525C6E] leading-relaxed line-clamp-3">
                      {t(member.bio, lang)}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-semibold text-[#525C6E]">
                    <span>{getDeptTitle(member.department)}</span>
                    <span className="text-[#027A3B] tabular-nums">
                      <span className="font-mono-tech">{taughtCourses.length}</span>{' '}
                      {lang === 'fa' ? 'دوره' : 'course(s)'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Instructor Modal */}
        {selectedInstructor && (
          <InstructorModal
            instructor={selectedInstructor}
            lang={lang}
            deptTitle={getDeptTitle(selectedInstructor.department)}
            taughtCourses={courses.filter((c) =>
              matchCourseInstructors(c, [selectedInstructor]).length > 0
            )}
            formatPrice={formatPrice}
            onClose={() => setSelectedInstructor(null)}
            onSelectCourse={(courseSlug) => {
              setSelectedInstructor(null);
              navigate(`/academy/${courseSlug}`);
            }}
          />
        )}
      </div>
    </div>
  );
};

interface InstructorModalProps {
  instructor: TeamMember;
  lang: 'fa' | 'en';
  deptTitle: string;
  taughtCourses: Course[];
  formatPrice: (toman: number) => string;
  onClose: () => void;
  onSelectCourse: (slug: string) => void;
}

const InstructorModal: React.FC<InstructorModalProps> = ({
  instructor,
  lang,
  deptTitle,
  taughtCourses,
  formatPrice,
  onClose,
  onSelectCourse,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B1536]/65 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t(instructor.name, lang)}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full border border-black/15 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-[#0B1536] text-white flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0">
              {instructor.photo ? (
                <SafeImage
                  src={instructor.photo}
                  alt={t(instructor.name, lang)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-base font-bold">
                  {t(instructor.name, lang).slice(0, 2)}
                </div>
              )}
            </div>
            <div>
              <div className="text-[11px] font-mono-tech text-[#7FE0A9]">{deptTitle}</div>
              <h3 className="text-xl font-bold mt-0.5">{t(instructor.name, lang)}</h3>
              <p className="text-xs text-white/80 mt-0.5">{t(instructor.role, lang)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            aria-label={lang === 'fa' ? 'بستن' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <h4 className="text-xs font-mono-tech font-semibold text-[#223981]">
              {lang === 'fa' ? 'معرفی تخصصی و سوابق علمی' : 'EXPERTISE & CREDENTIALS'}
            </h4>
            <p className="text-sm text-[#141923] leading-relaxed">{t(instructor.bio, lang)}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono-tech font-semibold text-[#223981]">
              {lang === 'fa' ? 'دوره‌های تدریس‌شده در آکادمی ISB' : 'COURSES TAUGHT AT ISB ACADEMY'}
            </h4>
            {taughtCourses.length === 0 ? (
              <p className="text-xs text-[#525C6E]">
                {lang === 'fa'
                  ? 'دوره‌ای در حال حاضر به نام این مدرس ثبت نشده است.'
                  : 'No published courses linked to this instructor.'}
              </p>
            ) : (
              <div className="space-y-2.5">
                {taughtCourses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => onSelectCourse(course.slug)}
                    className="w-full p-3.5 rounded-xl border border-black/10 bg-[#FAFBFD] hover:border-[#223981]/40 text-start flex items-center justify-between gap-4 cursor-pointer transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#141923] line-clamp-1">
                        {t(course.title, lang)}
                      </div>
                      <div className="text-xs text-[#525C6E] mt-0.5">
                        {t(course.duration, lang)} · {t(FORMAT_LABELS[course.format], lang)}
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono-tech text-[#027A3B] tabular-nums shrink-0">
                      {formatPrice(course.priceToman)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
