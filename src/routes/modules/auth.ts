import type { RouteRecordRaw } from "vue-router";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
import { useAuthStore } from "@/stores/auth";
import { useTripsStore } from "@/stores/trips";

export const authRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { public: true },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { public: true },
  },
  {
    path: "/logout",
    name: "logout",
    beforeEnter: async () => {
      const auth = useAuthStore();
      const trips = useTripsStore();
      await auth.logout();
      trips.reset();
      return { name: "login" };
    },
    component: Login,
  },
];
