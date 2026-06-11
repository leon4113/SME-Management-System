<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const nav = computed(() => [
  { path: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { path: '/products', label: 'Products', icon: '◈' },
  { path: '/orders', label: 'Orders', icon: '◎' },
  ...(auth.isAdmin ? [
    { path: '/users', label: 'Users', icon: '◉' },
    { path: '/audit', label: 'Audit Log', icon: '◬' },
  ] : []),
])

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="brand-mark">SME</span>
        <span class="brand-sub">MGMT</span>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in nav"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <span class="user-role">{{ auth.user?.role }}</span>
          <button @click="logout" class="logout-btn">LOGOUT</button>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <div class="page-header">
        <slot name="header" />
      </div>
      <div class="page-body">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
}

.sidebar-brand {
  padding: 24px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-mark {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 22px;
  font-weight: 600;
  color: var(--amber);
  letter-spacing: 4px;
}

.brand-sub {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 6px;
  color: var(--text-muted);
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 4px;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.15s ease;
}

.nav-item:hover {
  color: var(--text);
  background: var(--surface-2);
}

.nav-item.active {
  color: var(--amber);
  background: var(--amber-dim);
}

.nav-icon {
  font-size: 14px;
  width: 16px;
  text-align: center;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border);
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-role {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 2px;
}

.logout-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  color: var(--text-muted);
  background: none;
  border: 1px solid var(--border);
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.logout-btn:hover {
  color: var(--red);
  border-color: var(--red);
}

.main-content {
  margin-left: 200px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 28px 36px 0;
  border-bottom: 1px solid var(--border);
  padding-bottom: 20px;
}

.page-body {
  padding: 28px 36px;
  flex: 1;
}
</style>
