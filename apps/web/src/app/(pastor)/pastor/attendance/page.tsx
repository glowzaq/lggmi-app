'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Spinner from '@/components/shared/Spinner'
import EmptyState from '@/components/shared/EmptyState'
import { CheckSquare } from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis,
    Tooltip, ResponsiveContainer,
} from 'recharts'
import api from '@/services/api'

interface AttendanceEvent {
    event: { title: string; startTime: string; type: string }
    attendances: any[]
    summary: {
        total: number
        present: number
        absent: number
        excused: number
    }
}

export default function PastorAttendancePage() {
    const [events, setEvents] = useState<any[]>([])
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
    const [detail, setDetail] = useState<AttendanceEvent | null>(null)
    const [trend, setTrend] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingDetail, setLoadingDetail] = useState(false)

    useEffect(() => {
        Promise.all([
            api.get('/events'),
            api.get('/attendance/stats'),
        ]).then(([eventsRes, statsRes]) => {
            setEvents(eventsRes.data.data)
            setTrend(statsRes.data.data.trend)
            setLoading(false)
        })
    }, [])

    const handleSelectEvent = async (eventId: string) => {
        setSelectedEventId(eventId)
        setLoadingDetail(true)
        const { data } = await api.get(`/attendance/event/${eventId}`)
        setDetail(data.data)
        setLoadingDetail(false)
    }

    return (
        <DashboardLayout role="PASTOR">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
                    <p className="text-slate-500">
                        View attendance records across all services
                    </p>
                </div>

                {/* Trend chart */}
                {trend.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Attendance Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={trend}>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11 }}
                                        tickFormatter={(v) => v.split(' ')[0]}
                                    />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="present"
                                        stroke="#9c5e96"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Event list */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-slate-700">
                                Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="py-8 flex justify-center">
                                    <Spinner size="sm" />
                                </div>
                            ) : (
                                <div className="divide-y max-h-[400px] overflow-y-auto">
                                    {events.map((event) => (
                                        <button
                                            key={event.id}
                                            onClick={() => handleSelectEvent(event.id)}
                                            className={`w-full text-left px-4 py-3 transition-colors
                        hover:bg-slate-50
                        ${selectedEventId === event.id
                                                    ? 'bg-blue-50 border-l-2 border-[#d4b0d1]'
                                                    : ''
                                                }`}
                                        >
                                            <p className="text-sm font-medium text-slate-800 truncate">
                                                {event.title}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {new Date(event.startTime).toLocaleDateString()}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Attendance detail */}
                    <div className="lg:col-span-2">
                        {!selectedEventId ? (
                            <Card>
                                <CardContent className="py-16">
                                    <EmptyState
                                        icon={CheckSquare}
                                        title="Select an event"
                                        description="Click an event to view its attendance record"
                                    />
                                </CardContent>
                            </Card>
                        ) : loadingDetail ? (
                            <Card>
                                <CardContent className="py-16 flex justify-center">
                                    <Spinner text="Loading attendance..." />
                                </CardContent>
                            </Card>
                        ) : detail ? (
                            <div className="space-y-4">
                                {/* Summary */}
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { label: 'Total', value: detail.summary.total, color: 'text-slate-800' },
                                        { label: 'Present', value: detail.summary.present, color: 'text-green-600' },
                                        { label: 'Absent', value: detail.summary.absent, color: 'text-red-500' },
                                        { label: 'Excused', value: detail.summary.excused, color: 'text-orange-500' },
                                    ].map((s) => (
                                        <Card key={s.label}>
                                            <CardContent className="pt-3 pb-2 text-center">
                                                <p className={`text-xl font-bold ${s.color}`}>
                                                    {s.value}
                                                </p>
                                                <p className="text-xs text-slate-500">{s.label}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Attendance rate bar */}
                                <Card>
                                    <CardContent className="pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Attendance rate</span>
                                            <span className="font-semibold text-slate-800">
                                                {detail.summary.total > 0
                                                    ? Math.round(
                                                        (detail.summary.present / detail.summary.total) * 100
                                                    )
                                                    : 0}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#9c5e96] rounded-full transition-all"
                                                style={{
                                                    width:
                                                        detail.summary.total > 0
                                                            ? `${(detail.summary.present / detail.summary.total) * 100}%`
                                                            : '0%',
                                                }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Member list */}
                                <Card>
                                    <CardContent className="p-0">
                                        <div className="divide-y max-h-[400px] overflow-y-auto">
                                            {detail.attendances.map((a) => (
                                                <div
                                                    key={a.id}
                                                    className="flex items-center justify-between px-4 py-3"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-7 w-7 rounded-full bg-[#9c5e96] flex items-center justify-center text-white text-xs font-semibold">
                                                            {a.user.firstName[0]}{a.user.lastName[0]}
                                                        </div>
                                                        <p className="text-sm text-slate-800">
                                                            {a.user.firstName} {a.user.lastName}
                                                        </p>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.status === 'PRESENT'
                                                            ? 'bg-green-100 text-green-700'
                                                            : a.status === 'ABSENT'
                                                                ? 'bg-red-100 text-red-600'
                                                                : 'bg-orange-100 text-orange-600'
                                                        }`}>
                                                        {a.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}