'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatCard from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Users, TrendingUp, DollarSign, Heart,
    Calendar, CheckSquare
} from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    ResponsiveContainer, BarChart, Bar
} from 'recharts'
import api from '@/services/api'

export default function PastorDashboard() {
    const [memberStats, setMemberStats] = useState<any>(null)
    const [donationStats, setDonationStats] = useState<any>(null)
    const [attendanceStats, setAttendanceStats] = useState<any>(null)
    const [prayerStats, setPrayerStats] = useState<any>(null)
    const [eventStats, setEventStats] = useState<any>(null)
    const [recentMembers, setRecentMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/members/stats'),
            api.get('/donations/stats'),
            api.get('/attendance/stats'),
            api.get('/prayer-requests/stats'),
            api.get('/events/stats'),
            api.get('/members'),
        ]).then(([m, d, a, p, e, rm]) => {
            setMemberStats(m.data.data)
            setDonationStats(d.data.data)
            setAttendanceStats(a.data.data)
            setPrayerStats(p.data.data)
            setEventStats(e.data.data)
            setRecentMembers(rm.data.data.slice(0, 5))
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <DashboardLayout role="PASTOR">
                <div className="p-6 text-slate-500">Loading dashboard...</div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="PASTOR">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Pastor's Overview
                    </h1>
                    <p className="text-slate-500">
                        A bird's eye view of the congregation
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Members"
                        value={memberStats?.total ?? '—'}
                        icon={Users}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                        subtitle={`+${memberStats?.newThisMonth} this month`}
                        subtitleColor="text-green-600"
                    />
                    <StatCard
                        title="This Month's Giving"
                        value={`₦${donationStats?.thisMonth?.toLocaleString() ?? '—'}`}
                        icon={DollarSign}
                        iconColor="text-green-600"
                        iconBg="bg-green-50"
                        subtitle={`₦${donationStats?.allTime?.toLocaleString()} all time`}
                    />
                    <StatCard
                        title="Upcoming Events"
                        value={eventStats?.upcoming ?? '—'}
                        icon={Calendar}
                        iconColor="text-purple-600"
                        iconBg="bg-purple-50"
                        subtitle={`${eventStats?.thisMonth} this month`}
                    />
                    <StatCard
                        title="Prayer Requests"
                        value={prayerStats?.pending ?? '—'}
                        icon={Heart}
                        iconColor="text-red-600"
                        iconBg="bg-red-50"
                        subtitle={`${prayerStats?.answered} answered`}
                        subtitleColor="text-green-600"
                    />
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Attendance Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {attendanceStats?.trend?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={attendanceStats.trend}>
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
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[220px] flex items-center justify-center">
                                    <p className="text-slate-400 text-sm">
                                        No attendance data yet
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                6-Month Giving
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {donationStats?.trend?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={donationStats.trend}>
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip
                                            formatter={(v: any) => `₦${v.toLocaleString()}`}
                                        />
                                        <Bar
                                            dataKey="total"
                                            fill="#10b981"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[220px] flex items-center justify-center">
                                    <p className="text-slate-400 text-sm">No giving data yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Congregation Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Men</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{
                                                width: memberStats?.total
                                                    ? `${(memberStats.men / memberStats.total) * 100}%`
                                                    : '0%',
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-800 w-8">
                                        {memberStats?.men}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Women</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-pink-500 rounded-full"
                                            style={{
                                                width: memberStats?.total
                                                    ? `${(memberStats.women / memberStats.total) * 100}%`
                                                    : '0%',
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-800 w-8">
                                        {memberStats?.women}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-3 border-t grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {prayerStats?.answered}
                                    </p>
                                    <p className="text-xs text-slate-500">Answered Prayers</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-500">
                                        {prayerStats?.pending}
                                    </p>
                                    <p className="text-xs text-slate-500">Pending Prayers</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Recently Joined
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-semibold shrink-0">
                                            {member.firstName[0]}{member.lastName[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">
                                                {member.firstName} {member.lastName}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Joined {new Date(member.joinedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${member.gender === 'MALE'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-pink-100 text-pink-700'
                                            }`}>
                                            {member.gender?.toLowerCase() ?? 'N/A'}
                                        </span>
                                    </div>
                                ))}
                                {recentMembers.length === 0 && (
                                    <p className="text-slate-400 text-sm">No members yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}