'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import WelfareModal from '@/components/shared/WelfareModal'
import StatCard from '@/components/shared/StatCard'
import { HandHeart, Plus, Pencil, Trash2, DollarSign, BarChart3 } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import api from '@/services/api'

interface WelfareRecord {
    id: string
    title: string
    description: string
    amount: number
    date: string
    recipient: string | null
    notes: string | null
    createdBy: { firstName: string; lastName: string }
}

export default function WorkerWelfarePage() {
    const { user } = useCurrentUser()
    const [records, setRecords] = useState<WelfareRecord[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    // const [editingRecord, setEditingRecord] = useState<any>(null)

    const fetchData = async () => {
        const [recordsRes, statsRes] = await Promise.all([
            api.get('/welfare'),
            api.get('/welfare/stats'),
        ])
        setRecords(recordsRes.data.data)
        setStats(statsRes.data.data)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    // const handleDelete = async (id: string) => {
    //     if (!confirm('Delete this welfare record?')) return
    //     await api.delete(`/welfare/${id}`)
    //     setRecords((prev) => prev.filter((r) => r.id !== id))
    // }

    return (
        <DashboardLayout role="WORKER">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Welfare</h1>
                        <p className="text-slate-500">
                            Track church welfare and support given
                        </p>
                    </div>
                    <Button
                        onClick={() => { setModalOpen(true) }}
                        className="flex items-center bg-[#3f2039] text-white gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Record
                    </Button>
                </div>

                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard
                            title="Total Given (All Time)"
                            value={`₦${stats.totalAmount?.toLocaleString()}`}
                            icon={DollarSign}
                            iconColor="text-green-600"
                            iconBg="bg-green-50"
                        />
                        <StatCard
                            title="This Month"
                            value={`₦${stats.thisMonth?.toLocaleString()}`}
                            icon={BarChart3}
                            iconColor="text-blue-600"
                            iconBg="bg-blue-50"
                        />
                        <StatCard
                            title="Total Records"
                            value={stats.totalRecords}
                            icon={HandHeart}
                            iconColor="text-purple-600"
                            iconBg="bg-purple-50"
                        />
                    </div>
                )}

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading welfare records..." />
                    </div>
                ) : records.length === 0 ? (
                    <EmptyState
                        icon={HandHeart}
                        title="No welfare records yet"
                        description="Start recording church welfare and support"
                        action={
                            <Button
                                onClick={() => setModalOpen(true)}
                                className="flex bg-[#3f2039] text-white items-center gap-2"
                            >
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
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                                {record.recipient && ` · Recipient: ${record.recipient}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-lg font-bold text-green-600">
                                                ₦{Number(record.amount).toLocaleString()}
                                            </span>
                                            {/* <button
                                                onClick={() => { setEditingRecord(record); setModalOpen(true) }}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <Pencil className="h-4 w-4 text-slate-500" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(record.id)}
                                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </button> */}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600">{record.description}</p>
                                    {record.notes && (
                                        <p className="text-xs text-slate-400 mt-2 italic">
                                            {record.notes}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-400 mt-2">
                                        Recorded by{' '}
                                        <span className="font-medium text-slate-600">
                                            {record.createdBy.firstName} {record.createdBy.lastName}
                                        </span>
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <WelfareModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={fetchData}
                userId={user?.id ?? ''}
                // record={editingRecord}
            />
        </DashboardLayout>
    )
}