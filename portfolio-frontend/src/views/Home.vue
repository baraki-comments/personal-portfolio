<template>
  <div class="home-container">
    <div style="max-width: 900px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <img 
          :src="profilePhotoUrl" 
          @error="handleImageError"
          class="profile-image"
        >
        <h1 class="profile-name">{{ profile.name || 'Your Name' }}</h1>
        <p class="profile-bio">{{ profile.bio || 'Add your bio in the dashboard' }}</p>
      </div>

      <div class="education-card">
        <h2>Education</h2>
        <p>{{ profile.education || 'Add your education in the dashboard' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5004/api' })
const profile = ref({ name: '', bio: '', education: '', profile_photo: '' })

const profilePhotoUrl = computed(() => {
  if (profile.value.profile_photo) {
    return `http://localhost:5004${profile.value.profile_photo}`
  }
  return 'https://via.placeholder.com/150'
})

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/150'
}

const loadProfile = async () => {
  try {
    const res = await api.get('/profile')
    profile.value = res.data
  } catch (err) {
    console.error('Failed to load profile:', err)
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.home-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.profile-name {
  color: white;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 2rem;
}
.profile-bio {
  color: rgba(255,255,255,0.9);
  font-size: 1.1rem;
}
.education-card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}
.education-card h2 {
  color: #0f172a;
  border-left: 4px solid #0f172a;
  padding-left: 15px;
  margin-bottom: 15px;
}
.education-card p {
  color: #334155;
  line-height: 1.6;
}
</style>
