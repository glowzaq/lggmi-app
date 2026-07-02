'use client'

import Sidebar from './Sidebar'
import Topbar from './Topbar'
import AuthGuard from '../shared/AuthGuard'

interface DashboardLayoutProps {
    children: React.ReactNode
    role: 'PASTOR' | 'ADMIN' | 'MEMBER' | 'WORKER'
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    return (
        <AuthGuard allowedRoles={[role]}>
            <div className="flex h-screen bg-slate-50 overflow-hidden">
                <Sidebar role={role} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}