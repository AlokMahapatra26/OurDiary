import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { diaries, diaryMembers } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { sendInvite } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, ArrowLeft, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function InvitePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verify user is a member
    const [membership] = await db.select().from(diaryMembers).where(and(eq(diaryMembers.diaryId, id), eq(diaryMembers.userId, user.id)))
    if (!membership) redirect('/')

    const members = await db.select().from(diaryMembers).where(eq(diaryMembers.diaryId, id))
    if (members.length >= 2) redirect(`/diary/${id}`) // Full

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm border border-gray-100 mb-2">
                        <UserPlus className="h-6 w-6 text-gray-900" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 font-serif">Invite your partner</h1>
                    <p className="text-sm text-muted-foreground italic">Shared memories are the best memories.</p>
                </div>

                <Card className="border-border/50 shadow-xl shadow-gray-200/50 backdrop-blur-sm bg-white/80">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-lg">Invitation details</CardTitle>
                        <CardDescription>
                            Enter your partner's email address below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={sendInvite} className="space-y-5">
                            <input type="hidden" name="diaryId" value={id} />
                            <div className="space-y-2.5">
                                <Label htmlFor="email">Partner's Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="soulmate@example.com"
                                    autoFocus
                                />
                            </div>
                            <SubmitButton
                                iconName="send"
                                pendingText="Sending..."
                                className="w-full h-11 rounded-xl text-sm shadow-lg shadow-gray-200"
                            >
                                Send invitation
                            </SubmitButton>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center pt-2">
                        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-gray-900">
                            <Link href={`/diary/${id}`}>
                                <ArrowLeft className="h-3 w-3 mr-1" />
                                Back to diary
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <p className="px-8 text-center text-[10px] text-muted-foreground leading-relaxed">
                    Once they join, you'll both be able to write and view each other's memories in this shared space.
                </p>
            </div>
        </div>
    )
}
