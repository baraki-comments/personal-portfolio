<template>
  <v-card class="mt-4">
    <v-card-title>Contact Messages</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="messages"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn icon color="error" @click="deleteMessage(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { messagesAPI } from '@/services/api'

const messages = ref([])
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Message', key: 'message' },
  { title: 'Date', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const loadMessages = async () => {
  try {
    const response = await messagesAPI.getAll()
    messages.value = response.data
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

const deleteMessage = async (id) => {
  if (confirm('Delete this message?')) {
    try {
      await messagesAPI.delete(id)
      await loadMessages()
    } catch (error) {
      alert('Failed to delete message')
    }
  }
}

onMounted(loadMessages)
</script>