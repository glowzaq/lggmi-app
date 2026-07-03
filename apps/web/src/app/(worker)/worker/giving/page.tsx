'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import { DollarSign } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
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
    MISSIONS: 'bg-pink-100 text-pink-700',
    OTHER: 'bg-slate-100 text-slate-600',
}

export default function WorkerGivingPage() {
    const { user, loading: userLoading } = useCurrentUser()
    const [donations, setDonations] = useState<Donation[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    const byType = useMemo(
        () =>
            donations.reduce<Record<string, number>>((acc, donation) => {
                acc[donation.type] = (acc[donation.type] ?? 0) + Number(donation.amount)
                return acc
            }, {}),
        [donations]
    )

    useEffect(() => {
        if (userLoading) return
        if (!user || !user.id) return

        api
            .get(`/donations/user/${user.id}`)
            .then(({ data }) => {
                setDonations(data.data?.donations ?? [])
                setTotal(Number(data.data?.total ?? 0))
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [userLoading, user])

    if (userLoading || (user?.id && loading)) {
        return (
            <DashboardLayout role="WORKER">
                <div className="p-6 py-20 flex justify-center">
                    <Spinner text="Loading giving history..." />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="WORKER">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Giving</h1>
                    <p className="text-slate-500">
                        Your personal giving history and summary
                    </p>
                </div>

                {/* Total card */}
                <Card className="bg-gradient-to-r from-[#693565] to-[#1a1114] text-white border-0">
                    <CardContent className="pt-6 pb-5">
                        <div className="flex items-center gap-3 mb-1">
                            <p className="text-purple-200 text-sm">Total Given</p>
                        </div>
                        <p className="text-4xl font-bold">
                            ₦{total.toLocaleString()}
                        </p>
                        <p className="text-purple-200 text-sm mt-1">
                            Across {donations.length} records
                        </p>
                    </CardContent>
                </Card>

                {/* Breakdown */}
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
                                                width: total ? `${(amount / total) * 100}%` : '0%',
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
                                    title="No giving records yet"
                                    description="Your giving history will appear here once recorded by the admin"
                                />
                            </div>
                        ) : (
                            <div className="divide-y">
                                {donations.map((d) => (
                                    <div
                                        key={d.id}
                                        className="flex items-center justify-between
                      px-4 py-3 hover:bg-slate-50"
                                    >
                                        <div className="space-y-0.5">
                                            <span className={`text-xs px-2 py-0.5 rounded-full
                        font-medium ${typeColors[d.type] ?? typeColors.OTHER}`}>
                                                {d.type.replace(/_/g, ' ')}
                                            </span>
                                            <p className="text-xs text-slate-400">
                                                {new Date(d.donatedAt).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
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
            </div>
        </DashboardLayout>
    )
}
