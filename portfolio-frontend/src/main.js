import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)

// Load auth state from localStorage
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
authStore.loadUser()

app.mount('#app')