
export type Language = 'ar' | 'en' | 'fr' | 'zh';

export const translations = {
  ar: {
    dir: 'rtl',
    font: 'IBM Plex Sans Arabic',
    brand: 'بيزنس ديفلوبرز',
    subtitle: 'مسرعة أعمال افتراضية مدعومة بالذكاء الاصطناعي',
    common: {
      back: 'عودة',
      loading: 'جاري التحميل...',
      save: 'حفظ التعديلات',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      next: 'المتابعة',
      start: 'ابدأ الآن'
    },
    nav: {
      incubation: 'الاحتضان',
      memberships: 'الباقات',
      roadmap: 'الخارطة',
      tools: 'الأدوات',
      mentorship: 'الإرشاد',
      login: 'دخول',
      startFree: 'ابدأ مجاناً',
      partner: 'شريك',
      aiMentor: 'الموجه الذكي'
    },
    roles: {
      startup: 'شركة محتضنة',
      partner: 'شريك (Co-Founder)',
      mentor: 'مرشد خبير',
      admin: 'الإدارة',
      desc_startup: 'رحلة تحويل الفكرة إلى منتج',
      desc_partner: 'استثمر خبرتك مقابل حصص',
      desc_mentor: 'ساهم في بناء الجيل القادم',
      desc_admin: 'التحكم المركزي'
    },
    auth: {
      login_title: 'دخول المنصة',
      login_sub: 'اختر هويتك للوصول لمساحة العمل الخاصة بك',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      cta: 'دخول',
      error_admin: 'عذراً، هذا الحساب لا يملك صلاحيات إدارية.',
      error_not_found: 'البريد الإلكتروني غير مسجل في النظام.'
    },
    hero: {
      title: 'بناء المستقبل',
      titleAccent: 'يبدأ من هنا.',
      desc: 'منظومة ريادية متكاملة تجمع المؤسسين، الشركاء، والمرشدين تحت مظلة واحدة مدعومة بذكاء اصطناعي فائق.',
      cta: 'ابدأ رحلة النجاح'
    },
    dashboard: {
      home: 'الرئيسية',
      bootcamp: 'المنهج',
      tasks: 'المهمات',
      lab: 'المختبر',
      builder: 'بناء المشروع (AI)',
      services: 'الخدمات',
      profile: 'الملف',
      logout: 'خروج',
      welcome: 'أهلاً بك،'
    }
  },
  en: {
    dir: 'ltr',
    font: 'sans-serif',
    brand: 'BizDev AI',
    subtitle: 'AI-Powered Virtual Accelerator',
    common: {
      back: 'Back',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      next: 'Next',
      start: 'Start'
    },
    nav: {
      incubation: 'Incubation',
      memberships: 'Plans',
      roadmap: 'Roadmap',
      tools: 'Tools',
      mentorship: 'Mentors',
      login: 'Login',
      startFree: 'Get Started',
      partner: 'Partner',
      aiMentor: 'AI Mentor'
    },
    roles: {
      startup: 'Startup',
      partner: 'Co-Founder',
      mentor: 'Expert Mentor',
      admin: 'Admin',
      desc_startup: 'From idea to product',
      desc_partner: 'Equity for expertise',
      desc_mentor: 'Guide the next gen',
      desc_admin: 'Central hub'
    },
    auth: {
      login_title: 'Platform Login',
      login_sub: 'Select your role to enter workspace',
      email: 'Email',
      password: 'Password',
      cta: 'Sign In',
      error_admin: 'Access denied. Admin only.',
      error_not_found: 'Email not found in our system.'
    },
    hero: {
      title: 'Build the Future',
      titleAccent: 'Starts Here.',
      desc: 'A complete ecosystem connecting founders, partners, and mentors through advanced AI.',
      cta: 'Start Now'
    },
    dashboard: {
      home: 'Home',
      bootcamp: 'Bootcamp',
      tasks: 'Tasks',
      lab: 'Lab',
      builder: 'AI Builder',
      services: 'Services',
      profile: 'Profile',
      logout: 'Logout',
      welcome: 'Welcome,'
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang] || translations.ar;
