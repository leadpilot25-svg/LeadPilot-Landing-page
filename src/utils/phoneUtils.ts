/**
 * Phone Number Utilities for LeadPilot CRM
 * Handles international country codes, Excel 10-digit number normalization,
 * and WhatsApp / Call / SMS link generation.
 */

export interface CountryCodeOption {
  code: string;         // e.g. "91"
  prefix: string;       // e.g. "+91"
  label: string;        // e.g. "India (+91)"
  flag: string;         // e.g. "🇮🇳"
  digitsLength: number; // e.g. 10
}

export const SUPPORTED_COUNTRY_CODES: CountryCodeOption[] = [
  { code: '91', prefix: '+91', label: 'India (+91)', flag: '🇮🇳', digitsLength: 10 },
  { code: '1', prefix: '+1', label: 'USA / Canada (+1)', flag: '🇺🇸', digitsLength: 10 },
  { code: '44', prefix: '+44', label: 'United Kingdom (+44)', flag: '🇬🇧', digitsLength: 10 },
  { code: '971', prefix: '+971', label: 'UAE (+971)', flag: '🇦🇪', digitsLength: 9 },
  { code: '966', prefix: '+966', label: 'Saudi Arabia (+966)', flag: '🇸🇦', digitsLength: 9 },
  { code: '61', prefix: '+61', label: 'Australia (+61)', flag: '🇦🇺', digitsLength: 9 },
  { code: '65', prefix: '+65', label: 'Singapore (+65)', flag: '🇸🇬', digitsLength: 8 },
  { code: '60', prefix: '+60', label: 'Malaysia (+60)', flag: '🇲🇾', digitsLength: 9 },
  { code: '880', prefix: '+880', label: 'Bangladesh (+880)', flag: '🇧🇩', digitsLength: 10 },
  { code: '92', prefix: '+92', label: 'Pakistan (+92)', flag: '🇵🇰', digitsLength: 10 },
];

/**
 * Clean all non-digit characters from string
 */
export function extractDigits(phone: any): string {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '');
}

/**
 * Detect the business's default country code from ClientConfig
 */
export function detectDefaultCountryCode(config?: any): string {
  if (!config) return '91';

  // 1. Explicit defaultCountryCode field
  if (config.defaultCountryCode) {
    const clean = extractDigits(config.defaultCountryCode);
    if (clean) return clean;
  }

  // 2. Check whatsAppNumber or phoneRaw or phone
  const candidate = (config.whatsAppNumber || config.phoneRaw || config.phone || config.businessPhone || '').toString().trim();
  if (candidate.startsWith('+')) {
    const digits = extractDigits(candidate);
    for (const opt of SUPPORTED_COUNTRY_CODES) {
      if (digits.startsWith(opt.code)) {
        return opt.code;
      }
    }
  }

  // 3. Check cityStateZip / serviceArea / address keywords
  const locationText = `${config.cityStateZip || ''} ${config.serviceArea || ''} ${config.address || ''}`.toLowerCase();
  if (
    locationText.includes('india') ||
    locationText.includes('kochi') ||
    locationText.includes('kerala') ||
    locationText.includes('delhi') ||
    locationText.includes('mumbai') ||
    locationText.includes('bangalore') ||
    locationText.includes('chennai')
  ) {
    return '91';
  }
  if (locationText.includes('uk') || locationText.includes('london') || locationText.includes('united kingdom')) {
    return '44';
  }
  if (locationText.includes('uae') || locationText.includes('dubai') || locationText.includes('abu dhabi')) {
    return '971';
  }

  // Default to 91 for this application
  return '91';
}

/**
 * Formats a phone number for WhatsApp wa.me links
 * Never hardcodes +1; uses the detected / selected country code for 10-digit numbers.
 */
export function formatPhoneForWhatsApp(phoneStr: string, fallbackCountryCode: string = '91'): string {
  if (!phoneStr) return '';
  const trimmed = phoneStr.trim();
  const digits = extractDigits(trimmed);
  if (!digits) return '';

  const cleanCountryCode = extractDigits(fallbackCountryCode) || '91';

<<<<<<< HEAD
  // If cleanCountryCode is 91 (India) and digits is 11 digits starting with '1' and 2nd digit is 6-9,
  // it was corrupted by the legacy '1' + 10-digit bug (e.g. 18484888584 -> 918484888584)
  if (cleanCountryCode === '91' && digits.length === 11 && digits.startsWith('1') && /^[6-9]/.test(digits.slice(1))) {
    return `91${digits.slice(1)}`;
  }

  // If 10 digits (standard Indian / domestic mobile number without country code)
=======
  // If number was entered with leading '+', it already includes an explicit country code
  if (trimmed.startsWith('+')) {
    return digits;
  }

  // If starts with '00' (international prefix)
  if (trimmed.startsWith('00') && digits.length > 10) {
    return digits.slice(2);
  }

  // If 10 digits (standard Indian / US mobile number without country code)
>>>>>>> 6e2776878caf3a8a9894b05fa83db753d6bd563e
  if (digits.length === 10) {
    return `${cleanCountryCode}${digits}`;
  }

  // If 11 digits starting with 0 (domestic trunk prefix, e.g. 08484888584 or 09847012345)
  if (digits.length === 11 && digits.startsWith('0')) {
    return `${cleanCountryCode}${digits.slice(1)}`;
  }

  // If 12 digits and starts with 91 (India with country code already)
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }

