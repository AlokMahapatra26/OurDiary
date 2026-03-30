import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout, updateProfile } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DeleteAccountButton from './DeleteAccountButton'
import { Download, LogOut, Settings, User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default async function ProfilePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    const params = await searchParams

    if (error || !user) {
        redirect('/login')
    }

    const name = user.user_metadata?.name || ''
    const age = user.user_metadata?.age || ''
    const email = user.email || ''

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm border border-gray-100 mb-2">
                        <User className="h-6 w-6 text-gray-900" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Profile Settings</h1>
                    <p className="text-sm text-muted-foreground italic">Manage your account and preferences.</p>
                </div>

                <Card className="border-border/50 shadow-xl shadow-gray-200/50 backdrop-blur-sm bg-white/80">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">General</span>
                        </div>
                        <CardTitle className="text-lg">Personal Details</CardTitle>
                        <CardDescription>
                            Update your profile information here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pb-0">
                        {params?.error && (
                            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-xl text-xs font-medium animate-in zoom-in-95 duration-300">
                                {params.error as string}
                            </div>
                        )}

                        {params?.message && (
                            <div className="bg-primary/5 text-primary px-4 py-3 rounded-xl text-xs font-medium border border-primary/10 animate-in zoom-in-95 duration-300">
                                {params.message as string}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Email address</Label>
                            <p className="text-sm font-medium px-1 select-none">{email}</p>
                        </div>

                        <Separator className="bg-border/50" />

                        <form action={updateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={name}
                                        required
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        defaultValue={age}
                                        required
                                        placeholder="Age"
                                    />
                                </div>
                            </div>
                            <SubmitButton
                                iconName="save"
                                pendingText="Saving..."
                                className="w-full h-11 rounded-xl text-sm"
                            >
                                Update Profile
                            </SubmitButton>
                        </form>
                    </CardContent>

                    <div className="p-6 pt-8 space-y-8">
                        <Separator className="bg-border/50" />

                        <div className="w-full space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">Manage Data</h3>
                                <a
                                    href="/api/export-diary"
                                    download
                                    className="flex items-center justify-between w-full bg-white border border-border/50 text-gray-600 rounded-2xl px-5 py-4 text-sm hover:bg-gray-50 transition-all group active:scale-[0.98] shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                                            <Download className="h-4 w-4 text-muted-foreground group-hover:text-gray-900 transition-colors" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Export Diary</p>
                                            <p className="text-[10px] text-muted-foreground">Download all entries as JSON</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono text-muted-foreground group-hover:text-gray-500 transition-colors bg-gray-100 px-2 py-0.5 rounded-full">.json</span>
                                </a>
                            </div>

                            <div className="space-y-3 pb-2">
                                <form action={logout}>
                                    <SubmitButton
                                        iconName="log-out"
                                        variant="outline"
                                        pendingText="Logging out..."
                                        className="w-full h-11 rounded-xl text-xs text-muted-foreground border-border/50 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                                    >
                                        Log out of account
                                    </SubmitButton>
                                </form>

                                <DeleteAccountButton />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
