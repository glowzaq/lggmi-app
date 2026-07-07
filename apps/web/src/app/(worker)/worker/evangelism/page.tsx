'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import EvangelismModal from '@/components/shared/EvangelismModal'
import StatCard from '@/components/shared/StatCard'
import { Globe, Plus, Pencil, Trash2, Users, Heart, Flame, Church } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import api from '@/services/api'

interface EvangelismRecord {
    id: string
    title: string
    date: string
    location: string | null
    numberOfReached: number
    numberOfConverted: number
    numberOfFilledSpirit: number
    followedUp: boolean
    assimilated: number
    notes: string | null
    conductedBy: { firstName: string; lastName: string }
}

interface Stats {
    totalReached: number
    totalConverted: number
    totalFilledSpirit: number
    totalAssimilated: number
    totalOutreaches: number
}

export default function WorkerEvangelismPage() {
    const { user } = useCurrentUser()
    const [records, setRecords] = useState<EvangelismRecord[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)

    const fetchData = async () => {
        const [recordsRes, statsRes] = await Promise.all([
            api.get('/evangelism'),
            api.get('/evangelism/stats'),
        ])
        setRecords(recordsRes.data.data)
        setStats(statsRes.data.data)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const handleOpenCreate = () => {
        setModalOpen(true)
    }

    return (
        <DashboardLayout role="WORKER">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Evangelism</h1>
                        <p className="text-slate-500">
                            Track outreach activities and soul winning
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-[#3f2039] text-white"
                    >
                        <Plus className="h-4 w-4" />
                        New Record
                    </Button>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <StatCard
                            title="Total Outreaches"
                            value={stats.totalOutreaches}
                            icon={Globe}
                            iconColor="text-blue-600"
                            iconBg="bg-blue-50"
                        />
                        <StatCard
                            title="Total Reached"
                            value={stats.totalReached}
                            icon={Users}
                            iconColor="text-purple-600"
                            iconBg="bg-purple-50"
                        />
                        <StatCard
                            title="Converted"
                            value={stats.totalConverted}
                            icon={Heart}
                            iconColor="text-red-600"
                            iconBg="bg-red-50"
                        />
                        <StatCard
                            title="Filled with Spirit"
                            value={stats.totalFilledSpirit}
                            icon={Flame}
                            iconColor="text-orange-600"
                            iconBg="bg-orange-50"
                        />
                        <StatCard
                            title="Assimilated"
                            value={stats.totalAssimilated}
                            icon={Church}
                            iconColor="text-green-600"
                            iconBg="bg-green-50"
                        />
                    </div>
                )}

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading evangelism records..." />
                    </div>
                ) : records.length === 0 ? (
                    <EmptyState
                        icon={Globe}
                        title="No evangelism records yet"
                        description="Start recording your outreach activities"
                        action={
                            <Button onClick={handleOpenCreate} className="flex items-center gap-2 bg-[#3f2039] text-white">
                                <Plus className="h-4 w-4" /> New Record
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {records.map((record) => (
                            <Card key={record.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-base font-semibold text-slate-800">
                                                {record.title}
                                            </CardTitle>
                                            <p className="text-sm text-slate-500 mt-0.5">
                                                {new Date(record.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                                {record.location && ` · ${record.location}`}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Reached', value: record.numberOfReached, color: 'text-blue-600' },
                                            { label: 'Converted', value: record.numberOfConverted, color: 'text-green-600' },
                                            { label: 'Filled Spirit', value: record.numberOfFilledSpirit, color: 'text-orange-600' },
                                            { label: 'Assimilated', value: record.assimilated, color: 'text-purple-600' },
                                        ].map((stat) => (
                                            <div key={stat.label} className="text-center p-3 bg-slate-50 rounded-lg">
                                                <p className={`text-2xl font-bold ${stat.color}`}>
                                                    {stat.value}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <p className="text-xs text-slate-400">
                      Conducted by{' '}
                      <span className="font-medium text-slate-600">
                        {record.conductedBy.firstName} {record.conductedBy.lastName}
                      </span>
                    </p>
                    {record.followedUp && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        ✓ Followed Up
                      </span>
                    )}
                  </div> */}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <EvangelismModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={fetchData}
                userId={user?.id ?? ''}
            />
        </DashboardLayout>
    )
}