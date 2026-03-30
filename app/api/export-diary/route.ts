import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { diaryMembers, entries, diaries } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new Response('Unauthorized', { status: 401 })
    }

    // 1. Find user's diary
    const [membership] = await db
        .select()
        .from(diaryMembers)
        .where(eq(diaryMembers.userId, user.id))
        .limit(1)

    if (!membership) {
        return new Response('No diary found', { status: 404 })
    }

    // 2. Fetch diary details
    const [diary] = await db.select().from(diaries).where(eq(diaries.id, membership.diaryId))

    // 3. Fetch all members names for context
    const members = await db.select().from(diaryMembers).where(eq(diaryMembers.diaryId, membership.diaryId))
    const adminClient = getAdminClient()

    const userMap: Record<string, string> = {}
    for (const m of members) {
        try {
            const { data: { user: u } } = await adminClient.auth.admin.getUserById(m.userId)
            userMap[m.userId] = u?.user_metadata?.name || u?.email || 'Unknown'
        } catch (e) {
            userMap[m.userId] = 'Unknown'
        }
    }

    // 4. Fetch all entries
    const allEntries = await db
        .select()
        .from(entries)
        .where(eq(entries.diaryId, membership.diaryId))
        .orderBy(entries.diaryDate)

    const exportData = {
        diaryName: diary.name,
        exportedAt: new Date().toISOString(),
        entries: allEntries.map(e => ({
            date: e.diaryDate,
            author: userMap[e.userId] || 'Unknown',
            content: e.content,
            timestamp: e.createdAt.toISOString()
        }))
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="ourdiary-${diary.name.toLowerCase().replace(/\s+/g, '-')}-export.json"`
        }
    })
}
