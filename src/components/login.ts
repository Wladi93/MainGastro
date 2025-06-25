import { ref } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export interface LoginData {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  expires: string
}

export const useLogin = () => {
  const $q = useQuasar()
  const router = useRouter()

  const Username = ref('')
  const Password = ref('')
  const isPwd = ref(true)
  const isLoading = ref(false)
  const formatUsername = (username: string): string => {
    if (username.toLowerCase() === 'admin') {
      return 'admin'
    }
    return username.charAt(0).toUpperCase() + username.slice(1)
  }

  const usernameRules = [(val: string) => !!val || 'Dieses Feld ist erforderlich']

  const passwordRules = [(val: string) => !!val || 'Dieses Feld ist erforderlich']

  const login = async (): Promise<void> => {
    if (!Username.value || !Password.value) {
      $q.notify({
        type: 'negative',
        message: 'Bitte füllen Sie alle Felder aus',
      })
      return
    }

    isLoading.value = true

    try {
      const loginData: LoginData = {
        username: formatUsername(Username.value),
        password: Password.value,
      }

      const response = await axios.post<LoginResponse>(
        'http://localhost:5008/api/auth/login',
        loginData,
      )

      const { token, expires } = response.data

      localStorage.setItem('authToken', token)
      localStorage.setItem('tokenExpires', expires)

      $q.notify({
        type: 'positive',
        message: 'Login war erfolgreich',
      })

      await router.push('/')
    } catch (error) {
      console.error('Login Fehler:', error)
      $q.notify({
        type: 'negative',
        message: 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.',
      })
    } finally {
      isLoading.value = false
      location.reload()
    }
  }

  const resetForm = (): void => {
    Username.value = ''
    Password.value = ''
    isPwd.value = true
  }

  return {
    Username,
    Password,
    isPwd,
    isLoading,

    usernameRules,
    passwordRules,

    login,
    resetForm,
  }
}
