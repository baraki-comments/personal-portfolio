<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Create Account</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="name"
                label="Full Name"
                required
              />
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              />
              <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="handleRegister" :loading="loading">Register</v-btn>
          </v-card-actions>
          
          <v-card-text class="text-center">
            Already have an account? <router-link to="/login">Login</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value
  })
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.message
  }
  
  loading.value = false
}
</script>