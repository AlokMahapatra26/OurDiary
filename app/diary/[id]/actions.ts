'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { entries, diaryMembers } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { isWritingWindow, getDiaryDate } from '@/lib/time'

export async function submitEntry(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const diaryId = formData.get('diaryId') as string
    const content = (formData.get('content') as string)?.trim()
    const devMode = formData.get('devMode') === 'true'
    if (!content || !diaryId) return

    // Verify user is a member
    const [membership] = await db
        .select()
        .from(diaryMembers)
        .where(and(eq(diaryMembers.diaryId, diaryId), eq(diaryMembers.userId, user.id)))
    if (!membership) redirect('/')

    // Verify writing window (skip in dev mode)
    if (!devMode && !isWritingWindow()) {
        redirect(`/diary/${diaryId}?error=The+diary+is+closed+right+now.+Come+back+at+10+PM.`)
    }

    const diaryDate = getDiaryDate()

    // Check if already submitted
    const [existing] = await db
        .select()
        .from(entries)
        .where(and(eq(entries.diaryId, diaryId), eq(entries.userId, user.id), eq(entries.diaryDate, diaryDate)))

    if (existing) {
        redirect(`/diary/${diaryId}?error=You+already+wrote+an+entry+today.`)
    }

    await db.insert(entries).values({
        diaryId,
        userId: user.id,
        content,
        diaryDate,
    })

    redirect(`/diary/${diaryId}`)
}