<<<<<<< HEAD
  // If starts with '00' (international prefix)
  if (trimmed.startsWith('00') && digits.length > 10) {
    return digits.slice(2);
  }

  // If number was entered with leading '+', preserve explicit international code (unless legacy corrupted +1 above)
  if (trimmed.startsWith('+')) {
    if (cleanCountryCode === '91' && trimmed.startsWith('+1') && digits.length === 11 && /^[6-9]/.test(digits.slice(1))) {
      return `91${digits.slice(1)}`;
    }
    return digits;
  }

  // If 11 digits and starts with 1 (USA with country code already)
  if (digits.length === 11 && digits.startsWith('1') && cleanCountryCode === '1') {
    return digits;
  }

  // Fallback: if already longer than 10, return digits
=======
  // If 11 digits and starts with 1 (USA with country code already)
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits;
  }

  // Fallback: if already longer than 10, likely already has country code
>>>>>>> 6e2776878caf3a8a9894b05fa83db753d6bd563e
  return digits;
}

/**
 * Formats phone number for human-readable display in CRM
 * e.g. "8484888584" with country code 91 -> "+91 84848 88584"
 */
export function formatDisplayPhone(phoneStr: string, fallbackCountryCode: string = '91'): string {
  if (!phoneStr) return '';
  const trimmed = phoneStr.trim();
<<<<<<< HEAD

  const cleanCc = extractDigits(fallbackCountryCode) || '91';
  let digits = extractDigits(trimmed);

  // Recover legacy corrupted +1 prefix for Indian numbers
  if (cleanCc === '91' && digits.length === 11 && digits.startsWith('1') && /^[6-9]/.test(digits.slice(1))) {
    digits = digits.slice(1);
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  if (trimmed.startsWith('+')) return trimmed;

=======
  if (trimmed.startsWith('+')) return trimmed;

  const digits = extractDigits(trimmed);
  const cleanCc = extractDigits(fallbackCountryCode) || '91';

>>>>>>> 6e2776878caf3a8a9894b05fa83db753d6bd563e
  if (digits.length === 10) {
    // Format as +91 84848 88584
    return `+${cleanCc} ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    const core = digits.slice(1);
    return `+${cleanCc} ${core.slice(0, 5)} ${core.slice(5)}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    const core = digits.slice(2);
    return `+91 ${core.slice(0, 5)} ${core.slice(5)}`;
  }

  return trimmed;
}

/**
 * Normalizes a phone number during Excel / CSV import to ensure country code is preserved
 */
export function normalizeImportedPhone(rawVal: any, selectedCountryCode: string = '91'): string {
  if (!rawVal) return '';
  const str = String(rawVal).trim();
  if (!str) return '';

  // If already starts with '+', keep the explicit international format
  if (str.startsWith('+')) {
    return str;
  }

  const digits = extractDigits(str);
  const cleanCc = extractDigits(selectedCountryCode) || '91';

  // 10-digit number -> format with chosen country code
  if (digits.length === 10) {
    return `+${cleanCc} ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // 11 digits starting with 0 -> strip 0 and prepend chosen country code
  if (digits.length === 11 && digits.startsWith('0')) {
    const core = digits.slice(1);
    return `+${cleanCc} ${core.slice(0, 5)} ${core.slice(5)}`;
  }

  // 12 digits starting with 91
  if (digits.length === 12 && digits.startsWith('91')) {
    const core = digits.slice(2);
    return `+91 ${core.slice(0, 5)} ${core.slice(5)}`;
  }

<<<<<<< HEAD
  // Recover legacy corrupted 1 prefix for Indian numbers
  if (cleanCc === '91' && digits.length === 11 && digits.startsWith('1') && /^[6-9]/.test(digits.slice(1))) {
    const core = digits.slice(1);
    return `+91 ${core.slice(0, 5)} ${core.slice(5)}`;
  }

  // 11 digits starting with 1 (US numbers only when country code is US/1)
  if (cleanCc === '1' && digits.length === 11 && digits.startsWith('1')) {
=======
  // 11 digits starting with 1
  if (digits.length === 11 && digits.startsWith('1')) {
>>>>>>> 6e2776878caf3a8a9894b05fa83db753d6bd563e
    const core = digits.slice(1);
    return `+1 ${core.slice(0, 3)} ${core.slice(3, 6)} ${core.slice(6)}`;
  }

  return str;
}
