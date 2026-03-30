import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { invitations, diaries } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { acceptInvitation, declineInvitation } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import Link from 'next/link'

export default async function InvitationsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const email = user.email!.toLowerCase()

    // Get pending invitations for user's email
    const pending = await db
        .select({
            id: invitations.id,
            diaryId: invitations.diaryId,
            diaryName: diaries.name,
            invitedBy: invitations.invitedBy,
            createdAt: invitations.createdAt,
        })
        .from(invitations)
        .innerJoin(diaries, eq(diaries.id, invitations.diaryId))
        .where(eq(invitations.invitedEmail, email))

    const pendingInvitations = pending.filter(i => {
        // We need to get status separately
        return true // fetched all, will filter below
    })

    const allInvitations = await db
        .select({
            id: invitations.id,
            diaryId: invitations.diaryId,
            diaryName: diaries.name,
            status: invitations.status,
            createdAt: invitations.createdAt,
        })
        .from(invitations)
        .innerJoin(diaries, eq(diaries.id, invitations.diaryId))
        .where(eq(invitations.invitedEmail, email))

    const pendingOnes = allInvitations.filter(i => i.status === 'pending')
    const pastOnes = allInvitations.filter(i => i.status !== 'pending')

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-sm mx-auto">
                <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 mb-4 block">← Home</Link>
                <h1 className="text-xl font-medium mb-6 text-gray-900">Invitations</h1>

                {pendingOnes.length === 0 && pastOnes.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                        <p className="text-sm text-gray-400">No invitations yet.</p>
                        <p className="text-xs text-gray-300 mt-1">Ask your partner to invite you from their diary.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingOnes.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-400 mb-2 px-1">Pending</p>
                                {pendingOnes.map(inv => (
                                    <div key={inv.id} className="bg-white border border-gray-200 rounded-2xl p-4">
                                        <p className="text-sm text-gray-800 font-medium mb-0.5">{inv.diaryName}</p>
                                        <p className="text-xs text-gray-400 mb-4">
                                            Invited {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </p>
                                        <div className="flex gap-2">
                                            <form action={acceptInvitation} className="flex-1">
                                                <input type="hidden" name="invitationId" value={inv.id} />
                                                <input type="hidden" name="diaryId" value={inv.diaryId} />
                                                <SubmitButton
                                                    iconName="log-in"
                                                    pendingText="Joining..."
                                                    className="w-full bg-gray-900 text-white rounded-xl px-3 py-2 text-xs font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                                                >
                                                    Accept
                                                </SubmitButton>
                                            </form>
                                            <form action={declineInvitation} className="flex-1">
                                                <input type="hidden" name="invitationId" value={inv.id} />
                                                <SubmitButton
                                                    iconName="trash"
                                                    pendingText="Declining..."
                                                    className="w-full bg-gray-100 text-gray-500 rounded-xl px-3 py-2 text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                                                >
                                                    Decline
                                                </SubmitButton>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {pastOnes.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-400 mb-2 px-1">Past</p>
                                {pastOnes.map(inv => (
                                    <div key={inv.id} className="bg-white border border-gray-100 rounded-2xl p-4 opacity-60">
                                        <p className="text-sm text-gray-700">{inv.diaryName}</p>
                                        <p className="text-xs text-gray-400 capitalize mt-0.5">{inv.status}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
