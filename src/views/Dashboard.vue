<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Admin Dashboard</h1>
      </v-col>
    </v-row>
    
    <!-- Statistics Cards -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card color="primary" dark>
          <v-card-text>
            <div class="text-h3">{{ stats.projects }}</div>
            <div>Projects</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card color="success" dark>
          <v-card-text>
            <div class="text-h3">{{ stats.blogs }}</div>
            <div>Blogs</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card color="info" dark>
          <v-card-text>
            <div class="text-h3">{{ stats.skills }}</div>
            <div>Skills</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card color="warning" dark>
          <v-card-text>
            <div class="text-h3">{{ stats.messages }}</div>
            <div>Messages</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Tabs for Management -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-tabs v-model="tab">
          <v-tab value="profile">Profile</v-tab>
          <v-tab value="skills">Skills</v-tab>
          <v-tab value="projects">Projects</v-tab>
          <v-tab value="blogs">Blogs</v-tab>
          <v-tab value="messages">Messages</v-tab>
        </v-tabs>
        
        <v-window v-model="tab">
          <!-- Profile Tab -->
          <v-window-item value="profile">
            <ProfileManager />
          </v-window-item>
          
          <!-- Skills Tab -->
          <v-window-item value="skills">
            <SkillsManager />
          </v-window-item>
          
          <!-- Projects Tab -->
          <v-window-item value="projects">
            <ProjectsManager />
          </v-window-item>
          
          <!-- Blogs Tab -->
          <v-window-item value="blogs">
            <BlogsManager />
          </v-window-item>
          
          <!-- Messages Tab -->
          <v-window-item value="messages">
            <MessagesManager />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProfileManager from '@/components/ProfileManager.vue'
import SkillsManager from '@/components/SkillsManager.vue'
import ProjectsManager from '@/components/ProjectsManager.vue'
import BlogsManager from '@/components/BlogsManager.vue'
import MessagesManager from '@/components/MessagesManager.vue'
import { projectsAPI, blogsAPI, skillsAPI, messagesAPI } from '@/services/api'

const tab = ref('profile')
const stats = ref({
  projects: 0,
  blogs: 0,
  skills: 0,
  messages: 0
})

onMounted(async () => {
  try {
    const [projects, blogs, skills, messages] = await Promise.all([
      projectsAPI.getAll(),
      blogsAPI.getMyBlogs(),
      skillsAPI.getAll(),
      messagesAPI.getAll()
    ])
    
    stats.value = {
      projects: projects.data.length,
      blogs: blogs.data.length,
      skills: skills.data.length,
      messages: messages.data.length
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
})
</script>