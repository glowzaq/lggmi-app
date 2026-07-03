'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/shared/Spinner'
import {
    Flame, BookOpen, Heart,
    CheckCircle, Circle, Trophy,
    Calendar,
} from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import api from '@/services/api'

interface TodayLog {
    id: string
    prayed: boolean
    studiedBible: boolean
    note: string | null
}

interface SpiritualStats {
    totalDaysPrayed: number
    totalDaysStudied: number
    totalDaysBoth: number
    currentStreak: number
    longestStreak: number
    thisMonthPrayed: number
    thisMonthStudied: number
}

interface LogHistory {
    id: string
    logDate: string
    prayed: boolean
    studiedBible: boolean
    note: string | null
}

export default function SpiritualGrowthPage() {
    const { user, loading: userLoading } = useCurrentUser()
    const [todayLog, setTodayLog] = useState<TodayLog | null>(null)
    const [stats, setStats] = useState<SpiritualStats | null>(null)
    const [history, setHistory] = useState<LogHistory[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        prayed: false,
        studiedBible: false,
        note: '',
    })

    useEffect(() => {
        if (userLoading || !user) return

        Promise.all([
            api.get(`/spiritual-growth/today/${user.id}`),
            api.get(`/spiritual-growth/stats/${user.id}`),
            api.get(`/spiritual-growth/logs/${user.id}?days=30`),
        ]).then(([todayRes, statsRes, logsRes]) => {
            const today = todayRes.data.data
            if (today) {
                setTodayLog(today)
                setForm({
                    prayed: today.prayed,
                    studiedBible: today.studiedBible,
                    note: today.note ?? '',
                })
            }
            setStats(statsRes.data.data)
            setHistory(logsRes.data.data)
            setLoading(false)
        })
    }, [userLoading, user])

    const handleSave = async () => {
        if (!user) return
        setSaving(true)
        setSaved(false)

        try {
            const { data } = await api.post('/spiritual-growth', {
                userId: user.id,
                prayed: form.prayed,
                studiedBible: form.studiedBible,
                note: form.note || undefined,
            })
            setTodayLog(data.data)

            const statsRes = await api.get(`/spiritual-growth/stats/${user.id}`)
            setStats(statsRes.data.data)

            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    if (userLoading || loading) {
        return (
            <DashboardLayout role="MEMBER">
                <div className="p-6 py-20 flex justify-center">
                    <Spinner text="Loading your spiritual growth..." />
                </div>
            </DashboardLayout>
        )
    }

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })

    return (
        <DashboardLayout role="MEMBER">
            <div className="p-6 space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Spiritual Growth
                    </h1>
                    <p className="text-slate-500">
                        Develop a daily prayer and bible study habit
                    </p>
                </div>

                {stats && stats.currentStreak > 0 && (
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500
            rounded-xl p-5 text-white flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Flame className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-orange-100 text-sm">Current Streak</p>
                            <p className="text-3xl font-bold">
                                {stats.currentStreak} day{stats.currentStreak !== 1 ? 's' : ''}
                            </p>
                            <p className="text-orange-100 text-xs mt-0.5">
                                Longest: {stats.longestStreak} days — keep it going!
                            </p>
                        </div>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Today's Check-in
                            </CardTitle>
                            <p className="text-xs text-slate-400">{today}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <button
                            onClick={() =>
                                setForm((prev) => ({ ...prev, prayed: !prev.prayed }))
                            }
                            className={`w-full flex items-center gap-4 p-4 rounded-xl
                border-2 transition-all ${form.prayed
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${form.prayed ? 'bg-purple-100' : 'bg-slate-100'
                                }`}>
                                <Heart className={`h-6 w-6 ${form.prayed ? 'text-purple-600' : 'text-slate-400'
                                    }`} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className={`font-semibold ${form.prayed ? 'text-purple-800' : 'text-slate-700'
                                    }`}>
                                    I prayed today
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Tap to mark your prayer time
                                </p>
                            </div>
                            {form.prayed
                                ? <CheckCircle className="h-6 w-6 text-purple-500 shrink-0" />
                                : <Circle className="h-6 w-6 text-slate-300 shrink-0" />
                            }
                        </button>

                        <button
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    studiedBible: !prev.studiedBible,
                                }))
                            }
                            className={`w-full flex items-center gap-4 p-4 rounded-xl
                border-2 transition-all ${form.studiedBible
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${form.studiedBible ? 'bg-blue-100' : 'bg-slate-100'
                                }`}>
                                <BookOpen className={`h-6 w-6 ${form.studiedBible ? 'text-blue-600' : 'text-slate-400'
                                    }`} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className={`font-semibold ${form.studiedBible ? 'text-blue-800' : 'text-slate-700'
                                    }`}>
                                    I studied the Bible today
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Tap to mark your Bible study time
                                </p>
                            </div>
                            {form.studiedBible
                                ? <CheckCircle className="h-6 w-6 text-blue-500 shrink-0" />
                                : <Circle className="h-6 w-6 text-slate-300 shrink-0" />
                            }
                        </button>

                        <div className="space-y-1.5">
                            <label className="text-sm text-slate-600 font-medium">
                                What did you study or pray about? (optional)
                            </label>
                            <textarea
                                value={form.note}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, note: e.target.value }))
                                }
                                placeholder="e.g. Read Psalm 23, prayed for the family..."
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={saving || saved}
                            className="w-full"
                        >
                            {saving
                                ? 'Saving...'
                                : saved
                                    ? '✓ Saved for today'
                                    : todayLog
                                        ? 'Update Today\'s Log'
                                        : 'Save Today\'s Log'}
                        </Button>

                        {todayLog && (
                            <p className="text-xs text-center text-slate-400">
                                You already logged today. You can update it anytime.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            {
                                label: 'Days Prayed',
                                value: stats.totalDaysPrayed,
                                icon: Heart,
                                color: 'text-purple-600',
                                bg: 'bg-purple-50',
                            },
                            {
                                label: 'Days Studied',
                                value: stats.totalDaysStudied,
                                icon: BookOpen,
                                color: 'text-blue-600',
                                bg: 'bg-blue-50',
                            },
                            {
                                label: 'Both This Month',
                                value: stats.thisMonthPrayed,
                                icon: Calendar,
                                color: 'text-green-600',
                                bg: 'bg-green-50',
                            },
                            {
                                label: 'Longest Streak',
                                value: `${stats.longestStreak}d`,
                                icon: Trophy,
                                color: 'text-amber-600',
                                bg: 'bg-amber-50',
                            },
                        ].map((stat) => (
                            <Card key={stat.label}>
                                <CardContent className="pt-4">
                                    <div className={`p-2 rounded-lg ${stat.bg} w-fit mb-2`}>
                                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {stat.label}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">
                            Last 30 Days
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {history.length === 0 ? (
                            <p className="text-slate-400 text-sm">
                                No logs yet. Start tracking today!
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {history.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-center gap-3 py-2 border-b last:border-0"
                                    >
                                        <p className="text-xs text-slate-400 w-28 shrink-0">
                                            {new Date(log.logDate).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>

                                        <div className="flex gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${log.prayed
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {log.prayed ? '🙏 Prayed' : '🙏 No prayer'}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full
                        font-medium ${log.studiedBible
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {log.studiedBible ? '📖 Studied' : '📖 No study'}
                                            </span>
                                        </div>

                                        {/* Note */}
                                        {log.note && (
                                            <p className="text-xs text-slate-500 truncate flex-1">
                                                {log.note}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}