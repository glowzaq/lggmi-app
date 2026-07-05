'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Modal from '@/components/shared/Modal'
import Spinner from '@/components/shared/Spinner'
import EmptyState from '@/components/shared/EmptyState'
import {
    DollarSign, TrendingUp, TrendingDown,
    Plus, BarChart3,
    Pencil,
} from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis,
    Tooltip, ResponsiveContainer,
} from 'recharts'
import api from '@/services/api'

interface Donation {
    id: string
    amount: number
    type: string
    donatedAt: string
    note: string | null
    user: {firstName: string; lastName: string}
}

interface DonationStats {
    allTime: number
    thisMonth: number
    lastMonth: number
    byType: { type: string; total: number; count: number }[]
    trend: { month: string; total: number }[]
}

const typeColors: Record<string, string> = {
    TITHE: 'bg-blue-100 text-blue-700',
    OFFERING: 'bg-emerald-50 text-black',
    SPECIAL_SEED: 'bg-purple-100 text-purple-700',
    OTHER: 'bg-slate-100 text-slate-700',
}

const donationTypes = [
    'TITHE', 'OFFERING', 'SPECIAL_SEED', 'OTHER',
]

export default function AdminDonationsPage() {
    const [stats, setStats] = useState<DonationStats | null>(null)
    const [donations, setDonations] = useState<Donation[]>([])
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editDonation, setEditDonation] = useState<Donation | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState('')
    const [form, setForm] = useState({
        userId: '',
        amount: '',
        type: 'OFFERING',
        note: '',
        donatedAt: new Date().toISOString().slice(0, 10),
    })

    const fetchData = async () => {
        const [statsRes, donationsRes, membersRes] = await Promise.all([
            api.get('/donations/stats'),
            api.get('/donations'),
            api.get('/users'),
        ])
        setStats(statsRes.data.data)
        setDonations(donationsRes.data.data)
        setMembers(membersRes.data.data)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async () => {
        if (!editDonation && !form.userId) {
            setFormError('Member is required')
            return
        }
        if (!form.amount || Number(form.amount) <= 0) {
            setFormError('Amount must be greater than zero')
            return
        }

        setSubmitting(true)
        setFormError('')

        try {
            if (editDonation) {
                await api.patch(`/donations/${editDonation.id}`, {
                    amount: Number(form.amount),
                    type: form.type,
                    note: form.note || undefined,
                    donatedAt: form.donatedAt,
                })
            } else {
                await api.post('/donations', {
                    userId: form.userId,
                    amount: Number(form.amount),
                    type: form.type,
                    note: form.note || undefined,
                    donatedAt: form.donatedAt,
                })
            }

            setModalOpen(false)
            setEditDonation(null)
            setForm({
                userId: '',
                amount: '',
                type: 'OFFERING',
                note: '',
                donatedAt: new Date().toISOString().slice(0, 10),
            })
            fetchData()
        } catch (err: any) {
            setFormError(
                err.response?.data?.message || 'Failed to save donation'
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (donation: Donation) => {
        setEditDonation(donation)
        setForm({
            userId: '',
            amount: String(donation.amount),
            type: donation.type,
            note: donation.note ?? '',
            donatedAt: new Date(donation.donatedAt)
                .toISOString()
                .slice(0, 10),
        })
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setEditDonation(null)
        setFormError('')
        setForm({
            userId: '',
            amount: '',
            type: 'OFFERING',
            note: '',
            donatedAt: new Date().toISOString().slice(0, 10),
        })
    }

    const growth =
        stats && stats.lastMonth > 0
            ? (
                ((stats.thisMonth - stats.lastMonth) / stats.lastMonth) *
                100
            ).toFixed(1)
            : null

    return (
        <DashboardLayout role="ADMIN">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Donations</h1>
                        <p className="text-slate-500">
                            Record and track church giving
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditDonation(null)
                            setForm({
                                userId: '',
                                amount: '',
                                type: 'OFFERING',
                                note: '',
                                donatedAt: new Date().toISOString().slice(0, 10),
                            })
                            setModalOpen(true)
                        }}
                        className="flex items-center gap-2 hover:bg-[#9c5e96] bg-[#693565]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Donation
                    </Button>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading donations..." />
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                {
                                    label: 'All Time',
                                    value: `₦${stats?.allTime?.toLocaleString()}`,
                                    icon: DollarSign,
                                    iconColor: 'text-blue-600',
                                    iconBg: 'bg-blue-50',
                                    sub: null,
                                },
                                {
                                    label: 'This Month',
                                    value: `₦${stats?.thisMonth?.toLocaleString()}`,
                                    icon: BarChart3,
                                    iconColor: 'text-green-600',
                                    iconBg: 'bg-green-50',
                                    sub: growth
                                        ? `${Number(growth) >= 0 ? '+' : ''}${growth}% vs last month`
                                        : null,
                                    subColor: Number(growth) >= 0 ? 'text-green-600' : 'text-red-500',
                                },
                                {
                                    label: 'Last Month',
                                    value: `₦${stats?.lastMonth?.toLocaleString()}`,
                                    icon: DollarSign,
                                    iconColor: 'text-slate-500',
                                    iconBg: 'bg-slate-100',
                                    sub: null,
                                },
                            ].map((card) => (
                                <Card key={card.label}>
                                    <CardContent className="pt-4">
                                        <div className={`p-2 rounded-lg ${card.iconBg} w-fit mb-3`}>
                                            <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                                        </div>
                                        <p className="text-2xl font-bold text-slate-800">
                                            {card.value}
                                        </p>
                                        <p className="text-sm text-slate-500">{card.label}</p>
                                        {card.sub && (
                                            <p className={`text-xs mt-1 ${(card as any).subColor}`}>
                                                {card.sub}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Trend chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-800">
                                    6-Month Giving Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={stats?.trend ?? []}>
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip
                                            formatter={(v: any) => `₦${v.toLocaleString()}`}
                                        />
                                        <Bar
                                            dataKey="total"
                                            fill="#7d4178"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-800">
                                    Recent Donations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {donations.length === 0 ? (
                                    <div className="py-8">
                                        <EmptyState
                                            icon={DollarSign}
                                            title="No donations yet"
                                            description="Record the first donation using the button above"
                                        />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-slate-50">
                                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Member</th>
                                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Type</th>
                                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Amount</th>
                                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Note</th>
                                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {donations.map((d) => (
                                                    <tr
                                                        key={d.id}
                                                        className="border-b last:border-0 hover:bg-slate-50"
                                                    >
                                                        <td className="px-4 py-3 font-medium text-slate-800">
                                                            {d.user.firstName} {d.user.lastName}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`text-s px-2 py-1 rounded-full font-medium ${typeColors[d.type]}`}>
                                                                {d.type.replace(/_/g, ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 font-semibold text-[#3f2039]">
                                                            ₦{Number(d.amount).toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-500">
                                                            {new Date(d.donatedAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-400 text-xs">
                                                            {d.note ?? '—'}
                                                        </td>
                                                        <td className='px-4 py-3 text-slate-400 text-xs'>
                                                            <button onClick={()=> handleEdit(d)}>
                                                            <Pencil className='h-3.5 w-3.5'/>

                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={editDonation ? 'Edit Donation' : 'Record Donation'}
            >
                <div className="space-y-4">
                    {!editDonation && (
                        <div className="space-y-1.5">
                            <Label>Member *</Label>
                            <select
                                value={form.userId}
                                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-md
            text-sm bg-white focus:outline-none focus:ring-2
            focus:ring-blue-500"
                            >
                                <option value="">Select a member...</option>
                                {members.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.firstName} {m.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {editDonation && (
                        <div className="space-y-1.5">
                            <Label>Member</Label>
                            <div className="px-3 py-2 bg-slate-50 border border-slate-200
          rounded-md text-sm text-slate-600">
                                {editDonation.user.firstName} {editDonation.user.lastName}
                            </div>
                            <p className="text-xs text-slate-400">
                                Member cannot be changed on an existing record
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Amount (₦) *</Label>
                            <Input
                                type="number"
                                min="0"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                placeholder="e.g. 5000"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Type</Label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-md
            text-sm bg-white focus:outline-none focus:ring-2
            focus:ring-blue-500"
                            >
                                {donationTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={form.donatedAt}
                            onChange={(e) => setForm({ ...form, donatedAt: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Note (optional)</Label>
                        <Input
                            value={form.note}
                            onChange={(e) => setForm({ ...form, note: e.target.value })}
                            placeholder="e.g. Sunday offering - 12th Jan"
                        />
                    </div>

                    {formError && (
                        <p className="text-sm text-red-500">{formError}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting
                                ? 'Saving...'
                                : editDonation
                                    ? 'Save Changes'
                                    : 'Record Donation'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}