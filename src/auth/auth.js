// checkRoles.js

import axios from 'axios'
import Cookies from 'js-cookie'

const checkRoles = async () => {
  try {
    // Ambil token dari cookies
    const token = Cookies.get('jwt_token')
    // Lakukan request ke backend untuk verifikasi token
    const response = await axios.post(
      'http://192.168.148.125:5151/auth/validate',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error) {
    // Tangani kesalahan jika terjadi
    throw new Error('Error checking roles')
  }
}

// Middleware untuk authentikasi sesi dan peran pengguna
const authMiddleware = async (to, from, next) => {
  // Cek apakah rute memerlukan autentikasi
  if (to.meta.requiresAuth) {
    try {
      // Ambil token dari Cookies
      const token = Cookies.get('jwt_token')

      if (token === undefined) {
        next('/login')
        return
      }

      // Lakukan request ke backend untuk verifikasi token
      const response = await axios.post(
        'http://192.168.148.125:5151/auth/validate',
        {}, //body
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // Cek status sesi dan peran dari respons backend
      if (response.data.session === 'active') {
        // Jika sesi aktif, cek peran pengguna
        const userRole = response.data.role
        if (to.meta.roles && to.meta.roles.includes(userRole)) {
          // Jika peran pengguna sesuai dengan yang dibutuhkan untuk rute tersebut, lanjutkan navigasi
          next()
        } else {
          // Jika peran pengguna tidak sesuai, kirim pengguna ke halaman tidak diizinkan atau tindakan sesuai dengan kebutuhan
          console.log('Unauthorized access, redirecting to forbidden page...')
          next('/forbidden')
        }
      } else if (response.data.session === 'expired') {
        console.log('Session expired, redirecting to login...')
        next('/login')
      }
    } catch (error) {
      // Tangani kesalahan jika terjadi saat verifikasi token
      console.error('Error verifying token:', error)
      next('/error') // Ganti '/error' dengan rute error yang sesuai
    }
  } else {
    // Jika rute tidak memerlukan autentikasi, lanjutkan navigasi
    next()
  }
}

export default {
  checkRoles,
  authMiddleware
}
