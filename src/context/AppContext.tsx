import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  Article,
  Course,
  Department,
  Language,
  Project,
  ServiceItem,
  TeamMember,
  User,
} from '../types/isb';
import {
  INITIAL_ARTICLES,
  INITIAL_COURSES,
  INITIAL_DEPARTMENTS,
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_TEAM,
} from '../data/isbCatalogue';

interface AppContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  route: string;
  navigate: (to: string) => void;
  projects: Project[];
  departments: Department[];
  team: TeamMember[];
  services: ServiceItem[];
  courses: Course[];
  articles: Article[];
  contentLoading: boolean;
  refreshContent: () => Promise<void>;
  user: User | null;
  authLoading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
  cart: string[];
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (courseId: string, openDrawer?: boolean) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  formatPrice: (toman: number) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

const CART_STORAGE_KEY = 'isb_academy_cart_v1';
const LANG_STORAGE_KEY = 'isb_lang_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'fa';
  });

  const [route, setRoute] = useState<string>(() => {
    return window.location.pathname + window.location.search;
  });

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [contentLoading, setContentLoading] = useState<boolean>(true);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    localStorage.setItem(LANG_STORAGE_KEY, next);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'fa' ? 'en' : 'fa');
  }, [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: string) => {
    setCartOpen(false);
    if (to === window.location.pathname + window.location.search) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState({}, '', to);
    setRoute(to);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const refreshContent = useCallback(async () => {
    setContentLoading(true);
    try {
      const res = await fetch('/api/content');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.projects)) setProjects(data.projects);
      if (Array.isArray(data.departments)) setDepartments(data.departments);
      if (Array.isArray(data.team)) setTeam(data.team);
      if (Array.isArray(data.services)) setServices(data.services);
      if (Array.isArray(data.courses)) setCourses(data.courses);
      if (Array.isArray(data.articles)) setArticles(data.articles);
    } catch {
      // Keep initial catalogue fallback if offline
    } finally {
      setContentLoading(false);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();
    refreshAuth();
  }, [refreshContent, refreshAuth]);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  const addToCart = useCallback((courseId: string, openDrawer = true) => {
    setCart((prev) => {
      if (prev.includes(courseId)) return prev;
      const next = [...prev, courseId];
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    if (openDrawer) {
      setCartOpen(true);
    }
  }, []);

  const removeFromCart = useCallback((courseId: string) => {
    setCart((prev) => {
      const next = prev.filter((id) => id !== courseId);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const formatPrice = useCallback(
    (toman: number) => {
      if (toman === 0) return lang === 'fa' ? 'رایگان' : 'Free';
      const formatted = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(toman);
      return lang === 'fa' ? `${formatted} تومان` : `${formatted} Toman`;
    },
    [lang]
  );

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        route,
        navigate,
        projects,
        departments,
        team,
        services,
        courses,
        articles,
        contentLoading,
        refreshContent,
        user,
        authLoading,
        refreshAuth,
        logout,
        cart,
        cartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        clearCart,
        formatPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
