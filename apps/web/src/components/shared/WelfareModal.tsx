'use client'

import { useState } from 'react'
import Modal from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/services/api'

interface WelfareModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    userId: string
    record?: any
}

export default function WelfareModal({
    isOpen,
    onClose,
    onSuccess,
    userId,
    record,
}: WelfareModalProps) {
    const isEdit = !!record
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        title: record?.title ?? '',
        description: record?.description ?? '',
        amount: record?.amount ?? '',
        date: record?.date
            ? new Date(record.date).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        recipient: record?.recipient ?? '',
        notes: record?.notes ?? '',
    })

    const set = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    const handleSubmit = async () => {
        if (!form.title || !form.description || !form.amount) {
            setError('Title, description and amount are required')
            return
        }
        if (Number(form.amount) <= 0) {
            setError('Amount must be greater than zero')
            return
        }

        setLoading(true)
        setError('')

        try {
            if (isEdit) {
                await api.patch(`/welfare/${record.id}`, {
                    ...form,
                    amount: Number(form.amount),
                })
            } else {
                await api.post('/welfare', {
                    ...form,
                    amount: Number(form.amount),
                    createdById: userId,
                })
            }
            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Welfare Record' : 'New Welfare Record'}
        >
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label>Title *</Label>
                    <Input
                        value={form.title}
                        onChange={(e) => set('title', e.target.value)}
                        placeholder="e.g. Food Assistance - Bro Daniel"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Description *</Label>
                    <textarea
                        value={form.description}
                        onChange={(e) => set('description', e.target.value)}
                        placeholder="Describe the welfare support given..."
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md
              text-sm resize-none focus:outline-none
              focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>Amount Given (₦) *</Label>
                        <Input
                            type="number"
                            min="0"
                            value={form.amount}
                            onChange={(e) => set('amount', e.target.value)}
                            placeholder="e.g. 10000"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={form.date}
                            onChange={(e) => set('date', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Recipient (optional)</Label>
                    <Input
                        value={form.recipient}
                        onChange={(e) => set('recipient', e.target.value)}
                        placeholder="Name of recipient"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Notes (optional)</Label>
                    <textarea
                        value={form.notes}
                        onChange={(e) => set('notes', e.target.value)}
                        placeholder="Additional notes..."
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} className='bg-[#3f2039] text-white hover:bg-[#3f2039] hover:text-white cursor-pointer' disabled={loading}>
                        {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Record'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}