import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    token.value = res.data.token
    localStorage.setItem('token', token.value)

    const payload = JSON.parse(atob(token.value.split('.')[1]))
    user.value = { userId: payload.userId, role: payload.role }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, isAdmin, login, logout }
})
