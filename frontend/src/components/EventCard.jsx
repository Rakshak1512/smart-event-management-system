import React from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin, Users, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

const CATEGORY_COLORS = {
  Technology: 'from-primary-500 to-primary-700',
  Cultural: 'from-accent-500 to-pink-600',
  Sports: 'from-emerald-500 to-teal-600',
  Workshop: 'from-amber-500 to-orange-600',
  Seminar: 'from-sky-500 to-blue-600',
}

export default function EventCard({ event, index = 0 }) {
  const navigate = useNavigate()
  const seatsLeft = event.max_seats - (event.seats_taken || 0)
  const gradient = CATEGORY_COLORS[event.category] || 'from-primary-500 to-accent-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/events/${event.id}`)}
      className="card overflow-hidden cursor-pointer group"
    >
      <div className={`h-40 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        {event.banner_url ? (
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-6xl font-black">
            {event.category?.[0] || 'E'}
          </div>
        )}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/80 text-xs font-semibold text-slate-800 dark:text-slate-100">
          {event.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-primary-500" />
            {format(new Date(event.event_date), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-primary-500" />
            {event.event_time?.slice(0, 5)}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-primary-500" />
            {event.venue}
          </div>
          <div className="flex items-center gap-2">
            <Users size={15} className="text-primary-500" />
            {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Fully booked'}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
