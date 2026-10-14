export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string; // Lucide icon name or CSS class
  features: string[];
  popular?: boolean;
}

export interface TestimonialItem {
  id: string;
  author: string;
  location: string;
  service: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  avatarUrl?: string;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  category: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface TrustBadge {
  title: string;
  subtitle: string;
  icon: string;
}

export interface StatItem {
  label: string;
  value: string;
  sublabel: string;
}

// LeadPilot Types
export type LeadStatus = 'New' | 'Contacted' | 'Follow-up' | 'Qualified' | 'Won' | 'Lost';
export type ContactMethod = 'Call' | 'WhatsApp' | 'SMS' | 'Email';

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  author?: string;
}

export interface LeadContactLog {
  id: string;
  method: ContactMethod;
  timestamp: string;
  notes?: string;
}

export interface LeadItem {
  id: string;              // Lead ID e.g. LP-20260809-0001
  timestamp: string;       // ISO string
  clientId: string;        // e.g. hvac-dallas-01
  businessName: string;    // e.g. Apex Air Conditioning & Heating
  name: string;            // Customer Name
  phone: string;           // Customer Phone
  email?: string;          // Customer Email (optional)
  service: string;         // Service Needed
  details: string;         // Service Details
  address: string;         // Service Address
  leadSource: string;      // e.g. Google Business Profile / Local Search
  pageUrl?: string;        // Landing page URL
  status: LeadStatus;      // Default: 'New'
  notes: LeadNote[];       // Array of notes
  followUpDate?: string;   // ISO string or YYYY-MM-DD string
  lastContacted?: string;  // ISO string
  lastContactMethod?: ContactMethod;
  contactCount: number;
  contactLogs?: LeadContactLog[];
}

export interface ClientConfig {
  // Local Lead Capture System Identifiers
  clientId?: string;               // Unique ID for client (e.g. 'client-hvac-dallas-01')
  leadSource?: string;             // Lead acquisition channel (e.g. 'Google Business Profile / Local Search')
  googleBusinessProfileUrl?: string; // Link to Google Business Profile page
  businessPhone?: string;          // Primary phone for business/dispatch
  serviceArea?: string;            // Primary service area summary (e.g. 'Dallas-Fort Worth Metro')
  formEndpoint?: string;           // Google Apps Script / Webhook URL for lead routing

  // Business Info
  industry: string;
  businessCategory?: string;
  businessName: string;
  websiteUrl?: string;
  tagline: string;
  heroTitle: string;
  heroSubheadline: string;
  yearsInBusiness: number;
  jobsCompleted: string;
  averageRating: number;
  reviewCount: number;

  // Contact Details
  phone: string;
  phoneRaw: string; // formatted for tel: link (e.g. 18005550199)
  email: string;
  address: string;
  cityStateZip: string;
  businessHours: string;
  emergencyAvailability: string;
  whatsAppNumber?: string;
  defaultCountryCode?: string; // e.g. '+91' or '91' for WhatsApp / SMS / Call handling
  whatsAppMessageTemplate?: string; // Pre-filled message template for WhatsApp (supports {name}, {businessName}, {service})

  // Colors & Branding
  primaryColor: string;   // e.g. #0F172A or #1E3A8A
  secondaryColor?: string; // e.g. #1E293B
  accentColor: string;    // e.g. #E11D48 or #F59E0B
  textColor?: string;     // e.g. #0F172A or #F8FAFC
  fontFamily: string;     // e.g. 'Inter', sans-serif
  logoUrl?: string;
  logo?: string;
  heroImageUrl: string;
  aboutImageUrl: string;

  // Links & Integrations
  googleMapsLink: string;
  googleMapsEmbedUrl: string;
  googleReviewLink: string;
  googleBusinessProfileLink?: string; // Legacy fallback
  googleAnalyticsId: string;
  facebookPixelId: string;
  googleTagManagerId: string;

  // Social Links
  socialLinks: {
    facebook?: string;
    instagram?: string;
    yelp?: string;
    google?: string;
  };

  // SEO
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
    ogImageUrl: string;
    canonicalUrl: string;
  };

  // Lists & Arrays
  serviceAreas: string[];
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  beforeAfter: BeforeAfterItem[];
  faqs: FaqItem[];
  trustBadges: TrustBadge[];
  stats: StatItem[];

  // Configurable Sections & Cards
  whyUsItems?: { title: string; description: string; icon?: string }[];
  financingEnabled?: boolean;
  financingTitle?: string;
  financingDescription?: string;
  financingCtaText?: string;
  hasEmergencyService?: boolean;
  heroTrustBadgesEnabled?: boolean;
  footerEmergencyEnabled?: boolean;
  sampleDataNoticeEnabled?: boolean;

  // Website Copy / Custom Content Editor Fields
  heroStatusText?: string;
  heroEyebrow?: string;
  heroTitleHighlight?: string;
  heroTitleEnd?: string;
  heroPrimaryCtaText?: string;
  heroSecondaryCtaText?: string;

  leadFormStatusText?: string;
  leadFormTrustText?: string;

  whyUsEyebrow?: string;
  whyUsHeading?: string;
  whyUsDescription?: string;

  servicesEyebrow?: string;
  servicesHeading?: string;
  servicesDescription?: string;

  emergencyHeading?: string;
  emergencyDescription?: string;
  emergencyCtaText?: string;

  reviewsEyebrow?: string;
  reviewsHeading?: string;
  reviewsDescription?: string;

  faqHeading?: string;

  serviceAreaHeading?: string;
  serviceAreaDescription?: string;

  finalCtaHeading?: string;
  finalCtaDescription?: string;
  finalCtaButtonText?: string;

  footerDescription?: string;
  footerCopyrightText?: string;
}
