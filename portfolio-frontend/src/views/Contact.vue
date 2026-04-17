<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" offset-md-3>
        <v-card>
          <v-card-title class="text-h4 text-center">Contact Me</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="sendMessage">
              <v-text-field
                v-model="form.name"
                label="Your Name"
                required
              />
              <v-text-field
                v-model="form.email"
                label="Your Email"
                type="email"
                required
              />
              <v-textarea
                v-model="form.message"
                label="Your Message"
                rows="5"
                required
              />
              <v-alert v-if="success" type="success">Message sent successfully!</v-alert>
              <v-alert v-if="error" type="error">{{ error }}</v-alert>
              <v-btn
                type="submit"
                color="primary"
                block
                :loading="loading"
              >
                Send Message
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { messagesAPI } from '@/services/api'

const form = ref({
  name: '',
  email: '',
  message: ''
})
const loading = ref(false)
const success = ref(false)
const error = ref('')

const sendMessage = async () => {
  loading.value = true
  success.value = false
  error.value = ''
  
  try {
    await messagesAPI.send(form.value)
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