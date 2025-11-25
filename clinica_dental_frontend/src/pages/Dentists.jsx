import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { isAdmin } from '../services/auth'
import { Plus, Edit2, Trash2, Smile, Badge, Search } from 'lucide-react'

export default function Dentists(){
  const [list, setList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ registration:'', name:'', lastName:'' })
  const admin = isAdmin()

  async function load(){
    try {
      const res = await api.get('/odontologos')
      setList(res.data)
      setFilteredList(res.data)
    } catch(err) {
      console.error('Error loading dentists:', err)
    }
  }
  useEffect(()=>{ load() }, [])

  useEffect(() => {
    if (!list || list.length === 0 || searchTerm.trim() === '') {
      setFilteredList(list)
      return
    }
    
    const term = searchTerm.toLowerCase()
    try {
      const filtered = list.filter(d => {
        if (!d) return false
        const name = String(d.name || '').toLowerCase()
        const lastName = String(d.lastName || '').toLowerCase()
        const registration = String(d.registration || '').toLowerCase()
        
        return (name + ' ' + lastName).includes(term) || 
               registration.includes(term)
      })
      setFilteredList(filtered)
    } catch(err) {
      console.error('Error filtering dentists:', err)
      setFilteredList(list)
    }
  }, [searchTerm, list])

  async function submit(e){
    e.preventDefault()
    try {
      if(editingId){
        await api.put('/odontologos', { ...form, id: editingId })
        setEditingId(null)
      } else {
        await api.post('/odontologos', form)
      }
      setForm({ registration:'', name:'', lastName:'' })
      load()
    } catch(err) {
      console.error('Error saving dentist:', err)
      alert('Error al guardar odontólogo: ' + (err.response?.data?.message || err.message))
    }
  }

  function edit(dentist) {
    setEditingId(dentist.id)
    setForm({
      registration: dentist.registration,
      name: dentist.name,
      lastName: dentist.lastName
    })
  }

  async function remove(id){
    if(!confirm('¿Eliminar este odontólogo?')) return
    try {
      await api.delete(`/odontologos/${id}`)
      load()
    } catch(err) {
      console.error('Error deleting dentist:', err)
    }
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">Gestión de Odontólogos</h1>
        <p className="text-slate-300 text-lg">Administra los profesionales de la clínica</p>
      </div>

      {admin && (
        <div className="bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-transparent p-8 rounded-2xl border border-slate-700/50 shadow-xl mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Plus size={28} className="text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">{editingId ? 'Editar' : 'Registrar'} Odontólogo</h2>
          </div>
          
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Badge size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60" />
              <input 
                placeholder="Matrícula Profesional" 
                value={form.registration} 
                onChange={e=>setForm({...form, registration: e.target.value})} 
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
                required
              />
            </div>
            
            <div className="relative">
              <Smile size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60" />
              <input 
                placeholder="Nombre" 
                value={form.name} 
                onChange={e=>setForm({...form, name: e.target.value})} 
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
                required
              />
            </div>
            
            <div className="relative">
              <Smile size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60" />
              <input 
                placeholder="Apellido" 
                value={form.lastName} 
                onChange={e=>setForm({...form, lastName: e.target.value})} 
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
                required
              />
            </div>
            
            <div className="flex gap-2 items-end">
              <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition font-semibold">
                <Plus size={18} />
                {editingId ? 'Actualizar' : 'Registrar'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null)
                    setForm({ registration:'', name:'', lastName:'' })
                  }} 
                  className="px-6 py-3 bg-slate-600/50 border border-slate-500 text-slate-200 rounded-lg hover:bg-slate-600 transition font-semibold"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Lista de Odontólogos */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Smile size={28} className="text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Lista de Odontólogos <span className="text-cyan-400">({filteredList.length})</span></h2>
          </div>
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute left-3 top-3.5 text-cyan-400 opacity-60" />
            <input 
              type="text"
              placeholder="Buscar por nombre..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
            />
          </div>
        </div>
        
        {filteredList.length === 0 ? (
          <div className="p-12 text-center bg-gradient-to-br from-slate-800/50 to-transparent rounded-2xl border border-slate-700/50">
            <Smile size={48} className="mx-auto text-slate-500/50 mb-4" />
            <p className="text-slate-400 text-lg">{list.length === 0 ? 'No hay odontólogos registrados aún.' : 'No se encontraron resultados.'}</p>
            <p className="text-slate-500 text-sm mt-2">{list.length === 0 ? 'Crea el primer profesional usando el formulario arriba' : 'Intenta con otro término de búsqueda'}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredList.map(d => (
              <div key={d.id} className="group relative bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-transparent p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                    <Smile size={24} className="text-white" />
                  </div>
                  {admin && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => edit(d)} 
                        className="p-2 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-lg hover:bg-amber-500/30 transition"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => remove(d.id)} 
                        className="p-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text mb-3">{d.name} {d.lastName}</h3>
                
                <div className="space-y-3 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Badge size={16} className="text-purple-400" />
                    <span className="text-sm"><strong>Matrícula:</strong> {d.registration}</span>
                  </div>
                </div>
                
                {/* Botones en Mobile */}
                {admin && (
                  <div className="md:hidden flex gap-2 mt-6 pt-4 border-t border-slate-700/50">
                    <button 
                      onClick={() => edit(d)} 
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-lg hover:bg-amber-500/30 transition text-sm font-medium"
                    >
                      <Edit2 size={14} />
                      Editar
                    </button>
                    <button 
                      onClick={() => remove(d.id)} 
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition text-sm font-medium"
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
