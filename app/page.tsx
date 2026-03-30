import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { db } from '@/db'
import { diaryMembers, diaries, invitations } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { acceptInvitation, declineInvitation } from './invitations/actions'
import { SubmitButton } from '@/components/ui/SubmitButton'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userDiaries: { id: string; name: string }[] = []
  let pendingInvitations: any[] = []

  if (user) {
    // Get user's diaries
    const memberships = await db
      .select({ diaryId: diaryMembers.diaryId, name: diaries.name })
      .from(diaryMembers)
      .innerJoin(diaries, eq(diaries.id, diaryMembers.diaryId))
      .where(eq(diaryMembers.userId, user.id))
    userDiaries = memberships.map(m => ({ id: m.diaryId, name: m.name }))

    // Get pending invitations only if the user doesn't have a diary yet
    if (userDiaries.length === 0) {
      pendingInvitations = await db
        .select({
          id: invitations.id,
          diaryId: invitations.diaryId,
          diaryName: diaries.name,
          createdAt: invitations.createdAt,
        })
        .from(invitations)
        .innerJoin(diaries, eq(diaries.id, invitations.diaryId))
        .where(
          and(
            eq(invitations.invitedEmail, user.email!.toLowerCase()),
            eq(invitations.status, 'pending')
          )
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-medium text-gray-900 mb-1">OurDiary</h1>
          <p className="text-sm text-gray-400">A shared space for your thoughts.</p>
        </div>

        {user ? (
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-500 mb-4">
              Welcome, <span className="text-gray-900">{user.user_metadata?.name || user.email}</span>
            </p>

            {userDiaries.length > 0 ? (
              /* User already has a diary — show it */
              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
                <p className="text-xs text-gray-400 mb-2">Your diary</p>
                {userDiaries.map(d => (
                  <Link
                    key={d.id}
                    href={`/diary/${d.id}`}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-800">{d.name}</span>
                    <span className="text-xs text-gray-400">Open →</span>
                  </Link>
                ))}
              </div>
            ) : (
              /* No diary yet — show create & pending invitations */
              <div className="space-y-6">
                <Link
                  href="/diary/create"
                  className="block bg-gray-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors text-center"
                >
                  Create shared diary
                </Link>

                {pendingInvitations.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-400 mb-3 px-1">Pending invitations</p>
                    <div className="space-y-3">
                      {pendingInvitations.map(inv => (
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
                  </div>
                )}
              </div>
            )}

            <p className="text-center text-xs text-gray-300 mt-4">
              Your personal diary space.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/login"
              className="block bg-gray-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors text-center"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="block bg-white border border-gray-200 text-gray-500 rounded-xl px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors text-center"
            >
              Create account
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
