import React, { useEffect, useState } from 'react';
import { Compass, MessageSquare, Send, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { DepartmentId } from '../types/isb';

export const ConsultationAssistant: React.FC = () => {
  const { lang, navigate, departments, services } = useApp();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'navigator' | 'assistant'>('navigator');

  // Intelligent Service Navigator state
  const [buildingType, setBuildingType] = useState<'residential' | 'industrial' | 'institutional'>('residential');
  const [goal, setGoal] = useState<'certification' | 'simulation' | 'envelope' | 'structure'>('certification');

  // AI Q&A state
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string; disclaimer?: string }[]
  >([]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const getRecommendedDepartment = (): DepartmentId => {
    if (goal === 'structure') return 'structure';
    if (goal === 'certification' || goal === 'simulation' || goal === 'envelope') return 'energy';
    return 'architecture';
  };

  const getRecommendedServices = () => {
    if (goal === 'certification') {
      return services.filter((s) => ['srv-12', 'srv-11', 'srv-01'].includes(s.id));
    }
    if (goal === 'simulation') {
      return services.filter((s) => ['srv-02', 'srv-03', 'srv-04'].includes(s.id));
    }
    if (goal === 'envelope') {
      return services.filter((s) => ['srv-05', 'srv-06', 'srv-08'].includes(s.id));
    }
    return services.filter((s) => s.department === 'architecture').slice(0, 3);
  };

  const recDept = departments.find((d) => d.id === getRecommendedDepartment());
  const recServices = getRecommendedServices();

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, lang }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.error || 'Error connecting to assistant.' },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.answer, disclaimer: data.disclaimer },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            lang === 'fa'
              ? 'خطا در برقراری ارتباط با سرور.'
              : 'Unable to reach consultation service.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 end-5 z-30 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#223981] text-white text-xs font-semibold shadow-lg hover:bg-[#1a2c66] transition-colors cursor-pointer"
          aria-label={lang === 'fa' ? 'راهنمای هوشمند خدمات ISB' : 'ISB Smart Advisor'}
        >
          <Compass className="w-4 h-4 text-[#03A54E]" />
          <span>{lang === 'fa' ? 'راهنمای خدمات و مشاوره' : 'Service Guide'}</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 end-5 z-50 w-[min(390px,calc(100vw-2.5rem))] bg-white border border-black/15 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
          <div className="bg-[#0B1536] text-white px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold">
              {lang === 'fa' ? 'راهنمای هوشمند خدمات ISB' : 'ISB Smart Guide'}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label={lang === 'fa' ? 'بستن' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex border-b border-black/10 bg-[#F2F4F8] p-1 gap-1">
            <button
              type="button"
              onClick={() => setTab('navigator')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                tab === 'navigator' ? 'bg-white text-[#141923] shadow-sm' : 'text-[#525C6E]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'ناوبری خدمات' : 'Service Navigator'}</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('assistant')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                tab === 'assistant' ? 'bg-white text-[#141923] shadow-sm' : 'text-[#525C6E]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{lang === 'fa' ? 'پرسش‌ و پاسخ هوشمند' : 'AI Assistant'}</span>
            </button>
          </div>

          {tab === 'navigator' ? (
            <div className="p-4 space-y-4 overflow-y-auto text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#525C6E] mb-1.5">
                  {lang === 'fa' ? 'نوع کاربری پروژه شما:' : 'Project Typology:'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'residential' as const, fa: 'مسکونی', en: 'Residential' },
                    { id: 'industrial' as const, fa: 'صنعتی', en: 'Industrial' },
                    { id: 'institutional' as const, fa: 'اداری / عمومی', en: 'Civic / Edu' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBuildingType(opt.id)}
                      className={`py-2 px-2 text-xs rounded border cursor-pointer ${
                        buildingType === opt.id
                          ? 'border-[#223981] bg-[#223981]/10 text-[#223981] font-semibold'
                          : 'border-black/10 text-[#525C6E]'
                      }`}
                    >
                      {lang === 'fa' ? opt.fa : opt.en}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#525C6E] mb-1.5">
                  {lang === 'fa' ? 'هدف اصلی پروژه:' : 'Primary Objective:'}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'certification' as const, fa: 'مبحث ۱۹ و سرو سبز', en: 'Ch.19 & Sero Sabz' },
                    { id: 'simulation' as const, fa: 'شبیه‌سازی انرژی و نور', en: 'Energy & Daylight' },
                    { id: 'envelope' as const, fa: 'بهینه‌سازی نما و پل حرارتی', en: 'Façade & Thermal' },
                    { id: 'structure' as const, fa: 'طراحی سازه و لرزه‌ای', en: 'Structural & Seismic' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setGoal(opt.id)}
                      className={`py-2 px-2.5 text-xs rounded border text-start cursor-pointer ${
                        goal === opt.id
                          ? 'border-[#03A54E] bg-[#03A54E]/10 text-[#0B1536] font-semibold'
                          : 'border-black/10 text-[#525C6E]'
                      }`}
                    >
                      {lang === 'fa' ? opt.fa : opt.en}
                    </button>
                  ))}
                </div>
              </div>

              {recDept && (
                <div className="p-3.5 rounded-lg bg-[#F2F4F8] border border-black/10 space-y-2.5">
                  <div className="text-xs text-[#525C6E]">
                    {lang === 'fa' ? 'دپارتمان پیشنهادی:' : 'Recommended Department:'}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/departments/${recDept.id}`);
                      setOpen(false);
                    }}
                    className="text-sm font-bold text-[#223981] hover:underline cursor-pointer text-start block"
                  >
                    {recDept.index}. {t(recDept.title, lang)}
                  </button>
                  <div className="pt-1 border-t border-black/10 space-y-1.5">
                    {recServices.map((srv) => (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => {
                          navigate(`/services/${srv.slug}`);
                          setOpen(false);
                        }}
                        className="block w-full text-start text-xs text-[#141923] hover:text-[#223981] cursor-pointer"
                      >
                        • {t(srv.title, lang)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  navigate('/contact');
                  setOpen(false);
                }}
                className="w-full py-2.5 rounded-md bg-[#223981] text-white text-xs font-semibold hover:bg-[#192b63] cursor-pointer"
              >
                {lang === 'fa' ? 'ثبت درخواست مشاوره تخصصی' : 'Book Engineering Consultation'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-[360px]">
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-[#F2F4F8] text-[#525C6E] leading-relaxed">
                  {lang === 'fa'
                    ? 'سوالات خود را درباره پروژه‌ها، خدمات مبحث ۱۹، استاندارد سرو سبز یا دوره‌های آکادمی ISB بپرسید.'
                    : 'Ask about verified ISB projects, Chapter 19 compliance, Sero Sabz certification, or ISB Academy courses.'}
                </div>
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#223981] text-white ms-6'
                        : 'bg-[#F2F4F8] text-[#141923] me-4'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    {m.disclaimer && (
                      <p className="mt-2 pt-2 border-t border-black/10 text-[11px] text-[#525C6E]">
                        {m.disclaimer}
                      </p>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="text-xs text-[#525C6E]">
                    {lang === 'fa' ? 'در حال بررسی اطلاعات کاتالوگ...' : 'Reviewing verified ISB data...'}
                  </div>
                )}
              </div>

              <form onSubmit={handleAsk} className="p-3 border-t border-black/10 flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={
                    lang === 'fa' ? 'مثلاً: رده انرژی پروژه مهرگان چیست؟' : 'e.g. What grade did Mehregan achieve?'
                  }
                  className="flex-1 px-3 py-2 text-xs border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-2 rounded-md bg-[#223981] text-white hover:bg-[#192b63] disabled:opacity-50 cursor-pointer"
                  aria-label="Send"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};
