import { createRouter, createWebHistory } from 'vue-router'
import TheLayout from '@/layout/TheLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TheLayout,
      redirect: '/dashboard',
      meta: { breadcrumb: 'Home' },
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/HomeDashboard.vue'),
          meta: {
            breadcrumb: 'Dashboard',
            requiresAuth: true,
            roles: ['admin', 'staff', 'viewer'],
          },
        },
        {
          path: '/booking',
          name: 'Booking',
          component: () => import('@/views/booking/TheBooking.vue'),
          meta: {
            breadcrumb: 'Booking',
            requiresAuth: true,
            roles: ['admin', 'staff', 'viewer'],
          },
        },
        {
          path: '/admin',
          name: 'Admin',
          component: () => import('@/views/admin/TheAdmin.vue'),
          meta: {
            breadcrumb: 'Admin',
            requiresAuth: true,
            roles: ['admin'],
          },
        },
      ],
    },
    {
      path: '/recover-password',
      name: 'Recover Password',
      component: () => import('@/views/pages/RecoverPassword.vue'),
      beforeEnter: (to, from, next) => {
        const { iv, data } = to.query

        if (iv && data) {
          next() // OK, lanjut ke halaman
        } else {
          next({ name: 'NotFound' }) // Atau redirect ke halaman lain
        }
      }
    },
    {
      path: '/queue/:id_room',
      name: 'Queue',
      component: () => import('@/views/tablet/TheTablet.vue'),
    },
    {
      path: '/queue/:id_room/schedule',
      name: 'Schedule Info',
      component: () => import('@/views/tablet/ScheduleInfo.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/pages/RegisterPage.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/pages/LoginPage.vue'),
    },
    {
      path: '/forgot-password',
      name: 'Forgot Password',
      component: () => import('@/views/pages/ForgotPassword.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/pages/NotFound.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Pastikan status autentikasi diperiksa ulang setelah refresh
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({ name: 'Login' })
    }

    if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
      return next({ name: 'Unauthorized' })
    }
  }
  next()
})

export default router
