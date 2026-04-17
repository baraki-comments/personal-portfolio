<template>
  <v-card class="mt-4">
    <v-card-title>
      Blogs Management
      <v-spacer />
      <v-btn color="primary" @click="dialog = true">Create Blog</v-btn>
    </v-card-title>
    
    <v-card-text>
      <v-list>
        <v-list-item v-for="blog in blogs" :key="blog.id">
          <v-list-item-title>{{ blog.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ blog.tags }} | {{ formatDate(blog.created_at) }}</v-list-item-subtitle>
          <template v-slot:append>
            <v-btn icon variant="text" @click="editBlog(blog)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" @click="deleteBlog(blog.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
    
    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>{{ editing ? 'Edit Blog' : 'Create Blog' }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="blogForm.title"
            label="Blog Title"
            required
          />
          <v-text-field
            v-model="blogForm.tags"
            label="Tags (comma separated)"
          />
          <v-textarea
            v-model="blogForm.content"
            label="Blog Content (HTML supported)"
            rows="10"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveBlog">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { blogsAPI } from '@/services/api'

const blogs = ref([])
const dialog = ref(false)
const editing = ref(false)
const blogForm = ref({
  id: null,
  title: '',
  content: '',
  tags: ''
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const loadBlogs = async () => {
  try {
    const response = await blogsAPI.getMyBlogs()
    blogs.value = response.data
  } catch (error) {
    console.error('Failed to load blogs:', error)
  }
}

const saveBlog = async () => {
  try {
    if (editing.value) {
      await blogsAPI.update(blogForm.value.id, {
        title: blogForm.value.title,
        content: blogForm.value.content,
        tags: blogForm.value.tags
      })
    } else {
      await blogsAPI.create({
        title: blogForm.value.title,
        content: blogForm.value.content,
        tags: blogForm.value.tags
      })
    }
    await loadBlogs()
    dialog.value = false
    resetForm()
  } catch (error) {
    alert('Failed to save blog')
  }
}

const editBlog = (blog) => {
  editing.value = true
  blogForm.value = { ...blog }
  dialog.value = true
}

const deleteBlog = async (id) => {
  if (confirm('Are you sure?')) {
    try {
      await blogsAPI.delete(id)
      await loadBlogs()
    } catch (error) {
      alert('Failed to delete blog')
    }
  }
}

const resetForm = () => {
  editing.value = false
  blogForm.value = {
    id: null,
    title: '',
    content: '',
    tags: ''
  }
}

onMounted(loadBlogs)
</script>