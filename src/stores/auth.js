import { defineStore } from 'pinia'
import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('isLoggedIn'),
    accessToken: !!localStorage.getItem('accessToken'),
  }),

  actions: {
    //RecoverPassword
    async recoveryPassword(data) {
      try {
        const { password, ...payload } = data
        const queryParams = new URLSearchParams(payload).toString()
        const response = await axios.post(API_BASE_URL + `/auth/recovery-password?${queryParams}`, { password })
        return response.data
      } catch (error) {
        console.error('Failed to recover your password:', error)
        return error.response.data
      }
    },

    // forgetPassword
    async forgotPassword(data) {
      try {
        const response = await axios.post(API_BASE_URL + `/auth/forgot-password`, data)
        return response.data
      } catch (error) {
        console.error('Failed to send forgot password email:', error)
        return error.response.data
      }
    },

    // Login user
    async login(email, password) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/login`,
          { email, password },
          { withCredentials: true }
        );

        const userData = response.data?.data;

        if (!userData?.access_token) {
          throw new Error('Invalid login response: access token missing');
        }

        // Update state
        this.user = userData;
        this.isAuthenticated = true;
        this.accessToken = userData.access_token;

        // Simpan data di localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('accessToken', this.accessToken);

        // Redirect to dashboard
        router.push('/dashboard');

      } catch (error) {
        const messageText = error.response?.data?.message || error.message || 'Login failed';
        message.error(messageText);
        console.error('Login failed:', error);
      }
    },


    // Logout user
    async logout() {
      try {
        await axios.post(
          API_BASE_URL + '/auth/logout',
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
