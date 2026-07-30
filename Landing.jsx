import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Search,
  BellRing,
  BarChart3,
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EventCard from '../components/EventCard'
import StatCard from '../components/StatCard'
import api from '../api/axios'

const features = [
  {
    icon: Search,
    title: 'Smart Discovery',
    desc: 'Search and filter through every campus event by category, date, or department in seconds.',
  },
  {
    icon: CalendarDays,
    title: 'One-Click Registration',
    desc: 'Register or cancel your seat instantly and track everything from a unified calendar.',
  },
  {
    icon: BellRing,
    title: 'Real-Time Notifications',
    desc: 'Get notified the moment you register, when reminders go out, and when attendance is marked.',
  },
  {
    icon: Award,
    title: 'Digital Certificates',
    desc: 'Download verified PDF certificates automatically generated after your attendance is confirmed.',
  },
  {
    icon: BarChart3,
    title: 'Live Analytics',
    desc: 'Faculty get rich dashboards with registration trends and attendance insights.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Role-Based',
    desc: 'JWT-secured accounts with dedicated dashboards for students and faculty organizers.',
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])

  useEffect(() => {
    api
      .get('/api/events', { params: { upcoming_only: true } })
      .then((res) => setEvents(res.data.slice(0, 3)))
      .catch(() => setEvents([]))
  }, [])

  return (
    <div className="bg-white dark:bg-slate-950 overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section
        id="home"
        className="relative pt-40 pb-28 px-6 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-slate-950 dark:via-slate-950 dark:to-primary-950"
      >
        <div className="absolute top-20 -left-20 h-72 w-72 bg-primary-400/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 h-72 w-72 bg-accent-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-primary-700 dark:text-primary-300 mb-6"
          >
            <Sparkles size={14} /> The complete campus event platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            Every college event, <span className="gradient-text">beautifully organized.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            EventSphere lets students discover and register for events in seconds, while faculty
            create, manage, and track attendance and certificates — all from one premium dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button onClick={() => navigate('/register')} className="btn-primary flex items-center gap-2">
              Get Started Free <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/login')} className="btn-secondary">
              Sign In
            </button>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">About the platform</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 mb-6">
            Built for the entire campus community
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            From hackathons and cultural fests to seminars and workshops, EventSphere brings every
            department onto a single, elegant platform. Students explore what's happening on
            campus and register in one tap. Faculty organizers get powerful tools to manage seats,
            attendance, and certificates without spreadsheets.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            No more WhatsApp forwards or paper sign-up sheets — just a clean, modern experience
            that feels as good as the events themselves.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="card p-6 aspect-square flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            <CalendarDays size={32} className="mb-3" />
            <p className="font-bold text-lg">Unified Calendar</p>
          </div>
          <div className="card p-6 aspect-square flex flex-col justify-center items-center text-center mt-8 bg-gradient-to-br from-accent-500 to-pink-600 text-white">
            <Award size={32} className="mb-3" />
            <p className="font-bold text-lg">Instant Certificates</p>
          </div>
          <div className="card p-6 aspect-square flex flex-col justify-center items-center text-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <BarChart3 size={32} className="mb-3" />
            <p className="font-bold text-lg">Live Analytics</p>
          </div>
          <div className="card p-6 aspect-square flex flex-col justify-center items-center text-center mt-8 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <ShieldCheck size={32} className="mb-3" />
            <p className="font-bold text-lg">Secure Access</p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              Everything you need, nothing you don't
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-7"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white mb-5">
                  <f.icon size={22} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={CalendarDays} label="Events Hosted" value={480} suffix="+" gradient="from-primary-500 to-primary-700" />
          <StatCard icon={Award} label="Certificates Issued" value={12500} suffix="+" gradient="from-accent-500 to-pink-600" />
          <StatCard icon={ShieldCheck} label="Active Students" value={9800} suffix="+" gradient="from-emerald-500 to-teal-600" />
          <StatCard icon={BarChart3} label="Departments Onboard" value={24} gradient="from-amber-500 to-orange-600" />
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">What's happening</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">Upcoming Events</h2>
            </div>
            <button onClick={() => navigate('/login')} className="btn-secondary flex items-center gap-2">
              View all <ArrowRight size={16} />
            </button>
          </div>

          {events.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">No upcoming events yet — check back soon!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto card p-12 text-center bg-gradient-to-br from-primary-600 to-accent-600 text-white border-0">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to transform campus events?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Join your college's smartest event platform today — free for students and faculty.
          </p>
          <button onClick={() => navigate('/register')} className="px-8 py-3 rounded-xl bg-white text-primary-700 font-bold shadow-lg hover:-translate-y-0.5 transition-transform">
            Create Your Account
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
