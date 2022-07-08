import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
import HelloWorld2 from '@/components/HelloWorld2.vue'
const routes = [
  {
    path: '/',
    name: 'hellow',
    component: HelloWorld
  },
  {
    path: '/1',
    name: 'hellow2',
    component: HelloWorld2
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
