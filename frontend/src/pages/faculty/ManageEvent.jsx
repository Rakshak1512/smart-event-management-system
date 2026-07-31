import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Award, Save, AlertCircle } from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'

export default function ManageEvent() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [students, setStudents] = useState([])
  const [attendanceMap, setAttendanceMap] = useState({})
  const [message, setMessage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  const fetchData = async () => {
    const eventRes = await api.get(`/api/events/${id}`)
    setEvent(eventRes.data)
    const studentsRes = await api.get(`/api/registrations/event/${id}`)
    setStudents(studentsRes.data)
    const map = {}
    studentsRes.data.forEach((s) => {
      map[s.student_id] = s.is_present
    })
    setAttendanceMap(map)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const toggleAttendance = (studentId) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: !prev[studentId] }))
  }

  const saveAttendance = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const records = students.map((s) => ({
        student_id: s.student_id,
        is_present: !!attendanceMap[s.student_id],
      }))
      await api.post('/api/attendance/mark', { event_id: Number(id), records })
      setMessage({ type: 'success', text: 'Attendance saved successfully!' })
      fetchData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save attendance.' })
    } finally {
      setSaving(false)
    }
  }

  const generateCertificates = async () => {
    setGenerating(true)
    setMessage(null)
    try {
      const res = await api.post(`/api/certificates/generate/${id}`)
      setMessage({
        type: 'success',
        text: `Generated ${res.data.length} certificate(s) for present students.`,
      })
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.detail || 'Certificate generation failed.' })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <DashboardLayout title="Manage Event">
      {event && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{event.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {event.seats_taken}/{event.max_seats} registered · {event.venue}
          </p>
        </div>
      )}

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

      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={saveAttendance} disabled={saving} className="btn-primary flex items-center gap-2 !py-2.5 disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Attendance'}
        </button>
        <button
          onClick={generateCertificates}
          disabled={generating}
          className="btn-secondary flex items-center gap-2 !py-2.5 disabled:opacity-60"
        >
          <Award size={16} /> {generating ? 'Generating...' : 'Generate Certificates'}
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No students registered yet.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.registration_id} className="border-b border-slate-100 dark:border-slate-800/60">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{s.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{s.email}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{s.department || '—'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        s.status === 'registered'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAttendance(s.student_id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        attendanceMap[s.student_id]
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {attendanceMap[s.student_id] ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {attendanceMap[s.student_id] ? 'Present' : 'Absent'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
