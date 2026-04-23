<template>
  <v-container>
    <v-card color="primary" dark class="mb-6">
      <v-card-title class="text-h4">Profile</v-card-title>
      <v-card-subtitle>{{ isLoggedIn ? 'Manage your personal information' : 'View Profile Information' }}</v-card-subtitle>
    </v-card>

    <v-row>
      <!-- Profile Photo Section -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Profile Photo</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center">
            <!-- Display uploaded photo -->
            <v-avatar size="150" class="mb-4">
              <v-img 
                :src="photoUrl" 
                alt="Profile Photo" 
                cover
                @error="handleImageError"
              >
                <template v-slot:placeholder>
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </template>
              </v-img>
            </v-avatar>
            
            <!-- Show current photo filename -->
            <div v-if="user?.profile_photo && user.profile_photo !== 'default.png'" class="mb-2">
              <v-chip color="success" size="small">
                <v-icon start>mdi-check-circle</v-icon>
                Photo Uploaded
              </v-chip>
            </div>
            
            <!-- Only Admin (logged in) can upload photo -->
            <v-file-input
              v-if="isLoggedIn"
              v-model="photoFile"
              label="Upload Photo"
              accept="image/*"
              prepend-icon="mdi-camera"
              @update:model-value="previewPhoto"
            ></v-file-input>
            
            <v-img v-if="photoPreview" :src="photoPreview" max-height="100" contain class="mt-2"></v-img>
            
            <v-btn 
              v-if="isLoggedIn && photoFile"
              color="primary" 
              :loading="uploadingPhoto"
              @click="uploadPhoto"
              block
            >
              Upload Photo
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- CV Section -->
        <v-card class="mt-4">
          <v-card-title>CV / Resume</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center">
            <v-icon size="48" color="primary">mdi-file-pdf</v-icon>
            
            <div v-if="user?.cv_url" class="mt-2">
              <v-chip color="success" variant="outlined">
                <v-icon start>mdi-check-circle</v-icon>
                CV Uploaded: {{ getFileName(user.cv_url) }}
              </v-chip>
              <div class="mt-2">
                <a :href="`http://localhost:5004/uploads/${user.cv_url}`" target="_blank">
                  <v-btn color="primary" variant="outlined">
                    <v-icon start>mdi-download</v-icon> Download CV
                  </v-btn>
                </a>
              </div>
            </div>
            <p v-else class="text-grey mt-2">No CV uploaded</p>
            
            <!-- Only Admin (logged in) can upload CV -->
            <v-file-input
              v-if="isLoggedIn"
              v-model="cvFile"
              label="Upload CV (PDF/DOC)"
              accept=".pdf,.doc,.docx"
              prepend-icon="mdi-upload"
              class="mt-3"
            ></v-file-input>
            
            <v-btn 
              v-if="isLoggedIn && cvFile"
              color="primary" 
              :loading="uploadingCV"
              @click="uploadCV"
              block
            >
              Upload CV
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Personal Information -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Personal Information</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <!-- Admin (logged in) can edit -->
            <v-form v-if="isLoggedIn" @submit.prevent="updateProfile">
              <v-text-field v-model="form.name" label="Full Name"></v-text-field>
              <v-text-field v-model="form.email" label="Email" type="email"></v-text-field>
              <v-textarea v-model="form.bio" label="Bio" rows="3"></v-textarea>
              <v-textarea v-model="form.education" label="Education" rows="2"></v-textarea>
              <v-text-field v-model="form.phone" label="Phone"></v-text-field>
              <v-text-field v-model="form.location" label="Location"></v-text-field>
              <v-text-field v-model="form.github" label="GitHub URL"></v-text-field>
              <v-text-field v-model="form.linkedin" label="LinkedIn URL"></v-text-field>
              <v-btn type="submit" color="primary" :loading="updatingProfile">Save Changes</v-btn>
            </v-form>
            
            <!-- View only for users (not logged in) -->
            <div v-else>
              <v-list>
                <v-list-item><strong>Full Name:</strong> {{ user?.name || 'Not set' }}</v-list-item>
                <v-list-item><strong>Email:</strong> {{ user?.email || 'Not set' }}</v-list-item>
                <v-list-item><strong>Bio:</strong> {{ user?.bio || 'Not set' }}</v-list-item>
                <v-list-item><strong>Education:</strong> {{ user?.education || 'Not set' }}</v-list-item>
                <v-list-item><strong>Phone:</strong> {{ user?.phone || 'Not set' }}</v-list-item>
                <v-list-item><strong>Location:</strong> {{ user?.location || 'Not set' }}</v-list-item>
                <v-list-item><strong>GitHub:</strong> {{ user?.github || 'Not set' }}</v-list-item>
                <v-list-item><strong>LinkedIn:</strong> {{ user?.linkedin || 'Not set' }}</v-list-item>
              </v-list>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Preview Section -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Profile Preview</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="2" class="text-center">
                <v-avatar size="80">
                  <v-img :src="photoUrl" alt="Profile"></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="12" md="10">
                <h3>{{ user?.name || 'Your Name' }}</h3>
                <p><v-icon size="small">mdi-email</v-icon> {{ user?.email || 'Not set' }}</p>
                <p><v-icon size="small">mdi-phone</v-icon> {{ user?.phone || 'Not set' }}</p>
                <p><v-icon size="small">mdi-map-marker</v-icon> {{ user?.location || 'Not set' }}</p>
                <p v-if="user?.cv_url">
                  <v-icon size="small">mdi-file-pdf</v-icon> 
                  <a :href="`http://localhost:5004/uploads/${user.cv_url}`" target="_blank">Download CV</a>
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()
const user = ref(null)
const updatingProfile = ref(false)
const uploadingPhoto = ref(false)
const uploadingCV = ref(false)
const photoFile = ref(null)
const cvFile = ref(null)
const photoPreview = ref(null)

