<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import api from '../api'

const users = ref([])
const showModal = ref(false)
const error = ref('')
const form = ref({ email: '', password: '', confirmPassword: '', role: 'STAFF' })

onMounted(fetchUsers)

async function fetchUsers() {
  const res = await api.get('/users')
  users.value = res.data
}

async function createUser() {
  error.value = ''
  try {
    await api.post('/users', form.value)
    showModal.value = false
    form.value = { email: '', password: '', confirmPassword: '', role: 'STAFF' }
    await fetchUsers()
  } catch (err) {
    error.value = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Failed'
  }
}
</script>

<template>
  <AppLayout>
    <template #header>
      <div class="header-row">
        <div>
          <h1 class="page-title">Users</h1>
          <p class="page-sub">User management</p>
        </div>
        <button @click="showModal = true" class="btn-primary">+ ADD USER</button>
      </div>
    </template>

    <table class="data-table">
      <thead>
        <tr>
          <th>EMAIL</th>
          <th>ROLE</th>
          <th>STATUS</th>
          <th>CREATED</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.email }}</td>
          <td>
            <span class="badge" :class="u.role === 'ADMIN' ? 'amber' : 'neutral'">{{ u.role }}</span>
          </td>
          <td>
            <span class="badge" :class="u.isActive ? 'green' : 'red'">{{ u.isActive ? 'ACTIVE' : 'INACTIVE' }}</span>
          </td>
          <td class="mono muted">{{ new Date(u.createdAt).toLocaleDateString() }}</td>
        </tr>
        <tr v-if="!users.length">
          <td colspan="4" class="empty">No users</td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <span>NEW USER</span>
          <button @click="showModal = false" class="close-btn">✕</button>
        </div>
        <form @submit.prevent="createUser" class="modal-form">
          <div class="field">
            <label>EMAIL</label>
            <input v-model="form.email" type="email" required placeholder="user@company.com" />
          </div>
          <div class="field">
            <label>ROLE</label>
            <select v-model="form.role">
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div class="field">
            <label>PASSWORD</label>
            <input v-model="form.password" type="password" required placeholder="Min 8 chars, 1 uppercase, 1 special" />
          </div>
          <div class="field">
            <label>CONFIRM PASSWORD</label>
            <input v-model="form.confirmPassword" type="password" required placeholder="••••••••" />
          </div>
          <div v-if="error" class="error-msg">{{ error }}</div>
          <button type="submit" class="btn-primary full">CREATE USER</button>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.header-row { display: flex; align-items: flex-start; justify-content: space-between; }
.page-title { font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 600; }
.page-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

.btn-primary { background: var(--amber); color: #000; border: none; padding: 9px 18px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: opacity 0.15s; }
.btn-primary:hover { opacity: 0.85; }
.btn-primary.full { width: 100%; padding: 12px; margin-top: 4px; }

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--border); }
.data-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); }
.data-table tr:hover td { background: var(--surface); }

.mono { font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
.muted { color: var(--text-muted); }
.empty { color: var(--text-muted); text-align: center; padding: 32px; }

.badge { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1px; padding: 3px 8px; border: 1px solid; border-radius: 2px; }
.badge.amber { color: var(--amber); border-color: var(--amber); }
.badge.neutral { color: var(--text-muted); border-color: var(--border); }
.badge.green { color: var(--green); border-color: var(--green); }
.badge.red { color: var(--red); border-color: var(--red); }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: var(--surface); border: 1px solid var(--border); width: 420px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 2px; color: var(--text-muted); }
.close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 14px; }
.modal-form { padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--text-muted); }
input, select { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 9px 12px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; outline: none; transition: border-color 0.15s; width: 100%; }
input:focus, select:focus { border-color: var(--amber); }
.error-msg { font-size: 12px; color: var(--red); font-family: 'IBM Plex Mono', monospace; padding: 8px 12px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); }
</style>
