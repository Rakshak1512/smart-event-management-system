import React, { useEffect, useState } from 'react'
import { CalendarDays, Users, TrendingUp, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function FacultyDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    api.get('/api/events/faculty/mine').then((res) => setEvents(res.data))
    api.get('/api/analytics').then((res) => setAnalytics(res.data))
  }, [])

  return (
    <DashboardLayout title={`Welcome, ${user?.name?.split(' ')[0]}!`}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={CalendarDays} label="Total Events" value={analytics?.total_events || 0} gradient="from-primary-500 to-primary-700" />
        <StatCard icon={Users} label="Total Registrations" value={analytics?.total_registrations || 0} gradient="from-accent-500 to-pink-600" />
        <StatCard icon={TrendingUp} label="Upcoming Events" value={analytics?.upcoming_events || 0} gradient="from-emerald-500 to-teal-600" />
        <StatCard icon={Award} label="Attendance Rate" value={analytics?.attendance_percentage || 0} suffix="%" gradient="from-amber-500 to-orange-600" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Events</h2>
        <button onClick={() => navigate('/faculty/events/create')} className="btn-primary !py-2">
          + Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">
          You haven't created any events yet. Click "Create Event" to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {events.slice(0, 6).map((event) => (
            <div
              key={event.id}
              onClick={() => navigate(`/faculty/events/${event.id}/registrations`)}
              className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
            >
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{event.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {format(new Date(event.event_date), 'MMM d, yyyy')} · {event.venue}
                </p>
              </div>
              <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {event.seats_taken}/{event.max_seats} registered
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
