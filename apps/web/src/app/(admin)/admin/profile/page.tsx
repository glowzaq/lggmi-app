'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/components/shared/Spinner'
import { Save, User, Church } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import api from '@/services/api'

const genderOptions = [
    { value: '', label: 'Select gender' },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
]

const maritalOptions = [
    { value: '', label: 'Select status' },
    { value: 'SINGLE', label: 'Single' },
    { value: 'MARRIED', label: 'Married' },
    { value: 'WIDOWED', label: 'Widowed' },
    { value: 'DIVORCED', label: 'Divorced' },
]

export default function AdminProfilePage() {
    const { user, loading: userLoading } = useCurrentUser()
    const [families, setFamilies] = useState<{ id: string; name: string }[]>([])
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        phone: '',
        address: '',
        occupation: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        familyId: '',
    })

    useEffect(() => {
        if (userLoading || !user) return
        setForm({
            phone: user.phone ?? '',
            address: user.address ?? '',
            occupation: user.occupation ?? '',
            dateOfBirth: user.dateOfBirth
                ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
                : '',
            gender: user.gender ?? '',
            maritalStatus: user.maritalStatus ?? '',
            familyId: user.family?.id ?? '',
        })
    }, [userLoading, user])

    useEffect(() => {
        api.get('/families').then(({ data }) => {
            setFamilies(data.data)
        }).catch(() => { })
    }, [])

    const set = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    const handleSave = async () => {
        if (!user) return
        setSaving(true)
        setError('')
        try {
            await api.patch(`/users/${user.id}`, {
                ...form,
                gender: form.gender || undefined,
                maritalStatus: form.maritalStatus || undefined,
                familyId: form.familyId || undefined,
                dateOfBirth: form.dateOfBirth || undefined,
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (userLoading) {
        return (
            <DashboardLayout role="ADMIN">
                <div className="p-6 py-20 flex justify-center">
                    <Spinner text="Loading profile..." />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="ADMIN">
            <div className="p-6 space-y-6">

                {/* ── Header with avatar ────────────────────────────── */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                        <p className="text-slate-500">Keep your information up to date</p>
                    </div>

                    {/* Save button — top right */}
                    <Button
                        onClick={handleSave}
                        disabled={saving || saved}
                        className="flex items-center gap-2 hover:bg-[#693565]
              bg-[#3f2039] text-white shrink-0"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : saved ? '✓ Updated' : 'Save Changes'}
                    </Button>
                </div>

                {/* ── Two-column form grid ──────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left — Personal Details */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-slate-700
                flex items-center gap-2">
                                <div className="p-1.5 bg-[#f0e4ef] rounded-lg">
                                    <User className="h-3.5 w-3.5 text-[#693565]" />
                                </div>
                                Personal Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            {/* Name — read only */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-slate-400 text-xs">First Name</Label>
                                    <Input
                                        value={user?.firstName ?? ''}
                                        disabled
                                        className="bg-slate-50 text-slate-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-400 text-xs">Last Name</Label>
                                    <Input
                                        value={user?.lastName ?? ''}
                                        disabled
                                        className="bg-slate-50 text-slate-500"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 -mt-2">
                                Name cannot be changed. Contact admin if needed.
                            </p>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={form.phone}
                                    onChange={(e) => set('phone', e.target.value)}
                                    placeholder="+234 000 000 0000"
                                />
                            </div>

                            {/* Date of birth */}
                            <div className="space-y-1.5">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={form.dateOfBirth}
                                    onChange={(e) => set('dateOfBirth', e.target.value)}
                                />
                            </div>

                            {/* Occupation */}
                            <div className="space-y-1.5">
                                <Label htmlFor="occupation">Occupation</Label>
                                <Input
                                    id="occupation"
                                    value={form.occupation}
                                    onChange={(e) => set('occupation', e.target.value)}
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-1.5">
                                <Label htmlFor="address">Home Address</Label>
                                <Input
                                    id="address"
                                    value={form.address}
                                    onChange={(e) => set('address', e.target.value)}
                                    placeholder="Your home address"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right — Church Information */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-slate-700
                  flex items-center gap-2">
                                    <div className="p-1.5 bg-[#f0e4ef] rounded-lg">
                                        <Church className="h-3.5 w-3.5 text-[#693565]" />
                                    </div>
                                    Church Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">

                                {/* Gender */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="gender">Gender</Label>
                                    <select
                                        id="gender"
                                        value={form.gender}
                                        onChange={(e) => set('gender', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#693565]"
                                    >
                                        {genderOptions.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Marital status */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="maritalStatus">Marital Status</Label>
                                    <select
                                        id="maritalStatus"
                                        value={form.maritalStatus}
                                        onChange={(e) => set('maritalStatus', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200
                      rounded-md text-sm bg-white focus:outline-none
                      focus:ring-2 focus:ring-[#693565]"
                                    >
                                        {maritalOptions.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Family group */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="family">Family Group</Label>
                                    <select
                                        id="family"
                                        value={form.familyId}
                                        onChange={(e) => set('familyId', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200
                      rounded-md text-sm bg-white focus:outline-none
                      focus:ring-2 focus:ring-[#693565]"
                                    >
                                        <option value="">No family group</option>
                                        {families.map((f) => (
                                            <option key={f.id} value={f.id}>
                                                {f.name}
                                            </option>
                                        ))}
                                    </select>
                                    {families.length === 0 && (
                                        <p className="text-xs text-slate-400">
                                            No family groups created yet
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick info card — read only summary */}
                        <Card className="bg-slate-50 border-slate-200">
                            <CardContent className="pt-4 space-y-3">
                                <p className="text-xs font-semibold text-slate-500 uppercase
                  tracking-wider">
                                    Account Summary
                                </p>
                                {[
                                    {
                                        label: 'Email',
                                        value: user?.email ?? '—',
                                    },
                                    {
                                        label: 'Role',
                                        value: user?.role ?? '—',
                                    },
                                    {
                                        label: 'Gender',
                                        value: form.gender
                                            ? form.gender[0] + form.gender.slice(1).toLowerCase()
                                            : 'Not set',
                                    },
                                    {
                                        label: 'Marital Status',
                                        value: form.maritalStatus
                                            ? form.maritalStatus[0] +
                                            form.maritalStatus.slice(1).toLowerCase()
                                            : 'Not set',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between
                      text-sm border-b border-slate-200 pb-2 last:border-0
                      last:pb-0"
                                    >
                                        <span className="text-slate-500">{item.label}</span>
                                        <span className="font-medium text-slate-800">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg">
                        {error}
                    </p>
                )}
            </div>
        </DashboardLayout>
    )
}