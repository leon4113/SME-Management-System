<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import api from '../api'

const auth = useAuthStore()
const products = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingProduct = ref(null)
const error = ref('')

const form = ref({ name: '', sku: '', price: '', quantity: '' })

onMounted(fetchProducts)

async function fetchProducts() {
  loading.value = true
  try {
    const res = await api.get('/products')
    products.value = res.data
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingProduct.value = null
  form.value = { name: '', sku: '', price: '', quantity: '' }
  error.value = ''
  showModal.value = true
}

function openEdit(product) {
  editingProduct.value = product
  form.value = { name: product.name, sku: product.sku, price: product.price, quantity: product.quantity }
  error.value = ''
  showModal.value = true
}

async function handleSubmit() {
  error.value = ''
  try {
    if (editingProduct.value) {
      await api.put(`/products/${editingProduct.value.id}`, form.value)
    } else {
      await api.post('/products', form.value)
    }
    showModal.value = false
    await fetchProducts()
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
          <h1 class="page-title">Products</h1>
          <p class="page-sub">Inventory management</p>
        </div>
        <button v-if="auth.isAdmin" @click="openCreate" class="btn-primary">+ ADD PRODUCT</button>
      </div>
    </template>

    <table class="data-table">
      <thead>
        <tr>
          <th>NAME</th>
          <th>SKU</th>
          <th>PRICE</th>
          <th>STOCK</th>
          <th v-if="auth.isAdmin">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td>{{ p.name }}</td>
          <td class="mono">{{ p.sku }}</td>
          <td class="mono">${{ Number(p.price).toFixed(2) }}</td>
          <td>
            <span :class="['stock', p.quantity < 10 ? 'low' : '']">{{ p.quantity }}</span>
          </td>
          <td v-if="auth.isAdmin">
            <button @click="openEdit(p)" class="btn-ghost">EDIT</button>
          </td>
        </tr>
        <tr v-if="!products.length">
          <td :colspan="auth.isAdmin ? 5 : 4" class="empty">No products</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <span class="mono">{{ editingProduct ? 'EDIT PRODUCT' : 'NEW PRODUCT' }}</span>
          <button @click="showModal = false" class="close-btn">✕</button>
        </div>
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="field">
            <label>NAME</label>
            <input v-model="form.name" required placeholder="Product name" />
          </div>
          <div class="field">
            <label>SKU</label>
            <input v-model="form.sku" required placeholder="PROD-001" :disabled="!!editingProduct" />
          </div>
          <div class="field-row">
            <div class="field">
              <label>PRICE</label>
              <input v-model="form.price" type="number" step="0.01" min="0.01" required placeholder="0.00" />
            </div>
            <div class="field">
              <label>QUANTITY</label>
              <input v-model="form.quantity" type="number" min="0" required placeholder="0" />
            </div>
          </div>
          <div v-if="error" class="error-msg">{{ error }}</div>
          <button type="submit" class="btn-primary full">
            {{ editingProduct ? 'UPDATE' : 'CREATE' }}
          </button>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.header-row { display: flex; align-items: flex-start; justify-content: space-between; }
.page-title { font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 600; }
.page-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

.btn-primary {
  background: var(--amber);
  color: #000;
  border: none;
  padding: 9px 18px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.85; }
.btn-primary.full { width: 100%; padding: 12px; margin-top: 4px; }

.btn-ghost {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 4px 10px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-ghost:hover { border-color: var(--amber); color: var(--amber); }

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--border); }
.data-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); }
.data-table tr:hover td { background: var(--surface); }

.mono { font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
.stock { font-family: 'IBM Plex Mono', monospace; }
.stock.low { color: var(--red); }
.empty { color: var(--text-muted); text-align: center; padding: 32px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: var(--surface); border: 1px solid var(--border); width: 420px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 2px; color: var(--text-muted); }
.close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 14px; }
.close-btn:hover { color: var(--text); }
.modal-form { padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--text-muted); }
input { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 9px 12px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; outline: none; transition: border-color 0.15s; }
input:focus { border-color: var(--amber); }
input:disabled { opacity: 0.5; cursor: not-allowed; }
.error-msg { font-size: 12px; color: var(--red); font-family: 'IBM Plex Mono', monospace; padding: 8px 12px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); }
</style>
