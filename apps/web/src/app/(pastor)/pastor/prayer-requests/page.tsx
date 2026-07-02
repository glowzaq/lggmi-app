'use client'

import api from "@/services/api"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import Spinner from "@/components/shared/Spinner"
import EmptyState from "@/components/shared/EmptyState"
import { Star, Clock, CheckCircle, Heart } from "lucide-react"

interface PrayerRequest {
    id: string
    title: string
    content: string
    status: 'ANSWERED' | 'PENDING' | 'PRAYED'
    isPrivate: boolean
    createdAt: string
    firstName: string
    lastName: string
}

const statusConfig = {
    PENDING: {label: 'Pending', badge: 'bg-orange-100, text-orange-700'},
    PRAYED: {label: 'Prayed', badge: 'bg-blue-100, text-blue-700'},
    ANSWERED: {label: 'Answered', badge: 'bg-green-100, text-green-700'}
}

export default function PastorPrayerPage() {
    const [requests, setRequests] = useState<PrayerRequest[]>([])
    const [stats, setStats] = useState<any>(null)
    const [filter, setFilter] = useState<string>('ALL')
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        Promise.all([
            api.get('/prayer-requests'),
            api.get('/prayer-requests/stats'),
        ]).then(([reqRes, statsRes]) => {
            setRequests(reqRes.data.data)
            setStats(statsRes.data.data)
            setLoading(false)
        })
    }, [])

    const handleStatusUpdate = async (id: string, status: 'PENDING' | 'PRAYED' | 'ANSWERED') => {
        await api.patch(`prayer-requests/${id}/status`, {status})

        setRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status } : r))
        )
    }

    const filtered =
        filter === 'ALL'
            ? requests
            : requests.filter((r) => r.status === filter)

    return (
        <DashboardLayout role="PASTOR">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Prayer Requests
                    </h1>
                    <p className="text-slate-500">
                        Intercede for the congregation's needs
                    </p>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { key: 'ALL', label: 'Total', value: stats.total, icon: Star, color: 'text-slate-600', bg: 'bg-slate-100' },
                            { key: 'PENDING', label: 'Pending', value: stats.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
                            { key: 'PRAYED', label: 'Prayed', value: stats.prayed, icon: Heart, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { key: 'ANSWERED', label: 'Answered', value: stats.answered, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                        ].map((s) => (
                            <Card
                                key={s.key}
                                className={`cursor-pointer transition-all hover:shadow-md ${filter === s.key ? 'ring-2 ring-[#683565]' : ''}`}
                                onClick={() => setFilter(s.key)}
                            >
                                <CardContent className="pt-4">
                                    <div className={`p-2 rounded-lg ${s.bg} w-fit mb-2`}>
                                        <s.icon className={`h-4 w-4 ${s.color}`} />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {s.value}
                                    </p>
                                    <p className="text-sm text-slate-500">{s.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="py-12 flex justify-center">
                        <Spinner text="Loading prayer requests..." />
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={Heart}
                        title="No prayer requests"
                        description="No requests match the current filter"
                    />
                ) : (
                    <div className="space-y-3">
                        {filtered.map((request) => (
                            <Card key={request.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-base font-semibold
                        text-slate-800">
                                                {request.title}
                                            </CardTitle>
                                            <p className="text-sm text-slate-500 mt-0.5">
                                                {request.firstName} {request.lastName}
                                                {request.isPrivate && (
                                                    <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                                                        Private
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0
                        ${statusConfig[request.status].badge}`}>
                                            {statusConfig[request.status].label}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-slate-600">{request.content}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-slate-400">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="flex gap-2">
                                            {request.status !== 'PRAYED' && (
                                                <button
                                                    onClick={() =>
                                                        handleStatusUpdate(request.id, 'PRAYED')
                                                    }
                                                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700
                            rounded hover:bg-blue-100 transition-colors"
                                                >
                                                    Mark Prayed
                                                </button>
                                            )}
                                            {request.status !== 'ANSWERED' && (
                                                <button
                                                    onClick={() =>
                                                        handleStatusUpdate(request.id, 'ANSWERED')
                                                    }
                                                    className="text-xs px-2 py-1 bg-green-50
                            text-green-700 rounded hover:bg-green-100
                            transition-colors"
                                                >
                                                    Mark Answered
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