const snackbar = ref({ show: false, message: '', color: 'success' })

const form = ref({
  name: '', email: '', bio: '', education: '', phone: '', location: '', github: '', linkedin: ''
})

// Check if user is logged in (Admin)
const isLoggedIn = computed(() => authStore.isAuthenticated)

const getFileName = (path) => {
  if (!path) return ''
  return path.split('-').slice(1).join('-') || path
}

const handleImageError = (e) => {
  console.log('Image failed to load:', e.target.src)
  e.target.src = 'https://via.placeholder.com/150?text=Profile'
}

const photoUrl = computed(() => {
  if (user.value?.profile_photo && user.value.profile_photo !== 'default.png') {
    return `http://localhost:5004/uploads/${user.value.profile_photo}`
  }
  return 'https://via.placeholder.com/150?text=Profile'
})

const previewPhoto = (file) => {
  if (file) {
    photoPreview.value = URL.createObjectURL(file)
  }
}

const loadUser = async () => {
  try {
    let userData
    if (isLoggedIn.value) {
      const res = await api.get('/auth/me')
      userData = res.data
    } else {
      // For public view, get user ID 1 (admin profile)
      const res = await api.get('/users/profile/1')
      userData = res.data
    }
    user.value = userData
    console.log('Loaded user:', userData)
    
    form.value = {
      name: userData?.name || '',
      email: userData?.email || '',
      bio: userData?.bio || '',
      education: userData?.education || '',
      phone: userData?.phone || '',
      location: userData?.location || '',
      github: userData?.github || '',
      linkedin: userData?.linkedin || ''
    }
  } catch (error) {
    console.error('Error loading user:', error)
  }
}

const updateProfile = async () => {
  if (!isLoggedIn.value) return
  updatingProfile.value = true
  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('email', form.value.email)
    formData.append('bio', form.value.bio)
    formData.append('education', form.value.education)
    formData.append('phone', form.value.phone)
    formData.append('location', form.value.location)
    formData.append('github', form.value.github)
    formData.append('linkedin', form.value.linkedin)
    
    const response = await api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    console.log('Update response:', response.data)
    snackbar.value = { show: true, message: 'Profile updated!', color: 'success' }
    await loadUser()
    if (authStore.fetchUser) authStore.fetchUser()
  } catch (error) {
    console.error('Update error:', error)
    snackbar.value = { show: true, message: 'Update failed', color: 'error' }
  } finally {
    updatingProfile.value = false
  }
}

const uploadPhoto = async () => {
  if (!photoFile.value) return
  uploadingPhoto.value = true
  try {
    const formData = new FormData()
    formData.append('profile_photo', photoFile.value)
    
    const response = await api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    console.log('Photo upload response:', response.data)
    snackbar.value = { show: true, message: 'Photo uploaded!', color: 'success' }
    await loadUser()
    if (authStore.fetchUser) authStore.fetchUser()
    photoFile.value = null
    photoPreview.value = null
  } catch (error) {
    console.error('Upload error:', error)
    snackbar.value = { show: true, message: 'Upload failed', color: 'error' }
  } finally {
    uploadingPhoto.value = false
  }
}

const uploadCV = async () => {
  if (!cvFile.value) return
  uploadingCV.value = true
  try {
    const formData = new FormData()
    formData.append('cv', cvFile.value)
    
    const response = await api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    console.log('CV upload response:', response.data)
    snackbar.value = { show: true, message: 'CV uploaded!', color: 'success' }
    await loadUser()
    cvFile.value = null
  } catch (error) {
    console.error('CV upload error:', error)
    snackbar.value = { show: true, message: 'CV upload failed', color: 'error' }
  } finally {
    uploadingCV.value = false
  }
}

onMounted(() => {
  loadUser()
})
</script>
