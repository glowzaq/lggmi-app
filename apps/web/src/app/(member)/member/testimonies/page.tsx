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
import { Star, Plus, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import api from '@/services/api'

interface Testimony {
    id: string
    title: string
    content: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    createdAt: string
    user: { firstName: string; lastName: string }
}

const statusConfig = {
    PENDING: {
        label: 'Awaiting Approval',
        badge: 'bg-orange-100 text-orange-700',
        icon: Clock,
    },
    APPROVED: {
        label: 'Approved',
        badge: 'bg-green-100 text-green-700',
        icon: CheckCircle,
    },
    REJECTED: {
        label: 'Not Approved',
        badge: 'bg-red-100 text-red-600',
        icon: XCircle,
    },
}

export default function MemberTestimoniesPage() {
    const { user, loading: userLoading } = useCurrentUser()
    const [approved, setApproved] = useState<Testimony[]>([])
    const [myTestimonies, setMyTestimonies] = useState<Testimony[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all')
    const [form, setForm] = useState({ title: '', content: '' })

    useEffect(() => {
        if (userLoading || !user || !user.id) return

        Promise.all([
            api.get('/testimonies/approved'),
            api.get(`/testimonies/user/${user.id}`),
        ]).then(([approvedRes, mineRes]) => {
            setApproved(approvedRes.data.data)
            setMyTestimonies(mineRes.data.data)
            setLoading(false)
        })
    }, [userLoading, user])

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            setError('Title and content are required')
            return
        }

        if (!user || !user.id) {
            setError('Could not identify your profile. Please try again.')
            return
        }


        setSubmitting(true)
        setError('')

        try {
            const { data } = await api.post('/testimonies', {
                userId: user!.id,
                title: form.title,
                content: form.content,
            })
            setMyTestimonies((prev) => [data.data, ...prev])
            setModalOpen(false)
            setForm({ title: '', content: '' })
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit testimony')
        } finally {
            setSubmitting(false)
        }
    }

    if (userLoading || loading) {
        return (
            <DashboardLayout role="MEMBER">
                <div className="p-6 py-20 flex justify-center">
                    <Spinner text="Loading testimonies..." />
                </div>
            </DashboardLayout>
        )
    }

    const displayList = activeTab === 'all' ? approved : myTestimonies

    return (
        <DashboardLayout role="MEMBER">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Testimonies</h1>
                        <p className="text-slate-500">
                            Share and celebrate what God has done
                        </p>
                    </div>
                    <Button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 text-white hover:bg-[#693565] text-white cursor-pointer bg-[#3f2039]"
                        disabled={!user}
                    >
                        <Plus className="h-4 w-4" />
                        Share Testimony
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b">
                    {[
                        { key: 'all', label: `All Testimonies (${approved.length})` },
                        { key: 'mine', label: `My Testimonies (${myTestimonies.length})` },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as 'all' | 'mine')}
                            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                                ? 'border-[#3f2039] text-[#3f2039]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {displayList.length === 0 ? (
                    <EmptyState
                        icon={Star}
                        title={
                            activeTab === 'all'
                                ? 'No testimonies yet'
                                : 'You have no testimonies yet'
                        }
                        description={
                            activeTab === 'all'
                                ? 'Be the first to share what God has done'
                                : 'Share your testimony and encourage others'
                        }
                        action={
                            <Button
                                onClick={() => setModalOpen(true)}
                                className="flex items-center gap-2 hover:bg-[#3f2039] hover:text-white cursor-pointer bg-[#3f2039] text-white"
                            >
                                <Plus className="h-4 w-4" /> Share Testimony
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {displayList.map((testimony) => {
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
                                                    {testimony.user?.firstName} {testimony.user?.lastName}
                                                </p>
                                            </div>
                                            {activeTab === 'mine' && (
                                                <span className={`text-xs px-2 py-1 rounded-full
                          font-medium shrink-0 ${config.badge}`}>
                                                    {config.label}
                                                </span>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {testimony.content}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(testimony.createdAt).toLocaleDateString(
                                                'en-US',
                                                { month: 'long', day: 'numeric', year: 'numeric' }
                                            )}
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setError('') }}
                title="Share Your Testimony"
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-green-50 border
            border-green-200 rounded-lg px-4 py-3">
                        <p className="text-sm text-green-800 leading-relaxed">
                            Your testimony will be reviewed by the Pastor or Admin
                            before it appears to other members.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Title *</Label>
                        <Input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="e.g. What God did"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Your Testimony *</Label>
                        <textarea
                            value={form.content}
                            onChange={(e) =>
                                setForm({ ...form, content: e.target.value })
                            }
                            placeholder="How God did it"
                            rows={5}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md
                text-sm resize-none focus:outline-none
                focus:ring-2 focus:ring-[#3f2039]"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            onClick={() => { setModalOpen(false); setError('') }}
                            className='hover:bg-[#3f2039] bg-slate-400 hover:text-white text-slate-900'
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} className='hover:bg-[#3f2039] hover:text-white cursor-pointer bg-[#3f2039] text-white' disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Testimony'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}