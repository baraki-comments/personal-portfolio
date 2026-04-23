<template>
  <div style="max-width: 800px; margin: 40px auto; padding: 30px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
    <h2 style="color: #0f172a; margin-bottom: 20px;">Contact Messages</h2>
    
    <div v-if="loading" style="text-align: center; padding: 40px;">Loading messages...</div>
    
    <div v-else-if="error" style="text-align: center; color: red; padding: 40px;">{{ error }}</div>
    
    <div v-else>
      <div v-for="msg in messages" :key="msg.id" style="border: 1px solid #e2e8f0; margin: 15px 0; padding: 15px; border-radius: 12px;">
        <p><strong>From:</strong> {{ msg.name }} ({{ msg.email }})</p>
        <p><strong>Message:</strong> {{ msg.message }}</p>
        <p><strong>Date:</strong> {{ msg.created_at || msg.date || 'No date' }}</p>
        <button @click="deleteMessage(msg.id)" style="background: #ef4444; color: white; padding: 6px 15px; border: none; border-radius: 6px; cursor: pointer;">Delete</button>
      </div>
      <div v-if="messages.length === 0" style="text-align: center; color: #666;">No messages yet.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const messages = ref([])
const loading = ref(true)
const error = ref('')

const loadMessages = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get('http://localhost:5004/api/messages')
    console.log('Messages loaded:', res.data)
    messages.value = res.data
  } catch (err) {
    console.error('Failed to load messages:', err)
    error.value = 'Failed to load messages'
  } finally {
    loading.value = false
  }
}

const deleteMessage = async (id) => {
  if (confirm('Delete this message?')) {
    try {
      await axios.delete(`http://localhost:5004/api/messages/${id}`)
      await loadMessages()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }
  }
}

onMounted(() => {
  loadMessages()
})
</script>

<style scoped>
.messages-container {
  background: #f0f2f5;
  min-height: 100vh;
}
.message-item {
  transition: all 0.3s ease;
}
.message-item:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-left: 4px solid #ef4444;
}
.delete-msg-btn {
  background: linear-gradient(90deg, #ef4444, #dc2626);
  transition: all 0.3s ease;
}
.delete-msg-btn:hover {
  transform: scale(1.05);
}
</style>
