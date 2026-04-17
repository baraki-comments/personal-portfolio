<template>
  <v-app>
    <v-app-bar color="primary" dark>...</v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>