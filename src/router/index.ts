import NotFound from '@/pages/NotFound.vue';
import { useNProgress } from '@vueuse/integrations/useNProgress';
import { createRouter, createWebHistory } from 'vue-router';

const nprogress = useNProgress();

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

router.beforeEach((_to, _from, next) => {
  nprogress.start();
  next();
});

router.afterEach(() => {
  nprogress.done();
});

export default router;
