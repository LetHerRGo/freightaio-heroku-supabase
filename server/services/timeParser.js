// services/timeParser.js
import { DateTime } from "luxon";

// Canadian timezone abbreviation to IANA mapping
const TIMEZONE_MAP = {
  NST: "America/St_Johns",
  AST: "America/Halifax",
  EST: "America/Toronto",
  ET:  "America/Toronto",
  CST: "America/Winnipeg",
  CT:  "America/Winnipeg",
  MST: "America/Edmonton",
  MT:  "America/Edmonton",
  PST: "America/Vancouver",
  PT:  "America/Vancouver",
  SK:  "America/Regina"
};

/**
 * Parses a string like "2024-05-15 02:45 ET" and returns a UTC SQL-style string
 * @param {string} timeString - Format: "YYYY-MM-DD HH:mm TZ"
 * @returns {string|null} - e.g., "2024-05-15 06:45:00+00"
 */
export function parseTime(timeString) {
  if (typeof timeString !== 'string') return null;

  const match = timeString.match(/^(.+)\s([A-Z]{2,4})$/);
  if (!match) return null;

  const [ , dateTimePart, abbr ] = match;
  const zone = TIMEZONE_MAP[abbr];
  if (!zone) throw new Error(`Unsupported timezone abbreviation: ${abbr}`);

  const parsed = DateTime.fromFormat(dateTimePart, "yyyy-MM-dd HH:mm", { zone });

  return parsed.isValid
    ? parsed.toUTC().toFormat("yyyy-MM-dd HH:mm:ss'+00'")
    : null;
}
