// Utility to format dates across the website as: Date-Month-Year (e.g., 12-January-2026)
// Month name is full (January, February, March, etc.)

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

/**
 * Parses any incoming date string (YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, ISO string, etc.)
 * into a Date object safely.
 */
export function parseAnyDate(input: string | number | Date | null | undefined): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  if (typeof input === 'number') {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  const str = String(input).trim();
  if (!str || str.toLowerCase() === 'not scheduled' || str.toLowerCase() === 'pending' || str.toLowerCase() === 'just now') {
    return null;
  }

  // 1. Check DD-Month-YYYY or DD Month YYYY (e.g., 12-January-2026, 12 January 2026)
  const monthNameMatch = str.match(/^(\d{1,2})[-\s/]([a-zA-Z]+)[-\s/](\d{4})/);
  if (monthNameMatch) {
    const day = parseInt(monthNameMatch[1], 10);
    const mStr = monthNameMatch[2].toLowerCase();
    const year = parseInt(monthNameMatch[3], 10);
    const mIdx = MONTH_NAMES.findIndex(m => m.toLowerCase().startsWith(mStr.slice(0, 3)));
    if (mIdx !== -1 && day >= 1 && day <= 31) {
      return new Date(year, mIdx, day);
    }
  }

  // 2. Check DD-MM-YYYY or DD/MM/YYYY (e.g., 12-1-2026, 15/07/2026)
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    if (month >= 0 && month < 12 && day >= 1 && day <= 31) {
      return new Date(year, month, day);
    }
  }

  // 3. Check YYYY-MM-DD or YYYY/MM/DD (e.g., 2026-07-13, 2026-01-12)
  const ymdMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    if (month >= 0 && month < 12 && day >= 1 && day <= 31) {
      return new Date(year, month, day);
    }
  }

  // 4. Fallback to standard JS Date parser
  const fallback = new Date(str);
  if (!isNaN(fallback.getTime())) {
    return fallback;
  }

  return null;
}

/**
 * Formats a date into "DD-Month-YYYY" format (e.g., 12-January-2026).
 * Preserves non-date strings like "Not Scheduled", "Pending", etc.
 */
export function formatDisplayDate(input: string | number | Date | null | undefined): string {
  if (!input) return '';

  if (typeof input === 'string') {
    const str = input.trim();
    if (!str) return '';
    if (str.toLowerCase() === 'not scheduled' || str.toLowerCase() === 'pending' || str.toLowerCase() === 'just now') {
      return str;
    }

    // Handle comma-separated lists of dates (e.g. "2026-07-13 18:00-22:00, 2026-07-14 18:00-22:00")
    if (str.includes(',') && !str.includes('(')) {
      const parts = str.split(',').map(p => formatDisplayDate(p.trim()));
      return parts.join(', ');
    }

    // Check if time suffix exists (e.g., "2026-07-13 18:00-22:00" or "2026-07-13 (18:00-22:00)")
    const timeMatch = str.match(/\s+([0-9]{1,2}:[0-9]{2}.*)$/);
    if (timeMatch) {
      const datePart = str.substring(0, timeMatch.index).trim();
      const timePart = timeMatch[1].trim();
      const parsedDate = parseAnyDate(datePart);
      if (parsedDate) {
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = MONTH_NAMES[parsedDate.getMonth()];
        const year = parsedDate.getFullYear();
        return `${day}-${month}-${year} ${timePart}`;
      }
    }
  }

  const parsed = parseAnyDate(input);
  if (!parsed) {
    return typeof input === 'string' ? input : '';
  }

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[parsed.getMonth()];
  const year = parsed.getFullYear();

  return `${day}-${month}-${year}`;
}

/**
 * Returns today's date formatted as DD-Month-YYYY (e.g., 25-October-2026).
 */
export function getTodayFormatted(): string {
  return formatDisplayDate(new Date());
}
