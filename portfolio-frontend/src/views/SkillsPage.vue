<template>
  <div class="skills-page">
    <div style="max-width: 900px; margin: 0 auto; padding: 40px 20px;">
      <h1 class="skills-title">My Skills</h1>
      
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading skills...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadSkills" class="retry-btn">Retry</button>
      </div>

      <div v-else class="skills-card">
        <div v-for="skill in skills" :key="skill.id" class="skill-item">
          <div class="skill-header">
            <span class="skill-name">{{ skill.skill_name }}</span>
            <span class="skill-percent">{{ skill.level }}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" :style="{ width: skill.level + '%' }"></div>
          </div>
        </div>
        <div v-if="skills.length === 0" class="no-skills">
          No skills added yet. Admin can add skills from dashboard.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const skills = ref([])
const loading = ref(true)
const error = ref('')

const loadSkills = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get('http://localhost:5004/api/skills')
    skills.value = res.data
  } catch (err) {
    console.error('Failed to load skills:', err)
    error.value = 'Failed to load skills. Make sure backend is running.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSkills()
})
</script>

<style scoped>
.skills-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
.skills-title {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}
.skills-card {
  background: white;
  padding: 35px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}
.skill-item {
  margin: 25px 0;
}
.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.skill-name {
  font-weight: bold;
  color: #0f172a;
}
.skill-percent {
  color: #64748b;
}
.progress-bar-bg {
  background: #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  height: 12px;
}
.progress-bar-fill {
  background: linear-gradient(90deg, #0f172a, #1e293b);
  height: 12px;
  border-radius: 20px;
  transition: width 0.5s ease;
}
.loading-spinner {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 24px;
}
.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.error-message {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 24px;
  color: #ef4444;
}
.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.no-skills {
  text-align: center;
  color: #666;
  padding: 20px;
}
</style>
