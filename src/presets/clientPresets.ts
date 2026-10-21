import { ClientConfig } from '../types';

export const DEMO_CLIENT_CONFIG: ClientConfig = {
  clientId: 'demo-tarot-kochi',
  leadSource: 'Google Business Profile / Online Demo',
  googleBusinessProfileUrl: 'https://example.com',
  businessPhone: '+91 90000 00000',
  serviceArea: 'Kochi, Kerala & Online',

  industry: 'Tarot Coaching',
  businessName: 'Demo Business',
  websiteUrl: 'https://example.com',
  tagline: 'Personal Guidance & Tarot Coaching Services',
  footerDescription: 'Personal Guidance & Tarot Coaching Services',
  heroTitle: 'Personal Guidance & Tarot Coaching',
  heroSubheadline: 'Insightful tarot reading and coaching sessions for personal growth, career clarity, and relationship guidance.',
  heroStatusText: 'Online & In-Person Sessions Available',
  heroSecondaryCtaText: 'Request Guidance',
  leadFormStatusText: 'SESSIONS AVAILABLE',
  leadFormTrustText: '',
  finalCtaHeading: 'Request a Guidance Session',
  finalCtaDescription: 'Tell us what guidance or session you are looking for and our team will get back to you.',
  finalCtaButtonText: 'Request Session',
  servicesEyebrow: 'OUR TAROT & COACHING SERVICES',
  servicesHeading: 'Personal Readings & Coaching Sessions',
  servicesDescription: 'Insightful tarot readings, personal coaching, and guidance sessions tailored for career, relationships, and personal development.',
  whyUsHeading: 'Why Clients Choose Our Tarot Coaching',
  serviceAreaHeading: 'Tarot Coaching in Kochi & Online Sessions',
  serviceAreaDescription: 'Providing personal in-person coaching in Kochi and online guidance sessions worldwide.',
  yearsInBusiness: 5,
  jobsCompleted: '500+',
  averageRating: 4.9,
  reviewCount: 120,

  phone: '+91 90000 00000',
  phoneRaw: '+919000000000',
  email: 'demo@example.com',
  address: '',
  cityStateZip: 'Kochi, Kerala',
  businessHours: 'Mon-Sat: 9:00 AM - 7:00 PM',
  emergencyAvailability: '',
  whatsAppNumber: '+919000000000',
  defaultCountryCode: '+91',
  whatsAppMessageTemplate: 'Hi {name}, thank you for reaching out to {businessName} regarding your Tarot Reading session ({service}). When would you like to schedule your guidance reading?',

  primaryColor: '#2E1065',
  accentColor: '#D97706',
  fontFamily: 'Inter, sans-serif',
  logoUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
  aboutImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',

  googleMapsLink: 'https://maps.google.com/?q=Kochi,Kerala',
  googleMapsEmbedUrl: '',
  googleReviewLink: '',
  googleAnalyticsId: '',
  facebookPixelId: '',
  googleTagManagerId: '',

  socialLinks: {},

  seo: {
    title: 'Demo Business | Tarot Coaching & Personal Guidance in Kochi',
    metaDescription: 'Personal tarot reading, relationship guidance, and career coaching sessions in Kochi, Kerala & online.',
    keywords: ['Tarot coaching', 'Personal guidance', 'Online tarot reading', 'Kochi tarot coach'],
    ogImageUrl: '',
    canonicalUrl: '',
  },

  serviceAreas: ['Kochi', 'Ernakulam', 'Kakkanad', 'Aluva', 'Edappally', 'Vyttila', 'Tripunithura', 'Kerala'],
  
  services: [
    {
      id: 'tarot-reading-session',
      title: 'Personal Tarot Reading',
      tagline: 'Deep insights for life decisions',
      description: 'A comprehensive one-on-one session covering personal growth, decision-making, and self-reflection.',
      iconName: 'Sparkles',
      features: ['One-on-One Session', 'Card Spread Analysis', 'Actionable Insights', 'Question Q&A'],
      popular: true,
    },
    {
      id: 'relationship-coaching',
      title: 'Relationship & Harmony Guidance',
      tagline: 'Clarity in interpersonal connections',
      description: 'Guided sessions to gain perspective on relationships, communication, and emotional harmony.',
      iconName: 'Heart',
      features: ['Connection Analysis', 'Communication Guidance', 'Perspective Building', 'Confidential Support'],
    },
    {
      id: 'career-life-coaching',
      title: 'Career & Life Path Coaching',
      tagline: 'Direction for career goals',
      description: 'Focused coaching to evaluate professional choices, transition goals, and personal aspirations.',
      iconName: 'Compass',
      features: ['Career Assessment', 'Goal Alignment', 'Obstacle Navigation', 'Action Planning'],
    },
  ],

  whyUsItems: [
    { title: 'Empathetic Guidance', description: 'Compassionate, non-judgmental environment focused on personal clarity.' },
    { title: 'Structured Coaching', description: 'Actionable steps and structured reflection following every tarot reading.' },
    { title: 'Flexible Sessions', description: 'Convenient online video consultations as well as in-person sessions in Kochi.' },
  ],

  faqs: [
    {
      question: 'What happens during a Tarot Coaching session?',
      answer: 'During the session, we explore your current situation and questions using tarot card spreads as reflection tools to bring clarity and actionable guidance.',
    },
    {
      question: 'Are sessions available online or in-person?',
      answer: 'We offer both in-person sessions in Kochi and convenient online video consultations globally.',
    },
    {
      question: 'How do I prepare for my first session?',
      answer: 'Think about the key areas of your life—such as career, relationships, or personal growth—where you are seeking perspective or direction.',
    },
  ],

  testimonials: [],
  stats: [],
  trustBadges: [],
  beforeAfter: [],

  // Default toggles for production client: OFF as required
  heroTrustBadgesEnabled: false,
  footerEmergencyEnabled: false,
  sampleDataNoticeEnabled: false,
  financingEnabled: false,
  hasEmergencyService: false,
};

