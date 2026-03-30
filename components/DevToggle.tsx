'use client'

import { useState } from 'react'

export function DevToggle({ children }: { children: (devMode: boolean) => React.ReactNode }) {
    const [devMode, setDevMode] = useState(false)

    return (
        <>
            {children(devMode)}
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
