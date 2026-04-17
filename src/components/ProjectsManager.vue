<template>
  <v-card class="mt-4">
    <v-card-title>
      Projects Management
      <v-spacer />
      <v-btn color="primary" @click="dialog = true">Add Project</v-btn>
    </v-card-title>
    
    <v-card-text>
      <v-row>
        <v-col v-for="project in projects" :key="project.id" cols="12" md="6" lg="4">
          <v-card>
            <v-img :src="project.image || 'https://via.placeholder.com/300x200'" height="200" cover />
            <v-card-title>{{ project.title }}</v-card-title>
            <v-card-subtitle>{{ project.technologies }}</v-card-subtitle>
            <v-card-text>
              {{ project.description }}
            </v-card-text>
            <v-card-actions>
              <v-btn :href="project.github_link" target="_blank" icon>
                <v-icon>mdi-github</v-icon>
              </v-btn>
              <v-btn :href="project.demo_link" target="_blank" icon>
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
              <v-spacer />
              <v-btn icon @click="editProject(project)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteProject(project.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    
    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>{{ editing ? 'Edit Project' : 'Add Project' }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="projectForm.title"
              label="Project Title"
              required
            />
            <v-textarea
              v-model="projectForm.description"
              label="Description"
              rows="3"
            />
            <v-text-field
              v-model="projectForm.technologies"
              label="Technologies (comma separated)"
            />
            <v-text-field
              v-model="projectForm.github_link"
              label="GitHub Link"
            />
            <v-text-field
              v-model="projectForm.demo_link"
              label="Live Demo Link"
            />
            <v-file-input
              accept="image/*"
              label="Project Screenshot"
              @change="handleImageUpload"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveProject">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { projectsAPI } from '@/services/api'

const projects = ref([])
const dialog = ref(false)
const editing = ref(false)
const projectForm = ref({
  id: null,
  title: '',
  description: '',
  technologies: '',
  github_link: '',
  demo_link: '',
  image: null
})

const loadProjects = async () => {
  try {
    const response = await projectsAPI.getAll()
    projects.value = response.data
  } catch (error) {
    console.error('Failed to load projects:', error)
  }
}

const handleImageUpload = (file) => {
  projectForm.value.image = file
}

const saveProject = async () => {
  const formData = new FormData()
  formData.append('title', projectForm.value.title)
  formData.append('description', projectForm.value.description)
  formData.append('technologies', projectForm.value.technologies)
  formData.append('github_link', projectForm.value.github_link)
  formData.append('demo_link', projectForm.value.demo_link)
  
  if (projectForm.value.image) {
    formData.append('image', projectForm.value.image)
  }
  
  try {
    if (editing.value) {
      await projectsAPI.update(projectForm.value.id, formData)
    } else {
      await projectsAPI.create(formData)
    }
    await loadProjects()
    dialog.value = false
    resetForm()
  } catch (error) {
    alert('Failed to save project')
  }
}

const editProject = (project) => {
  editing.value = true
  projectForm.value = { ...project, image: null }
  dialog.value = true
}

const deleteProject = async (id) => {
  if (confirm('Are you sure?')) {
    try {
      await projectsAPI.delete(id)
      await loadProjects()
    } catch (error) {
      alert('Failed to delete project')
    }
  }
}

const resetForm = () => {
  editing.value = false
  projectForm.value = {
    id: null,
    title: '',
    description: '',
    technologies: '',
    github_link: '',
    demo_link: '',
    image: null
  }
}

onMounted(loadProjects)
</script>