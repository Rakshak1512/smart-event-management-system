import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

import StudentDashboard from './pages/student/Dashboard'
import StudentEvents from './pages/student/Events'
import EventDetails from './pages/student/EventDetails'
import MyRegistrations from './pages/student/MyRegistrations'
import StudentCalendar from './pages/student/Calendar'
import StudentCertificates from './pages/student/Certificates'

import FacultyDashboard from './pages/faculty/Dashboard'
import EventForm from './pages/faculty/EventForm'
import MyEvents from './pages/faculty/MyEvents'
import ManageEvent from './pages/faculty/ManageEvent'
import Analytics from './pages/faculty/Analytics'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Shared event details route - works for both roles */}
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventDetails />
          </ProtectedRoute>
        }
      />

      {/* Student */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/events"
        element={
          <ProtectedRoute role="student">
            <StudentEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/registrations"
        element={
          <ProtectedRoute role="student">
            <MyRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/calendar"
        element={
          <ProtectedRoute role="student">
            <StudentCalendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/certificates"
        element={
          <ProtectedRoute role="student">
            <StudentCertificates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/notifications"
        element={
          <ProtectedRoute role="student">
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute role="student">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Faculty */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute role="faculty">
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/events"
        element={
          <ProtectedRoute role="faculty">
            <MyEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/events/create"
        element={
          <ProtectedRoute role="faculty">
            <EventForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/events/:id/edit"
        element={
          <ProtectedRoute role="faculty">
            <EventForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/events/:id/registrations"
        element={
          <ProtectedRoute role="faculty">
            <ManageEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/analytics"
        element={
          <ProtectedRoute role="faculty">
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/notifications"
        element={
          <ProtectedRoute role="faculty">
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/profile"
        element={
          <ProtectedRoute role="faculty">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}
