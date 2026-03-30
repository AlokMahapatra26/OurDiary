import { login } from './actions'
import Link from 'next/link'
import { SubmitButton } from '@/components/ui/SubmitButton'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <h1 className="text-xl font-medium mb-6 text-gray-900">Welcome back</h1>

                {params?.error && (
                    <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm mb-5">
                        {params.error as string}
                    </div>
                )}

                <form className="space-y-4" action={login}>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@email.com"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            placeholder="Your password"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>

                    <SubmitButton
                        iconName="log-in"
                        pendingText="Logging in..."
                        className="w-full bg-gray-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors mt-2 cursor-pointer"
                    >
                        Log in
                    </SubmitButton>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-gray-900 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    )
}
