import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Patients from './pages/Patients'
import Dentists from './pages/Dentists'
import Appointments from './pages/Appointments'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import { getAuth, isAdmin } from './services/auth'

function PrivateRoute({ children }) {
  return getAuth() ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  return getAuth() && isAdmin() ? children : <Navigate to="/" replace />
}

function ProtectedAuthRoute({ children }) {
  return getAuth() ? <Navigate to="/pacientes" replace /> : children
}

export default function App() {
  const [isAuth, setIsAuth] = useState(getAuth())
  
  useEffect(() => {
    // Monitorear cambios en el storage y evento personalizado
    const handleAuthChange = () => setIsAuth(getAuth())
    window.addEventListener('storage', handleAuthChange)
    window.addEventListener('clinica_auth_changed', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener('clinica_auth_changed', handleAuthChange)
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {isAuth && <Header />}
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to="/pacientes" replace/> : <Navigate to="/login" replace/>} />
          <Route path="/login" element={<ProtectedAuthRoute><Login /></ProtectedAuthRoute>} />
          <Route path="/register" element={<ProtectedAuthRoute><Register /></ProtectedAuthRoute>} />

          <Route path="/pacientes" element={<PrivateRoute><Patients/></PrivateRoute>} />
          <Route path="/odontologos" element={<PrivateRoute><Dentists/></PrivateRoute>} />
          <Route path="/turnos" element={<PrivateRoute><Appointments/></PrivateRoute>} />
          <Route path="/dashboard" element={<AdminRoute><Dashboard/></AdminRoute>} />
        </Routes>
      </main>
    </div>
  )
}
