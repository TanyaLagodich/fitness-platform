import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/shared/layout/Layout.vue';
import Clients from "@/pages/clients/ui/Clients.vue";
import { Client } from '@/pages/client';
import { AddWorkout } from '@/pages/add-workout';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Layout,
        children: [
            {
                path: '/clients',
                name: 'clients',
                component: Clients,
            },
            {
                path: '/clients/:id',
                name: 'client',
                component: Client,
            },
            {
                path: '/clients/:id/workout/new',
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

export default router;
