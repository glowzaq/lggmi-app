import Link from 'next/link'
import { Church, Users, Calendar, BookOpen, Heart, Shield } from 'lucide-react'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm
        border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center
          justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-700 shrink-0 bg-white flex items-center justify-center">
              <Image
                src="https://res.cloudinary.com/dfrfg6hk2/image/upload/q_auto/f_auto/v1781981549/lggmi-logo.jpg"
                alt="LGGMI Logo"
                fill
                sizes="64px"
                className="object-cover scale-105"
                priority
              />
            </div>
            <span className="font-bold text-slate-800 text-lg">
              Latter Glory House
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600
                hover:text-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-[#693565] text-white
                px-4 py-2 rounded-lg hover:bg-[#7d4178] transition-colors"
            >
              Join Us
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center bg-gradient-to-b
        from-slate-50 to-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-50
            border border-purple-200 rounded-full px-4 py-1.5">
            <span className="text-xs text-purple-700 font-medium">
              Welcome to our community
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900
            leading-tight">
            Growing Together in{' '}
            <span className="text-[#693565]">Faith and Love</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            A place where every soul matters. Join our church family
            and experience the love of God through community,
            worship and discipleship.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/register"
              className="bg-[#693565] text-white px-8 py-3 rounded-xl
                font-semibold hover:bg-[#7d4178] transition-colors
                text-center"
            >
              Join Our Church Family
            </Link>
            <Link
              href="/login"
              className="border border-slate-200 text-slate-700 px-8 py-3
                rounded-xl font-semibold hover:bg-slate-50 transition-colors
                text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">About Us</h2>
          <p className="text-slate-500 leading-relaxed max-w-2xl mx-auto">
            We are a vibrant, spirit-filled church committed to winning
            souls, making disciples and changing lives through the power
            of the Gospel. Our doors are open to everyone.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            Everything Your Church Needs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Member Management',
                description:
                  'Keep track of your congregation, family groups and member growth.',
              },
              {
                icon: Calendar,
                title: 'Events & Services',
                description:
                  'Manage Sunday services, Bible studies, prayer meetings and special programs.',
              },
              {
                icon: BookOpen,
                title: 'Sermon Archive',
                description:
                  'Store and share sermon recordings and notes with the congregation.',
              },
              {
                icon: Heart,
                title: 'Prayer & Welfare',
                description:
                  'Submit prayer requests and track church welfare and support given.',
              },
              {
                icon: Shield,
                title: 'Role-Based Access',
                description:
                  'Pastor, Admin, Worker and Member roles each with appropriate access.',
              },
              {
                icon: Church,
                title: 'Spiritual Growth',
                description:
                  'Members track daily prayer and Bible study to build spiritual habits.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-sm
                  hover:shadow-md transition-shadow space-y-3"
              >
                <div className="p-2.5 bg-purple-50 rounded-lg w-fit">
                  <feature.icon className="h-5 w-5 text-[#693565]" />
                </div>
                <h3 className="font-semibold text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <h2 className="text-3xl font-bold text-slate-800">Service Times</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { day: 'Sunday', service: 'Sunday Service', time: '8:30 AM' },
              { day: 'Tuesday', service: 'Bible Study', time: '4:30 PM' },
              { day: 'Friday', service: 'Vigil', time: '9:00 PM' },
            ].map((s) => (
              <div
                key={s.day}
                className="p-6 border border-slate-200 rounded-xl
                  hover:border-[#693565] transition-colors"
              >
                <p className="text-[#693565] font-semibold text-sm">
                  {s.day}
                </p>
                <p className="text-slate-800 font-bold mt-1">{s.service}</p>
                <p className="text-slate-500 text-sm mt-1">{s.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">Find Us</h2>
          <p className="text-slate-500">
            📍 Nexus Compound, Ayegbami, Ilaro, Ogun State
          </p>
          <p className="text-slate-500">
            📞 +234 000 000 0000
          </p>
          <p className="text-slate-500">
            ✉️ info@churchname.com
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#693565] text-white text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to Join Us?</h2>
          <p className="text-purple-200">
            Create your account today and become part of our growing
            church family.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-[#693565] px-8 py-3
              rounded-xl font-semibold hover:bg-purple-50 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} Church Name. All rights reserved.
        </p>
      </footer>
    </div>
  )
}