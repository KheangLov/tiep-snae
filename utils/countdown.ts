/** Parses a free-text time field ("4:00 PM", "16:00", "6:30pm") into 24h
 * [hour, minute]. Returns null on anything unrecognized so the caller can
 * fall back to a sensible default rather than producing a broken date. */
function parseTimeString(time?: string): [number, number] | null {
  if (!time) return null
  const match = /(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/.exec(time.trim())
  if (!match) return null
  let hour = Number.parseInt(match[1], 10)
  const minute = Number.parseInt(match[2], 10)
  const meridiem = match[3]?.toUpperCase()
  if (meridiem === 'PM' && hour !== 12) hour += 12
  if (meridiem === 'AM' && hour === 12) hour = 0
  if (hour > 23 || minute > 59) return null
  return [hour, minute]
}

/** Resolves a plain `YYYY-MM-DD` event date (+ optional free-text time) into
 * a concrete instant -- shared by the guest-facing countdown
 * (components/invite/primitives/InviteCountdown.vue), the dashboard's
 * per-card countdown badge (pages/index.vue), and the .ics/Google Calendar
 * builders (utils/generateIcs.ts), so all four agree on exactly the same
 * date arithmetic.
 *
 * Deliberately a "floating" wall-clock time, not a real UTC conversion:
 * treats the numbers printed on the invitation ("4:00 PM") as the literal
 * time every viewer should see, regardless of what timezone they're
 * physically in -- the same reasoning as utils/formatInviteDate.ts's
 * UTC-pinned date formatting. */
export function resolveEventDateTime(date: string, timeStart?: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return null
  const [, year, month, day] = match.map(Number) as unknown as [never, number, number, number]
  const [hour, minute] = parseTimeString(timeStart) ?? [18, 0]
  return new Date(Date.UTC(year, month - 1, day, hour, minute))
}

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
}

/** null once the target has passed -- callers hide the countdown rather
 * than show a negative one. */
export function countdownParts(target: Date, now: number = Date.now()): CountdownParts | null {
  const diffMs = target.getTime() - now
  if (diffMs <= 0) return null
  const totalMinutes = Math.floor(diffMs / 60_000)
  return {
    days: Math.floor(totalMinutes / (60 * 24)),
    hours: Math.floor((totalMinutes % (60 * 24)) / 60),
    minutes: totalMinutes % 60,
  }
}
