import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Projects from '../views/Projects.vue'
import Blogs from '../views/Blogs.vue'
import Contact from '../views/Contact.vue'
import SkillsPage from '../views/SkillsPage.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import ProfileManagement from '../views/ProfileManagement.vue'
import SkillsManagement from '../views/SkillsManagement.vue'
import ProjectsManagement from '../views/ProjectsManagement.vue'
import BlogsManagement from '../views/BlogsManagement.vue'
import MessagesManagement from '../views/MessagesManagement.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/projects', name: 'Projects', component: Projects },
  { path: '/blogs', name: 'Blogs', component: Blogs },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/skills', name: 'SkillsPage', component: SkillsPage },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/profile-management', name: 'ProfileManagement', component: ProfileManagement },
  { path: '/skills-management', name: 'SkillsManagement', component: SkillsManagement },
  { path: '/projects-management', name: 'ProjectsManagement', component: ProjectsManagement },
  { path: '/blogs-management', name: 'BlogsManagement', component: BlogsManagement },
  { path: '/messages-management', name: 'MessagesManagement', component: MessagesManagement }
]

const router = createRouter({ history: createWebHistory(), routes })

export default router
