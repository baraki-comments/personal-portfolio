<template>
  <div style="max-width: 800px; margin: 40px auto; padding: 30px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
    <h2 style="color: #0f172a; margin-bottom: 20px;">Blogs Management</h2>
    
    <button @click="showForm = !showForm" style="background: #22c55e; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 20px;">Create Blog</button>
    
    <div v-if="showForm" style="border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
      <h3>{{ editing ? 'Edit Blog' : 'New Blog' }}</h3>
      <input v-model="form.title" placeholder="Title" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #e2e8f0; border-radius: 8px;" />
      <input v-model="form.tags" placeholder="Tags (comma separated)" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #e2e8f0; border-radius: 8px;" />
      <textarea v-model="form.content" placeholder="Content (HTML supported)" rows="6" style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #e2e8f0; border-radius: 8px;"></textarea>
      <button @click="saveBlog" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; margin-right: 10px;">Save</button>
      <button @click="showForm = false" style="background: #64748b; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">Cancel</button>
    </div>
    
    <div v-for="b in blogs" :key="b.id" style="border: 1px solid #e2e8f0; margin: 15px 0; padding: 15px; border-radius: 12px;">
      <h3 style="color: #0f172a;">{{ b.title }}</h3>
      <p><strong>Tags:</strong> {{ b.tags }}</p>
      <p><strong>Date:</strong> {{ new Date(b.created_at).toLocaleDateString() }}</p>
      <div v-html="b.content.substring(0, 200) + '...'" style="color: #64748b;"></div>
      <div style="margin-top: 10px;">
        <button @click="editBlog(b)" style="background: #3b82f6; color: white; padding: 6px 15px; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">Edit</button>
        <button @click="deleteBlog(b.id)" style="background: #ef4444; color: white; padding: 6px 15px; border: none; border-radius: 6px; cursor: pointer;">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5004/api' })
const blogs = ref([])
const showForm = ref(false)
const editing = ref(false)
const form = ref({ id: null, title: '', content: '', tags: '' })

const loadBlogs = async () => {
  const res = await api.get('/blogs')
  blogs.value = res.data
}

const saveBlog = async () => {
  if (editing.value) await api.put(`/blogs/${form.value.id}`, { title: form.value.title, content: form.value.content, tags: form.value.tags })
  else await api.post('/blogs', { title: form.value.title, content: form.value.content, tags: form.value.tags })
  showForm.value = false
  editing.value = false
  form.value = { id: null, title: '', content: '', tags: '' }
  loadBlogs()
}

const editBlog = (b) => {
  editing.value = true
  form.value = { ...b }
  showForm.value = true
}

const deleteBlog = async (id) => {
  if (confirm('Delete this blog?')) {
    await api.delete(`/blogs/${id}`)
    loadBlogs()
  }
}

onMounted(() => loadBlogs())
</script>

<style scoped>
.blogs-mgmt-container {
  background: #fef9f1;
  min-height: 100vh;
}
.blog-item {
  transition: all 0.3s ease;
}
.blog-item:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}
.create-btn {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}
</style>
