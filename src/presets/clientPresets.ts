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

export const CLIENT_PRESETS: Record<string, ClientConfig> = {
  'demo-tarot': DEMO_CLIENT_CONFIG,
};
