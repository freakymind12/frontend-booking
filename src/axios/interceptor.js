import { useAuthStore } from '@/stores/auth'
import { message } from 'ant-design-vue'
import axios from 'axios'
import router from '@/router'
const auth = useAuthStore()

// Buat instance axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Sesuaikan dengan URL backend Anda
  withCredentials: true, // Untuk mengirimkan cookie (refresh token)
})

// Tambahkan interceptor untuk setiap request
api.interceptors.request.use(
  config => {
    // Ambil access token dari localStorage
    const accessToken = localStorage.getItem('accessToken')

    // Jika accessToken ada, tambahkan ke header Authorization
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// Tambahkan interceptor untuk respons
api.interceptors.response.use(
  response => response, // Jika respons berhasil, lanjutkan
  async error => {
    const originalRequest = error.config

    // Cek apakah error disebabkan oleh token kadaluwarsa (status 403) dan belum dicoba ulang
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        // Kirim permintaan ke endpoint refresh token
        const res = await axios.post(
          import.meta.env.VITE_API_BASE_URL + '/auth/refresh',
          {},
          {
            withCredentials: true, // Mengirimkan refresh token yang ada di cookie
          },
        )

        // Ambil token baru dari respons refresh
        const newAccessToken = res.data.access_token

        // Update access token di header authorization
        api.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`

        // Simpan access token yang baru di localStorage untuk permintaan selanjutnya
        localStorage.setItem('accessToken', newAccessToken)

        // Update header authorization pada permintaan ulang
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

        // Ulangi permintaan dengan access token yang baru
        return api(originalRequest)
      } catch (error) {
        if (error.response.status == 403) {
          auth.setIsAuthenticated(false)
          localStorage.removeItem('isLoggedIn')
          message.info('Your session is expired, please login again')
          router.push('/login')
        }
        if( error.response.status == 401){
          auth.setIsAuthenticated(false)
          localStorage.removeItem('isLoggedIn')
          message.info('Refresh token not found, please login again')
          router.push('/login')
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api
