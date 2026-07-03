'use client'

import { Bell, BookOpen, Calendar, CheckSquare, ChevronLeft, ChevronRight, DollarSign, Flame, Heart, LayoutDashboard, LogOut, Users } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

interface NavItem {
    label: string
    href: string
    icon: React.ElementType
}

interface SidebarProps {
    role: 'PASTOR' | 'ADMIN' | 'MEMBER' | 'WORKER'
}

const navItems: Record<string, NavItem[]> = {
    ADMIN: [
        {label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard},
        {label: 'Users', href: '/admin/members', icon: Users},
        {label: 'Events', href: '/admin/events', icon: Calendar},
        {label: 'Attendance', href: '/admin/attendance', icon: CheckSquare},
        {label: 'Sermons', href: '/admin/sermons', icon: BookOpen},
        {label: 'Donations', href: '/admin/donations', icon: DollarSign},
        {label: 'Announcements', href: '/admin/announcements', icon: Bell},
        {label: 'Prayer Requests', href: '/admin/prayer-requests', icon: Heart},
        {label: 'Spiritual Growth', href: '/admin/spiritual-growth', icon: Flame},
    ],
    PASTOR: [
        {label: 'Dashboard', href: '/pastor/dashboard', icon: LayoutDashboard},
        {label: 'Users', href: '/pastor/members', icon: Users},
        {label: 'Attendance', href: '/pastor/attendance', icon: CheckSquare},
        {label: 'Donations', href: '/pastor/donations', icon: DollarSign},
        {label: 'Prayer Requests', href: '/pastor/prayer-requests', icon: Heart},
        {label: 'Announcements', href: '/pastor/announcements', icon: Bell},
        {label: 'Sermons', href: '/pastor/sermons', icon: BookOpen},
        {label: 'Events', href: '/pastor/events', icon: Calendar},
        {label: 'Spiritual Growth', href: '/pastor/spiritual-growth', icon: Flame},
    ],
    MEMBER: [
        {label: 'Dashboard', href: '/member/dashboard', icon: LayoutDashboard},
        {label: 'My Profile', href: '/member/me', icon: Users},
        {label: 'Events', href: '/member/events', icon: Calendar},
        {label: 'Sermons', href: '/member/sermons', icon: BookOpen},
        {label: 'Announcements', href: '/member/announcements', icon: Bell},
        {label: 'My Giving', href: '/member/giving', icon: DollarSign},
        {label: 'Prayer Requests', href: '/member/prayer-requests', icon: Heart},
        {label: 'Spiritual Growth', href: '/member/spiritual-growth', icon: Flame}
    ],
    WORKER: [
        { label: 'Dashboard', href: '/worker/dashboard', icon: LayoutDashboard },
        { label: 'Members', href: '/worker/members', icon: Users },
        { label: 'Events', href: '/worker/events', icon: Calendar },
        { label: 'Attendance', href: '/worker/attendance', icon: CheckSquare },
        { label: 'Sermons', href: '/worker/sermons', icon: BookOpen },
        { label: 'Donations', href: '/worker/donations', icon: DollarSign },
        { label: 'Announcements', href: '/worker/announcements', icon: Bell },
        { label: 'Prayer Requests', href: '/worker/prayer-requests', icon: Heart },
    ],
}

export default function Sidebar({role}: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [collapsed, setCollapsed] = useState(false)

    const items = navItems[role] || []

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace('/login')
    }

    return (
        <aside
            className={`
        relative flex flex-col h-screen bg-[#1a1118] text-white
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
    `}
        >
            <div className="flex items-center gap-3 px-4 py-5">
                {/* Logo Container */}
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-700 shrink-0 bg-white flex items-center justify-center">
                    <Image
                        src="https://res.cloudinary.com/dfrfg6hk2/image/upload/q_auto/f_auto/v1781981549/lggmi-logo.jpg"
                        alt="LGGMI Logo"
                        fill
                        sizes="64px"
                        className="object-cover scale-105"
                        priority
                    />
                </div>

                {!collapsed && (
                    <div>
                        <p className="font-bold text-sm leading-tight tracking-wide text-white">LGGMI</p>
                        <p className="text-xs text-slate-400 capitalize">
                            {role.toLowerCase()} portal
                        </p>
                    </div>
                )}
            </div>

            {/* Nav items */}
            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-none
                ${isActive
                                ? 'bg-[#693465] text-white border-l-4 border-[#693465]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                }
            `}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </button>
                    )
                })}
            </nav>

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 bg-[#1a1118] border border-slate-700 rounded-full p-1 text-slate-400 hover:text-white"
            >
                {collapsed
                    ? <ChevronRight className="h-3 w-3" />
                    : <ChevronLeft className="h-3 w-3" />
                }
            </button>

            <div className="border-t border-slate-800 p-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-l text-white
            hover:text-red-400 transition-colors"
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    )

}