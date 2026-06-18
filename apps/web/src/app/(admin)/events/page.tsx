'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Plus } from 'lucide-react'
import api from '@/services/api'

interface Event {
    id: string
    title: string
    type: string
    location: string
    startTime: string
    endTime: string
    _count: { attendances: number }
}

const eventTypeColors: Record<string, string> = {
    SUNDAY_SERVICE: 'bg-blue-100 text-blue-700',
    BIBLE_STUDY: 'bg-green-100 text-green-700',
    PRAYER_MEETING: 'bg-purple-100 text-purple-700',
    SPECIAL_PROGRAM: 'bg-orange-100 text-orange-700',
    YOUTH_SERVICE: 'bg-pink-100 text-pink-700',
    OTHER: 'bg-slate-100 text-slate-700',
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/events').then(({ data }) => {
            setEvents(data.data)
            setLoading(false)
        })
    }, [])

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Events</h1>
                    <p className="text-slate-500">Manage church events and services</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Event
                </Button>
            </div>

            {loading ? (
                <p className="text-slate-500">Loading events...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                        <Card key={event.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-base font-semibold text-slate-800">
                                        {event.title}
                                    </CardTitle>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium ${eventTypeColors[event.type]
                                            }`}
                                    >
                                        {event.type.replace('_', ' ')}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(event.startTime).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Clock className="h-4 w-4" />
                                    {new Date(event.startTime).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                                {event.location && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <MapPin className="h-4 w-4" />
                                        {event.location}
                                    </div>
                                )}
                                <div className="pt-2 border-t">
                                    <p className="text-sm text-slate-600">
                                        <span className="font-medium">{event._count.attendances}</span> attendees
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}