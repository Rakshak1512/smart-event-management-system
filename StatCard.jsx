import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, suffix = '', gradient }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const target = Number(value) || 0
    const duration = 1000
    const steps = 30
    const increment = target / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step += 1
      current += increment
      if (step >= steps) {
        setDisplay(target)
        clearInterval(timer)
      } else {
        setDisplay(Math.round(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-6 flex items-center gap-4"
    >
      <div
        className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br ${
          gradient || 'from-primary-500 to-accent-600'
        }`}
      >
        {Icon && <Icon size={26} />}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {display}
          {suffix}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </motion.div>
  )
}
