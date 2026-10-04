'use client'

import DashboardLayout from "@/components/layout/DashboardLayout"
import EmptyState from "@/components/shared/EmptyState"
import Spinner from "@/components/shared/Spinner"
import { Input } from "@/components/ui/input"
import api from "@/services/api"
import { Search, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

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
    PASTOR: 'bg-[#9B7E93] text-[#2a1626]',
    ADMIN: 'bg-[#d6b68d] text-[#473723]',
    MEMBER: 'bg-[#a8b8a6] text-[#2d332d]',
    WORKER: 'bg-[#d4afa0] text-[#4a261a]'
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [genderFilter, setGenderFilter] = useState<string>('ALL')
    const [activeMenu, setActiveMenu] = useState<string | null>(null)

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        const { data } = await api.get('/users')
        setMembers(data.data)
        setLoading(false)
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
        <DashboardLayout role="WORKER">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Members</h1>
                        <p className="text-slate-500">
                            {members.length} total members registered
                        </p>
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
                                            <th className="hidden md:table-cell text-left px-4 py-3 font-medium text-slate-600">
                                                Gender
                                            </th>
                                            <th className="hidden md:table-cell text-left px-4 py-3 font-medium text-slate-600">
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
                                                            ? 'bg-[#e1d5de] text-[#3f2039]'
                                                            : 'bg-[#E8D5D0] text-[#855246]'
                                                            }`}>
                                                            {member.gender[0] + member.gender.slice(1).toLowerCase()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">—</span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 hidden md:table-cell">
                                                    <span className={`text-xs px-2 py-1 rounded-full font-small ${roleColors[member.role]}`}>
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
                                                            ? 'bg-purple-100 text-purple-900'
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
                                                    </button>

                                                    {activeMenu === member.id && (
                                                        <div className="absolute right-8 top-8 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[140px] overflow-hidden">
                                                            {member.isActive}
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
        </DashboardLayout>
    )
}