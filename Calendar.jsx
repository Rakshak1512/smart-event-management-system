import React, { useEffect, useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'

export default function StudentCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [registrations, setRegistrations] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/registrations/me').then((res) =>
      setRegistrations(res.data.filter((r) => r.status === 'registered'))
    )
  }, [])

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const eventsOnDay = (day) =>
    registrations.filter((r) => r.event && isSameDay(new Date(r.event.event_date), day))

  return (
    <DashboardLayout title="Calendar View">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayEvents = eventsOnDay(day)
            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 p-2 rounded-xl border text-xs ${
                  isSameMonth(day, currentMonth)
                    ? 'border-slate-200 dark:border-slate-800'
                    : 'border-transparent opacity-40'
                } ${isSameDay(day, new Date()) ? 'ring-2 ring-primary-500' : ''}`}
              >
                <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">{format(day, 'd')}</p>
                {dayEvents.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/events/${r.event_id}`)}
                    className="mb-1 px-2 py-1 rounded-md bg-gradient-to-r from-primary-500 to-accent-500 text-white truncate cursor-pointer"
                  >
                    {r.event?.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
