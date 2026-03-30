'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { invitations, diaryMembers } from '@/db/schema'
import { and, eq } from 'drizzle-orm'

export async function sendInvite(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const diaryId = formData.get('diaryId') as string
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    if (!diaryId || !email) return

    // Check not inviting yourself
    if (email === user.email) {
        redirect(`/diary/${diaryId}/invite?error=You+cannot+invite+yourself.`)
    }

    // Check if there's already a pending invite for this diary
    const [existing] = await db
        .select()
        .from(invitations)
        .where(and(eq(invitations.diaryId, diaryId), eq(invitations.status, 'pending')))
    if (existing) {
        redirect(`/diary/${diaryId}/invite?error=An+invitation+is+already+pending.`)
    }

    await db.insert(invitations).values({
        diaryId,
        invitedEmail: email,
        invitedBy: user.id,
        status: 'pending',
    })

    redirect(`/diary/${diaryId}?message=Invitation+sent+successfully!`)
}
