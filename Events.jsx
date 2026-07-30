import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import EventCard from '../../components/EventCard'
import api from '../../api/axios'

const CATEGORIES = ['All', 'Technology', 'Cultural', 'Sports', 'Workshop', 'Seminar']

export default function StudentEvents() {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchEvents = async () => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (category !== 'All') params.category = category
    const res = await api.get('/api/events', { params })
    setEvents(res.data)
    setLoading(false)
  }

  useEffect(() => {
    const timeout = setTimeout(fetchEvents, 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category])

  return (
    <DashboardLayout title="Browse Events">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or description..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                category === c
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-md'
                  : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No events match your search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
