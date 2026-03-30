'use client'

import { useFormStatus } from 'react-dom'
import { Loader2, UserPlus, LogIn, Save, LogOut, Trash2, LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
    'user-plus': UserPlus,
    'log-in': LogIn,
    'save': Save,
    'log-out': LogOut,
    'trash': Trash2,
}

interface SubmitButtonProps {
    children: React.ReactNode
    pendingText?: string
    className?: string
    iconName?: keyof typeof iconMap
}

export function SubmitButton({
    children,
    pendingText = 'Please wait...',
    className = '',
    iconName
}: SubmitButtonProps) {
    const { pending } = useFormStatus()
    const Icon = iconName ? iconMap[iconName] : null

    return (
        <button
            type="submit"
            disabled={pending}
            className={`relative flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        >
            {pending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin text-current" />
                    <span>{pendingText}</span>
                </>
            ) : (
                <>
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{children}</span>
                </>
            )}
        </button>
    )
}
