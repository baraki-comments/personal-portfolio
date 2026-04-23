<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>

    <!-- Messages Section -->
    <div class="card">
      <h2>?? Contact Messages</h2>
      <table v-if="messages.length">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Message</th><th>Date</th><th>Action</th></tr>
        </thead>
        <tbody>
          <tr v-for="msg in messages" :key="msg.id">
            <td>{{ msg.name }}</td>
            <td>{{ msg.email }}</td>
            <td>{{ msg.message }}</td>
            <td>{{ msg.date }}</td>
            <td><button @click="deleteMessage(msg.id)" class="delete">Delete</button></td>
          </tr>
        </tbody>
      </table>
      <p v-else>No messages yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const messages = ref([]);

const loadMessages = async () => {
  try {
    const res = await api.get('/admin/messages');
    messages.value = res.data;
  } catch (err) {
    console.error('Failed to load messages', err);
  }
};

const deleteMessage = async (id) => {
  if (confirm('Delete this message?')) {
    await api.delete(`/admin/messages/${id}`);
    await loadMessages();
  }
};

onMounted(() => {
  loadMessages();
});
</script>

<style scoped>
.admin-dashboard { padding: 2rem; }
.card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
.delete { background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
</style>
