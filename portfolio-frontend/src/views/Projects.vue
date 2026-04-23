<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
    <h1 style="text-align: center; color: #0f172a; margin-bottom: 40px;">My Projects</h1>
    
    <div v-if="loading" style="text-align: center; padding: 50px;">
      <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #ccc; border-top-color: #0f172a; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <p>Loading projects...</p>
    </div>

    <div v-else-if="error" style="text-align: center; padding: 50px; color: red;">
      <p>{{ error }}</p>
      <button @click="loadProjects" style="margin-top: 10px; padding: 8px 16px; background: #0f172a; color: white; border: none; border-radius: 5px; cursor: pointer;">Retry</button>
    </div>

    <div v-else class="projects-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px;">
      <div v-for="project in projects" :key="project.id" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.08); transition: transform 0.3s ease;">
        <img 
          :src="getImageUrl(project.image)" 
          @error="handleImageError"
          style="width: 100%; height: 200px; object-fit: cover;"
        >
        <div style="padding: 20px;">
          <h3 style="color: #0f172a; margin-bottom: 10px;">{{ project.title }}</h3>
          <p style="color: #64748b; margin-bottom: 15px;">{{ project.description }}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
            <span v-for="tech in getTechnologies(project.technologies)" :key="tech" style="background: #e2e8f0; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">{{ tech }}</span>
          </div>
          <div style="display: flex; gap: 15px;">
            <a :href="project.github_link" target="_blank" style="background: #0f172a; color: white; padding: 8px 16px; text-decoration: none; border-radius: 8px;">GitHub</a>
            <a :href="project.demo_link" target="_blank" style="background: #0f172a; color: white; padding: 8px 16px; text-decoration: none; border-radius: 8px;">Live Demo</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const projects = ref([])
const loading = ref(true)
const error = ref('')

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/350x200?text=No+Image'
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:5004${imagePath}`
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/350x200?text=Image+Not+Found'
}

const getTechnologies = (tech) => {
  if (!tech) return []
  if (typeof tech === 'string') {
    return tech.split(',').map(t => t.trim())
  }
  return []
}

const loadProjects = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get('http://localhost:5004/api/projects')
    projects.value = res.data
  } catch (err) {
    console.error('Failed to load projects:', err)
    error.value = 'Failed to load projects. Make sure backend is running.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProjects()
})
</script>

<style>
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<style scoped>
.projects-container {
  background: linear-gradient(145deg, #e0eafc 0%, #cfdef3 100%);
  min-height: 100vh;
}
.project-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
}
.project-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 25px 40px rgba(0,0,0,0.15);
}
.project-image {
  transition: transform 0.5s ease;
}
.project-card:hover .project-image {
  transform: scale(1.05);
}
.tech-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
}
</style>
