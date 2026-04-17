<template>
  <v-container>
    <h1 class="text-h4 mb-6">Blog Posts</h1>
    <v-row>
      <v-col v-for="blog in blogs" :key="blog.id" cols="12" md-8 offset-md-2>
        <v-card class="mb-4">
          <v-card-title>{{ blog.title }}</v-card-title>
          <v-card-subtitle>
            Posted on {{ formatDate(blog.created_at) }} | Tags: {{ blog.tags }}
          </v-card-subtitle>
          <v-card-text>
            <div v-html="blog.content"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { blogsAPI } from '@/services/api'

const blogs = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(async () => {
  try {
    const response = await blogsAPI.getAll()
    blogs.value = response.data
  } catch (error) {
    console.error('Failed to load blogs:', error)
  }
})
</script>