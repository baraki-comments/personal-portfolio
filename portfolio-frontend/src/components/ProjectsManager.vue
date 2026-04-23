<template>
  <v-card class="mt-4"><v-card-title>Projects Management <v-spacer /><v-btn color="primary" @click="openDialog()">Add Project</v-btn></v-card-title><v-card-text><v-row><v-col v-for="p in projects" :key="p.id" cols="12" md="6" lg="4"><v-card><v-img :src="p.image || 'https://via.placeholder.com/300x200'" height="200" cover /><v-card-title>{{ p.title }}</v-card-title><v-card-subtitle>{{ p.technologies }}</v-card-subtitle><v-card-text>{{ p.description }}</v-card-text><v-card-actions><v-btn :href="p.github_link" target="_blank" icon><v-icon>mdi-github</v-icon></v-btn><v-btn :href="p.demo_link" target="_blank" icon><v-icon>mdi-open-in-new</v-icon></v-btn><v-spacer /><v-btn icon @click="openDialog(p)"><v-icon>mdi-pencil</v-icon></v-btn><v-btn icon @click="deleteProject(p.id)"><v-icon>mdi-delete</v-icon></v-btn></v-card-actions></v-card></v-col></v-row></v-card-text><v-dialog v-model="dialog" max-width="600px"><v-card><v-card-title>{{ editing ? 'Edit Project' : 'Add Project' }}</v-card-title><v-card-text><v-text-field v-model="form.title" label="Title" /><v-textarea v-model="form.description" label="Description" rows="3" /><v-text-field v-model="form.technologies" label="Technologies (comma)" /><v-text-field v-model="form.github_link" label="GitHub Link" /><v-text-field v-model="form.demo_link" label="Live Demo Link" /><v-file-input accept="image/*" label="Screenshot" @change="(f) => form.imageFile = f" /></v-card-text><v-card-actions><v-btn text @click="dialog=false">Cancel</v-btn><v-btn color="primary" @click="saveProject">Save</v-btn></v-card-actions></v-card></v-dialog></v-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { projectsAPI } from '@/services/api'
const projects = ref([])
const dialog = ref(false)
const editing = ref(false)
const form = ref({ id: null, title: '', description: '', technologies: '', github_link: '', demo_link: '', imageFile: null })
const load = async () => { const res = await projectsAPI.getAll(); projects.value = res.data }
const openDialog = (p = null) => { editing.value = !!p; if (p) form.value = { ...p, imageFile: null }; else form.value = { id: null, title: '', description: '', technologies: '', github_link: '', demo_link: '', imageFile: null }; dialog.value = true }
const saveProject = async () => { const fd = new FormData(); fd.append('title', form.value.title); fd.append('description', form.value.description); fd.append('technologies', form.value.technologies); fd.append('github_link', form.value.github_link); fd.append('demo_link', form.value.demo_link); if (form.value.imageFile) fd.append('image', form.value.imageFile); if (editing.value) await projectsAPI.update(form.value.id, fd); else await projectsAPI.create(fd); await load(); dialog.value = false }
const deleteProject = async (id) => { if (confirm('Delete?')) { await projectsAPI.delete(id); await load() } }
onMounted(load)
</script>
