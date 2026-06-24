'use client'

import { CardHeader, Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from "@/services/api"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            const {data} = await api.post('/auth/register', formData)
            if (data.data.token) {
                localStorage.setItem('token', data.data.token)
            }
            localStorage.setItem('user', JSON.stringify(data.data.user))

            const role = data.data.user.role
            if (role === 'PASTOR') router.push('/pastor/dashboard')
            else if (role === 'ADMIN') router.push('/admin/dashboard')
            else router.push('/member/dashboard')
        } catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-1">
                    <div className="flex flex-col items-center justify-center w-full mb-6">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-slate-700 shrink-0 bg-white flex items-center justify-center">
                            <Image
                                src="https://res.cloudinary.com/dfrfg6hk2/image/upload/q_auto/f_auto/v1781981549/lggmi-logo.jpg"
                                alt="LGGMI Logo"
                                fill
                                className="object-cover scale-105"
                                priority
                            />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome to LGGMI</CardTitle>
                    <CardDescription>Register your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="FirstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Registering' : 'Register'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )

}