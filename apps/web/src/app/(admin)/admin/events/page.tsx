'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Plus, Edit2 } from 'lucide-react'
import api from '@/services/api'
import EventModal from '@/components/admin/EventModal'

interface Event {
    id: string
    title: string
    type: string
    location: string
    description?: string
    startTime: string
    endTime: string
    _count: { attendances: number }
}

const eventTypeColors: Record<string, string> = {
    SUNDAY_SERVICE: 'bg-[#693465]/10 text-[#693465]',
    BIBLE_STUDY: 'bg-green-100 text-green-700',
    PRAYER_MEETING: 'bg-indigo-100 text-indigo-700',
    SPECIAL_PROGRAM: 'bg-rose-100 text-rose-700',
    YOUTH_SERVICE: 'bg-amber-100 text-amber-700',
    OTHER: 'bg-slate-100 text-slate-700',
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined)

    const fetchEvents = () => {
        setLoading(true)
        api.get('/events').then(({ data }) => {
            setEvents(data.data)
            setLoading(false)
        }).catch(() => setLoading(false))
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleCreateOpen = () => {
        setSelectedEvent(undefined)
        setIsModalOpen(true)
    }

    const handleEditOpen = (event: Event) => {
        setSelectedEvent(event)
        setIsModalOpen(true)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Events</h1>
                    <p className="text-slate-500">Manage church events and services</p>
                </div>

                <Button
                    onClick={handleCreateOpen}
                    className="flex items-center gap-2 bg-[#693465] hover:bg-[#52284f] text-white"
                >
                    <Plus className="h-4 w-4" />
                    New Event
                </Button>
            </div>

            {loading ? (
                <p className="text-slate-500">Loading events...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                        <Card key={event.id} className="hover:shadow-md transition-shadow relative group">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-4">
                                    <CardTitle className="text-base font-semibold text-slate-800 line-clamp-1">
                                        {event.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${eventTypeColors[event.type] || eventTypeColors.OTHER
                                                }`}
                                        >
                                            {event.type.replace(/_/g, ' ')}
                                        </span>

                                        <button
                                            onClick={() => handleEditOpen(event)}
                                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
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
                                        <span className="font-medium">{event._count?.attendances ?? 0}</span> attendees
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchEvents}
                event={selectedEvent}
            />
        </div>
    )
}