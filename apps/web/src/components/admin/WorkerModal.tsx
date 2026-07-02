'use client'

import { useState } from 'react'
import Modal from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/services/api'

interface WorkerModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function WorkerModal({
    isOpen,
    onClose,
    onSuccess,
}: WorkerModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: 'WORKER',
    })

    const set = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    const handleSubmit = async () => {
        if (!form.firstName || !form.lastName || !form.email || !form.password) {
            setError('All fields except phone are required')
            return
        }

        setLoading(true)
        setError('')

        try {
            await api.post('/auth/create-worker', form)
            onSuccess()
            onClose()
            setForm({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phone: '',
                role: 'WORKER',
            })
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create worker account')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Worker Account"
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label>First Name *</Label>
                        <Input
                            value={form.firstName}
                            onChange={(e) => set('firstName', e.target.value)}
                            placeholder="John"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Last Name *</Label>
                        <Input
                            value={form.lastName}
                            onChange={(e) => set('lastName', e.target.value)}
                            placeholder="Doe"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Email *</Label>
                    <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="worker@church.com"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                        placeholder="+234 000 000 0000"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Temporary Password *</Label>
                    <Input
                        type="password"
                        value={form.password}
                        onChange={(e) => set('password', e.target.value)}
                        placeholder="They can change this later"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Role</Label>
                    <select
                        value={form.role}
                        onChange={(e) => set('role', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md
              text-sm bg-white focus:outline-none focus:ring-2
              focus:ring-blue-500"
                    >
                        <option value="WORKER">Worker</option>
                        <option value="PASTOR">Pastor</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <p className="text-xs text-slate-400">
                        Worker can create records but cannot edit or delete.
                        Pastor has read-only access.
                    </p>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Account'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}