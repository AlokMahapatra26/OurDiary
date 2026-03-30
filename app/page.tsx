import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { db } from '@/db'
import { diaryMembers, diaries } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userDiaries: { id: string; name: string }[] = []
  if (user) {
    const memberships = await db
      .select({ diaryId: diaryMembers.diaryId, name: diaries.name })
      .from(diaryMembers)
      .innerJoin(diaries, eq(diaries.id, diaryMembers.diaryId))
      .where(eq(diaryMembers.userId, user.id))
    userDiaries = memberships.map(m => ({ id: m.diaryId, name: m.name }))
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
              /* No diary yet — show create & check invitations */
              <>
                <Link
                  href="/diary/create"
                  className="block bg-gray-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors text-center"
                >
                  Create shared diary
                </Link>
                <Link
                  href="/invitations"
                  className="block bg-white border border-gray-200 text-gray-500 rounded-xl px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors text-center"
                >
                  Check invitations
                </Link>
              </>
            )}

            <Link
              href="/profile"
              className="block text-center text-xs text-gray-400 hover:text-gray-600 transition-colors mt-2"
            >
              Profile & settings
            </Link>
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
