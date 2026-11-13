import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, uiText } from '../i18n/translations';
import { SafeImage } from '../components/SafeImage';

interface InsightsPageProps {
  slug?: string;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ slug }) => {
  const { lang, articles, navigate } = useApp();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return articles;
    const q = query.trim().toLowerCase();
    return articles.filter((a) =>
      `${a.title.fa} ${a.title.en} ${a.excerpt.fa} ${a.excerpt.en}`.toLowerCase().includes(q)
    );
  }, [articles, query]);

  if (slug) {
    const art = articles.find((a) => a.slug === slug);
    if (!art) {
      return (
        <div className="pt-32 pb-20 text-center space-y-4">
          <h1 className="text-2xl font-bold">{lang === 'fa' ? 'مقاله یافت نشد' : 'Article not found'}</h1>
          <button
            type="button"
            onClick={() => navigate('/insights')}
            className="px-4 py-2 rounded-md bg-[#223981] text-white text-sm cursor-pointer"
          >
            {lang === 'fa' ? 'بازگشت به مقالات' : 'All Articles'}
          </button>
        </div>
      );
    }

    return (
      <article className="pt-24 pb-20 bg-[#FAFBFD]">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <button
            type="button"
            onClick={() => navigate('/insights')}
            className="text-xs font-semibold text-[#223981] hover:underline cursor-pointer"
          >
            {lang === 'fa' ? '→ بازگشت به پژوهش و دانش' : '← Back to Research & Insights'}
          </button>

          <div className="space-y-4">
            <div className="text-xs text-[#525C6E] flex flex-wrap items-center gap-2">
              <span className="text-[#027A3B] font-semibold">{t(art.category, lang)}</span>
              <span>·</span>
              <span className="font-mono-tech">{art.publishedAt}</span>
              <span>·</span>
              <span>{t(art.readTime, lang)}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#141923] leading-tight">
              {t(art.title, lang)}
            </h1>
            <p className="text-sm font-medium text-[#223981]">{t(art.author, lang)}</p>
          </div>

          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#0B1536] border border-black/10">
            <SafeImage
              src={art.image}
              alt={t(art.title, lang)}
              priority
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white border border-black/10 rounded-xl p-6 lg:p-10 space-y-5">
            {art.body.map((para, i) => (
              <p key={i} className="text-base text-[#141923]/90 leading-[1.95]">
                {t(para, lang)}
              </p>
            ))}
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#FAFBFD]">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs text-[#223981] font-semibold">
              {t(uiText.nav.insights, lang)}
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-[#141923]">
              {lang === 'fa' ? 'پژوهش، مقالات فنی و تحلیل‌های مهندسی' : 'Research, Technical Papers & Insights'}
            </h1>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#525C6E] absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === 'fa' ? 'جستجو در مقالات فنی...' : 'Search technical articles...'}
              className="w-full ps-9 pe-3 py-2.5 text-xs bg-white border border-black/15 rounded-md focus:outline-none focus:border-[#223981]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((art) => (
            <article
              key={art.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/insights/${art.slug}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/insights/${art.slug}`);
                }
              }}
              className="bg-white border border-black/10 rounded-xl overflow-hidden cursor-pointer group grid grid-cols-1 sm:grid-cols-12 isb-focus-ring"
            >
              <div className="sm:col-span-5 aspect-[4/3] sm:aspect-auto bg-[#0B1536] overflow-hidden">
                <SafeImage
                  src={art.image}
                  alt={t(art.title, lang)}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="text-xs text-[#525C6E] flex items-center gap-2">
                    <span className="text-[#027A3B] font-semibold">{t(art.category, lang)}</span>
                    <span>·</span>
                    <span>{t(art.readTime, lang)}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#141923] group-hover:text-[#223981] leading-snug">
                    {t(art.title, lang)}
                  </h2>
                  <p className="text-xs text-[#525C6E] line-clamp-3 leading-relaxed">
                    {t(art.excerpt, lang)}
                  </p>
                </div>
                <div className="text-xs font-semibold text-[#223981] pt-2 border-t border-black/5">
                  {t(art.author, lang)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
