<template>
  <div style="max-width: 800px; margin: 40px auto; padding: 30px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
    <h2 style="color: #0f172a; margin-bottom: 20px;">Projects Management</h2>
    
    <div v-if="message" :style="{color: isError ? 'red' : 'green', marginBottom: '15px'}">{{ message }}</div>
    
    <button @click="openAddForm" style="background: #22c55e; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 20px;">Add Project</button>
    
    <div v-if="showForm" style="border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
      <h3>{{ editing ? 'Edit Project' : 'New Project' }}</h3>
      <input v-model="form.title" placeholder="Title" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #e2e8f0; border-radius: 8px;" />
      <textarea v-model="form.description" placeholder="Description" rows="3" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #e2e8f0; border-radius: 8px;"></textarea>
      <input v-model="form.technologies" placeholder="Technologies (comma separated)" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #e2e8f0; border-radius: 8px;" />
      <input v-model="form.github_link" placeholder="GitHub Link" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #e2e8f0; border-radius: 8px;" />
      <input v-model="form.demo_link" placeholder="Demo Link" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #e2e8f0; border-radius: 8px;" />
      <input type="file" @change="handleImage" accept="image/*" style="margin: 8px 0;" />
      <button @click="saveProject" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; margin-right: 10px;">Save</button>
      <button @click="showForm = false" style="background: #64748b; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">Cancel</button>
    </div>
    
    <div v-for="p in projects" :key="p.id" style="border: 1px solid #e2e8f0; margin: 15px 0; padding: 15px; border-radius: 12px;">
      <h3 style="color: #0f172a;">{{ p.title }}</h3>
      <p style="color: #64748b;">{{ p.description }}</p>
      <p><strong>Tech:</strong> {{ p.technologies }}</p>
      <p><strong>GitHub:</strong> <a :href="p.github_link" target="_blank" style="color: #3b82f6;">{{ p.github_link || 'Not provided' }}</a></p>
      <p><strong>Demo:</strong> <a :href="p.demo_link" target="_blank" style="color: #3b82f6;">{{ p.demo_link || 'Not provided' }}</a></p>
      <img v-if="p.image" :src="'http://localhost:5004' + p.image" style="max-width: 200px; border-radius: 8px; margin: 10px 0;" />
      <div style="margin-top: 10px;">
        <button @click="editProject(p)" style="background: #3b82f6; color: white; padding: 6px 15px; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">Edit</button>
        <button @click="deleteProject(p.id)" style="background: #ef4444; color: white; padding: 6px 15px; border: none; border-radius: 6px; cursor: pointer;">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5004/api' })
const projects = ref([])
const showForm = ref(false)
const editing = ref(false)
const message = ref('')
const isError = ref(false)
const form = ref({ id: null, title: '', description: '', technologies: '', github_link: '', demo_link: '', imageFile: null })

const loadProjects = async () => {
  try {
    const res = await api.get('/projects')
    projects.value = res.data
  } catch (err) {
    console.error('Failed to load projects:', err)
  }
}

const openAddForm = () => {
  editing.value = false
  form.value = { id: null, title: '', description: '', technologies: '', github_link: '', demo_link: '', imageFile: null }
  showForm.value = true
}

const handleImage = (e) => { 
  if (e.target.files[0]) {
    form.value.imageFile = e.target.files[0]
  }
}

const saveProject = async () => {
  // Validate required fields
  if (!form.value.title) {
    message.value = 'Title is required'
    isError.value = true
    setTimeout(() => message.value = '', 3000)
    return
  }
  
  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('description', form.value.description || '')
  fd.append('technologies', form.value.technologies || '')
  fd.append('github_link', form.value.github_link || '')
  fd.append('demo_link', form.value.demo_link || '')
  if (form.value.imageFile) fd.append('image', form.value.imageFile)
  
  try {
    let response
    if (editing.value) {
      response = await api.put(`/projects/${form.value.id}`, fd)
    } else {
      response = await api.post('/projects', fd)
    }
    
    if (response.data.success || response.data.id) {
      message.value = editing.value ? 'Project updated successfully!' : 'Project added successfully!'
      isError.value = false
      setTimeout(() => message.value = '', 3000)
      showForm.value = false
      editing.value = false
      form.value = { id: null, title: '', description: '', technologies: '', github_link: '', demo_link: '', imageFile: null }
      await loadProjects()
    } else {
      message.value = response.data.error || 'Failed to save project'
      isError.value = true
      setTimeout(() => message.value = '', 3000)
    }
  } catch (err) {
    console.error('Save error:', err)
    message.value = err.response?.data?.error || 'Failed to save project. Check backend.'
    isError.value = true
    setTimeout(() => message.value = '', 3000)
  }
}

const editProject = (p) => {
  editing.value = true
  form.value = { 
    id: p.id, 
    title: p.title, 
    description: p.description, 
    technologies: p.technologies, 
    github_link: p.github_link, 
    demo_link: p.demo_link, 
    imageFile: null 
  }
  showForm.value = true
}

const deleteProject = async (id) => {
  if (confirm('Delete this project?')) {
    try {
      await api.delete(`/projects/${id}`)
      message.value = 'Project deleted successfully!'
      isError.value = false
      setTimeout(() => message.value = '', 3000)
      await loadProjects()
    } catch (err) {
      console.error('Delete error:', err)
      message.value = 'Failed to delete project'
      isError.value = true
      setTimeout(() => message.value = '', 3000)
    }
  }
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.projects-mgmt-container {
  background: #f0f2f5;
  min-height: 100vh;
}
.project-item {
  transition: all 0.3s ease;
}
.project-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.save-btn {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: all 0.3s ease;
}
.save-btn:hover {
  transform: translateY(-2px);
}
</style>
