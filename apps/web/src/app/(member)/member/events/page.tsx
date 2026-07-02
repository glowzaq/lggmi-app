'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import { Calendar, MapPin, Clock } from 'lucide-react'
import api from '@/services/api'

interface Event {
    id: string
    title: string
    type: string
    location: string | null
    startTime: string
    endTime: string | null
    description: string | null
}

const typeColors: Record<string, string> = {
    SUNDAY_SERVICE: 'bg-blue-100 text-blue-700',
    BIBLE_STUDY: 'bg-green-100 text-green-700',
    PRAYER_MEETING: 'bg-purple-100 text-purple-700',
    SPECIAL_PROGRAM: 'bg-orange-100 text-orange-700',
    YOUTH_SERVICE: 'bg-pink-100 text-pink-700',
    OTHER: 'bg-slate-100 text-slate-600',
}

export default function MemberEventsPage() {
    const [upcoming, setUpcoming] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/events/upcoming').then(({ data }) => {
            setUpcoming(data.data)
            setLoading(false)
        })
    }, [])

    return (
        <DashboardLayout role="MEMBER">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Upcoming Events
                    </h1>
                    <p className="text-slate-500">
                        Stay up to date with church activities
                    </p>
                </div>

                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner text="Loading events..." />
                    </div>
                ) : upcoming.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="No upcoming events"
                        description="Check back soon for new events and services"
                    />
                ) : (
                    <div className="space-y-4">
                        {upcoming.map((event) => {
                            const date = new Date(event.startTime)
                            return (
                                <Card
                                    key={event.id}
                                    className="hover:shadow-md transition-shadow"
                                >
                                    <CardContent className="pt-4">
                                        <div className="flex gap-4">
                                            {/* Date block */}
                                            <div className="text-center bg-blue-50 rounded-xl
                        px-3 py-2 shrink-0 min-w-[56px]">
                                                <p className="text-xs text-blue-500 font-medium">
                                                    {date.toLocaleString('default', { month: 'short' })}
                                                </p>
                                                <p className="text-2xl font-bold text-blue-700 leading-tight">
                                                    {date.getDate()}
                                                </p>
                                                <p className="text-xs text-blue-400">
                                                    {date.toLocaleString('default', { weekday: 'short' })}
                                                </p>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-semibold text-slate-800">
                                                        {event.title}
                                                    </h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full
                            font-medium shrink-0 ${typeColors[event.type]}`}>
                                                        {event.type.replace(/_/g, ' ')}
                                                    </span>
                                                </div>

                                                {event.description && (
                                                    <p className="text-sm text-slate-500 line-clamp-2">
                                                        {event.description}
                                                    </p>
                                                )}

                                                <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {date.toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                        {event.endTime && ` – ${new Date(event.endTime)
                                                            .toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}`}
                                                    </span>
                                                    {event.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {event.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}