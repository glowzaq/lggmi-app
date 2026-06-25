'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import { DollarSign, TrendingUp } from 'lucide-react'
import api from '@/services/api'

interface Donation {
    id: string
    amount: number
    type: string
    note: string | null
    donatedAt: string
}

const typeColors: Record<string, string> = {
    TITHE: 'bg-blue-100 text-blue-700',
    OFFERING: 'bg-green-100 text-green-700',
    SPECIAL_SEED: 'bg-purple-100 text-purple-700',
    BUILDING_FUND: 'bg-orange-100 text-orange-700',
    MISSIONS: 'bg-pink-100 text-pink-700',
    OTHER: 'bg-slate-100 text-slate-600',
}

export default function MemberGivingPage() {
    const [donations, setDonations] = useState<Donation[]>([])
    const [total, setTotal] = useState(0)
    const [memberId, setMemberId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (!stored) return

        setLoading(true)

        api.get('/members/me')
            .then(({ data }) => {
                const me = data.data?.member || data.member || data.data
                if (!me?.id) throw new Error('No member profile found')
                setMemberId(me.id)
                return api.get(`/donations/member/${me.id}`)
            })
            .then(({ data: d }) => {
                setDonations(d.data.donations)
                setTotal(d.data.total)
                setLoading(false)
            })
            .catch((err) => {
                console.error("Failed to load donations history:", err)
                setLoading(false)
            })
    }, [])

    // Group by type for summary
    const byType = donations.reduce<Record<string, number>>((acc, d) => {
        acc[d.type] = (acc[d.type] || 0) + Number(d.amount)
        return acc
    }, {})

    return (
        <DashboardLayout role="MEMBER">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Giving</h1>
                    <p className="text-slate-500">
                        Your personal giving history and summary
                    </p>
                </div>

                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner text="Loading giving history..." />
                    </div>
                ) : (
                    <>
                        {/* Total card */}
                        <Card className="bg-gradient-to-r from-[#683565] to-[#1a1114] text-white border-0">
                            <CardContent className="pt-6 pb-5">
                                <div className="flex items-center gap-3 mb-1">
                                    <DollarSign className="h-5 w-5 text-white" />
                                    <p className="text-white text-sm">Total Given</p>
                                </div>
                                <p className="text-4xl font-bold">
                                    ₦{total.toLocaleString()}
                                </p>
                                <p className="text-white text-sm mt-1">
                                    Across {donations.length} records
                                </p>
                            </CardContent>
                        </Card>

                        {/* By type breakdown */}
                        {Object.keys(byType).length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold text-slate-700">
                                        Giving by Category
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {Object.entries(byType).map(([type, amount]) => (
                                        <div key={type} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">
                                                    {type.replace(/_/g, ' ')}
                                                </span>
                                                <span className="font-semibold text-slate-800">
                                                    ₦{amount.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full"
                                                    style={{
                                                        width: total
                                                            ? `${(amount / total) * 100}%`
                                                            : '0%',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-slate-700">
                                    Giving History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {donations.length === 0 ? (
                                    <div className="py-8">
                                        <EmptyState
                                            icon={DollarSign}
                                            title="No giving records"
                                            description="Your giving history will appear here"
                                        />
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {donations.map((d) => (
                                            <div
                                                key={d.id}
                                                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                                            >
                                                <div className="space-y-0.5">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full
                            font-medium ${typeColors[d.type]}`}>
                                                        {d.type.replace(/_/g, ' ')}
                                                    </span>
                                                    <p className="text-xs text-slate-400">
                                                        {new Date(d.donatedAt).toLocaleDateString(
                                                            'en-US',
                                                            {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            }
                                                        )}
                                                    </p>
                                                    {d.note && (
                                                        <p className="text-xs text-slate-500 italic">
                                                            {d.note}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="font-bold text-green-600">
                                                    ₦{Number(d.amount).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}