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
// const authMiddleware = async (to, from, next) => {
//   // Cek apakah rute memerlukan autentikasi
//   if (to.meta.requiresAuth) {
//     try {
//       // Ambil token dari Cookies
//       const token = Cookies.get('jwt_token')

//       if (token === undefined) {
//         next('/login')
//         return
//       }

//       // Lakukan request ke backend untuk verifikasi token
//       const response = await axios.post(
//         'http://192.168.148.125:5151/auth/validate',
//         {}, //body
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       )

//       // Cek status sesi dan peran dari respons backend
//       if (response.data.session === 'active') {
//         const userRole = response.data.role
//         if (to.meta.roles && to.meta.roles.includes(userRole)) {
//           next()
//         } else {
//           console.log('Unauthorized access, redirecting to forbidden page...')
//           next('/forbidden')
//         }
//       } else if (response.data.session === 'expired') {
//         console.log('Session expired, redirecting to login...')
//         next('/login')
//       }
//     } catch (error) {
//       console.error('Error verifying token:', error)
//       next('/error') // Ganti '/error' dengan rute error yang sesuai
//     }
//   } else {
//     // Jika rute tidak memerlukan autentikasi, lanjutkan navigasi
//     next()
//   }
// }

const API_URL = 'http://192.168.148.125:5151/auth/validate'

// Fungsi untuk mengirim request verifikasi token
const verifyToken = async (token) => {
  try {
    const response = await axios.post(
      API_URL,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error verifying token')
  }
}

// Middleware untuk autentikasi sesi dan peran pengguna
const authMiddleware = async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next()
  }

  const token = Cookies.get('jwt_token')

  if (!token) {
    console.log('Token not found, redirecting to login...')
    return next('/login')
  }

  try {
    const { session, role } = await verifyToken(token)

    if (session === 'expired') {
      console.log('Session expired, redirecting to login...')
      return next('/login')
    }

    if (to.meta.roles && !to.meta.roles.includes(role)) {
      console.log('Unauthorized access, redirecting to forbidden page...')
      return next('/forbidden')
    }

    next()
  } catch (error) {
    console.error('Error verifying token:', error)
    next('/error')
  }
}

export default {
  checkRoles,
  authMiddleware
}
