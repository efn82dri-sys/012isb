import {
  Article,
  Course,
  Department,
  Project,
  ServiceItem,
  TeamMember,
} from '../types/isb';

export const COMPANY_INFO = {
  nameFa: 'گروه ساختمانی بنای پایدار ایران‌زمین',
  nameEn: 'Iran Sustainable Building Group (ISB Group)',
  foundedYearSh: '۱۳۹۹',
  foundedYearGregorian: '2020',
  instagram: '@isb.group',
  instagramUrl: 'https://instagram.com/isb.group',
  phones: ['09151213005', '09339039563'],
  address: {
    fa: 'مشهد، بلوار فرهنگ، خیابان شهید قاسمی، شهید قاسمی ۲۶، پلاک ۱۷۰',
    en: 'No. 170, Shahid Ghasemi 26, Shahid Ghasemi St., Farhang Blvd., Mashhad, Iran',
  },
  coordinates: { lat: 36.3228, lng: 59.5326 },
};

export const SERO_SABZ_WEIGHTS = [
  { id: 'water', label: { fa: 'بهره‌وری آب', en: 'Water Efficiency' }, weight: 24 },
  { id: 'energy', label: { fa: 'انرژی', en: 'Energy' }, weight: 23 },
  { id: 'ieq', label: { fa: 'کیفیت محیط داخل', en: 'Indoor Environmental Quality' }, weight: 18 },
  { id: 'materials', label: { fa: 'مصالح و منابع', en: 'Materials & Resources' }, weight: 13 },
  { id: 'waste', label: { fa: 'پسماند', en: 'Waste Management' }, weight: 8 },
  { id: 'management', label: { fa: 'مدیریت', en: 'Management' }, weight: 8 },
  { id: 'site', label: { fa: 'سایت', en: 'Sustainable Site' }, weight: 6 },
  { id: 'outdoor', label: { fa: 'کیفیت محیط خارج', en: 'Outdoor Environmental Quality' }, weight: 6 },
];

