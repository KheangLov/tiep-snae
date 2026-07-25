/** Formats a plain `YYYY-MM-DD` calendar date (an `event.date` field --
 * a wedding day, not a timezone-relative instant) for display.
 *
 * Deliberately does NOT do `new Date(dateString)` + a local-timezone
 * `Intl.DateTimeFormat`: that parses the string as UTC midnight, then
 * renders it in whatever timezone is running the code. On the server that's
 * the Nitro process's timezone; in the browser it's the visitor's -- when
 * those differ, the date can print as the day before/after, and (worse) SSR
 * and client hydration disagree on the rendered text. Parsing the
 * year/month/day as plain integers and formatting with `timeZone: 'UTC'`
 * pins the result to the same calendar date everywhere, every time. */
export function formatInviteDate(isoDate: string, locale: 'km-KH' | 'en-US'): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!match) return isoDate

  const [, year, month, day] = match
  const utcDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(utcDate)
  } catch {
    return isoDate
  }
}
