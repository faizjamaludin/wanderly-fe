import type { RouteRecordRaw } from "vue-router";
import MyTrips from "@/views/my-trips/MyTrips.vue";
import NewTrip from "@/views/my-trips/new-trip/NewTrip.vue";

export const tripRoutes: RouteRecordRaw[] = [
  {
    path: "/mytrip",
    name: "mytrip",
    component: MyTrips,
  },
  {
    path: "/new-trip",
    name: "new-trip",
    component: NewTrip,
  },
];
