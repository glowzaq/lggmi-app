'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import api from '@/services/api'

interface DonationStats {
    allTime: number
    thisMonth: number
    lastMonth: number
    byType: { type: string; total: number; count: number }[]
    trend: { month: string; total: number }[]
}

interface Donation {
    id: string
    amount: number
    type: string
    donatedAt: string
    note: string | null
    member: { firstName: string; lastName: string }
}

const typeColors: Record<string, string> = {
    TITHE: 'bg-blue-100 text-blue-700',
    OFFERING: 'bg-green-100 text-green-700',
    SPECIAL_SEED: 'bg-purple-100 text-purple-700',
    BUILDING_FUND: 'bg-orange-100 text-orange-700',
    MISSIONS: 'bg-pink-100 text-pink-700',
    OTHER: 'bg-slate-100 text-slate-700',
}

export default function DonationsPage() {
    const [stats, setStats] = useState<DonationStats | null>(null)
    const [donations, setDonations] = useState<Donation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/donations/stats'),
            api.get('/donations'),
        ]).then(([statsRes, donationsRes]) => {
            setStats(statsRes.data.data)
            setDonations(donationsRes.data.data)
            setLoading(false)
        })
    }, [])

    const growth = stats
        ? stats.lastMonth > 0
            ? (((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100).toFixed(1)
            : null
        : null

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Donations</h1>
                <p className="text-slate-500">Track and manage church giving</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm text-slate-600">All Time</CardTitle>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <DollarSign className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-slate-800">
                            ₦{stats?.allTime.toLocaleString() ?? '—'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm text-slate-600">This Month</CardTitle>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <BarChart3 className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-slate-800">
                            ₦{stats?.thisMonth.toLocaleString() ?? '—'}
                        </p>
                        {growth && (
                            <p className={`text-xs mt-1 flex items-center gap-1 ${Number(growth) >= 0 ? 'text-green-600' : 'text-red-500'
                                }`}>
                                {Number(growth) >= 0
                                    ? <TrendingUp className="h-3 w-3" />
                                    : <TrendingDown className="h-3 w-3" />}
                                {Math.abs(Number(growth))}% vs last month
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm text-slate-600">Last Month</CardTitle>
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <DollarSign className="h-4 w-4 text-slate-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-slate-800">
                            ₦{stats?.lastMonth.toLocaleString() ?? '—'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Trend chart */}
            {stats?.trend && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">
                            6-Month Giving Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={stats.trend}>
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value: any) =>
                                        `₦${value.toLocaleString()}`
                                    }
                                />
                                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Recent donations table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">
                        Recent Donations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-slate-500 text-sm">Loading...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-slate-500">
                                        <th className="text-left py-2 font-medium">Member</th>
                                        <th className="text-left py-2 font-medium">Type</th>
                                        <th className="text-left py-2 font-medium">Amount</th>
                                        <th className="text-left py-2 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.slice(0, 10).map((donation) => (
                                        <tr key={donation.id} className="border-b last:border-0">
                                            <td className="py-3 font-medium text-slate-800">
                                                {donation.member.firstName} {donation.member.lastName}
                                            </td>
                                            <td className="py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[donation.type]}`}>
                                                    {donation.type.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3 font-semibold text-green-700">
                                                ₦{Number(donation.amount).toLocaleString()}
                                            </td>
                                            <td className="py-3 text-slate-500">
                                                {new Date(donation.donatedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}