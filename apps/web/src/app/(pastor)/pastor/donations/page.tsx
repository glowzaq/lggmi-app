'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Spinner from '@/components/shared/Spinner'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis,
    Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts'
import api from '@/services/api'

const PIE_COLORS = [
    '#3b82f6', '#10b981', '#f59e0b',
    '#ef4444', '#8b5cf6', '#64748b',
]

export default function PastorDonationsPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/donations/stats').then(({ data }) => {
            setStats(data.data)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <DashboardLayout role="PASTOR">
                <div className="p-6 flex justify-center py-20">
                    <Spinner text="Loading giving report..." />
                </div>
            </DashboardLayout>
        )
    }

    const growth = stats?.lastMonth > 0
        ? (((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100).toFixed(1)
        : null

    return (
        <DashboardLayout role="PASTOR">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Giving Report
                    </h1>
                    <p className="text-slate-500">
                        Overview of church finances and giving trends
                    </p>
                </div>

                {/* Top stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            label: 'All-Time Giving',
                            value: `₦${stats?.allTime?.toLocaleString()}`,
                            sub: null,
                            icon: DollarSign,
                            iconColor: 'text-blue-600',
                            iconBg: 'bg-blue-50',
                        },
                        {
                            label: 'This Month',
                            value: `₦${stats?.thisMonth?.toLocaleString()}`,
                            sub: growth
                                ? `${Number(growth) >= 0 ? '+' : ''}${growth}% vs last month`
                                : null,
                            subColor: Number(growth) >= 0 ? 'text-green-600' : 'text-red-500',
                            icon: Number(growth) >= 0 ? TrendingUp : TrendingDown,
                            iconColor: Number(growth) >= 0 ? 'text-green-600' : 'text-red-500',
                            iconBg: Number(growth) >= 0 ? 'bg-green-50' : 'bg-red-50',
                        },
                        {
                            label: 'Last Month',
                            value: `₦${stats?.lastMonth?.toLocaleString()}`,
                            sub: null,
                            icon: DollarSign,
                            iconColor: 'text-slate-500',
                            iconBg: 'bg-slate-100',
                        },
                    ].map((card) => (
                        <Card key={card.label}>
                            <CardContent className="pt-4">
                                <div className={`p-2 rounded-lg ${card.iconBg} w-fit mb-3`}>
                                    <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                                </div>
                                <p className="text-2xl font-bold text-slate-800">
                                    {card.value}
                                </p>
                                <p className="text-sm text-slate-500 mt-0.5">{card.label}</p>
                                {card.sub && (
                                    <p className={`text-xs mt-1 ${(card as any).subColor}`}>
                                        {card.sub}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar — monthly trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                6-Month Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={stats?.trend ?? []}>
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        formatter={(v: any) => `₦${v.toLocaleString()}`}
                                    />
                                    <Bar
                                        dataKey="total"
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pie — by type */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">
                                Breakdown by Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats?.byType?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={stats.byType}
                                            dataKey="total"
                                            nameKey="type"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label={({ type, percent }) =>
                                                `${type.replace('_', ' ')} ${(percent * 100).toFixed(0)}%`
                                            }
                                            labelLine={false}
                                        >
                                            {stats.byType.map((_: any, i: number) => (
                                                <Cell
                                                    key={i}
                                                    fill={PIE_COLORS[i % PIE_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(v: any) => `₦${v.toLocaleString()}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[240px] flex items-center justify-center">
                                    <p className="text-slate-400 text-sm">No data yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Giving by type table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">
                            Giving by Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats?.byType?.map((item: any, i: number) => (
                                <div key={item.type} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                                            />
                                            <span className="text-slate-600">
                                                {item.type.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-slate-400 text-xs">
                                                ({item.count} records)
                                            </span>
                                        </div>
                                        <span className="font-semibold text-slate-800">
                                            ₦{item.total.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: stats.allTime
                                                    ? `${(item.total / stats.allTime) * 100}%`
                                                    : '0%',
                                                backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}