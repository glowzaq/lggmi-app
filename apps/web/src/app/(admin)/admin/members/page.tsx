'use client'

import DashboardLayout from "@/components/layout/DashboardLayout"
import EmptyState from "@/components/shared/EmptyState"
import Spinner from "@/components/shared/Spinner"
import { Input } from "@/components/ui/input"
import api from "@/services/api"
import { KeyRound, MoreVertical, Search, Users, UserX } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import WorkerModal from "@/components/admin/WorkerModal"
import Modal from "@/components/shared/Modal"
import { Label } from "@/components/ui/label"

interface Member {
    id: string
    firstName: string
    lastName: string
    maritalStatus: string | null
    email: string
    role: string
    gender: string | null
    phone: string | null
    occupation: string | null
    isActive: boolean
    joinedAt: string
}

const roleColors: Record<string, string> = {
    PASTOR: 'bg-[#693465]/10 text-[#693465]',
    ADMIN: 'bg-rose-50 text-rose-700',
    MEMBER: 'bg-slate-100 text-slate-600',
    WORKER: 'bg-green-50 text-green-700'
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([])
    const [workerModalOpen, setWorkerModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [genderFilter, setGenderFilter] = useState<string>('ALL')
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [resetModalOpen, setResetModalOpen] = useState(false)
    const [resetMember, setResetMember] = useState<Member | null>(null)
    const [newPassword, setNewPassword] = useState('')
    const [resetError, setResetError] = useState('')
    const [resetting, setResetting] = useState(false)
    const [resetSuccess, setResetSuccess] = useState('')

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        const { data } = await api.get('/users')
        setMembers(data.data)
        setLoading(false)
    }

    const handleDeactivate = async (id: string) => {
        await api.delete(`/users/${id}`)
        setMembers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, isActive: false } : m))
        )
        setActiveMenu(null)
    }

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            setResetError('Password must be at least 6 characters')
            return
        }

        setResetting(true)
        setResetError('')

        try {
            await api.post('/auth/reset-password', {
                userId: resetMember?.id,
                newPassword,
            })
            setResetSuccess(`Password reset for ${resetMember?.firstName}`)
            setResetModalOpen(false)
            setNewPassword('')
            setResetMember(null)
        } catch (err: any) {
            setResetError(err.response?.data?.message || 'Failed to reset password')
        } finally {
            setResetting(false)
        }
    }

    const filtered = useMemo(() => {
        return members.filter((m) => {
            const matchesSearch =
                `${m.firstName} ${m.lastName} ${m.email}`
                    .toLowerCase()
                    .includes(search.toLowerCase())

            const matchesGender =
                genderFilter === 'ALL' || m.gender === genderFilter

            return matchesSearch && matchesGender
        })
    }, [members, search, genderFilter])

    return (
        <DashboardLayout role="ADMIN">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Members</h1>
                        <p className="text-slate-500">
                            {members.length} total members registered
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setWorkerModalOpen(true)}
                            className="flex items-center gap-2 bg-[#3f2039] hover:bg-[#693565]"
                        >
                            <Plus className="h-4 w-4" />
                            Add User
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="pl-9"
                        />
                    </div>

                    <div className="flex gap-2">
                        {['ALL', 'MALE', 'FEMALE'].map((g) => (
                            <button
                                key={g}
                                onClick={() => setGenderFilter(g)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border
                                    ${genderFilter === g
                                        ? 'bg-[#693565] text-white border-slate-900'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {g === 'ALL' ? 'All' : g[0] + g.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading members..." />
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No members found"
                        description={
                            search
                                ? `No results for "${search}"`
                                : 'No members have been registered yet'
                        }
                    />
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-slate-50">
                                            <th className="text-left px-4 py-3 font-medium text-slate-600">
                                                Member
                                            </th>
                                            <th className="text-left px-4 py-3 font-medium text-slate-600">
                                                Contact
                                            </th>
                                                    <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                                                Gender
                                            </th>
                                                    <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                                                Role
                                            </th>
                                                    <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                                                Joined
                                            </th>
                                                    <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                                                Status
                                            </th>
                                            <th className="px-4 py-3" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((member: Member) => (
                                            <tr
                                                key={member.id}
                                                className="border-b last:border-0 hover:bg-slate-50"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {member.firstName} {member.lastName}
                                                            </p>
                                                            {member.occupation && (
                                                                <p className="text-xs text-slate-400 hidden md:table-cell">
                                                                    {member.occupation}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <p className="text-slate-600 hidden md:table-cell">{member.email}</p>
                                                    {member.phone && (
                                                        <p className="text-xs text-slate-400">
                                                            {member.phone}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 hidden md:table-cell">
                                                    {member.gender ? (
                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${member.gender === 'MALE'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-pink-100 text-pink-700'
                                                            }`}>
                                                            {member.gender[0] + member.gender.slice(1).toLowerCase()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">—</span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 hidden md:table-cell">
                                                    <span className={`text-xs px-2 py-1 rounded-full
                            font-medium ${roleColors[member.role]}`}>
                                                        {member.role}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                                                    {new Date(member.joinedAt).toLocaleDateString(
                                                        'en-US',
                                                        { month: 'short', day: 'numeric', year: 'numeric' }
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 hidden md:table-cell">
                                                    <span className={`text-xs px-2 py-1 rounded-full
                            font-medium ${member.isActive
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {member.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 relative">
                                                    <button
                                                        onClick={() =>
                                                            setActiveMenu(
                                                                activeMenu === member.id ? null : member.id
                                                            )
                                                        }
                                                        className="p-1 hover:bg-slate-100 rounded"
                                                    >
                                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                                    </button>

                                                    {activeMenu === member.id && (
                                                        <div className="absolute right-8 top-8 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[140px] overflow-hidden">
                                                            {member.isActive && (
                                                                <button
                                                                    onClick={() => {
                                                                        setResetMember(member)
                                                                        setResetModalOpen(true)
                                                                    }}
                                                                    className="w-full flex items-center gap-2 px-3 py-2
                                                                        text-xs text-orange-600 hover:bg-orange-50"
                                                                >
                                                                    <KeyRound className="h-3 w-3" />
                                                                    Reset Password
                                                                </button>
                                                            )}
                                                            {member.isActive && (
                                                                <button
                                                                    onClick={() => handleDeactivate(member.id)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                                                                >
                                                                    <UserX className="h-3 w-3" />
                                                                    Deactivate
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-4 py-3 border-t bg-slate-50 text-xs text-slate-500">
                                Showing {filtered.length} of {members.length} members
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <WorkerModal
                isOpen={workerModalOpen}
                onClose={() => setWorkerModalOpen(false)}
                onSuccess={fetchMembers}
            />

            <Modal
                isOpen={resetModalOpen}
                onClose={() => {
                    setResetModalOpen(false)
                    setNewPassword('')
                    setResetError('')
                }}
                title="Reset Password"
                size="sm"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-orange-50
      rounded-lg border border-orange-200">
                        <KeyRound className="h-4 w-4 text-orange-600 shrink-0" />
                        <p className="text-sm text-orange-800">
                            Resetting password for{' '}
                            <span className="font-semibold">
                                {resetMember?.firstName} {resetMember?.lastName}
                            </span>
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <Label>New Password</Label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                        />
                    </div>

                    {resetError && (
                        <p className="text-sm text-red-500">{resetError}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setResetModalOpen(false)
                                setNewPassword('')
                                setResetError('')
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleResetPassword}
                            disabled={resetting}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            {resetting ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}