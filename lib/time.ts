/**
 * Time utilities for the OurDiary writing window.
 *
 * Rules:
 * - Writing window: 10:00 PM – 2:00 AM (next day)
 * - "Diary date" (logical): if the current time is before 2:00 PM, the diary
 *   date is still the *previous* calendar day.
 *   Example: 1:30 AM on Mar 31 → diary date is Mar 30
 *   Example: 3:00 PM on Mar 31 → diary date is Mar 31 (but window not open yet)
 */

/**
 * Returns the logical "diary date" (YYYY-MM-DD) for the given Date object.
 * Before 2pm → previous calendar day. From 2pm onwards → today.
 */
export function getDiaryDate(now: Date = new Date()): string {
    const hours = now.getHours()
    const d = new Date(now)
    if (hours < 14) {
        // before 2pm — show previous day
        d.setDate(d.getDate() - 1)
    }
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

/**
 * Returns true if the current time is within the writing window (10pm–2am).
 */
export function isWritingWindow(now: Date = new Date()): boolean {
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const timeInMinutes = hours * 60 + minutes

    // 10pm = 22:00, 2am = 2:00
    // Window: 22:00–23:59 (day 1) OR 0:00–1:59 (day 2)
    const windowStart = 22 * 60      // 22:00
    const windowEnd = 2 * 60         // 02:00

    return timeInMinutes >= windowStart || timeInMinutes < windowEnd
}

/**
 * Returns a human-readable string for the writing window status.
 */
export function getWindowStatus(now: Date = new Date()): {
    open: boolean
    message: string
    diaryDate: string
} {
    const open = isWritingWindow(now)
    const diaryDate = getDiaryDate(now)
    return {
        open,
        diaryDate,
        message: open
            ? 'The diary is open. Write your entry for today.'
            : 'The diary opens at 10:00 PM. Come back then.',
    }
}
