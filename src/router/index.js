import { createRouter, createWebHistory } from 'vue-router'
import Layouts from '@/layouts/TheLayout.vue'
import auth from '@/auth/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/',
      component: Layouts,
      children: [
        {
          path: '/',
          component: () => import('@/views/home/TheHome.vue'),
          meta: {
            requiresAuth: true,
            roles: ['admin', 'staff', 'viewer']
          },

          beforeEnter: auth.authMiddleware
        },
        {
          path: '/booking',
          component: () => import('@/views/booking/TheBooking.vue'),
          meta: {
            requiresAuth: true,
            roles: ['admin', 'staff', 'viewer']
          },
          beforeEnter: auth.authMiddleware
        },
        {
          path: '/admin',
          component: () => import('@/views/admin/TheAdmin.vue'),
          meta: {
            requiresAuth: true,
            roles: ['admin']
          },
          beforeEnter: auth.authMiddleware
        }
      ]
    },

    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/pages/RegisterPage.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/pages/LoginPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/pages/ThePage404.vue')
    }
  ]
})

export default router
