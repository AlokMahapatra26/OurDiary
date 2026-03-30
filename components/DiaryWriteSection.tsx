'use client'

import { useState, useEffect } from 'react'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, Lock, Sparkles, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getWindowStatus } from '@/lib/time'

interface DiaryWriteFormProps {
    diaryId: string
    diaryDate: string
    hasExistingEntry: boolean
    submitAction: (formData: FormData) => void
}

export function DiaryWriteSection({
    diaryId,
    diaryDate,
    hasExistingEntry,
    submitAction,
}: DiaryWriteFormProps) {
    const [devMode, setDevMode] = useState(false)
    const [isWindowOpen, setIsWindowOpen] = useState(false)
    const [isViewingToday, setIsViewingToday] = useState(false)
    const [windowMessage, setWindowMessage] = useState("Checking time...")
    const [isClientLoaded, setIsClientLoaded] = useState(false)

    useEffect(() => {
        // Dev mode check
        const checkDevMode = () => {
            const saved = localStorage.getItem('ourdiary_dev_mode') === 'true'
            setDevMode(saved)
        }
        checkDevMode()
        window.addEventListener('devModeChanged', checkDevMode)
        window.addEventListener('storage', checkDevMode)

        // Time window check (runs on client browser time!)
        const { open, message, diaryDate: localLogicalDate } = getWindowStatus()
        setIsWindowOpen(open)
        setWindowMessage(message)
        setIsViewingToday(diaryDate === localLogicalDate)
        setIsClientLoaded(true)

        return () => {
            window.removeEventListener('devModeChanged', checkDevMode)
            window.removeEventListener('storage', checkDevMode)
        }
    }, [diaryDate])

    // Wait for client time check
    if (!isClientLoaded) return null

    const canWrite = ((isViewingToday && isWindowOpen) || devMode) && !hasExistingEntry

    return (
        <div className="space-y-6 mb-8">
            {/* Status Indicator */}
            <div className={cn(
                "flex items-start gap-3 rounded-2xl p-4 text-xs font-medium border animate-in fade-in slide-in-from-top-2 duration-500",
                canWrite
                    ? "bg-primary/5 border-primary/10 text-primary"
                    : "bg-muted/50 border-border/50 text-muted-foreground"
            )}>
                {hasExistingEntry ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : canWrite ? (
                    <Sparkles className="h-4 w-4 shrink-0" />
                ) : (
                    <Lock className="h-4 w-4 shrink-0" />
                )}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="leading-relaxed">
                            {devMode
                                ? `🛠️ Dev mode active — unlocking write for ${isViewingToday ? 'today' : diaryDate}.`
                                : hasExistingEntry
                                    ? "Your story for today is already safe in the vaults."
                                    : isViewingToday
                                        ? windowMessage
                                        : "The diary is currently closed for this date."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Write Card */}
            {canWrite && (
                <Card className="border-border/50 shadow-xl shadow-gray-200/40 bg-white/50 backdrop-blur-sm overflow-hidden animate-bouncy">
                    <form action={submitAction}>
                        <input type="hidden" name="diaryId" value={diaryId} />
                        <input type="hidden" name="diaryDate" value={diaryDate} />
                        {devMode && <input type="hidden" name="devMode" value="true" />}
                        <CardContent className="p-5 space-y-4">
                            <div className="space-y-2.5">
                                <Label htmlFor="content" className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Your entry</Label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    required
                                    placeholder="Pour your heart out..."
                                    className="min-h-[160px] bg-transparent border-none p-0 focus-visible:ring-0 resize-none text-base leading-relaxed placeholder:text-muted-foreground/30"
                                />
                            </div>
                            <SubmitButton
                                iconName="pen-line"
                                pendingText="Sealing..."
                                className="w-full h-11 rounded-xl shadow-lg shadow-gray-200"
                            >
                                Seal today's entry
                            </SubmitButton>
                        </CardContent>
                    </form>
                </Card>
            )}
        </div>
    )
}
