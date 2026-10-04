'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import { CheckSquare, Plus } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import api from '@/services/api'

interface AttendanceRecord {
    id: string
    date: string
    maleCount: number
    femaleCount: number
    childrenCount: number
    newcomersCount: number
    totalCount: number
    note: string | null
    event: { title: string; type: string } | null
}

export default function PastorAttendancePage() {
    const [records, setRecords] = useState<AttendanceRecord[]>([])
    const [stats, setStats] = useState<any>(null)
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        const [recordsRes, statsRes, eventsRes] = await Promise.all([
            api.get('/attendance'),
            api.get('/attendance/stats'),
            api.get('/events'),
        ])
        setRecords(recordsRes.data.data)
        setStats(statsRes.data.data)
        setEvents(eventsRes.data.data)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    return (
        <DashboardLayout role="PASTOR">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
                        <p className="text-slate-500">
                            Attendance recorded by category
                        </p>
                    </div>
                </div>

                {/* All time stats */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {[
                            { label: 'Total (All Time)', value: stats.allTime?.total ?? 0, color: 'text-slate-800' },
                            { label: 'Men', value: stats.allTime?.male ?? 0, color: 'text-[#9B7E93]' },
                            { label: 'Women', value: stats.allTime?.female ?? 0, color: 'text-[#D4AFA0]' },
                            { label: 'Children', value: stats.allTime?.children ?? 0, color: 'text-[#A8B8A6]' },
                            { label: 'Newcomers', value: stats.allTime?.newcomers ?? 0, color: 'text-[#d6b68d]' },
                        ].map((s) => (
                            <Card key={s.label}>
                                <CardContent className="pt-4 text-center">
                                    <p className={`text-2xl font-bold ${s.color}`}>
                                        {s.value}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Trend chart */}
                {stats?.trend?.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Recent Attendance Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={stats.trend}>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11 }}
                                        tickFormatter={(v) => v.split(' ')[0]}
                                    />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="male" fill="#9B7E93" name="Men" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="female" fill="#D4AFA0" name="Women" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="children" fill="#A8B8A6" name="Children" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="newcomers" fill="#d6b68d" name="Newcomers" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Records list */}
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading attendance records..." />
                    </div>
                ) : records.length === 0 ? (
                    <EmptyState
                        icon={CheckSquare}
                        title="No attendance records yet"
                        description="No records yet"
                    />
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-slate-50">
                                            <th className="text-left px-4 py-3 font-medium text-slate-600">
                                                Event
                                            </th>
                                            <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                                                Men
                                            </th>
                                            <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                                                Women
                                            </th>
                                            <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                                                Children
                                            </th>
                                            <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                                                Newcomers
                                            </th>
                                            <th className="text-left px-4 py-3 font-medium text-slate-600">
                                                Total
                                            </th>
                                            <th className="px-4 py-3" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map((record) => (
                                            <tr
                                                key={record.id}
                                                className="border-b last:border-0 hover:bg-slate-50"
                                            >
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-slate-800">
                                                        {record.event?.title ?? '—'}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {new Date(record.date).toLocaleDateString(
                                                            'en-US',
                                                            { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
                                                        )}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-blue-600 font-medium hidden md:table-cell">
                                                    {record.maleCount}
                                                </td>
                                                <td className="px-4 py-3 text-pink-600 font-medium hidden md:table-cell">
                                                    {record.femaleCount}
                                                </td>
                                                <td className="px-4 py-3 text-green-600 font-medium hidden md:table-cell">
                                                    {record.childrenCount}
                                                </td>
                                                <td className="px-4 py-3 text-orange-600 font-medium hidden md:table-cell">
                                                    {record.newcomersCount}
                                                </td>
                                                <td className="px-4 py-3 font-bold text-slate-800">
                                                    {record.totalCount}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    )
}