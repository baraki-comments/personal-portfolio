<template>
  <v-card class="mt-4"><v-card-title>Blogs Management <v-spacer /><v-btn color="primary" @click="openDialog()">Create Blog</v-btn></v-card-title><v-card-text><v-list><v-list-item v-for="b in blogs" :key="b.id"><v-list-item-title>{{ b.title }}</v-list-item-title><v-list-item-subtitle>{{ b.tags }} | {{ new Date(b.created_at).toLocaleDateString() }}</v-list-item-subtitle><template v-slot:append><v-btn icon variant="text" @click="openDialog(b)"><v-icon>mdi-pencil</v-icon></v-btn><v-btn icon variant="text" @click="deleteBlog(b.id)"><v-icon>mdi-delete</v-icon></v-btn></template></v-list-item></v-list></v-card-text><v-dialog v-model="dialog" max-width="800px"><v-card><v-card-title>{{ editing ? 'Edit Blog' : 'Create Blog' }}</v-card-title><v-card-text><v-text-field v-model="form.title" label="Title" /><v-text-field v-model="form.tags" label="Tags (comma)" /><v-textarea v-model="form.content" label="Content (HTML)" rows="10" /></v-card-text><v-card-actions><v-btn text @click="dialog=false">Cancel</v-btn><v-btn color="primary" @click="saveBlog">Save</v-btn></v-card-actions></v-card></v-dialog></v-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { blogsAPI } from '@/services/api'
const blogs = ref([])
const dialog = ref(false)
const editing = ref(false)
const form = ref({ id: null, title: '', content: '', tags: '' })
const load = async () => { const res = await blogsAPI.getMyBlogs(); blogs.value = res.data }
const openDialog = (b = null) => { editing.value = !!b; form.value = b ? { ...b } : { id: null, title: '', content: '', tags: '' }; dialog.value = true }
const saveBlog = async () => { if (editing.value) await blogsAPI.update(form.value.id, { title: form.value.title, content: form.value.content, tags: form.value.tags }); else await blogsAPI.create({ title: form.value.title, content: form.value.content, tags: form.value.tags }); await load(); dialog.value = false }
const deleteBlog = async (id) => { if (confirm('Delete?')) { await blogsAPI.delete(id); await load() } }
onMounted(load)
</script>
