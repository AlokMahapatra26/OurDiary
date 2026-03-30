'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { invitations, diaryMembers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function acceptInvitation(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const invitationId = formData.get('invitationId') as string
    const diaryId = formData.get('diaryId') as string

    // Verify invitation exists and is for this user's email
    const [inv] = await db.select().from(invitations).where(eq(invitations.id, invitationId))
    if (!inv || inv.invitedEmail !== user.email?.toLowerCase()) redirect('/')
    if (inv.status !== 'pending') redirect('/')

    // Add user to diary members
    await db.insert(diaryMembers).values({
        diaryId: inv.diaryId,
        userId: user.id,
    })

    // Update invitation status
    await db.update(invitations).set({ status: 'accepted' }).where(eq(invitations.id, invitationId))

    redirect(`/diary/${inv.diaryId}`)
}

export async function declineInvitation(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const invitationId = formData.get('invitationId') as string

    const [inv] = await db.select().from(invitations).where(eq(invitations.id, invitationId))
    if (!inv || inv.invitedEmail !== user.email?.toLowerCase()) redirect('/')

    await db.update(invitations).set({ status: 'declined' }).where(eq(invitations.id, invitationId))

    redirect('/')
}
