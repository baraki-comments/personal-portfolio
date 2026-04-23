<template>
  <div>
    <nav style="background: #0f172a; padding: 1rem 2rem; display: flex; gap: 1.5rem; flex-wrap: wrap;">
      <router-link to="/" style="color: white; text-decoration: none;">HOME</router-link>
      <router-link to="/projects" style="color: white; text-decoration: none;">PROJECTS</router-link>
      <router-link to="/blogs" style="color: white; text-decoration: none;">BLOG</router-link>
      <router-link to="/skills" style="color: white; text-decoration: none;">SKILLS</router-link>
      <router-link to="/contact" style="color: white; text-decoration: none;">CONTACT</router-link>
      <router-link v-if="!isAuthenticated" to="/login" style="color: white; text-decoration: none;">LOGIN</router-link>
      <router-link v-if="!isAuthenticated" to="/register" style="color: white; text-decoration: none;">REGISTER</router-link>
      <router-link v-if="isAuthenticated" to="/dashboard" style="color: white; text-decoration: none;">DASHBOARD</router-link>
      <a v-if="isAuthenticated" @click="logout" style="color: white; text-decoration: none; cursor: pointer;">LOGOUT</a>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = ref(false)

const checkAuth = () => {
  isAuthenticated.value = !!localStorage.getItem('user')
}

const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  isAuthenticated.value = false
  router.push('/login')
}

onMounted(() => {
  checkAuth()
  window.addEventListener('storage', checkAuth)
})
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; background: #f5f7fb; }
</style>
