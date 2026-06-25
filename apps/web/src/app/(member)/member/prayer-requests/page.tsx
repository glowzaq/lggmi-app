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
import api from '@/services/api'

interface PrayerRequest {
    id: string
    title: string
    content: string
    status: 'PENDING' | 'PRAYED' | 'ANSWERED'
    isPrivate: boolean
    createdAt: string
}

const statusConfig = {
    PENDING: { label: 'Pending', badge: 'bg-orange-100 text-orange-700' },
    PRAYED: { label: 'Prayed For', badge: 'bg-blue-100 text-blue-700' },
    ANSWERED: { label: 'Answered', badge: 'bg-green-100 text-green-700' },
}

export default function MemberPrayerPage() {
    const [requests, setRequests] = useState<PrayerRequest[]>([])
    const [memberId, setMemberId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        title: '',
        content: '',
        isPrivate: false,
    })

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (!stored) return
        const u = JSON.parse(stored)

        api.get('/members/me').then(({ data }) => {
            const memberProfile = data.data?.member || data.member || data.data
            if (memberProfile?.id) {
                setMemberId(memberProfile.Id)
                return api.get(`/prayer-requests/member/${memberProfile.id}`)
            } else {
                throw new Error('No associated member profile found')
            }
            })

            .then(({ data: d }) => {
                setRequests(d.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error("Dashboard data initialization failed:", err)
                setLoading(false)
            })
    }, [])

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            setError('Title and content are required')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            const { data } = await api.post('/prayer-requests', {
                ...form,
                memberId,
            })
            setRequests((prev) => [data.data, ...prev])
            setModalOpen(false)
            setForm({ title: '', content: '', isPrivate: false })
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit request')
        } finally {
            setSubmitting(false)
        }
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
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Request
                    </Button>
                </div>

                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner text="Loading prayer requests..." />
                    </div>
                ) : requests.length === 0 ? (
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
                                        <div className="flex items-center gap-2 shrink-0">
                                            {request.isPrivate && (
                                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                                                    Private
                                                </span>
                                            )}
                                            <span className={`text-xs px-2 py-1 rounded-full
                        font-medium ${statusConfig[request.status].badge}`}>
                                                {statusConfig[request.status].label}
                                            </span>
                                        </div>
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
                        <div className="space-y-1.5">
                            <Label>Title *</Label>
                            <Input
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                                placeholder="Brief title for your request"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Prayer Need *</Label>
                            <textarea
                                value={form.content}
                                onChange={(e) =>
                                    setForm({ ...form, content: e.target.value })
                                }
                                placeholder="Share what you'd like the church to pray about..."
                                rows={4}
                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Private toggle */}
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="isPrivate"
                                checked={form.isPrivate}
                                onChange={(e) =>
                                    setForm({ ...form, isPrivate: e.target.checked })
                                }
                                className="h-4 w-4 rounded border-slate-300 text-blue-600"
                            />
                            <div>
                                <label
                                    htmlFor="isPrivate"
                                    className="text-sm font-medium text-slate-800 cursor-pointer"
                                >
                                    Keep this private
                                </label>
                                <p className="text-xs text-slate-400">
                                    Only Pastor and Admin will see private requests
                                </p>
                            </div>
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
                            <Button onClick={handleSubmit} disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    )
}