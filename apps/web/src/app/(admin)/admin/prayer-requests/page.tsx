'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import { Heart, Trash2 } from 'lucide-react'
import api from '@/services/api'
import { useConfirm } from '@/hooks/useConfirm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface PrayerRequest {
    id: string
    title: string
    content: string
    createdAt: string
    user: { firstName: string; lastName: string }
}

export default function AdminPrayerRequestsPage() {
    const [requests, setRequests] = useState<PrayerRequest[]>([])
    const [loading, setLoading] = useState(true)

    const {confirm, dialogProps } = useConfirm()

    useEffect(() => {
        api.get('/prayer-requests').then(({ data }) => {
            setRequests(data.data)
            setLoading(false)
        })
    }, [])

    const handleDelete = async (id: string) => {
        confirm(
            {
            title: 'Delete Record',
            message: 'This action cannot be undone. Are you sure?',
            confirmLabel: 'Yes, Delete',
        },
        async () => {
            await api.delete(`/prayer-requests/${id}`)
            setRequests((prev) => prev.filter((r) => r.id !== id))
        }
    )
}

    return (
        <DashboardLayout role="ADMIN">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Prayer Requests
                        </h1>
                        <p className="text-slate-500">
                            {requests.length} total prayer{' '}
                            {requests.length !== 1 ? 'requests' : 'request'}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 flex justify-center">
                        <Spinner text="Loading prayer requests..." />
                    </div>
                ) : requests.length === 0 ? (
                    <EmptyState
                        icon={Heart}
                        title="No prayer requests yet"
                        description="Prayer requests submitted by members will appear here"
                    />
                ) : (
                    <div className="space-y-3">
                        {requests.map((request) => (
                            <Card key={request.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-base font-semibold
                        text-slate-800">
                                                {request.title}
                                            </CardTitle>
                                            <p className="text-sm text-slate-500 mt-0.5">
                                                {request.user.firstName} {request.user.lastName}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(request.id)}
                                            className="p-1.5 hover:bg-red-50 rounded-lg
                        transition-colors shrink-0"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600">{request.content}</p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialog {...dialogProps} />
        </DashboardLayout>
    )
}