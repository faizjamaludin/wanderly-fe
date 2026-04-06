import type { RouteRecord, RouteRecordRaw } from "vue-router";
import Dashboard from "../../views/dashboard/Dashboard.vue";

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
  },
];
