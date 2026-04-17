<template>
  <v-card class="mt-4">
    <v-card-title>Profile Settings</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="updateProfile">
        <v-text-field
          v-model="form.name"
          label="Full Name"
          required
        />
        
        <v-textarea
          v-model="form.bio"
          label="Bio"
          rows="4"
        />
        
        <v-textarea
          v-model="form.education"
          label="Education"
          rows="4"
        />
        
        <v-file-input
          accept="image/*"
          label="Profile Photo"
          @change="handlePhotoUpload"
        />
        
        <v-file-input
          accept=".pdf"
          label="CV/Resume (PDF)"
          @change="handleCVUpload"
        />
        
        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
        >
          Update Profile
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { profileAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const form = ref({
  name: '',
  bio: '',
  education: '',
  profile_photo: null,
  cv: null
})

const handlePhotoUpload = (file) => {
  form.value.profile_photo = file
}

const handleCVUpload = (file) => {
  form.value.cv = file
}

const updateProfile = async () => {
  loading.value = true
  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('bio', form.value.bio)
  formData.append('education', form.value.education)
  
  if (form.value.profile_photo) {
    formData.append('profile_photo', form.value.profile_photo)
  }
  if (form.value.cv) {
    formData.append('cv', form.value.cv)
  }
  
  try {
    const response = await profileAPI.updateProfile(formData)
    authStore.user = response.data.user
    alert('Profile updated successfully!')
  } catch (error) {
    alert('Failed to update profile')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const response = await profileAPI.getProfile()
    form.value = {
      name: response.data.name,
      bio: response.data.bio || '',
      education: response.data.education || '',
      profile_photo: null,
      cv: null
    }
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
})
</script>