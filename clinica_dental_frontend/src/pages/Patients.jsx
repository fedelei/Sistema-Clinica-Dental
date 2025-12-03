import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Plus, Edit2, Trash2, User, Mail, IdCard, MapPin, Calendar, AlertCircle, Search } from 'lucide-react'

export default function Patients(){
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ 
    name: '', lastName: '', email: '', cardIdentity: '', 
    address: { street: '', number: '', location: '', province: '' }
  })
   
  const [duplicateError, setDuplicateError] = useState('')

  async function load(){
    try {
      const res = await api.get('/pacientes')
      setPatients(res.data)
      setFilteredPatients(res.data)
    } catch(err) {
      console.error('Error loading patients:', err)
    }
  }

  useEffect(()=>{ load() }, [])

  useEffect(() => {
    if (!patients || patients.length === 0 || searchTerm.trim() === '') {
      setFilteredPatients(patients)
      return
    }
    
    const term = searchTerm.toLowerCase()
    try {
      const filtered = patients.filter(p => {
        if (!p) return false
        const name = String(p.name || '').toLowerCase()
        const lastName = String(p.lastName || '').toLowerCase()
        const cardIdentity = String(p.cardIdentity || '').toLowerCase()
        const email = String(p.email || '').toLowerCase()
        
        return (name + ' ' + lastName).includes(term) || 
               cardIdentity.includes(term) || 
               email.includes(term)
      })
      setFilteredPatients(filtered)
    } catch(err) {
      console.error('Error filtering patients:', err)
      setFilteredPatients(patients)
    }
  }, [searchTerm, patients])

  useEffect(() => {
    if (duplicateError) {
      const timer = setTimeout(() => {
        setDuplicateError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [duplicateError])

  async function submit(e){
    e.preventDefault()
    setDuplicateError('')
    try {
      if(editingId){
        await api.put('/pacientes', { ...form, id: editingId })
        setEditingId(null)
      } else {
        await api.post('/pacientes', form)
      }
      setForm({ name:'', lastName:'', email:'', cardIdentity: '', address: { street: '', number: '', location: '', province: '' } })
      load()
    } catch(err) {
      console.error('Error saving patient:', err)
      if (err.response?.status === 400 && err.response?.data?.includes('Ya existe')) {
        setDuplicateError(err.response.data)
      } else {
        alert('Error al guardar paciente: ' + (err.response?.data || err.message))
      }
    }
  }

  function edit(patient) {
    setEditingId(patient.id)
    setForm({
      name: patient.name,
      lastName: patient.lastName,
      email: patient.email,
      cardIdentity: patient.cardIdentity,
      address: patient.address || { street: '', number: '', location: '', province: '' }
    })
  }

  async function remove(id){
    if(!confirm('¿Eliminar este paciente?')) return
    try {
      await api.delete(`/pacientes/${id}`)
      load()
    } catch(err) {
      console.error('Error deleting patient:', err)
    }
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">Gestión de Pacientes</h1>
        <p className="text-slate-300 text-lg">Administra los pacientes registrados en el sistema</p>
      </div>
      
      {/* Formulario */}
      <div className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-transparent p-8 rounded-2xl border border-slate-700/50 shadow-xl mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Plus size={28} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">{editingId ? 'Editar' : 'Registrar'} Paciente</h2>
        </div>
        
        {duplicateError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg flex items-start gap-3 animate-pulse">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-red-400" />
            <span className="font-medium">{duplicateError}</span>
          </div>
        )}
        
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <User size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60" />
            <input 
              placeholder="Nombre" 
              value={form.name} 
              onChange={e=>setForm({...form, name: e.target.value})} 
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
              required
            />
          </div>
          
          <div className="relative">
            <User size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60" />
            <input 
              placeholder="Apellido" 
              value={form.lastName} 
              onChange={e=>setForm({...form, lastName: e.target.value})} 
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
              required
            />
          </div>
          
          <div className="relative">
           <Mail size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60" />
            <input 
              placeholder="Email" 
              type="email"
              value={form.email} 
              onChange={e=>setForm({...form, email: e.target.value})} 
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
              required
            />
          </div>
          
          <div className="relative">
            <IdCard size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60" />
            <input 
              placeholder="Documento" 
              value={form.cardIdentity} 
              onChange={e=>setForm({...form, cardIdentity: e.target.value})} 
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
              required
            />
          </div>
           
          
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60" />
            <input 
              placeholder="Calle" 
              value={form.address?.street || ''} 
              onChange={e=>setForm({...form, address: {...(form.address || {}), street: e.target.value}})} 
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
              required
            />
          </div>
          
          <input 
            placeholder="Número" 
            type="number"
            value={form.address?.number || ''} 
            onChange={e=>setForm({...form, address: {...(form.address || {}), number: parseInt(e.target.value) || 0}})} 
            className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
            required
          />
          
          <input 
            placeholder="Localidad" 
            value={form.address?.location || ''} 
            onChange={e=>setForm({...form, address: {...(form.address || {}), location: e.target.value}})} 
            className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
            required
          />
          
          <input 
            placeholder="Provincia" 
            value={form.address?.province || ''} 
            onChange={e=>setForm({...form, address: {...(form.address || {}), province: e.target.value}})} 
            className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
            required
          />
          
          <div className="md:col-span-2 flex gap-2 justify-end">
            <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition font-semibold">
              <Plus size={18} />
              {editingId ? 'Actualizar' : 'Registrar'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null)
                  setForm({ name:'', lastName:'', email:'', cardIdentity: '', address: { street: '', number: '', location: '', province: '' } })
                }} 
                className="px-6 py-3 bg-slate-600/50 border border-slate-500 text-slate-200 rounded-lg hover:bg-slate-600 transition font-semibold"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <User size={28} className="text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Lista de Pacientes <span className="text-cyan-400">({filteredPatients.length})</span></h2>
          </div>
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60" />
            <input 
              type="text"
              placeholder="Buscar por nombre o DNI..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
            />
          </div>
        </div>
        
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center bg-gradient-to-br from-slate-800/50 to-transparent rounded-2xl border border-slate-700/50">
            <User size={48} className="mx-auto text-slate-500/50 mb-4" />
            <p className="text-slate-400 text-lg">{patients.length === 0 ? 'No hay pacientes registrados aún.' : 'No se encontraron resultados.'}</p>
            <p className="text-slate-500 text-sm mt-2">{patients.length === 0 ? 'Crea el primer paciente usando el formulario arriba' : 'Intenta con otro término de búsqueda'}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPatients.map(p => (
              <div key={p.id} className="group relative bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-transparent p-6 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Información Principal */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">{p.name} {p.lastName}</h3>
                    
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail size={16} className="text-cyan-400" />
                      <span className="text-sm">{p.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-300">
                      <IdCard size={16} className="text-cyan-400" />
                      <span className="text-sm font-semibold">{p.cardIdentity}</span>
                    </div>
                
                    
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar size={16} className="text-cyan-400" />
                      <span className="text-sm">{new Date(p.admissionOfDate).toLocaleDateString('es-AR')}</span>
                    </div>
                  </div>
                  
                 
                  <div className="space-y-3">
                    {p.address && (
                      <>
                        <h4 className="font-semibold text-cyan-300 flex items-center gap-2">
                          <MapPin size={16} />
                          Dirección
                        </h4>
                        <p className="text-sm text-slate-300 ml-6">{p.address.street} {p.address.number}</p>
                        <p className="text-sm text-slate-300 ml-6">{p.address.location}, {p.address.province}</p>
                      </>
                    )}
                  </div>
                </div>
                
                
                <div className="flex gap-2 mt-6 pt-6 border-t border-slate-700/50">
                  <button 
                    onClick={() => edit(p)} 
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-lg hover:bg-amber-500/30 hover:border-amber-500 transition font-medium"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button 
                    onClick={() => remove(p.id)} 
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
