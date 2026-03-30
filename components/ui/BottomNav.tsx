'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User } from 'lucide-react'

export function BottomNav() {
    const pathname = usePathname()

    const tabs = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Profile', href: '/profile', icon: User },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-3 pb-8">
            <div className="max-w-sm mx-auto flex items-center justify-around">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = pathname === tab.href

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px]">{tab.name}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