export const APEX_HVAC_CLIENT_CONFIG: ClientConfig = {
  clientId: 'client-apex-hvac',
  leadSource: 'Google Business Profile / Local Search',
  googleBusinessProfileUrl: 'https://maps.google.com/?q=Apex+Heating+and+Cooling+Dallas+TX',
  businessPhone: '+1 (555) 247-4822',
  serviceArea: 'Dallas, Fort Worth, Arlington & Metro Area',

  industry: 'HVAC - Heating & Air Conditioning',
  businessName: 'Apex Heating & Cooling',
  websiteUrl: 'https://apexhvac-demo.local',
  tagline: 'Fast, Reliable 24/7 Heating & Air Conditioning Services',
  footerDescription: 'Licensed, insured, and certified HVAC contractors providing 24/7 residential and commercial heating and cooling services across Dallas-Fort Worth.',
  heroTitle: 'Fast, Reliable AC & Heating Repair in Dallas-Fort Worth',
  heroSubheadline: '24/7 emergency repairs, seasonal tune-ups, and energy-efficient heat pump installations by certified technicians with upfront flat-rate pricing.',
  heroStatusText: '24/7 EMERGENCY TECHNICIANS AVAILABLE NOW',
  heroSecondaryCtaText: 'Call (555) 247-4822',
  leadFormStatusText: 'FAST RESPONSE GUARANTEE (UNDER 15 MIN)',
  leadFormTrustText: '🔒 Your information is private and never shared. Direct local dispatch.',
  finalCtaHeading: 'Need Immediate Cooling or Heating Assistance?',
  finalCtaDescription: 'Submit an enquiry below or call directly for same-day dispatch from our certified local team.',
  finalCtaButtonText: 'Request Fast Service',
  servicesEyebrow: 'OUR RESIDENTIAL & COMMERCIAL SERVICES',
  servicesHeading: 'Complete Heating & Air Conditioning Solutions',
  servicesDescription: 'From emergency cooling breakdowns on hot summer days to high-efficiency system installations, our team handles it all with guaranteed workmanship.',
  whyUsHeading: 'Why Homeowners Choose Apex Heating & Cooling',
  serviceAreaHeading: 'Serving Dallas, Fort Worth & Surrounding Communities',
  serviceAreaDescription: 'Local technicians stationed across Dallas, Plano, Arlington, Irving, and Fort Worth for rapid same-day response.',
  yearsInBusiness: 14,
  jobsCompleted: '4,800+',
  averageRating: 4.9,
  reviewCount: 384,

  phone: '+1 (555) 247-4822',
  phoneRaw: '+15552474822',
  email: 'service@apexhvac-demo.com',
  address: '4220 Industrial Blvd, Suite 104',
  cityStateZip: 'Dallas, TX 75207',
  businessHours: '24/7 Emergency Service • Mon-Sat 7:00 AM - 8:00 PM',
  emergencyAvailability: '24/7 Emergency Dispatch Available',
  whatsAppNumber: '+15552474822',
  defaultCountryCode: '+1',
  whatsAppMessageTemplate: 'Hi {name}, this is Apex Heating & Cooling regarding your {service} enquiry. We have a technician available in your area. What time works best for an estimate?',

  primaryColor: '#0F172A',
  accentColor: '#2563EB',
  fontFamily: 'Inter, sans-serif',
  logoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80',
  heroImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
  aboutImageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&auto=format&fit=crop&q=80',

  googleMapsLink: 'https://maps.google.com/?q=Dallas,TX',
  googleMapsEmbedUrl: '',
  googleReviewLink: '',
  formEndpoint: ((import.meta as any).env?.VITE_FORM_ENDPOINT || '').trim(),
  googleAnalyticsId: '',
  facebookPixelId: '',
  googleTagManagerId: '',

  socialLinks: {},

  seo: {
    title: 'Apex Heating & Cooling | 24/7 AC & Heating Repair in Dallas, TX',
    metaDescription: 'Emergency AC repair, heating maintenance, and heat pump installation in Dallas-Fort Worth. Licensed HVAC technicians with upfront pricing.',
    keywords: ['HVAC repair Dallas', 'Emergency AC service', 'Heat pump replacement DFW', 'Air conditioning tune-up'],
    ogImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
    canonicalUrl: '',
  },

  serviceAreas: ['Dallas', 'Fort Worth', 'Arlington', 'Plano', 'Irving', 'Garland', 'Frisco', 'McKinney'],

  services: [
    {
      id: 'emergency-ac-repair',
      title: 'Emergency AC Repair & Diagnostics',
      tagline: 'Fast restoration when your cooling fails',
      description: 'Same-day diagnostics for refrigerant leaks, frozen coils, failing compressors, and broken blower motors.',
      iconName: 'Snowflake',
      features: ['Same-Day Dispatch', 'Comprehensive Diagnostic Test', 'Refrigerant & Coil Repair', 'Written Upfront Pricing'],
      popular: true,
    },
    {
      id: 'heat-pump-installation',
      title: 'Heat Pump & System Installation',
      tagline: 'Modern high-efficiency cooling & heating',
      description: 'Professional sizing and installation of modern heat pumps and central AC systems with high SEER2 energy ratings.',
      iconName: 'Flame',
      features: ['Load Calculation Sizing', 'High SEER2 Efficiency', 'Warranty Protection', 'Old Unit Haul-Away'],
    },
    {
      id: 'seasonal-tuneup',
      title: 'Seasonal AC & Heating Tune-Up',
      tagline: 'Prevent costly summer breakdowns',
      description: 'Comprehensive 24-point inspection, coil cleaning, electrical safety checks, and thermostat calibration.',
      iconName: 'Zap',
      features: ['24-Point Inspection', 'Electrical & Capacitor Check', 'Condensate Drain Flush', 'Filter Replacement'],
    },
    {
      id: 'duct-air-quality',
      title: 'Air Quality & Duct Services',
      tagline: 'Breathe cleaner air in every room',
      description: 'Air duct sanitization, UV air purifiers, and filtration upgrades to eliminate dust, allergens, and humidity issues.',
      iconName: 'Droplets',
      features: ['Duct Leak Inspection', 'HEPA Filtration Upgrades', 'UV Purifier Installation', 'Humidity Balance'],
    },
  ],

  whyUsItems: [
    { title: 'Upfront Flat-Rate Pricing', description: 'Clear written estimate before any work begins. Zero surprise travel charges or hidden fees.' },
    { title: '24/7 Same-Day Emergency Dispatch', description: 'Technicians on call around the clock with fully stocked trucks ready to solve issues in one visit.' },
    { title: 'Licensed & EPA-Certified Technicians', description: 'Experienced, background-checked master technicians backed by our 100% satisfaction guarantee.' },
  ],

  faqs: [
    {
      question: 'How quickly can a technician reach my home in Dallas-Fort Worth?',
      answer: 'For emergency calls, we typically dispatch a local technician to your location within 60 to 90 minutes. For standard appointments, we offer convenient 2-hour arrival windows.',
    },
    {
      question: 'Do you provide written estimates before starting work?',
      answer: 'Yes, always. We diagnose the issue, explain the options in plain language, and give you a guaranteed flat-rate price before turning a single wrench.',
    },
    {
      question: 'What should I do if my AC is blowing warm air or freezing up?',
      answer: 'Turn the thermostat off immediately to prevent compressor burnout, check your air filter, and submit an emergency enquiry or call us at (555) 247-4822.',
    },
  ],

  testimonials: [
    {
      id: 'test-1',
      author: 'Marcus Vance',
      location: 'Dallas, TX',
      service: 'Emergency AC Repair',
      rating: 5,
      comment: 'Our AC gave out during a 102-degree weekend. Apex had a technician at our home in under an hour, replaced the capacitor, and had cold air pumping before dinner. Outstanding service!',
      verified: true,
      date: '2026-08-14',
    },
    {
      id: 'test-2',
      author: 'Elena Rostova',
      location: 'Plano, TX',
      service: 'AC Diagnostics & Repair',
      rating: 5,
      comment: 'Upfront pricing and honest advice. They could have tried to sell me a whole new unit, but they fixed a simple leak and saved me thousands. Will recommend them to everyone.',
      verified: true,
      date: '2026-09-02',
    },
  ],
  stats: [
    { label: 'Happy DFW Clients', value: '4,800+', sublabel: 'Across North Texas' },
    { label: 'Average Response Time', value: '45 Min', sublabel: 'Emergency Dispatch' },
    { label: 'Customer Rating', value: '4.9 ★', sublabel: 'Over 380+ Reviews' },
    { label: 'Workmanship Warranty', value: '1 Year', sublabel: 'Parts & Labor' },
  ],
  trustBadges: [
    { title: 'Licensed & Insured', subtitle: 'TDLR License #74921', icon: 'ShieldCheck' },
    { title: 'Upfront Pricing', subtitle: 'No Surprise Invoices', icon: 'DollarSign' },
    { title: '24/7 Availability', subtitle: 'Day, Night & Weekends', icon: 'Clock' },
  ],
  beforeAfter: [],

  heroTrustBadgesEnabled: true,
  footerEmergencyEnabled: true,
  sampleDataNoticeEnabled: true,
  financingEnabled: false,
  hasEmergencyService: true,
};

export const CLIENT_PRESETS: Record<string, ClientConfig> = {
  'demo-hvac': APEX_HVAC_CLIENT_CONFIG,
  'client-apex-hvac': APEX_HVAC_CLIENT_CONFIG,
  'demo-tarot': DEMO_CLIENT_CONFIG,
};

