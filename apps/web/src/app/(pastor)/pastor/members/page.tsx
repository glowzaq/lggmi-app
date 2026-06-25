'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Spinner from '@/components/shared/Spinner'
import EmptyState from '@/components/shared/EmptyState'
import { Users, Search } from 'lucide-react'
import api from '@/services/api'

interface Member {
    id: string
    firstName: string
    lastName: string
    phone: string | null
    gender: string | null
    maritalStatus: string | null
    occupation: string | null
    joinedAt: string
    user: { email: string; role: string }
}

export default function PastorMembersPage() {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        api.get('/members').then(({ data }) => {
            setMembers(data.data)
            setLoading(false)
        })
    }, [])

    const filtered = members.filter((m) =>
        `${m.firstName} ${m.lastName} ${m.user.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    return (
        <DashboardLayout role="PASTOR">
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Congregation</h1>
                    <p className="text-slate-500">
                        {members.length} registered members
                    </p>
                </div>

                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2
            h-4 w-4 text-slate-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search members..."
                        className="pl-9"
                    />
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner text="Loading congregation..." />
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No members found"
                        description={
                            search ? `No results for "${search}"` : 'No members yet'
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((member) => (
                            <Card
                                key={member.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[#683565] flex items-center justify-center text-white font-semibold shrink-0">
                                            {member.firstName[0]}{member.lastName[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-800 truncate">
                                                {member.firstName} {member.lastName}
                                            </p>
                                            <p className="text-xs text-slate-400 truncate">
                                                {member.user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-sm">
                                        {member.phone && (
                                            <p className="text-slate-500">📞 {member.phone}</p>
                                        )}
                                        {member.occupation && (
                                            <p className="text-slate-500">💼 {member.occupation}</p>
                                        )}
                                        {member.maritalStatus && (
                                            <p className="text-slate-500 capitalize">
                                                💍 {member.maritalStatus.toLowerCase()}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-1 border-t">
                                        {member.gender && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full
                        font-medium ${member.gender === 'MALE'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-pink-100 text-pink-700'
                                                }`}>
                                                {member.gender[0] + member.gender.slice(1).toLowerCase()}
                                            </span>
                                        )}
                                        <p className="text-xs text-slate-400">
                                            Joined{' '}
                                            {new Date(member.joinedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}