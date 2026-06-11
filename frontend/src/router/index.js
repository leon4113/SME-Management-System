import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', component: () => import('../views/LoginView.vue'), meta: { public: true } },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/users', component: () => import('../views/UsersView.vue'), meta: { adminOnly: true } },
  { path: '/products', component: () => import('../views/ProductsView.vue') },
  { path: '/orders', component: () => import('../views/OrdersView.vue') },
  { path: '/audit', component: () => import('../views/AuditView.vue'), meta: { adminOnly: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) return '/login'
  if (to.meta.adminOnly && !auth.isAdmin) return '/dashboard'
  if (to.path === '/login' && auth.isAuthenticated) return '/dashboard'
})

export default router
