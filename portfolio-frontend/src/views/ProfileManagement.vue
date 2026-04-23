<template>
  <div style="max-width: 800px; margin: 40px auto; padding: 30px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
    <h2 style="color: #0f172a; margin-bottom: 20px;">Profile Management</h2>
    <div v-if="message" :style="{color: isError ? 'red' : 'green', marginBottom: '15px'}">{{ message }}</div>
    
    <div style="text-align: center; margin-bottom: 20px;">
      <img :src="profilePhotoUrl" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #0f172a;">
    </div>
    
    <input v-model="profile.name" placeholder="Full Name" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 8px;" />
    <textarea v-model="profile.bio" placeholder="Bio" rows="3" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 8px;"></textarea>
    <textarea v-model="profile.education" placeholder="Education" rows="3" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 8px;"></textarea>
    
    <div style="margin: 10px 0;">
      <label>Profile Photo:</label>
      <input type="file" @change="uploadPhoto" accept="image/*" style="display: block; margin-top: 5px;" />
    </div>
    
    <div style="margin: 10px 0;">
      <label>CV/Resume (PDF):</label>
      <input type="file" @change="uploadCV" accept=".pdf" style="display: block; margin-top: 5px;" />
    </div>
    
    <button @click="updateProfile" style="width: 100%; padding: 12px; background: #0f172a; color: white; border: none; border-radius: 8px; margin-top: 20px; cursor: pointer;">Update Profile</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const api = axios.create({ baseURL: 'http://localhost:5004/api' })
const profile = ref({ name: '', bio: '', education: '', profile_photo: '' })
const message = ref('')
const isError = ref(false)

const profilePhotoUrl = computed(() => {
  if (profile.value.profile_photo) return `http://localhost:5004${profile.value.profile_photo}`
  return 'https://via.placeholder.com/120'
})

const loadProfile = async () => {
  const res = await api.get('/profile')
  profile.value = res.data
}

const updateProfile = async () => {
  const fd = new FormData()
  fd.append('name', profile.value.name)
  fd.append('bio', profile.value.bio || '')
  fd.append('education', profile.value.education || '')
  
  try {
    await api.put('/profile', fd)
    message.value = 'Profile updated! Redirecting to home...'
    isError.value = false
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch {
    message.value = 'Update failed'
    isError.value = true
  }
}

const uploadPhoto = async (e) => {
  const fd = new FormData()
  fd.append('profile_photo', e.target.files[0])
  fd.append('name', profile.value.name)
  fd.append('bio', profile.value.bio)
  fd.append('education', profile.value.education)
  await api.put('/profile', fd)
  loadProfile()
}

const uploadCV = async (e) => {
  const fd = new FormData()
  fd.append('cv', e.target.files[0])
  await api.put('/profile', fd)
}

onMounted(() => loadProfile())
</script>

<style scoped>
.profile-container {
  background: linear-gradient(145deg, #e0eafc 0%, #f5f7fa 100%);
  min-height: 100vh;
}
.profile-card {
  background: white;
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}
.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 50px rgba(0,0,0,0.15);
}
.profile-image {
  border: 4px solid white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}
.profile-image:hover {
  transform: scale(1.05);
}
.update-btn {
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: all 0.3s ease;
}
.update-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
</style>
