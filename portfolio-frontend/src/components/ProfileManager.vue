<template>
  <v-card class="mt-4"><v-card-title>Profile Settings</v-card-title><v-card-text><v-form @submit.prevent="updateProfile"><v-text-field v-model="form.name" label="Full Name" required /><v-textarea v-model="form.bio" label="Bio" rows="4" /><v-textarea v-model="form.education" label="Education" rows="4" /><v-file-input accept="image/*" label="Profile Photo" @change="(f) => form.profile_photo = f" /><v-file-input accept=".pdf" label="CV/Resume (PDF)" @change="(f) => form.cv = f" /><v-btn type="submit" color="primary" :loading="loading">Update Profile</v-btn></v-form></v-card-text></v-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { profileAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const loading = ref(false)
const form = ref({ name: '', bio: '', education: '', profile_photo: null, cv: null })
const updateProfile = async () => {
  loading.value = true
  const fd = new FormData()
  fd.append('name', form.value.name); fd.append('bio', form.value.bio); fd.append('education', form.value.education)
  if (form.value.profile_photo) fd.append('profile_photo', form.value.profile_photo)
  if (form.value.cv) fd.append('cv', form.value.cv)
  try { const res = await profileAPI.updateProfile(fd); authStore.user = res.data.user; alert('Profile updated!') } catch { alert('Failed to update') } finally { loading.value = false }
}
onMounted(async () => { try { const res = await profileAPI.getProfile(); form.value = { name: res.data.name, bio: res.data.bio || '', education: res.data.education || '', profile_photo: null, cv: null } } catch(e) { console.error(e) } })
</script>
