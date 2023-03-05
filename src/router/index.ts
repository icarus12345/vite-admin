import { createRouter, createWebHashHistory } from 'vue-router'
import { GuestGuard } from '../guards'

const routes = [
  {
    path: '/',
    name: 'HOME',
    meta: { layout: 'DefaultLayout' },
    component: () => import('@/views/Home/Home.vue')
  }, {
    path: '/auth',
    name: 'AUTH',
    beforeEnter: GuestGuard,
    component: () => import('@/views/auth/Auth.vue'),
    children: [
      {
        path: 'login',
        name: 'AUTH.LOGIN',
        component: () => import('@/views/auth/Login/Login.vue')
      },
      {
        path: 'register',
        name: 'AUTH.REGISTER',
        component: () => import('@/views/auth/Register.vue')
      },
      {
        path: 'forgot-password',
        name: 'forgotPassword',
        component: () => import('@/views/auth/ForgotPassword.vue')
      },
      {
        path: 'reset-password',
        name: 'resetPassword',
        component: () => import('@/views/auth/ResetPassword.vue')
      }
    ]
  },
  {
    path: '/not-found',
    name: 'NOTFOUND',
    meta: { layout: 'DefaultLayout' },
    component: () => import('@/views/errors/NotFound.vue')
  },
  {
    path: '/unauthorized',
    name: 'UNAUTHORIZED',
    meta: { layout: 'DefaultLayout' },
    component: () => import('@/views/errors/Unauthorized.vue')
  },
  {
    path: '/forbidden',
    name: 'FORBIDDEN',
    meta: { layout: 'DefaultLayout' },
    component: () => import('@/views/errors/Forbidden.vue')
  },
  {
    path: '/oops',
    name: 'OOPS',
    meta: { layout: 'DefaultLayout' },
    component: () => import('@/views/errors/Oops.vue')
  }
]

const router = createRouter({
  routes,
  linkActiveClass: 'ivu-menu-item-active',
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
