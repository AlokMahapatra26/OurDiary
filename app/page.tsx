import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { diaryMembers, diaries, invitations } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { acceptInvitation, declineInvitation } from './invitations/actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Bomb, Plus, Mail, ArrowRight, BookOpen, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userDiaries: { id: string; name: string }[] = []
  let pendingInvitations: any[] = []

  if (user) {
    const memberships = await db
      .select({ diaryId: diaryMembers.diaryId, name: diaries.name })
      .from(diaryMembers)
      .innerJoin(diaries, eq(diaries.id, diaryMembers.diaryId))
      .where(eq(diaryMembers.userId, user.id))
    userDiaries = memberships.map(m => ({ id: m.diaryId, name: m.name }))

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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm border border-gray-100 mb-2">
            <Bomb className="h-6 w-6 text-primary fill-primary/10" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 font-serif">OurDiary</h1>
          {user ? (
            <p className="text-sm text-muted-foreground italic">
              Welcome back, <span className="text-gray-900 not-italic font-medium">{user.user_metadata?.name?.split(' ')[0] || user.email?.split('@')[0]}</span>.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">A private sanctuary for your shared memories.</p>
          )}
        </div>

        {user ? (
          <div className="space-y-6">
            {userDiaries.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <BookOpen className="h-4 w-4 text-muted-foreground/60" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Your Memoirs</span>
                </div>
                {userDiaries.map(d => (
                  <Card key={d.id} className="group border-border/40 shadow-lg shadow-gray-200/40 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-500 overflow-hidden bg-white/80 backdrop-blur-sm">
                    <Link href={`/diary/${d.id}`} className="block p-5">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">{d.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Last updated recently</span>
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-primary/5 transition-colors">
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <Card className="border-dashed border-2 border-border/60 bg-transparent py-10 shadow-none">
                  <CardContent className="flex flex-col items-center text-center space-y-6 p-6">
                    <div className="p-4 rounded-full bg-white shadow-sm border border-gray-100">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-medium">New Beginnings</h3>
                      <p className="text-xs text-muted-foreground max-w-[200px]">Create your shared space and invite your special person.</p>
                    </div>
                    <Button asChild className="rounded-full px-8 h-10 text-sm shadow-lg shadow-gray-200">
                      <Link href="/diary/create">Create Diary</Link>
                    </Button>
                  </CardContent>
                </Card>

                {pendingInvitations.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">Pending Invitations</span>
                    </div>
                    {pendingInvitations.map(inv => (
                      <Card key={inv.id} className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden">
                        <CardHeader className="pb-3 pt-4 px-5">
                          <CardTitle className="text-sm font-semibold">{inv.diaryName}</CardTitle>
                          <CardDescription className="text-[10px]">
                            Received on {new Date(inv.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex gap-2 p-4 pt-0">
                          <form action={acceptInvitation} className="flex-1">
                            <input type="hidden" name="invitationId" value={inv.id} />
                            <input type="hidden" name="diaryId" value={inv.diaryId} />
                            <SubmitButton
                              iconName="bomb"
                              pendingText="..."
                              className="w-full h-9 rounded-xl text-xs"
                            >
                              Join Now
                            </SubmitButton>
                          </form>
                          <form action={declineInvitation} className="flex-1">
                            <input type="hidden" name="invitationId" value={inv.id} />
                            <SubmitButton
                              variant="ghost"
                              pendingText="..."
                              className="w-full h-9 rounded-xl text-xs text-muted-foreground hover:bg-red-50 hover:text-red-500"
                            >
                              Decline
                            </SubmitButton>
                          </form>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 pt-4">
            <Button asChild className="w-full h-12 rounded-2xl text-sm font-medium shadow-xl shadow-gray-200">
              <Link href="/login">Sign in to your story</Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-12 rounded-2xl text-sm font-medium border-border/60 hover:bg-white transition-all">
              <Link href="/signup">Join OurDiary</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
