import React from 'react'
import { CalendarDays, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-xl text-white mb-4">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
              <CalendarDays size={20} />
            </span>
            EventSphere
          </div>
          <p className="text-sm text-slate-400 max-w-xs">
            The Smart Event Management System helping colleges plan, host, and track every
            campus event effortlessly.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="/#home" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="/#about" className="hover:text-white transition-colors">About</a></li>
            <li><a href="/#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="/#events" className="hover:text-white transition-colors">Upcoming Events</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Roles</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="/login" className="hover:text-white transition-colors">Student Login</a></li>
            <li><a href="/login" className="hover:text-white transition-colors">Faculty Login</a></li>
            <li><a href="/register" className="hover:text-white transition-colors">Create Account</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <p className="text-sm text-slate-400 flex items-center gap-2 mb-4">
            <Mail size={16} /> support@eventsphere.college.edu
          </p>
          <div className="flex gap-3">
            <a href="#" className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors"><Github size={16} /></a>
            <a href="#" className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors"><Twitter size={16} /></a>
            <a href="#" className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors"><Linkedin size={16} /></a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-6 text-sm text-slate-500 text-center">
        © {new Date().getFullYear()} EventSphere - Smart Event Management System. Built for college hackathons and campus life.
      </div>
    </footer>
  )
}
