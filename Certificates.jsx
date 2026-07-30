import React, { useEffect, useState } from 'react'
import { Award, Download } from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    api.get('/api/certificates/me').then((res) => setCertificates(res.data))
  }, [])

  const handleDownload = async (cert) => {
    const res = await api.get(`/api/certificates/download/${cert.id}`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${cert.certificate_code}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <DashboardLayout title="My Certificates">
      {certificates.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">
          No certificates yet. They'll appear here once faculty mark your attendance and generate
          certificates for an event.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="card p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white mb-4">
                <Award size={28} />
              </div>
              <p className="font-bold text-slate-900 dark:text-white mb-1">Certificate of Participation</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{cert.certificate_code}</p>
              <button
                onClick={() => handleDownload(cert)}
                className="btn-primary !py-2 !px-5 flex items-center gap-2 text-sm"
              >
                <Download size={16} /> Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
