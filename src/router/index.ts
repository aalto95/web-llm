import NotFound from '@/pages/NotFound.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Main', component: () => import('@/pages/Main.vue') },
  {
    path: '/chats/:id',
    name: 'Chat',
    component: () => import('@/pages/Main.vue')
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
