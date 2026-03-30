import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { diaries, diaryMembers } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { sendInvite } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import Link from 'next/link'

export default async function InvitePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verify user is the owner
    const [diary] = await db.select().from(diaries).where(eq(diaries.id, id))
    if (!diary || diary.createdBy !== user.id) redirect('/')

    const members = await db.select().from(diaryMembers).where(eq(diaryMembers.diaryId, id))
    if (members.length >= 2) redirect(`/diary/${id}`) // Full

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <Link href={`/diary/${id}`} className="text-xs text-gray-400 hover:text-gray-600 mb-4 block">← Back to diary</Link>
                <h1 className="text-xl font-medium mb-2 text-gray-900">Invite your partner</h1>
                <p className="text-sm text-gray-400 mb-6">
                    Enter your partner&apos;s email. They&apos;ll see the invitation when they log in.
                </p>

                <form action={sendInvite} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                    <input type="hidden" name="diaryId" value={id} />
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5" htmlFor="email">Partner&apos;s email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="partner@email.com"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>
                    <SubmitButton
                        iconName="user-plus"
                        pendingText="Sending invite..."
                        className="w-full bg-gray-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        Send invitation
                    </SubmitButton>
                </form>
            </div>
        </div>
    )
}
