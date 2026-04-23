<template>
  <div style="max-width: 400px; margin: 50px auto; padding: 30px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #0f172a; margin-bottom: 25px;">Login</h2>
    
    <div v-if="error" style="background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      {{ error }}
    </div>
    
    <div v-if="success" style="background: #dcfce7; color: #166534; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      {{ success }}
    </div>
    
    <input v-model="email" type="email" placeholder="Email" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem;" />
    <input v-model="password" type="password" placeholder="Password" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem;" />
    
    <button @click="login" :disabled="loading" style="width: 100%; padding: 12px; background: #0f172a; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 15px;">
      {{ loading ? 'Logging in...' : 'LOGIN' }}
    </button>
    
    <p style="text-align: center; margin-top: 20px;">
      Don't have an account? <router-link to="/register" style="color: #0f172a;">Register</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const login = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await axios.post('http://localhost:5004/api/admin/login', {
      email: email.value,
      password: password.value
    })
    
    if (response.data.success === true) {
      // Convert admin object to user object for consistent store
      const userData = {
        id: response.data.admin?.id || 1,
        name: response.data.admin?.name || 'Admin',
        email: response.data.admin?.email || email.value,
        role: 'admin'
      }
      authStore.setUser(userData)
      authStore.setToken('dummy-token-' + Date.now())
      success.value = 'Login successful! Redirecting...'
      setTimeout(() => router.push('/'), 1000)
    } else {
      error.value = response.data.message || 'Invalid credentials'
    }
  } catch (err) {
    console.error('Login error:', err)
    if (err.response) {
      error.value = err.response.data?.message || 'Invalid credentials'
    } else if (err.request) {
      error.value = 'Cannot connect to backend. Make sure it is running on port 5004.'
    } else {
      error.value = 'Login failed. Try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  background: white;
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.2);
  animation: fadeInUp 0.6s ease;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.login-btn {
  background: linear-gradient(90deg, #f093fb, #f5576c);
  transition: transform 0.2s ease;
}
.login-btn:hover {
  transform: scale(1.02);
}
</style>
