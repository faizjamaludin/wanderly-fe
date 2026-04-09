import { createRouter, createWebHistory } from "vue-router";
import { dashboardRoutes } from "./modules/dashboard";
import DashboardLayout from "../layouts/DashboardLayout.vue";
import { tripRoutes } from "./modules/trip";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    children: [...dashboardRoutes, ...tripRoutes],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
