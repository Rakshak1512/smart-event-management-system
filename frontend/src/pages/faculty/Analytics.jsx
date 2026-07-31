import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { CalendarDays, Users, TrendingUp, Award } from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import api from '../../api/axios'

const COLORS = ['#6366f1', '#d946ef', '#10b981', '#f59e0b', '#0ea5e9', '#ef4444']

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    api.get('/api/analytics').then((res) => setAnalytics(res.data))
  }, [])

  if (!analytics) {
    return (
      <DashboardLayout title="Analytics">
        <p className="text-slate-500 dark:text-slate-400">Loading analytics...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Analytics">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={CalendarDays} label="Total Events" value={analytics.total_events} gradient="from-primary-500 to-primary-700" />
        <StatCard icon={Users} label="Total Registrations" value={analytics.total_registrations} gradient="from-accent-500 to-pink-600" />
        <StatCard icon={TrendingUp} label="Upcoming Events" value={analytics.upcoming_events} gradient="from-emerald-500 to-teal-600" />
        <StatCard icon={Award} label="Attendance Rate" value={analytics.attendance_percentage} suffix="%" gradient="from-amber-500 to-orange-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Registrations by Month</h3>
          {analytics.registrations_by_month.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No registration data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.registrations_by_month}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Events by Category</h3>
          {analytics.events_by_category.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No events created yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.events_by_category}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.category}
                >
                  {analytics.events_by_category.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
