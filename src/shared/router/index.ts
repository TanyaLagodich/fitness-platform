import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/shared/layout/Layout.vue';
import ClientList from '../../pages/clients/ui/client-list/client-list.vue';
import { Client } from '../../pages/clients/client';
import { AddWorkout } from '../../pages/workout';
import { AuthLayout, SignUp, SignIn } from '@/pages/auth/index.ts';

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'sign-in', component: SignIn },
      { path: 'sign-up', component: SignUp },
      { path: '', redirect: '/auth/sign-in' },
    ],
  },
  {
    path: '/home',
    name: 'Home',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/clients',
        name: 'clients',
        component: ClientList,
      },
      {
        path: '/client/:id',
        name: 'client',
        component: Client,
      },
      {
        path: '/client/:id/workout/new',
        name: 'workout',
        component: AddWorkout,
      },
      {
        path: '/exercise',
        name: 'exercise',
        component: Client,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    return next('/auth');
  }

  if (to.path.startsWith('/auth') && token) {
    return next('/home');
  }

  next();
});

export default router;
