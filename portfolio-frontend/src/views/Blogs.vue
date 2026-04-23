<template>
  <div class="blogs-page">
    <div style="max-width: 900px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="text-align: center; color: #0f172a; margin-bottom: 40px;">Blog Posts</h1>
      
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading blogs...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadBlogs" class="retry-btn">Retry</button>
      </div>

      <div v-else>
        <div v-for="blog in blogs" :key="blog.id" class="blog-card">
          <h2 class="blog-title">{{ blog.title }}</h2>
          <div class="blog-meta">
            <span>Tags: {{ blog.tags }}</span>
            <span>Date: {{ formatDate(blog.created_at) }}</span>
          </div>
          <div class="blog-content" v-html="blog.content"></div>
        </div>
        <div v-if="blogs.length === 0" class="no-blogs">
          No blog posts yet. Admin can add blogs from dashboard.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const blogs = ref([])
const loading = ref(true)
const error = ref('')

const formatDate = (date) => {
  if (!date) return 'No date'
  return new Date(date).toLocaleDateString()
}

const loadBlogs = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get('http://localhost:5004/api/blogs')
    blogs.value = res.data
  } catch (err) {
    console.error('Failed to load blogs:', err)
    error.value = 'Failed to load blogs. Make sure backend is running.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBlogs()
})
</script>

<style scoped>
.blogs-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}
.loading-spinner {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 24px;
}
.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.error-message {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 24px;
  color: #ef4444;
}
.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.blog-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}
.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}
.blog-title {
  color: #0f172a;
  margin-bottom: 10px;
  font-size: 1.5rem;
}
.blog-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.85rem;
  color: #94a3b8;
}
.blog-content {
  color: #334155;
  line-height: 1.7;
}
.no-blogs {
  text-align: center;
  color: #666;
  padding: 40px;
  background: white;
  border-radius: 24px;
}
</style>
