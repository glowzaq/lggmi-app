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
import { Users, Plus, Trash2 } from 'lucide-react'
import api from '@/services/api'

interface Family {
    id: string
    name: string
    createdAt: string
    _count: { members: number }
}

export default function AdminFamiliesPage() {
    const [families, setFamilies] = useState<Family[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [familyName, setFamilyName] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const fetchFamilies = async () => {
        const { data } = await api.get('/families')
        setFamilies(data.data)
        setLoading(false)
    }

    useEffect(() => { fetchFamilies() }, [])

    const handleCreate = async () => {
        if (!familyName.trim()) {
            setError('Family group name is required')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            await api.post('/families', { name: familyName.trim() })
            setFamilyName('')
            setModalOpen(false)
            fetchFamilies()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create family group')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string, memberCount: number) => {
        if (memberCount > 0) {
            alert(
                `This family group has ${memberCount} member${memberCount > 1 ? 's' : ''}. Reassign them before deleting.`
            )
            return
        }
        if (!confirm('Delete this family group?')) return

        await api.delete(`/families/${id}`)
        setFamilies((prev) => prev.filter((f) => f.id !== id))
    }

    return (
        <DashboardLayout role="ADMIN">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Family Groups
                        </h1>
                        <p className="text-slate-500">
                            Organise members into family units
                        </p>
                    </div>
                    <Button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Family Group
                    </Button>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading family groups..." />
                    </div>
                ) : families.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No family groups yet"
                        description="Create family groups to organise your congregation"
                        action={
                            <Button
                                onClick={() => setModalOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                New Family Group
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {families.map((family) => (
                            <Card
                                key={family.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-base font-semibold
                      text-slate-800">
                                            {family.name}
                                        </CardTitle>
                                        <button
                                            onClick={() =>
                                                handleDelete(family.id, family._count.members)
                                            }
                                            className="p-1.5 hover:bg-red-50 rounded-lg
                        transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-400" />
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-sm
                    text-slate-500">
                                        <Users className="h-4 w-4" />
                                        <span>
                                            {family._count.members} member
                                            {family._count.members !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">
                                        Created{' '}
                                        {new Date(family.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setFamilyName('')
                    setError('')
                }}
                title="Create Family Group"
                size="sm"
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Family Group Name *</Label>
                        <Input
                            value={familyName}
                            onChange={(e) => setFamilyName(e.target.value)}
                            placeholder="e.g. The Akintokun Family"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreate()
                            }}
                        />
                        <p className="text-xs text-slate-400">
                            Members can then select their family group
                            from their profile page
                        </p>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setModalOpen(false)
                                setFamilyName('')
                                setError('')
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Group'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}