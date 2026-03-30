'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Calendar } from 'lucide-react'

interface DateFilterProps {
    initialDate: string // YYYY-MM-DD
    label: string // Formatted date string
}

export function DateFilter({ initialDate, label }: DateFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value
        const params = new URLSearchParams(searchParams.toString())
        if (newDate) {
            params.set('date', newDate)
        } else {
            params.delete('date')
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="relative inline-flex items-center group">
            <div className="flex flex-col">
                <p className="text-xs text-gray-400 mt-0.5 pointer-events-none group-hover:text-gray-600 transition-colors flex items-center gap-1.5">
                    {label}
                    <Calendar size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
            </div>
            <input
                type="date"
                defaultValue={initialDate}
                onChange={handleDateChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Select date"
            />
        </div>
    )
}
