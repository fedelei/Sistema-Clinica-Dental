import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { saveToken } from '../services/auth'
import { Smile, LogIn, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      saveToken(res.data.token)
      window.dispatchEvent(new Event('clinica_auth_changed'))
      navigate('/pacientes')
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg">
              <Smile size={32} className="text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">Clínica Dental</h1>
          <p className="text-center text-slate-400 mb-8">Inicia sesión para continuar</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-red-400" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Correo Electrónico</label>
              <input 
                type="email"
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition" 
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn size={18} />
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700/50">
            <p className="text-center text-slate-400 text-sm">
              ¿No tienes cuenta?{' '}
              <button 
                type="button"
                onClick={()=>navigate('/register')} 
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
              >
                Registrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
