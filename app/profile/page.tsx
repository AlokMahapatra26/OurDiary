import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout, updateProfile } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'

import DeleteAccountButton from './DeleteAccountButton'

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <h1 className="text-xl font-medium mb-6 text-gray-900">Your profile</h1>

                {params?.error && (
                    <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm mb-5">
                        {params.error as string}
                    </div>
                )}

                {params?.message && (
                    <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl text-sm mb-5">
                        {params.message as string}
                    </div>
                )}

                <form action={updateProfile} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Email</p>
                        <p className="text-sm text-gray-400 select-none">{email}</p>
                    </div>

                    <div className="border-t border-gray-100" />

                    <div>
                        <label className="block text-xs text-gray-400 mb-1" htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={name}
                            required
                            className="w-full text-sm text-gray-900 bg-transparent border-none p-0 focus:ring-0 focus:outline-none placeholder:text-gray-200"
                        />
                    </div>

                    <div className="border-t border-gray-100" />

                    <div>
                        <label className="block text-xs text-gray-400 mb-1" htmlFor="age">Age</label>
                        <input
                            id="age"
                            name="age"
                            type="number"
                            defaultValue={age}
                            required
                            className="w-full text-sm text-gray-900 bg-transparent border-none p-0 focus:ring-0 focus:outline-none placeholder:text-gray-200"
                        />
                    </div>

                    <SubmitButton
                        iconName="save"
                        pendingText="Saving..."
                        className="w-full bg-gray-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors mt-2 cursor-pointer"
                    >
                        Update profile
                    </SubmitButton>
                </form>

                <div className="mt-8 space-y-3">
                    <form action={logout}>
                        <SubmitButton
                            iconName="log-out"
                            pendingText="Logging out..."
                            className="w-full bg-white border border-gray-200 text-gray-500 rounded-xl px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            Log out
                        </SubmitButton>
                    </form>

                    <DeleteAccountButton />
                </div>
            </div>
        </div>
    )
}
