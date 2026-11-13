import React, { useCallback, useEffect, useState } from 'react';
import {
  BookOpen,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  Layers,
  Pencil,
  Plus,
  Receipt,
  RefreshCw,
  ShieldAlert,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import {
  ConsultationRequest,
  DepartmentId,
  Enrollment,
  Order,
  Project,
  ProjectCategory,
  ProjectMetric,
  User,
} from '../types/isb';

type AdminTab = 'team' | 'projects' | 'courses' | 'articles' | 'overview';

export const AdminCmsPage: React.FC = () => {
  const {
    lang,
    user,
    authLoading,
    navigate,
    departments,
    services,
    team,
    projects,
    courses,
    articles,
    refreshContent,
    formatPrice,
  } = useApp();

  const [tab, setTab] = useState<AdminTab>('team');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // Overview state
  const [orders, setOrders] = useState<Order[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState('');

  // Department C editor state
  const structDept = departments.find((d) => d.id === 'structure');
  const [deptTitleFa, setDeptTitleFa] = useState('');
  const [deptTitleEn, setDeptTitleEn] = useState('');
  const [deptSubFa, setDeptSubFa] = useState('');
  const [deptSubEn, setDeptSubEn] = useState('');
  const [deptDescFa, setDeptDescFa] = useState('');
  const [deptDescEn, setDeptDescEn] = useState('');
  const [deptCapsFa, setDeptCapsFa] = useState('');
  const [deptCapsEn, setDeptCapsEn] = useState('');

  useEffect(() => {
    if (structDept) {
      setDeptTitleFa(structDept.title.fa);
      setDeptTitleEn(structDept.title.en);
      setDeptSubFa(structDept.subtitle.fa);
      setDeptSubEn(structDept.subtitle.en);
      setDeptDescFa(structDept.description.fa);
      setDeptDescEn(structDept.description.en);
      setDeptCapsFa(structDept.capabilities.map((c) => c.fa).join('\n'));
      setDeptCapsEn(structDept.capabilities.map((c) => c.en).join('\n'));
    }
  }, [structDept]);

  // Add Team Member state
  const [tmNameFa, setTmNameFa] = useState('');
  const [tmNameEn, setTmNameEn] = useState('');
  const [tmRoleFa, setTmRoleFa] = useState('');
  const [tmRoleEn, setTmRoleEn] = useState('');
  const [tmDept, setTmDept] = useState<DepartmentId | 'management' | 'advisor'>('structure');
  const [tmBioFa, setTmBioFa] = useState('');
  const [tmBioEn, setTmBioEn] = useState('');
  const [tmPhoto, setTmPhoto] = useState('');

  // Add / Edit Project state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projIndexNumber, setProjIndexNumber] = useState('');
  const [projTitleFa, setProjTitleFa] = useState('');
  const [projTitleEn, setProjTitleEn] = useState('');
  const [projSlug, setProjSlug] = useState('');
  const [projLocFa, setProjLocFa] = useState('مشهد');
  const [projLocEn, setProjLocEn] = useState('Mashhad');
  const [projYear, setProjYear] = useState('۱۴۰۵');
  const [projArchFa, setProjArchFa] = useState('گروه ISB');
  const [projArchEn, setProjArchEn] = useState('ISB Group');
  const [projCat, setProjCat] = useState<ProjectCategory>('institutional');
  const [projDepts, setProjDepts] = useState<DepartmentId[]>(['structure']);
  const [projServices, setProjServices] = useState<string[]>([]);
  const [projGrade, setProjGrade] = useState<'' | 'ECZn' | 'EC++' | 'EC+' | 'EC'>('');
  const [projSeroFa, setProjSeroFa] = useState('');
  const [projSeroEn, setProjSeroEn] = useState('');
  const [projSumFa, setProjSumFa] = useState('');
  const [projSumEn, setProjSumEn] = useState('');
  const [projNarrFa, setProjNarrFa] = useState('');
  const [projNarrEn, setProjNarrEn] = useState('');
  const [projScopeFa, setProjScopeFa] = useState('');
  const [projScopeEn, setProjScopeEn] = useState('');
  const [projStratFa, setProjStratFa] = useState('');
  const [projStratEn, setProjStratEn] = useState('');
  const [projMetrics, setProjMetrics] = useState<ProjectMetric[]>([]);
  const [projHeroImg, setProjHeroImg] = useState('/images/projects/mehregan-hero.webp');
  const [projGallery, setProjGallery] = useState<
    { src: string; caption: { fa: string; en: string } }[]
  >([]);
  const [projFeatured, setProjFeatured] = useState(false);

  // Add Course state
  const [crsTitleFa, setCrsTitleFa] = useState('');
  const [crsTitleEn, setCrsTitleEn] = useState('');
  const [crsSlug, setCrsSlug] = useState('');
  const [crsSubFa, setCrsSubFa] = useState('');
  const [crsSubEn, setCrsSubEn] = useState('');
  const [crsCat, setCrsCat] = useState<
    'regulations' | 'simulation' | 'green-building' | 'certification'
  >('simulation');
  const [crsFormat, setCrsFormat] = useState<'workshop' | 'live-online' | 'recorded'>('live-online');
  const [crsInstrFa, setCrsInstrFa] = useState('دکتر سارا آتشی');
  const [crsInstrEn, setCrsInstrEn] = useState('Dr. Sara Atashi');
  const [crsDurFa, setCrsDurFa] = useState('۱۲ ساعت');
  const [crsDurEn, setCrsDurEn] = useState('12 Hours');
  const [crsPrice, setCrsPrice] = useState('2800000');
  const [crsPoster, setCrsPoster] = useState('/images/academy/designbuilder-ch19.webp');

  // Inline course price edits
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});

  // Add Article state
  const [artTitleFa, setArtTitleFa] = useState('');
  const [artTitleEn, setArtTitleEn] = useState('');
  const [artSlug, setArtSlug] = useState('');
  const [artCatFa, setArtCatFa] = useState('مهندسی سازه و پایداری');
  const [artCatEn, setArtCatEn] = useState('Structural & Sustainability');
  const [artAuthorFa, setArtAuthorFa] = useState('دپارتمان فنی ISB');
  const [artAuthorEn, setArtAuthorEn] = useState('ISB Technical Department');
  const [artDept, setArtDept] = useState<DepartmentId>('energy');
  const [artExcerptFa, setArtExcerptFa] = useState('');
  const [artExcerptEn, setArtExcerptEn] = useState('');
  const [artBodyFa, setArtBodyFa] = useState('');
  const [artBodyEn, setArtBodyEn] = useState('');
  const [artImg, setArtImg] = useState('/images/diagrams/mehregan-cutaway.webp');

  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true);
    setOverviewError('');
    try {
      const res = await fetch('/api/cms/overview');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOverviewError(
          data.error ||
            (lang === 'fa'
              ? 'خطا در دریافت گزارش سفارش‌ها و درخواست‌ها.'
              : 'Failed to load CMS overview metrics.')
        );
        return;
      }
      setOrders(data.orders || []);
      setEnrollments(data.enrollments || []);
      setConsultations(data.consultations || []);
      setUsersList(data.users || []);
    } catch {
      setOverviewError(
        lang === 'fa'
          ? 'خطای شبکه هنگام دریافت گزارش پنل مدیریت.'
          : 'Network error loading CMS overview.'
      );
    } finally {
      setOverviewLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchOverview();
    }
  }, [user, fetchOverview]);

  const showNotice = (type: 'ok' | 'err', text: string) => {
    setNotice({ type, text });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (
    file: File,
    onSuccess: (url: string) => void
  ) => {
    if (!file) return;
    if (file.size > 3.5 * 1024 * 1024) {
      showNotice(
        'err',
        lang === 'fa' ? 'حجم تصویر باید کمتر از ۳.۵ مگابایت باشد.' : 'Image must be under 3.5 MB.'
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      setBusy(true);
      try {
        const res = await fetch('/api/cms/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl }),
        });
        const data = await res.json();
        if (!res.ok) {
          showNotice('err', data.error || 'Upload failed');
        } else {
          onSuccess(data.url);
          showNotice('ok', lang === 'fa' ? 'تصویر با موفقیت بارگذاری شد.' : 'Image uploaded.');
        }
      } catch {
        showNotice('err', lang === 'fa' ? 'خطا در بارگذاری تصویر.' : 'Image upload error.');
      } finally {
        setBusy(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDepartmentC = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const faLines = deptCapsFa
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const enLines = deptCapsEn
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const maxLen = Math.max(faLines.length, enLines.length);
      const capabilities = Array.from({ length: maxLen }, (_, idx) => ({
        fa: faLines[idx] || enLines[idx] || '',
        en: enLines[idx] || faLines[idx] || '',
      }));

      const res = await fetch('/api/cms/departments/structure', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: { fa: deptTitleFa, en: deptTitleEn },
          subtitle: { fa: deptSubFa, en: deptSubEn },
          description: { fa: deptDescFa, en: deptDescEn },
          capabilities,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        showNotice('err', d.error || 'Failed to update department');
      } else {
        await refreshContent();
        showNotice(
          'ok',
          lang === 'fa'
            ? 'اطلاعات دپارتمان C (مهندسی سازه و طراحی لرزه‌ای) به‌روزرسانی شد.'
            : 'Department C (Structure & Earthquake Design) updated.'
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmNameFa.trim() || !tmRoleFa.trim()) return;
    setBusy(true);
    try {
      const res = await fetch('/api/cms/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: { fa: tmNameFa.trim(), en: tmNameEn.trim() || tmNameFa.trim() },
          role: { fa: tmRoleFa.trim(), en: tmRoleEn.trim() || tmRoleFa.trim() },
          department: tmDept,
          bio: { fa: tmBioFa.trim(), en: tmBioEn.trim() || tmBioFa.trim() },
          photo: tmPhoto.trim() || undefined,
          isAdvisor: tmDept === 'advisor',
        }),
      });
      if (res.ok) {
        setTmNameFa('');
        setTmNameEn('');
        setTmRoleFa('');
        setTmRoleEn('');
        setTmBioFa('');
        setTmBioEn('');
        setTmPhoto('');
        await refreshContent();
        showNotice('ok', lang === 'fa' ? 'عضو تیم اضافه شد.' : 'Team member added.');
      } else {
        const d = await res.json();
        showNotice('err', d.error || 'Failed to add team member');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/cms/team/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshContent();
        showNotice('ok', lang === 'fa' ? 'عضو تیم حذف شد.' : 'Team member removed.');
      }
    } finally {
      setBusy(false);
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjIndexNumber('');
    setProjTitleFa('');
    setProjTitleEn('');
    setProjSlug('');
    setProjLocFa('مشهد');
    setProjLocEn('Mashhad');
    setProjYear('۱۴۰۵');
    setProjArchFa('گروه ISB');
    setProjArchEn('ISB Group');
    setProjCat('institutional');
    setProjDepts(['structure']);
    setProjServices([]);
    setProjGrade('');
    setProjSeroFa('');
    setProjSeroEn('');
    setProjSumFa('');
    setProjSumEn('');
    setProjNarrFa('');
    setProjNarrEn('');
    setProjScopeFa('');
    setProjScopeEn('');
    setProjStratFa('');
    setProjStratEn('');
    setProjMetrics([]);
    setProjHeroImg('/images/projects/mehregan-hero.webp');
    setProjGallery([]);
    setProjFeatured(false);
  };

  const startEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setProjIndexNumber(p.indexNumber || '');
    setProjTitleFa(p.title.fa || '');
    setProjTitleEn(p.title.en || '');
    setProjSlug(p.slug || '');
    setProjLocFa(p.location.fa || '');
    setProjLocEn(p.location.en || '');
    setProjYear(p.year || '');
    setProjArchFa(p.architect.fa || '');
    setProjArchEn(p.architect.en || '');
    setProjCat(p.category);
    setProjDepts(p.departments || []);
    setProjServices(p.services || []);
    setProjGrade(p.energyGrade || '');
    setProjSeroFa(p.seroSabzTier?.fa || '');
    setProjSeroEn(p.seroSabzTier?.en || '');
    setProjSumFa(p.summary.fa || '');
    setProjSumEn(p.summary.en || '');
    setProjNarrFa(p.narrative.fa || '');
    setProjNarrEn(p.narrative.en || '');
    setProjScopeFa((p.scopeOfWork || []).map((x) => x.fa).join('\n'));
    setProjScopeEn((p.scopeOfWork || []).map((x) => x.en).join('\n'));
    setProjStratFa((p.designStrategies || []).map((x) => x.fa).join('\n'));
    setProjStratEn((p.designStrategies || []).map((x) => x.en).join('\n'));
    setProjMetrics(
      (p.metrics || []).map((m) => ({
        label: { fa: m.label.fa, en: m.label.en },
        value: m.value,
        unit: m.unit || '',
        note: m.note ? { fa: m.note.fa, en: m.note.en } : { fa: '', en: '' },
      }))
    );
    setProjHeroImg(p.heroImage || '');
    setProjGallery(
      (p.galleryImages || []).map((g) => ({
        src: g.src,
        caption: { fa: g.caption.fa, en: g.caption.en },
      }))
    );
    setProjFeatured(Boolean(p.featured));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pairLines = (faText: string, enText: string) => {
    const faLines = faText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const enLines = enText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const len = Math.max(faLines.length, enLines.length);
    return Array.from({ length: len }, (_, i) => ({
      fa: faLines[i] || enLines[i] || '',
      en: enLines[i] || faLines[i] || '',
    }));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitleFa.trim() || !projSlug.trim()) return;
    setBusy(true);
    try {
      const cleanSlug = projSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-|-$/g, '');

      const cleanedMetrics: ProjectMetric[] = projMetrics
        .filter((m) => (m.label.fa.trim() || m.label.en.trim()) && m.value.trim())
        .map((m) => ({
          label: {
            fa: m.label.fa.trim() || m.label.en.trim(),
            en: m.label.en.trim() || m.label.fa.trim(),
          },
          value: m.value.trim(),
          unit: m.unit?.trim() || undefined,
          note:
            m.note && (m.note.fa.trim() || m.note.en.trim())
              ? {
                  fa: m.note.fa.trim() || m.note.en.trim(),
                  en: m.note.en.trim() || m.note.fa.trim(),
                }
              : undefined,
        }));

      const cleanedGallery = projGallery
        .filter((g) => g.src.trim())
        .map((g) => ({
          src: g.src.trim(),
          caption: {
            fa: g.caption.fa.trim() || g.caption.en.trim() || projTitleFa.trim(),
            en: g.caption.en.trim() || g.caption.fa.trim() || projTitleEn.trim() || projTitleFa.trim(),
          },
        }));

      const payload = {
        slug: cleanSlug || `project-${Date.now()}`,
        indexNumber:
          projIndexNumber.trim() || String(projects.length + 1).padStart(2, '0'),
        title: { fa: projTitleFa.trim(), en: projTitleEn.trim() || projTitleFa.trim() },
        location: { fa: projLocFa.trim(), en: projLocEn.trim() || projLocFa.trim() },
        year: projYear.trim() || '۱۴۰۵',
        architect: { fa: projArchFa.trim(), en: projArchEn.trim() || projArchFa.trim() },
        category: projCat,
        departments: projDepts.length ? projDepts : (['structure'] as DepartmentId[]),
        services: projServices,
        energyGrade: projGrade || undefined,
        seroSabzTier:
          projSeroFa.trim() || projSeroEn.trim()
            ? {
                fa: projSeroFa.trim() || projSeroEn.trim(),
                en: projSeroEn.trim() || projSeroFa.trim(),
              }
            : undefined,
        heroImage: projHeroImg.trim() || '/images/projects/mehregan-hero.webp',
        galleryImages: cleanedGallery,
        summary: { fa: projSumFa.trim(), en: projSumEn.trim() || projSumFa.trim() },
        narrative: {
          fa: projNarrFa.trim() || projSumFa.trim(),
          en: projNarrEn.trim() || projSumEn.trim() || projNarrFa.trim() || projSumFa.trim(),
        },
        scopeOfWork: pairLines(projScopeFa, projScopeEn),
        designStrategies: pairLines(projStratFa, projStratEn),
        metrics: cleanedMetrics,
        featured: projFeatured,
      };

      const isEdit = Boolean(editingProjectId);
      const res = await fetch(
        isEdit ? `/api/cms/projects/${editingProjectId}` : '/api/cms/projects',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        resetProjectForm();
        await refreshContent();
        showNotice(
          'ok',
          isEdit
            ? lang === 'fa'
              ? 'پروژه با موفقیت ویرایش شد.'
              : 'Project updated successfully.'
            : lang === 'fa'
            ? 'پروژه جدید منتشر شد.'
            : 'Project published.'
        );
      } else {
        const d = await res.json();
        showNotice('err', d.error || 'Failed to save project');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleToggleProjectFeatured = async (id: string, currentFeatured: boolean) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/cms/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      if (res.ok) {
        await refreshContent();
        showNotice('ok', lang === 'fa' ? 'وضعیت پروژه به‌روزرسانی شد.' : 'Project updated.');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/cms/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (editingProjectId === id) resetProjectForm();
        await refreshContent();
        showNotice('ok', lang === 'fa' ? 'پروژه حذف شد.' : 'Project deleted.');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crsTitleFa.trim() || !crsSlug.trim()) return;
    setBusy(true);
    try {
      const cleanSlug = crsSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-|-$/g, '');
      const res = await fetch('/api/cms/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: cleanSlug || `course-${Date.now()}`,
          title: { fa: crsTitleFa.trim(), en: crsTitleEn.trim() || crsTitleFa.trim() },
          subtitle: { fa: crsSubFa.trim(), en: crsSubEn.trim() || crsSubFa.trim() },
          category: crsCat,
          format: crsFormat,
          instructor: { fa: crsInstrFa.trim(), en: crsInstrEn.trim() },
          instructorRole: {
            fa: 'مدرس رسمی آکادمی ISB',
            en: 'Certified ISB Academy Instructor',
          },
          duration: { fa: crsDurFa.trim(), en: crsDurEn.trim() },
          priceToman: Math.max(0, Number(crsPrice) || 0),
          isAvailable: true,
          posterImage: crsPoster.trim() || '/images/academy/designbuilder-ch19.webp',
          shortDescription: { fa: crsSubFa.trim(), en: crsSubEn.trim() || crsSubFa.trim() },
          overview: { fa: crsSubFa.trim(), en: crsSubEn.trim() || crsSubFa.trim() },
          objectives: [],
          targetAudience: [],
          requirements: [],
          syllabus: [
            {
              title: { fa: 'ماژول اول: مبانی و چارچوب استاندارد', en: 'Module 1: Fundamentals & Code Framework' },
              duration: { fa: '۴ ساعت', en: '4 Hours' },
              topics: [{ fa: 'معرفی استانداردها و مطالعات موردی ISB', en: 'Standards & ISB case study introduction' }],
            },
          ],
          faqs: [],
        }),
      });
      if (res.ok) {
        setCrsTitleFa('');
        setCrsTitleEn('');
        setCrsSlug('');
        setCrsSubFa('');
        setCrsSubEn('');
        await refreshContent();
        showNotice('ok', lang === 'fa' ? 'دوره جدید به آکادمی اضافه شد.' : 'Course added to Academy.');
      } else {
        const d = await res.json();
        showNotice('err', d.error || 'Failed to add course');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateCourse = async (
    id: string,
    payload: { priceToman?: number; isAvailable?: boolean }
  ) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/cms/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await refreshContent();
        showNotice('ok', lang === 'fa' ? 'تنظیمات دوره ذخیره شد.' : 'Course updated.');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitleFa.trim() || !artSlug.trim()) return;
    setBusy(true);
    try {
      const cleanSlug = artSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-|-$/g, '');
      const faParas = artBodyFa.split('\n').map((s) => s.trim()).filter(Boolean);
      const enParas = artBodyEn.split('\n').map((s) => s.trim()).filter(Boolean);
      const maxLen = Math.max(1, faParas.length, enParas.length);
      const body = Array.from({ length: maxLen }, (_, idx) => ({
        fa: faParas[idx] || artExcerptFa.trim(),
        en: enParas[idx] || artExcerptEn.trim() || faParas[idx] || '',
      }));

      const res = await fetch('/api/cms/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: cleanSlug || `article-${Date.now()}`,
          category: { fa: artCatFa.trim(), en: artCatEn.trim() },
          publishedAt: new Date().toISOString().slice(0, 10),
          readTime: { fa: '۶ دقیقه مطالعه', en: '6 min read' },
          author: { fa: artAuthorFa.trim(), en: artAuthorEn.trim() },
          title: { fa: artTitleFa.trim(), en: artTitleEn.trim() || artTitleFa.trim() },
          excerpt: { fa: artExcerptFa.trim(), en: artExcerptEn.trim() || artExcerptFa.trim() },
          body,
          image: artImg.trim() || '/images/diagrams/mehregan-cutaway.webp',
          relatedDepartment: artDept,
        }),
      });
      if (res.ok) {
        setArtTitleFa('');
        setArtTitleEn('');
        setArtSlug('');
        setArtExcerptFa('');
        setArtExcerptEn('');
        setArtBodyFa('');
        setArtBodyEn('');
        await refreshContent();
        showNotice('ok', lang === 'fa' ? 'مقاله پژوهشی منتشر شد.' : 'Article published.');
      } else {
        const d = await res.json();
        showNotice('err', d.error || 'Failed to publish article');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleRefundOrder = async (orderId: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/cms/orders/${orderId}/refund`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchOverview();
        showNotice('ok', lang === 'fa' ? 'سفارش بازپرداخت و دسترسی لغو شد.' : 'Order refunded.');
      }
    } finally {
      setBusy(false);
    }
  };

  if (authLoading) {
    return (
      <div className="pt-32 pb-20 text-center text-sm text-[#525C6E]">
        {lang === 'fa' ? 'در حال بررسی سطح دسترسی...' : 'Verifying administrator session...'}
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="pt-32 pb-24 bg-[#FAFBFD] min-h-[80vh]">
        <div className="max-w-lg mx-auto px-6">
          <div className="bg-white border border-black/10 rounded-xl p-8 text-center space-y-4">
            <ShieldAlert className="w-10 h-10 text-[#223981] mx-auto" />
            <h1 className="text-xl font-bold text-[#141923]">
              {lang === 'fa' ? 'دسترسی محدود به مدیران سیستم' : 'Administrator Access Required'}
            </h1>
            <p className="text-sm text-[#525C6E] leading-relaxed">
              {lang === 'fa'
                ? 'مدیریت پروژه‌ها، دپارتمان C (مهندسی سازه)، تیم و دوره‌های آکادمی فقط با حساب مدیر ISB امکان‌پذیر است.'
                : 'Managing projects, Department C (Structural Engineering), team profiles, and ISB Academy courses requires an ISB administrator account.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/auth?next=/admin')}
                className="px-5 py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold cursor-pointer"
              >
                {lang === 'fa' ? 'ورود با حساب مدیر' : 'Sign In as Admin'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-md border border-black/15 text-xs font-semibold text-[#141923] cursor-pointer"
              >
                {lang === 'fa' ? 'بازگشت به خانه' : 'Return Home'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#FAFBFD] min-h-[85vh]">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-8">
        {/* Header */}
        <div className="bg-[#0B1536] text-white rounded-xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono-tech text-[#03A54E] font-semibold">
              ISB GROUP · CONTENT MANAGEMENT SYSTEM
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              {lang === 'fa'
                ? 'پنل مدیریت محتوا و عملیات ISB'
                : 'ISB Content & Operations CMS'}
            </h1>
            <p className="text-xs text-white/70">
              {lang === 'fa'
                ? 'مدیریت دپارتمان C (سازه و طراحی لرزه‌ای)، تیم تخصصی، پروژه‌ها، آکادمی و سفارش‌ها'
                : 'Manage Department C (Structural Engineering), team roster, case studies, Academy courses, and orders.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                refreshContent();
                fetchOverview();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'بروزرسانی داده‌ها' : 'Sync Data'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-md bg-[#03A54E] text-white text-xs font-semibold cursor-pointer"
            >
              {lang === 'fa' ? 'داشبورد کاربری' : 'User Dashboard'}
            </button>
          </div>
        </div>

        {/* Status Notice */}
        {notice && (
          <div
            className={`p-4 rounded-lg border flex items-center justify-between gap-4 text-xs font-medium ${
              notice.type === 'ok'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="underline text-xs cursor-pointer"
            >
              {lang === 'fa' ? 'بستن' : 'Dismiss'}
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'team' as const, icon: Users, fa: 'تیم و دپارتمان C', en: 'Team & Dept C' },
            { id: 'projects' as const, icon: Building2, fa: 'پروژه‌ها', en: 'Projects' },
            { id: 'courses' as const, icon: BookOpen, fa: 'دوره‌های آکادمی', en: 'Academy Courses' },
            { id: 'articles' as const, icon: FileText, fa: 'مقالات و پژوهش‌ها', en: 'Insights & Research' },
            { id: 'overview' as const, icon: Receipt, fa: 'سفارش‌ها و مشاوره‌ها', en: 'Orders & Leads' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold cursor-pointer ${
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

        {/* TAB 1: TEAM & DEPARTMENT C */}
        {tab === 'team' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Department C Editor */}
            <form
              onSubmit={handleSaveDepartmentC}
              className="lg:col-span-6 bg-white border border-black/10 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-[#223981]">
                <Layers className="w-4 h-4" />
                <h2 className="text-base font-bold text-[#141923]">
                  {lang === 'fa'
                    ? 'ویرایش دپارتمان C — مهندسی سازه و طراحی لرزه‌ای'
                    : 'Edit Department C — Structural & Earthquake Engineering'}
                </h2>
              </div>
              <p className="text-xs text-[#525C6E]">
                {lang === 'fa'
                  ? 'به‌جای داده‌های ساختگی، شرح خدمات و توانمندی‌های واقعی دپارتمان سازه را مستقیماً در اینجا تنظیم کنید.'
                  : 'Configure verified Department C scope and capabilities directly without placeholder staff or project claims.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">عنوان فارسی</label>
                  <input
                    type="text"
                    value={deptTitleFa}
                    onChange={(e) => setDeptTitleFa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">English Title</label>
                  <input
                    type="text"
                    value={deptTitleEn}
                    onChange={(e) => setDeptTitleEn(e.target.value)}
                    dir="ltr"
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">زیرعنوان فارسی</label>
                  <input
                    type="text"
                    value={deptSubFa}
                    onChange={(e) => setDeptSubFa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">English Subtitle</label>
                  <input
                    type="text"
                    value={deptSubEn}
                    onChange={(e) => setDeptSubEn(e.target.value)}
                    dir="ltr"
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">توضیحات دپارتمان (فارسی)</label>
                <textarea
                  rows={3}
                  value={deptDescFa}
                  onChange={(e) => setDeptDescFa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Department Description (EN)</label>
                <textarea
                  rows={3}
                  dir="ltr"
                  value={deptDescEn}
                  onChange={(e) => setDeptDescEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    توانمندی‌ها (هر خط یک مورد - فارسی)
                  </label>
                  <textarea
                    rows={4}
                    value={deptCapsFa}
                    onChange={(e) => setDeptCapsFa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Capabilities (1 per line - EN)
                  </label>
                  <textarea
                    rows={4}
                    dir="ltr"
                    value={deptCapsEn}
                    onChange={(e) => setDeptCapsEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="px-5 py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {lang === 'fa' ? 'ذخیره اطلاعات دپارتمان C' : 'Save Department C'}
              </button>
            </form>

            {/* Add Team Member & Current Roster */}
            <div className="lg:col-span-6 space-y-6">
              <form
                onSubmit={handleAddTeamMember}
                className="bg-white border border-black/10 rounded-xl p-6 space-y-4"
              >
                <h2 className="text-base font-bold text-[#141923] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#03A54E]" />
                  <span>
                    {lang === 'fa'
                      ? 'افزودن متخصص یا مشاور به تیم'
                      : 'Add Team Member or Advisor'}
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="نام کامل (فارسی) *"
                    value={tmNameFa}
                    onChange={(e) => setTmNameFa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Full Name (English)"
                    dir="ltr"
                    value={tmNameEn}
                    onChange={(e) => setTmNameEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                  <input
                    type="text"
                    required
                    placeholder="سمت / عنوان شغلی (فارسی) *"
                    value={tmRoleFa}
                    onChange={(e) => setTmRoleFa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Role / Title (English)"
                    dir="ltr"
                    value={tmRoleEn}
                    onChange={(e) => setTmRoleEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    {lang === 'fa' ? 'دپارتمان / گروه' : 'Department / Group'}
                  </label>
                  <select
                    value={tmDept}
                    onChange={(e) =>
                      setTmDept(e.target.value as DepartmentId | 'management' | 'advisor')
                    }
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md bg-white"
                  >
                    <option value="structure">
                      {lang === 'fa'
                        ? 'دپارتمان C — مهندسی سازه و طراحی لرزه‌ای'
                        : 'Department C — Structural & Earthquake'}
                    </option>
                    <option value="energy">
                      {lang === 'fa'
                        ? 'دپارتمان B — مهندسی انرژی و توسعه پایدار'
                        : 'Department B — Energy & Sustainability'}
                    </option>
                    <option value="architecture">
                      {lang === 'fa'
                        ? 'دپارتمان A — طراحی معماری و طراحی پایدار'
                        : 'Department A — Architecture & Sustainable Design'}
                    </option>
                    <option value="management">
                      {lang === 'fa' ? 'مدیریت ارشد' : 'Executive Leadership'}
                    </option>
                    <option value="advisor">
                      {lang === 'fa' ? 'مشاور علمی (BHRC)' : 'Scientific Advisor (BHRC)'}
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <textarea
                    rows={2}
                    placeholder="سوابق تخصصی (فارسی)"
                    value={tmBioFa}
                    onChange={(e) => setTmBioFa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                  <textarea
                    rows={2}
                    dir="ltr"
                    placeholder="Bio (English)"
                    value={tmBioEn}
                    onChange={(e) => setTmBioEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="/images/team/... or upload"
                    value={tmPhoto}
                    onChange={(e) => setTmPhoto(e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-black/15 text-xs font-medium cursor-pointer hover:bg-[#F2F4F8]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'آپلود تصویر' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, setTmPhoto);
                      }}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="px-5 py-2.5 rounded-md bg-[#03A54E] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {lang === 'fa' ? 'ثبت در فهرست تیم' : 'Add Team Member'}
                </button>
              </form>

              <div className="bg-white border border-black/10 rounded-xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-[#141923]">
                  {lang === 'fa' ? `اعضای ثبت‌شده (${team.length})` : `Active Roster (${team.length})`}
                </h3>
                <div className="divide-y divide-black/5">
                  {team.map((m) => (
                    <div key={m.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-[#141923]">
                          {t(m.name, lang)}
                        </div>
                        <div className="text-xs text-[#525C6E]">
                          {t(m.role, lang)} · <span className="font-mono-tech uppercase">{m.department}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTeamMember(m.id)}
                        className="p-1.5 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                        title={lang === 'fa' ? 'حذف' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS */}
        {tab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleSaveProject}
              className="lg:col-span-6 bg-white border border-black/10 rounded-xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[#141923] flex items-center gap-2">
                  {editingProjectId ? (
                    <Pencil className="w-4 h-4 text-[#223981]" />
                  ) : (
                    <Plus className="w-4 h-4 text-[#03A54E]" />
                  )}
                  <span>
                    {editingProjectId
                      ? lang === 'fa'
                        ? 'ویرایش مطالعه موردی پروژه'
                        : 'Edit Case Study Monograph'
                      : lang === 'fa'
                      ? 'افزودن پروژه جدید به پورتفولیو'
                      : 'Publish New Case Study'}
                  </span>
                </h2>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#525C6E] hover:text-[#141923] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'لغو ویرایش' : 'Cancel Edit'}</span>
                  </button>
                )}
              </div>

              {/* Core Identity */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="عنوان پروژه (فارسی) *"
                    value={projTitleFa}
                    onChange={(e) => setProjTitleFa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Project Title (English)"
                    dir="ltr"
                    value={projTitleEn}
                    onChange={(e) => setProjTitleEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    dir="ltr"
                    placeholder="URL Slug *"
                    value={projSlug}
                    onChange={(e) => setProjSlug(e.target.value)}
                    className="col-span-2 px-3 py-2 text-xs border border-black/15 rounded-md font-mono-tech"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="Index (e.g. 12)"
                    value={projIndexNumber}
                    onChange={(e) => setProjIndexNumber(e.target.value)}
                    className="px-3 py-2 text-xs border border-black/15 rounded-md font-mono-tech"
                  />
                </div>
              </div>

              {/* Location, Year, Category, Architect */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="موقعیت (فارسی)"
                  value={projLocFa}
                  onChange={(e) => setProjLocFa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <input
                  type="text"
                  dir="ltr"
                  placeholder="Location (EN)"
                  value={projLocEn}
                  onChange={(e) => setProjLocEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <input
                  type="text"
                  dir="ltr"
                  placeholder="Year (e.g. ۱۴۰۴)"
                  value={projYear}
                  onChange={(e) => setProjYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <select
                  value={projCat}
                  onChange={(e) => setProjCat(e.target.value as ProjectCategory)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md bg-white"
                >
                  <option value="institutional">Institutional / اداری</option>
                  <option value="residential">Residential / مسکونی</option>
                  <option value="industrial">Industrial / صنعتی</option>
                  <option value="educational">Educational / آموزشی</option>
                  <option value="urban-landscape">Urban Landscape / شهری</option>
                </select>
                <input
                  type="text"
                  placeholder="معمار / کارفرما (فارسی)"
                  value={projArchFa}
                  onChange={(e) => setProjArchFa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <input
                  type="text"
                  dir="ltr"
                  placeholder="Architect / Client (EN)"
                  value={projArchEn}
                  onChange={(e) => setProjArchEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
              </div>

              {/* Departments & Energy / Sero Sabz */}
              <div className="space-y-3 pt-2 border-t border-black/5">
                <div>
                  <div className="text-xs font-medium mb-1.5">
                    {lang === 'fa' ? 'دپارتمان‌های همکار' : 'Contributing Departments'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['architecture', 'energy', 'structure'] as DepartmentId[]).map((d) => {
                      const active = projDepts.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() =>
                            setProjDepts((prev) =>
                              prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                            )
                          }
                          className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                            active
                              ? 'bg-[#223981] text-white'
                              : 'bg-[#F2F4F8] text-[#525C6E]'
                          }`}
                        >
                          {d.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium mb-1">
                      {lang === 'fa' ? 'رده انرژی مبحث ۱۹' : 'Energy Grade'}
                    </label>
                    <select
                      value={projGrade}
                      onChange={(e) =>
                        setProjGrade(e.target.value as '' | 'ECZn' | 'EC++' | 'EC+' | 'EC')
                      }
                      className="w-full px-2.5 py-2 text-xs border border-black/15 rounded-md bg-white"
                    >
                      <option value="">None / نامشخص</option>
                      <option value="ECZn">ECZn</option>
                      <option value="EC++">EC++</option>
                      <option value="EC+">EC+</option>
                      <option value="EC">EC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1">
                      {lang === 'fa' ? 'گواهی سرو سبز (FA)' : 'Sero Sabz (FA)'}
                    </label>
                    <input
                      type="text"
                      placeholder="سرو طلایی"
                      value={projSeroFa}
                      onChange={(e) => setProjSeroFa(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs border border-black/15 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1">Sero Sabz (EN)</label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="Golden Cypress"
                      value={projSeroEn}
                      onChange={(e) => setProjSeroEn(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs border border-black/15 rounded-md"
                    />
                  </div>
                </div>

                {/* Linked Services Selector */}
                <div>
                  <div className="text-xs font-medium mb-1.5">
                    {lang === 'fa' ? 'خدمات ارائه‌شده در پروژه' : 'Applied ISB Services'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-2.5 border border-black/10 rounded-md bg-[#FAFBFD]">
                    {services.map((srv) => {
                      const checked =
                        projServices.includes(srv.id) || projServices.includes(srv.slug);
                      return (
                        <label
                          key={srv.id}
                          className="flex items-center gap-2 text-[11px] text-[#141923] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setProjServices((prev) =>
                                checked
                                  ? prev.filter((x) => x !== srv.id && x !== srv.slug)
                                  : [...prev, srv.id]
                              )
                            }
                          />
                          <span className="font-mono-tech text-[#223981]">{srv.index}</span>
                          <span className="truncate">{t(srv.title, lang)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Editorial Summary & Narrative */}
              <div className="space-y-3 pt-2 border-t border-black/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <textarea
                    rows={2}
                    placeholder="خلاصه پروژه (فارسی)"
                    value={projSumFa}
                    onChange={(e) => setProjSumFa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                  <textarea
                    rows={2}
                    dir="ltr"
                    placeholder="Project Summary (English)"
                    value={projSumEn}
                    onChange={(e) => setProjSumEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <textarea
                    rows={3}
                    placeholder="روایت کامل مهندسی و معماری (فارسی)"
                    value={projNarrFa}
                    onChange={(e) => setProjNarrFa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                  <textarea
                    rows={3}
                    dir="ltr"
                    placeholder="Full Architectural & Engineering Narrative (EN)"
                    value={projNarrEn}
                    onChange={(e) => setProjNarrEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>
              </div>

              {/* Scope of Work & Design Strategies */}
              <div className="space-y-3 pt-2 border-t border-black/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <textarea
                    rows={3}
                    placeholder="حوزه همکاری ISB (هر خط یک مورد - فارسی)"
                    value={projScopeFa}
                    onChange={(e) => setProjScopeFa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                  <textarea
                    rows={3}
                    dir="ltr"
                    placeholder="ISB Scope of Work (1 per line - EN)"
                    value={projScopeEn}
                    onChange={(e) => setProjScopeEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <textarea
                    rows={3}
                    placeholder="راهبردهای طراحی و بهینه‌سازی (هر خط یک مورد - فارسی)"
                    value={projStratFa}
                    onChange={(e) => setProjStratFa(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                  <textarea
                    rows={3}
                    dir="ltr"
                    placeholder="Design Strategies (1 per line - EN)"
                    value={projStratEn}
                    onChange={(e) => setProjStratEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                  />
                </div>
              </div>

              {/* Technical Metrics Builder */}
              <div className="space-y-2.5 pt-2 border-t border-black/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#141923]">
                    {lang === 'fa' ? 'شاخص‌های کمی عملکردی (Metrics)' : 'Verified Technical Metrics'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setProjMetrics((prev) => [
                        ...prev,
                        { label: { fa: '', en: '' }, value: '', unit: '', note: { fa: '', en: '' } },
                      ])
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#03A54E] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'افزودن شاخص' : 'Add Metric'}</span>
                  </button>
                </div>

                {projMetrics.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-[#FAFBFD] border border-black/10 rounded-md space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="عنوان شاخص (فارسی)"
                        value={m.label.fa}
                        onChange={(e) =>
                          setProjMetrics((prev) =>
                            prev.map((row, i) =>
                              i === idx ? { ...row, label: { ...row.label, fa: e.target.value } } : row
                            )
                          )
                        }
                        className="px-2 py-1.5 text-[11px] border border-black/15 rounded bg-white"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="Metric Label (EN)"
                        value={m.label.en}
                        onChange={(e) =>
                          setProjMetrics((prev) =>
                            prev.map((row, i) =>
                              i === idx ? { ...row, label: { ...row.label, en: e.target.value } } : row
                            )
                          )
                        }
                        className="px-2 py-1.5 text-[11px] border border-black/15 rounded bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="Value (e.g. -22%)"
                        value={m.value}
                        onChange={(e) =>
                          setProjMetrics((prev) =>
                            prev.map((row, i) => (i === idx ? { ...row, value: e.target.value } : row))
                          )
                        }
                        className="w-28 px-2 py-1.5 text-[11px] font-mono-tech border border-black/15 rounded bg-white"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="Unit (e.g. kWh/m²)"
                        value={m.unit || ''}
                        onChange={(e) =>
                          setProjMetrics((prev) =>
                            prev.map((row, i) => (i === idx ? { ...row, unit: e.target.value } : row))
                          )
                        }
                        className="w-28 px-2 py-1.5 text-[11px] font-mono-tech border border-black/15 rounded bg-white"
                      />
                      <input
                        type="text"
                        placeholder="توضیح تکمیلی"
                        value={m.note?.fa || ''}
                        onChange={(e) =>
                          setProjMetrics((prev) =>
                            prev.map((row, i) =>
                              i === idx
                                ? {
                                    ...row,
                                    note: { fa: e.target.value, en: row.note?.en || e.target.value },
                                  }
                                : row
                            )
                          )
                        }
                        className="flex-1 px-2 py-1.5 text-[11px] border border-black/15 rounded bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setProjMetrics((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        aria-label="Remove metric"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hero Image & Gallery / Technical Diagrams */}
              <div className="space-y-3 pt-2 border-t border-black/5">
                <div className="text-xs font-semibold text-[#141923]">
                  {lang === 'fa' ? 'تصویر شاخص و گالری / دیاگرام‌های فنی' : 'Hero Image & Gallery / Diagrams'}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    value={projHeroImg}
                    onChange={(e) => setProjHeroImg(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-black/15 rounded-md font-mono-tech"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-black/15 text-xs font-medium cursor-pointer hover:bg-[#F2F4F8]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'آپلود تصویر اصلی' : 'Upload Hero'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, setProjHeroImg);
                      }}
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#525C6E]">
                    {lang === 'fa'
                      ? `اسلایدهای گالری و دیاگرام (${projGallery.length})`
                      : `Gallery & Diagram Plates (${projGallery.length})`}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setProjGallery((prev) => [
                        ...prev,
                        { src: '', caption: { fa: '', en: '' } },
                      ])
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#03A54E] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'fa' ? 'افزودن تصویر / دیاگرام' : 'Add Plate / Diagram'}</span>
                  </button>
                </div>

                {projGallery.map((g, idx) => (
                  <div key={idx} className="p-2.5 bg-[#FAFBFD] border border-black/10 rounded-md space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="/images/diagrams/... or upload"
                        value={g.src}
                        onChange={(e) =>
                          setProjGallery((prev) =>
                            prev.map((row, i) => (i === idx ? { ...row, src: e.target.value } : row))
                          )
                        }
                        className="flex-1 px-2 py-1.5 text-[11px] font-mono-tech border border-black/15 rounded bg-white"
                      />
                      <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-black/15 text-[11px] font-medium cursor-pointer bg-white hover:bg-[#F2F4F8]">
                        <Upload className="w-3 h-3" />
                        <span>{lang === 'fa' ? 'آپلود' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (url) =>
                                setProjGallery((prev) =>
                                  prev.map((row, i) => (i === idx ? { ...row, src: url } : row))
                                )
                              );
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setProjGallery((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        aria-label="Remove plate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="شرح تصویر یا دیاگرام (فارسی)"
                        value={g.caption.fa}
                        onChange={(e) =>
                          setProjGallery((prev) =>
                            prev.map((row, i) =>
                              i === idx
                                ? { ...row, caption: { ...row.caption, fa: e.target.value } }
                                : row
                            )
                          )
                        }
                        className="px-2 py-1.5 text-[11px] border border-black/15 rounded bg-white"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="Caption (English)"
                        value={g.caption.en}
                        onChange={(e) =>
                          setProjGallery((prev) =>
                            prev.map((row, i) =>
                              i === idx
                                ? { ...row, caption: { ...row.caption, en: e.target.value } }
                                : row
                            )
                          )
                        }
                        className="px-2 py-1.5 text-[11px] border border-black/15 rounded bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-2 text-xs cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={projFeatured}
                  onChange={(e) => setProjFeatured(e.target.checked)}
                />
                <span>{lang === 'fa' ? 'نمایش به‌عنوان پروژه شاخص' : 'Featured Case Study'}</span>
              </label>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {editingProjectId
                  ? lang === 'fa'
                    ? 'ذخیره تغییرات پروژه'
                    : 'Save Case Study Changes'
                  : lang === 'fa'
                  ? 'انتشار پروژه'
                  : 'Publish Case Study'}
              </button>
            </form>

            <div className="lg:col-span-6 bg-white border border-black/10 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#141923]">
                {lang === 'fa'
                  ? `پروژه‌های موجود (${projects.length})`
                  : `Published Projects (${projects.length})`}
              </h3>
              <div className="divide-y divide-black/5">
                {projects.map((p) => {
                  const isEditingThis = editingProjectId === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`py-3.5 px-2 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isEditingThis ? 'bg-[#223981]/5 ring-1 ring-[#223981]/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.heroImage}
                          alt={t(p.title, lang)}
                          referrerPolicy="no-referrer"
                          className="w-16 h-11 rounded object-cover bg-[#0B1536] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-[11px] font-mono-tech text-[#525C6E] truncate">
                            {p.indexNumber} · {p.departments.join(', ').toUpperCase()} · {p.year}
                            {p.energyGrade ? ` · ${p.energyGrade}` : ''}
                          </div>
                          <div className="text-sm font-bold text-[#141923] truncate">
                            {t(p.title, lang)}
                          </div>
                          <div className="text-[11px] text-[#525C6E] truncate">
                            {p.services.length} {lang === 'fa' ? 'خدمت' : 'services'} ·{' '}
                            {p.galleryImages.length} {lang === 'fa' ? 'تصویر' : 'plates'} ·{' '}
                            {p.metrics.length} {lang === 'fa' ? 'شاخص' : 'KPIs'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => navigate(`/projects/${p.slug}`)}
                          className="p-1.5 rounded text-[#525C6E] hover:bg-[#F2F4F8] cursor-pointer"
                          title={lang === 'fa' ? 'مشاهده صفحه پروژه' : 'View Case Study'}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditProject(p)}
                          className="px-2.5 py-1.5 rounded text-xs font-semibold bg-[#223981]/10 text-[#223981] hover:bg-[#223981]/20 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>{lang === 'fa' ? 'ویرایش' : 'Edit'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleProjectFeatured(p.id, p.featured)}
                          className={`px-2.5 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                            p.featured
                              ? 'bg-[#03A54E]/15 text-[#027A3B]'
                              : 'bg-[#F2F4F8] text-[#525C6E]'
                          }`}
                        >
                          {p.featured
                            ? lang === 'fa'
                              ? 'شاخص'
                              : 'Featured'
                            : lang === 'fa'
                            ? 'معمولی'
                            : 'Standard'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-1.5 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                          title={lang === 'fa' ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACADEMY COURSES */}
        {tab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleAddCourse}
              className="lg:col-span-5 bg-white border border-black/10 rounded-xl p-6 space-y-3.5"
            >
              <h2 className="text-base font-bold text-[#141923] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#03A54E]" />
                <span>{lang === 'fa' ? 'ایجاد دوره آموزشی جدید' : 'Create Academy Course'}</span>
              </h2>
              <input
                type="text"
                required
                placeholder="عنوان دوره (فارسی) *"
                value={crsTitleFa}
                onChange={(e) => setCrsTitleFa(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
              />
              <input
                type="text"
                placeholder="Course Title (English)"
                dir="ltr"
                value={crsTitleEn}
                onChange={(e) => setCrsTitleEn(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
              />
              <input
                type="text"
                required
                dir="ltr"
                placeholder="URL Slug (e.g. seismic-retrofit-studio) *"
                value={crsSlug}
                onChange={(e) => setCrsSlug(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md font-mono-tech"
              />
              <input
                type="text"
                placeholder="توضیح کوتاه (فارسی)"
                value={crsSubFa}
                onChange={(e) => setCrsSubFa(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
              />
              <input
                type="text"
                dir="ltr"
                placeholder="Short Subtitle (English)"
                value={crsSubEn}
                onChange={(e) => setCrsSubEn(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={crsCat}
                  onChange={(e) =>
                    setCrsCat(
                      e.target.value as
                        | 'regulations'
                        | 'simulation'
                        | 'green-building'
                        | 'certification'
                    )
                  }
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md bg-white"
                >
                  <option value="simulation">Simulation / شبیه‌سازی</option>
                  <option value="regulations">Regulations / مبحث ۱۹</option>
                  <option value="green-building">Green Building / ساختمان سبز</option>
                  <option value="certification">Certification / گواهینامه</option>
                </select>
                <select
                  value={crsFormat}
                  onChange={(e) =>
                    setCrsFormat(e.target.value as 'workshop' | 'live-online' | 'recorded')
                  }
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md bg-white"
                >
                  <option value="live-online">Live Online</option>
                  <option value="workshop">Workshop</option>
                  <option value="recorded">Recorded</option>
                </select>
                <input
                  type="text"
                  placeholder="نام مدرس (فارسی)"
                  value={crsInstrFa}
                  onChange={(e) => setCrsInstrFa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <input
                  type="text"
                  dir="ltr"
                  placeholder="Instructor (English)"
                  value={crsInstrEn}
                  onChange={(e) => setCrsInstrEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <input
                  type="text"
                  placeholder="مدت دوره (فارسی)"
                  value={crsDurFa}
                  onChange={(e) => setCrsDurFa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <input
                  type="text"
                  dir="ltr"
                  placeholder="Duration (EN)"
                  value={crsDurEn}
                  onChange={(e) => setCrsDurEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  {lang === 'fa' ? 'شهریه دوره (تومان)' : 'Course Tuition (Toman)'}
                </label>
                <input
                  type="number"
                  dir="ltr"
                  min={0}
                  value={crsPrice}
                  onChange={(e) => setCrsPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md font-mono-tech"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  dir="ltr"
                  value={crsPoster}
                  onChange={(e) => setCrsPoster(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-black/15 text-xs font-medium cursor-pointer hover:bg-[#F2F4F8]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'پوستر' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, setCrsPoster);
                    }}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold cursor-pointer"
              >
                {lang === 'fa' ? 'ثبت دوره جدید' : 'Add Course'}
              </button>
            </form>

            <div className="lg:col-span-7 bg-white border border-black/10 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#141923]">
                {lang === 'fa'
                  ? `مدیریت شهریه و وضعیت دوره‌ها (${courses.length})`
                  : `Manage Tuition & Availability (${courses.length})`}
              </h3>
              <div className="divide-y divide-black/5">
                {courses.map((c) => {
                  const draft = priceDrafts[c.id] ?? String(c.priceToman);
                  return (
                    <div key={c.id} className="py-4 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-bold text-[#141923]">{t(c.title, lang)}</div>
                          <div className="text-xs text-[#525C6E]">
                            {t(c.instructor, lang)} · {formatPrice(c.priceToman)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUpdateCourse(c.id, { isAvailable: !c.isAvailable })}
                          className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                            c.isAvailable
                              ? 'bg-[#03A54E]/15 text-[#027A3B]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.isAvailable
                            ? lang === 'fa'
                              ? 'ثبت‌نام باز'
                              : 'Open'
                            : lang === 'fa'
                            ? 'توقف ثبت‌نام'
                            : 'Closed'}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          dir="ltr"
                          value={draft}
                          onChange={(e) =>
                            setPriceDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))
                          }
                          className="w-40 px-3 py-1.5 text-xs border border-black/15 rounded font-mono-tech"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateCourse(c.id, {
                              priceToman: Math.max(0, Number(draft) || 0),
                            })
                          }
                          className="px-3 py-1.5 rounded bg-[#223981] text-white text-xs font-semibold cursor-pointer"
                        >
                          {lang === 'fa' ? 'تغییر قیمت' : 'Update Price'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ARTICLES */}
        {tab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleAddArticle}
              className="lg:col-span-6 bg-white border border-black/10 rounded-xl p-6 space-y-3.5"
            >
              <h2 className="text-base font-bold text-[#141923]">
                {lang === 'fa' ? 'انتشار یادداشت فنی / مقاله پژوهشی' : 'Publish Technical Insight'}
              </h2>
              <input
                type="text"
                required
                placeholder="عنوان مقاله (فارسی) *"
                value={artTitleFa}
                onChange={(e) => setArtTitleFa(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
              />
              <input
                type="text"
                dir="ltr"
                placeholder="Article Title (English)"
                value={artTitleEn}
                onChange={(e) => setArtTitleEn(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
              />
              <input
                type="text"
                required
                dir="ltr"
                placeholder="Slug (e.g. mashhad-thermal-envelope) *"
                value={artSlug}
                onChange={(e) => setArtSlug(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md font-mono-tech"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="دسته‌بندی (فارسی)"
                  value={artCatFa}
                  onChange={(e) => setArtCatFa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <input
                  type="text"
                  dir="ltr"
                  placeholder="Category (EN)"
                  value={artCatEn}
                  onChange={(e) => setArtCatEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <input
                  type="text"
                  placeholder="نویسنده (فارسی)"
                  value={artAuthorFa}
                  onChange={(e) => setArtAuthorFa(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <input
                  type="text"
                  dir="ltr"
                  placeholder="Author (EN)"
                  value={artAuthorEn}
                  onChange={(e) => setArtAuthorEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
                />
              </div>

              <select
                value={artDept}
                onChange={(e) => setArtDept(e.target.value as DepartmentId)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md bg-white"
              >
                <option value="energy">Department B — Energy</option>
                <option value="architecture">Department A — Architecture</option>
                <option value="structure">Department C — Structure</option>
              </select>

              <textarea
                rows={2}
                placeholder="چکیده مقاله (فارسی)"
                value={artExcerptFa}
                onChange={(e) => setArtExcerptFa(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
              />
              <textarea
                rows={2}
                dir="ltr"
                placeholder="Excerpt (English)"
                value={artExcerptEn}
                onChange={(e) => setArtExcerptEn(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
              />
              <textarea
                rows={3}
                placeholder="متن کامل (هر پاراگراف در یک خط - فارسی)"
                value={artBodyFa}
                onChange={(e) => setArtBodyFa(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
              />
              <textarea
                rows={3}
                dir="ltr"
                placeholder="Body paragraphs (1 per line - English)"
                value={artBodyEn}
                onChange={(e) => setArtBodyEn(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/15 rounded-md"
              />

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  dir="ltr"
                  value={artImg}
                  onChange={(e) => setArtImg(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-black/15 rounded-md"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-black/15 text-xs font-medium cursor-pointer hover:bg-[#F2F4F8]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'تصویر' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, setArtImg);
                    }}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold cursor-pointer"
              >
                {lang === 'fa' ? 'انتشار مقاله' : 'Publish Article'}
              </button>
            </form>

            <div className="lg:col-span-6 bg-white border border-black/10 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#141923]">
                {lang === 'fa'
                  ? `مقالات منتشرشده (${articles.length})`
                  : `Published Insights (${articles.length})`}
              </h3>
              <div className="divide-y divide-black/5">
                {articles.map((a) => (
                  <div key={a.id} className="py-3 space-y-1">
                    <div className="text-xs text-[#525C6E] flex items-center gap-1.5">
                      <span className="font-mono-tech">{a.publishedAt}</span>
                      <span>·</span>
                      <span>{t(a.category, lang)}</span>
                    </div>
                    <div className="text-sm font-bold text-[#141923]">{t(a.title, lang)}</div>
                    <div className="text-xs text-[#525C6E]">{t(a.author, lang)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: OVERVIEW (ORDERS & CONSULTATIONS) */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {overviewError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{overviewError}</span>
                </div>
                <button
                  type="button"
                  onClick={fetchOverview}
                  disabled={overviewLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-red-200 font-semibold hover:bg-red-100 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${overviewLoading ? 'animate-spin' : ''}`} />
                  <span>{lang === 'fa' ? 'تلاش مجدد' : 'Retry'}</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-black/10 rounded-xl p-5">
                <div className="text-xs text-[#525C6E]">
                  {lang === 'fa' ? 'کل سفارش‌ها' : 'Total Orders'}
                </div>
                <div className="text-2xl font-bold text-[#141923] font-mono-tech tabular-nums mt-1">
                  {overviewLoading && orders.length === 0 ? '…' : orders.length}
                </div>
              </div>
              <div className="bg-white border border-black/10 rounded-xl p-5">
                <div className="text-xs text-[#525C6E]">
                  {lang === 'fa' ? 'ثبت‌نام‌های فعال' : 'Active Enrollments'}
                </div>
                <div className="text-2xl font-bold text-[#027A3B] font-mono-tech tabular-nums mt-1">
                  {overviewLoading && enrollments.length === 0 ? '…' : enrollments.length}
                </div>
              </div>
              <div className="bg-white border border-black/10 rounded-xl p-5">
                <div className="text-xs text-[#525C6E]">
                  {lang === 'fa' ? 'درخواست‌های مشاوره' : 'Consultation Leads'}
                </div>
                <div className="text-2xl font-bold text-[#223981] font-mono-tech tabular-nums mt-1">
                  {overviewLoading && consultations.length === 0 ? '…' : consultations.length}
                </div>
              </div>
              <div className="bg-white border border-black/10 rounded-xl p-5">
                <div className="text-xs text-[#525C6E]">
                  {lang === 'fa' ? 'کاربران سیستم' : 'Registered Users'}
                </div>
                <div className="text-2xl font-bold text-[#141923] font-mono-tech tabular-nums mt-1">
                  {overviewLoading && usersList.length === 0 ? '…' : usersList.length}
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-black/10 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-[#141923]">
                {lang === 'fa' ? 'سفارش‌های آکادمی' : 'Academy Orders'}
              </h2>
              {orders.length === 0 ? (
                <p className="text-xs text-[#525C6E]">
                  {lang === 'fa' ? 'هنوز سفارشی ثبت نشده است.' : 'No orders recorded yet.'}
                </p>
              ) : (
                <div className="divide-y divide-black/5">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-mono-tech text-[#223981] font-semibold">
                          {ord.id} {ord.refId ? `· RefID: ${ord.refId}` : ''}
                        </div>
                        <div className="text-sm font-bold text-[#141923]">
                          {ord.userName} ({ord.userEmail})
                        </div>
                        <div className="text-xs text-[#525C6E]">
                          {ord.items.map((i) => (lang === 'fa' ? i.titleFa : i.titleEn)).join('، ')}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold tabular-nums">
                          {formatPrice(ord.totalToman)}
                        </span>
                        <span className="text-xs font-mono-tech px-2 py-1 rounded bg-[#F2F4F8] text-[#141923]">
                          {ord.status.toUpperCase()}
                        </span>
                        {ord.status === 'paid' && (
                          <button
                            type="button"
                            onClick={() => handleRefundOrder(ord.id)}
                            className="px-3 py-1 rounded bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 cursor-pointer"
                          >
                            {lang === 'fa' ? 'بازپرداخت' : 'Refund'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Consultations */}
            <div className="bg-white border border-black/10 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-[#141923]">
                {lang === 'fa' ? 'درخواست‌های مشاوره مهندسی' : 'Engineering Consultation Requests'}
              </h2>
              {consultations.length === 0 ? (
                <p className="text-xs text-[#525C6E]">
                  {lang === 'fa' ? 'هنوز درخواستی ثبت نشده است.' : 'No consultation inquiries yet.'}
                </p>
              ) : (
                <div className="divide-y divide-black/5">
                  {consultations.map((c) => (
                    <div key={c.id} className="py-3.5 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-bold text-[#141923]">
                          {c.name} {c.organization ? `· ${c.organization}` : ''}
                        </div>
                        <div className="text-xs font-mono-tech text-[#027A3B] uppercase">
                          {c.department} · {c.phone}
                        </div>
                      </div>
                      <p className="text-xs text-[#525C6E] leading-relaxed">{c.message}</p>
                      <div className="text-[11px] text-[#525C6E]/80 flex flex-wrap items-center gap-1.5">
                        <span className="font-mono-tech">{c.email}</span>
                        {c.projectLocation ? <span>· {c.projectLocation}</span> : null}
                        <span>·</span>
                        <span className="tabular-nums">
                          {new Date(c.createdAt).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
