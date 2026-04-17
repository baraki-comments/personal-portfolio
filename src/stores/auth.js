import { defineStore } from 'pinia'
import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || '',
  },
  
  actions: {
    async register(userData) {
      try {
        const response = await authAPI.register(userData)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return { success: true }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Registration failed' }
      }
    },
    
    async login(credentials) {
      try {
        const response = await authAPI.login(credentials)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return { success: true }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Login failed' }
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    
    loadUser() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        this.user = JSON.parse(storedUser)
      }
    }
  }
})