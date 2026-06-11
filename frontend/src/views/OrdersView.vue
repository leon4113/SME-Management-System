<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import api from '../api'

const orders = ref([])
const products = ref([])
const showModal = ref(false)
const showUpdateModal = ref(false)
const selectedOrder = ref(null)
const updateStatus = ref('')
const error = ref('')
const updateError = ref('')

const items = ref([{ productId: '', quantity: 1 }])

onMounted(async () => {
  const [o, p] = await Promise.all([api.get('/orders'), api.get('/products')])
  orders.value = o.data.reverse()
  products.value = p.data
})

function addItem() { items.value.push({ productId: '', quantity: 1 }) }
function removeItem(i) { if (items.value.length > 1) items.value.splice(i, 1) }

async function createOrder() {
  error.value = ''
  try {
    await api.post('/orders', { items: items.value })
    showModal.value = false
    items.value = [{ productId: '', quantity: 1 }]
    const res = await api.get('/orders')
    orders.value = res.data.reverse()
  } catch (err) {
    error.value = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Failed'
  }
}

function openUpdate(order) {
  selectedOrder.value = order
  updateStatus.value = ''
  updateError.value = ''
  showUpdateModal.value = true
}

async function submitUpdate() {
  updateError.value = ''
  try {
    await api.patch(`/orders/${selectedOrder.value.id}`, { status: updateStatus.value })
    showUpdateModal.value = false
    const res = await api.get('/orders')
    orders.value = res.data.reverse()
  } catch (err) {
    updateError.value = err.response?.data?.message || err.response?.data?.error || 'Failed'
  }
}

const productName = id => products.value.find(p => p.id === id)?.name || id.slice(0,8)
const statusColor = s => ({ PENDING: '#f59e0b', COMPLETED: '#10b981', CANCELLED: '#ef4444' }[s])
</script>

<template>
  <AppLayout>
    <template #header>
      <div class="header-row">
        <div>
          <h1 class="page-title">Orders</h1>
          <p class="page-sub">Order management</p>
        </div>
        <button @click="showModal = true" class="btn-primary">+ NEW ORDER</button>
      </div>
    </template>

    <table class="data-table">
      <thead>
        <tr>
          <th>ORDER ID</th>
          <th>STATUS</th>
          <th>ITEMS</th>
          <th>DATE</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td class="mono">{{ order.id.slice(0,8) }}...</td>
          <td>
            <span class="badge" :style="{ color: statusColor(order.status), borderColor: statusColor(order.status) }">
              {{ order.status }}
            </span>
          </td>
          <td class="muted">{{ order.items?.map(i => productName(i.productId)).join(', ') }}</td>
          <td class="mono muted">{{ new Date(order.createdAt).toLocaleDateString() }}</td>
          <td>
            <button
              v-if="order.status === 'PENDING'"
              @click="openUpdate(order)"
              class="btn-ghost"
            >UPDATE</button>
            <span v-else class="mono muted" style="font-size:10px">—</span>
          </td>
        </tr>
        <tr v-if="!orders.length">
          <td colspan="5" class="empty">No orders</td>
        </tr>
      </tbody>
    </table>

    <!-- Create Order Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <span>NEW ORDER</span>
          <button @click="showModal = false" class="close-btn">✕</button>
        </div>
        <form @submit.prevent="createOrder" class="modal-form">
          <div v-for="(item, i) in items" :key="i" class="item-row">
            <div class="field" style="flex:1">
              <label v-if="i === 0">PRODUCT</label>
              <select v-model="item.productId" required>
                <option value="">Select product</option>
                <option v-for="p in products" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ p.quantity }} in stock)
                </option>
              </select>
            </div>
            <div class="field" style="width:80px">
              <label v-if="i === 0">QTY</label>
              <input v-model.number="item.quantity" type="number" min="1" required />
            </div>
            <button type="button" @click="removeItem(i)" class="remove-btn" :style="i === 0 ? 'margin-top:22px' : ''">✕</button>
          </div>
          <button type="button" @click="addItem" class="btn-ghost">+ ADD ITEM</button>
          <div v-if="error" class="error-msg">{{ error }}</div>
          <button type="submit" class="btn-primary full">CREATE ORDER</button>
        </form>
      </div>
    </div>

    <!-- Update Status Modal -->
    <div v-if="showUpdateModal" class="modal-overlay" @click.self="showUpdateModal = false">
      <div class="modal">
        <div class="modal-header">
          <span>UPDATE ORDER STATUS</span>
          <button @click="showUpdateModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-form">
          <div class="field">
            <label>NEW STATUS</label>
            <select v-model="updateStatus">
              <option value="">Select status</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
          <div v-if="updateError" class="error-msg">{{ updateError }}</div>
          <button @click="submitUpdate" :disabled="!updateStatus" class="btn-primary full">
            CONFIRM UPDATE
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.header-row { display: flex; align-items: flex-start; justify-content: space-between; }
.page-title { font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 600; }
.page-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

.btn-primary { background: var(--amber); color: #000; border: none; padding: 9px 18px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: opacity 0.15s; }
.btn-primary:hover:not(:disabled) { opacity: 0.85; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary.full { width: 100%; padding: 12px; margin-top: 4px; }

.btn-ghost { background: none; border: 1px solid var(--border); color: var(--text-muted); padding: 4px 10px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1px; cursor: pointer; transition: all 0.15s; }
.btn-ghost:hover { border-color: var(--amber); color: var(--amber); }

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--border); }
.data-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); }
.data-table tr:hover td { background: var(--surface); }

.mono { font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
.muted { color: var(--text-muted); font-size: 12px; }
.badge { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1px; padding: 3px 8px; border: 1px solid; border-radius: 2px; }
.empty { color: var(--text-muted); text-align: center; padding: 32px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: var(--surface); border: 1px solid var(--border); width: 460px; max-height: 80vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 2px; color: var(--text-muted); position: sticky; top: 0; background: var(--surface); }
.close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 14px; }
.modal-form { padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--text-muted); }
input, select { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 9px 12px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; outline: none; transition: border-color 0.15s; width: 100%; }
input:focus, select:focus { border-color: var(--amber); }
select option { background: var(--surface); }
.item-row { display: flex; align-items: flex-end; gap: 8px; }
.remove-btn { background: none; border: 1px solid var(--border); color: var(--text-muted); width: 32px; height: 36px; cursor: pointer; flex-shrink: 0; transition: all 0.15s; font-size: 12px; }
.remove-btn:hover { border-color: var(--red); color: var(--red); }
.error-msg { font-size: 12px; color: var(--red); font-family: 'IBM Plex Mono', monospace; padding: 8px 12px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); }
</style>
