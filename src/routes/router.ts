import { createRouter, createWebHistory } from "vue-router";
import { dashboardRoutes } from "./modules/dashboard";
import DashboardLayout from "../layouts/DashboardLayout.vue";
import { tripRoutes } from "./modules/trip";
import { authRoutes } from "./modules/auth";
import { sharedRoutes } from "./modules/shared";
import { settingsRoutes } from "./modules/settings";
import { useAuthStore } from "@/stores/auth";

const routes = [
  ...authRoutes,
  {
    path: "/",
    component: DashboardLayout,
    children: [
      ...dashboardRoutes,
      ...tripRoutes,
      ...sharedRoutes,
      ...settingsRoutes,
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  await auth.init();

  const isPublic = to.matched.some((record) => record.meta.public);

  if (!isPublic && !auth.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (isPublic && auth.isAuthenticated) {
    return { name: "dashboard" };
  }
});
