<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import api from '../api'

const logs = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/audit')
    logs.value = res.data.reverse()
  } finally {
    loading.value = false
  }
})

const actionColor = a => {
  if (a.includes('CREATE')) return 'var(--green)'
  if (a.includes('UPDATE')) return 'var(--amber)'
  if (a.includes('DELETE')) return 'var(--red)'
  return 'var(--text-muted)'
}
</script>

<template>
  <AppLayout>
    <template #header>
      <h1 class="page-title">Audit Log</h1>
      <p class="page-sub">System activity trail</p>
    </template>

    <table class="data-table">
      <thead>
        <tr>
          <th>TIMESTAMP</th>
          <th>USER</th>
          <th>ACTION</th>
          <th>ENTITY</th>
          <th>ENTITY ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log.id">
          <td class="mono muted">{{ new Date(log.createdAt).toLocaleString() }}</td>
          <td>{{ log.user?.email || '—' }}</td>
          <td>
            <span class="action-badge" :style="{ color: actionColor(log.action) }">
              {{ log.action }}
            </span>
          </td>
          <td class="muted">{{ log.entity }}</td>
          <td class="mono muted small">{{ log.entityId.slice(0, 12) }}...</td>
        </tr>
        <tr v-if="!logs.length && !loading">
          <td colspan="5" class="empty">No audit logs</td>
        </tr>
      </tbody>
    </table>
  </AppLayout>
</template>

<style scoped>
.page-title { font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 600; }
.page-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--border); }
.data-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); }
.data-table tr:hover td { background: var(--surface); }

.mono { font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
.muted { color: var(--text-muted); }
.small { font-size: 11px; }
.empty { color: var(--text-muted); text-align: center; padding: 32px; }

.action-badge {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 1px;
  font-weight: 500;
}
</style>
