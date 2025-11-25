import jwt_decode from 'jwt-decode'

const TOKEN_KEY = 'clinica_token'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
  try { window.dispatchEvent(new Event('clinica_auth_changed')) } catch(e){}
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  try { window.dispatchEvent(new Event('clinica_auth_changed')) } catch(e){}
}

export function getAuth() {
  const t = getToken()
  if (!t) return false
  try {
    const p = jwt_decode(t)
    if (p.exp && typeof p.exp === 'number') {
      const now = Date.now() / 1000
      if (p.exp < now) {
        removeToken()
        return false
      }
    }
    return true
  } catch (e) {
    removeToken()
    return false
  }
}

export function getRole() {
  const t = getToken()
  if (!t) return null
  try {
    const p = jwt_decode(t)
    return (p.role || null)
  } catch (e) {
    return null
  }
}

export function isAdmin() {
  return getRole() === 'ADMIN'
}
