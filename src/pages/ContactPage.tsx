import React, { useState } from 'react';
import { CheckCircle2, Instagram, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/isbCatalogue';
import { t, uiText } from '../i18n/translations';
import { DepartmentId } from '../types/isb';

export const ContactPage: React.FC = () => {
  const { lang, departments } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState<DepartmentId>('energy');
  const [projectLocation, setProjectLocation] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!consent) {
      setError(
        lang === 'fa'
          ? 'لطفاً رضایت‌نامه پردازش اطلاعات تماس برای هماهنگی مشاوره را تأیید کنید.'
          : 'Please confirm privacy consent to submit your consultation request.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          organization,
          department,
          projectLocation,
          message,
          consentAccepted: consent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Submission failed.');
      } else {
        setSubmittedId(data.consultation.id);
        setName('');
        setEmail('');
        setPhone('');
        setOrganization('');
        setProjectLocation('');
        setMessage('');
        setConsent(false);
      }
    } catch {
      setError(lang === 'fa' ? 'خطا در ثبت درخواست' : 'Network error submitting form.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#FAFBFD]">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-mono-tech text-[#223981] font-semibold">
            {t(uiText.nav.contact, lang)}
          </p>
          <h1 className="text-3xl lg:text-5xl font-bold text-[#141923]">
            {lang === 'fa' ? 'درخواست مشاوره تخصصی و ارتباط با ISB' : 'Consultation & Contact'}
          </h1>
          <p className="text-base text-[#525C6E]">
            {lang === 'fa'
              ? 'برای مشاوره طراحی معماری، شبیه‌سازی انرژی، مبحث ۱۹، اخذ گواهینامه سرو سبز یا طراحی سازه با ما در ارتباط باشید.'
              : 'Connect with our engineering and architectural specialists in Mashhad for project reviews and sustainability audits.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Consultation Form */}
          <div className="lg:col-span-7 bg-white border border-black/10 rounded-xl p-6 lg:p-8">
            {submittedId ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#03A54E] mx-auto" />
                <h2 className="text-xl font-bold text-[#141923]">
                  {lang === 'fa' ? 'درخواست مشاوره شما با موفقیت ثبت شد' : 'Consultation Request Received'}
                </h2>
                <p className="text-sm text-[#525C6E]">
                  {lang === 'fa' ? 'کد پیگیری:' : 'Reference ID:'}{' '}
                  <span className="font-mono-tech font-semibold text-[#223981]">{submittedId}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedId('')}
                  className="px-5 py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold cursor-pointer"
                >
                  {lang === 'fa' ? 'ثبت درخواست جدید' : 'Submit Another Request'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-[#141923] pb-2 border-b border-black/5">
                  {lang === 'fa' ? 'فرم درخواست مشاوره پروژه' : 'Project Consultation Brief'}
                </h2>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#141923] mb-1">
                      {lang === 'fa' ? 'نام و نام خانوادگی *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#141923] mb-1">
                      {lang === 'fa' ? 'شماره تماس *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                      className="w-full px-3.5 py-2.5 text-sm border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#141923] mb-1">
                      {lang === 'fa' ? 'ایمیل *' : 'Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      dir="ltr"
                      className="w-full px-3.5 py-2.5 text-sm border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#141923] mb-1">
                      {lang === 'fa' ? 'شرکت / کارفرما' : 'Organization / Client'}
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#141923] mb-1">
                      {lang === 'fa' ? 'دپارتمان مرتبط' : 'Target Department'}
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as DepartmentId)}
                      className="w-full px-3.5 py-2.5 text-sm border border-black/15 rounded-md bg-white focus:outline-none focus:border-[#223981]"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {t(d.title, lang)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#141923] mb-1">
                      {lang === 'fa' ? 'شهر و موقعیت پروژه' : 'Project City / Location'}
                    </label>
                    <input
                      type="text"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#141923] mb-1">
                    {lang === 'fa' ? 'شرح پروژه و خدمات مورد نیاز *' : 'Project Scope & Requirements *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
                  />
                </div>

                <label className="flex items-start gap-2.5 text-xs text-[#525C6E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded border-black/25 text-[#223981]"
                  />
                  <span>
                    {lang === 'fa'
                      ? 'با ثبت و نگهداری اطلاعات تماس این فرم صرفاً برای بررسی درخواست مشاوره توسط تیم ISB موافقم.'
                      : 'I consent to ISB Group storing this contact information solely to respond to my consultation request.'}
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-md bg-[#223981] text-white text-sm font-semibold hover:bg-[#192b63] disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? t(uiText.common.loading, lang) : t(uiText.common.submit, lang)}
                </button>
              </form>
            )}
          </div>

          {/* Office Details & Location Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B1536] text-white rounded-xl p-6 lg:p-8 space-y-5">
              <h2 className="text-xl font-bold">
                {lang === 'fa' ? 'دفتر مرکزی مشهد' : 'Mashhad Head Office'}
              </h2>
              <div className="space-y-4 text-sm text-white/85">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#03A54E] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{t(COMPANY_INFO.address, lang)}</p>
                </div>
                <div className="flex items-center gap-3 font-mono-tech" dir="ltr">
                  <Phone className="w-5 h-5 text-[#03A54E] shrink-0" />
                  <span>09151213005 · 09339039563</span>
                </div>
                <a
                  href={COMPANY_INFO.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 hover:text-white transition-colors"
                  dir="ltr"
                >
                  <Instagram className="w-5 h-5 text-[#03A54E]" />
                  <span>{COMPANY_INFO.instagram}</span>
                </a>
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
              <iframe
                title={lang === 'fa' ? 'نقشه دفتر گروه ISB در مشهد' : 'ISB Group Mashhad Office Map'}
                src="https://www.openstreetmap.org/export/embed.html?bbox=59.512%2C36.312%2C59.552%2C36.336&layer=mapnik&marker=36.3228%2C59.5326"
                className="w-full h-64 border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
