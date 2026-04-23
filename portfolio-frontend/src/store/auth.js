import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  actions: {
    logout() {
      this.user = null
      localStorage.removeItem('user')
    }
  }
})
