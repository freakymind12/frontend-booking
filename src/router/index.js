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
          component: () => import('@/views/dashboard/Dashboard.vue'),
          meta: {
            breadcrumb: 'Dashboard',
          },
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('@/views/pages/NotFound.vue'),
          meta: {
            breadcrumb: 'Not Found',
          },
        },
      ],
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
