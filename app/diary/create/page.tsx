import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createDiary } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'

export default async function CreateDiaryPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <h1 className="text-xl font-medium mb-2 text-gray-900">Create a shared diary</h1>
                <p className="text-sm text-gray-400 mb-6">Give your diary a name, then invite your partner.</p>

                <form action={createDiary} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5" htmlFor="name">Diary name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="e.g. Our Story"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>
                    <SubmitButton
                        iconName="save"
                        pendingText="Creating..."
                        className="w-full bg-gray-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        Create diary
                    </SubmitButton>
                </form>
            </div>
        </div>
    )
}
