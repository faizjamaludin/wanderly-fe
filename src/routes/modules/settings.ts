import type { RouteRecordRaw } from "vue-router";
import Settings from "@/views/settings/Settings.vue";

export const settingsRoutes: RouteRecordRaw[] = [
  {
    path: "/settings",
    name: "settings",
    component: Settings,
    meta: { title: "Settings" },
  },
];
