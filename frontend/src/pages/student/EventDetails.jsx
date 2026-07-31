import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    const eventRes = await api.get(`/api/events/${id}`)
    setEvent(eventRes.data)
    if (user?.role === 'student') {
      const regsRes = await api.get('/api/registrations/me')
      setRegistrations(regsRes.data)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const myRegistration = registrations.find(
    (r) => r.event_id === Number(id) && r.status === 'registered'
  )

  const handleRegister = async () => {
    setLoading(true)
    setMessage(null)
    try {
      await api.post(`/api/registrations/${id}`)
      setMessage({ type: 'success', text: 'Successfully registered for this event!' })
      fetchData()
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.detail || 'Registration failed.' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    setLoading(true)
    setMessage(null)
    try {
      await api.delete(`/api/registrations/${id}`)
      setMessage({ type: 'success', text: 'Registration cancelled.' })
      fetchData()
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.detail || 'Cancellation failed.' })
    } finally {
      setLoading(false)
    }
  }

  if (!event) {
    return (
      <DashboardLayout title="Event Details">
        <p className="text-slate-500 dark:text-slate-400">Loading event...</p>
      </DashboardLayout>
    )
  }

  const seatsLeft = event.max_seats - event.seats_taken
  const deadlinePassed = new Date(event.registration_deadline) < new Date()

  return (
    <DashboardLayout title="Event Details">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-primary-500 to-accent-600 relative">
          {event.banner_url && (
            <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover" />
          )}
          <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/80 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {event.category}
          </span>
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">{event.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">{event.description}</p>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <CalendarDays className="text-primary-500" />
              {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <Clock className="text-primary-500" />
              {event.event_time?.slice(0, 5)}
            </div>
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <MapPin className="text-primary-500" />
              {event.venue}
            </div>
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <Users className="text-primary-500" />
              {seatsLeft} of {event.max_seats} seats available
            </div>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Registration closes on{' '}
            {format(new Date(event.registration_deadline), "MMMM d, yyyy 'at' h:mm a")}
            {event.organizer_name && <> · Organized by {event.organizer_name}</>}
          </div>

          {message && (
            <div
              className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}

          {user?.role === 'student' && (
            <>
              {myRegistration ? (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-300 dark:border-red-500/40 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-60"
                >
                  <XCircle size={18} /> Cancel Registration
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={loading || seatsLeft <= 0 || deadlinePassed}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deadlinePassed
                    ? 'Registration Closed'
                    : seatsLeft <= 0
                    ? 'Fully Booked'
                    : loading
                    ? 'Registering...'
                    : 'Register for this Event'}
                </button>
              )}
            </>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
