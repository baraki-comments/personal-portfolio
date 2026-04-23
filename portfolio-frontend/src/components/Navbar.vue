<template>
  <v-app-bar color="primary" dark prominent>
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
    <v-toolbar-title>My Portfolio</v-toolbar-title>
    <v-spacer></v-spacer>
    <div class="d-none d-md-flex align-center">
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/projects">Projects</v-btn>
      <v-btn text to="/blogs">Blog</v-btn>
      <v-btn text @click="scrollToSkills">Skills</v-btn>
      <v-btn text to="/contact">Contact</v-btn>
      <v-btn v-if="!isAuthenticated" text to="/login">Login</v-btn>
      <v-btn v-if="!isAuthenticated" text to="/register">Register</v-btn>
      <v-btn v-if="isAuthenticated" text to="/dashboard">Dashboard</v-btn>
      <v-btn v-if="isAuthenticated" text @click="handleLogout">Logout</v-btn>
    </div>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item to="/">Home</v-list-item>
      <v-list-item to="/projects">Projects</v-list-item>
      <v-list-item to="/blogs">Blog</v-list-item>
      <v-list-item @click="scrollToSkills">Skills</v-list-item>
      <v-list-item to="/contact">Contact</v-list-item>
      <v-list-item v-if="!isAuthenticated" to="/login">Login</v-list-item>
      <v-list-item v-if="!isAuthenticated" to="/register">Register</v-list-item>
      <v-list-item v-if="isAuthenticated" to="/dashboard">Dashboard</v-list-item>
      <v-list-item v-if="isAuthenticated" @click="handleLogout">Logout</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const drawer = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const isAuthenticated = authStore.isAuthenticated

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const scrollToSkills = () => {
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        const el = document.getElementById('skills-section')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    })
  } else {
    const el = document.getElementById('skills-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
