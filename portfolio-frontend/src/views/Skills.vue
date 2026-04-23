<template>
  <v-container>
    <h1 class="text-h4 mb-6">My Skills</h1>
    <v-row>
      <v-col v-for="skill in skills" :key="skill.id" cols="12" md="6" lg="4">
        <v-card>
          <v-card-title>{{ skill.skill_name }}</v-card-title>
          <v-card-text>
            <v-progress-linear :model-value="skill.level" height="20" class="mt-2"></v-progress-linear>
            <span class="text-caption">{{ skill.level }}%</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { skillsAPI } from '../services/api'

const skills = ref([])

onMounted(async () => {
  try {
    const response = await skillsAPI.getAll()
    skills.value = response.data
  } catch (error) {
    console.error('Failed to load skills:', error)
  }
})
</script>

<style scoped>
.v-container {
  background: linear-gradient(135deg, #141e30, #243b55);
  min-height: 100vh;
  padding: 20px;
}
h1 {
  color: white;
  text-shadow: 0 2px 5px rgba(0,0,0,0.3);
  font-weight: 800;
}
.v-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 28px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.v-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 35px -10px rgba(0,0,0,0.4);
  background: rgba(255,255,255,0.2);
}
.v-card-title {
  color: #ffd966;
  font-weight: bold;
}
.v-progress-linear {
  border-radius: 20px;
  overflow: hidden;
}
</style>
