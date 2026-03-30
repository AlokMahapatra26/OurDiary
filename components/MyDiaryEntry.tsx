'use client'

import { useState, useEffect } from 'react'
import { updateEntry } from '@/app/diary/[id]/actions'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Pencil, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getWindowStatus } from '@/lib/time'

interface MyDiaryEntryProps {
    diaryId: string
    diaryDate: string
    userName: string
    entryUrlSafeDate: string
    myEntry: { id: string; content: string } | undefined
}

export function MyDiaryEntry({
    diaryId,
    diaryDate,
    userName,
    entryUrlSafeDate,
    myEntry,
}: MyDiaryEntryProps) {
    const [devMode, setDevMode] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isWindowOpen, setIsWindowOpen] = useState(false)
    const [isViewingToday, setIsViewingToday] = useState(false)
    const [isClientLoaded, setIsClientLoaded] = useState(false)

    useEffect(() => {
        const checkDevMode = () => {
            const saved = localStorage.getItem('ourdiary_dev_mode') === 'true'
            setDevMode(saved)
        }
        checkDevMode()
        window.addEventListener('devModeChanged', checkDevMode)
        window.addEventListener('storage', checkDevMode)

        const { open, diaryDate: localLogicalDate } = getWindowStatus()
        setIsWindowOpen(open)
        setIsViewingToday(diaryDate === localLogicalDate)
        setIsClientLoaded(true)

        return () => {
            window.removeEventListener('devModeChanged', checkDevMode)
            window.removeEventListener('storage', checkDevMode)
        }
    }, [diaryDate])

    if (!isClientLoaded) {
        // Render a basic placeholder to prevent hydration mismatch while client exact time loads
        return (
            <div className="relative z-10 flex gap-4 animate-bouncy">
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm shrink-0">
                    <AvatarFallback className="bg-gray-900 text-white text-[10px]">
                        {userName}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-900">You</span>
                    </div>
                </div>
            </div>
        )
    }

    const canEdit = !!myEntry && ((isViewingToday && isWindowOpen) || devMode)

    return (
        <div className="relative z-10 flex gap-4 animate-bouncy">
            <Avatar className="h-9 w-9 border-2 border-white shadow-sm shrink-0">
                <AvatarFallback className="bg-gray-900 text-white text-[10px]">
                    {userName}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-900">You</span>
                    </div>

                    {canEdit && !isEditing && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-gray-900 transition-colors"
                        >
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                        </Button>
                    )}
                    {isEditing && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-gray-900 transition-colors"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                        </Button>
                    )}
                </div>

                {!myEntry ? (
                    <div className="bg-muted/30 border border-dashed border-border/60 rounded-2xl p-5 text-center">
                        <p className="text-xs text-muted-foreground italic">
                            You haven't added your piece to the story.
                        </p>
                    </div>
                ) : isEditing ? (
                    <form action={(formData) => {
                        updateEntry(formData)
                        setIsEditing(false)
                    }} className="space-y-3">
                        <input type="hidden" name="diaryId" value={diaryId} />
                        <input type="hidden" name="entryId" value={myEntry.id.toString()} />
                        <input type="hidden" name="diaryDate" value={entryUrlSafeDate} />
                        {devMode && <input type="hidden" name="devMode" value="true" />}

                        <div className="bg-white border border-border/60 rounded-2xl p-2 shadow-lg shadow-gray-200/40">
                            <Textarea
                                name="content"
                                defaultValue={myEntry.content}
                                required
                                className="min-h-[120px] bg-transparent border-none focus-visible:ring-0 resize-none text-sm leading-relaxed"
                            />
                        </div>
                        <SubmitButton
                            iconName="save"
                            pendingText="Saving..."
                            className="w-full h-9 rounded-xl text-xs"
                        >
                            Save Changes
                        </SubmitButton>
                    </form>
                ) : (
                    <div className="bg-white border border-border/40 rounded-2xl rounded-tl-none p-5 shadow-lg shadow-gray-200/40 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                        {myEntry.content}
                    </div>
                )}
            </div>
        </div>
    )
}
