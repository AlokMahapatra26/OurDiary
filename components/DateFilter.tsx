'use client'

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { format, parseISO } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateFilterProps {
    initialDate: string // YYYY-MM-DD
    label: string // Formatted date string (we'll ignore this and use date-fns internally)
}

export function DateFilter({ initialDate }: DateFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [date, setDate] = React.useState<Date | undefined>(
        initialDate ? parseISO(initialDate) : new Date()
    )

    const handleSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return

        setDate(selectedDate)
        const formattedDate = format(selectedDate, "yyyy-MM-dd")

        const params = new URLSearchParams(searchParams.toString())
        params.set('date', formattedDate)

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-gray-900 group transition-all font-normal flex items-center gap-1.5",
                        !date && "text-muted-foreground"
                    )}
                >
                    <span className="text-xs">
                        {date ? format(date, "EEEE, MMMM d, yyyy") : "Select date"}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-0 group-hover:translate-y-0.5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    className="rounded-2xl"
                />
            </PopoverContent>
        </Popover>
    )
}