export const SERO_SABZ_TIERS = [
  {
    id: 'green',
    title: { fa: 'سرو سبز', en: 'Sero Sabz (Green Cypress)' },
    score: { fa: 'بیش از ۸۰ امتیاز', en: '80+ Points' },
    desc: { fa: 'بالاترین سطح پایداری و بهره‌وری انرژی', en: 'Highest level of sustainability and energy efficiency' },
    color: '#03A54E',
  },
  {
    id: 'gold',
    title: { fa: 'سرو طلایی', en: 'Golden Cypress' },
    score: { fa: '۶۰ تا ۸۰ امتیاز', en: '60 – 80 Points' },
    desc: { fa: 'عملکرد پیشرفته در کیفیت، مصالح و مدیریت', en: 'Advanced performance in quality, materials, and management' },
    color: '#C99E2C',
  },
  {
    id: 'silver',
    title: { fa: 'سرو نقره‌ای', en: 'Silver Cypress' },
    score: { fa: '۵۰ تا ۶۰ امتیاز', en: '50 – 60 Points' },
    desc: { fa: 'رعایت معیارهای پایه با عملکرد مناسب', en: 'Compliance with core benchmarks and sound performance' },
    color: '#7A869A',
  },
  {
    id: 'turquoise',
    title: { fa: 'سرو فیروزه‌ای', en: 'Turquoise Cypress' },
    score: { fa: '۴۰ تا ۵۰ امتیاز', en: '40 – 50 Points' },
    desc: { fa: 'حداقل سطح موردنیاز پایداری ساختمان', en: 'Baseline required level of building sustainability' },
    color: '#1996A8',
  },
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'architecture',
    index: '01',
    title: {
      fa: 'معماری و شهرسازی',
      en: 'Architecture & Urban Planning',
    },
    subtitle: {
      fa: 'طراحی فضایی، هویت اقلیمی و معماری محاسباتی',
      en: 'Spatial Design, Climate Identity & Computational Architecture',
    },
    description: {
      fa: 'دپارتمان معماری و شهرسازی ISB با تکیه بر بیش از دو دهه تجربه حرفه‌ای، طراحی معماری، معماری داخلی، طراحی نما، منظر اکولوژیک و طراحی پارامتریک را با نیازهای اقلیمی و استانداردهای زیست‌پذیری پیوند می‌دهد.',
      en: 'Grounded in over two decades of practice, the Architecture & Urban Planning department unites architectural design, façade tectonics, interior architecture, ecological landscape, and computational design with regional climate intelligence.',
    },
    capabilities: [
      { fa: 'طراحی معماری و معماری پایدار', en: 'Architectural & Sustainable Design' },
      { fa: 'برنامه‌ریزی و طراحی شهری', en: 'Urban Planning & Urban Design' },
      { fa: 'معماری داخلی و طراحی نما', en: 'Interior Architecture & Façade Design' },
      { fa: 'طراحی منظر و اکولوژیک', en: 'Landscape & Ecological Design' },
      { fa: 'طراحی پارامتریک و محاسباتی', en: 'Parametric & Computational Design' },
      { fa: 'تحقیق و توسعه معماری', en: 'Architectural Research & Development' },
    ],
  },
  {
    id: 'energy',
    index: '02',
    title: {
      fa: 'انرژی و سیستم‌های ساختمان',
      en: 'Energy & Building Systems',
    },
    subtitle: {
      fa: 'شبیه‌سازی عملکرد، فیزیک ساختمان و استانداردهای سبز',
      en: 'Performance Simulation, Building Physics & Green Certifications',
    },
    description: {
      fa: 'این دپارتمان با استفاده از ابزارهای شبیه‌سازی دینامیک انرژی و روشنایی (DesignBuilder، THERM، DIALux)، پروژه‌ها را از مرحله طراحی مفهومی تا بهره‌برداری برای انطباق با مبحث ۱۹، سرو سبز و استانداردهای بین‌المللی ارزیابی و بهینه‌سازی می‌کند.',
      en: 'Using dynamic energy, daylight, and hygrothermal simulation (DesignBuilder, THERM, DIALux), this department audits and optimizes building envelopes, MEP systems, and renewable integration for Chapter 19, Sero Sabz, and international standards.',
    },
    capabilities: [
      { fa: 'شبیه‌سازی و بهینه‌سازی انرژی ساختمان', en: 'Building Energy Simulation & Optimization' },
      { fa: 'فیزیک ساختمان، پل‌های حرارتی و آسایش حرارتی', en: 'Building Physics, Thermal Bridges & Comfort' },
      { fa: 'تحلیل نور روز (sDA / ASE) و روشنایی مصنوعی', en: 'Daylight (sDA / ASE) & Artificial Lighting Analysis' },
      { fa: 'طراحی سیستم‌های HVAC و تأسیسات مکانیکی', en: 'HVAC & Mechanical Systems Engineering' },
      { fa: 'سامانه‌های انرژی تجدیدپذیر و مدیریت پایدار آب', en: 'Renewable Energy & Sustainable Water Management' },
      { fa: 'ممیزی انرژی و گواهینامه‌های مبحث ۱۹، سرو سبز، LEED و WELL', en: 'Energy Auditing & Chapter 19, Sero Sabz, LEED, WELL' },
    ],
  },
  {
    id: 'structure',
    index: '03',
    title: {
      fa: 'مهندسی سازه و طراحی لرزه‌ای',
      en: 'Structural Engineering & Earthquake Design',
    },
    subtitle: {
      fa: 'ایمنی لرزه‌ای، بهینه‌سازی سازه و هم‌راستایی مهندسی',
      en: 'Seismic Resilience, Structural Optimization & Multidisciplinary Coordination',
    },
    description: {
      fa: 'دپارتمان مهندسی سازه و طراحی لرزه‌ای بر ارتقای ایمنی، تاب‌آوری لرزه‌ای، بهینه‌سازی سیستم‌های باربر و هماهنگی دقیق میان شبکه سازه، جداره‌های انرژی‌پذیر و تأسیسات مکانیکی تمرکز دارد.',
      en: 'Dedicated to structural safety, seismic resilience, structural efficiency, and precision coordination between load-bearing systems, thermal envelopes, and MEP distribution.',
    },
    capabilities: [
      { fa: 'مهندسی و طراحی سازه ساختمان', en: 'Structural Engineering & Design' },
      { fa: 'تحلیل و طراحی لرزه‌ای', en: 'Seismic Design & Analysis' },
      { fa: 'بهینه‌سازی رفتار و وزن سازه', en: 'Structural Optimization' },
      { fa: 'ارزیابی ایمنی و تاب‌آوری ساختمان', en: 'Building Safety & Resilience' },
      { fa: 'هماهنگی سازه با سیستم‌های معماری و مکانیکی', en: 'Structural Coordination with Architecture & MEP' },
      { fa: 'تحلیل‌های پیشرفته مهندسی', en: 'Advanced Engineering Analysis' },
    ],
    cmsNotice: {
      fa: 'پروفایل اعضای تخصصی و پروژه‌های این دپارتمان به‌صورت مستقیم از طریق پنل مدیریت (CMS) تعریف و به‌روزرسانی می‌شوند و هیچ‌گونه سابقه ساختگی در سامانه درج نشده است.',
      en: 'Detailed team profiles and structural project records for this department are managed exclusively through the Admin CMS. No fabricated credentials or projects are displayed.',
    },
  },
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'sara-atashi',
    name: { fa: 'دکتر سارا آتشی گلستان', en: 'Dr. Sara Atashi Golestan' },
    role: { fa: 'مدیرعامل و رئیس دپارتمان انرژی', en: 'Chief Executive Officer & Head of Energy' },
    department: 'management',
    photo: '/images/team/dr-sara-atashi.webp',
    bio: {
      fa: 'پژوهشگر و مدرس معماری پایدار، مقررات ملی و بهینه‌سازی انرژی ساختمان؛ عضو شورای سیاست‌گذاری توسعه ساختمان سبز و پایدار مرکز تحقیقات راه، مسکن و شهرسازی.',
      en: 'Researcher and lecturer in sustainable architecture, national building regulations, and building energy optimization; Member of the Sustainable & Green Building Policy Council at BHRC.',
    },
  },
  {
    id: 'elham-mehrdoust',
    name: { fa: 'دکتر الهام مهردوست', en: 'Dr. Elham Mehrdoust' },
    role: { fa: 'معمار و پژوهشگر هویت معماری', en: 'Architect & Architectural Researcher' },
    department: 'architecture',
    bio: {
      fa: 'متخصص حوزه پژوهش‌های معماری، هویت و الگوهای معماری ایران.',
      en: 'Specialist in architectural research, Iranian architectural identity, and spatial typology.',
    },
  },
  {
    id: 'hamid-erfanian',
    name: { fa: 'مهندس حمید عرفانیان', en: 'Eng. Hamid Erfanian' },
    role: { fa: 'معمار ارشد', en: 'Senior Architect' },
    department: 'architecture',
    bio: {
      fa: 'معمار ارشد و متخصص طراحی، تکنولوژی ساخت و ساختمان‌های سبز با سابقه حرفه‌ای داخلی و بین‌المللی.',
      en: 'Senior architect specializing in architectural design, construction technology, and green buildings with domestic and international experience.',
    },
  },
  {
    id: 'hamed-moslehi',
    name: { fa: 'مهندس حامد مصلحی', en: 'Eng. Hamed Moslehi' },
    role: { fa: 'متخصص تأسیسات و ممیزی انرژی', en: 'MEP Systems & Energy Audit Specialist' },
    department: 'energy',
    bio: {
      fa: 'متخصص طراحی و بهینه‌سازی سیستم‌های مکانیکی و تأسیساتی ساختمان، ممیزی و طراحی ساختمان.',
      en: 'Specialist in design and optimization of mechanical and building MEP systems, energy auditing, and simulation.',
    },
  },
  {
    id: 'zahra-ramezani',
    name: { fa: 'مهندس زهرا رمضانی', en: 'Eng. Zahra Ramezani' },
    role: { fa: 'کارشناس ارشد علوم ساختمان', en: 'M.Sc. Building Science Specialist' },
    department: 'energy',
    bio: {
      fa: 'متخصص شبیه‌سازی انرژی و نور روز، تحلیل عملکرد پوسته و نما، ارزیابی آسایش بصری و بهینه‌سازی پارامتریک عملکرد محیطی ساختمان.',
      en: 'Specialist in energy & daylight simulation, façade performance analysis, visual comfort assessment, and parametric environmental optimization.',
    },
  },
  {
    id: 'zahra-rasouli',
    name: { fa: 'مهندس زهرا رسولی', en: 'Eng. Zahra Rasouli' },
    role: { fa: 'کارشناس معماری', en: 'Architectural Designer' },
    department: 'architecture',
    bio: {
      fa: 'کارشناس معماری فعال در طراحی و هماهنگی نقشه‌های اجرایی پروژه‌های پایدار.',
      en: 'Architectural specialist contributing to design development and sustainable project documentation.',
    },
  },
  {
    id: 'arefeh-barki',
    name: { fa: 'مهندس عارفه برکی', en: 'Eng. Arefeh Barki' },
    role: { fa: 'روابط عمومی و بازرگانی', en: 'Public Relations & Business Development' },
    department: 'management',
    bio: {
      fa: 'متخصص توسعه ارتباطات سازمانی، مدیریت روابط با کارفرمایان و شرکای تجاری، با تمرکز بر برندینگ، توسعه بازار و تعاملات حرفه‌ای در حوزه ساختمان.',
      en: 'Specialist in organizational communications, client & partner relations, branding, and professional outreach in the AEC sector.',
    },
  },
  {
    id: 'behrouz-kari',
    name: { fa: 'دکتر بهروز کاری', en: 'Dr. Behrouz Kari' },
    role: { fa: 'مشاور علمی انرژی ساختمان', en: 'Scientific Advisor — Building Energy' },
    department: 'advisor',
    isAdvisor: true,
    bio: {
      fa: 'عضو هیئت علمی و رئیس بخش انرژی و نور مرکز تحقیقات راه، مسکن و شهرسازی؛ متخصص بهینه‌سازی مصرف انرژی، عملکرد حرارتی پوسته و پنجره‌های ساختمانی.',
      en: 'Faculty member & Head of Energy and Lighting Department at BHRC; specialist in energy optimization, envelope thermal performance, and fenestration.',
    },
  },
  {
    id: 'somayeh-amininasab',
    name: { fa: 'مهندس سمیه امینی‌نسب', en: 'Eng. Somayeh Amini-Nasab' },
    role: { fa: 'مشاور آکوستیک ساختمان', en: 'Scientific Advisor — Building Acoustics' },
    department: 'advisor',
    isAdvisor: true,
    bio: {
      fa: 'پژوهشگر گروه آکوستیک مرکز تحقیقات راه، مسکن و شهرسازی؛ متخصص ارزیابی صدا، عایق‌بندی صوتی و الزامات آکوستیکی ساختمان.',
      en: 'Researcher in the Acoustics Group at BHRC; specialist in noise assessment, sound insulation, and building acoustic requirements.',
    },
  },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-01',
    slug: 'green-building',
    index: '01',
    department: 'architecture',
    title: { fa: 'ساختمان سبز', en: 'Green Building' },
    shortDescription: {
      fa: 'تحلیل اقلیمی، ارائه راهکارهای طراحی پایدار، کاهش اثرات زیست‌محیطی و ارتقای کیفیت عملکرد ساختمان.',
      en: 'Climatic analysis, sustainable design strategies, environmental impact reduction, and building performance enhancement.',
    },
    detailedDescription: {
      fa: 'ارزیابی جامع پایداری در تمامی چرخه طراحی تا بهره‌برداری با هدف دستیابی به هم‌راستایی اقلیمی، بهینه‌سازی مصرف منابع و کسب رتبه‌های معتبر زیست‌محیطی.',
      en: 'Comprehensive sustainability integration across the design-to-operation lifecycle to align massing, envelope, and resource stewardship with regional climate conditions.',
    },
    deliverables: [
      { fa: 'گزارش تحلیل اقلیمی و زیست‌اقلیمی سایت', en: 'Site bioclimatic analysis report' },
      { fa: 'استراتژی‌های معماری غیرفعال (Passive Design)', en: 'Passive architectural design guidelines' },
      { fa: 'چارچوب کاهش ردپای کربن عملیاتی', en: 'Operational carbon reduction roadmap' },
    ],
    relatedProjectSlugs: ['mehregan-residential', 'kerman-sustainable-school', 'vista-plaza-residential'],
  },
  {
    id: 'srv-02',
    slug: 'building-performance-simulation',
    index: '02',
    department: 'energy',
    title: { fa: 'شبیه‌سازی عملکرد ساختمان', en: 'Building Performance Simulation' },
    shortDescription: {
      fa: 'شبیه‌سازی انرژی، آسایش حرارتی و بصری، تهویه، جریان هوا و سایر شاخص‌های عملکردی ساختمان.',
      en: 'Dynamic simulation of energy, thermal and visual comfort, ventilation, airflow, and core performance KPIs.',
    },
    detailedDescription: {
      fa: 'مدل‌سازی دقیق سه‌بعدی عملکرد حرارتی و سیالاتی ساختمان پیش از اجرا به منظور آزمون کمی گزینه‌های معماری و انتخاب بهینه‌ترین پیکربندی.',
      en: 'Three-dimensional dynamic modeling of building physics prior to construction to quantitatively test design iterations and verify occupant comfort.',
    },
    deliverables: [
      { fa: 'مدل شبیه‌سازی دینامیک در DesignBuilder / EnergyPlus', en: 'Dynamic DesignBuilder / EnergyPlus simulation model' },
      { fa: 'تحلیل آسایش حرارتی و تهویه طبیعی', en: 'Thermal comfort and natural ventilation study' },
      { fa: 'مقایسه سناریوهای طراحی با ساختمان مرجع', en: 'Design scenario benchmarking against reference baseline' },
    ],
    relatedProjectSlugs: ['farapanel-factory', 'behineh-sazan-toos', 'kerman-sustainable-school'],
  },
  {
    id: 'srv-03',
    slug: 'building-energy-analysis',
    index: '03',
    department: 'energy',
    title: { fa: 'تحلیل انرژی ساختمان', en: 'Building Energy Analysis' },
    shortDescription: {
      fa: 'بررسی مصرف انرژی و بارهای حرارتی، مقایسه سناریوهای طراحی و ارائه گزینه بهینه.',
      en: 'Assessment of energy demand and thermal loads, comparative scenario evaluation, and optimal specification.',
    },
    detailedDescription: {
      fa: 'تفکیک دقیق بارهای سرمایش، گرمایش، روشنایی و تجهیزات برای شناسایی گلوگاه‌های اتلاف انرژی و ارائه بسته‌های بهینه‌سازی مقرون‌به‌صرفه.',
      en: 'Granular breakdown of heating, cooling, lighting, and plug loads to isolate thermal losses and define cost-effective optimization packages.',
    },
    deliverables: [
      { fa: 'ترازنامه بارهای حرارتی و برودتی سالانه (kWh/m²·year)', en: 'Annual heating & cooling load balance (kWh/m²·year)' },
      { fa: 'مقایسه کمی سناریوهای بهسازی', en: 'Quantitative retrofit/design scenario matrix' },
    ],
    relatedProjectSlugs: ['crisis-management-mashhad', 'farhang-residential', 'mehregan-residential'],
  },
  {
    id: 'srv-04',
    slug: 'daylight-and-lighting',
    index: '04',
    department: 'energy',
    title: { fa: 'نور روز و روشنایی مصنوعی', en: 'Daylight & Artificial Lighting' },
    shortDescription: {
      fa: 'ارزیابی نور طبیعی، خیرگی و آسایش بصری و طراحی بهینه سیستم‌های روشنایی مصنوعی.',
      en: 'Evaluation of natural daylight (sDA, ASE), glare control, visual comfort, and efficient artificial lighting design.',
    },
    detailedDescription: {
      fa: 'تحلیل سالانه روشنایی طبیعی با شاخص‌های بین‌المللی sDA و ASE و طراحی دقیق نورپردازی داخلی در نرم‌افزار DIALux برای کاهش توان روشنایی.',
      en: 'Annual climate-based daylight modeling (sDA, ASE) paired with DIALux artificial lighting engineering to eliminate glare and reduce LPD.',
    },
    deliverables: [
      { fa: 'نقشه‌های تحلیل sDA و ASE در طبقات', en: 'Floor-by-floor sDA & ASE daylight maps' },
      { fa: 'گزارش محاسبات روشنایی DIALux و چگالی توان روشنایی', en: 'DIALux lighting calculation & LPD report' },
    ],
    relatedProjectSlugs: ['kerman-sustainable-school', 'farapanel-factory', 'arsh-residential-tower'],
  },
  {
    id: 'srv-05',
    slug: 'facade-envelope-optimization',
    index: '05',
    department: 'energy',
    title: { fa: 'بهینه‌سازی نما و پوسته ساختمان', en: 'Façade & Envelope Optimization' },
    shortDescription: {
      fa: 'طراحی و ارزیابی جداره‌های شفاف و کدر، عایق حرارتی، پنجره، سایبان و فناوری‌های نوین نما.',
      en: 'Design and assessment of opaque/glazed assemblies, thermal insulation, Low-E fenestration, shading, and advanced façades.',
    },
    detailedDescription: {
      fa: 'مهندسی دقیق جزئیات اجرایی پوسته ساختمان، محاسبه ضرایب U-Value و R-Value، کنترل SHGC و مدل‌سازی دو‌بعدی پل‌های حرارتی در THERM.',
      en: 'Precision façade engineering covering U-Value / R-Value optimization, solar heat gain control (SHGC), and 2D thermal bridge mitigation in THERM.',
    },
    deliverables: [
      { fa: 'تحلیل پل‌های حرارتی اتصالات بام، بالکن، تیر و ستون', en: 'THERM analysis of roof, balcony, slab-edge & column junctions' },
      { fa: 'مشخصات فنی جداره‌های عایق و شیشه‌های کم‌گسیل', en: 'Insulation & Low-E glazing technical specification' },
    ],
    relatedProjectSlugs: ['yas-residential', 'alaleh-residential', 'farhang-residential'],
  },
  {
    id: 'srv-06',
    slug: 'energy-auditing-optimization',
    index: '06',
    department: 'energy',
    title: { fa: 'ممیزی و بهینه‌سازی ساختمان', en: 'Building Energy Auditing' },
    shortDescription: {
      fa: 'ارزیابی وضع موجود، شناسایی فرصت‌های صرفه‌جویی و ارائه راهکارهای اجرایی کاهش مصرف انرژی.',
      en: 'Existing building assessment, energy conservation opportunity identification, and actionable retrofit roadmaps.',
    },
    detailedDescription: {
      fa: 'کالیبراسیون مدل وضع موجود ساختمان‌های در حال بهره‌برداری و تدوین اولویت‌های اجرایی برای کاهش چشمگیر مصرف سالانه انرژی.',
      en: 'Baseline calibration for existing or in-progress buildings with prioritized engineering interventions for measurable load reduction.',
    },
    deliverables: [
      { fa: 'گزارش ممیزی انرژی وضع موجود', en: 'Baseline energy audit dossier' },
      { fa: 'برنامه گام‌به‌گام کاهش نیاز انرژی', en: 'Step-by-step energy reduction cascade' },
    ],
    relatedProjectSlugs: ['crisis-management-mashhad', 'behineh-sazan-toos'],
  },
  {
    id: 'srv-07',
    slug: 'renewable-energy-systems',
    index: '07',
    department: 'energy',
    title: { fa: 'انرژی‌های تجدیدپذیر', en: 'Renewable Energy Systems' },
    shortDescription: {
      fa: 'امکان‌سنجی فنی و اقتصادی، جانمایی و ارزیابی عملکرد سامانه‌های خورشیدی و سایر منابع تجدیدپذیر.',
      en: 'Technical feasibility, spatial placement, and yield modeling of solar PV, solar thermal, and clean energy systems.',
    },
    detailedDescription: {
      fa: 'برآورد دقیق تولید انرژی الکتریکی فتوولتائیک و آبگرمکن‌های خورشیدی متناسب با سطح بام، سایه‌اندازی و پروفیل مصرف ساختمان.',
      en: 'Accurate yield modeling for rooftop PV arrays and solar domestic hot water systems tailored to roof geometry and load profiles.',
    },
    deliverables: [
      { fa: 'محاسبه تولید سالانه فتوولتائیک و کلکتور خورشیدی', en: 'Annual PV & solar thermal yield calculations' },
      { fa: 'نقشه جانمایی و زاویه بهینه پنل‌ها', en: 'Optimal tilt & roof layout drawings' },
    ],
    relatedProjectSlugs: ['mehregan-residential', 'vista-plaza-residential'],
  },
  {
    id: 'srv-08',
    slug: 'hvac-mechanical-systems',
    index: '08',
    department: 'energy',
    title: { fa: 'سیستم تأسیساتی و تهویه مطبوع', en: 'HVAC & Mechanical Systems' },
    shortDescription: {
      fa: 'طراحی و انتخاب سیستم‌های گرمایش، سرمایش و تهویه متناسب با کاربری، اقلیم و مقیاس پروژه.',
      en: 'Selection and sizing of heating, cooling, heat recovery, and ventilation systems matched to occupancy and climate.',
    },
    detailedDescription: {
      fa: 'طراحی یکپارچه سیستم‌های تهویه مطبوع پربازده شامل بازیافت حرارت (Heat Recovery) و سرمایش آزاد (Free Cooling) در هماهنگی با پوسته معماری.',
      en: 'High-efficiency HVAC engineering integrating heat recovery and free-cooling strategies coordinated with architectural zoning.',
    },
    deliverables: [
      { fa: 'انتخاب سیستم بهینه HVAC و بازیافت حرارت', en: 'Optimal HVAC & heat recovery specification' },
      { fa: 'زون‌بندی حرارتی فضاهای کنترل‌شده و کنترل‌نشده', en: 'Conditioned vs. unconditioned thermal zoning' },
    ],
    relatedProjectSlugs: ['crisis-management-mashhad', 'behineh-sazan-toos'],
  },
  {
    id: 'srv-09',
    slug: 'smart-building-systems',
    index: '09',
    department: 'energy',
    title: { fa: 'هوشمندسازی ساختمان', en: 'Smart Building Systems' },
    shortDescription: {
      fa: 'طراحی و یکپارچه‌سازی سامانه‌های کنترل هوشمند برای مدیریت انرژی، روشنایی و تجهیزات ساختمان.',
      en: 'Design and integration of BMS/intelligent control systems for automated energy, daylight-linked lighting, and equipment management.',
    },
    detailedDescription: {
      fa: 'تعریف منطق کنترل هوشمند روشنایی بر اساس نور روز، حسگرهای حضور و مدیریت یکپارچه تجهیزات برای حذف تلفات بهره‌برداری.',
      en: 'Control logic specification for daylight-linked dimming, occupancy scheduling, and BMS energy supervision.',
    },
    deliverables: [
      { fa: 'سناریوهای کنترل هوشمند روشنایی و تهویه', en: 'Smart lighting & ventilation control sequences' },
    ],
    relatedProjectSlugs: ['behineh-sazan-toos', 'crisis-management-mashhad'],
  },
  {
    id: 'srv-10',
    slug: 'thermal-comfort-ieq',
    index: '10',
    department: 'energy',
    title: { fa: 'آسایش حرارتی و کیفیت محیط داخلی', en: 'Thermal Comfort & IEQ' },
    shortDescription: {
      fa: 'تحلیل دما، رطوبت، کیفیت هوا، تهویه و شرایط آسایش کاربران در فضاهای داخلی.',
      en: 'Evaluation of indoor temperature, humidity, IAQ, ventilation rates, and occupant comfort indices.',
    },
    detailedDescription: {
      fa: 'ارزیابی شاخص‌های آسایش حرارتی، کیفیت دید و شرایط آکوستیکی جهت تضمین سلامت و بهره‌وری ساکنان در فضاهای مسکونی، آموزشی و اداری.',
      en: 'Assessment of indoor thermal comfort, view quality, and acoustic standards for residential, educational, and civic buildings.',
    },
    deliverables: [
      { fa: 'گزارش شاخص‌های آسایش حرارتی و تهویه متقاطع', en: 'Thermal comfort & cross-ventilation report' },
    ],
    relatedProjectSlugs: ['kerman-sustainable-school', 'banafsheh-park'],
  },
  {
    id: 'srv-11',
    slug: 'sustainable-water-management',
    index: '11',
    department: 'energy',
    title: { fa: 'مدیریت پایدار آب', en: 'Sustainable Water Management' },
    shortDescription: {
      fa: 'کاهش مصرف آب، تصفیه و استفاده مجدد از آب خاکستری و جمع‌آوری آب باران.',
      en: 'Water demand reduction, greywater treatment & reuse, and rainwater harvesting systems.',
    },
    detailedDescription: {
      fa: 'طراحی سیستم‌های بازچرخانی آب خاکستری برای آبیاری فضای سبز و فلاش‌تانک‌ها، به همراه شیرآلات کم‌مصرف منطبق با بیشترین وزن امتیازی استاندارد سرو سبز (۲۴٪).',
      en: 'Design of greywater recycling loops and low-flow fixtures aligned with the highest-weighted category (24%) in Iran’s Sero Sabz standard.',
    },
    deliverables: [
      { fa: 'مدل تصفیه و بازچرخانی آب خاکستری', en: 'Greywater recycling schematic & water balance' },
    ],
    relatedProjectSlugs: ['mehregan-residential', 'vista-plaza-residential', 'banafsheh-park'],
  },
  {
    id: 'srv-12',
    slug: 'certifications-and-codes',
    index: '12',
    department: 'energy',
    title: { fa: 'گواهینامه‌ها و ضوابط ملی و بین‌المللی', en: 'National Codes & Green Certifications' },
    shortDescription: {
      fa: 'تهیه مستندات و ارزیابی انطباق با مبحث ۱۹ و استانداردهای سرو سبز، LEED، WELL، BREEAM و EDGE.',
      en: 'Compliance documentation and rating assessment for National Chapter 19, Sero Sabz, LEED, WELL, BREEAM, and EDGE.',
    },
    detailedDescription: {
      fa: 'تدوین کامل دفترچه فنی انطباق با مبحث ۱۹ مقررات ملی ساختمان برای تعیین رده انرژی (EC تا ECZn) و ممیزی مستندات سیستم رتبه‌بندی بومی سرو سبز.',
      en: 'Preparation of official Chapter 19 energy compliance dossiers (EC to ECZn) and Sero Sabz green building certification submissions.',
    },
    deliverables: [
      { fa: 'دفترچه محاسبات و مستندات مبحث ۱۹ (تعیین رده EC)', en: 'Chapter 19 energy compliance dossier (EC–ECZn)' },
      { fa: 'پرونده ارزیابی و دریافت گواهینامه سرو سبز', en: 'Sero Sabz certification dossier' },
    ],
    relatedProjectSlugs: ['mehregan-residential', 'farhang-residential', 'yas-residential'],
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    slug: 'mehregan-residential',
    indexNumber: '01',
    title: {
      fa: 'مجتمع مسکونی مهرگان',
      en: 'Mehregan Residential Complex',
    },
    location: {
      fa: 'بلوار دندانپزشکان، مشهد، ایران',
      en: 'Dandanpezeshkan Blvd., Mashhad, Iran',
    },
    year: '۱۴۰۳',
    architect: {
      fa: 'دفتر معماری نوتاش نقش',
      en: 'Notash Naghsh Architectural Office',
    },
    category: 'residential',
    departments: ['energy', 'architecture'],
    services: ['srv-02', 'srv-05', 'srv-07', 'srv-11', 'srv-12'],
    energyGrade: 'EC++',
    seroSabzTier: { fa: 'سرو طلایی (خرداد ۱۴۰۴)', en: 'Golden Cypress (June 2025)' },
    heroImage: '/images/projects/mehregan-hero.webp',
    galleryImages: [
      {
        src: '/images/projects/mehregan-hero.webp',
        caption: { fa: 'نمای اصلی مجتمع مسکونی مهرگان', en: 'Primary façade of Mehregan Residential Complex' },
      },
      {
        src: '/images/projects/mehregan-cert.webp',
        caption: { fa: 'گواهینامه رسمی سرو طلایی از مرکز تحقیقات راه، مسکن و شهرسازی (خرداد ۱۴۰۴)', en: 'Official Golden Cypress (Sero Talaei) Certificate from BHRC (Khordad 1404)' },
      },
      {
        src: '/images/diagrams/mehregan-cutaway.webp',
        caption: { fa: 'مقطع سه‌بعدی عملکرد پوسته و مقادیر R-Value و U-Value', en: '3D envelope performance section showing verified R-Values and U-Values' },
      },
    ],
    summary: {
      fa: 'دستیابی به رده انرژی EC++ و دریافت گواهینامه رسمی «سرو طلایی» سیستم رتبه‌بندی ساختمان سبز ایران در بخش طراحی.',
      en: 'Achieved EC++ energy grade and official "Golden Cypress" (Sero Talaei) certification under Iran’s Green Building Rating System in the design stage.',
    },
    narrative: {
      fa: 'در پروژه مجتمع مسکونی مهرگان، گروه ISB با همکاری دفتر معماری نوتاش نقش، ارزیابی جامع انرژی و پایداری را بر پایه الزامات مبحث ۱۹ و استاندارد ملی سرو سبز به انجام رساند. با بهینه‌سازی هم‌زمان مقاومت حرارتی پوسته، پنجره‌های کم‌گسیل (U=1.8 W/m²·K)، کنترل تابش، هوابندی و حذف پل‌های حرارتی، نیاز انرژی در سناریوی بهینه از ۴۸.۶۷ به ۱۳.۴۶ کیلووات‌ساعت بر مترمربع در سال در مدل‌سازی مقایسه‌ای کاهش یافت و با بهره‌گیری از آبگرمکن خورشیدی و پنل فتوولتائیک، گواهی سرو طلایی در خرداد ۱۴۰۴ صادر گردید.',
      en: 'In partnership with Notash Naghsh Architectural Office, ISB executed full energy modeling and Sero Sabz compliance documentation for Mehregan Residential Complex. Through envelope insulation upgrades, low-emissivity glazing (U=1.8 W/m²·K), solar shading, airtightness, thermal-bridge mitigation, and rooftop solar thermal + PV integration, the building achieved EC++ energy performance and received the Golden Cypress design certificate in Khordad 1404.',
    },
    scopeOfWork: [
      { fa: 'شبیه‌سازی انرژی و ارزیابی رده EC++', en: 'Energy simulation and EC++ grade assessment' },
      { fa: 'بهینه‌سازی پوسته، شیشه‌ها و سایبان‌ها', en: 'Envelope, glazing, and shading optimization' },
      { fa: 'ارزیابی الزامات سرو سبز و تدوین مستندات', en: 'Sero Sabz compliance assessment & documentation' },
      { fa: 'طراحی بام سبز، انرژی خورشیدی و مدیریت پایدار آب', en: 'Green roof, solar energy, and sustainable water design' },
    ],
    designStrategies: [
      { fa: 'بهینه‌سازی پوسته: ارتقای مقاومت حرارتی بام (R=3.677) و دیوار خارجی (R=1.802 m²·K/W)', en: 'Envelope upgrade: Roof R=3.677 and external wall R=1.802 m²·K/W' },
      { fa: 'پنجره کم‌گسیل با U=1.8 W/m²·K و کنترل SHGC', en: 'Low-E glazing (U=1.8 W/m²·K) with SHGC solar control' },
      { fa: 'کنترل تابش با سایبان و لوور، هوابندی پوسته و کنترل پل‌های حرارتی', en: 'Solar shading louvres, airtightness, and thermal bridge detailing' },
      { fa: 'روشنایی کم‌مصرف LED، سیستم انرژی خورشیدی و بازیافت پایدار آب', en: 'Low-LPD LED lighting, solar thermal/PV, and sustainable water reuse' },
    ],
    metrics: [
      { label: { fa: 'کاهش نیاز گرمایش نسبت به مرجع', en: 'Heating Demand Reduction vs. Baseline' }, value: '40%', unit: 'max' },
      { label: { fa: 'کاهش نیاز سرمایش نسبت به مرجع', en: 'Cooling Demand Reduction vs. Baseline' }, value: '20%', unit: 'max' },
      { label: { fa: 'تولید آبگرمکن خورشیدی', en: 'Solar Water Heater Yield' }, value: '13,965', unit: 'kWh/yr', note: { fa: 'پوشش ۲۹.۷۶٪ (6.28 kWh/m²)', en: '29.76% coverage (6.28 kWh/m²)' } },
      { label: { fa: 'تولید سلول فتوولتائیک', en: 'Photovoltaic Generation' }, value: '11,076', unit: 'kWh/yr', note: { fa: 'پوشش ~۴.۷ تا ۵.۲٪ (4.98 kWh/m²)', en: '~4.7–5.2% coverage (4.98 kWh/m²)' } },
      { label: { fa: 'مقاومت حرارتی بام', en: 'Roof Thermal Resistance' }, value: '3.677', unit: 'm²·K/W' },
      { label: { fa: 'ضریب انتقال حرارت پنجره', en: 'Window U-Value' }, value: '1.8', unit: 'W/m²·K' },
    ],
    featured: true,
  },
  {
    id: 'proj-02',
    slug: 'behineh-sazan-toos',
    indexNumber: '02',
    title: {
      fa: 'کارخانه سنجش انرژی بهینه‌سازان توس',
      en: 'Behineh Sazan Toos Energy Testing Factory',
    },
    location: {
      fa: 'شهرک صنعتی، مشهد، ایران',
      en: 'Industrial Park, Mashhad, Iran',
    },
    year: '۱۴۰۴',
    architect: {
      fa: 'دکتر الهام مهردوست',
      en: 'Dr. Elham Mehrdoust',
    },
    category: 'industrial',
    departments: ['energy', 'architecture'],
    services: ['srv-02', 'srv-04', 'srv-05', 'srv-08', 'srv-12'],
    energyGrade: 'EC+',
    heroImage: '/images/projects/behineh-toos-hero.webp',
    galleryImages: [
      {
        src: '/images/projects/behineh-toos-hero.webp',
        caption: { fa: 'نمای بیرونی کارخانه سنجش انرژی بهینه‌سازان توس', en: 'Exterior architectural view of Behineh Sazan Toos' },
      },
      {
        src: '/images/diagrams/behineh-toos-bim.webp',
        caption: { fa: 'مقطع سه‌بعدی لایه‌های عایق‌کاری بام، دیوار پشم سنگ و پنجره کم‌گسیل', en: '3D technical cutaway of XPS roof, rockwool wall, and Low-E glazing' },
      },
      {
        src: '/images/diagrams/behineh-toos-sda.webp',
        caption: { fa: 'نقشه تحلیل نور طبیعی — sDA 62%', en: 'Daylight autonomy simulation — sDA 62%' },
      },
    ],
    summary: {
      fa: 'تحلیل عملکرد حرارتی پوسته، نفوذ هوا، روشنایی طبیعی (sDA 62%) و ارزیابی انطباق با مبحث ۱۹ برای یک مجموعه صنعتی-آزمایشگاهی در شهرک صنعتی مشهد.',
      en: 'Envelope physics, airtightness, daylight modeling (sDA 62%), and Chapter 19 EC+ certification for an industrial energy-testing facility in Mashhad.',
    },
    narrative: {
      fa: 'در پروژه کارخانه سنجش انرژی بهینه‌سازان توس، تیم معماری و انرژی ISB مشخصات حرارتی تک‌تک اجزای پوسته شامل عایق پلی‌استایرن اکسترودشده در بام و کف، عایق پشم سنگ در دیوار خارجی و شیشه‌های کم‌گسیل (SHGC=0.40, TV=0.60) را تحلیل و بهینه‌سازی کرد تا ضمن دستیابی به رده EC+، روشنایی طبیعی مطلوب (sDA 62%) برای فضاهای آزمایشگاهی و اداری فراهم شود.',
      en: 'For Behineh Sazan Toos, ISB engineered the thermal envelope—combining extruded polystyrene roof/slab insulation, rockwool external wall insulation, and Low-E glazing (SHGC=0.40, TV=0.60)—achieving EC+ energy compliance alongside 62% Spatial Daylight Autonomy across laboratory and office zones.',
    },
    scopeOfWork: [
      { fa: 'شبیه‌سازی انرژی و مقایسه ساختمان طرح با ساختمان مرجع', en: 'Energy simulation and comparison against reference baseline' },
      { fa: 'ارزیابی رده انرژی پروژه بر اساس الزامات مبحث ۱۹', en: 'Energy rating verification under Chapter 19' },
      { fa: 'تحلیل عملکرد حرارتی پوسته، پنجره‌ها و نفوذ هوا', en: 'Thermal envelope, fenestration, and infiltration analysis' },
      { fa: 'ارزیابی نور روز با شاخص‌های sDA و ASE', en: 'Daylight evaluation using sDA and ASE metrics' },
      { fa: 'ارائه راهکارهای بهینه‌سازی انرژی، تابش و آسایش حرارتی', en: 'Energy, solar, and thermal comfort optimization' },
    ],
    designStrategies: [
      { fa: 'بام بازتابنده با عایق پلی‌استایرن اکسترودشده (R=2.2, U=0.46)', en: 'Reflective roof with XPS insulation (R=2.2 m²·K/W, U=0.46 W/m²·K)' },
      { fa: 'نمای ترکیبی با عایق حرارتی پشم سنگ (R=1.6, U=0.62)', en: 'Composite façade with rockwool insulation (R=1.6, U=0.62)' },
      { fa: 'پنجره کم‌گسیل با SHGC=0.40 و عبور نور مرئی TV=0.60', en: 'Low-E glazing with SHGC=0.40 and visible transmittance TV=0.60' },
      { fa: 'تهویه طبیعی، کنترل کیفیت هوا و روشنایی هوشمند', en: 'Natural ventilation, IAQ control, and smart lighting' },
    ],
    metrics: [
      { label: { fa: 'خودکفایی فضایی نور روز (sDA)', en: 'Spatial Daylight Autonomy (sDA)' }, value: '62%', unit: 'sDA' },
      { label: { fa: 'ضریب حرارتی بام (U-Value)', en: 'Roof U-Value' }, value: '0.46', unit: 'W/m²·K', note: { fa: 'R = 2.2 m²·K/W', en: 'R = 2.2 m²·K/W' } },
      { label: { fa: 'ضریب حرارتی دیوار خارجی', en: 'External Wall U-Value' }, value: '0.62', unit: 'W/m²·K', note: { fa: 'R = 1.6 m²·K/W', en: 'R = 1.6 m²·K/W' } },
      { label: { fa: 'ضریب حرارتی کف مجاور خاک', en: 'Ground Slab U-Value' }, value: '0.70', unit: 'W/m²·K', note: { fa: 'R = 1.43 m²·K/W', en: 'R = 1.43 m²·K/W' } },
    ],
    featured: true,
  },
  {
    id: 'proj-03',
    slug: 'farapanel-factory',
    indexNumber: '03',
    title: {
      fa: 'کارخانه تولیدی فراپانل',
      en: 'Farapanel Manufacturing Factory',
    },
    location: {
      fa: 'شهرک صنعتی رضوی، مشهد، ایران',
      en: 'Razavi Industrial Park, Mashhad, Iran',
    },
    year: '۱۴۰۳',
    architect: {
      fa: 'مهسا صداقت و همکاران',
      en: 'Mahsa Sedaghat & Associates',
    },
    category: 'industrial',
    departments: ['energy'],
    services: ['srv-02', 'srv-03', 'srv-04', 'srv-05', 'srv-12'],
    energyGrade: 'EC+',
    heroImage: '/images/projects/farapanel-hero.webp',
    galleryImages: [
      {
        src: '/images/projects/farapanel-hero.webp',
        caption: { fa: 'نمای هوایی کارخانه تولیدی فراپانل در شهرک صنعتی رضوی', en: 'Aerial perspective of Farapanel Manufacturing Factory' },
      },
      {
        src: '/images/projects/farapanel-atrium.webp',
        caption: { fa: 'آتریوم مرکزی و حیاط داخلی سبز برای نورگیری و تهویه طبیعی', en: 'Central green atrium for uniform daylighting and natural ventilation' },
      },
      {
        src: '/images/diagrams/farapanel-daylight.webp',
        caption: { fa: 'نتایج شبیه‌سازی نور روز: sDA 77% و ASE 15%', en: 'Daylight simulation results: sDA 77% and ASE 15%' },
      },
    ],
    summary: {
      fa: 'ایجاد تعادل میان نور طبیعی (sDA 77%)، آتریوم مرکزی، نورگیرهای سقفی کنترل‌شده و کاهش ۲۲ درصدی بار کل انرژی با دیوارهای فراپانل.',
      en: 'Balancing uniform daylight (sDA 77%), a central atrium, and controlled roof skylights to achieve a 22% reduction in total annual energy load.',
    },
    narrative: {
      fa: 'در کارخانه تولیدی فراپانل، مدل‌سازی انرژی با DesignBuilder و تحلیل‌های نور روز برای ارزیابی عملکرد دیوارهای فراپانل، عایق سقف، نورگیرهای سقفی و سایبان‌های عمودی نمای غربی انجام شد. نتایج کمی نشان داد که استفاده از دیوارهای فراپانل همراه با ۲ سانتی‌متر عایق سقف و ۲ سانتی‌متر ملات عایق، بار کل سالانه را از ۳۰۲,۳۳۳ به ۲۳۷,۲۲۲ کیلووات‌ساعت (۲۲٪ کاهش) می‌رساند و هم‌زمان شاخص sDA به ۷۷٪ دست می‌یابد.',
      en: 'Using DesignBuilder, ISB evaluated wall assemblies, roof insulation, controlled skylights, and west-façade vertical shading fins for Farapanel Factory. The optimized assembly reduced total annual load from 302,333 kWh to 237,222 kWh (-22% total, -29% heating, -26% cooling relative to EC baseline) while achieving 77% sDA and 15% ASE.',
    },
    scopeOfWork: [
      { fa: 'تحلیل و شبیه‌سازی مصرف انرژی با DesignBuilder', en: 'Energy simulation and analysis with DesignBuilder' },
      { fa: 'ارزیابی نور روز و شاخص‌های sDA و ASE', en: 'Daylight assessment (sDA & ASE)' },
      { fa: 'بررسی عملکرد آتریوم، نورگیرهای سقفی و سایبان‌ها', en: 'Atrium, skylight, and shading performance study' },
      { fa: 'بهینه‌سازی حرارتی پوسته و مقایسه سناریوهای طراحی', en: 'Thermal envelope optimization & scenario comparison' },
    ],
    designStrategies: [
      { fa: 'کنترل نور غرب با سایبان‌های عمودی برای کاهش خیرگی و تابش مستقیم', en: 'West-façade vertical louvres to minimize direct glare and solar gain' },
      { fa: 'سقف‌های نورگیر کنترل‌شده با نسبت بهینه به زیربنا', en: 'Controlled skylight-to-floor ratios for uniform daylighting' },
      { fa: 'آتریوم مرکزی سبز برای تهویه و نور طبیعی یکنواخت', en: 'Central green courtyard atrium for natural ventilation' },
      { fa: 'عایق‌کاری پوسته و مصالح با ضریب بازتابش بالا', en: 'High-albedo reflective finishes and insulated envelope' },
    ],
    metrics: [
      { label: { fa: 'کاهش بار کل انرژی (نسبت به EC)', en: 'Total Energy Load Reduction (vs. EC)' }, value: '-22%', unit: 'kWh' },
      { label: { fa: 'کاهش بار گرمایش', en: 'Heating Load Reduction' }, value: '-29%', unit: 'kWh' },
      { label: { fa: 'کاهش بار سرمایش', en: 'Cooling Load Reduction' }, value: '-26%', unit: 'kWh' },
      { label: { fa: 'شاخص نور روز (sDA)', en: 'Spatial Daylight Autonomy (sDA)' }, value: '77%', unit: 'sDA' },
      { label: { fa: 'تابش مستقیم سالانه (ASE)', en: 'Annual Sunlight Exposure (ASE)' }, value: '15%', unit: 'ASE' },
    ],
    featured: true,
  },
  {
    id: 'proj-04',
    slug: 'crisis-management-mashhad',
    indexNumber: '04',
    title: {
      fa: 'ساختمان مدیریت بحران استانداری مشهد',
      en: 'Mashhad Governorate Crisis Management Building',
    },
    location: {
      fa: 'بلوار آبادگران، مشهد، ایران',
      en: 'Abadgaran Blvd., Mashhad, Iran',
    },
    year: '۱۴۰۵',
    architect: {
      fa: 'گروه مشاور سروستان',
      en: 'Sarvestan Consulting Group',
    },
    category: 'institutional',
    departments: ['energy'],
    services: ['srv-03', 'srv-05', 'srv-06', 'srv-08', 'srv-09'],
    energyGrade: 'EC+',
    heroImage: '/images/projects/crisis-mgmt-hero.webp',
    galleryImages: [
      {
        src: '/images/projects/crisis-mgmt-hero.webp',
        caption: { fa: 'نمای هوایی ساختمان مدیریت بحران استانداری مشهد', en: 'Aerial view of Mashhad Crisis Management Building' },
      },
      {
        src: '/images/diagrams/crisis-mgmt-cutaway.webp',
        caption: { fa: 'مقطع دیاگرامی ۶ مرحله کاهش نیاز انرژی تا ۴۶.۵۲٪', en: 'Cutaway diagram illustrating the 6-step 46.52% energy reduction cascade' },
      },
    ],
    summary: {
      fa: 'ممیزی و بهینه‌سازی گام‌به‌گام پوسته، پل‌های حرارتی، کنترل روشنایی، بازیافت حرارت و سرمایش آزاد با کاهش ۴۶.۵۲ درصدی نیاز انرژی گرمایش و سرمایش.',
      en: 'Step-by-step thermal bridge correction, envelope insulation, heat recovery, and free-cooling achieving a 46.52% annual heating & cooling energy reduction.',
    },
    narrative: {
      fa: 'برای ساختمان مدیریت بحران استانداری مشهد، گروه ISB روند کاهش نیاز انرژی گرمایش و سرمایش را در ۶ گام اجرایی مدلسازی کرد: از وضع موجود (۳۹۷.۵۳ مگاوات‌ساعت در سال)، اصلاح موضعی پوسته (۳۸۸.۰۱)، تقویت پوسته (۳۸۲.۶۳)، پوشش بازتابنده بام (۳۷۴.۲۵)، کنترل روشنایی (۳۷۱.۷۸)، بازیافت حرارت (۳۶۰.۳۷) تا بهره‌گیری از سرمایش آزاد که نیاز سالانه را به ۲۱۲.۶۱ مگاوات‌ساعت در سال (کاهش ۴۶.۵۲٪) رساند.',
      en: 'For the Mashhad Governorate Crisis Management Building, ISB modeled a calibrated baseline of 397.53 MWh/year and quantified every sequential intervention—local envelope repair (388.01), continuous wall insulation (382.63), reflective roof coating (374.25), daylight-linked lighting control (371.78), heat recovery (360.37), and free cooling (212.61 MWh/year)—delivering a verified 46.52% reduction.',
    },
    scopeOfWork: [
      { fa: 'بررسی عملکرد حرارتی پوسته و سیستم‌های اصلی ساختمان', en: 'Thermal envelope & primary HVAC systems assessment' },
      { fa: 'تهیه مدل پایه و تحلیل مصرف انرژی', en: 'Baseline energy model & consumption breakdown' },
      { fa: 'شناسایی فرصت‌های کاهش مصرف انرژی', en: 'Energy conservation measures identification' },
      { fa: 'تعیین میزان صرفه‌جویی هر راهکار', en: 'Quantified savings per intervention step' },
    ],
    designStrategies: [
      { fa: 'اصلاح پل‌های حرارتی و عایق پیوسته دیوارها', en: 'Thermal bridge correction & continuous wall insulation' },
      { fa: 'پوشش بازتابنده بام برای کاهش جذب تابشی', en: 'High-reflectance cool roof coating' },
      { fa: 'کنترل هوشمند روشنایی با نور روز', en: 'Daylight-responsive lighting control' },
      { fa: 'سامانه بازیافت حرارت و سرمایش آزاد (Free Cooling)', en: 'Heat recovery ventilation & free-cooling mode' },
    ],
    metrics: [
      { label: { fa: 'کاهش کل نسبت به وضع موجود', en: 'Total Reduction vs. Baseline' }, value: '46.52%', unit: 'MWh/yr' },
      { label: { fa: 'نیاز انرژی وضع موجود', en: 'Baseline Annual Demand' }, value: '397.53', unit: 'MWh/yr' },
      { label: { fa: 'نیاز انرژی پس از سرمایش آزاد', en: 'Optimized Annual Demand' }, value: '212.61', unit: 'MWh/yr' },
    ],
    featured: true,
  },
  {
    id: 'proj-05',
    slug: 'kerman-sustainable-school',
    indexNumber: '05',
    title: {
      fa: 'مدرسه با رویکرد انرژی و پایداری (مسابقه ساختمان آینده)',
      en: 'Sustainable School — Future Building Competition',
    },
    location: {
      fa: 'اقلیم گرم و خشک فلات مرکزی، کرمان، ایران',
      en: 'Hot-Arid Central Plateau, Kerman, Iran',
    },
    year: '۱۴۰۳',
    architect: {
      fa: 'زهرا رمضانی و همکاران',
      en: 'Zahra Ramezani & Associates',
    },
    category: 'educational',
    departments: ['architecture', 'energy'],
    services: ['srv-01', 'srv-02', 'srv-04', 'srv-10'],
    energyGrade: 'EC++',
    heroImage: '/images/projects/kerman-school-hero.webp',
    galleryImages: [
      {
        src: '/images/projects/kerman-school-hero.webp',
        caption: { fa: 'پرسپکتیو هوایی مجموعه آموزشی پایدار در اقلیم گرم و خشک کرمان', en: 'Aerial view of the sustainable school campus in Kerman' },
      },
      {
        src: '/images/projects/kerman-school-interior.webp',
        caption: { fa: 'فضاهای یادگیری و کلاس‌های درس با نور روز یکنواخت و دید ۹۸.۵۳٪', en: 'Classrooms & learning commons with balanced daylight and 98.53% view quality' },
      },
    ],
    summary: {
      fa: 'طراحی یکپارچه معماری و انرژی در اقلیم گرم و خشک کرمان با ۲۰.۷۲٪ کاهش مصرف انرژی نسبت به مقدار هدف، sDA 93.08% و کیفیت دید ۹۸.۵۳٪.',
      en: 'Integrated architectural and energy design for Kerman’s hot-arid climate: 20.72% below target site energy, 93.08% sDA, and 98.53% view quality.',
    },
    narrative: {
      fa: 'در این پروژه که برای مسابقه ساختمان آینده طراحی شد، حیاط میانی و بام سبز با تهویه متقاطع کلاس‌ها و دودکش حرارتی آتریوم ترکیب گردید تا با تکیه بر راهکارهای اقلیمی، انرژی سایت به ۶۳.۸۲ کیلووات‌ساعت بر مترمربع در سال (۲۰.۷۲٪ کمتر از هدف ۸۰.۵۰) برسد و هم‌زمان آسایش بصری (sDA 93.08%, ASE 9.49%) و تحلیل روشنایی DIALux در تمامی سطوح کار کلاس‌ها تأمین شود.',
      en: 'Designed for the Future Building Competition, this Kerman school pairs shaded courtyards and green roofs with cross-ventilated classrooms and an atrium stack-effect chimney. Site energy reaches 63.82 kWh/m²·year (20.72% below the 80.50 target), while daylighting hits 93.08% sDA, 9.49% ASE, and 98.53% view quality.',
    },
    scopeOfWork: [
      { fa: 'طراحی یکپارچه معماری و انرژی', en: 'Integrated architectural & energy design' },
      { fa: 'شبیه‌سازی مصرف انرژی و آسایش حرارتی', en: 'Energy & thermal comfort simulation' },
      { fa: 'ارزیابی نور روز (sDA / ASE) و کیفیت دید', en: 'Daylight (sDA / ASE) & view quality analysis' },
      { fa: 'تحلیل روشنایی مصنوعی با DIALux و جریان هوای طبیعی', en: 'DIALux lighting & natural airflow simulation' },
    ],
    designStrategies: [
      { fa: 'حیاط میانی و بام سبز برای تعدیل خرداقلیم و کاهش دمای محیط', en: 'Central courtyards and green roofs for microclimate cooling' },
      { fa: 'تهویه متقاطع کلاس‌ها و تهویه دودکشی آتریوم', en: 'Cross-ventilation in classrooms & atrium stack-effect' },
      { fa: 'سایه‌اندازی هدفمند و کنترل تابش نمای غربی', en: 'Targeted shading for west solar control' },
    ],
    metrics: [
      { label: { fa: 'انرژی سایت (طرح در برابر هدف ۸۰.۵۰)', en: 'Site Energy (Design vs. 80.50 Target)' }, value: '63.82', unit: 'kWh/m²·yr', note: { fa: '۲۰.۷۲٪ کمتر از مقدار هدف', en: '20.72% below target' } },
      { label: { fa: 'انرژی منبع (در برابر ۱۶۱.۱۱)', en: 'Source Energy (vs. 161.11 Target)' }, value: '150.57', unit: 'kWh/m²·yr' },
      { label: { fa: 'شاخص نور روز (sDA)', en: 'Spatial Daylight Autonomy (sDA)' }, value: '93.08%', unit: 'sDA' },
      { label: { fa: 'تابش مستقیم (ASE)', en: 'Annual Sunlight Exposure (ASE)' }, value: '9.49%', unit: 'ASE' },
      { label: { fa: 'کیفیت دید به بیرون', en: 'View Quality' }, value: '98.53%', unit: 'Quality' },
    ],
    featured: true,
  },
  {
    id: 'proj-06',
    slug: 'farhang-residential',
    indexNumber: '06',
    title: {
      fa: 'ساختمان مسکونی فرهنگ',
      en: 'Farhang Residential Building',
    },
    location: {
      fa: 'بلوار فرهنگ، مشهد، ایران',
      en: 'Farhang Blvd., Mashhad, Iran',
    },
    year: '۱۴۰۵',
    architect: {
      fa: 'گروه معماری چارسو',
      en: 'Charsoo Architectural Group',
    },
    category: 'residential',
    departments: ['energy'],
    services: ['srv-02', 'srv-04', 'srv-05', 'srv-12'],
    energyGrade: 'EC+',
    heroImage: '/images/projects/farhang-hero.webp',
    galleryImages: [
      {
        src: '/images/projects/farhang-hero.webp',
        caption: { fa: 'نمای ساختمان مسکونی فرهنگ در بلوار فرهنگ مشهد', en: 'Street elevation of Farhang Residential Building' },
      },
      {
        src: '/images/diagrams/farhang-wall.webp',
        caption: { fa: 'جزئیات لایه‌بندی دیوار با ملات حرارتی و مقایسه سناریوها', en: 'Wall assembly detail with thermal insulating mortar' },
      },
    ],
    summary: {
      fa: 'مقایسه کمی سناریوهای بهینه‌سازی پوسته با ملات حرارتی ۲ و ۳ سانتی‌متری و دستیابی به کاهش ۱۸.۲ درصدی بار کل سالانه در رده EC+.',
      en: 'Comparative envelope study evaluating 2cm and 3cm thermal insulating mortars, cutting total annual load by up to 18.2% to achieve EC+.',
    },
    narrative: {
      fa: 'در ساختمان مسکونی فرهنگ، زون‌بندی فضاهای کنترل‌شده و کنترل‌نشده و سه سناریوی دیوار خارجی (بدون ملات حرارتی، ملات ۲ سانتی‌متری و ملات ۳ سانتی‌متری) در کنار پنجره‌های ترمال‌بریک و عایق بام بررسی شد. ملات عایق ۲ سانتی‌متری موجب کاهش ۱۵.۸٪ بار کل و ملات ۳ سانتی‌متری موجب کاهش ۱۸.۲٪ بار کل سالانه گردید.',
      en: 'For Farhang Residential Building, ISB modeled conditioned/unconditioned zoning and tested three wall assemblies alongside thermal-break windows and roof insulation. Applying 2 cm thermal mortar reduced total annual load by 15.8% (70,615 to 59,433), while 3 cm thermal mortar achieved an 18.2% reduction (to 57,750).',
    },
    scopeOfWork: [
      { fa: 'شبیه‌سازی انرژی ساختمان و زون‌بندی حرارتی', en: 'Building energy simulation & thermal zoning' },
      { fa: 'تحلیل روشنایی طبیعی در تمامی طبقات', en: 'Multi-floor daylighting evaluation' },
      { fa: 'ارزیابی بر اساس مبحث ۱۹ مقررات ملی ساختمان', en: 'National Building Regulations Chapter 19 evaluation' },
      { fa: 'مقایسه سناریوهای ملات حرارتی پوسته', en: 'Comparative thermal mortar envelope study' },
    ],
    designStrategies: [
      { fa: 'دیوار خارجی با لایه ملات حرارتی ۲ تا ۳ سانتی‌متر', en: 'External wall assembly with 2–3 cm thermal mortar' },
      { fa: 'پنجره‌های ترمال‌بریک و عایق‌کاری بام', en: 'Thermal-break windows and insulated roof assembly' },
      { fa: 'کنترل پل‌های حرارتی در گره‌های اجرایی', en: 'Thermal bridge detailing at structural junctions' },
    ],
    metrics: [
      { label: { fa: 'کاهش بار کل با ملات عایق ۳ سانتی‌متر', en: 'Total Load Reduction (3cm Thermal Mortar)' }, value: '-18.2%', unit: 'vs. uninsulated' },
      { label: { fa: 'کاهش بار کل با ملات عایق ۲ سانتی‌متر', en: 'Total Load Reduction (2cm Thermal Mortar)' }, value: '-15.8%', unit: 'vs. uninsulated' },
    ],
    featured: false,
  },
  {
    id: 'proj-07',
    slug: 'yas-residential',
    indexNumber: '07',
    title: {
      fa: 'ساختمان مسکونی یاس',
      en: 'Yas Residential Building',
    },
    location: {
      fa: 'بلوار یاس، مشهد، ایران',
      en: 'Yas Blvd., Mashhad, Iran',
    },
    year: '۱۴۰۵',
    architect: {
      fa: 'مؤسسه مدیریت پایش ساختمان پایدار',
      en: 'Sustainable Building Monitoring & Management Institute',
    },
    category: 'residential',
    departments: ['energy'],
    services: ['srv-02', 'srv-05', 'srv-12'],
    energyGrade: 'EC',
    heroImage: '/images/projects/yas-hero.webp',
    galleryImages: [
      {
        src: '/images/projects/yas-hero.webp',
        caption: { fa: 'دیاگرام سه‌بعدی انتقال حرارت و نقاط پل حرارتی در بالکن، لبه دال، جان‌پناه و همکف', en: '3D conductive heat-transfer diagram identifying parapet, balcony, slab-edge, and base junctions' },
      },
      {
        src: '/images/projects/yas-thermal.webp',
        caption: { fa: 'هم‌گذاری نقشه حرارتی پوسته بر روی نمای ساختمان یاس', en: 'Thermal envelope performance overlay on Yas Residential façade' },
      },
    ],
    summary: {
      fa: 'تحلیل انتقال حرارت و پل‌های حرارتی نما، اصلاح جزئیات اتصال دیوار و سقف و تدوین دفترچه فنی انطباق با مبحث ۱۹.',
      en: 'Detailed conductive heat-transfer and thermal-bridge modeling across wall, slab, balcony, and roof junctions with Chapter 19 compliance dossier.',
    },
    narrative: {
      fa: 'پروژه مسکونی یاس نمونه دقیقی از تحلیل میکرو-حرارتی جزئیات اجرایی نماست. با شبیه‌سازی دما در مقاطع اتصال دال و دیوار خارجی (از ۱۸.۵- تا ۲۱.۱+ درجه سانتی‌گراد)، نقاط اتلاف حرارتی در لبه جان‌پناه، کنسول بالکن، لبه دال و اتصال همکف شناسایی و اصلاح گردید.',
      en: 'Yas Residential Building focused on micro-scale envelope physics. Two-dimensional thermal bridge simulations mapped temperature gradients across slab-to-wall and balcony junctions, guiding insulation continuity details and compiling the official Chapter 19 technical dossier.',
    },
    scopeOfWork: [
      { fa: 'شبیه‌سازی انرژی و ارزیابی مبحث ۱۹', en: 'Energy simulation & Chapter 19 evaluation' },
      { fa: 'تحلیل انتقال حرارت و پل‌های حرارتی نما', en: 'Heat transfer & façade thermal bridge analysis' },
      { fa: 'بررسی و اصلاح جزئیات اتصال دیوار و سقف', en: 'Wall-to-slab & parapet junction detailing' },
      { fa: 'تدوین دفترچه فنی و مستندات انطباق با مبحث ۱۹', en: 'Preparation of Chapter 19 technical compliance dossier' },
    ],
    designStrategies: [
      { fa: 'بهینه‌سازی پوسته و پنجره‌های کم‌گسیل', en: 'Envelope insulation & Low-E glazing' },
      { fa: 'کاهش پل حرارتی در اتصالات بالکن و لبه دال', en: 'Thermal bridge mitigation at balcony & slab edges' },
      { fa: 'کنترل تابش و تهویه طبیعی فضاها', en: 'Solar shading and natural ventilation' },
    ],
    metrics: [
      { label: { fa: 'رده انرژی مبحث ۱۹', en: 'Chapter 19 Energy Grade' }, value: 'EC', unit: 'Verified' },
      { label: { fa: 'گره‌های بحرانی تحلیل‌شده', en: 'Critical Thermal Junctions Analyzed' }, value: '4', unit: 'Zones' },
    ],
    featured: false,
  },
  {
    id: 'proj-08',
    slug: 'arsh-residential-tower',
    indexNumber: '08',
    title: {
      fa: 'برج مسکونی عرش',
      en: 'Arsh Residential Tower',
    },
    location: {
      fa: 'بلوار دلاوران، مشهد، ایران',
      en: 'Delavaran Blvd., Mashhad, Iran',
    },
    year: '۱۴۰۵',
    architect: {
      fa: 'مؤسسه عمارت هشتم',
      en: 'Emarat Hashtom Institute',
    },
    category: 'residential',
    departments: ['energy', 'architecture'],
    services: ['srv-04', 'srv-05'],
    heroImage: '/images/projects/arsh-tower-hero.webp',
    galleryImages: [
      {
        src: '/images/projects/arsh-tower-hero.webp',
        caption: { fa: 'نمای برج مسکونی عرش در بلوار دلاوران مشهد', en: 'Exterior view of Arsh Residential Tower' },
      },
    ],
    summary: {
      fa: 'مطالعات پوسته ساختمان بلندمرتبه، بررسی مشخصات شیشه، سایه‌اندازی نما و ارزیابی توزیع نور روز و روشنایی مصنوعی.',
      en: 'High-rise envelope studies, glazing & façade shading analysis, and interior daylight/artificial lighting distribution.',
    },
    narrative: {
      fa: 'در برج مسکونی عرش، تمرکز خدمات ISB بر ارزیابی روشنایی طبیعی و توزیع نور روز در واحدهای مسکونی، تحلیل عملکرد حرارتی پوسته و پل‌های حرارتی در طبقات مرتفع و مقایسه سناریوهای شیشه و سایه‌اندازی نما قرار داشت.',
      en: 'For Arsh Residential Tower, ISB analyzed high-rise façade thermal performance, thermal bridges, glazing specifications, façade self-shading, and interior daylight distribution.',
    },
    scopeOfWork: [
      { fa: 'ارزیابی روشنایی طبیعی و توزیع نور روز', en: 'Natural daylighting & illumination distribution' },
      { fa: 'تحلیل عملکرد حرارتی پوسته و پل‌های حرارتی', en: 'Façade thermal performance & thermal bridge study' },
      { fa: 'بررسی مشخصات شیشه و سایه‌اندازی نما', en: 'Glazing specification & façade shading analysis' },
      { fa: 'مقایسه سناریوهای بهینه‌سازی', en: 'Optimization scenario comparison' },
    ],
    designStrategies: [
      { fa: 'هماهنگی عمق بازشوها و سایبان‌ها با تابش طبقات مرتفع', en: 'Coordinated glazing & shading depth across tower elevations' },
    ],
    metrics: [],
    featured: false,
  },
  {
    id: 'proj-09',
    slug: 'alaleh-residential',
    indexNumber: '09',
    title: {
      fa: 'مجتمع مسکونی آلاله',
      en: 'Alaleh Residential Complex',
    },
    location: {
      fa: 'منطقه ثامن، مشهد، ایران',
      en: 'Samen District, Mashhad, Iran',
    },
    year: '۱۴۰۵',
    architect: {
      fa: 'مسکن شمال شرق',
      en: 'Maskan Shomal Shargh',
    },
    category: 'residential',
    departments: ['energy'],
    services: ['srv-05'],
    heroImage: '/images/projects/alaleh-hero.webp',
    galleryImages: [
      {
        src: '/images/projects/alaleh-hero.webp',
        caption: { fa: 'نمای مجتمع مسکونی آلاله با شناسایی گره‌های ستون بتنی و تیر و لبه دال', en: 'Alaleh Residential Complex façade showing column and slab-edge thermal bridge zones' },
      },
    ],
    summary: {
      fa: 'شناسایی پل‌های حرارتی پوسته، تحلیل جزئیات بحرانی در نرم‌افزار THERM و ارائه راهکارهای اجرایی پیوستگی عایق حرارتی.',
      en: 'Thermal bridge identification, 2D THERM modeling of concrete column & slab-edge junctions, and continuous insulation detailing.',
    },
    narrative: {
      fa: 'در مجتمع مسکونی آلاله، فرآیند پنج‌مرحله‌ای بهینه‌سازی پوسته اجرا شد: شناسایی پل‌های حرارتی در مقاطع تیر، ستون و لبه دال، تحلیل جزئیات بحرانی، شبیه‌سازی مفهومی در نرم‌افزار THERM و ارائه جزئیات اجرایی عایق‌کاری پیوسته برای کاهش اتلاف حرارت.',
      en: 'ISB executed a five-step envelope audit for Alaleh Residential Complex: locating column and slab-edge thermal bridges, evaluating critical junction details, running 2D THERM simulations, and specifying continuous insulation retrofits.',
    },
    scopeOfWork: [
      { fa: 'شناسایی پل‌های حرارتی پوسته', en: 'Envelope thermal bridge identification' },
      { fa: 'تحلیل جزئیات بحرانی تیر، ستون و لبه دال', en: 'Critical beam, column, and slab-edge analysis' },
      { fa: 'شبیه‌سازی مفهومی در THERM و بررسی پیوستگی عایق', en: 'THERM simulation & insulation continuity verification' },
    ],
    designStrategies: [
      { fa: 'پوشش عایق پیوسته روی ستون‌های بتنی و لبه‌های دال نما', en: 'Continuous exterior insulation over exposed concrete columns and slab edges' },
    ],
    metrics: [],
    featured: false,
  },
  {
    id: 'proj-10',
    slug: 'banafsheh-park',
    indexNumber: '10',
    title: {
      fa: 'پارک بنفشه',
      en: 'Banafsheh Park',
    },
    location: {
      fa: 'بلوار سجاد، مشهد، ایران',
      en: 'Sajjad Blvd., Mashhad, Iran',
    },
    year: '۱۴۰۵',
    architect: {
      fa: 'گروه مشاور زیستاوین',
      en: 'Zistavin Consulting Group',
    },
    category: 'urban-landscape',
    departments: ['architecture', 'energy'],
    services: ['srv-01', 'srv-10', 'srv-11'],
    heroImage: '/images/projects/banafsheh-park-hero.webp',
    galleryImages: [
      {
        src: '/images/projects/banafsheh-park-hero.webp',
        caption: { fa: 'دید سه‌بعدی طرح بازطراحی پارک بنفشه در بلوار سجاد مشهد', en: '3D landscape redesign masterplan for Banafsheh Park' },
      },
    ],
    summary: {
      fa: 'بازطراحی پارک و ساماندهی منظر شهری با تحلیل باد غالب مشهد، آسایش حرارتی فضای باز، نفوذپذیری سطح و طراحی اکولوژیک.',
      en: 'Urban park redesign and ecological landscape planning informed by Mashhad wind-rose data, outdoor thermal comfort, and permeable surfaces.',
    },
    narrative: {
      fa: 'پروژه بازطراحی پارک بنفشه با همکاری گروه مشاور زیستاوین، بر پایه تحلیل تابش، آسایش حرارتی فضای باز و نمودار گلباد مشهد انجام شد تا از طریق افزایش پوشش گیاهی، کاهش جزیره حرارتی، مدیریت آب و نفوذپذیری سطوح، فضایی سالم و مشارکت‌محور خلق شود.',
      en: 'In collaboration with Zistavin Consulting Group, ISB conducted outdoor thermal comfort, solar radiation, and Mashhad wind-rose simulations for Banafsheh Park—guiding canopy placement, urban heat-island mitigation, permeable paving, and ecological water retention.',
    },
    scopeOfWork: [
      { fa: 'بازطراحی پارک و ساماندهی منظر', en: 'Park redesign & landscape masterplanning' },
      { fa: 'تحلیل‌های پایداری محیطی و گلباد مشهد', en: 'Environmental sustainability & Mashhad wind-rose analysis' },
      { fa: 'ارزیابی تابش و آسایش حرارتی فضای باز', en: 'Outdoor solar & thermal comfort modeling' },
      { fa: 'ارائه راهکارهای طراحی اکولوژیک', en: 'Ecological design & biodiversity strategies' },
    ],
    designStrategies: [
      { fa: 'بهره‌گیری از باد غالب، افزایش پوشش گیاهی و تنوع زیستی', en: 'Prevailing wind corridors, native canopy expansion & biodiversity' },
      { fa: 'مدیریت آب و نفوذپذیری سطح و کاهش جزیره حرارتی', en: 'Permeable surfaces, stormwater management & urban heat-island reduction' },
    ],
    metrics: [],
    featured: false,
  },
  {
    id: 'proj-11',
    slug: 'vista-plaza-residential',
    indexNumber: '11',
    title: {
      fa: 'مجتمع مسکونی ویستا پلازا',
      en: 'Vista Plaza Residential Complex',
    },
    location: {
      fa: 'بلوار نماز، مشهد، ایران',
      en: 'Namaz Blvd., Mashhad, Iran',
    },
    year: '۱۴۰۵',
    architect: {
      fa: 'گروه مشاور زیستاوین',
      en: 'Zistavin Consulting Group',
    },
    category: 'residential',
    departments: ['architecture', 'energy'],
    services: ['srv-01', 'srv-02', 'srv-05', 'srv-07', 'srv-11'],
    heroImage: '/images/projects/vista-plaza-hero.webp',
    galleryImages: [
      {
        src: '/images/projects/vista-plaza-hero.webp',
        caption: { fa: 'پرسپکتیو مجتمع مسکونی ویستا پلازا با تراس‌های سبز و توده‌گذاری اقلیمی', en: 'Perspective of Vista Plaza Residential Complex with stepped green terraces' },
      },
    ],
    summary: {
      fa: 'توده‌گذاری اقلیمی، ایجاد شکاف میانی برای تهویه دودکشی (Stack Effect)، شبیه‌سازی انرژی در مقایسه با ساختمان مرجع و بازیافت آب خاکستری.',
      en: 'Climatic massing, central stack-effect ventilation courtyard, reference-building energy benchmarking, and greywater recycling integration.',
    },
    narrative: {
      fa: 'در مجتمع مسکونی ویستا پلازا، فرآیند چهارمرحله‌ای توده‌گذاری شامل تحلیل حجم پایه و ضوابط سایت، ایجاد شکاف میانی برای تهویه و دسترسی به نور طبیعی، عقب‌نشینی و شکل‌دهی تراس‌ها برای بهبود منظر و تابش، و در نهایت ترکیب توده با بام سبز، پنل فتوولتائیک و سامانه بازچرخانی آب خاکستری به اجرا درآمد.',
      en: 'For Vista Plaza, ISB guided a four-stage massing strategy: site-envelope analysis, a central courtyard void for natural stack-effect ventilation and daylight penetration, stepped terrace setbacks for solar access, and integration of rooftop PV and greywater treatment.',
    },
    scopeOfWork: [
      { fa: 'شبیه‌سازی انرژی و مقایسه ساختمان طرح با ساختمان مرجع', en: 'Energy simulation & reference-building comparison' },
      { fa: 'تحلیل عملکرد حرارتی پوسته و راهبردهای توده‌گذاری', en: 'Envelope thermal performance & climatic massing' },
    ],
    designStrategies: [
      { fa: 'ایجاد شکاف میانی برای اثر دودکشی و تهویه طبیعی', en: 'Central courtyard void for stack-effect natural ventilation' },
      { fa: 'بام سبز، سامانه‌های تولید انرژی پاک و بازیافت آب خاکستری', en: 'Green roof, solar PV panels, and greywater recycling loop' },
    ],
    metrics: [],
    featured: false,
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-01',
    slug: 'chapter-19-designbuilder',
    title: {
      fa: 'دوره تخصصی الزامات مبحث نوزدهم و دیزاین‌بیلدر (DesignBuilder)',
      en: 'National Building Regulations Chapter 19 & DesignBuilder Intensive',
    },
    subtitle: {
      fa: '۲۵ ساعت آموزشی — شبیه‌سازی انرژی و ممیزی انطباق با مبحث ۱۹',
      en: '25-Hour Professional Certification — Energy Modeling & Chapter 19 Compliance',
    },
    category: 'regulations',
    format: 'live-online',
    instructor: {
      fa: 'دکتر سارا آتشی گلستان و مهندس حامد مصلحی',
      en: 'Dr. Sara Atashi Golestan & Eng. Hamed Moslehi',
    },
    instructorRole: {
      fa: 'رئیس دپارتمان انرژی و مدرس مبحث نوزدهم · مشاور و مدرس انرژی',
      en: 'Head of Energy Department & Chapter 19 Lecturer · Energy Consultant',
    },
    duration: {
      fa: '۲۵ ساعت آموزشی',
      en: '25 Hours',
    },
    priceToman: 4800000,
    isAvailable: true,
    posterImage: '/images/academy/designbuilder-ch19.webp',
    shortDescription: {
      fa: 'آموزش جامع مدلسازی هندسی و زون‌بندی حرارتی، محاسبه و کنترل U-Value، تعریف سیستم‌های HVAC و تهیه گزارش حرفه‌ای انطباق با مبحث ۱۹.',
      en: 'Hands-on training in thermal zoning, U-Value compliance, HVAC modeling in DesignBuilder, and preparing official Chapter 19 dossiers.',
    },
    overview: {
      fa: 'این دوره ۲۵ ساعته ویژه مهندسان معمار، مکانیک، عمران، دانشجویان کارشناسی و کارشناسی ارشد طراحی شده است تا فرآیند واقعی شبیه‌سازی انرژی ساختمان در DesignBuilder را از استخراج الزامات مبحث نوزدهم برای پوسته حرارتی تا مقایسه حالت مبنا و پیشنهادی و تهیه دفترچه فنی حرفه‌ای بیاموزند.',
      en: 'Designed for architects, MEP engineers, and graduate students, this 25-hour program covers every step of DesignBuilder energy modeling—from extracting Chapter 19 envelope mandates and HVAC scheduling to baseline comparison and professional engineering reporting.',
    },
    objectives: [
      { fa: 'آشنایی با شبیه‌سازی انرژی و محاسبات انرژی طبق مبحث ۱۹', en: 'Master energy simulation workflows aligned with Chapter 19' },
      { fa: 'استخراج الزامات مبحث نوزدهم برای پوسته حرارتی و بازشوها', en: 'Extract Chapter 19 thermal envelope & glazing criteria' },
      { fa: 'محاسبه و کنترل U-Value اجزای ساختمان و سایبان‌ها', en: 'Calculate and verify assembly U-Values and shading' },
      { fa: 'مدل‌سازی سیستم‌های HVAC، بارهای داخلی و الگوهای بهره‌برداری', en: 'Configure HVAC systems, internal loads, and occupancy schedules' },
      { fa: 'انطباق مدل با مبحث ۱۹، مقایسه حالت مبنا/پیشنهادی و تهیه گزارش حرفه‌ای', en: 'Benchmark baseline vs. proposed models and compile compliance reports' },
    ],
    targetAudience: [
      { fa: 'مهندسان طراح، ناظر و مجری معماری و تأسیسات', en: 'Licensed architectural and mechanical design engineers' },
      { fa: 'دانشجویان کارشناسی و کارشناسی ارشد معماری و انرژی', en: 'Undergraduate & graduate architecture and energy students' },
      { fa: 'متقاضیان ورود به بازار مشاوره انرژی ساختمان', en: 'Professionals entering building energy consultancy' },
    ],
    requirements: [
      { fa: 'آشنایی پایه با مفاهیم معماری یا تأسیسات ساختمان', en: 'Foundational knowledge of architectural plans or HVAC' },
      { fa: 'نصب نرم‌افزار DesignBuilder روی سیستم شخصی', en: 'Laptop with DesignBuilder installed' },
    ],
    syllabus: [
      {
        title: { fa: 'ماژول ۱: مبانی مبحث ۱۹ و مدل‌سازی هندسی', en: 'Module 1: Chapter 19 Framework & Geometry Modeling' },
        duration: { fa: '۶ ساعت', en: '6 Hours' },
        topics: [
          { fa: 'الزامات مبحث نوزدهم مقررات ملی ساختمان و رده‌های انرژی (EC تا ECZn)', en: 'Chapter 19 mandates and energy grades (EC to ECZn)' },
          { fa: 'مدل‌سازی هندسی دقیق و زون‌بندی فضاهای کنترل‌شده و کنترل‌نشده', en: 'Geometry modeling and conditioned/unconditioned thermal zoning' },
        ],
      },
      {
        title: { fa: 'ماژول ۲: پوسته حرارتی، U-Value و بازشوها', en: 'Module 2: Envelope Physics, U-Value & Fenestration' },
        duration: { fa: '۶ ساعت', en: '6 Hours' },
        topics: [
          { fa: 'تعریف لایه‌های جداره‌ها، عایق حرارتی و کنترل U-Value', en: 'Opaque assembly layers, insulation, and U-Value verification' },
          { fa: 'مدل‌سازی پنجره‌های کم‌گسیل، SHGC و سایبان‌های معماری', en: 'Low-E glazing, SHGC, and architectural shading devices' },
        ],
      },
      {
        title: { fa: 'ماژول ۳: بارهای داخلی، روشنایی و HVAC', en: 'Module 3: Internal Loads, Lighting & HVAC Systems' },
        duration: { fa: '۷ ساعت', en: '7 Hours' },
        topics: [
          { fa: 'تنظیم الگوهای بهره‌برداری، بارهای داخلی و روشنایی', en: 'Occupancy schedules, internal gains, and lighting power density' },
          { fa: 'تعریف و مدل‌سازی سیستم‌های گرمایش، سرمایش و تهویه', en: 'Detailed HVAC configuration and thermal recovery' },
        ],
      },
      {
        title: { fa: 'ماژول ۴: تحلیل نتایج، مقایسه مرجع و تدوین گزارش', en: 'Module 4: Results Analysis, Baseline & Reporting' },
        duration: { fa: '۶ ساعت', en: '6 Hours' },
        topics: [
          { fa: 'مقایسه ساختمان طرح با ساختمان مرجع (Reference vs. Proposed)', en: 'Reference vs. proposed building benchmarking' },
          { fa: 'تدوین دفترچه فنی و مستندات رسمی انطباق با مبحث ۱۹', en: 'Compiling professional Chapter 19 energy audit dossiers' },
        ],
      },
    ],
    faqs: [
      {
        question: { fa: 'آیا پس از پایان دوره گواهینامه معتبر صادر می‌شود؟', en: 'Is a completion certificate issued after the course?' },
        answer: { fa: 'بله، پس از گذراندن موفق دوره و ارزیابی پروژه پایانی، گواهینامه دیجیتال قابل استعلام در پنل کاربری آکادمی ISB صادر می‌شود.', en: 'Yes, upon completing all modules and the final evaluation, a verifiable digital certificate is issued in your ISB dashboard.' },
      },
      {
        question: { fa: 'آیا فایل‌های ضبط‌شده و تمرین‌های عملی در اختیار شرکت‌کنندگان قرار می‌گیرد؟', en: 'Are session recordings and project files provided?' },
        answer: { fa: 'تمامی فایل‌های آموزشی، مدل‌های نمونه و منابع تکمیلی بلافاصله پس از ثبت‌نام و تأیید پرداخت در داشبورد شما فعال می‌شوند.', en: 'All session materials, sample models, and downloadable resources are unlocked in your dashboard immediately after enrollment.' },
      },
    ],
  },
  {
    id: 'course-02',
    slug: 'green-building-development-workshop',
    title: {
      fa: 'کارگاه تخصصی توسعه ساختمان سبز و مصالح نوین (EXPOLAB)',
      en: 'Green Building Development & Sustainable Materials Workshop',
    },
    subtitle: {
      fa: 'کارگاه کاربردی — معرفی مصالح نوین، کارا و پایدار در اکوستیک و انرژی',
      en: 'Applied Workshop — Innovative Materials for Building Acoustics & Energy',
    },
    category: 'green-building',
    format: 'workshop',
    instructor: {
      fa: 'تیم تخصصی معماری، انرژی و مشاوران علمی ISB',
      en: 'ISB Architecture, Energy & Scientific Advisory Team',
    },
    instructorRole: {
      fa: 'هم‌راستا با رویداد تخصصی EXPOLAB 404',
      en: 'Aligned with EXPOLAB 404 Technical Symposium',
    },
    duration: {
      fa: '۱۲ ساعت کارگاهی',
      en: '12 Hours (Workshop)',
    },
    priceToman: 2900000,
    isAvailable: true,
    posterImage: '/images/academy/expolab-404.webp',
    shortDescription: {
      fa: 'بررسی مصالح عایق حرارتی و صوتی دارای گواهینامه فنی، جزئیات اجرایی حذف پل حرارتی و پیوند صنعت ساختمان با طراحی پایدار.',
      en: 'Hands-on evaluation of certified thermal and acoustic materials, thermal-bridge mitigation details, and sustainable construction workflows.',
    },
    overview: {
      fa: 'این کارگاه تخصصی با الگوبرداری از تجربه موفق رویداد EXPOLAB 404، پلی میان پژوهش‌های علمی انرژی و آکوستیک ساختمان و محصولات واقعی دارای گواهینامه فنی در صنعت ساختمان ایجاد می‌کند.',
      en: 'Building on ISB’s EXPOLAB 404 technical showcase, this workshop bridges building science research with certified thermal and acoustic building materials in real construction practice.',
    },
    objectives: [
      { fa: 'ارزیابی فنی ملات‌های حرارتی، عایق‌های نوین و شیشه‌های کم‌گسیل', en: 'Evaluate thermal mortars, mineral wool, and Low-E glazing' },
      { fa: 'آشنایی با الزامات آکوستیکی و عایق‌بندی صوتی جداره‌ها', en: 'Apply building acoustic requirements and sound insulation assemblies' },
      { fa: 'اجرای صحیح گره‌های اتصال بدون پل حرارتی در کارگاه', en: 'Execute thermal-bridge-free façade junctions on site' },
    ],
    targetAudience: [
      { fa: 'سازندگان، مدیران پروژه و مهندسان اجرایی', en: 'Developers, project managers, and site engineers' },
      { fa: 'معماران و طراحان دکوراسیون و نما', en: 'Architects and façade designers' },
    ],
    requirements: [
      { fa: 'نیازی به پیش‌نیاز نرم‌افزاری خاص نیست', en: 'No specialized software prerequisite' },
    ],
    syllabus: [
      {
        title: { fa: 'بخش ۱: مصالح نوین پوسته و بهره‌وری انرژی', en: 'Part 1: Innovative Envelope Materials & Energy Efficiency' },
        duration: { fa: '۶ ساعت', en: '6 Hours' },
        topics: [
          { fa: 'مقایسه عملکردی عایق‌های حرارتی و ملات‌های عایق', en: 'Comparative analysis of insulation & thermal mortars' },
          { fa: 'تحلیل موردی پروژه‌های بهینه‌سازی‌شده مشهد', en: 'Case studies from Mashhad optimized projects' },
        ],
      },
      {
        title: { fa: 'بخش ۲: آکوستیک ساختمان و جزئیات اجرایی', en: 'Part 2: Building Acoustics & Site Detailing' },
        duration: { fa: '۶ ساعت', en: '6 Hours' },
        topics: [
          { fa: 'الزامات آکوستیکی جداره‌ها و کف‌ها', en: 'Acoustic insulation criteria for walls and slabs' },
          { fa: 'بررسی نمونه‌های دارای گواهینامه فنی', en: 'Reviewing technically certified industrial systems' },
        ],
      },
    ],
    faqs: [
      {
        question: { fa: 'آیا شرکت‌کنندگان با نمونه‌های واقعی مصالح آشنا می‌شوند؟', en: 'Does the workshop examine certified material assemblies?' },
        answer: { fa: 'بله، در این کارگاه جزئیات لایه‌بندی واقعی مورد استفاده در پروژه‌های ممیزی‌شده ISB بررسی می‌شود.', en: 'Yes, real certified assemblies tested in ISB projects are examined in detail.' },
      },
    ],
  },
  {
    id: 'course-03',
    slug: 'green-facades-sustainable-architecture',
    title: {
      fa: 'دوره نقش جداره‌های سبز در توسعه معماری پایدار',
      en: 'Green Façades & Envelopes in Sustainable Architecture',
    },
    subtitle: {
      fa: 'دوره تخصصی — خرداقلیم، بام سبز، دیوار سبز و نماهای اقلیمی',
      en: 'Specialized Course — Microclimate, Green Roofs & Living Envelopes',
    },
    category: 'green-building',
    format: 'recorded',
    instructor: {
      fa: 'مهندس حمید عرفانیان و مهندس زهرا رمضانی',
      en: 'Eng. Hamid Erfanian & Eng. Zahra Ramezani',
    },
    instructorRole: {
      fa: 'معمار ارشد و کارشناس ارشد علوم ساختمان',
      en: 'Senior Architect & Building Science Specialist',
    },
    duration: {
      fa: '۱۴ ساعت ویدئویی',
      en: '14 Hours (Recorded)',
    },
    priceToman: 2400000,
    isAvailable: true,
    posterImage: '/images/projects/vista-plaza-hero.webp',
    shortDescription: {
      fa: 'بررسی فنی طراحی بام سبز، تراس‌های اکولوژیک، جداره‌های گیاهی و تأثیر کمی آن‌ها بر کاهش جزیره حرارتی و بار سرمایش ساختمان.',
      en: 'Technical engineering of green roofs, vertical living façades, and their measurable impact on urban heat islands and cooling loads.',
    },
    overview: {
      fa: 'در این دوره ضبط‌شده، لایه‌های فنی اجرای بام سبز و دیوار سبز، نحوه آبیاری پایدار با آب خاکستری، انتخاب گونه‌های اقلیمی و مدل‌سازی اثر حرارتی جداره‌های سبز در شبیه‌سازی انرژی بررسی می‌شود.',
      en: 'Explore green roof and living wall layering, greywater irrigation loops, climate-resilient plant selection, and energy modeling of vegetated envelopes.',
    },
    objectives: [
      { fa: 'طراحی جزئیات لایه‌ای بام سبز و جداره‌های گیاهی', en: 'Detail green roof and vegetated façade assemblies' },
      { fa: 'مدیریت آب و اتصال سامانه آب خاکستری به آبیاری نما', en: 'Integrate greywater recycling with façade irrigation' },
    ],
    targetAudience: [
      { fa: 'معماران، طراحان منظر و دانشجویان معماری', en: 'Architects, landscape designers, and architecture students' },
    ],
    requirements: [
      { fa: 'آشنایی عمومی با طراحی معماری', en: 'General familiarity with architectural design' },
    ],
    syllabus: [
      {
        title: { fa: 'فصل ۱: مبانی اکولوژیک و خرداقلیم جداره‌های سبز', en: 'Unit 1: Ecological Principles & Envelope Microclimate' },
        duration: { fa: '۷ ساعت', en: '7 Hours' },
        topics: [
          { fa: 'تأثیر تبخیر و تعرق بر کاهش دمای سطح پوسته', en: 'Evapotranspiration effects on surface temperatures' },
          { fa: 'جزئیات زهکشی، عایق رطوبتی و بستر کاشت', en: 'Drainage, waterproofing, and substrate engineering' },
        ],
      },
      {
        title: { fa: 'فصل ۲: مطالعات موردی و تحلیل انرژی', en: 'Unit 2: Case Studies & Energy Impact' },
        duration: { fa: '۷ ساعت', en: '7 Hours' },
        topics: [
          { fa: 'تحلیل نمونه مجتمع‌های مسکونی و مدارس پایدار', en: 'Case analysis of residential complexes and sustainable schools' },
        ],
      },
    ],
    faqs: [],
  },
  {
    id: 'course-04',
    slug: 'sero-sabz-rating-system',
    title: {
      fa: 'آشنایی با سیستم رتبه‌بندی ساختمان سبز ایران (سرو سبز)',
      en: "Introduction to Iran's Green Building Rating System (Sero Sabz)",
    },
    subtitle: {
      fa: 'چارچوب بومی ارزیابی هشت‌گانه پایداری ساختمان در ایران',
      en: '8-Domain National Framework for Sustainable Building Assessment',
    },
    category: 'certification',
    format: 'live-online',
    instructor: {
      fa: 'دکتر سارا آتشی گلستان',
      en: 'Dr. Sara Atashi Golestan',
    },
    instructorRole: {
      fa: 'عضو شورای سیاست‌گذاری توسعه ساختمان سبز و پایدار مرکز تحقیقات راه، مسکن و شهرسازی',
      en: 'Member of Green Building Policy Council at BHRC',
    },
    duration: {
      fa: '۱۰ ساعت آموزشی',
      en: '10 Hours',
    },
    priceToman: 1950000,
    isAvailable: true,
    posterImage: '/images/projects/mehregan-cert.webp',
    shortDescription: {
      fa: 'آموزش دقیق ساختار امتیازی ۸ حوزه اصلی سرو سبز (آب ۲۴٪، انرژی ۲۳٪، کیفیت محیط داخل ۱۸٪ و ...) و نحوه تدوین مستندات برای اخذ گواهی.',
      en: 'Deep dive into the 8 Sero Sabz scoring domains (Water 24%, Energy 23%, IEQ 18%) and documentation workflow for certification.',
    },
    overview: {
      fa: 'سرو سبز نظام ارزیابی بومی ساختمان‌های سبز ایران است که فراتر از صرفه‌جویی انرژی، عملکرد پروژه را در هشت حوزه آب، انرژی، کیفیت محیط داخل، مصالح، پسماند، مدیریت، سایت و محیط خارج ارزیابی می‌کند. این دوره بر پایه تجربه واقعی اخذ گواهی سرو طلایی برای مجتمع مهرگان تدریس می‌شود.',
      en: 'Sero Sabz evaluates buildings across 8 sustainability domains beyond energy alone. Taught using real submission workflows including the Golden Cypress certification of Mehregan Residential Complex.',
    },
    objectives: [
      { fa: 'تسلط بر وزن‌دهی ۸ محور اصلی استاندارد سرو سبز', en: 'Master the 8 weighted domains of Sero Sabz' },
      { fa: 'شناخت تفاوت سطوح سرو فیروزه‌ای، نقره‌ای، طلایی و سبز', en: 'Understand scoring thresholds from Turquoise to Green Cypress' },
      { fa: 'تدوین چک‌لیست و مدارک بخش طراحی و اجرا', en: 'Prepare design and construction compliance dossiers' },
    ],
    targetAudience: [
      { fa: 'کارفرمایان، مهندسان مشاور و ارزیابان ساختمان سبز', en: 'Developers, consulting engineers, and sustainability assessors' },
    ],
    requirements: [
      { fa: 'آشنایی با فرآیند طراحی و مبحث ۱۹', en: 'Familiarity with building design and Chapter 19' },
    ],
    syllabus: [
      {
        title: { fa: 'بخش ۱: ساختار کلان سرو سبز و ارتباط با مبحث ۱۹', en: 'Part 1: Sero Sabz Architecture & Link to Chapter 19' },
        duration: { fa: '۵ ساعت', en: '5 Hours' },
        topics: [
          { fa: 'تحلیل محور بهره‌وری آب (۲۴٪) و انرژی (۲۳٪)', en: 'Water Efficiency (24%) & Energy (23%) credits' },
          { fa: 'کیفیت محیط داخل (۱۸٪) و مصالح و منابع (۱۳٪)', en: 'Indoor Environmental Quality (18%) & Materials (13%)' },
        ],
      },
      {
        title: { fa: 'بخش ۲: مستندسازی پروژه واقعی مهرگان (سرو طلایی)', en: 'Part 2: Real Certification Walkthrough (Mehregan)' },
        duration: { fa: '۵ ساعت', en: '5 Hours' },
        topics: [
          { fa: 'چک‌لیست پسماند، مدیریت، سایت و کیفیت محیط خارج', en: 'Waste, Management, Site & Outdoor Environment credits' },
          { fa: 'آماده‌سازی پرونده ارسال به مرکز تحقیقات راه، مسکن و شهرسازی', en: 'Submission package preparation for BHRC review' },
        ],
      },
    ],
    faqs: [],
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-01',
    slug: 'sero-sabz-beyond-chapter-19',
    category: { fa: 'استانداردها و ضوابط', en: 'Standards & Codes' },
    publishedAt: '۱۴۰۴/۰۳/۱۵',
    readTime: { fa: '۶ دقیقه مطالعه', en: '6 min read' },
    author: { fa: 'دکتر سارا آتشی گلستان', en: 'Dr. Sara Atashi Golestan' },
    title: {
      fa: 'سرو سبز چیست و چه تفاوتی با الزامات مبحث نوزدهم دارد؟',
      en: 'Beyond Chapter 19: Inside Iran’s Sero Sabz Green Building Rating System',
    },
    excerpt: {
      fa: 'مبحث ۱۹ بر کاهش مصرف انرژی ساختمان تمرکز دارد؛ اما نظام بومی سرو سبز عملکرد پروژه را در هشت حوزه شامل آب (۲۴٪)، انرژی (۲۳٪) و کیفیت محیط داخل ارزیابی می‌کند.',
      en: 'While National Chapter 19 governs building energy conservation, Sero Sabz establishes an 8-domain holistic benchmark led by water efficiency (24%) and energy (23%).',
    },
    body: [
      {
        fa: 'مبحث نوزدهم مقررات ملی ساختمان گام بنیادین و الزامی در مسیر کاهش تلفات حرارتی پوسته و تعریف رده‌های انرژی (EC تا ECZn) است. با این حال، پایداری واقعی یک ساختمان تنها به عدد مصرف انرژی محدود نمی‌شود.',
        en: 'National Building Regulations Chapter 19 provides the mandatory baseline for envelope heat-loss limits and energy grades (EC through ECZn). Yet genuine building sustainability extends well beyond kilowatt-hours.',
      },
      {
        fa: 'نظام ارزیابی بومی «سرو سبز» در هشت حوزه اصلی تعریف شده است: بهره‌وری آب (۲۴٪)، انرژی (۲۳٪)، کیفیت محیط داخل (۱۸٪)، مصالح و منابع (۱۳٪)، پسماند (۸٪)، مدیریت (۸٪)، سایت (۶٪) و کیفیت محیط خارج (۶٪). این توزیع نشان می‌دهد که در اقلیم ایران، بهره‌وری آب حتی از انرژی نیز سهم وزنی بالاتری دارد.',
        en: 'Sero Sabz scores buildings across eight weighted domains: Water Efficiency (24%), Energy (23%), Indoor Environmental Quality (18%), Materials & Resources (13%), Waste (8%), Management (8%), Site (6%), and Outdoor Quality (6%). Reflecting Iran’s arid climate realities, water efficiency carries the single highest weight.',
      },
      {
        fa: 'تجربه اخذ گواهینامه سرو طلایی (۶۰ تا ۸۰ امتیاز) در مجتمع مسکونی مهرگان مشهد نشان داد که اگر ارزیابی سرو سبز از مرحله طراحی معماری آغاز شود، هم‌افزایی میان بام سبز، بازیافت آب خاکستری، پنجره کم‌گسیل و انرژی خورشیدی بدون تحمیل هزینه‌های اصلاحی پس از اجرا محقق می‌شود.',
        en: 'Our Golden Cypress certification for Mehregan Residential Complex demonstrated that integrating Sero Sabz criteria from schematic design aligns green roofs, greywater reuse, Low-E glazing, and solar systems without costly construction rework.',
      },
    ],
    image: '/images/projects/mehregan-cert.webp',
    relatedDepartment: 'energy',
  },
  {
    id: 'art-02',
    slug: 'thermal-bridges-in-mashhad-facades',
    category: { fa: 'فیزیک ساختمان', en: 'Building Physics' },
    publishedAt: '۱۴۰۵/۰۱/۲۰',
    readTime: { fa: '۵ دقیقه مطالعه', en: '5 min read' },
    author: { fa: 'مهندس زهرا رمضانی', en: 'Eng. Zahra Ramezani' },
    title: {
      fa: 'نقش پل‌های حرارتی ستون، لبه دال و بالکن در اتلاف انرژی نماهای سنگی',
      en: 'Mitigating Thermal Bridges at Column, Slab-Edge & Balcony Junctions',
    },
    excerpt: {
      fa: 'بررسی نتایج شبیه‌سازی THERM در پروژه‌های مسکونی مشهد نشان می‌دهد چگونه انقطاع عایق در گره‌های سازه‌ای، راندمان کل پوسته را تضعیف می‌کند.',
      en: 'Findings from 2D THERM simulations in Mashhad residential projects showing how insulation discontinuities at structural nodes undermine façade efficiency.',
    },
    body: [
      {
        fa: 'در بسیاری از پروژه‌های مسکونی، حتی زمانی که دیوارهای اصلی دارای عایق حرارتی مناسب هستند، عدم پیوستگی عایق روی ستون‌های بتنی، تیرهای محیطی، لبه دال‌ها و کنسول بالکن‌ها باعث ایجاد پل‌های حرارتی شدید می‌شود.',
        en: 'Even when infill walls are well-insulated, uninsulated concrete columns, perimeter beams, slab edges, and cantilevered balconies create severe conductive thermal bridges.',
      },
      {
        fa: 'در مطالعات موردی پروژه‌های یاس و آلاله در مشهد، مدل‌سازی دو‌بعدی در نرم‌افزار THERM مسیر انتقال حرارت و ریسک میعان سطحی را در گره‌های بحرانی آشکار ساخت و راهکارهای اجرایی پوشش پیوسته عایق و ملات‌های حرارتی تدوین شد.',
        en: 'In our Yas and Alaleh residential studies in Mashhad, 2D THERM modeling mapped heat-flux vectors and condensation risks across structural junctions, guiding continuous exterior insulation and thermal-mortar details.',
      },
    ],
    image: '/images/projects/yas-thermal.webp',
    relatedDepartment: 'energy',
  },
  {
    id: 'art-03',
    slug: 'daylight-vs-glare-industrial-schools',
    category: { fa: 'نور روز و آسایش بصری', en: 'Daylight & Comfort' },
    publishedAt: '۱۴۰۴/۰۸/۱۰',
    readTime: { fa: '۵ دقیقه مطالعه', en: '5 min read' },
    author: { fa: 'دکتر بهروز کاری و تیم شبیه‌سازی ISB', en: 'Dr. Behrouz Kari & ISB Simulation Team' },
    title: {
      fa: 'تعادل میان sDA و ASE در طراحی نور روز فضاهای صنعتی و آموزشی',
      en: 'Balancing sDA and ASE in Daylight Design for Industrial & Educational Spaces',
    },
    excerpt: {
      fa: 'چگونه در کارخانه فراپانل (sDA 77%) و مدرسه پایدار کرمان (sDA 93.08%) نور طبیعی حداکثری بدون خیرگی و افزایش بار سرمایش حاصل شد؟',
      en: 'How Farapanel Factory (77% sDA) and the Kerman Sustainable School (93.08% sDA) maximized useful daylight while controlling glare and cooling loads.',
    },
    body: [
      {
        fa: 'افزایش سطح بازشوها بدون کنترل تابش، اگرچه روشنایی را زیاد می‌کند، اما با بالا بردن شاخص ASE (تابش مستقیم سالانه)، موجب خیرگی شدید و جهش بار سرمایشی تابستان می‌شود.',
        en: 'Oversized unshaded glazing may boost illuminance, yet it drives up Annual Sunlight Exposure (ASE), causing visual glare and summer cooling spikes.',
      },
      {
        fa: 'تجربه طراحی یکپارچه در کارخانه فراپانل با ترکیب آتریوم مرکزی، نورگیرهای سقفی کنترل‌شده و لوورهای عمودی غربی، و همچنین در مدرسه پایدار کرمان با حیاط میانی، هم‌زمان شاخص sDA بالا و بار انرژی کنترل‌شده را محقق کرد.',
        en: 'By pairing central atriums, controlled roof monitors, and vertical west-façade fins at Farapanel Factory—and shaded courtyards at the Kerman School—high sDA scores were achieved alongside 20–29% lower energy loads.',
      },
    ],
    image: '/images/diagrams/farapanel-daylight.webp',
    relatedDepartment: 'architecture',
  },
  {
    id: 'art-04',
    slug: 'free-cooling-heat-recovery-step-cascade',
    category: { fa: 'تهویه مطبوع و ممیزی', en: 'HVAC & Auditing' },
    publishedAt: '۱۴۰۵/۰۲/۰۵',
    readTime: { fa: '۴ دقیقه مطالعه', en: '4 min read' },
    author: { fa: 'مهندس حامد مصلحی', en: 'Eng. Hamed Moslehi' },
    title: {
      fa: 'تأثیر بازیافت حرارت و سرمایش آزاد در کاهش ۴۶.۵ درصدی انرژی ساختمان‌های اداری-بحران',
      en: 'Heat Recovery & Free Cooling: Achieving a 46.5% Load Reduction in Civic Buildings',
    },
    excerpt: {
      fa: 'تحلیل داده‌های شبیه‌سازی ساختمان مدیریت بحران استانداری مشهد نشان می‌دهد ترکیب بهینه‌سازی پوسته با کنترل هوشمند تهویه چه جهشی در کارایی ایجاد می‌کند.',
      en: 'Simulation data from Mashhad’s Crisis Management Building illustrates the compounding impact of envelope insulation, heat recovery, and free cooling.',
    },
    body: [
      {
        fa: 'در ساختمان‌های عمومی و اداری با ساعات بهره‌برداری مستمر، بهبود پوسته تنها بخشی از مسیر است. داده‌های مدل‌سازی ساختمان مدیریت بحران استانداری مشهد نشان داد که اصلاح پوسته و پوشش بازتابنده بام نیاز انرژی را از ۳۹۷.۵۳ به ۳۷۴.۲۵ مگاوات‌ساعت کاهش می‌دهد، اما جهش اصلی با کنترل روشنایی، بازیافت حرارت و سرمایش آزاد (Free Cooling) رخ می‌دهد که مصرف را به ۲۱۲.۶۱ مگاوات‌ساعت می‌رساند.',
        en: 'In continuously operated civic facilities, envelope upgrades are only step one. On Mashhad’s Crisis Management Building, envelope retrofits reduced annual demand from 397.53 to 374.25 MWh, while adding daylight control, heat recovery, and free cooling dropped total HVAC demand to 212.61 MWh/year (-46.52%).',
      },
    ],
    image: '/images/diagrams/crisis-mgmt-cutaway.webp',
    relatedDepartment: 'energy',
  },
];
