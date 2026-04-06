import { createRouter, createWebHistory } from "vue-router";
import { dashboardRoutes } from "./modules/dashboard";

const routes = [...dashboardRoutes];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
