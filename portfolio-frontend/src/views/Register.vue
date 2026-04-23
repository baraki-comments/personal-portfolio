<template>
  <div style="max-width: 400px; margin: 50px auto; padding: 30px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #0f172a; margin-bottom: 25px;">Create Account</h2>
    
    <div v-if="error" style="background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      {{ error }}
    </div>
    
    <div v-if="success" style="background: #dcfce7; color: #166534; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      {{ success }}
    </div>
    
    <input v-model="name" type="text" placeholder="Full Name" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem;" />
    <input v-model="email" type="email" placeholder="Email" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem;" />
    <input v-model="password" type="password" placeholder="Password" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem;" />
    
    <button @click="register" :disabled="loading" style="width: 100%; padding: 12px; background: #0f172a; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 15px;">
      {{ loading ? 'Registering...' : 'REGISTER' }}
    </button>
    
    <p style="text-align: center; margin-top: 20px;">
      Already have an account? <router-link to="/login" style="color: #0f172a;">Login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const register = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await axios.post('http://localhost:5004/api/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    
    if (response.data.success === true) {
      success.value = 'Registration successful! Redirecting to login...'
      setTimeout(() => router.push('/login'), 2000)
    } else {
      error.value = response.data.message || 'Registration failed'
    }
  } catch (err) {
    console.error('Registration error:', err)
    if (err.response) {
      error.value = err.response.data?.message || 'Registration failed'
    } else if (err.request) {
      error.value = 'Cannot connect to backend. Make sure it is running on port 5004.'
    } else {
      error.value = 'Registration failed. Try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register-card {
  background: white;
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.2);
  animation: slideIn 0.5s ease;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.register-btn {
  background: linear-gradient(90deg, #11998e, #38ef7d);
  transition: all 0.3s ease;
}
.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
</style>
