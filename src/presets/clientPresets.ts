import { ClientConfig } from '../types';

export const DEMO_CLIENT_CONFIG: ClientConfig = {
  clientId: 'demo-tarot-kochi',
  leadSource: 'Google Business Profile / Online Demo',
  googleBusinessProfileUrl: 'https://example.com',
  businessPhone: '+91 90000 00000',
  serviceArea: 'Kochi, Kerala & Online',

  industry: 'Tarot Coaching',
  businessName: 'Tarot Coaching & Guidance',
  websiteUrl: 'https://example.com',
  tagline: 'Personal Guidance & Tarot Coaching Services',
  footerDescription: 'Personal Guidance & Tarot Coaching Services',
  heroTitle: 'Personal Guidance & Tarot Coaching',
  heroSubheadline: 'Insightful tarot reading and coaching sessions for personal growth, career clarity, and relationship guidance.',
  heroStatusText: 'Online & In-Person Sessions Available',
  heroSecondaryCtaText: 'Request Guidance',
  leadFormStatusText: 'SESSIONS AVAILABLE',
  leadFormTrustText: '🔒 Your information is private and never shared.',
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
  formEndpoint: ((import.meta as any).env?.VITE_FORM_ENDPOINT_TAROT || (import.meta as any).env?.VITE_FORM_ENDPOINT || '').trim(),
  googleAnalyticsId: '',
  facebookPixelId: '',
  googleTagManagerId: '',

  socialLinks: {},

  seo: {
    title: 'Tarot Coaching & Guidance | Personal Tarot & Life Guidance in Kochi',
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
  formEndpoint: ((import.meta as any).env?.VITE_FORM_ENDPOINT_APEX || '').trim(),
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

/**
 * Example Preset 1: Skin & Aesthetic Clinic (Example with placeholder details)
 * Isolated from Tarot and HVAC; formEndpoint left unconfigured.
 */
export const DEMO_SKIN_CLINIC_CONFIG: ClientConfig = {
  clientId: 'demo-skin-clinic',
  leadSource: 'Google Search / Local Medical Directory [Example]',
  googleBusinessProfileUrl: 'https://example.com/gbp-skin-clinic',
  businessPhone: '+1 (555) 019-3388 [Placeholder]',
  serviceArea: 'Austin Metro & Surrounding Areas [Placeholder]',

  industry: 'Medical Aesthetics & Skincare',
  businessName: 'GlowAura Skin & Aesthetic Clinic [Example]',
  websiteUrl: 'https://example.com/glowaura-skin',
  tagline: 'Advanced Clinical Dermatology & Aesthetic Skin Treatments',
  footerDescription: 'Doctor-supervised medical aesthetics, laser skin rejuvenation, and bespoke facial treatments.',
  heroTitle: 'Radiant Skin Starts with Clinical Precision',
  heroSubheadline: 'Board-supervised aesthetic treatments, advanced laser therapy, and personalized dermatology consultations tailored to your skin goals.',
  heroStatusText: 'New Client Consultations Available This Week',
  heroSecondaryCtaText: 'View Treatment Menu',
  leadFormStatusText: 'CONSULTATIONS OPEN',
  leadFormTrustText: '🔒 Strict medical privacy. Your contact details are never shared.',
  finalCtaHeading: 'Book Your Private Skin Assessment',
  finalCtaDescription: 'Consult with our certified aesthetic practitioners for a personalized skin health regimen.',
  finalCtaButtonText: 'Request Consultation',
  servicesEyebrow: 'CLINICAL TREATMENT MENU',
  servicesHeading: 'Advanced Aesthetic & Dermatological Care',
  servicesDescription: 'Science-backed treatments delivered by licensed medical aestheticians using FDA-cleared technology.',
  whyUsHeading: 'Why Discerning Patients Choose GlowAura',
  serviceAreaHeading: 'Serving Austin & Surrounding Communities',
  serviceAreaDescription: 'Convenient clinical suites with private treatment rooms and state-of-the-art dermatological equipment.',
  yearsInBusiness: 6,
  jobsCompleted: '3,200+',
  averageRating: 4.9,
  reviewCount: 240,

  phone: '+1 (555) 019-3388 [Placeholder]',
  phoneRaw: '+15550193388',
  email: 'appointments@glowaura-example.com [Placeholder]',
  address: 'Suite 200, 742 Evergreen Medical Park [Placeholder]',
  cityStateZip: 'Austin, TX 78701 [Placeholder]',
  businessHours: 'Tue-Sat: 9:00 AM - 6:00 PM',
  emergencyAvailability: '',
  whatsAppNumber: '+15550193388',
  defaultCountryCode: '+1',
  whatsAppMessageTemplate: 'Hi {name}, thank you for inquiring with {businessName} regarding our {service}. When would be an ideal day for your private consultation?',

  primaryColor: '#881337', // Elegant deep rose / wine
  accentColor: '#D97706',  // Warm champagne gold
  fontFamily: 'Inter, sans-serif',
  logoUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&auto=format&fit=crop&q=80',
  aboutImageUrl: 'https://images.unsplash.com/photo-1512290900672-1f486a416a24?w=800&auto=format&fit=crop&q=80',

  googleMapsLink: 'https://maps.google.com/?q=Austin,TX',
  googleMapsEmbedUrl: '',
  googleReviewLink: '',
  googleBusinessProfileLink: '',
  formEndpoint: '', // Unconfigured placeholder: does not connect to any client's Google Sheet
  googleAnalyticsId: '',
  facebookPixelId: '',
  googleTagManagerId: '',

  socialLinks: {},

  seo: {
    title: 'GlowAura Skin & Aesthetic Clinic | Austin Skincare & Laser Treatments',
    metaDescription: 'Doctor-supervised aesthetic skin treatments, hydrafacials, chemical peels, and laser rejuvenation in Austin, TX.',
    keywords: ['Skin clinic', 'Aesthetic treatments', 'Hydrafacial Austin', 'Laser skin rejuvenation', 'Chemical peel'],
    ogImageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&auto=format&fit=crop&q=80',
    canonicalUrl: '',
  },

  serviceAreas: ['Central Austin', 'Westlake Hills', 'Downtown Austin', 'Domain / North Austin', 'Lakeway', 'Round Rock'],

  services: [
    {
      id: 'hydrafacial-deluxe',
      title: 'HydraFacial & Deep Pore Infusion',
      tagline: 'Deep cleanse, extract & hydrate',
      description: 'Patented vortex technology dislodges impurities while drenching skin with potent peptides and hyaluronic acid.',
      iconName: 'Sparkles',
      features: ['Lymphatic Drainage', 'Vortex Deep Cleansing', 'Targeted Booster Serum', 'LED Light Therapy'],
      popular: true,
    },
    {
      id: 'medical-chemical-peel',
      title: 'Clinical Peels & Pigment Correction',
      tagline: 'Resurface tone & texture',
      description: 'Custom-compounded peel solutions addressing melasma, sun damage, and acne scarring under clinical supervision.',
      iconName: 'ShieldCheck',
      features: ['Skin Type Diagnostic', 'Custom Acid Blends', 'Post-Treatment Soothing', 'At-Home Barrier Kit'],
    },
    {
      id: 'laser-skin-therapy',
      title: 'Laser Skin Rejuvenation & Collagen Renewal',
      tagline: 'Firmness & fine line reduction',
      description: 'Non-ablative fractional laser treatment that stimulates natural dermal collagen production with minimal downtime.',
      iconName: 'Activity',
      features: ['Collagen Stimulation', 'Pore Refinement', 'Tone Evening', 'Cryo-Cooling Comfort'],
    },
    {
      id: 'comprehensive-consultation',
      title: 'Comprehensive Skin Analysis & Regimen Design',
      tagline: 'In-depth diagnostic assessment',
      description: 'Digital skin imaging consultation mapping hydration, sun damage, and cellular health to formulate a medical-grade care plan.',
      iconName: 'Search',
      features: ['Digital Skin Scan', 'Practitioner Consultation', 'Ingredient Audit', 'Custom Protocol'],
    },
  ],

  whyUsItems: [
    { title: 'Doctor-Supervised Practice', description: 'Every aesthetic protocol is overseen by licensed medical dermatologists for safety and efficacy.' },
    { title: 'FDA-Cleared Technology', description: 'We invest exclusively in gold-standard, clinical-grade laser and infusion equipment.' },
    { title: 'Bespoke Patient Protocols', description: 'No cookie-cutter routines—every treatment plan is customized for your individual skin barrier.' },
  ],

  trustBadges: [
    { title: 'Licensed Practitioners', subtitle: 'Board-Certified Aesthetics', icon: 'Award' },
    { title: 'Medical-Grade Standards', subtitle: 'Hospital-Level Sterilization', icon: 'ShieldCheck' },
    { title: 'FDA-Cleared Devices', subtitle: 'Proven Clinical Outcomes', icon: 'Sparkles' },
  ],

  faqs: [
    {
      question: 'Is there downtime after a HydraFacial or Peel?',
      answer: 'HydraFacials have zero downtime—you leave with instant radiance. Clinical peels may produce mild flaking for 2 to 4 days, which is easily managed with our post-procedure barrier balm.',
    },
    {
      question: 'How do I know which aesthetic treatment is right for me?',
      answer: 'We recommend booking a Comprehensive Skin Analysis first. Our practitioners examine your skin beneath specialized imaging to tailor the ideal treatment pathway.',
    },
    {
      question: 'Are your treatments safe for sensitive or acne-prone skin?',
      answer: 'Yes. Our clinical formulations are carefully selected to calm reactive barriers, reduce inflammation, and accelerate healing.',
    },
  ],

  testimonials: [
    {
      id: 'test-skin-1',
      author: 'Sophia Chen',
      location: 'Austin, TX',
      service: 'HydraFacial Deluxe',
      rating: 5,
      comment: 'My skin has never felt clearer or more radiant. The staff took the time to explain every step and recommended products that transformed my barrier.',
      verified: true,
      date: '2026-09-12',
    },
    {
      id: 'test-skin-2',
      author: 'Claire Morales',
      location: 'Westlake, TX',
      service: 'Pigment Correction Peel',
      rating: 5,
      comment: 'Noticeable reduction in sun spots within two sessions. Extremely professional medical setting and zero discomfort.',
      verified: true,
      date: '2026-10-04',
    },
  ],

  stats: [
    { label: 'Patient Procedures', value: '3,200+', sublabel: 'Clinical Treatments' },
    { label: 'Patient Satisfaction', value: '99%', sublabel: 'Post-Care Survey' },
    { label: 'Google Rating', value: '4.9 ★', sublabel: 'Over 240+ Reviews' },
    { label: 'Clinical Experience', value: '12+ Yrs', sublabel: 'Combined Medical Team' },
  ],

  beforeAfter: [],
  heroTrustBadgesEnabled: true,
  footerEmergencyEnabled: false,
  sampleDataNoticeEnabled: true,
  financingEnabled: false,
  hasEmergencyService: false,
};

/**
 * Example Preset 2: General Local Service Business (Example with placeholder details)
 * Isolated from Tarot and HVAC; formEndpoint left unconfigured.
 */
export const DEMO_LOCAL_SERVICE_CONFIG: ClientConfig = {
  clientId: 'demo-local-service',
  leadSource: 'Google Search / Local Business Profile [Example]',
  googleBusinessProfileUrl: 'https://example.com/gbp-local-service',
  businessPhone: '+1 (555) 018-7744 [Placeholder]',
  serviceArea: 'Denver Metro & Front Range [Placeholder]',

  industry: 'Home Maintenance & Repair',
  businessName: 'PrimePoint Local Home Services [Example]',
  websiteUrl: 'https://example.com/primepoint-services',
  tagline: 'Reliable Local Home Maintenance & System Diagnostics',
  footerDescription: 'Licensed, bonded home service specialists providing upfront pricing and dependable workmanship.',
  heroTitle: 'Prompt, Reliable Home Maintenance & Repairs',
  heroSubheadline: 'Certified local technicians providing upfront pricing, fast arrival windows, and guaranteed workmanship on every home project.',
  heroStatusText: 'Technicians On Duty • Same-Day Service Available',
  heroSecondaryCtaText: 'Explore Service Options',
  leadFormStatusText: 'FAST RESPONSE DISPATCH',
  leadFormTrustText: '🔒 Guaranteed upfront quote before any work begins.',
  finalCtaHeading: 'Schedule Your Home Service Visit',
  finalCtaDescription: 'Tell us what needs attention and our dispatch team will confirm your preferred service window.',
  finalCtaButtonText: 'Book Service Call',
  servicesEyebrow: 'WHAT WE DO',
  servicesHeading: 'Dependable Residential Services',
  servicesDescription: 'From urgent troubleshooting to scheduled preventative maintenance, we keep your home running smoothly.',
  whyUsHeading: 'Why Local Homeowners Trust PrimePoint',
  serviceAreaHeading: 'Serving Denver Metro Communities',
  serviceAreaDescription: 'Local service vehicles stationed across the metro area for rapid dispatch and on-time arrivals.',
  yearsInBusiness: 8,
  jobsCompleted: '5,400+',
  averageRating: 4.8,
  reviewCount: 310,

  phone: '+1 (555) 018-7744 [Placeholder]',
  phoneRaw: '+15550187744',
  email: 'service@primepoint-example.com [Placeholder]',
  address: '1204 Commerce Way [Placeholder]',
  cityStateZip: 'Denver, CO 80202 [Placeholder]',
  businessHours: 'Mon-Sat: 7:30 AM - 6:30 PM',
  emergencyAvailability: '24/7 Emergency Dispatch Available',
  whatsAppNumber: '+15550187744',
  defaultCountryCode: '+1',
  whatsAppMessageTemplate: 'Hi {name}, thank you for reaching out to {businessName} regarding your request for {service}. When is the best time for our technician to inspect?',

  primaryColor: '#0F172A', // Slate dark navy
  accentColor: '#0284C7',  // Vibrant sky blue
  fontFamily: 'Inter, sans-serif',
  logoUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop&q=80',
  aboutImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',

  googleMapsLink: 'https://maps.google.com/?q=Denver,CO',
  googleMapsEmbedUrl: '',
  googleReviewLink: '',
  googleBusinessProfileLink: '',
  formEndpoint: '', // Unconfigured placeholder: does not connect to any client's Google Sheet
  googleAnalyticsId: '',
  facebookPixelId: '',
  googleTagManagerId: '',

  socialLinks: {},

  seo: {
    title: 'PrimePoint Local Home Services | Denver Maintenance & Repairs',
    metaDescription: 'Trusted residential home maintenance, diagnostics, and repairs with guaranteed flat-rate pricing in Denver, CO.',
    keywords: ['Home maintenance', 'Local home repair', 'Denver home service', 'Handyman Denver', 'Upfront pricing'],
    ogImageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop&q=80',
    canonicalUrl: '',
  },

  serviceAreas: ['Downtown Denver', 'Cherry Creek', 'Lakewood', 'Aurora', 'Highlands Ranch', 'Centennial', 'Arvada'],

  services: [
    {
      id: 'diagnostic-inspection',
      title: 'Full System Diagnostic & Safety Inspection',
      tagline: 'Accurate problem identification',
      description: 'Comprehensive mechanical, electrical, or structural inspection with a written checklist and flat-rate repair plan.',
      iconName: 'Search',
      features: ['Multi-Point Inspection', 'Written Diagnostic Report', 'No-Pressure Recommendations', 'Guaranteed Pricing'],
      popular: true,
    },
    {
      id: 'emergency-repairs',
      title: 'Priority Home Repair & Troubleshooting',
      tagline: 'Rapid problem resolution',
      description: 'Fast dispatch for urgent residential issues including leaks, electrical faults, and fixture malfunctions.',
      iconName: 'Clock',
      features: ['Same-Day Scheduling', 'Fully Stocked Vans', 'Clean Workspace Promise', '1-Year Parts Warranty'],
    },
    {
      id: 'seasonal-tuneup',
      title: 'Preventative Maintenance & Seasonal Tune-Up',
      tagline: 'Extend home equipment life',
      description: 'Scheduled multi-point servicing to prevent costly unexpected failures and improve energy efficiency.',
      iconName: 'CheckCircle',
      features: ['Filter & Seal Check', 'Mechanical Lubrication', 'Performance Testing', 'Safety Compliance Audit'],
    },
    {
      id: 'fixture-installation',
      title: 'Fixture & Hardware Installation',
      tagline: 'Flawless upgrade execution',
      description: 'Professional replacement and secure mounting of residential fixtures, smart equipment, and utility connections.',
      iconName: 'Tool',
      features: ['Clean Code Compliance', 'Disposal of Old Hardware', 'Operational Demonstration', 'Workmanship Guarantee'],
    },
  ],

  whyUsItems: [
    { title: 'Guaranteed Flat-Rate Quotes', description: 'Written estimates provided before any tool is lifted. No surprise fees.' },
    { title: 'Background-Checked Technicians', description: 'Experienced, polite specialists who treat your residence with respect.' },
    { title: '1-Year Warranty on Work', description: 'We stand behind our craftsmanship with an ironclad 365-day satisfaction guarantee.' },
  ],

  trustBadges: [
    { title: 'Licensed & Insured', subtitle: 'Full Liability Coverage', icon: 'ShieldCheck' },
    { title: 'Upfront Flat Rates', subtitle: 'Zero Hidden Surcharges', icon: 'DollarSign' },
    { title: '1-Year Workmanship', subtitle: 'Guaranteed Repairs', icon: 'Award' },
  ],

  faqs: [
    {
      question: 'Do you charge a diagnostic or service call fee?',
      answer: 'Our transparent diagnostic fee covers the technician dispatch and thorough multi-point inspection. If you proceed with the recommended repair, that fee is credited directly toward your service.',
    },
    {
      question: 'How quickly can a technician arrive at my home?',
      answer: 'We offer flexible 2-hour arrival windows with 30-minute advance courtesy calls. Priority same-day visits are available for urgent repairs.',
    },
    {
      question: 'Are all your technicians licensed and insured?',
      answer: 'Yes, every technician on our team is fully licensed, insured, and background-vetted for your total peace of mind.',
    },
  ],

  testimonials: [
    {
      id: 'test-local-1',
      author: 'David Kowalski',
      location: 'Denver, CO',
      service: 'Diagnostic Inspection',
      rating: 5,
      comment: 'Tech arrived right on time, explained exactly what was causing our issue, and fixed it within an hour. Upfront price was exactly what we paid.',
      verified: true,
      date: '2026-08-20',
    },
    {
      id: 'test-local-2',
      author: 'Amanda Sterling',
      location: 'Lakewood, CO',
      service: 'Fixture Installation',
      rating: 5,
      comment: 'Very professional, clean, and knowledgeable. PrimePoint is our go-to home maintenance team now.',
      verified: true,
      date: '2026-09-15',
    },
  ],

  stats: [
    { label: 'Completed Jobs', value: '5,400+', sublabel: 'Across Front Range' },
    { label: 'On-Time Arrival', value: '98%', sublabel: 'With Courtesy Call' },
    { label: 'Average Rating', value: '4.8 ★', sublabel: '310+ Verified Reviews' },
    { label: 'Warranty Duration', value: '1 Full Year', sublabel: 'Parts & Workmanship' },
  ],

  beforeAfter: [],
  heroTrustBadgesEnabled: true,
  footerEmergencyEnabled: true,
  sampleDataNoticeEnabled: true,
  financingEnabled: false,
  hasEmergencyService: true,
};

export const CLIENT_PRESETS: Record<string, ClientConfig> = {
  'demo-tarot-kochi': DEMO_CLIENT_CONFIG,
  'demo-tarot': DEMO_CLIENT_CONFIG,
  'client-apex-hvac': APEX_HVAC_CLIENT_CONFIG,
  'demo-hvac': APEX_HVAC_CLIENT_CONFIG,
  'demo-skin-clinic': DEMO_SKIN_CLINIC_CONFIG,
  'demo-local-service': DEMO_LOCAL_SERVICE_CONFIG,
};


