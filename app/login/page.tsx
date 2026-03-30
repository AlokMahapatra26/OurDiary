'use client'

import { useState, use } from 'react'
import { login } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Book, Eye, EyeOff } from 'lucide-react'

export default function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = use(searchParams)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-8 animate-bouncy">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm border border-gray-100 mb-2">
                        <Book className="h-6 w-6 text-primary fill-primary/10" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome back</h1>
                    <p className="text-sm text-muted-foreground italic">Continue your shared journey.</p>
                </div>

                <Card className="border-border/50 shadow-xl shadow-gray-200/50 backdrop-blur-sm bg-white/80">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-lg">Log in</CardTitle>
                        <CardDescription>
                            Enter your email to sign in to your diary.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={login} className="space-y-5">
                            {params?.error && (
                                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-xl text-xs font-medium animate-in zoom-in-95 duration-300">
                                    {params.error as string}
                                </div>
                            )}

                            {params?.message && (
                                <div className="bg-primary/5 text-primary px-4 py-3 rounded-xl text-xs font-medium border border-primary/10">
                                    {params.message as string}
                                </div>
                            )}

                            <div className="space-y-2.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <SubmitButton
                                iconName="log-in"
                                pendingText="Logging in..."
                                className="w-full h-11 rounded-xl text-sm"
                            >
                                Continue
                            </SubmitButton>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-2">
                        <div className="text-center text-xs text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-primary font-medium hover:underline underline-offset-4 transition-all">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                <p className="px-8 text-center text-[10px] text-muted-foreground leading-relaxed">
                    By clicking continue, you agree to our{' '}
                    <span className="hover:text-primary cursor-pointer transition-colors underline decoration-dotted">Terms of Service</span> and{' '}
                    <span className="hover:text-primary cursor-pointer transition-colors underline decoration-dotted">Privacy Policy</span>.
                </p>
            </div>
        </div>
    )
}
