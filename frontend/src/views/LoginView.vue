<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.error || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="grid-lines" />
    </div>

    <div class="login-box">
      <div class="login-brand">
        <div class="brand-mark">SME</div>
        <div class="brand-sub">MANAGEMENT SYSTEM</div>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field">
          <label>EMAIL</label>
          <input v-model="email" type="email" placeholder="admin@company.com" required />
        </div>
        <div class="field">
          <label>PASSWORD</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM' }}
        </button>
      </form>

      <div class="login-footer">
        <span class="mono">v1.0.0</span>
        <span class="mono">INTERNAL USE ONLY</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.4;
}

.login-box {
  position: relative;
  z-index: 1;
  width: 380px;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 40px;
}

.login-brand {
  margin-bottom: 36px;
  text-align: center;
}

.brand-mark {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 36px;
  font-weight: 600;
  color: var(--amber);
  letter-spacing: 8px;
  line-height: 1;
}

.brand-sub {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  letter-spacing: 4px;
  color: var(--text-muted);
  margin-top: 6px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--text-muted);
}

input {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 10px 14px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
}

input:focus {
  border-color: var(--amber);
}

input::placeholder {
  color: var(--border);
}

.error-msg {
  font-size: 12px;
  color: var(--red);
  font-family: 'IBM Plex Mono', monospace;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.login-btn {
  background: var(--amber);
  color: #000;
  border: none;
  padding: 12px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  transition: opacity 0.15s;
  margin-top: 4px;
}

.login-btn:hover:not(:disabled) { opacity: 0.9; }
.login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.mono {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--border);
  letter-spacing: 1px;
}
</style>
