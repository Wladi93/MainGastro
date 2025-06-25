import { ref } from 'vue'
import { jwtDecode } from 'jwt-decode'

const isAdmin = ref(false)
const isLoggedIn = ref(false)

export function useAuth() {
  const checkRole = () => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      isLoggedIn.value = false
      isAdmin.value = false
      return
    }

    try {
      const decoded = jwtDecode<Record<string, unknown>>(token)
      isLoggedIn.value = true

      const roleKey = Object.keys(decoded).find((key) => key.toLowerCase().includes('role'))
      const userRole = roleKey ? (decoded[roleKey] as string) : null
      isAdmin.value = userRole === 'Admin'
    } catch {
      isLoggedIn.value = false
      isAdmin.value = false
    }
  }

  return {
    isAdmin,
    isLoggedIn,
    checkRole,
  }
}
