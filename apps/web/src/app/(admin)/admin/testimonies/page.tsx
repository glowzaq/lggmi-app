'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import {
    Star, Clock, CheckCircle,
    XCircle, Trash2,
} from 'lucide-react'
import api from '@/services/api'

interface Testimony {
    id: string
    title: string
    content: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    createdAt: string
    user: { firstName: string; lastName: string }
    approvedBy: { firstName: string; lastName: string } | null
}

const statusConfig = {
    PENDING: { label: 'Pending', badge: 'bg-orange-100 text-orange-700' },
    APPROVED: { label: 'Approved', badge: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'Rejected', badge: 'bg-red-100 text-red-600' },
}

export default function AdminTestimoniesPage() {
    const [testimonies, setTestimonies] = useState<Testimony[]>([])
    const [stats, setStats] = useState<any>(null)
    const [filter, setFilter] = useState<string>('ALL')
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        const [testRes, statsRes] = await Promise.all([
            api.get('/testimonies'),
            api.get('/testimonies/stats'),
        ])
        setTestimonies(testRes.data.data)
        setStats(statsRes.data.data)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const handleApprove = async (id: string) => {
        await api.patch(`/testimonies/${id}/approve`)
        setTestimonies((prev) =>
            prev.map((t) => t.id === id ? { ...t, status: 'APPROVED' } : t)
        )
    }

    const handleReject = async (id: string) => {
        await api.patch(`/testimonies/${id}/reject`)
        setTestimonies((prev) =>
            prev.map((t) => t.id === id ? { ...t, status: 'REJECTED' } : t)
        )
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this testimony?')) return
        await api.delete(`/testimonies/${id}`)
        setTestimonies((prev) => prev.filter((t) => t.id !== id))
    }

    const filtered = filter === 'ALL'
        ? testimonies
        : testimonies.filter((t) => t.status === filter)

    return (
        <DashboardLayout role="ADMIN">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Testimonies</h1>
                    <p className="text-slate-500">
                        Review and approve member testimonies
                    </p>
                </div>

                {/* Stats filter cards */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { key: 'ALL', label: 'Total', value: stats.total, icon: Star, color: 'text-slate-600', bg: 'bg-slate-100' },
                            { key: 'PENDING', label: 'Pending', value: stats.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
                            { key: 'APPROVED', label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                            { key: 'REJECTED', label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
                        ].map((s) => (
                            <Card
                                key={s.key}
                                onClick={() => setFilter(s.key)}
                                className={`cursor-pointer hover:shadow-md transition-all ${filter === s.key ? 'ring-2 ring-[#693565]' : ''
                                    }`}
                            >
                                <CardContent className="pt-4">
                                    <div className={`p-2 rounded-lg ${s.bg} w-fit mb-2`}>
                                        <s.icon className={`h-4 w-4 ${s.color}`} />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                                    <p className="text-sm text-slate-500">{s.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="py-12 flex justify-center">
                        <Spinner text="Loading testimonies..." />
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={Star}
                        title="No testimonies found"
                        description="No testimonies match the selected filter"
                    />
                ) : (
                    <div className="space-y-4">
                        {filtered.map((testimony) => {
                            const config = statusConfig[testimony.status]
                            return (
                                <Card key={testimony.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <CardTitle className="text-base font-semibold text-slate-800">
                                                    {testimony.title}
                                                </CardTitle>
                                                <p className="text-sm text-slate-500 mt-0.5">
                                                    {testimony.user.firstName} {testimony.user.lastName}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`text-xs px-2 py-1 rounded-full
                          font-medium ${config.badge}`}>
                                                    {config.label}
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(testimony.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {testimony.content}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-slate-400">
                                                {new Date(testimony.createdAt).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-2">
                                                {testimony.status !== 'APPROVED' && (
                                                    <button
                                                        onClick={() => handleApprove(testimony.id)}
                                                        className="text-xs px-3 py-1.5 bg-green-600
                              text-white rounded-lg hover:bg-green-700
                              transition-colors font-medium"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {testimony.status !== 'REJECTED' && (
                                                    <button
                                                        onClick={() => handleReject(testimony.id)}
                                                        className="text-xs px-3 py-1.5 bg-slate-100
                              text-slate-700 rounded-lg hover:bg-slate-200
                              transition-colors font-medium"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}