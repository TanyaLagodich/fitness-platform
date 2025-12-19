import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/pages/auth/Login.vue';
import WorkoutsList from '@/pages/workouts/WorkoutsList.vue';
import WorkoutDetails from '@/pages/workouts/WorkoutDetails.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/workouts' },
    { path: '/login', name: 'login', component: Login },
    { path: '/workouts', name: 'workouts', component: WorkoutsList, meta: { requiresAuth: true } },
    {
      path: '/workouts/:id',
      name: 'workout-detail',
      component: WorkoutDetails,
      meta: { requiresAuth: true },
      props: true,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('client_token');
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }
  if (to.name === 'login' && token) {
    return next({ name: 'workouts' });
  }
  next();
});

export default router;
