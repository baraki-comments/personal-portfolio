<template>
  <div style="max-width: 800px; margin: 40px auto; padding: 30px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
    <h2 style="color: #0f172a; margin-bottom: 20px;">Skills Management</h2>
    
    <div v-if="message" :style="{color: isError ? 'red' : 'green', marginBottom: '15px'}">{{ message }}</div>
    
    <div style="display: flex; gap: 10px; margin-bottom: 30px;">
      <input v-model="newSkill.name" placeholder="Skill name" style="flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;" />
      <input v-model.number="newSkill.level" type="number" placeholder="Level 0-100" style="width: 100px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px;" />
      <button @click="addSkill" style="background: #22c55e; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">Add</button>
    </div>
    
    <div v-for="skill in skills" :key="skill.id" style="display: flex; align-items: center; gap: 15px; margin: 15px 0; padding: 15px; background: #f8fafc; border-radius: 12px;">
      <div style="flex: 2; font-weight: bold;">{{ skill.skill_name }}</div>
      <div style="flex: 1;">
        <progress :value="skill.level" max="100" style="width: 100%; height: 8px;"></progress>
        <span style="margin-left: 10px;">{{ skill.level }}%</span>
      </div>
      <button @click="editSkill(skill)" style="background: #3b82f6; color: white; padding: 6px 15px; border: none; border-radius: 6px; cursor: pointer;">Edit</button>
      <button @click="deleteSkill(skill.id)" style="background: #ef4444; color: white; padding: 6px 15px; border: none; border-radius: 6px; cursor: pointer;">Delete</button>
    </div>
    <div v-if="skills.length === 0" style="text-align: center; color: #666;">No skills added yet. Add your first skill above.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5004/api' })
const skills = ref([])
const newSkill = ref({ name: '', level: 50 })
const message = ref('')
const isError = ref(false)

const loadSkills = async () => {
  try {
    const res = await api.get('/skills')
    skills.value = res.data
  } catch (err) {
    console.error('Failed to load skills:', err)
    message.value = 'Failed to load skills'
    isError.value = true
    setTimeout(() => message.value = '', 3000)
  }
}

const addSkill = async () => {
  if (!newSkill.value.name) {
    message.value = 'Skill name is required'
    isError.value = true
    setTimeout(() => message.value = '', 3000)
    return
  }
  
  try {
    await api.post('/skills', { 
      skill_name: newSkill.value.name, 
      level: newSkill.value.level 
    })
    newSkill.value = { name: '', level: 50 }
    message.value = 'Skill added successfully!'
    isError.value = false
    setTimeout(() => message.value = '', 3000)
    await loadSkills()
  } catch (err) {
    console.error('Add skill error:', err)
    message.value = err.response?.data?.error || 'Failed to add skill'
    isError.value = true
    setTimeout(() => message.value = '', 3000)
  }
}

const editSkill = async (skill) => {
  const newName = prompt('Enter new skill name:', skill.skill_name)
  if (!newName) return
  
  const newLevel = prompt('Enter new level (0-100):', skill.level)
  if (newLevel === null) return
  
  try {
    await api.put(`/skills/${skill.id}`, { 
      skill_name: newName, 
      level: parseInt(newLevel) 
    })
    message.value = 'Skill updated successfully!'
    isError.value = false
    setTimeout(() => message.value = '', 3000)
    await loadSkills()
  } catch (err) {
    console.error('Edit skill error:', err)
    message.value = 'Failed to update skill'
    isError.value = true
    setTimeout(() => message.value = '', 3000)
  }
}

const deleteSkill = async (id) => {
  if (confirm('Delete this skill?')) {
    try {
      await api.delete(`/skills/${id}`)
      message.value = 'Skill deleted successfully!'
      isError.value = false
      setTimeout(() => message.value = '', 3000)
      await loadSkills()
    } catch (err) {
      console.error('Delete skill error:', err)
      message.value = 'Failed to delete skill'
      isError.value = true
      setTimeout(() => message.value = '', 3000)
    }
  }
}

onMounted(() => {
  loadSkills()
})
</script>

<style scoped>
.skills-mgmt-container {
  background: #f0f2f5;
  min-height: 100vh;
}
.skills-mgmt-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}
.skill-item {
  transition: all 0.3s ease;
}
.skill-item:hover {
  background: #f8fafc;
  transform: translateX(5px);
}
.add-skill-btn {
  background: linear-gradient(90deg, #22c55e, #16a34a);
  transition: all 0.3s ease;
}
.add-skill-btn:hover {
  transform: scale(1.02);
}
</style>

<style scoped>
.skills-mgmt-page {
  background: #f0f2f5;
  min-height: 100vh;
}
</style>
