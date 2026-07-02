'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import EventModal from '@/components/admin/EventModal'
import { Calendar, MapPin, Clock, Plus, Pencil, Trash2 } from 'lucide-react'
import api from '@/services/api'

interface Event {
    id: string
    title: string
    type: string
    location: string | null
    startTime: string
    endTime: string | null
    description: string | null
    _count: { attendances: number }
}

const eventTypeColors: Record<string, string> = {
    SUNDAY_SERVICE: 'bg-blue-100 text-blue-700',
    BIBLE_STUDY: 'bg-green-100 text-green-700',
    PRAYER_MEETING: 'bg-purple-100 text-purple-700',
    SPECIAL_PROGRAM: 'bg-orange-100 text-orange-700',
    OTHER: 'bg-slate-100 text-slate-700',
}

export default function WorkerEventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    // const [editingEvent, setEditingEvent] = useState<Event | null>(null)

    const fetchEvents = async () => {
        const { data } = await api.get('/events')
        setEvents(data.data)
        setLoading(false)
    }

    useEffect(() => { fetchEvents() }, [])

    const handleOpenCreate = () => {
        setModalOpen(true)
    }

    return (
        <DashboardLayout role="WORKER">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Events</h1>
                        <p className="text-slate-500">
                            Manage church events and services
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-[#693565]"
                    >
                        <Plus className="h-4 w-4" />
                        New Event
                    </Button>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading events..." />
                    </div>
                ) : events.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="No events yet"
                        description="Create your first church event"
                        action={
                            <Button onClick={handleOpenCreate} className="flex items-center gap-2 bg-[#693565]">
                                <Plus className="h-4 w-4" /> New Event
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {events.map((event) => (
                            <Card
                                key={event.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-base font-semibold text-slate-800 leading-tight">
                                            {event.title}
                                        </CardTitle>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${eventTypeColors[event.type]}`}>
                                            {event.type.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar className="h-4 w-4 shrink-0" />
                                        {new Date(event.startTime).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Clock className="h-4 w-4 shrink-0" />
                                        {new Date(event.startTime).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                    {event.location && (
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <MapPin className="h-4 w-4 shrink-0" />
                                            {event.location}
                                        </div>
                                    )}
                                    <div className="pt-2 border-t flex items-center justify-between">
                                        <p className="text-sm text-slate-500">
                                            <span className="font-medium text-slate-800">
                                                {event._count.attendances}
                                            </span>{' '}
                                            attendees
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <EventModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={fetchEvents}
            />
        </DashboardLayout>
    )
}