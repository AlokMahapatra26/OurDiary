'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { diaries, diaryMembers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function createDiary(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Block if user already has a diary
    const existing = await db.select().from(diaryMembers).where(eq(diaryMembers.userId, user.id))
    if (existing.length > 0) redirect('/')

    const name = formData.get('name') as string
    if (!name?.trim()) return

    const [diary] = await db.insert(diaries).values({
        name: name.trim(),
        createdBy: user.id,
    }).returning()

    await db.insert(diaryMembers).values({
        diaryId: diary.id,
        userId: user.id,
    })

    redirect(`/diary/${diary.id}`)
}
