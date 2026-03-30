import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { diaries, diaryMembers, entries } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import Link from 'next/link'
import { getWindowStatus } from '@/lib/time'
import { submitEntry } from './actions'
import { DiaryWriteSection } from '@/components/DiaryWriteSection'

export default async function DiaryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
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

    const { open, message, diaryDate } = getWindowStatus()

    const dayEntries = await db
        .select()
        .from(entries)
        .where(and(eq(entries.diaryId, id), eq(entries.diaryDate, diaryDate)))

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
                        <p className="text-xs text-gray-400 mt-0.5">{formatDiaryDate(diaryDate)}</p>
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

                {/* Write section (Client Component with dev toggle) */}
                <DiaryWriteSection
                    diaryId={id}
                    diaryDate={diaryDate}
                    isWindowOpen={open}
                    hasExistingEntry={!!myEntry}
                    windowMessage={message}
                    submitAction={submitEntry}
                />

                {/* Entries display */}
                <div className="space-y-4">
                    {myEntry && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <p className="text-xs text-gray-400 mb-2">Your entry</p>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{myEntry.content}</p>
                        </div>
                    )}

                    {partnerMemberId ? (
                        partnerEntry ? (
                            <div className="bg-white border border-gray-200 rounded-2xl p-5">
                                <p className="text-xs text-gray-400 mb-2">Partner&apos;s entry</p>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{partnerEntry.content}</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center">
                                <p className="text-sm text-gray-400">Your partner hasn&apos;t written yet.</p>
                            </div>
                        )
                    ) : (
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
    return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}
