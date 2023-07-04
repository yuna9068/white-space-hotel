import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/detail',
    name: 'RoomDetail',
    component: () => import('@/views/RoomDetail.vue'),
    beforeEnter: (to, from, next) => {
      const roomId = sessionStorage.getItem('roomId');
      if (!roomId) {
        next({ name: 'Home' });
        return;
      }
      next();
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
