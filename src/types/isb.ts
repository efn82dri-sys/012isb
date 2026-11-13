export type Language = 'fa' | 'en';

export interface LocalizedText {
  fa: string;
  en: string;
}

export type DepartmentId = 'architecture' | 'energy' | 'structure';

export type ProjectCategory =
  | 'residential'
  | 'industrial'
  | 'institutional'
  | 'educational'
  | 'urban-landscape';

export interface ProjectMetric {
  label: LocalizedText;
  value: string;
  unit?: string;
  note?: LocalizedText;
}

export interface Project {
  id: string;
  slug: string;
  indexNumber: string;
  title: LocalizedText;
  location: LocalizedText;
  year: string;
  architect: LocalizedText;
  category: ProjectCategory;
  departments: DepartmentId[];
  services: string[];
  energyGrade?: 'ECZn' | 'EC++' | 'EC+' | 'EC';
  seroSabzTier?: LocalizedText;
  heroImage: string;
  galleryImages: { src: string; caption: LocalizedText }[];
  summary: LocalizedText;
  narrative: LocalizedText;
  scopeOfWork: LocalizedText[];
  designStrategies: LocalizedText[];
  metrics: ProjectMetric[];
  featured: boolean;
}

export interface TeamMember {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  department: DepartmentId | 'management' | 'advisor';
  bio: LocalizedText;
  photo?: string;
  isAdvisor?: boolean;
}

export interface ServiceItem {
  id: string;
  slug: string;
  index: string;
  department: DepartmentId;
  title: LocalizedText;
  shortDescription: LocalizedText;
  detailedDescription: LocalizedText;
  deliverables: LocalizedText[];
  relatedProjectSlugs: string[];
}

export interface Department {
  id: DepartmentId;
  index: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  capabilities: LocalizedText[];
  cmsNotice?: LocalizedText;
}

export interface CourseModule {
  title: LocalizedText;
  duration: LocalizedText;
  topics: LocalizedText[];
}

export interface CourseFaq {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface Course {
  id: string;
  slug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  category: 'regulations' | 'simulation' | 'green-building' | 'certification';
  format: 'workshop' | 'live-online' | 'recorded';
  instructor: LocalizedText;
  instructorRole: LocalizedText;
  duration: LocalizedText;
  priceToman: number;
  isAvailable: boolean;
  posterImage: string;
  shortDescription: LocalizedText;
  overview: LocalizedText;
  objectives: LocalizedText[];
  targetAudience: LocalizedText[];
  requirements: LocalizedText[];
  syllabus: CourseModule[];
  faqs: CourseFaq[];
}

export interface Article {
  id: string;
  slug: string;
  category: LocalizedText;
  publishedAt: string;
  readTime: LocalizedText;
  author: LocalizedText;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText[];
  image: string;
  relatedDepartment: DepartmentId;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'instructor' | 'admin';
  emailVerified: boolean;
  createdAt: string;
}

export interface CourseResource {
  id: string;
  title: LocalizedText;
  type: string;
  size: string;
  category: 'handbook' | 'model' | 'checklist';
}

export interface OrderItem {
  courseId: string;
  titleFa: string;
  titleEn: string;
  priceToman: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalToman: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  gateway: 'zarinpal-sandbox' | 'zarinpal-live';
  refId?: string;
  authority?: string;
  cardMask?: string;
  gatewayStatus?: string;
  gatewayMessage?: string;
  createdAt: string;
  paidAt?: string;
  verifiedAt?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  orderId: string;
  progressPercent: number;
  completedModules: number[];
  certificateCode?: string;
  enrolledAt: string;
}

export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  department: DepartmentId;
  projectLocation?: string;
  message: string;
  consentAccepted: boolean;
  createdAt: string;
}
