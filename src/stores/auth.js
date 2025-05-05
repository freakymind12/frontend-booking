import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'
import { message } from 'ant-design-vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('isLoggedIn'),
    accessToken: !!localStorage.getItem('accessToken'),
  }),

  actions: {
    // Login user
    async login(email, password) {
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_BASE_URL + '/auth/login',
          {
            email,
            password,
          },
          {
            withCredentials: true,
          },
        )

        this.user = response.data.data
        this.isAuthenticated = true
        this.accessToken = response.data.data.access_token

        // Simpan data di localStorage
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('accessToken', this.accessToken)

        router.push('/dashboard')
      } catch (error) {
        message.error(error.response.data.message)
        console.error('Login failed:', error)
      }
    },

    // Logout user
    async logout() {
      try {
        await axios.post(
          import.meta.env.VITE_API_BASE_URL + '/auth/logout',
          {},
          { withCredentials: true },
        )

        this.user = null
        this.isAuthenticated = false

        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')

        router.push('/login')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    },

    setIsAuthenticated(value) {
      this.isAuthenticated = value
    },
  },
})
