import { ClientConfig } from '../types';

export const INDUSTRY_PRESETS: Record<string, ClientConfig> = {
  hvac: {
    clientId: 'preset-hvac',
    leadSource: 'Google Search / Local Directory',
    googleBusinessProfileUrl: '',
    businessPhone: '',
    serviceArea: '',

    industry: 'HVAC - Heating & Air Conditioning',
    businessName: 'Air Conditioning & Heating Services',
    tagline: 'Professional Heating & Cooling Solutions',
    heroTitle: 'Reliable AC & Heating Repair & Maintenance',
    heroSubheadline: 'Expert technicians for all your cooling, heating, and air quality needs. Upfront pricing and quality service.',
    yearsInBusiness: 0,
    jobsCompleted: '',
    averageRating: 0,
    reviewCount: 0,

    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    cityStateZip: '',
    businessHours: 'Mon-Sun: 8:00 AM - 8:00 PM',
    emergencyAvailability: '',
    whatsAppNumber: '',

    primaryColor: '#0F172A',
    accentColor: '#2563EB',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
    aboutImageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&auto=format&fit=crop&q=80',

    googleMapsLink: '',
    googleMapsEmbedUrl: '',
    googleReviewLink: '',
    googleBusinessProfileLink: '',
    formEndpoint: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',

    socialLinks: {},

    seo: {
      title: 'Air Conditioning & Heating Services',
      metaDescription: 'Professional HVAC repair, maintenance, and installation.',
      keywords: ['HVAC repair', 'AC service', 'Heating maintenance'],
      ogImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
      canonicalUrl: '',
    },

    serviceAreas: [],
    stats: [],
    testimonials: [],
    beforeAfter: [],
    financingEnabled: false,
    hasEmergencyService: true,

    whyUsItems: [
      { title: 'Upfront Flat-Rate Pricing', description: 'Written price estimates provided before work begins with zero hidden charges.' },
      { title: 'Prompt & Reliable Service', description: 'Fast response times and dedicated service for all your heating and cooling needs.' },
      { title: 'Licensed & Certified Professionals', description: 'Experienced technicians committed to quality workmanship and safety.' },
    ],

    trustBadges: [
      { title: 'Licensed & Certified', subtitle: 'Qualified Technical Team', icon: 'ShieldCheck' },
      { title: 'Upfront Pricing', subtitle: 'Clear Estimates First', icon: 'DollarSign' },
      { title: 'Quality Guaranteed', subtitle: 'Workmanship Warranty', icon: 'Award' },
    ],

    services: [
      {
        id: 'ac-repair',
        title: 'AC Repair & Troubleshooting',
        tagline: 'Restore your cooling fast',
        description: 'Comprehensive diagnostic and repair for split ACs, window units, and central cooling systems.',
        iconName: 'Snowflake',
        features: ['Diagnostic Inspection', 'Compressor & Fan Repair', 'Refrigerant Leak Fix', 'Prompt Service'],
        popular: true,
      },
      {
        id: 'ac-servicing',
        title: 'AC Servicing & Preventive Maintenance',
        tagline: 'Keep your cooling running efficiently',
        description: 'Preventative maintenance, coil cleaning, filter replacement, and system performance tuning.',
        iconName: 'Zap',
        features: ['Filter Cleaning & Replacement', 'Coil & Fin Cleaning', 'Performance Diagnostics', 'Energy Efficiency Check'],
      },
      {
        id: 'ac-install',
        title: 'AC Unit Installation & Upgrades',
        tagline: 'Energy-efficient cooling systems',
        description: 'Professional sizing and installation of modern, energy-efficient air conditioning systems.',
        iconName: 'Flame',
        features: ['In-Home Sizing Assessment', 'Brand & Capacity Options', 'Old Unit Haul-Away', 'System Testing'],
      },
      {
        id: 'indoor-air',
        title: 'Duct Cleaning & Indoor Air Quality',
        tagline: 'Breathe cleaner air',
        description: 'Air duct sanitization, air filter replacement, and indoor moisture management.',
        iconName: 'Wind',
        features: ['Duct Inspection', 'Air Purification Solutions', 'Allergen Reduction', 'Filter Replacement'],
      }
    ],

    faqs: [
      {
        question: 'Do you provide upfront pricing before starting work?',
        answer: 'Yes. We perform a diagnostic inspection and provide a clear, written estimate before starting any work.'
      },
      {
        question: 'What types of air conditioning units do you service?',
        answer: 'We service split air conditioners, ductless mini-splits, window units, and central HVAC systems.'
      },
      {
        question: 'How frequently should an AC unit be serviced?',
        answer: 'Regular servicing is recommended once or twice a year to maintain cooling efficiency and prevent unexpected breakdowns.'
      }
    ]
  },

  plumbing: {
    clientId: 'preset-plumbing',
    leadSource: 'Google Search / Local Directory',
    googleBusinessProfileUrl: '',
    businessPhone: '',
    serviceArea: '',

    industry: 'Plumbing & Drain Cleaning',
    businessName: 'Plumbing & Drain Services',
    tagline: 'Professional Plumbing Solutions',
    heroTitle: 'Fast & Reliable Local Plumbing & Drain Repair',
    heroSubheadline: 'Licensed plumbing professionals for drain clearing, pipe repairs, leak detection, and water heater servicing.',
    yearsInBusiness: 0,
    jobsCompleted: '',
    averageRating: 0,
    reviewCount: 0,

    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    cityStateZip: '',
    businessHours: 'Mon-Sun: 8:00 AM - 8:00 PM',
    emergencyAvailability: '',
    whatsAppNumber: '',

    primaryColor: '#0C4A6E',
    accentColor: '#0284C7',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&auto=format&fit=crop&q=80',
    aboutImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',

    googleMapsLink: '',
    googleMapsEmbedUrl: '',
    googleReviewLink: '',
    googleBusinessProfileLink: '',
    formEndpoint: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',

    socialLinks: {},

    seo: {
      title: 'Plumbing & Drain Services',
      metaDescription: 'Professional plumbing repairs, drain clearing, and leak detection.',
      keywords: ['Plumbing', 'Drain cleaning', 'Leak detection'],
      ogImageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&auto=format&fit=crop&q=80',
      canonicalUrl: '',
    },

    serviceAreas: [],
    stats: [],
    testimonials: [],
    beforeAfter: [],
    financingEnabled: false,
    hasEmergencyService: true,

    whyUsItems: [
      { title: 'Transparent Upfront Pricing', description: 'Know the cost before work starts with no unexpected charges.' },
      { title: 'Prompt Local Response', description: 'Quick, dependable scheduling for urgent plumbing needs.' },
      { title: 'Qualified Plumbers', description: 'Equipped with modern tools and camera inspection gear.' },
    ],

    trustBadges: [
      { title: 'Licensed Plumbers', subtitle: 'Certified Experts', icon: 'ShieldCheck' },
      { title: 'Upfront Pricing', subtitle: 'Clear Quotes First', icon: 'DollarSign' },
      { title: 'HD Camera Inspection', subtitle: 'Precision Diagnostics', icon: 'Video' },
    ],

    services: [
      {
        id: 'drain-cleaning',
        title: 'Drain & Sewer Clearing',
        tagline: 'Clear stubborn clogs effectively',
        description: 'Drain cleaning, blockage removal, and pipe inspection to keep water flowing smoothly.',
        iconName: 'Droplets',
        features: ['Camera Pipe Inspection', 'Rooter & Jetting Service', 'Clog Clearing', 'Preventative Advice'],
        popular: true,
      },
      {
        id: 'water-heaters',
        title: 'Water Heater Servicing & Repair',
        tagline: 'Reliable hot water supply',
        description: 'Servicing, maintenance, and replacement for standard tank and tankless water heaters.',
        iconName: 'Flame',
        features: ['Temperature & Pressure Checks', 'Tank Flushing', 'Element Replacement', 'New Unit Installation'],
      },
      {
        id: 'leak-detection',
        title: 'Pipe & Leak Repair',
        tagline: 'Locate and fix hidden water leaks',
        description: 'Non-destructive leak detection and pipe repairs for kitchens, bathrooms, and water lines.',
        iconName: 'Search',
        features: ['Acoustic & Pressure Testing', 'Pipe Patching & Replacement', 'Fixture Leak Repairs', 'Water Line Checks'],
      }
    ],

    faqs: [
      {
        question: 'What should I do if a water pipe starts leaking?',
        answer: 'Locate and turn off your main water valve to prevent water damage, then contact our service hotline.'
      },
      {
        question: 'Do you offer upfront estimates?',
        answer: 'Yes, we assess the problem on-site and provide an upfront price before any work begins.'
      }
    ]
  },

  roofing: {
    clientId: 'preset-roofing',
    leadSource: 'Google Search / Local Directory',
    googleBusinessProfileUrl: '',
    businessPhone: '',
    serviceArea: '',

    industry: 'Roofing & Construction',
    businessName: 'Roofing & Construction Services',
    tagline: 'Durable Roof Protection & Repairs',
    heroTitle: 'Quality Roofing Repairs & Roof Replacement',
    heroSubheadline: 'Experienced local roofing specialists for roof leaks, tile replacements, waterproofing, and new roof installations.',
    yearsInBusiness: 0,
    jobsCompleted: '',
    averageRating: 0,
    reviewCount: 0,

    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    cityStateZip: '',
    businessHours: 'Mon-Sat: 7:00 AM - 7:00 PM',
    emergencyAvailability: '',
    whatsAppNumber: '',

    primaryColor: '#1E293B',
    accentColor: '#DC2626',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80',
    aboutImageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',

    googleMapsLink: '',
    googleMapsEmbedUrl: '',
    googleReviewLink: '',
    googleBusinessProfileLink: '',
    formEndpoint: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',

    socialLinks: {},

    seo: {
      title: 'Roofing & Construction Services',
      metaDescription: 'Professional roof inspections, repairs, waterproofing, and replacements.',
      keywords: ['Roofing repair', 'Roof replacement', 'Waterproofing'],
      ogImageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80',
      canonicalUrl: '',
    },

    serviceAreas: [],
    stats: [],
    testimonials: [],
    beforeAfter: [],
    financingEnabled: false,
    hasEmergencyService: true,

    whyUsItems: [
      { title: 'Quality Materials', description: 'We use high-grade roofing products designed for lasting weather resistance.' },
      { title: 'Experienced Craftsmen', description: 'Skilled roofing contractors focused on safety and precision.' },
      { title: 'Detailed Inspections', description: 'Thorough roof assessment before recommending repairs or replacements.' },
    ],

    trustBadges: [
      { title: 'Licensed Roofers', subtitle: 'Certified & Insured', icon: 'ShieldCheck' },
      { title: 'Free Inspection', subtitle: 'Detailed Roof Assessment', icon: 'FileText' },
      { title: 'Warranty Protected', subtitle: 'Workmanship Guarantee', icon: 'Award' },
    ],

    services: [
      {
        id: 'roof-repair',
        title: 'Roof Leak Repair & Waterproofing',
        tagline: 'Stop water seepage fast',
        description: 'Locate and repair roof leaks, damaged tiles, flashing issues, and valley water infiltration.',
        iconName: 'CloudRain',
        features: ['Leak Assessment', 'Flashing Repair', 'Tile & Shingle Replacement', 'Waterproof Coating'],
        popular: true,
      },
      {
        id: 'roof-replacement',
        title: 'Full Roof Replacement',
        tagline: 'Long-lasting structural roof installations',
        description: 'Complete roof tear-off, underlayment installation, and new roofing materials for residential and commercial structures.',
        iconName: 'Home',
        features: ['Complete Roof Assessment', 'Quality Underlayment', 'Multiple Material Options', 'Cleanup & Haul-Away'],
      }
    ],

    faqs: [
      {
        question: 'How do I know if my roof needs a repair or full replacement?',
        answer: 'We conduct an on-site inspection to assess roof condition, age, and extent of damage before recommending repair or replacement.'
      }
    ]
  },

  electricians: {
    clientId: 'preset-electricians',
    leadSource: 'Google Search / Local Directory',
    googleBusinessProfileUrl: '',
    businessPhone: '',
    serviceArea: '',

    industry: 'Electrical Services',
    businessName: 'Electrical Services & Contracting',
    tagline: 'Safe & Certified Electrical Work',
    heroTitle: 'Certified Electrical Repairs, Wiring & Panel Upgrades',
    heroSubheadline: 'Licensed electrical contractors for residential wiring, breaker repairs, lighting installs, and safety inspections.',
    yearsInBusiness: 0,
    jobsCompleted: '',
    averageRating: 0,
    reviewCount: 0,

    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    cityStateZip: '',
    businessHours: 'Mon-Sun: 7:00 AM - 9:00 PM',
    emergencyAvailability: '',
    whatsAppNumber: '',

    primaryColor: '#18181B',
    accentColor: '#EAB308',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
    aboutImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',

    googleMapsLink: '',
    googleMapsEmbedUrl: '',
    googleReviewLink: '',
    googleBusinessProfileLink: '',
    formEndpoint: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',

    socialLinks: {},

    seo: {
      title: 'Electrical Services & Contracting',
      metaDescription: 'Professional electrical repairs, wiring, lighting, and panel upgrades.',
      keywords: ['Electrician', 'Electrical wiring', 'Panel upgrade'],
      ogImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
      canonicalUrl: '',
    },

    serviceAreas: [],
    stats: [],
    testimonials: [],
    beforeAfter: [],
    financingEnabled: false,
    hasEmergencyService: true,

    whyUsItems: [
      { title: 'Licensed Electricians', description: 'Trained and certified professionals focused on electrical safety.' },
      { title: 'Upfront Pricing', description: 'Clear estimates prior to beginning any electrical work.' },
      { title: 'Code Compliant Work', description: 'All installations and repairs adhere to safety standards.' },
    ],

    trustBadges: [
      { title: 'Licensed & Certified', subtitle: 'Electrical Safety First', icon: 'ShieldCheck' },
      { title: 'Code Compliant', subtitle: 'Standard Approved', icon: 'CheckCircle' },
      { title: 'Upfront Pricing', subtitle: 'Clear Quotes First', icon: 'DollarSign' },
    ],

    services: [
      {
        id: 'electrical-repair',
        title: 'Electrical Troubleshooting & Repairs',
        tagline: 'Fix tripping breakers & faulty outlets',
        description: 'Diagnostic inspection for power fluctuations, short circuits, switch repairs, and outlet replacements.',
        iconName: 'Zap',
        features: ['Circuit Diagnostics', 'Breaker Repair', 'GFCI Switch Installation', 'Safety Check'],
        popular: true,
      },
      {
        id: 'panel-upgrade',
        title: 'Distribution Panel Upgrades & Rewiring',
        tagline: 'Modernize home electrical capacity',
        description: 'Upgrade distribution boards, main breakers, and safety switches for high-demand modern electrical loads.',
        iconName: 'Zap',
        features: ['Main Breaker Replacement', 'Surge Protection', 'Load Balancing', 'Safety Inspection'],
      }
    ],

    faqs: [
      {
        question: 'Why does my circuit breaker keep tripping?',
        answer: 'Tripping breakers usually indicate an overloaded circuit, a short circuit, or a ground fault. Our electrician can safely diagnose the cause.'
      }
    ]
  },

  'garage-door': {
    clientId: 'preset-garage-door',
    leadSource: 'Google Search / Local Directory',
    googleBusinessProfileUrl: '',
    businessPhone: '',
    serviceArea: '',

    industry: 'Garage Door Repair & Service',
    businessName: 'Garage Door Services',
    tagline: 'Fast & Reliable Garage Door Solutions',
    heroTitle: 'Garage Door Repair, Spring Replacement & Openers',
    heroSubheadline: 'Professional garage door technicians for broken springs, off-track doors, opener installation, and safety tuning.',
    yearsInBusiness: 0,
    jobsCompleted: '',
    averageRating: 0,
    reviewCount: 0,

    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    cityStateZip: '',
    businessHours: 'Mon-Sun: 7:00 AM - 8:00 PM',
    emergencyAvailability: '',
    whatsAppNumber: '',

    primaryColor: '#111827',
    accentColor: '#F97316',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=1200&auto=format&fit=crop&q=80',
    aboutImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',

    googleMapsLink: '',
    googleMapsEmbedUrl: '',
    googleReviewLink: '',
    googleBusinessProfileLink: '',
    formEndpoint: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',

    socialLinks: {},

    seo: {
      title: 'Garage Door Services',
      metaDescription: 'Professional garage door spring repair, opener installation, and maintenance.',
      keywords: ['Garage door repair', 'Spring replacement', 'Door opener'],
      ogImageUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=1200&auto=format&fit=crop&q=80',
      canonicalUrl: '',
    },

    serviceAreas: [],
    stats: [],
    testimonials: [],
    beforeAfter: [],
    financingEnabled: false,
    hasEmergencyService: true,

    whyUsItems: [
      { title: 'Prompt Local Dispatch', description: 'Quick scheduling for stuck doors or broken springs.' },
      { title: 'Quality Replacement Parts', description: 'High-cycle springs, cables, and durable garage door openers.' },
      { title: 'Clear Estimates', description: 'Upfront quotes provided before starting repair work.' },
    ],

    trustBadges: [
      { title: 'Certified Technicians', subtitle: 'Door Specialists', icon: 'ShieldCheck' },
      { title: 'Quality Parts', subtitle: 'High Cycle Hardware', icon: 'Wrench' },
      { title: 'Upfront Pricing', subtitle: 'Clear Estimates First', icon: 'DollarSign' },
    ],

    services: [
      {
        id: 'spring-repair',
        title: 'Broken Spring & Cable Replacement',
        tagline: 'Safely restore door balance',
        description: 'Safe removal and replacement of high-tension torsion or extension springs and frayed steel cables.',
        iconName: 'Wrench',
        features: ['High-Cycle Springs', 'Cable Replacement', 'Door Balance Testing', 'Track Alignment'],
        popular: true,
      },
      {
        id: 'opener-install',
        title: 'Automatic Garage Door Opener Installation',
        tagline: 'Smooth, quiet motorized operation',
        description: 'Installation and repair of belt-drive, chain-drive, and smart phone enabled garage door openers.',
        iconName: 'Zap',
        features: ['Smart Opener Setup', 'Safety Sensor Adjustment', 'Remote Control Pairing', 'Quiet Belt Drives'],
      }
    ],

    faqs: [
      {
        question: 'Can I replace a broken garage door spring myself?',
        answer: 'Garage door springs operate under intense tension and can be dangerous to replace without specialized tools and training.'
      }
    ]
  },

  locksmith: {
    clientId: 'preset-locksmith',
    leadSource: 'Google Search / Local Directory',
    googleBusinessProfileUrl: '',
    businessPhone: '',
    serviceArea: '',

    industry: 'Locksmith & Security Services',
    businessName: 'Locksmith & Security Services',
    tagline: 'Fast Local Locksmith Solutions',
    heroTitle: 'Mobile Locksmith, Lock Replacement & Key Services',
    heroSubheadline: 'Professional mobile locksmiths for home, commercial, and vehicle lockouts, lock rekeying, and smart locks.',
    yearsInBusiness: 0,
    jobsCompleted: '',
    averageRating: 0,
    reviewCount: 0,

    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    cityStateZip: '',
    businessHours: 'Mon-Sun: 24 Hours',
    emergencyAvailability: '',
    whatsAppNumber: '',

    primaryColor: '#0284C7',
    accentColor: '#10B981',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=1200&auto=format&fit=crop&q=80',
    aboutImageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',

    googleMapsLink: '',
    googleMapsEmbedUrl: '',
    googleReviewLink: '',
    googleBusinessProfileLink: '',
    formEndpoint: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',

    socialLinks: {},

    seo: {
      title: 'Locksmith & Security Services',
      metaDescription: 'Mobile locksmith services, lock rekeying, installation, and lockout assistance.',
      keywords: ['Locksmith', 'Lock rekeying', 'Mobile locksmith'],
      ogImageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=1200&auto=format&fit=crop&q=80',
      canonicalUrl: '',
    },

    serviceAreas: [],
    stats: [],
    testimonials: [],
    beforeAfter: [],
    financingEnabled: false,
    hasEmergencyService: true,

    whyUsItems: [
      { title: 'Mobile Service Vehicles', description: 'Equipped with key cutting and lock installation tools.' },
      { title: 'Transparent Quotes', description: 'Upfront estimate provided before any lockout or lock service begins.' },
      { title: 'Qualified Lock Technicians', description: 'Trained in non-destructive entry methods whenever possible.' },
    ],

    trustBadges: [
      { title: 'Licensed & Verified', subtitle: 'Security Specialist', icon: 'ShieldCheck' },
      { title: 'Mobile Units', subtitle: 'On-Site Lock Service', icon: 'Truck' },
      { title: 'Clear Estimates', subtitle: 'No Hidden Fees', icon: 'DollarSign' },
    ],

    services: [
      {
        id: 'lock-change',
        title: 'Lock Replacement & Rekeying',
        tagline: 'Secure your property',
        description: 'Change worn locks or rekey existing lock cylinders for new keys without replacing hardware.',
        iconName: 'Key',
        features: ['Cylinder Rekeying', 'High-Security Deadbolts', 'Smart Lock Setup', 'Master Keying'],
        popular: true,
      }
    ],

    faqs: [
      {
        question: 'What is the difference between rekeying and changing locks?',
        answer: 'Rekeying changes the internal pins of your existing lock so old keys no longer work. Replacing locks swaps out the entire door hardware.'
      }
    ]
  },

  'pest-control': {
    clientId: 'preset-pest-control',
    leadSource: 'Google Search / Local Directory',
    googleBusinessProfileUrl: '',
    businessPhone: '',
    serviceArea: '',

    industry: 'Pest Control Services',
    businessName: 'Pest Control & Extermination',
    tagline: 'Effective Pest Protection',
    heroTitle: 'Comprehensive Pest Control & Extermination Services',
    heroSubheadline: 'Professional pest control for insects, rodents, termites, and mosquitoes with safe application techniques.',
    yearsInBusiness: 0,
    jobsCompleted: '',
    averageRating: 0,
    reviewCount: 0,

    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    cityStateZip: '',
    businessHours: 'Mon-Sat: 8:00 AM - 6:00 PM',
    emergencyAvailability: '',
    whatsAppNumber: '',

    primaryColor: '#065F46',
    accentColor: '#059669',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=1200&auto=format&fit=crop&q=80',
    aboutImageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80',

    googleMapsLink: '',
    googleMapsEmbedUrl: '',
    googleReviewLink: '',
    googleBusinessProfileLink: '',
    formEndpoint: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',

    socialLinks: {},

    seo: {
      title: 'Pest Control Services',
      metaDescription: 'Targeted pest treatments for insects, rodents, and termites.',
      keywords: ['Pest control', 'Exterminator', 'Termite control'],
      ogImageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=1200&auto=format&fit=crop&q=80',
      canonicalUrl: '',
    },

    serviceAreas: [],
    stats: [],
    testimonials: [],
    beforeAfter: [],
    financingEnabled: false,
    hasEmergencyService: false,

    whyUsItems: [
      { title: 'Targeted Treatments', description: 'Effective pest management tailored to your property.' },
      { title: 'Family & Pet Conscious', description: 'Responsible application methods and products.' },
      { title: 'Preventative Plans', description: 'Seasonal maintenance options to keep pests away.' },
    ],

    trustBadges: [
      { title: 'Licensed Applicators', subtitle: 'Certified Pest Control', icon: 'ShieldCheck' },
      { title: 'Thorough Inspection', subtitle: 'Property Assessment', icon: 'Search' },
      { title: 'Satisfaction Guarantee', subtitle: 'Re-treatment Options', icon: 'Award' },
    ],

    services: [
      {
        id: 'pest-treatment',
        title: 'General Pest & Insect Treatment',
        tagline: 'Eliminate ants, roaches & spider issues',
        description: 'Detailed inspection and treatment for common household insects and entry point barrier protection.',
        iconName: 'ShieldCheck',
        features: ['Interior & Exterior Inspection', 'Barrier Treatment', 'Eco-Conscious Application', 'Preventative Advice'],
        popular: true,
      }
    ],

    faqs: [
      {
        question: 'Are your pest control treatments safe for pets and children?',
        answer: 'We use application methods following safety guidelines. We provide clear instructions regarding drying times and access.'
      }
    ]
  },

  landscaping: {
    clientId: 'preset-landscaping',
    leadSource: 'Google Search / Local Directory',
    googleBusinessProfileUrl: '',
    businessPhone: '',
    serviceArea: '',

    industry: 'Landscaping & Lawn Care',
    businessName: 'Landscaping & Lawn Care Services',
    tagline: 'Quality Outdoor & Lawn Care',
    heroTitle: 'Lawn Maintenance, Landscaping & Garden Services',
    heroSubheadline: 'Professional lawn care, grass cutting, garden maintenance, tree trimming, and landscape design.',
    yearsInBusiness: 0,
    jobsCompleted: '',
    averageRating: 0,
    reviewCount: 0,

    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    cityStateZip: '',
    businessHours: 'Mon-Sat: 7:00 AM - 6:00 PM',
    emergencyAvailability: '',
    whatsAppNumber: '',

    primaryColor: '#14532D',
    accentColor: '#16A34A',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1558904541-efa8c196b27d?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1558904541-efa8c196b27d?w=1200&auto=format&fit=crop&q=80',
    aboutImageUrl: 'https://images.unsplash.com/photo-1558904541-efa8c196b27d?w=800&auto=format&fit=crop&q=80',

    googleMapsLink: '',
    googleMapsEmbedUrl: '',
    googleReviewLink: '',
    googleBusinessProfileLink: '',
    formEndpoint: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',

    socialLinks: {},

    seo: {
      title: 'Landscaping & Lawn Care Services',
      metaDescription: 'Professional lawn mowing, garden maintenance, and landscaping design.',
      keywords: ['Lawn care', 'Landscaping', 'Garden maintenance'],
      ogImageUrl: 'https://images.unsplash.com/photo-1558904541-efa8c196b27d?w=1200&auto=format&fit=crop&q=80',
      canonicalUrl: '',
    },

    serviceAreas: [],
    stats: [],
    testimonials: [],
    beforeAfter: [],
    financingEnabled: false,
    hasEmergencyService: false,

    whyUsItems: [
      { title: 'Dependable Schedule', description: 'Timely maintenance visits for consistent curb appeal.' },
      { title: 'Quality Equipment', description: 'Well-maintained commercial mowers and trimming tools.' },
      { title: 'Custom Landscape Plans', description: 'Flexible maintenance packages suited to your lawn.' },
    ],

    trustBadges: [
      { title: 'Experienced Crew', subtitle: 'Lawn Care Professionals', icon: 'ShieldCheck' },
      { title: 'Clear Estimates', subtitle: 'Free On-Site Quotes', icon: 'DollarSign' },
      { title: 'Regular Maintenance', subtitle: 'Flexible Schedules', icon: 'Calendar' },
    ],

    services: [
      {
        id: 'lawn-mowing',
        title: 'Lawn Care & Grass Cutting',
        tagline: 'Neat, healthy lawn maintenance',
        description: 'Scheduled lawn mowing, edging, weed trimming, and lawn cleanup for residential properties.',
        iconName: 'Scissors',
        features: ['Scheduled Mowing', 'Precision Edging', 'Debris Cleanup', 'Fertilization Advice'],
        popular: true,
      }
    ],

    faqs: [
      {
        question: 'Do you offer recurring lawn maintenance schedules?',
        answer: 'Yes, we offer flexible weekly, bi-weekly, or monthly lawn maintenance plans.'
      }
    ]
  },

  cleaning: {
    clientId: 'preset-cleaning',
    leadSource: 'Google Search / Local Directory',
    googleBusinessProfileUrl: '',
    businessPhone: '',
    serviceArea: '',

    industry: 'Cleaning Services',
    businessName: 'Residential & Commercial Cleaning',
    tagline: 'Spotless Cleaning Services',
    heroTitle: 'Home, Office & Deep Cleaning Services',
    heroSubheadline: 'Professional cleaning teams for residential homes, deep cleaning, move-in/move-out cleaning, and commercial offices.',
    yearsInBusiness: 0,
    jobsCompleted: '',
    averageRating: 0,
    reviewCount: 0,

    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    cityStateZip: '',
    businessHours: 'Mon-Sat: 8:00 AM - 6:00 PM',
    emergencyAvailability: '',
    whatsAppNumber: '',

    primaryColor: '#0369A1',
    accentColor: '#0EA5E9',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80',
    aboutImageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',

    googleMapsLink: '',
    googleMapsEmbedUrl: '',
    googleReviewLink: '',
    googleBusinessProfileLink: '',
    formEndpoint: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',

    socialLinks: {},

    seo: {
      title: 'Residential & Commercial Cleaning',
      metaDescription: 'Professional house cleaning, deep cleaning, and office maintenance.',
      keywords: ['House cleaning', 'Office cleaning', 'Deep cleaning'],
      ogImageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80',
      canonicalUrl: '',
    },

    serviceAreas: [],
    stats: [],
    testimonials: [],
    beforeAfter: [],
    financingEnabled: false,
    hasEmergencyService: false,

    whyUsItems: [
      { title: 'Trained Cleaners', description: 'Vetted and experienced cleaning professionals.' },
      { title: 'Detailed Checklist', description: 'Comprehensive room-by-room cleaning standards.' },
      { title: 'Flexible Scheduling', description: 'One-time or recurring cleaning packages.' },
    ],

    trustBadges: [
      { title: 'Vetted Team', subtitle: 'Background Checked', icon: 'ShieldCheck' },
      { title: 'Detailed Cleaning', subtitle: 'Room Checklist', icon: 'CheckCircle' },
      { title: 'Clear Rates', subtitle: 'Upfront Quotes', icon: 'DollarSign' },
    ],

    services: [
      {
        id: 'house-cleaning',
        title: 'Residential House Cleaning',
        tagline: 'Clean, comfortable living spaces',
        description: 'Dusting, floor mopping, bathroom sanitization, kitchen cleaning, and general tidying.',
        iconName: 'Sparkles',
        features: ['Kitchen & Bathroom Sanitization', 'Dusting & Vacuuming', 'Trash Removal', 'Surface Wipedown'],
        popular: true,
      }
    ],

    faqs: [
      {
        question: 'Do I need to provide cleaning supplies and equipment?',
        answer: 'Our team comes fully equipped with cleaning products and equipment unless you request specific products to be used.'
      }
    ]
  },

  painting: {
    clientId: 'preset-painting',
    leadSource: 'Google Search / Local Directory',
    googleBusinessProfileUrl: '',
    businessPhone: '',
    serviceArea: '',

    industry: 'Painting Services',
    businessName: 'Interior & Exterior Painting',
    tagline: 'Quality Painting Solutions',
    heroTitle: 'Interior, Exterior & Cabinet Painting',
    heroSubheadline: 'Professional painters for homes and offices. Surface prep, wall priming, crisp lines, and premium paint finishes.',
    yearsInBusiness: 0,
    jobsCompleted: '',
    averageRating: 0,
    reviewCount: 0,

    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    cityStateZip: '',
    businessHours: 'Mon-Sat: 8:00 AM - 6:00 PM',
    emergencyAvailability: '',
    whatsAppNumber: '',

    primaryColor: '#312E81',
    accentColor: '#6366F1',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80',
    aboutImageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',

    googleMapsLink: '',
    googleMapsEmbedUrl: '',
    googleReviewLink: '',
    googleBusinessProfileLink: '',
    formEndpoint: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',

    socialLinks: {},

    seo: {
      title: 'Interior & Exterior Painting',
      metaDescription: 'Professional interior and exterior house painting services.',
      keywords: ['House painting', 'Interior painter', 'Exterior painter'],
      ogImageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80',
      canonicalUrl: '',
    },

    serviceAreas: [],
    stats: [],
    testimonials: [],
    beforeAfter: [],
    financingEnabled: false,
    hasEmergencyService: false,

    whyUsItems: [
      { title: 'Thorough Surface Prep', description: 'Sanding, patching, and priming for long-lasting paint adhesion.' },
      { title: 'Clean Work Environment', description: 'Furniture and floors protected with drop cloths and tape.' },
      { title: 'Upfront Pricing', description: 'Written estimates detailing labor and paint materials.' },
    ],

    trustBadges: [
      { title: 'Experienced Painters', subtitle: 'Detail Oriented', icon: 'ShieldCheck' },
      { title: 'Premium Paints', subtitle: 'Durable Finish', icon: 'CheckCircle' },
      { title: 'Clear Estimates', subtitle: 'No Hidden Costs', icon: 'DollarSign' },
    ],

    services: [
      {
        id: 'interior-painting',
        title: 'Interior House Painting',
        tagline: 'Refresh your indoor living spaces',
        description: 'Walls, ceilings, trim, doors, and cabinet repainting with clean lines and smooth finishes.',
        iconName: 'Palette',
        features: ['Wall Patching & Sanding', 'Primer Application', 'Two Coat Finish', 'Daily Workspace Cleanup'],
        popular: true,
      }
    ],

    faqs: [
      {
        question: 'Do you help with color selection and surface prep?',
        answer: 'Yes! We perform full surface preparation including patching small holes and priming before painting.'
      }
    ]
  },

  handyman: {
    clientId: 'preset-handyman',
    leadSource: 'Google Search / Local Directory',
    googleBusinessProfileUrl: '',
    businessPhone: '',
    serviceArea: '',

    industry: 'Handyman & Home Repair',
    businessName: 'Handyman & Home Repair Services',
    tagline: 'Versatile Home Repair Solutions',
    heroTitle: 'Home Maintenance, Fixture Mounting & Repairs',
    heroSubheadline: 'Reliable craftsman for home repairs, drywall patching, door fixes, furniture assembly, and fixture installations.',
    yearsInBusiness: 0,
    jobsCompleted: '',
    averageRating: 0,
    reviewCount: 0,

    phone: '',
    phoneRaw: '',
    email: '',
    address: '',
    cityStateZip: '',
    businessHours: 'Mon-Sat: 8:00 AM - 6:00 PM',
    emergencyAvailability: '',
    whatsAppNumber: '',

    primaryColor: '#27272A',
    accentColor: '#E11D48',
    fontFamily: 'Inter, sans-serif',
    logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
    aboutImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',

    googleMapsLink: '',
    googleMapsEmbedUrl: '',
    googleReviewLink: '',
    googleBusinessProfileLink: '',
    formEndpoint: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',

    socialLinks: {},

    seo: {
      title: 'Handyman & Home Repair Services',
      metaDescription: 'Reliable handyman services for home repairs, drywall, doors, and fixtures.',
      keywords: ['Handyman', 'Home repair', 'Fixture installation'],
      ogImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
      canonicalUrl: '',
    },

    serviceAreas: [],
    stats: [],
    testimonials: [],
    beforeAfter: [],
    financingEnabled: false,
    hasEmergencyService: false,

    whyUsItems: [
      { title: 'Versatile Repairs', description: 'One craftsman for multiple small home repairs.' },
      { title: 'Upfront Rates', description: 'Clear estimates provided prior to starting work.' },
      { title: 'Dependable Service', description: 'Punctual, friendly, and respectful of your home.' },
    ],

    trustBadges: [
      { title: 'Skilled Craftsman', subtitle: 'Versatile Repairs', icon: 'ShieldCheck' },
      { title: 'Upfront Rates', subtitle: 'Clear Pricing', icon: 'DollarSign' },
      { title: 'Quality Service', subtitle: 'Dependable Work', icon: 'CheckCircle' },
    ],

    services: [
      {
        id: 'home-repairs',
        title: 'General Home Maintenance & Repairs',
        tagline: 'Tackle your home to-do list',
        description: 'Drywall patching, door alignment, TV wall mounting, light fixture installation, and general carpentry.',
        iconName: 'Wrench',
        features: ['Drywall Hole Patching', 'TV Wall Mounting', 'Door & Lock Adjustments', 'Cabinet & Shelf Assembly'],
        popular: true,
      }
    ],

    faqs: [
      {
        question: 'Can you handle multiple small tasks in one visit?',
        answer: 'Yes! We encourage compiling a list of small home repair tasks so we can complete them during a single scheduled visit.'
      }
    ]
  }
};
