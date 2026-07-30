import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Pencil, Trash2, Users, Plus } from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'

export default function MyEvents() {
  const [events, setEvents] = useState([])
  const navigate = useNavigate()

  const fetchEvents = async () => {
    const res = await api.get('/api/events/faculty/mine')
    setEvents(res.data)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return
    await api.delete(`/api/events/${id}`)
    fetchEvents()
  }

  return (
    <DashboardLayout title="My Events">
      <div className="flex justify-end mb-6">
        <button onClick={() => navigate('/faculty/events/create')} className="btn-primary flex items-center gap-2 !py-2">
          <Plus size={18} /> Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">You haven't created any events yet.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{event.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  {format(new Date(event.event_date), 'MMM d, yyyy')} · {event.event_time?.slice(0, 5)} · {event.venue}
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold">
                  {event.seats_taken}/{event.max_seats} registered
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/faculty/events/${event.id}/registrations`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Users size={16} /> Manage
                </button>
                <button
                  onClick={() => navigate(`/faculty/events/${event.id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 dark:border-red-500/40 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
