'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/shared/Spinner'
import EmptyState from '@/components/shared/EmptyState'
import { CheckSquare, Check, X, Clock } from 'lucide-react'
import api from '@/services/api'

interface Event {
    id: string
    title: string
    type: string
    startTime: string
}

interface Member {
    id: string
    firstName: string
    lastName: string
    gender: string | null
}

interface AttendanceRecord {
    memberId: string
    status: 'PRESENT' | 'ABSENT' | 'EXCUSED'
}

const statusConfig = {
    PRESENT: {
        label: 'Present',
        style: 'bg-green-600 text-white border-green-600',
        icon: Check,
    },
    ABSENT: {
        label: 'Absent',
        style: 'bg-red-500 text-white border-red-500',
        icon: X,
    },
    EXCUSED: {
        label: 'Excused',
        style: 'bg-orange-400 text-white border-orange-400',
        icon: Clock,
    },
}

export default function AdminAttendancePage() {
    const [events, setEvents] = useState<Event[]>([])
    const [members, setMembers] = useState<Member[]>([])
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [records, setRecords] = useState<Record<string, AttendanceRecord>>({})
    const [existingAttendance, setExistingAttendance] = useState<any[]>([])
    const [loadingEvents, setLoadingEvents] = useState(true)
    const [loadingMembers, setLoadingMembers] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        api.get('/events').then(({ data }) => {
            setEvents(data.data)
            setLoadingEvents(false)
        })
    }, [])

    const handleSelectEvent = async (event: Event) => {
        setSelectedEvent(event)
        setSaved(false)
        setLoadingMembers(true)

        const [membersRes, attendanceRes] = await Promise.all([
            api.get('/members'),
            api.get(`/attendance/event/${event.id}`),
        ])

        const memberList: Member[] = membersRes.data.data
        const existing: any[] = attendanceRes.data.data.attendances

        setMembers(memberList)
        setExistingAttendance(existing)

        const initialRecords: Record<string, AttendanceRecord> = {}
        memberList.forEach((m) => {
            const found = existing.find((a) => a.memberId === m.id)
            initialRecords[m.id] = {
                memberId: m.id,
                status: found ? found.status : 'PRESENT',
            }
        })

        setRecords(initialRecords)
        setLoadingMembers(false)
    }

    const toggleStatus = (memberId: string) => {
        setRecords((prev) => {
            const current = prev[memberId]?.status || 'PRESENT'
            const cycle: Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'> = {
                PRESENT: 'ABSENT',
                ABSENT: 'EXCUSED',
                EXCUSED: 'PRESENT',
            }
            return {
                ...prev,
                [memberId]: { memberId, status: cycle[current] },
            }
        })
    }

    const setAllPresent = () => {
        const updated: Record<string, AttendanceRecord> = {}
        members.forEach((m) => {
            updated[m.id] = { memberId: m.id, status: 'PRESENT' }
        })
        setRecords(updated)
    }

    const handleSave = async () => {
        if (!selectedEvent) return
        setSaving(true)

        const payload = {
            eventId: selectedEvent.id,
            records: Object.values(records),
        }

        await api.post('/attendance/bulk', payload)
        setSaving(false)
        setSaved(true)
    }

    const summary = {
        present: Object.values(records).filter((r) => r.status === 'PRESENT').length,
        absent: Object.values(records).filter((r) => r.status === 'ABSENT').length,
        excused: Object.values(records).filter((r) => r.status === 'EXCUSED').length,
    }

    return (
        <DashboardLayout role="ADMIN">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
                    <p className="text-slate-500">
                        Select an event and mark member attendance
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-slate-700">
                                Select Event
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loadingEvents ? (
                                <div className="py-8 flex justify-center">
                                    <Spinner size="sm" />
                                </div>
                            ) : events.length === 0 ? (
                                <p className="px-4 pb-4 text-sm text-slate-400">
                                    No events found
                                </p>
                            ) : (
                                <div className="divide-y max-h-[500px] overflow-y-auto">
                                    {events.map((event) => (
                                        <button
                                            key={event.id}
                                            onClick={() => handleSelectEvent(event)}
                                            className={`w-full text-left px-4 py-3 transition-colors
                        hover:bg-slate-50
                        ${selectedEvent?.id === event.id
                                                    ? 'bg-blue-50 border-l-2 border-[#683565]'
                                                    : ''
                                                }`}
                                        >
                                            <p className="text-sm font-medium text-black truncate">
                                                {event.title}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {new Date(event.startTime).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-4">
                        {!selectedEvent ? (
                            <Card>
                                <CardContent className="py-20">
                                    <EmptyState
                                        icon={CheckSquare}
                                        title="No event selected"
                                        description="Select an event from the list to mark attendance"
                                    />
                                </CardContent>
                            </Card>
                        ) : loadingMembers ? (
                            <Card>
                                <CardContent className="py-20 flex justify-center">
                                    <Spinner text="Loading members..." />
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        {
                                            label: 'Present',
                                            value: summary.present,
                                            color: 'text-emerald-700',
                                            bg: 'bg-emerald-50/60',
                                        },
                                        {
                                            label: 'Absent',
                                            value: summary.absent,
                                            color: 'text-rose-700',
                                            bg: 'bg-rose-50/60',
                                        },
                                        {
                                            label: 'Excused',
                                            value: summary.excused,
                                            color: 'text-amber-700',
                                            bg: 'bg-amber-100',
                                        },
                                    ].map((s) => (
                                        <Card key={s.label}>
                                            <CardContent className={`pt-4 pb-3 ${s.bg}`}>
                                                <p className={`text-2xl font-bold ${s.color}`}>
                                                    {s.value}
                                                </p>
                                                <p className="text-xs text-slate-500">{s.label}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-500">
                                        <span className="font-medium text-slate-800">
                                            {selectedEvent.title}
                                        </span>{' '}
                                        · {members.length} members
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={setAllPresent}
                                        >
                                            Mark All Present
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSave}
                                            disabled={saving || saved}
                                        >
                                            {saving
                                                ? 'Saving...'
                                                : saved
                                                    ? '✓ Saved'
                                                    : 'Save Attendance'}
                                        </Button>
                                    </div>
                                </div>

                                <Card>
                                    <CardContent className="p-0">
                                        <div className="divide-y max-h-[500px] overflow-y-auto">
                                            {members.map((member) => {
                                                const status =
                                                    records[member.id]?.status || 'PRESENT'
                                                const config = statusConfig[status]

                                                return (
                                                    <div
                                                        key={member.id}
                                                        className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-[#683565] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                                                                {member.firstName[0]}{member.lastName[0]}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-800">
                                                                    {member.firstName} {member.lastName}
                                                                </p>
                                                                {member.gender && (
                                                                    <p className="text-xs text-slate-400 capitalize">
                                                                        {member.gender.toLowerCase()}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => toggleStatus(member.id)}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5
                                rounded-full text-xs font-medium border
                                transition-all ${config.style}`}
                                                        >
                                                            <config.icon className="h-3 w-3" />
                                                            {config.label}
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>

                                <p className="text-xs text-black text-center">
                                    Tap a member's status button to cycle through
                                    Present → Absent → Excused
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}