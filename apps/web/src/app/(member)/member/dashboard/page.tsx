'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Calendar, BookOpen, Bell, DollarSign,
    Heart, CheckSquare, ChevronRight
} from 'lucide-react'
import api from '@/services/api'

export default function MemberDashboard() {
    const [user, setUser] = useState<any>(null)
    const [member, setMember] = useState<any>(null)
    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
    const [latestSermons, setLatestSermons] = useState<any[]>([])
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [attendance, setAttendance] = useState<any>(null)
    const [donations, setDonations] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (!stored) return
        const u = JSON.parse(stored)
        setUser(u)

        api.get('/members/me').then(({ data }) => {
            const myMember = data.data 

            if (!myMember) return
            setMember(myMember)

            Promise.all([
                api.get('/events/upcoming'),
                api.get('/sermons/latest'),
                api.get('/announcements/active'),
                api.get(`/attendance/member/${myMember.id}`),
                api.get(`/donations/member/${myMember.id}`),
            ]).then(([e, s, a, att, don]) => {
                setUpcomingEvents(e.data.data.slice(0, 3))
                setLatestSermons(s.data.data.slice(0, 3))
                setAnnouncements(a.data.data.slice(0, 3))
                setAttendance(att.data.data)
                setDonations(don.data.data)
                setLoading(false)
            })
        })
    }, [])

    if (loading) {
        return (
            <DashboardLayout role="MEMBER">
                <div className="p-6 text-slate-500">Loading your dashboard...</div>
            </DashboardLayout>
        )
    }

    const eventTypeLabel: Record<string, string> = {
        SUNDAY_SERVICE: 'Sunday Service',
        BIBLE_STUDY: 'Bible Study',
        PRAYER_MEETING: 'Prayer Meeting',
        SPECIAL_PROGRAM: 'Special Program',
        YOUTH_SERVICE: 'Youth Service',
        OTHER: 'Other',
    }

    return (
        <DashboardLayout role="MEMBER">
            <div className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-[#693465] to-[#3b1538] rounded-xl p-6 text-white">
                    <p className="text-[#e2b6de] text-sm">Welcome back</p>
                    <h1 className="text-2xl font-bold mt-1 text-white">
                        {member?.firstName} {member?.lastName}
                    </h1>
                    <p className="text-blue-200 text-sm mt-2">
                        Attendance rate:{' '}
                        <span className="text-white font-semibold">
                            {attendance?.summary?.attendanceRate ?? 0}%
                        </span>
                        {' · '}
                        Total giving:{' '}
                        <span className="text-white font-semibold">
                            ₦{donations?.total?.toLocaleString() ?? 0}
                        </span>
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        {
                            label: 'Services Attended',
                            value: attendance?.summary?.present ?? 0,
                            icon: CheckSquare,
                            color: 'text-blue-600',
                            bg: 'bg-blue-50',
                        },
                        {
                            label: 'Total Donations',
                            value: `₦${(donations?.total ?? 0).toLocaleString()}`,
                            icon: DollarSign,
                            color: 'text-green-600',
                            bg: 'bg-green-50',
                        },
                        {
                            label: 'Upcoming Events',
                            value: upcomingEvents.length,
                            icon: Calendar,
                            color: 'text-purple-600',
                            bg: 'bg-purple-50',
                        },
                        {
                            label: 'Announcements',
                            value: announcements.length,
                            icon: Bell,
                            color: 'text-orange-600',
                            bg: 'bg-orange-50',
                        },
                    ].map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="pt-4">
                                <div className={`p-2 rounded-lg ${stat.bg} w-fit mb-2`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upcoming events */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Upcoming Events
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="text-center min-w-[48px] bg-white rounded-lg border border-slate-200 p-1">
                                            <p className="text-xs text-slate-500 leading-none">
                                                {new Date(event.startTime).toLocaleString('default', {
                                                    month: 'short',
                                                })}
                                            </p>
                                            <p className="text-lg font-bold text-blue-600 leading-none">
                                                {new Date(event.startTime).getDate()}
                                            </p>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800">
                                                {event.title}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {eventTypeLabel[event.type]} ·{' '}
                                                {new Date(event.startTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                            {event.location && (
                                                <p className="text-xs text-slate-400 truncate">
                                                    {event.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm">No upcoming events</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Announcements */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Announcements
                            </CardTitle>
                            <Bell className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {announcements.length > 0 ? (
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
                                <p className="text-slate-400 text-sm">No announcements</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Latest sermons */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold text-slate-800">
                            Latest Sermons
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {latestSermons.length > 0 ? (
                                latestSermons.map((sermon) => (
                                    <div
                                        key={sermon.id}
                                        className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors space-y-1"
                                    >
                                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                                            {sermon.title}
                                        </p>
                                        <p className="text-xs text-blue-600 font-medium">
                                            {sermon.speaker}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(sermon.sermonDate).toLocaleDateString()}
                                        </p>
                                        {sermon.seriesName && (
                                            <p className="text-xs text-slate-500 italic">
                                                {sermon.seriesName}
                                            </p>
                                        )}
                                        {(sermon.videoUrl || sermon.audioUrl) && (
                                            <a

                                                href={sermon.videoUrl || sermon.audioUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 hover:underline
                                        flex items-center gap-1 mt-2"
                                            >
                                                Watch / Listen
                                                <ChevronRight className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm">No sermons yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout >
    )
}