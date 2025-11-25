import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Users, Smile, Calendar, RotateCw, TrendingUp } from 'lucide-react'

export default function Dashboard(){
  const [stats, setStats] = useState({ patients: 0, dentists: 0, appointments: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats(){
    try {
      setLoading(true)
      const p = await api.get('/pacientes')
      const d = await api.get('/odontologos')
      const a = await api.get('/turnos')
      
      setStats({
        patients: p.data ? p.data.length : 0,
        dentists: d.data ? d.data.length : 0,
        appointments: a.data ? a.data.length : 0
      })
    } catch(err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">Dashboard Administrativo</h1>
        <p className="text-slate-300 text-lg">Resumen general del sistema</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta Pacientes */}
        <div className="group relative bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-transparent p-8 rounded-2xl border border-blue-500/30 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Pacientes Registrados</h3>
              <p className="text-5xl font-black mt-4 text-cyan-200">{loading ? '--' : stats.patients}</p>
              <p className="text-sm text-slate-400 mt-2">Total en el sistema</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/30">
              <Users size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* Tarjeta Odontólogos */}
        <div className="group relative bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent p-8 rounded-2xl border border-purple-500/30 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-pink-300 uppercase tracking-wider">Odontólogos</h3>
              <p className="text-5xl font-black mt-4 text-pink-200">{loading ? '--' : stats.dentists}</p>
              <p className="text-sm text-slate-400 mt-2">Profesionales registrados</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/30">
              <Smile size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* Tarjeta Turnos */}
        <div className="group relative bg-gradient-to-br from-emerald-600/20 via-emerald-500/10 to-transparent p-8 rounded-2xl border border-emerald-500/30 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Turnos Agendados</h3>
              <p className="text-5xl font-black mt-4 text-emerald-200">{loading ? '--' : stats.appointments}</p>
              <p className="text-sm text-slate-400 mt-2">Citas en total</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/30">
              <Calendar size={32} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Análisis */}
      <div className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-transparent p-8 rounded-2xl border border-slate-700/50 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-cyan-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Análisis Estadístico</h2>
          </div>
          <button 
            onClick={loadStats}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition font-semibold group"
          >
            <RotateCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Actualizar
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Métrica 1 */}
          <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30 hover:border-blue-500/60 transition">
            <p className="text-slate-300 text-sm font-medium mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full" />
              Promedio de turnos por paciente
            </p>
            <p className="text-3xl font-bold text-cyan-300">
              {loading ? '--' : (stats.patients > 0 ? (stats.appointments / stats.patients).toFixed(2) : 0)}
            </p>
          </div>
          
          {/* Métrica 2 */}
          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition">
            <p className="text-slate-300 text-sm font-medium mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-pink-400 rounded-full" />
              Promedio de turnos por odontólogo
            </p>
            <p className="text-3xl font-bold text-pink-300">
              {loading ? '--' : (stats.dentists > 0 ? (stats.appointments / stats.dentists).toFixed(2) : 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
