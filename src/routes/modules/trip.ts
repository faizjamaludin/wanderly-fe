import type { RouteRecordRaw } from "vue-router";
import MyTrips from "@/views/my-trips/MyTrips.vue";

export const tripRoutes: RouteRecordRaw[] = [
  {
    path: "/mytrip",
    name: "mytrip",
    component: MyTrips,
  },
];
