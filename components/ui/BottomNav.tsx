'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bomb, Home, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
    const pathname = usePathname()

    const tabs = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Profile', href: '/profile', icon: User },
    ]

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1000">
            <nav className="flex items-center gap-2 p-2 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-3xl">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = pathname === tab.href

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "relative flex items-center justify-center p-3 rounded-2xl transition-all duration-300 group overflow-hidden",
                                isActive
                                    ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                            )}
                        >
                            <Icon
                                size={20}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={cn(
                                    "relative z-10 transition-transform duration-300",
                                    isActive ? "scale-110" : "group-hover:scale-110"
                                )}
                            />
                            {isActive && (
                                <span className="sr-only">{tab.name}</span>
                            )}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
