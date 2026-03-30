import { signup } from './actions'
import Link from 'next/link'
import { SubmitButton } from '@/components/ui/SubmitButton'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <h1 className="text-xl font-medium mb-6 text-gray-900">Create account</h1>

                {params?.error && (
                    <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm mb-5">
                        {params.error as string}
                    </div>
                )}

                <form className="space-y-4" action={signup}>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5" htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Your name"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5" htmlFor="age">Age</label>
                        <input
                            id="age"
                            name="age"
                            type="number"
                            required
                            min="1"
                            max="120"
                            placeholder="Your age"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>

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
                        <label className="block text-xs text-gray-500 mb-1.5" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            placeholder="Min 6 characters"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>

                    <SubmitButton
                        iconName="user-plus"
                        pendingText="Creating account..."
                        className="w-full bg-gray-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors mt-2 cursor-pointer"
                    >
                        Sign up
                    </SubmitButton>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-gray-900 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    )
}
