import React, { useEffect, useState } from 'react'
import { CalendarDays, ClipboardList, Award, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import EventCard from '../../components/EventCard'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [certificates, setCertificates] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    api.get('/api/events', { params: { upcoming_only: true } }).then((res) => setEvents(res.data))
    api.get('/api/registrations/me').then((res) => setRegistrations(res.data))
    api.get('/api/certificates/me').then((res) => setCertificates(res.data))
    api.get('/api/notifications').then((res) => setNotifications(res.data))
  }, [])

  const activeRegs = registrations.filter((r) => r.status === 'registered')

  return (
    <DashboardLayout title={`Welcome, ${user?.name?.split(' ')[0]}!`}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={CalendarDays} label="Upcoming Events" value={events.length} gradient="from-primary-500 to-primary-700" />
        <StatCard icon={ClipboardList} label="My Registrations" value={activeRegs.length} gradient="from-accent-500 to-pink-600" />
        <StatCard icon={Award} label="Certificates Earned" value={certificates.length} gradient="from-emerald-500 to-teal-600" />
        <StatCard icon={Bell} label="Notifications" value={notifications.filter((n) => !n.is_read).length} gradient="from-amber-500 to-orange-600" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended for you</h2>
        <button onClick={() => navigate('/student/events')} className="text-sm font-semibold text-primary-600 dark:text-primary-400">
          Browse all events →
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No upcoming events right now. Check back soon!</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 6).map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
