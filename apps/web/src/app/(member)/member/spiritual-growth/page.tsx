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
    studiedDevotionals: boolean
    note: string | null
}

export default function MemberSpiritualGrowthPage() {
    const { user, loading: userLoading } = useCurrentUser()
    const [todayLog, setTodayLog] = useState<TodayLog | null>(null)
    const [stats, setStats] = useState<SpiritualStats | null>(null)
    const [history, setHistory] = useState<LogHistory[]>([])
    const [devotional, setDevotional] = useState<Devotional | null>(null)
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
            api.get(`/spiritual-growth/today/${user.id}`),
            api.get(`/spiritual-growth/stats/${user.id}`),
            api.get(`/spiritual-growth/logs/${user.id}?days=30`),
            api.get('/devotionals/today'),
        ]).then(([todayRes, statsRes, logsRes, devRes]) => {
            const today = todayRes.data.data
            if (today) {
                setTodayLog(today)
                setForm({
                    prayed: today.prayed,
                    studiedDevotionals: today.studiedDevotionals ?? false,
                    note: today.note ?? '',
                })
            }
            setStats(statsRes.data.data)
            setHistory(logsRes.data.data)
            setDevotional(devRes.data.data)
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

            const statsRes = await api.get(
                `/spiritual-growth/stats/${user.id}`
            )
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

    const todayLabel = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })

    return (
        <DashboardLayout role="MEMBER">
            <div className="p-6 space-y-6">

                {/* ── Page Header ──────────────────────────────────── */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Spiritual Growth
                        </h1>
                        <p className="text-slate-400 text-sm mt-0.5">{todayLabel}</p>
                    </div>

                    {/* Streak badge — top right */}
                    {stats && stats.currentStreak > 0 && (
                        <div className="flex items-center gap-2 bg-gradient-to-r
              from-[#693565] to-[#3f2039] text-white px-4 py-2
              rounded-xl shrink-0">
                            <Flame className="h-5 w-5 text-[#d4b0d1]" />
                            <div>
                                <p className="text-xs text-[#d4b0d1] leading-none">
                                    Streak
                                </p>
                                <p className="text-lg font-bold leading-tight">
                                    {stats.currentStreak}d
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Stats Row ─────────────────────────────────────── */}
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
                                label: 'Devotions Read',
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

                {/* ── Main Two-Column Grid ──────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left — Today's Devotional */}
                    <div className="space-y-0">
                        {devotional ? (
                            <Card className="border-l-4 border-l-[#693565] h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-[#f0e4ef] rounded-xl shrink-0">
                                            <BookMarked className="h-5 w-5 text-[#693565]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold uppercase
                        tracking-widest text-[#693565]">
                                                Today's Devotional
                                            </p>
                                            <CardTitle className="text-base font-bold
                        text-slate-800 mt-0.5 leading-tight">
                                                {devotional.title}
                                            </CardTitle>
                                            <p className="text-sm text-[#693565] font-medium mt-1">
                                                📖 {devotional.scripture}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">

                                    {/* Scripture text */}
                                    {devotional.scriptureText && (
                                        <div className="border-l-4 border-[#693565] pl-3
                      bg-[#f0e4ef]/50 rounded-r-lg py-2">
                                            <p className="text-sm text-[#3f2039] italic
                        leading-relaxed">
                                                "{devotional.scriptureText}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Body */}
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-semibold uppercase
                      tracking-widest text-slate-400">
                                            Reflection
                                        </p>
                                        <p className="text-sm text-slate-700 leading-relaxed">
                                            {devotional.body}
                                        </p>
                                    </div>

                                    {/* Prayer point */}
                                    {devotional.prayerPoint && (
                                        <div className="bg-[#f0e4ef]/60 rounded-lg p-3
                      space-y-1">
                                            <p className="text-[10px] font-semibold uppercase
                        tracking-widest text-[#693565] flex items-center
                        gap-1.5">
                                                <Heart className="h-3 w-3" />
                                                Prayer Point
                                            </p>
                                            <p className="text-sm text-slate-700 italic
                        leading-relaxed">
                                                {devotional.prayerPoint}
                                            </p>
                                        </div>
                                    )}

                                    {devotional.createdBy && (
                                        <p className="text-xs text-slate-400">
                                            By {devotional.createdBy.firstName}{' '}
                                            {devotional.createdBy.lastName}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="h-full border-dashed">
                                <CardContent className="py-16 flex flex-col items-center
                  justify-center text-center">
                                    <BookMarked className="h-8 w-8 text-slate-300 mb-3" />
                                    <p className="text-slate-500 font-medium">
                                        No devotional today
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Check back later
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right — Check-in + History */}
                    <div className="space-y-6">

                        {/* Daily Check-in */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-semibold
                    text-slate-800">
                                        Today's Check-in
                                    </CardTitle>
                                    {todayLog && (
                                        <span className="text-xs bg-green-100 text-green-700
                      px-2 py-0.5 rounded-full font-medium">
                                            Logged ✓
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">

                                {/* Prayer toggle */}
                                <button
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            prayed: !prev.prayed,
                                        }))
                                    }
                                    className={`w-full flex items-center gap-3 p-3.5
                    rounded-xl border-2 transition-all ${form.prayed
                                            ? 'border-[#693565] bg-[#f0e4ef]'
                                            : 'border-slate-200 bg-white hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg shrink-0 ${form.prayed ? 'bg-[#d4b0d1]' : 'bg-slate-100'
                                        }`}>
                                        <Heart className={`h-5 w-5 ${form.prayed ? 'text-[#693565]' : 'text-slate-400'
                                            }`} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className={`font-semibold text-sm ${form.prayed ? 'text-[#3f2039]' : 'text-slate-700'
                                            }`}>
                                            I prayed today
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Tap to mark your prayer time
                                        </p>
                                    </div>
                                    {form.prayed
                                        ? <CheckCircle className="h-5 w-5 text-[#693565] shrink-0" />
                                        : <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                                    }
                                </button>

                                {/* Devotion toggle */}
                                <button
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            studiedDevotionals: !prev.studiedDevotionals,
                                        }))
                                    }
                                    className={`w-full flex items-center gap-3 p-3.5
                    rounded-xl border-2 transition-all ${form.studiedDevotionals
                                            ? 'border-[#693565] bg-[#f0e4ef]'
                                            : 'border-slate-200 bg-white hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg shrink-0 ${form.studiedDevotionals ? 'bg-[#d4b0d1]' : 'bg-slate-100'
                                        }`}>
                                        <BookOpen className={`h-5 w-5 ${form.studiedDevotionals
                                                ? 'text-[#693565]'
                                                : 'text-slate-400'
                                            }`} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className={`font-semibold text-sm ${form.studiedDevotionals
                                                ? 'text-[#3f2039]'
                                                : 'text-slate-700'
                                            }`}>
                                            I read today's devotion
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Tap to mark your devotional reading
                                        </p>
                                    </div>
                                    {form.studiedDevotionals
                                        ? <CheckCircle className="h-5 w-5 text-[#693565] shrink-0" />
                                        : <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                                    }
                                </button>

                                {/* Note */}
                                <textarea
                                    value={form.note}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, note: e.target.value }))
                                    }
                                    placeholder="What did you study or pray about? (optional)"
                                    rows={2}
                                    className="w-full px-3 py-2 border border-slate-200
                    rounded-lg text-sm resize-none focus:outline-none
                    focus:ring-2 focus:ring-[#693565]"
                                />

                                <Button
                                    onClick={handleSave}
                                    disabled={saving || saved}
                                    className="w-full bg-[#693565] hover:bg-[#3f2039] text-white"
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
                                        Already logged. You can update anytime.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* 30-day history */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-slate-700">
                                    Last 30 Days
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {history.length === 0 ? (
                                    <p className="text-slate-400 text-sm px-4 pb-4">
                                        No logs yet. Start tracking today!
                                    </p>
                                ) : (
                                    <div className="max-h-[260px] overflow-y-auto divide-y">
                                        {history.map((log) => (
                                            <div
                                                key={log.id}
                                                className="flex items-center gap-3 px-4 py-2.5"
                                            >
                                                <p className="text-xs text-slate-400 w-24 shrink-0">
                                                    {new Date(log.logDate).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </p>
                                                <div className="flex gap-1.5 flex-wrap">
                                                    <span className={`text-xs px-2 py-0.5
                            rounded-full font-medium ${log.prayed
                                                            ? 'bg-[#f0e4ef] text-[#693565]'
                                                            : 'bg-slate-100 text-slate-400'
                                                        }`}>
                                                        {log.prayed ? '🙏 Prayed' : '🙏 —'}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5
                            rounded-full font-medium ${log.studiedDevotionals
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-slate-100 text-slate-400'
                                                        }`}>
                                                        {log.studiedDevotionals ? '📖 Read' : '📖 —'}
                                                    </span>
                                                </div>
                                                {log.note && (
                                                    <p className="text-xs text-slate-400 truncate
                            flex-1 hidden sm:block">
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
                </div>
            </div>
        </DashboardLayout>
    )
}