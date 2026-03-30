'use client'

import { useFormStatus } from 'react-dom'
import { Loader2, UserPlus, LogIn, Save, LogOut, Trash2, LucideIcon, Book, Send, PenLine, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const iconMap: Record<string, LucideIcon> = {
    'user-plus': UserPlus,
    'log-in': LogIn,
    'save': Save,
    'log-out': LogOut,
    'trash': Trash2,
    'book': Book,
    'send': Send,
    'pen-line': PenLine,
    'sparkles': Sparkles,
}

interface SubmitButtonProps {
    children: React.ReactNode
    pendingText?: string
    className?: string
    iconName?: keyof typeof iconMap
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export function SubmitButton({
    children,
    pendingText = 'Please wait...',
    className = '',
    iconName,
    variant = 'default'
}: SubmitButtonProps) {
    const { pending } = useFormStatus()
    const Icon = iconName ? iconMap[iconName] : null

    return (
        <Button
            type="submit"
            disabled={pending}
            variant={variant}
            className={className}
        >
            {pending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{pendingText}</span>
                </>
            ) : (
                <>
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{children}</span>
                </>
            )}
        </Button>
    )
}
