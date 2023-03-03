import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { layout: 'DefaultLayout' },
    component: () => import('@/views/Home/Home.vue')
  }, {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/auth/Auth.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/Login/Login.vue')
      },
      {
        path: 'register',
        name: 'register',
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
    name: 'notFound',
    meta: { layout: 'DefaultLayout' },
    component: () => import('@/views/errors/NotFound.vue')
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    meta: { layout: 'DefaultLayout' },
    component: () => import('@/views/errors/Unauthorized.vue')
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    meta: { layout: 'DefaultLayout' },
    component: () => import('@/views/errors/Forbidden.vue')
  },
  {
    path: '/oops',
    name: 'oops',
    meta: { layout: 'DefaultLayout' },
    component: () => import('@/views/errors/Oops.vue')
  }
]

const router = createRouter({
  routes,
  linkActiveClass: 'ivu-menu-item-active',
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
