import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Plus, Edit2, Trash2, Calendar, AlertCircle, Loader, Search } from 'lucide-react'

export default function Appointments(){
  const [turnos, setTurnos] = useState([])
  const [filteredTurnos, setFilteredTurnos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [patients, setPatients] = useState([])
  const [dentists, setDentists] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ patient_id:'', dentist_id:'', date: '' })
  const [conflictWarning, setConflictWarning] = useState('')
  const [isChecking, setIsChecking] = useState(false)

  async function load(){
    try {
      const t = await api.get('/turnos')
      setTurnos(t.data)
      setFilteredTurnos(t.data)
      console.log('Turnos cargados:', t.data)
      
      const p = await api.get('/pacientes')
      setPatients(p.data)
      console.log('Pacientes cargados:', p.data)
      
      const d = await api.get('/odontologos')
      setDentists(d.data)
      console.log('Odontólogos cargados:', d.data)
    } catch(err) {
      console.error('Error loading data:', err)
      alert('Error al cargar datos: ' + err.message)
    }
  }

  useEffect(()=>{ load() }, [])

  useEffect(() => {
    if (!turnos || turnos.length === 0 || searchTerm.trim() === '' || !patients.length || !dentists.length) {
      setFilteredTurnos(turnos)
      return
    }
    
    const term = searchTerm.toLowerCase()
    try {
      const filtered = turnos.filter(t => {
        if (!t) return false
        const patient = patients.find(p => p && p.id === t.patient_id)
        const dentist = dentists.find(d => d && d.id === t.dentist_id)
        
        const patientName = patient ? String(patient.name || '') + ' ' + String(patient.lastName || '') : ''
        const patientDni = patient ? String(patient.cardIdentity || '') : ''
        const dentistName = dentist ? String(dentist.name || '') + ' ' + String(dentist.lastName || '') : ''
        
        return patientName.toLowerCase().includes(term) || 
               patientDni.toLowerCase().includes(term) || 
               dentistName.toLowerCase().includes(term)
      })
      setFilteredTurnos(filtered)
    } catch(err) {
      console.error('Error filtering appointments:', err)
      setFilteredTurnos(turnos)
    }
  }, [searchTerm, turnos, patients, dentists])

  useEffect(() => {
    if (conflictWarning) {
      const timer = setTimeout(() => {
        setConflictWarning('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [conflictWarning])

  function getPatientName(id) {
    const numId = parseInt(id)
    const p = patients.find(pat => parseInt(pat.id) === numId)
    return p ? `${p.name} ${p.lastName}` : `Paciente ${id}`
  }

  function getDentistName(id) {
    const numId = parseInt(id)
    const d = dentists.find(den => parseInt(den.id) === numId)
    return d ? `${d.name} ${d.lastName}` : `Odontólogo ${id}`
  }

  async function submit(e){
    e.preventDefault()
    
    if (!form.dentist_id || !form.date) {
      alert('Por favor seleccione odontólogo y fecha/hora')
      return
    }

    try {
      setIsChecking(true)
      
      if (!editingId) {
        const response = await api.get('/turnos/check-availability', {
          params: {
            dentistId: parseInt(form.dentist_id),
            dateTime: form.date
          }
        })
        
        if (!response.data) {
          setConflictWarning('⚠️ El horario seleccionado NO está disponible. Este odontólogo ya tiene una cita en ese horario (se consideran turnos de 30 minutos).')
          setIsChecking(false)
          return
        }
      }
      
      setConflictWarning('')
      
      const appointmentData = {
        ...form,
        patient_id: parseInt(form.patient_id),
        dentist_id: parseInt(form.dentist_id)
      }
      if(editingId){
        await api.put('/turnos', { ...appointmentData, id: editingId })
        setEditingId(null)
      } else {
        await api.post('/turnos', appointmentData)
      }
      setForm({ patient_id:'', dentist_id:'', date: '' })
      load()
    } catch(err) {
      console.error('Error saving appointment:', err)
      alert('Error al guardar turno: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsChecking(false)
    }
  }

  function edit(appointment) {
    setEditingId(appointment.id)
    setForm({
      patient_id: String(appointment.patient_id),
      dentist_id: String(appointment.dentist_id),
      date: appointment.date
    })
  }

  async function remove(id){
    if(!confirm('¿Eliminar este turno?')) return
    try {
      await api.delete(`/turnos/${id}`)
      load()
    } catch(err) {
      console.error('Error deleting appointment:', err)
      alert('Error al eliminar turno: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">Gestión de Turnos</h1>
        <p className="text-slate-300 text-lg">Agenda y administra las citas dentales</p>
      </div>

      {/* Formulario */}
      <div className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-transparent p-8 rounded-2xl border border-slate-700/50 shadow-xl mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Plus size={28} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">{editingId ? 'Editar' : 'Agendar'} Turno</h2>
        </div>
        
        {conflictWarning && (
          <div className="mb-6 p-4 bg-amber-500/20 border border-amber-500/50 text-amber-200 rounded-lg flex items-start gap-3 animate-pulse">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-amber-400" />
            <span className="font-medium">{conflictWarning}</span>
          </div>
        )}
        
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Paciente</label>
            <select 
              value={form.patient_id} 
              onChange={e=>setForm({...form, patient_id: e.target.value})} 
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
              required
            >
              <option value="">Seleccione un paciente</option>
              {patients.map(p => <option key={p.id} value={String(p.id)}>{p.name} {p.lastName}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Odontólogo</label>
            <select 
              value={form.dentist_id} 
              onChange={e=>setForm({...form, dentist_id: e.target.value})} 
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
              required
            >
              <option value="">Seleccione un odontólogo</option>
              {dentists.map(d => <option key={d.id} value={String(d.id)}>{d.name} {d.lastName}</option>)}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Fecha y Hora</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60 pointer-events-none" />
              <input 
                type="datetime-local" 
                value={form.date} 
                onChange={e=>setForm({...form, date: e.target.value})} 
                min={new Date().toISOString().slice(0, 16)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
                required
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">⏰ Solo puede agendar turnos a partir de la fecha y hora actual</p>
          </div>
          
          <div className="md:col-span-2 flex gap-2 justify-end">
            <button 
              type="submit" 
              disabled={isChecking}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  {editingId ? 'Actualizar' : 'Agendar'}
                </>
              )}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null)
                  setForm({ patient_id:'', dentist_id:'', date: '' })
                  setConflictWarning('')
                }} 
                className="px-6 py-3 bg-slate-600/50 border border-slate-500 text-slate-200 rounded-lg hover:bg-slate-600 transition font-semibold"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Turnos */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Calendar size={28} className="text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Lista de Turnos <span className="text-cyan-400">({filteredTurnos.length})</span></h2>
          </div>
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60" />
            <input 
              type="text"
              placeholder="Buscar por paciente..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
            />
          </div>
        </div>
        
        {filteredTurnos.length === 0 ? (
          <div className="p-12 text-center bg-gradient-to-br from-slate-800/50 to-transparent rounded-2xl border border-slate-700/50">
            <Calendar size={48} className="mx-auto text-slate-500/50 mb-4" />
            <p className="text-slate-400 text-lg">{turnos.length === 0 ? 'No hay turnos agendados aún.' : 'No se encontraron resultados.'}</p>
            <p className="text-slate-500 text-sm mt-2">{turnos.length === 0 ? 'Crea el primer turno usando el formulario arriba' : 'Intenta con otro término de búsqueda'}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTurnos.map((t) => (
              <div key={t.id} className="group relative bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-transparent p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Información del Paciente */}
                  <div className="space-y-2">
                    <p className="text-xs uppercase font-semibold text-cyan-400">Paciente</p>
                    <p className="text-lg font-bold text-white">{getPatientName(t.patient_id)}</p>
                  </div>
                  
                  {/* Información del Odontólogo */}
                  <div className="space-y-2">
                    <p className="text-xs uppercase font-semibold text-purple-400">Odontólogo</p>
                    <p className="text-lg font-bold text-white">{getDentistName(t.dentist_id)}</p>
                  </div>
                  
                  {/* Fecha y Hora */}
                  <div className="space-y-2">
                    <p className="text-xs uppercase font-semibold text-emerald-400">Fecha y Hora</p>
                    <p className="text-lg font-bold text-white flex items-center gap-2">
                      <Calendar size={16} className="text-emerald-400" />
                      {new Date(t.date).toLocaleString('es-AR', { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: undefined, hour12: true })}
                    </p>
                  </div>
                </div>
                
                {/* Botones de Acción */}
                <div className="flex gap-2 mt-6 pt-6 border-t border-slate-700/50">
                  <button 
                    onClick={() => edit(t)} 
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-lg hover:bg-amber-500/30 hover:border-amber-500 transition font-medium"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button 
                    onClick={() => remove(t.id)} 
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 hover:border-red-500 transition font-medium"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
