'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Modal from '@/components/shared/Modal'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import { Heart, Plus } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import api from '@/services/api'

interface PrayerRequest {
    id: string
    title: string
    content: string
    status: 'PENDING' | 'PRAYED' | 'ANSWERED'
    createdAt: string
}

const statusConfig = {
    PENDING: { label: 'Pending', badge: 'bg-orange-100 text-orange-700' },
    PRAYED: { label: 'Prayed For', badge: 'bg-blue-100 text-blue-700' },
    ANSWERED: { label: 'Answered', badge: 'bg-green-100 text-green-700' },
}

export default function MemberPrayerPage() {
    const { user, loading: userLoading } = useCurrentUser()
    const [requests, setRequests] = useState<PrayerRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        title: '',
        content: '',
    })

    useEffect(() => {
        if (userLoading) return
        if (!user || !user.id) return

        api
            .get(`/prayer-requests/user/${user.id}`)
            .then(({ data }) => {
                setRequests(data.data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [userLoading, user])

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            setError('Title and content are required')
            return
        }

        if (!user?.id) {
            setError('Error, Please log in again.')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            const { data } = await api.post('/prayer-requests', {
                ...form,
                userId: user.id,
            })
            setRequests((prev) => [data.data, ...prev])
            setModalOpen(false)
            setForm({ title: '', content: ''})
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit request')
        } finally {
            setSubmitting(false)
        }
    }

    if (userLoading || loading) {
        return (
            <DashboardLayout role="MEMBER">
                <div className="p-6 py-16 flex justify-center">
                    <Spinner text="Loading prayer requests..." />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="MEMBER">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Prayer Requests
                        </h1>
                        <p className="text-slate-500">
                            Share your needs with the church for prayer
                        </p>
                    </div>
                    <Button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 bg-[#693565] hover:bg-[#9c5e96]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Request
                    </Button>
                </div>

                {requests.length === 0 ? (
                    <EmptyState
                        icon={Heart}
                        title="No prayer requests yet"
                        description="Submit your first prayer request and let the church stand with you"
                        action={
                            <Button
                                onClick={() => setModalOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Submit Request
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                            {requests.map((request) => (
                                <Card key={request.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between gap-3">
                                            <CardTitle className="text-base font-semibold text-slate-800">
                                                {request.title}
                                            </CardTitle>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${statusConfig[request.status].badge}`}>
                                                {statusConfig[request.status].label}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-sm text-slate-600">{request.content}</p>
                                        <p className="text-xs text-slate-400">
                                            Submitted{' '}
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

                {/* Submit Modal */}
                <Modal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false)
                        setError('')
                    }}
                    title="Submit Prayer Request"
                >
                    <div className="space-y-4">

                        {/* Confidentiality notice */}
                        <div className="flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                            <p className="text-sm text-purple-800 leading-relaxed">
                                Your prayer request is <span className="font-semibold">completely confidential</span>.
                                Only the Pastor, Admin and yourself will be able to see it.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Title *</Label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Brief title for your request"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Prayer Need *</Label>
                            <textarea
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                placeholder="Share what you'd like the Pastor and Admin to pray about..."
                                rows={4}
                                className="w-full px-3 py-2 border border-slate-200 rounded-md
          text-sm resize-none focus:outline-none
          focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setModalOpen(false)
                                    setError('')
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={submitting} className='bg-[#693565] hover:bg-[#9c5e96] text-white'>
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    )
}