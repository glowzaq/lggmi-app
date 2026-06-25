'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/components/shared/Spinner'
import { User, Save } from 'lucide-react'
import api from '@/services/api'

export default function MemberProfilePage() {
    const [member, setMember] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        phone: '',
        address: '',
        occupation: '',
        dateOfBirth: '',
    })

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (!stored) return

        setLoading(true)

        api.get('/members/me')
            .then(({ data }) => {
                const me = data.data?.member || data.member || data.data
                if (!me) throw new Error('Profile record not found')

                setMember(me)
                setForm({
                    phone: me.phone ?? '',
                    address: me.address ?? '',
                    occupation: me.occupation ?? '',
                    dateOfBirth: me.dateOfBirth
                        ? new Date(me.dateOfBirth).toISOString().slice(0, 10)
                        : '',
                })
                setLoading(false)
            })
            .catch((err) => {
                console.error("Failed to load profile data:", err)
                setLoading(false)
            })
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setError('')
        try {
            await api.patch(`/members/${member.id}`, form)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <DashboardLayout role="MEMBER">
                <div className="p-6 py-20 flex justify-center">
                    <Spinner text="Loading profile..." />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="MEMBER">
            <div className="p-6 space-y-6 max-w-2xl">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                    <p className="text-slate-500">View and update your information</p>
                </div>

                {/* Avatar card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-[#683565] flex
                items-center justify-center text-white text-2xl font-bold">
                                {member.firstName[0]}{member.lastName[0]}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    {member.firstName} {member.lastName}
                                </h2>
                                <p className="text-slate-500">{member.user.email}</p>
                                <span className="text-xs bg-blue-100 text-black px-2 py-0.5 rounded-full font-medium">
                                    {member.user.role}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Read-only info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-slate-700">
                            Church Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        {[
                            {
                                label: 'Gender',
                                value: member.gender
                                    ? member.gender[0] + member.gender.slice(1).toLowerCase()
                                    : 'Not set',
                            },
                            {
                                label: 'Marital Status',
                                value: member.maritalStatus
                                    ? member.maritalStatus[0] +
                                    member.maritalStatus.slice(1).toLowerCase()
                                    : 'Not set',
                            },
                            {
                                label: 'Member Since',
                                value: new Date(member.joinedAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric',
                                }),
                            },
                            {
                                label: 'Family',
                                value: member.family?.name ?? 'No family group',
                            },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                                <p className="font-medium text-slate-800">{item.value}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Editable fields */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-slate-700">
                            Personal Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Phone Number</Label>
                                <Input
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({ ...form, phone: e.target.value })
                                    }
                                    placeholder="+234 000 000 0000"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={form.dateOfBirth}
                                    onChange={(e) =>
                                        setForm({ ...form, dateOfBirth: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Occupation</Label>
                            <Input
                                value={form.occupation}
                                onChange={(e) =>
                                    setForm({ ...form, occupation: e.target.value })
                                }
                                placeholder="e.g. Software Engineer"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Home Address</Label>
                            <Input
                                value={form.address}
                                onChange={(e) =>
                                    setForm({ ...form, address: e.target.value })
                                }
                                placeholder="Your home address"
                            />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button
                            onClick={handleSave}
                            disabled={saving || saved}
                            className="flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}