<template>
  <v-container>
    <h1 class="text-h4 mb-6">My Projects</h1>
    <v-row>
      <v-col v-for="project in projects" :key="project.id" cols="12" md="6" lg="4">
        <v-card>
          <v-img :src="project.image || 'https://via.placeholder.com/300x200'" height="200" cover />
          <v-card-title>{{ project.title }}</v-card-title>
          <v-card-subtitle>{{ project.technologies }}</v-card-subtitle>
          <v-card-text>{{ project.description }}</v-card-text>
          <v-card-actions>
            <v-btn :href="project.github_link" target="_blank" color="primary" variant="text">
              GitHub
            </v-btn>
            <v-btn :href="project.demo_link" target="_blank" color="primary" variant="text">
              Live Demo
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { projectsAPI } from '@/services/api'

const projects = ref([])

onMounted(async () => {
  try {
    const response = await projectsAPI.getAll()
    projects.value = response.data
  } catch (error) {
    console.error('Failed to load projects:', error)
  }
})
</script>