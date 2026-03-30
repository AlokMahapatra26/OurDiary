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
    const submittedDate = formData.get('diaryDate') as string

    if (!content || !diaryId || !submittedDate) return

    // Verify user is a member
    const [membership] = await db
        .select()
        .from(diaryMembers)
        .where(and(eq(diaryMembers.diaryId, diaryId), eq(diaryMembers.userId, user.id)))
    if (!membership) redirect('/')

    const currentLogicalDate = getDiaryDate()

    if (!devMode) {
        // Strict checks for production mode
        if (!isWritingWindow()) {
            redirect(`/diary/${diaryId}?error=The+diary+is+closed+right+now.+Come+back+at+10+PM.`)
        }
        if (submittedDate !== currentLogicalDate) {
            redirect(`/diary/${diaryId}?error=You+can+only+write+for+today.`)
        }
    }

    // Check if already submitted for this date/user
    const [existing] = await db
        .select()
        .from(entries)
        .where(and(eq(entries.diaryId, diaryId), eq(entries.userId, user.id), eq(entries.diaryDate, submittedDate)))

    if (existing) {
        redirect(`/diary/${diaryId}?date=${submittedDate}&error=You+already+wrote+an+entry+for+this+date.`)
    }

    await db.insert(entries).values({
        diaryId,
        userId: user.id,
        content,
        diaryDate: submittedDate,
    })

    redirect(`/diary/${diaryId}?date=${submittedDate}`)
}

export async function updateEntry(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const diaryId = formData.get('diaryId') as string
    const entryId = formData.get('entryId') as string
    const content = (formData.get('content') as string)?.trim()
    const devMode = formData.get('devMode') === 'true'
    const submittedDate = formData.get('diaryDate') as string

    if (!content || !diaryId || !submittedDate || !entryId) return

    // Verify user is a member
    const [membership] = await db
        .select()
        .from(diaryMembers)
        .where(and(eq(diaryMembers.diaryId, diaryId), eq(diaryMembers.userId, user.id)))
    if (!membership) redirect('/')

    const currentLogicalDate = getDiaryDate()

    if (!devMode) {
        // Strict checks for production mode
        if (!isWritingWindow()) {
            redirect(`/diary/${diaryId}?error=The+diary+is+closed+right+now.+Come+back+at+10+PM.`)
        }
        if (submittedDate !== currentLogicalDate) {
            redirect(`/diary/${diaryId}?error=You+can+only+edit+today's+entry.`)
        }
    }

    // Verify ownership and date mapping
    const [existing] = await db
        .select()
        .from(entries)
        .where(and(eq(entries.id, entryId), eq(entries.userId, user.id), eq(entries.diaryId, diaryId)))

    if (!existing) {
        redirect(`/diary/${diaryId}?date=${submittedDate}&error=Entry+not+found.`)
    }

    await db.update(entries)
        .set({ content })
        .where(eq(entries.id, entryId))

    redirect(`/diary/${diaryId}?date=${submittedDate}`)
}
