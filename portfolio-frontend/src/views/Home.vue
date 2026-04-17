<template>
  <v-container>
    <!-- Hero Section -->
    <v-row class="text-center py-12">
      <v-col cols="12">
        <v-avatar size="150" class="mb-4">
          <v-img :src="user?.profile_photo || 'https://via.placeholder.com/150'" />
        </v-avatar>
        <h1 class="text-h2 font-weight-bold mb-2">{{ user?.name || 'Welcome' }}</h1>
        <p class="text-h6 text-grey-darken-1">Full Stack Developer</p>
      </v-col>
    </v-row>
    
    <!-- Bio Section -->
    <v-row class="mb-12">
      <v-col cols="12" md-8 offset-md-2>
        <v-card>
          <v-card-title class="text-h5">About Me</v-card-title>
          <v-card-text>
            <p class="text-body-1">{{ user?.bio || 'Add your bio in the dashboard' }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Education Section -->
    <v-row class="mb-12">
      <v-col cols="12" md-8 offset-md-2>
        <v-card>
          <v-card-title class="text-h5">Education</v-card-title>
          <v-card-text>
            <div v-html="user?.education || '<p>Add your education in the dashboard</p>'"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Skills Section -->
    <v-row>
      <v-col cols="12" md-8 offset-md-2>
        <v-card>
          <v-card-title class="text-h5">Skills</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="skill in skills" :key="skill.id">
                <v-list-item-title>{{ skill.skill_name }}</v-list-item-title>
                <v-progress-linear :model-value="skill.level" height="10" class="mt-2"></v-progress-linear>
                <span class="text-caption">{{ skill.level }}%</span>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { skillsAPI } from '@/services/api'

const authStore = useAuthStore()
const user = ref(authStore.user)
const skills = ref([])

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      const response = await skillsAPI.getAll()
      skills.value = response.data
    } catch (error) {
      console.error('Failed to load skills:', error)
    }
  }
})
</script>