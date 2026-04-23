<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
    <h1 style="color: #0f172a; margin-bottom: 10px;">Admin Dashboard</h1>
    <p style="color: #64748b; margin-bottom: 30px;">Welcome to your portfolio management panel.</p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px;">
      <!-- Profile Card -->
      <div style="background: white; padding: 25px; border-radius: 16px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: transform 0.3s;">
        <div style="font-size: 3rem; margin-bottom: 15px;">??</div>
        <h3 style="color: #0f172a; margin-bottom: 15px;">Profile</h3>
        <button @click="$router.push('/profile-management')" style="background: #0f172a; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">Manage Profile</button>
      </div>
      
      <!-- Skills Card -->
      <div style="background: white; padding: 25px; border-radius: 16px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: transform 0.3s;">
        <div style="font-size: 3rem; margin-bottom: 15px;">?</div>
        <h3 style="color: #0f172a; margin-bottom: 15px;">Skills</h3>
        <button @click="$router.push('/skills-management')" style="background: #0f172a; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">Manage Skills</button>
      </div>
      
      <!-- Projects Card -->
      <div style="background: white; padding: 25px; border-radius: 16px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: transform 0.3s;">
        <div style="font-size: 3rem; margin-bottom: 15px;">??</div>
        <h3 style="color: #0f172a; margin-bottom: 15px;">Projects</h3>
        <button @click="$router.push('/projects-management')" style="background: #0f172a; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">Manage Projects</button>
      </div>
      
      <!-- Blogs Card -->
      <div style="background: white; padding: 25px; border-radius: 16px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: transform 0.3s;">
        <div style="font-size: 3rem; margin-bottom: 15px;">??</div>
        <h3 style="color: #0f172a; margin-bottom: 15px;">Blogs</h3>
        <button @click="$router.push('/blogs-management')" style="background: #0f172a; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">Manage Blogs</button>
      </div>
      
      <!-- Messages Card -->
      <div style="background: white; padding: 25px; border-radius: 16px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: transform 0.3s;">
        <div style="font-size: 3rem; margin-bottom: 15px;">??</div>
        <h3 style="color: #0f172a; margin-bottom: 15px;">Messages</h3>
        <button @click="$router.push('/messages-management')" style="background: #0f172a; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">View Messages</button>
      </div>
    </div>
    
    <button @click="logout" style="margin-top: 40px; background: #ef4444; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">Logout</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
