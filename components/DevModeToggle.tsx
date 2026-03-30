'use client'

import { useState, useEffect } from 'react'
import { Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DevModeToggle() {
    const [isDev, setIsDev] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('ourdiary_dev_mode') === 'true'
        setIsDev(saved)
    }, [])

    const toggle = () => {
        const newValue = !isDev
        setIsDev(newValue)
        localStorage.setItem('ourdiary_dev_mode', String(newValue))
        // Dispatch event for other components (like DiaryWriteSection)
        window.dispatchEvent(new Event('devModeChanged'))
    }

    return (
        <div className="flex items-center justify-between w-full bg-white border border-border/50 text-gray-600 rounded-2xl px-5 py-4 text-sm hover:bg-gray-50 transition-all group active:scale-[0.98] shadow-sm">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    isDev ? "bg-gray-900 text-white" : "bg-gray-50 text-muted-foreground group-hover:bg-white"
                )}>
                    <Terminal className="h-4 w-4" />
                </div>
                <div>
                    <p className="font-medium text-gray-900">Developer Mode</p>
                    <p className="text-[10px] text-muted-foreground">Bypass writing window restrictions</p>
                </div>
            </div>
            <button
                type="button"
                onClick={toggle}
                className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    isDev ? "bg-primary" : "bg-gray-200"
                )}
            >
                <span
                    className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        isDev ? "translate-x-5" : "translate-x-0"
                    )}
                />
            </button>
        </div>
    )
}
