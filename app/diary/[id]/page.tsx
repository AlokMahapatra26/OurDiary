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
import { MyDiaryEntry } from '@/components/MyDiaryEntry'
import { getAdminClient } from '@/utils/supabase/admin'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Book, Home, UserPlus, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

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

    const { open: isWindowOpenNow, message: windowMsg, diaryDate: currentLogicalDate } = getWindowStatus()
    const selectedDate = queryDate || currentLogicalDate
    const isViewingToday = selectedDate === currentLogicalDate

    const dayEntries = await db
        .select()
        .from(entries)
        .where(and(eq(entries.diaryId, id), eq(entries.diaryDate, selectedDate)))

    const myEntry = dayEntries.find(e => e.userId === user.id)
    const partnerEntry = dayEntries.find(e => e.userId !== user.id)
    const hasPendingInvite = members.length < 2

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-100 pb-32">
            <div className="w-full max-w-md mx-auto p-4 space-y-8 animate-bouncy">
                {/* Header */}
                <div className="flex flex-col gap-6 pt-4">
                    <div className="flex items-center justify-between">
                        <Button asChild variant="ghost" size="sm" className="h-8 px-2 -ml-2 text-muted-foreground hover:text-gray-900 group">
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
                                <span className="text-xs font-medium">Home</span>
                            </Link>
                        </Button>
                        {hasPendingInvite && (
                            <Button asChild variant="secondary" size="sm" className="h-8 rounded-full px-3 text-[10px] font-semibold tracking-wide uppercase">
                                <Link href={`/diary/${id}/invite`}>
                                    <UserPlus className="h-3 w-3 mr-1" />
                                    Invite
                                </Link>
                            </Button>
                        )}
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
                            {diary.name}
                            <Book className={cn("h-4 w-4 fill-primary/10 text-primary transition-all", isViewingToday ? "scale-110 " : "opacity-30")} />
                        </h1>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                            <DateFilter initialDate={selectedDate} label="" />
                        </div>
                    </div>
                </div>

                {/* Write section */}
                <DiaryWriteSection
                    diaryId={id}
                    diaryDate={selectedDate}
                    hasExistingEntry={!!myEntry}
                    submitAction={submitEntry}
                />

                {!isViewingToday && (
                    <div className="flex justify-center -mt-2">
                        <Badge variant="outline" className="text-[10px] bg-white/50 backdrop-blur-sm border-border/50 text-muted-foreground font-normal py-1 px-3 rounded-full">
                            Archive Mode • <Link href={`/diary/${id}`} className="hover:text-primary transition-colors">Go to today</Link>
                        </Badge>
                    </div>
                )}

                {/* Entries display - Vertical Timeline */}
                <div className="relative space-y-12 pl-2">
                    {/* Decorative Timeline Line */}
                    <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-border/50 via-border/50 to-transparent" />

                    {/* My Entry */}
                    <MyDiaryEntry
                        diaryId={diary.id}
                        diaryDate={selectedDate}
                        userName={user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        entryUrlSafeDate={selectedDate}
                        myEntry={myEntry ? { id: myEntry.id, content: myEntry.content } : undefined}
                    />

                    {/* Partner Entry */}
                    {partnerMemberId && (
                        <div className="relative z-10 flex gap-4 animate-bouncy">
                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm shrink-0">
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                    {partnerName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-900">{partnerName}</span>
                                </div>
                                {partnerEntry ? (
                                    <div className="bg-white border border-border/40 rounded-2xl rounded-tl-none p-5 shadow-lg shadow-gray-200/40 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                                        {partnerEntry.content}
                                    </div>
                                ) : (
                                    <div className="bg-muted/30 border border-dashed border-border/60 rounded-2xl p-5 text-center">
                                        <p className="text-xs text-muted-foreground italic">
                                            {isViewingToday ? `${partnerName} is still writing...` : `${partnerName} left no memo.`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!partnerMemberId && isViewingToday && (
                        <div className="relative z-10 flex gap-4 animate-bouncy">
                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm shrink-0">
                                <AvatarFallback className="bg-gray-100 text-gray-300">
                                    ?
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Soulmate</span>
                                </div>
                                <div className="bg-white/40 border border-dashed border-border rounded-2xl p-8 text-center space-y-3">
                                    <p className="text-xs text-muted-foreground">This story needs another soul.</p>
                                    <Button asChild variant="outline" size="sm" className="h-8 rounded-full text-[10px]">
                                        <Link href={`/diary/${id}/invite`}>Send Invitation</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
