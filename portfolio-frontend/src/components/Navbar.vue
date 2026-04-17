<template>
  <v-app-bar color="primary" dark prominent>
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
    
    <v-toolbar-title>My Portfolio</v-toolbar-title>
    
    <v-spacer></v-spacer>
    
    <v-btn text to="/" class="d-none d-md-flex">Home</v-btn>
    <v-btn text to="/projects" class="d-none d-md-flex">Projects</v-btn>
    <v-btn text to="/blogs" class="d-none d-md-flex">Blog</v-btn>
    <v-btn text to="/contact" class="d-none d-md-flex">Contact</v-btn>
    
    <v-btn v-if="!isAuthenticated" text to="/login" class="ml-2">Login</v-btn>
    <v-btn v-if="!isAuthenticated" text to="/register" class="ml-2">Register</v-btn>
    
    <v-menu v-if="isAuthenticated">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar size="32">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/dashboard">
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleLogout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
  
  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item to="/">
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-list-item to="/projects">
        <v-list-item-title>Projects</v-list-item-title>
      </v-list-item>
      <v-list-item to="/blogs">
        <v-list-item-title>Blog</v-list-item-title>
      </v-list-item>
      <v-list-item to="/contact">
        <v-list-item-title>Contact</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
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
</script>