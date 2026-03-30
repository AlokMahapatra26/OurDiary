import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createDiary } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookPlus, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default async function CreateDiaryPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm border border-gray-100 mb-2">
                        <BookPlus className="h-6 w-6 text-gray-900" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 font-serif">Create Shared space</h1>
                    <p className="text-sm text-muted-foreground italic">Your journey of a thousand miles begins here.</p>
                </div>

                <Card className="border-border/50 shadow-xl shadow-gray-200/50 backdrop-blur-sm bg-white/80">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-lg">Diary details</CardTitle>
                        <CardDescription>
                            Give your diary a name to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={createDiary} className="space-y-5">
                            <div className="space-y-2.5">
                                <Label htmlFor="name">Diary Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="e.g. Our Private Story"
                                    autoFocus
                                />
                            </div>
                            <SubmitButton
                                iconName="sparkles"
                                pendingText="Creating..."
                                className="w-full h-11 rounded-xl text-sm shadow-lg shadow-gray-200"
                            >
                                Start our odyssey
                            </SubmitButton>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center pt-2">
                        <Link href="/" className="text-xs text-muted-foreground hover:text-gray-900 transition-colors">
                            Actually, let's go back
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
