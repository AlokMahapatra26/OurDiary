'use client'

import { useState } from 'react'
import { SubmitButton } from '@/components/ui/SubmitButton'

interface DiaryWriteFormProps {
    diaryId: string
    diaryDate: string
    isWindowOpen: boolean
    hasExistingEntry: boolean
    windowMessage: string
    submitAction: (formData: FormData) => void
}

export function DiaryWriteSection({
    diaryId,
    diaryDate,
    isWindowOpen,
    hasExistingEntry,
    windowMessage,
    submitAction,
}: DiaryWriteFormProps) {
    const [devMode, setDevMode] = useState(false)
    const canWrite = (isWindowOpen || devMode) && !hasExistingEntry

    return (
        <>
            {/* Window status */}
            <div className={`rounded-xl px-4 py-3 text-sm mb-6 ${canWrite ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                {devMode && !isWindowOpen
                    ? '🛠️ Dev mode — writing is unlocked.'
                    : hasExistingEntry
                        ? "You've already written your entry for today."
                        : windowMessage}
            </div>

            {/* Write form */}
            {canWrite && (
                <form action={submitAction} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 mb-4">
                    <input type="hidden" name="diaryId" value={diaryId} />
                    <input type="hidden" name="diaryDate" value={diaryDate} />
                    {devMode && <input type="hidden" name="devMode" value="true" />}
                    <div>
                        <label className="block text-xs text-gray-400 mb-2" htmlFor="content">Your entry</label>
                        <textarea
                            id="content"
                            name="content"
                            rows={6}
                            required
                            placeholder="What happened today? How did you feel?"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                        />
                    </div>
                    <SubmitButton
                        iconName="save"
                        pendingText="Saving..."
                        className="w-full bg-gray-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        Save entry
                    </SubmitButton>
                </form>
            )}

            {/* Dev toggle */}
            <button
                type="button"
                onClick={() => setDevMode(prev => !prev)}
                className={`fixed bottom-4 right-4 z-50 text-[10px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${devMode
                        ? 'bg-green-50 border-green-200 text-green-600'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
            >
                {devMode ? '🟢 Dev mode' : '⚪ Dev off'}
            </button>
        </>
    )
}
