'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatCard from '@/components/shared/StatCard'
import { Users, Calendar, Heart, Bell } from 'lucide-react'
import api from '@/services/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts'

export default function WorkerDashboard() {
    const [memberStats, setMemberStats] = useState<any>(null)
    const [announcements, setAnnouncements] = useState<any>(null)
    const [attendanceStats, setAttendanceStats] = useState<any>(null)
    const [prayerStats, setPrayerStats] = useState<any>(null)
    const [eventStats, setEventStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/users/stats'),
            api.get('/announcements/active'),
            api.get('/prayer-requests/stats'),
            api.get('/events/stats'),
            api.get('/attendance/stats'),
        ]).then(([m, a, p, e, att]) => {
            setMemberStats(m.data.data)
            setAnnouncements(a.data.data)
            setPrayerStats(p.data.data)
            setEventStats(e.data.data)
            setAttendanceStats(att.data.data)
            setLoading(false)
        })
    }, [])

    return (
        <DashboardLayout role="WORKER">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Worker Dashboard
                    </h1>
                    <p className="text-slate-500">
                        Welcome. Here's what's happening today.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Members"
                        value={memberStats?.total ?? '—'}
                        icon={Users}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                        subtitle={`+${memberStats?.newThisMonth ?? 0} this month`}
                        subtitleColor="text-green-600"
                    />
                    <StatCard
                        title="Upcoming Events"
                        value={eventStats?.upcoming ?? '—'}
                        icon={Calendar}
                        iconColor="text-purple-600"
                        iconBg="bg-purple-50"
                    />
                    <StatCard
                        title="Announcements"
                        value={announcements?.length ?? '—'}
                        icon={Bell}
                        iconColor="text-orange-600"
                        iconBg="bg-orange-50"
                    />
                    <StatCard
                        title="Prayer Requests"
                        value={prayerStats?.pending ?? '—'}
                        icon={Heart}
                        iconColor="text-red-600"
                        iconBg="bg-red-50"
                        // subtitle="pending"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Attendance Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={attendanceStats?.trend ?? []}>
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
                                        dot={{ r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
} 