import { createRouter, createWebHistory } from "vue-router";
import { dashboardRoutes } from "./modules/dashboard";
import DashboardLayout from "../layouts/DashboardLayout.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    children: [...dashboardRoutes],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
