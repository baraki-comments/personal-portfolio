<template>
  <v-card class="mt-4"><v-card-title>Skills Management <v-spacer /><v-btn color="primary" @click="openDialog()">Add Skill</v-btn></v-card-title><v-card-text><v-list><v-list-item v-for="skill in skills" :key="skill.id"><v-list-item-title>{{ skill.skill_name }}</v-list-item-title><v-progress-linear :model-value="skill.level" height="10" class="mx-4"></v-progress-linear><span>{{ skill.level }}%</span><v-btn icon variant="text" @click="openDialog(skill)"><v-icon>mdi-pencil</v-icon></v-btn><v-btn icon variant="text" @click="deleteSkill(skill.id)"><v-icon>mdi-delete</v-icon></v-btn></v-list-item></v-list></v-card-text><v-dialog v-model="dialog" max-width="500px"><v-card><v-card-title>{{ editing ? 'Edit Skill' : 'Add Skill' }}</v-card-title><v-card-text><v-text-field v-model="skillForm.skill_name" label="Skill Name" /><v-slider v-model="skillForm.level" label="Skill Level" min="0" max="100" thumb-label /></v-card-text><v-card-actions><v-btn text @click="dialog=false">Cancel</v-btn><v-btn color="primary" @click="saveSkill">Save</v-btn></v-card-actions></v-card></v-dialog></v-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { skillsAPI } from '@/services/api'
const skills = ref([])
const dialog = ref(false)
const editing = ref(false)
const skillForm = ref({ id: null, skill_name: '', level: 50 })
const load = async () => { const res = await skillsAPI.getAll(); skills.value = res.data }
const openDialog = (s = null) => { editing.value = !!s; skillForm.value = s ? { ...s } : { id: null, skill_name: '', level: 50 }; dialog.value = true }
const saveSkill = async () => { if (editing.value) await skillsAPI.update(skillForm.value.id, { skill_name: skillForm.value.skill_name, level: skillForm.value.level }); else await skillsAPI.create({ skill_name: skillForm.value.skill_name, level: skillForm.value.level }); await load(); dialog.value = false }
const deleteSkill = async (id) => { if (confirm('Delete?')) { await skillsAPI.delete(id); await load() } }
onMounted(load)
</script>
