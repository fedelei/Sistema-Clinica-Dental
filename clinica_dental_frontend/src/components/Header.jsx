import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, isAdmin, removeToken } from '../services/auth'
import { Smile, Users, Calendar, BarChart3, LogOut, Home, Menu, X } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  
  const [auth, setAuth] = useState(getAuth())
  const [admin, setAdmin] = useState(isAdmin())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 🔥 Escuchar cambios en autenticación
  useEffect(() => {
    function updateAuthState() {
      setAuth(getAuth())
      setAdmin(isAdmin())
    }

    window.addEventListener('clinica_auth_changed', updateAuthState)
    return () => {
      window.removeEventListener('clinica_auth_changed', updateAuthState)
    }
  }, [])

  function logout() {
    removeToken()
    setMobileMenuOpen(false)
    navigate('/login')
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 backdrop-blur-md shadow-xl border-b border-blue-700/50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/pacientes" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-400/30 transition">
            <Smile size={28} className="text-white" />
          </div>
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Clínica Dental</span>
        </Link>
        
        {/* Desktop Navigation */}
        {auth && (
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/pacientes" className="flex items-center gap-2 text-slate-200 hover:text-cyan-300 transition group">
              <Users size={18} className="group-hover:scale-110 transition" />
              <span>Pacientes</span>
            </Link>
            <Link to="/odontologos" className="flex items-center gap-2 text-slate-200 hover:text-cyan-300 transition group">
              <Smile size={18} className="group-hover:scale-110 transition" />
              <span>Odontólogos</span>
            </Link>
            <Link to="/turnos" className="flex items-center gap-2 text-slate-200 hover:text-cyan-300 transition group">
              <Calendar size={18} className="group-hover:scale-110 transition" />
              <span>Turnos</span>
            </Link>
            {admin && (
              <Link to="/dashboard" className="flex items-center gap-2 text-slate-200 hover:text-cyan-300 transition group">
                <BarChart3 size={18} className="group-hover:scale-110 transition" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>
        )}
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-3">
          {!auth ? (
            <>
              <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition font-medium">Iniciar sesión</Link>
              <Link to="/register" className="px-4 py-2 border-2 border-cyan-400 text-cyan-300 rounded-lg hover:bg-cyan-400/10 transition font-medium">Registro</Link>
            </>
          ) : (
            <button 
              onClick={logout} 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-600/50 transition font-medium group"
            >
              <LogOut size={18} className="group-hover:scale-110 transition" />
              <span>Cerrar sesión</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-cyan-300 hover:bg-blue-800/50 rounded-lg transition"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-blue-700/50 bg-blue-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {auth && (
              <>
                <Link 
                  to="/pacientes" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 text-slate-200 hover:text-cyan-300 transition py-2 px-3 rounded hover:bg-blue-700/30"
                >
                  <Users size={18} />
                  <span>Pacientes</span>
                </Link>
                <Link 
                  to="/odontologos" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 text-slate-200 hover:text-cyan-300 transition py-2 px-3 rounded hover:bg-blue-700/30"
                >
                  <Smile size={18} />
                  <span>Odontólogos</span>
                </Link>
                <Link 
                  to="/turnos" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 text-slate-200 hover:text-cyan-300 transition py-2 px-3 rounded hover:bg-blue-700/30"
                >
                  <Calendar size={18} />
                  <span>Turnos</span>
                </Link>
                {admin && (
                  <Link 
                    to="/dashboard" 
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 text-slate-200 hover:text-cyan-300 transition py-2 px-3 rounded hover:bg-blue-700/30"
                  >
                    <BarChart3 size={18} />
                    <span>Dashboard</span>
                  </Link>
                )}
              </>
            )}
            
            <div className="border-t border-blue-700/50 pt-4 flex flex-col gap-2">
              {!auth ? (
                <>
                  <Link 
                    to="/login" 
                    onClick={closeMobileMenu}
                    className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition font-medium text-center"
                  >
                    Iniciar sesión
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={closeMobileMenu}
                    className="w-full px-4 py-2 border-2 border-cyan-400 text-cyan-300 rounded-lg hover:bg-cyan-400/10 transition font-medium text-center"
                  >
                    Registro
                  </Link>
                </>
              ) : (
                <button 
                  onClick={logout} 
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-600/50 transition font-medium group"
                >
                  <LogOut size={18} className="group-hover:scale-110 transition" />
                  <span>Cerrar sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
