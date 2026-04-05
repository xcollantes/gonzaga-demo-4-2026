/**
 * Timezone utility functions.
 *
 * This module provides functions to work with timezones, including conversion
 * between UTC offsets and IANA timezone names.
 */

/**
 * Maps UTC offsets to common IANA timezone identifiers.
 * This is a simplified mapping and doesn't account for all edge cases.
 */
export const UTC_OFFSET_TO_TIMEZONE: Record<string, string> = {
  "-12:00": "Pacific/Wake",
  "-11:00": "Pacific/Midway",
  "-10:00": "Pacific/Honolulu",
  "-09:30": "Pacific/Marquesas",
  "-09:00": "America/Anchorage",
  "-08:00": "America/Los_Angeles",
  "-07:00": "America/Denver",
  "-06:00": "America/Chicago",
  "-05:00": "America/New_York",
  "-04:00": "America/Halifax",
  "-03:30": "America/St_Johns",
  "-03:00": "America/Sao_Paulo",
  "-02:00": "America/Noronha",
  "-01:00": "Atlantic/Azores",
  "+00:00": "Europe/London",
  "+01:00": "Europe/Paris",
  "+02:00": "Europe/Helsinki",
  "+03:00": "Europe/Moscow",
  "+03:30": "Asia/Tehran",
  "+04:00": "Asia/Dubai",
  "+04:30": "Asia/Kabul",
  "+05:00": "Asia/Karachi",
  "+05:30": "Asia/Kolkata",
  "+05:45": "Asia/Kathmandu",
  "+06:00": "Asia/Dhaka",
  "+06:30": "Asia/Yangon",
  "+07:00": "Asia/Bangkok",
  "+08:00": "Asia/Shanghai",
  "+08:45": "Australia/Eucla",
  "+09:00": "Asia/Tokyo",
  "+09:30": "Australia/Darwin",
  "+10:00": "Australia/Sydney",
  "+10:30": "Australia/Lord_Howe",
  "+11:00": "Pacific/Guadalcanal",
  "+12:00": "Pacific/Auckland",
  "+12:45": "Pacific/Chatham",
  "+13:00": "Pacific/Apia",
  "+14:00": "Pacific/Kiritimati"
};

/**
 * Maps country codes to specific timezone handling rules.
 * This helps with countries that span multiple timezones.
 */
export const COUNTRY_TIMEZONE_RULES: Record<string, Record<string, string>> = {
  // United States timezone mappings
  "US": {
    "-04:00": "America/New_York", // EDT
    "-05:00": "America/New_York", // EST
    "-06:00": "America/Chicago",
    "-07:00": "America/Denver",
    "-08:00": "America/Los_Angeles",
    "-09:00": "America/Anchorage",
    "-10:00": "Pacific/Honolulu",
  },
  // Add more countries as needed
};

/**
 * Convert a UTC offset to an IANA timezone identifier.
 *
 * @param utcOffset The UTC offset in format "+HH:MM" or "-HH:MM"
 * @param countryCode Optional country code to improve accuracy
 * @param availableTimezones Optional array of available timezones for the country
 * @returns IANA timezone identifier or the original offset if conversion fails
 */
export function utcOffsetToTimezone(
  utcOffset: string,
  countryCode?: string,
  availableTimezones?: string[]
): string {
  if (!utcOffset) {
    return null;
  }

  try {
    // 1. Check country-specific rules if country code is provided
    if (countryCode && COUNTRY_TIMEZONE_RULES[countryCode]?.[utcOffset]) {
      return COUNTRY_TIMEZONE_RULES[countryCode][utcOffset];
    }

    // 2. If available timezones are provided and there's only one, use it
    if (availableTimezones?.length === 1) {
      return availableTimezones[0];
    }

    // 3. Fall back to common offset mapping
    if (UTC_OFFSET_TO_TIMEZONE[utcOffset]) {
      return UTC_OFFSET_TO_TIMEZONE[utcOffset];
    }

    // 4. If all else fails, return the original offset
    return utcOffset;
  } catch (err) {
    console.error("Failed to convert UTC offset to IANA timezone:", err);
    return utcOffset;
  }
}

/**
 * Get the UTC offset for a given IANA timezone identifier.
 *
 * @param timezone IANA timezone identifier (e.g., "America/New_York")
 * @returns UTC offset in format "+HH:MM" or "-HH:MM"
 */
export function getUtcOffsetFromTimezone(timezone: string): string {
  try {
    if (!timezone) {
      return null;
    }

    // Use Intl.DateTimeFormat to get the timezone offset
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      timeZoneName: 'short'
    };

    // Format the date in the given timezone and extract the UTC offset
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');

    if (timeZonePart) {
      // This will give something like "GMT-07:00" or "EST"
      const timeZoneString = timeZonePart.value;

      // Handle cases like "EST", "PST", etc.
      const abbreviationToOffset: Record<string, string> = {
        'EST': '-05:00',
        'EDT': '-04:00',
        'CST': '-06:00',
        'CDT': '-05:00',
        'MST': '-07:00',
        'MDT': '-06:00',
        'PST': '-08:00',
        'PDT': '-07:00',
        'AKST': '-09:00',
        'AKDT': '-08:00',
        'HST': '-10:00',
        'HDT': '-09:00',
      };

      if (abbreviationToOffset[timeZoneString]) {
        return abbreviationToOffset[timeZoneString];
      }

      // Try to extract offset from GMT format
      if (timeZoneString.startsWith('GMT')) {
        return timeZoneString.substring(3); // Remove "GMT" prefix
      }
    }

    // If we couldn't extract it from the formatter,
    // calculate it manually from the date
    const timezoneDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offsetMinutes = (timezoneDate.getTime() - utcDate.getTime()) / 60000;
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMinuteRemainder = Math.abs(offsetMinutes) % 60;

    const sign = offsetMinutes < 0 ? '+' : '-'; // Note: sign is inverted for UTC offset
    return `${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinuteRemainder.toString().padStart(2, '0')}`;
  } catch (err) {
    console.error(`Failed to get UTC offset for timezone ${timezone}:`, err);
    return null;
  }
}