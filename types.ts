
export type UserRole = 'STARTUP' | 'PARTNER' | 'MENTOR' | 'ADMIN';

export interface Badge {
  id: string;
  name: string;
  levelId: number;
  icon: string;
  description: string;
  color: string;
}

export const ACADEMY_BADGES: Badge[] = [
  { id: 'b1', levelId: 1, name: 'رائد أعمال طموح', icon: '🔭', description: 'اجتياز مرحلة التحقق الاستراتيجي من الفكرة.', color: 'from-blue-400 to-blue-600' },
  { id: 'b2', levelId: 2, name: 'مخطط استراتيجي', icon: '🧩', description: 'إتقان صياغة نماذج العمل التجارية المبتكرة.', color: 'from-emerald-400 to-emerald-600' },
  { id: 'b3', levelId: 3, name: 'مهندس منتجات', icon: '🛠️', description: 'بناء النسخة الأولية القابلة للاختبار (MVP).', color: 'from-indigo-400 to-indigo-600' },
  { id: 'b4', levelId: 4, name: 'محلل نمو', icon: '📈', description: 'فهم مؤشرات السوق وخطط الاستحواذ والنمو.', color: 'from-amber-400 to-amber-600' },
  { id: 'b5', levelId: 5, name: 'خبير مالي', icon: '💎', description: 'بناء النماذج المالية وتوقعات التدفقات النقدية.', color: 'from-rose-400 to-rose-600' },
  { id: 'b6', levelId: 6, name: 'رائد أعمال متمرس', icon: '🤝', description: 'الجاهزية التامة لعرض المشروع على المستثمرين.', color: 'from-slate-700 to-slate-900' }
];

export interface Partner {
  name: string;
  role: string;
}

export interface UserProfile {
  uid?: string;
  role?: UserRole;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone: string;
  city?: string;
  isRemote?: boolean;
  agreedToTerms: boolean;
  agreedToContract: boolean;
  contractSignedAt?: string;
  isDemo?: boolean;
  
  startupName?: string;
  startupType?: 'Startup' | 'Existing' | 'Tech';
  startupDescription?: string;
  startupBio?: string;
  industry?: string;
  stage?: 'Idea' | 'MVP' | 'Growth' | 'InvestReady';
  logo?: string;
  partners?: Partner[];
  founderBio?: string;
  website?: string;
  linkedin?: string;
  earnedBadges?: string[];

  existingRoles?: string[];
  missingRoles?: string[];
  supportNeeded?: string[];
  mentorExpertise?: string[];
  mentorSectors?: string[];
  skills?: string[];
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  isLocked: boolean;
  isCompleted: boolean;
  customColor?: string;
}

export interface TaskRecord {
  id: string;
  levelId: number;
  uid: string;
  title: string;
  description: string;
  status: 'LOCKED' | 'ASSIGNED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submission?: {
    fileData: string;
    fileName: string;
    submittedAt: string;
  };
  aiReview?: {
    score: number;
    feedback: string;
    isReadyForHuman: boolean;
    readinessScore?: number;
    criticalFeedback?: string;
    suggestedNextSteps?: string[];
  };
}

