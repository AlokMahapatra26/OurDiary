import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { diaries, diaryMembers, entries } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import Link from 'next/link'
import { getWindowStatus } from '@/lib/time'
import { submitEntry } from './actions'
import { DiaryWriteSection } from '@/components/DiaryWriteSection'
import { DateFilter } from '@/components/DateFilter'
import { getAdminClient } from '@/utils/supabase/admin'

export default async function DiaryPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ date?: string }>
}) {
    const { id } = await params
    const { date: queryDate } = await searchParams

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const [diary] = await db.select().from(diaries).where(eq(diaries.id, id))
    if (!diary) redirect('/')

    const [membership] = await db
        .select()
        .from(diaryMembers)
        .where(and(eq(diaryMembers.diaryId, id), eq(diaryMembers.userId, user.id)))
    if (!membership) redirect('/')

    const members = await db.select().from(diaryMembers).where(eq(diaryMembers.diaryId, id))
    const partnerMemberId = members.find(m => m.userId !== user.id)?.userId || null

    let partnerName = 'Partner'
    if (partnerMemberId) {
        try {
            const adminClient = getAdminClient()
            const { data: { user: partnerUser } } = await adminClient.auth.admin.getUserById(partnerMemberId)
            if (partnerUser?.user_metadata?.name) {
                partnerName = partnerUser.user_metadata.name
            }
        } catch (err) {
            console.error('Error fetching partner name:', err)
        }
    }

    // Today's logical status
    const { open: isWindowOpenNow, message: windowMsg, diaryDate: currentLogicalDate } = getWindowStatus()

    // The date we are currently viewing
    const selectedDate = queryDate || currentLogicalDate
    const isViewingToday = selectedDate === currentLogicalDate

    // Fetch entries for the selected date
    const dayEntries = await db
        .select()
        .from(entries)
        .where(and(eq(entries.diaryId, id), eq(entries.diaryDate, selectedDate)))

    const myEntry = dayEntries.find(e => e.userId === user.id)
    const partnerEntry = dayEntries.find(e => e.userId !== user.id)

    const hasPendingInvite = members.length < 2

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-sm mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 mb-1 block">← Home</Link>
                        <h1 className="text-lg font-medium text-gray-900">{diary.name}</h1>
                        <DateFilter
                            initialDate={selectedDate}
                            label={formatDiaryDate(selectedDate)}
                        />
                    </div>
                    {hasPendingInvite && (
                        <Link
                            href={`/diary/${id}/invite`}
                            className="text-xs bg-gray-100 text-gray-600 rounded-xl px-3 py-1.5 hover:bg-gray-200 transition-colors"
                        >
                            + Invite partner
                        </Link>
                    )}
                </div>

                {/* Write section (Unlockable via dev mode for any date) */}
                <DiaryWriteSection
                    diaryId={id}
                    diaryDate={selectedDate}
                    isViewingToday={isViewingToday}
                    isWindowOpen={isWindowOpenNow}
                    hasExistingEntry={!!myEntry}
                    windowMessage={windowMsg}
                    submitAction={submitEntry}
                />

                {!isViewingToday && (
                    <div className="bg-gray-100/50 border border-gray-100 rounded-xl px-4 py-2 text-[10px] text-gray-400 mb-6 text-center">
                        Viewing records for {formatDiaryDate(selectedDate)}.
                        <Link href={`/diary/${id}`} className="ml-1 text-gray-600 hover:underline font-medium">Reset to today →</Link>
                    </div>
                )}

                {/* Entries display */}
                <div className="space-y-4">
                    {myEntry ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <p className="text-xs text-gray-400 mb-2">Your entry</p>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{myEntry.content}</p>
                        </div>
                    ) : !isViewingToday && (
                        <div className="bg-white/50 border border-dashed border-gray-200 rounded-2xl p-5 text-center">
                            <p className="text-xs text-gray-300">You didn&apos;t write an entry this day.</p>
                        </div>
                    )}

                    {partnerMemberId ? (
                        partnerEntry ? (
                            <div className="bg-white border border-gray-200 rounded-2xl p-5">
                                <p className="text-xs text-gray-400 mb-2">{partnerName}&apos;s entry</p>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{partnerEntry.content}</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center">
                                <p className="text-sm text-gray-400">
                                    {isViewingToday ? `${partnerName} hasn't written yet.` : `${partnerName} didn't write an entry this day.`}
                                </p>
                            </div>
                        )
                    ) : isViewingToday && (
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center">
                            <p className="text-sm text-gray-400 mb-3">No partner joined yet.</p>
                            <Link
                                href={`/diary/${id}/invite`}
                                className="text-sm text-gray-700 underline"
                            >
                                Invite your partner
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function formatDiaryDate(date: string): string {
    const d = new Date(date + 'T12:00:00')
    return d.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}
