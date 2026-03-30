'use client'

import { useState } from 'react'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, Lock, Sparkles, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DiaryWriteFormProps {
    diaryId: string
    diaryDate: string
    isWindowOpen: boolean
    hasExistingEntry: boolean
    isViewingToday: boolean
    windowMessage: string
    submitAction: (formData: FormData) => void
}

export function DiaryWriteSection({
    diaryId,
    diaryDate,
    isWindowOpen,
    hasExistingEntry,
    isViewingToday,
    windowMessage,
    submitAction,
}: DiaryWriteFormProps) {
    const [devMode, setDevMode] = useState(false)
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

            {/* Write Card */}
            {canWrite && (
                <Card className="border-border/50 shadow-xl shadow-gray-200/40 bg-white/50 backdrop-blur-sm overflow-hidden animate-in zoom-in-95 duration-500">
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

            {/* Dev Toggle (Subtle) */}
            <button
                type="button"
                onClick={() => setDevMode(prev => !prev)}
                className={cn(
                    "fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-2xl border text-[10px] font-medium transition-all duration-500 group active:scale-95",
                    devMode
                        ? "bg-gray-900 border-gray-900 text-white shadow-lg shadow-black/20"
                        : "bg-white/50 backdrop-blur-md border-border/50 text-muted-foreground/50 hover:text-muted-foreground hover:border-border"
                )}
            >
                <Terminal className={cn("h-3 w-3", devMode ? "text-primary-foreground" : "text-muted-foreground/30")} />
                {devMode ? "Dev Active" : "Dev"}
            </button>
        </div>
    )
}