export const INITIAL_ROADMAP: LevelData[] = [
  { id: 1, title: 'التحقق الاستراتيجي', description: 'التثبت من وجود مشكلة حقيقية في السوق والتحقق من الفرضيات.', icon: '🔭', imageUrl: 'https://images.unsplash.com/photo-1454165833767-13143891bb39?auto=format&fit=crop&q=80&w=600', isLocked: false, isCompleted: false, customColor: 'blue' },
  { id: 2, title: 'هيكلة نموذج العمل', description: 'تصميم محرك الإيرادات والقيمة المضافة للمشروع.', icon: '🧩', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600', isLocked: true, isCompleted: false, customColor: 'emerald' },
  { id: 3, title: 'هندسة المنتج (MVP)', description: 'تحديد المزايا الجوهرية وبناء النسخة الأولى القابلة للاختبار.', icon: '🛠️', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600', isLocked: true, isCompleted: false, customColor: 'indigo' },
  { id: 4, title: 'تحليل الجدوى والنمو', description: 'دراسة حجم السوق، المنافسين، وخطط الاستحواذ.', icon: '📈', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600', isLocked: true, isCompleted: false, customColor: 'amber' },
  { id: 5, title: 'النمذجة المالية', description: 'التوقعات المالية، التقييم، والاحتياج التمويلي.', icon: '💎', imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600', isLocked: true, isCompleted: false, customColor: 'rose' },
  { id: 6, title: 'جاهزية الاستثمار', description: 'إعداد العرض التقديمي النهائي ومحاكاة لجان التحكيم.', icon: '🤝', imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=600', isLocked: true, isCompleted: false, customColor: 'slate' }
];

export enum FiltrationStage { 
  LANDING = 'LANDING', 
  WELCOME = 'WELCOME', 
  DASHBOARD = 'DASHBOARD',
  AI_MENTOR_CONCEPT = 'AI_MENTOR_CONCEPT',
  ROADMAP = 'ROADMAP',
  TOOLS = 'TOOLS',
  LOGIN = 'LOGIN',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  MENTORSHIP = 'MENTORSHIP',
  INCUBATION_PROGRAM = 'INCUBATION_PROGRAM',
  MEMBERSHIPS = 'MEMBERSHIPS',
  PARTNER_CONCEPT = 'PARTNER_CONCEPT',
  FOREIGN_INVESTMENT = 'FOREIGN_INVESTMENT',
  PATH_FINDER = 'PATH_FINDER',
  STAFF_PORTAL = 'STAFF_PORTAL',
  INCUBATION_APPLY = 'INCUBATION_APPLY'
}

export interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
  earnedBadges?: string[];
  founderBio?: string;
  isDemo?: boolean;
}

export type ProjectTrack = 'Idea' | 'Prototype' | 'Product' | 'MVP' | 'Growth' | 'Investment Ready';

export interface StartupRecord {
  projectId: string;
  ownerId: string;
  ownerName: string;
  name: string;
  description: string;
  industry: string;
  status: 'PENDING' | 'APPROVED' | 'STALLED';
  metrics: { readiness: number; tech: number; market: number };
  aiOpinion: string;
  lastActivity: string;
  partners: Partner[];
  currentTrack?: ProjectTrack;
  startupBio?: string;
  website?: string;
  linkedin?: string;
  aiClassification?: 'Green' | 'Yellow' | 'Red';
  isDemo?: boolean;
}

export interface PartnerProfile {
  uid: string;
  name: string;
  email: string;
  primaryRole: 'CTO' | 'COO' | 'CMO' | 'CPO' | 'Finance';
  experienceYears: number;
  bio: string;
  linkedin: string;
  skills: string[];
  availabilityHours: number;
  commitmentType: 'Part-time' | 'Full-time';
  city: string;
  isRemote: boolean;
  workStyle: 'Fast' | 'Structured';
  goals: 'Long-term' | 'Exit' | 'Growth';
  isVerified: boolean;
  profileCompletion: number;
}

export interface MatchResult {
  id: string;
  name: string;
  role: string;
  avatar: string;
  partnerUid: string;
  scores: {
    roleFit: number;
    experienceFit: number;
    industryFit: number;
    styleFit: number;
  };
  totalScore: number;
  reason: string;
  reasoning: string[];
  risk: string;
}

export const DIGITAL_SHIELDS = [
  { id: 's1', name: 'التحقق الاستراتيجي', icon: '🔭', color: 'from-blue-400 to-blue-600' },
  { id: 's2', name: 'هيكلة الأعمال', icon: '🧩', color: 'from-emerald-400 to-emerald-600' },
  { id: 's3', name: 'هندسة المنتج', icon: '🛠️', color: 'from-indigo-400 to-indigo-600' },
];

export const SECTORS = [
  { value: 'Technology', label: 'التقنية والبرمجيات' },
  { value: 'Fintech', label: 'التقنية المالية' },
  { value: 'Food', label: 'الأغذية والمشروبات' },
  { value: 'Industrial', label: 'القطاع الصناعي' },
];

export interface ServicePackage {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  packages: ServicePackage[];
}

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 's1',
    title: 'تصميم الهوية البصرية',
    description: 'بناء هوية تجارية متكاملة تعكس روح مشروعك الناشئ.',
    icon: '🎨',
    packages: [
      { id: 'p1', name: 'الأساسية', price: '١٥٠٠ ريال', features: ['شعار', 'ألوان', 'خطوط'] },
      { id: 'p2', name: 'المتكاملة', price: '٣٠٠٠ ريال', features: ['شعار', 'قرطاسية', 'دليل الهوية'] }
    ]
  }
];

export interface ServiceRequest {
  id: string;
  uid: string;
  serviceId: string;
  packageId: string;
  details: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  createdAt: string;
}

export interface OpportunityAnalysis {
  newMarkets: { region: string; reasoning: string; potentialROI: string }[];
  blueOceanIdea: string;
}

export interface ProgramRating {
  stars: number;
  feedback: string;
  favoriteFeature: string;
  submittedAt: string;
}

export type ProjectStageType = 'Idea' | 'Prototype' | 'Product';
export type TechLevelType = 'Low' | 'Medium' | 'High';
export interface ApplicantProfile {
  codeName: string;
  projectStage: ProjectStageType;
  sector: string;
  goal: string;
  techLevel: TechLevelType;
}

export interface PersonalityQuestion {
  id: number;
  situation: string;
  options: { text: string; style: string }[];
}

export interface AnalyticalQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface RadarMetrics {
  readiness: number;
  analysis: number;
  tech: number;
  personality: number;
  strategy: number;
  ethics: number;
}

export interface ProjectEvaluationResult {
  totalScore: number;
  classification: 'Green' | 'Yellow' | 'Red';
  clarity: number;
  value: number;
  innovation: number;
  market: number;
  readiness: number;
  strengths: string[];
  weaknesses: string[];
  aiOpinion: string;
}

export interface FinalResult {
  score: number;
  isQualified: boolean;
  metrics: RadarMetrics;
  leadershipStyle?: string;
  projectEval?: ProjectEvaluationResult;
  badges: Badge[];
}

export type AgentCategory = 'Vision' | 'Market' | 'User' | 'Opportunity';
export interface AIAgent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
}
export interface ProjectBuildData {
  projectName: string;
  description: string;
  quality: 'Quick' | 'Balanced' | 'Enhanced' | 'Professional' | 'Max';
  selectedAgents: string[];
  results?: {
    vision?: string;
    marketAnalysis?: string;
    userPersonas?: string;
    hypotheses?: string[];
    pitchDeck?: { title: string; content: string }[];
  };
}

export const AVAILABLE_AGENTS: AIAgent[] = [
  { id: 'a1', name: 'Visionary Architect', description: 'Crafts the long-term vision and core strategy.', category: 'Vision' },
  { id: 'a2', name: 'Market Analyst', description: 'Analyzes market trends and competitive landscape.', category: 'Market' },
  { id: 'a3', name: 'User Experience Strategist', description: 'Defines user personas and product flow.', category: 'User' },
  { id: 'a4', name: 'Growth Hacker', description: 'Identifies expansion opportunities and scaling paths.', category: 'Opportunity' },
];

export interface FailureSimulation {
  brutalTruth: string;
  probability: number;
  financialLoss: string;
  operationalImpact: string;
  missingQuestions: string[];
  recoveryPlan: string[];
}

export interface GovStats {
  riskyMarkets: { name: string; failRate: number }[];
  readySectors: { name: string; score: number }[];
  commonFailReasons: { reason: string; percentage: number }[];
  regulatoryGaps: string[];
}

export interface ActivityLogRecord {
  id: string;
  uid: string;
  event: string;
  type: string;
  date: string;
  score?: string;
  color: string;
}

export const TASKS_CONFIG = [
  { id: 't1', title: 'التحقق الاستراتيجي' },
  { id: 't2', title: 'هيكلة نموذج العمل' },
  { id: 't3', title: 'هندسة المنتج' }
];

export interface NominationData {
  companyName: string;
  founderName: string;
  location: string;
  pitchDeckUrl?: string;
  hasCommercialRegister: 'YES' | 'NO' | 'IN_PROGRESS';
  hasTechnicalPartner: boolean;
  problemStatement: string;
  targetCustomerType: string[];
  marketSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'UNKNOWN';
  whyNow: string;
  productStage: 'IDEA' | 'PROTOTYPE' | 'MVP' | 'TRACTION';
  topFeatures: string;
  executionPlan: 'NONE' | 'GENERAL' | 'WEEKLY';
  userCount: string;
  revenueModel: 'NOT_SET' | 'SUBSCRIPTION' | 'COMMISSION' | 'ANNUAL' | 'PAY_PER_USE';
  customerAcquisitionPath: string;
  incubationReason: string;
  weeklyHours: 'LESS_5' | '5-10' | '10-20' | '20+';
  agreesToWeeklySession: boolean;
  agreesToKPIs: boolean;
  isCommitted10Hours: boolean;
  currentResources: string[];
  tractionEvidence: string[];
  demoUrl?: string;
}

export interface NominationResult {
  totalScore: number;
  category: 'DIRECT_ADMISSION' | 'INTERVIEW' | 'PRE_INCUBATION' | 'REJECTION';
  redFlags: string[];
  aiAnalysis: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  specialty: string;
  bio: string;
  experience: number;
  avatar: string;
  rating: number;
  tags: string[];
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder: string;
  instruction: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  role: UserRole[];
  isMandatory: boolean;
  fields: TemplateField[];
}

export interface TemplateSubmission {
  templateId: string;
  data: Record<string, string>;
  aiScore: number;
  aiFeedback: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REVISION_REQUIRED';
  updatedAt: string;
}

export const TEMPLATES_LIBRARY: Template[] = [
  {
    id: 't1',
    title: 'مصفوفة SWOT المتكاملة',
    description: 'تحليل شامل لنقاط القوة والضعف والفرص والمخاطر لمشروعك.',
    icon: '📊',
    role: ['STARTUP'],
    isMandatory: true,
    fields: [
      { id: 'strengths', label: 'نقاط القوة', type: 'textarea', placeholder: 'ما الذي يميزك؟', instruction: 'اذكر ٣ نقاط على الأقل.' },
      { id: 'weaknesses', label: 'نقاط الضعف', type: 'textarea', placeholder: 'أين تكمن المخاطر الداخلية؟', instruction: 'اذكر ٣ نقاط على الأقل.' },
      { id: 'opportunities', label: 'الفرص الخارجية', type: 'textarea', placeholder: 'كيف يمكنك التوسع؟', instruction: 'تحليل اتجاهات السوق.' },
      { id: 'threats', label: 'التهديدات الخارجية', type: 'textarea', placeholder: 'ما الذي يهدد استمرارك؟', instruction: 'المنافسة والتشريعات.' }
    ]
  }
];

export interface SudokuStats {
  gamesPlayed: number;
  gamesWon: number;
  totalTimeSeconds: number;
  bestTimeSeconds: number | null;
}
