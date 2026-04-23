<template>
  <div style="max-width: 700px; margin: 0 auto; padding: 40px 20px;">
    <h1 style="text-align: center; color: #0f172a; margin-bottom: 30px;">Contact Me</h1>
    
    <div style="background: white; border-radius: 24px; padding: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
      <div v-if="success" style="background: #dcfce7; color: #166534; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        Message sent successfully!
      </div>
      
      <div v-if="error" style="background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        {{ error }}
      </div>
      
      <input v-model="form.name" type="text" placeholder="Your Name" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem;" />
      <input v-model="form.email" type="email" placeholder="Your Email" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem;" />
      <textarea v-model="form.message" placeholder="Your Message" rows="5" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; resize: vertical;"></textarea>
      
      <button @click="sendMessage" :disabled="loading" style="width: 100%; padding: 12px; background: #0f172a; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 15px;">
        {{ loading ? 'Sending...' : 'SEND MESSAGE' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({ name: '', email: '', message: '' })
const loading = ref(false)
const success = ref(false)
const error = ref('')

const sendMessage = async () => {
  loading.value = true
  success.value = false
  error.value = ''

  try {
    await axios.post('http://localhost:5004/api/messages', form.value)
    success.value = true
    form.value = { name: '', email: '', message: '' }
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err) {
    error.value = 'Failed to send message. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-container {
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  min-height: 100vh;
}
.contact-card {
  background: rgba(255,255,255,0.95);
  border-radius: 30px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}
.contact-card:hover {
  transform: scale(1.01);
  box-shadow: 0 25px 45px rgba(0,0,0,0.2);
}
.contact-input {
  transition: all 0.3s ease;
}
.contact-input:focus {
  transform: translateX(5px);
  border-color: #84fab0;
}
.contact-btn {
  background: linear-gradient(90deg, #11998e, #38ef7d);
  transition: all 0.3s ease;
}
.contact-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}
</style>
