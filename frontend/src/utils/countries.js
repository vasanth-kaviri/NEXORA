/**
 * Shared country code data used across auth and profile forms.
 * Each entry contains: name, dial code, flag emoji, and maxLength for phone validation.
 */
export const COUNTRY_CODES = [
  { name: 'United States', code: '+1',  flag: '🇺🇸', maxLength: 10 },
  { name: 'India',         code: '+91', flag: '🇮🇳', maxLength: 10 },
  { name: 'United Kingdom',code: '+44', flag: '🇬🇧', maxLength: 11 },
  { name: 'Australia',     code: '+61', flag: '🇦🇺', maxLength: 9  },
  { name: 'Canada',        code: '+1',  flag: '🇨🇦', maxLength: 10 },
  { name: 'Germany',       code: '+49', flag: '🇩🇪', maxLength: 11 },
  { name: 'France',        code: '+33', flag: '🇫🇷', maxLength: 9  },
  { name: 'Japan',         code: '+81', flag: '🇯🇵', maxLength: 10 },
  { name: 'China',         code: '+86', flag: '🇨🇳', maxLength: 11 },
];
