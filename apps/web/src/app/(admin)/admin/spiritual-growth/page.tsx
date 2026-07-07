'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Spinner from '@/components/shared/Spinner'
import { Heart, BookOpen, Flame } from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import api from '@/services/api'

export default function AdminSpiritualGrowthPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/spiritual-growth/congregation').then(({ data }) => {
            setStats(data.data)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <DashboardLayout role="ADMIN">
                <div className="p-6 py-20 flex justify-center">
                    <Spinner text="Loading spiritual overview..." />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="ADMIN">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Spiritual Growth Overview
                    </h1>
                    <p className="text-slate-500">
                        Congregation-wide prayer and Bible study engagement
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            label: 'Logged Today',
                            value: stats?.today?.totalLogs ?? 0,
                            icon: Flame,
                            color: 'text-orange-600',
                            bg: 'bg-orange-50',
                        },
                        {
                            label: 'Prayed Today',
                            value: stats?.today?.prayed ?? 0,
                            icon: Heart,
                            color: 'text-purple-600',
                            bg: 'bg-purple-50',
                        },
                        {
                            label: 'Studied Today',
                            value: stats?.today?.studied ?? 0,
                            icon: BookOpen,
                            color: 'text-blue-600',
                            bg: 'bg-blue-50',
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
                                <p className="text-sm text-slate-500">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">
                            7-Day Engagement Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={stats?.trend ?? []}>
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="prayed"
                                    stroke="#9333ea"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    name="Prayed"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="studied"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    name="Studied Bible"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}