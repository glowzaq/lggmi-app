'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatCard from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Bell, Globe, Heart } from 'lucide-react'
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts'
import api from '@/services/api'

export default function WorkerDashboard() {
    const [memberStats, setMemberStats] = useState<any>(null)
    const [eventStats, setEventStats] = useState<any>(null)
    const [evangelismStats, setEvangelismStats] = useState<any>(null)
    const [recentMembers, setRecentMembers] = useState<any[]>([])
    const [announcements, setAnnouncements] = useState<any>(null)
    const [attendanceStats, setAttendanceStats] = useState<any>(null)
    const [prayerStats, setPrayerStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/users/stats'),
            api.get('/events/stats'),
            api.get('/evangelism/stats'),
            api.get('/users'),
            api.get('/announcements/active'),
            api.get('/prayer-requests/stats'),
            api.get('/attendance/stats'),
        ]).then(([ms, e, ev, m, a, p, att]) => {
            setMemberStats(ms.data.data)
            setEventStats(e.data.data)
            setEvangelismStats(ev.data.data)
            setRecentMembers(m.data.data.slice(0, 4))
            setAnnouncements(a.data.data.slice(0, 3))
            setPrayerStats(p.data.data)
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
                        Welcome. Here's the congregation overview.
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

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Announcements
                            </CardTitle>
                            <Bell className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {announcements?.length > 0 ? (
                                announcements.map((ann) => (
                                    <div
                                        key={ann.id}
                                        className="border-l-2 border-blue-500 pl-3 py-1"
                                    >
                                        <p className="text-sm font-medium text-slate-800">
                                            {ann.title}
                                        </p>
                                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                                            {ann.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm">
                                    No announcements
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent members */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">
                            Recently Joined
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentMembers.map((member) => (
                            <div key={member.id} className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-blue-100 flex
                  items-center justify-center text-blue-700 text-sm
                  font-semibold shrink-0">
                                    {member.firstName[0]}{member.lastName[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">
                                        {member.firstName} {member.lastName}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Joined{' '}
                                        {new Date(member.joinedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}