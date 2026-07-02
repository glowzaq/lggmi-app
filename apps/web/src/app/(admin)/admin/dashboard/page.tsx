'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatCard from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Users, Calendar, BookOpen, DollarSign,
    Heart, CheckSquare, Bell, TrendingUp
} from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, LineChart, Line
} from 'recharts'
import api from '@/services/api'

export default function AdminDashboard() {
    const [memberStats, setMemberStats] = useState<any>(null)
    const [donationStats, setDonationStats] = useState<any>(null)
    const [attendanceStats, setAttendanceStats] = useState<any>(null)
    const [prayerStats, setPrayerStats] = useState<any>(null)
    const [eventStats, setEventStats] = useState<any>(null)
    const [recentDonations, setRecentDonations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/users/stats'),
            api.get('/donations/stats'),
            api.get('/attendance/stats'),
            api.get('/prayer-requests/stats'),
            api.get('/events/stats'),
            api.get('/donations'),
        ]).then(([m, d, a, p, e, rd]) => {
            setMemberStats(m.data.data)
            setDonationStats(d.data.data)
            setAttendanceStats(a.data.data)
            setPrayerStats(p.data.data)
            setEventStats(e.data.data)
            setRecentDonations(rd.data.data.slice(0, 5))
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <DashboardLayout role="ADMIN">
                <div className="p-6 text-slate-500">Loading...</div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="ADMIN">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                    <p className="text-slate-500">Full control center</p>
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
                        title="Upcoming Events"
                        value={eventStats?.upcoming ?? '—'}
                        icon={Calendar}
                        iconColor="text-purple-600"
                        iconBg="bg-purple-50"
                    />
                    <StatCard
                        title="This Month Giving"
                        value={`₦${donationStats?.thisMonth?.toLocaleString() ?? '—'}`}
                        icon={DollarSign}
                        iconColor="text-green-600"
                        iconBg="bg-green-50"
                    />
                    <StatCard
                        title="Prayer Requests"
                        value={prayerStats?.pending ?? '—'}
                        icon={Heart}
                        iconColor="text-red-600"
                        iconBg="bg-red-50"
                        subtitle="pending"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Giving Trend (6 months)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={donationStats?.trend ?? []}>
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        formatter={(v: any) => `₦${v.toLocaleString()}`}
                                    />
                                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

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
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent donations + giving by type */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Recent Donations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentDonations.map((d) => (
                                    <div
                                        key={d.id}
                                        className="flex items-center justify-between py-2 border-b last:border-0"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">
                                                {d.user.firstName} {d.user.lastName}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {d.type.replace('_', ' ')} ·{' '}
                                                {new Date(d.donatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="text-sm font-bold text-green-600">
                                            ₦{Number(d.amount).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                                {recentDonations.length === 0 && (
                                    <p className="text-slate-400 text-sm">No donations yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Giving by Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {donationStats?.byType?.map((item: any) => (
                                    <div key={item.type} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">
                                                {item.type.replace('_', ' ')}
                                            </span>
                                            <span className="font-semibold text-slate-800">
                                                ₦{item.total.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{
                                                    width: donationStats.allTime
                                                        ? `${(item.total / donationStats.allTime) * 100}%`
                                                        : '0%',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {!donationStats?.byType?.length && (
                                    <p className="text-slate-400 text-sm">No data yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}