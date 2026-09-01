'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/shared/Spinner'
import {
    Flame, BookOpen, Heart,
    CheckCircle, Circle, Trophy,
    Calendar, BookMarked,
} from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import api from '@/services/api'

interface Devotional {
    id: string
    title: string
    scripture: string
    scriptureText: string | null
    body: string
    prayerPoint: string
    author: string
    devotionalDate: string
    createdBy: { firstName: string; lastName: string }
}

interface TodayLog {
    id: string
    prayed: boolean
    studiedDevotionals: boolean
    note: string | null
}

interface SpiritualStats {
    totalDaysPrayed: number
    totalDaysStudied: number
    currentStreak: number
    longestStreak: number
    thisMonthPrayed: number
    thisMonthStudied: number
}

interface LogHistory {
    id: string
    logDate: string
    prayed: boolean
    studiedDevotionals: boolean
    note: string | null
}

export default function SpiritualGrowthPage() {
    const { user, loading: userLoading } = useCurrentUser()
    const [devotional, setDevotional] = useState<Devotional | null>(null)
    const [todayLog, setTodayLog] = useState<TodayLog | null>(null)
    const [stats, setStats] = useState<SpiritualStats | null>(null)
    const [history, setHistory] = useState<LogHistory[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        prayed: false,
        studiedDevotionals: false,
        note: '',
    })

    useEffect(() => {
        if (userLoading || !user) return

        Promise.all([
            api.get('/devotionals/today'),
            api.get(`/spiritual-growth/today/${user.id}`),
            api.get(`/spiritual-growth/stats/${user.id}`),
            api.get(`/spiritual-growth/logs/${user.id}?days=30`),
        ]).then(([devRes, todayRes, statsRes, logsRes]) => {
            setDevotional(devRes.data.data)

            const today = todayRes.data.data
            if (today) {
                setTodayLog(today)
                setForm({
                    prayed: today.prayed,
                    studiedDevotionals: today.studiedDevotionals,
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
                studiedDevotionals: form.studiedDevotionals,
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
                    <p className="text-slate-500">{today}</p>
                </div>

                {/* ── Section 1: Today's Devotional ──────────────────── */}
                {devotional ? (
                    <Card className="border-[#693565] border-l-4">
                        <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-[#f0e4ef] rounded-xl shrink-0">
                                    <BookMarked className="h-5 w-5 text-[#693565]" />
                                </div>
                                <div>
                                    <p className="text-xs text-[#693565] font-medium uppercase
                    tracking-wider">
                                        Today's Devotional
                                    </p>
                                    <CardTitle className="text-lg font-bold text-slate-800 mt-0.5">
                                        {devotional.title}
                                    </CardTitle>
                                    <p className="text-sm text-[#693565] font-medium mt-0.5">
                                        📖 {devotional.scripture}
                                    </p>
                                    <p className="text-sm text-[#693565] font-medium mt-0.5">
                                        Written by {devotional.author}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Scripture text */}
                            {devotional.scriptureText && (
                                <div className="bg-[#f0e4ef] rounded-lg p-4 border-l-4
                  border-[#693565]">
                                    <p className="text-sm text-[#3f2039] italic leading-relaxed">
                                        "{devotional.scriptureText}"
                                    </p>
                                </div>
                            )}

                            {/* Devotional body */}
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase
                  tracking-wider">
                                    Reflection
                                </p>
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                    {devotional.body}
                                </p>
                            </div>

                            {/* Prayer point */}
                            <div className="bg-slate-50 rounded-lg p-4 space-y-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase
                  tracking-wider flex items-center gap-1.5">
                                    <Heart className="h-3 w-3 text-[#693565]" />
                                    Prayer Point
                                </p>
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    {devotional.prayerPoint}
                                </p>
                            </div>

                            <p className="text-xs text-slate-400">
                                By {devotional.createdBy.firstName}{' '}
                                {devotional.createdBy.lastName}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-dashed">
                        <CardContent className="py-10 text-center">
                            <BookMarked className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">
                                No devotional posted for today
                            </p>
                            <p className="text-slate-400 text-sm mt-1">
                                Check back later or read yesterday's devotional
                            </p>
                        </CardContent>
                    </Card>
                )}

                {stats && stats.currentStreak > 0 && (
                    <div className="bg-gradient-to-r from-[#693565] to-[#3f2039]
            rounded-xl p-5 text-white flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-xl">
                            <Flame className="h-8 w-8 text-[#d4b0d1]" />
                        </div>
                        <div>
                            <p className="text-[#d4b0d1] text-sm">Current Streak</p>
                            <p className="text-3xl font-bold">
                                {stats.currentStreak}{' '}
                                day{stats.currentStreak !== 1 ? 's' : ''}
                            </p>
                            <p className="text-[#b885b2] text-xs mt-0.5">
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
                            {todayLog && (
                                <span className="text-xs bg-green-100 text-green-700
                  px-2 py-0.5 rounded-full font-medium">
                                    Already logged
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {/* Prayer toggle */}
                        <button
                            onClick={() =>
                                setForm((prev) => ({ ...prev, prayed: !prev.prayed }))
                            }
                            className={`w-full flex items-center gap-4 p-4 rounded-xl
                border-2 transition-all ${form.prayed
                                    ? 'border-[#693565] bg-[#f0e4ef]'
                                    : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${form.prayed ? 'bg-[#d4b0d1]' : 'bg-slate-100'
                                }`}>
                                <Heart className={`h-6 w-6 ${form.prayed ? 'text-[#693565]' : 'text-slate-400'
                                    }`} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className={`font-semibold ${form.prayed ? 'text-[#3f2039]' : 'text-slate-700'
                                    }`}>
                                    I prayed today
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Tap to mark your prayer time
                                </p>
                            </div>
                            {form.prayed
                                ? <CheckCircle className="h-6 w-6 text-[#693565] shrink-0" />
                                : <Circle className="h-6 w-6 text-slate-300 shrink-0" />
                            }
                        </button>

                        {/* Bible study toggle */}
                        <button
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    studiedDevotionals: !prev.studiedDevotionals,
                                }))
                            }
                            className={`w-full flex items-center gap-4 p-4 rounded-xl
                border-2 transition-all ${form.studiedDevotionals
                                    ? 'border-[#693565] bg-[#f0e4ef]'
                                    : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${form.studiedDevotionals ? 'bg-[#d4b0d1]' : 'bg-slate-100'
                                }`}>
                                <BookOpen className={`h-6 w-6 ${form.studiedDevotionals ? 'text-[#693565]' : 'text-slate-400'
                                    }`} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className={`font-semibold ${form.studiedDevotionals ? 'text-[#3f2039]' : 'text-slate-700'
                                    }`}>
                                    I studied the Bible today
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Tap to mark your Bible study time
                                </p>
                            </div>
                            {form.studiedDevotionals
                                ? <CheckCircle className="h-6 w-6 text-[#693565] shrink-0" />
                                : <Circle className="h-6 w-6 text-slate-300 shrink-0" />
                            }
                        </button>

                        {/* Personal note */}
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
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg
                  text-sm resize-none focus:outline-none
                  focus:ring-2 focus:ring-[#693565]"
                            />
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={saving || saved}
                            className="w-full bg-[#693565] hover:bg-[#7d4178]"
                        >
                            {saving
                                ? 'Saving...'
                                : saved
                                    ? '✓ Saved for today'
                                    : todayLog
                                        ? "Update Today's Log"
                                        : "Save Today's Log"}
                        </Button>

                        {todayLog && (
                            <p className="text-xs text-center text-slate-400">
                                You already logged today. You can update it anytime.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* ── Section 4: Stats grid ──────────────────────────── */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            {
                                label: 'Days Prayed',
                                value: stats.totalDaysPrayed,
                                icon: Heart,
                                color: 'text-[#693565]',
                                bg: 'bg-[#f0e4ef]',
                            },
                            {
                                label: 'Days Studied',
                                value: stats.totalDaysStudied,
                                icon: BookOpen,
                                color: 'text-blue-600',
                                bg: 'bg-blue-50',
                            },
                            {
                                label: 'This Month',
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

                {/* ── Section 5: 30-day history ──────────────────────── */}
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
                                        className="flex items-center gap-3 py-2 border-b
                      last:border-0"
                                    >
                                        <p className="text-xs text-slate-400 w-28 shrink-0">
                                            {new Date(log.logDate).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <div className="flex gap-2 flex-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full
                        font-medium ${log.prayed
                                                    ? 'bg-[#f0e4ef] text-[#693565]'
                                                    : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {log.prayed ? '🙏 Prayed' : '🙏 No prayer'}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full
                        font-medium ${log.studiedDevotionals
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {log.studiedDevotionals ? '📖 Studied' : '📖 No study'}
                                            </span>
                                        </div>
                                        {log.note && (
                                            <p className="text-xs text-slate-500 truncate
                        max-w-[120px]">
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