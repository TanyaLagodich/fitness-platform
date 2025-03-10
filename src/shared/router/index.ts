import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/shared/layout/Layout.vue';
import Clients from '@/pages/clients/ui/Clients.vue';
import { Client } from '@/pages/client';
import { AddWorkout } from '@/pages/add-workout';
import { AuthLayout, SignUp, SignIn } from '@/pages/auth';

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
        component: Clients,
      },
      {
        path: '/client/:id',
        name: 'client',
        component: Client,
      },
      {
        path: '/client/:id/workout/new',
        name: 'add-workout',
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
