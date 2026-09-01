'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatCard from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Bell, Globe, Heart } from 'lucide-react'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import api from '@/services/api'

interface Announcements {
    id: string
    title: string
    content: string
}

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
                        iconColor="text-[#4a261a]"
                        iconBg="bg-[#d4afa0]"
                        subtitle={`+${memberStats?.newThisMonth ?? 0} this month`}
                        subtitleColor="text-purple-900"
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
                        iconColor="text-[#2d332d]"
                        iconBg="bg-[#a8b8a6]"
                    />
                    <StatCard
                        title="Evangelism"
                        value={evangelismStats?.length ?? '—'}
                        icon={Heart}
                        iconColor="text-[#473723]"
                        iconBg="bg-[#d6b68d]"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {attendanceStats?.trend?.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-800">
                                    Recent Attendance Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={attendanceStats.trend}>
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 11 }}
                                            tickFormatter={(v) => v.split(' ')[0]}
                                        />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Bar dataKey="male" fill="#9B7E93" name="Men" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="female" fill="#D4AFA0" name="Women" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="children" fill="#A8B8A6" name="Children" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="newcomers" fill="#d6b68d" name="Newcomers" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Announcements
                            </CardTitle>
                            <Bell className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {announcements?.length > 0 ? (
                                announcements.map((ann: Announcements) => (
                                    <div
                                        key={ann.id}
                                        className="border-l-2 border-purple-900 pl-3 py-1"
                                    >
                                        <p className="text-sm font-medium text-slate-900">
                                            {ann.title}
                                        </p>
                                        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
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
                                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-900 text-sm font-semibold shrink-0">
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