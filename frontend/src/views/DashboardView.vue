<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import api from '../api'

const stats = ref({ users: 0, products: 0, orders: 0, pendingOrders: 0 })
const recentOrders = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [products, orders] = await Promise.all([
      api.get('/products'),
      api.get('/orders'),
    ])
    stats.value.products = products.data.length
    stats.value.orders = orders.data.length
    stats.value.pendingOrders = orders.data.filter(o => o.status === 'PENDING').length
    recentOrders.value = orders.data.slice(-5).reverse()
  } finally {
    loading.value = false
  }
})

const statusColor = s => ({ PENDING: '#f59e0b', COMPLETED: '#10b981', CANCELLED: '#ef4444' }[s])
</script>

<template>
  <AppLayout>
    <template #header>
      <h1 class="page-title">Dashboard</h1>
      <p class="page-sub">System overview</p>
    </template>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">TOTAL PRODUCTS</div>
        <div class="stat-value">{{ stats.products }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">TOTAL ORDERS</div>
        <div class="stat-value">{{ stats.orders }}</div>
      </div>
      <div class="stat-card accent">
        <div class="stat-label">PENDING ORDERS</div>
        <div class="stat-value">{{ stats.pendingOrders }}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <span class="section-title">RECENT ORDERS</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>STATUS</th>
            <th>ITEMS</th>
            <th>DATE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in recentOrders" :key="order.id">
            <td class="mono">{{ order.id.slice(0, 8) }}...</td>
            <td>
              <span class="badge" :style="{ color: statusColor(order.status), borderColor: statusColor(order.status) }">
                {{ order.status }}
              </span>
            </td>
            <td>{{ order.items?.length || 0 }}</td>
            <td class="mono muted">{{ new Date(order.createdAt).toLocaleDateString() }}</td>
          </tr>
          <tr v-if="!recentOrders.length">
            <td colspan="4" class="empty">No orders yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppLayout>
</template>

<style scoped>
.page-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 1px;
}
.page-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 24px;
}

.stat-card.accent { border-color: var(--amber); background: var(--amber-dim); }

.stat-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.stat-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 36px;
  font-weight: 600;
  color: var(--text);
}

.stat-card.accent .stat-value { color: var(--amber); }

.section { margin-top: 8px; }

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--text-muted);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
}

.data-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

.data-table tr:hover td { background: var(--surface); }

.mono { font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
.muted { color: var(--text-muted); }

.badge {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 1px;
  padding: 3px 8px;
  border: 1px solid;
  border-radius: 2px;
}

.empty { color: var(--text-muted); font-style: italic; text-align: center; padding: 32px; }
</style>
