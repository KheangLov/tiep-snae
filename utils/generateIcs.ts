import type { InviteData } from '~/types/invite'
import { resolveEventDateTime } from '~/utils/countdown'

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

/** Resolves an invitation's event into a concrete start Date -- exported so
 * the .ics builder and the Google Calendar quick-add link compute the exact
 * same instant from the exact same input (which also matches the guest-
 * facing and dashboard countdowns -- see utils/countdown.ts). */
export function resolveEventStart(invite: InviteData): Date | null {
  return resolveEventDateTime(invite.event.date, invite.event.timeStart)
}

function toIcsFloatingDateTime(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00`
}

function toIcsUtcStamp(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

/** Builds a standard iCalendar (.ics) file for the invitation's event, with
 * a VALARM that fires one day before -- the one part of "add to calendar"
 * that a plain Google Calendar link structurally cannot do (see
 * buildGoogleCalendarUrl's doc comment). Calendar apps that import .ics
 * files (Apple Calendar, Outlook, most Android calendars, and Google
 * Calendar's own file-import flow) read and apply this alarm. */
export function generateIcs(invite: InviteData): string | null {
  const start = resolveEventStart(invite)
  if (!start) return null
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)

  const title = `${invite.couple.partnerAName || 'Partner A'} & ${invite.couple.partnerBName || 'Partner B'}'s Wedding`
  const location = [invite.venue.name, invite.venue.addressLine1, invite.venue.addressLine2].filter(Boolean).join(', ')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tiep Snae//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${invite.id}@tiep-snae`,
    `DTSTAMP:${toIcsUtcStamp(new Date())}`,
    `DTSTART:${toIcsFloatingDateTime(start)}`,
    `DTEND:${toIcsFloatingDateTime(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    location ? `LOCATION:${escapeIcsText(location)}` : null,
    invite.quote.text ? `DESCRIPTION:${escapeIcsText(invite.quote.text)}` : null,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Wedding tomorrow!',
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter((line): line is string => line !== null)

  return lines.join('\r\n')
}

/** Google Calendar's "quick add" URL (calendar.google.com/calendar/render)
 * has no parameter for a custom reminder -- only Google's own account-level
 * default reminders apply to events added this way. There is no URL-based
 * workaround; this is a hard limitation of that endpoint, not a bug here.
 * Kept as a one-tap convenience alongside the .ics download (which does
 * carry the 1-day alarm), with the UI making the tradeoff explicit rather
 * than silently promising a reminder this link can't deliver. */
export function buildGoogleCalendarUrl(invite: InviteData): string | null {
  const start = resolveEventStart(invite)
  if (!start) return null
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)
  const title = `${invite.couple.partnerAName || 'Partner A'} & ${invite.couple.partnerBName || 'Partner B'}'s Wedding`
  const location = [invite.venue.name, invite.venue.addressLine1, invite.venue.addressLine2].filter(Boolean).join(', ')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toIcsFloatingDateTime(start)}Z/${toIcsFloatingDateTime(end)}Z`,
    ...(location ? { location } : {}),
    ...(invite.quote.text ? { details: invite.quote.text } : {}),
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
