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
            <div className="w-full max-w-sm pb-24">
                <h1 className="text-xl font-medium text-gray-900 mb-2">Profile settings</h1>
                <p className="text-sm text-gray-400 mb-8">Manage your account and preferences.</p>

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

                <form action={updateProfile} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
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

                <div className="mt-8 space-y-6">
                    <div>
                        <p className="text-xs text-gray-400 mb-3 px-1 hover:text-gray-600 transition-colors">Manage your data</p>
                        <a
                            href="/api/export-diary"
                            download
                            className="flex items-center justify-between w-full bg-white border border-gray-200 text-gray-600 rounded-2xl px-5 py-4 text-sm hover:bg-gray-50 transition-all group active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download text-gray-400 group-hover:text-gray-900 transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Export diary</p>
                                    <p className="text-[10px] text-gray-400">Download all entries as JSON</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-300 group-hover:text-gray-500 transition-colors">.json</span>
                        </a>
                    </div>

                    <div className="space-y-3">
                        <form action={logout}>
                            <SubmitButton
                                iconName="log-out"
                                pendingText="Logging out..."
                                className="w-full bg-white border border-gray-200 text-gray-400 rounded-xl px-4 py-2.5 text-xs hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                Log out
                            </SubmitButton>
                        </form>

                        <DeleteAccountButton />
                    </div>
                </div>
            </div>
        </div>
    )
}
