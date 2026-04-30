import type { RouteRecordRaw } from "vue-router";
import MyTrips from "@/views/my-trips/MyTrips.vue";
import NewTrip from "@/views/my-trips/new-trip/NewTrip.vue";
import TripDetail from "@/views/my-trips/TripDetail.vue";

export const tripRoutes: RouteRecordRaw[] = [
  {
    path: "/mytrip",
    name: "mytrip",
    component: MyTrips,
    meta: { title: "My Trips" },
  },
  {
    path: "/mytrip/:id",
    name: "trip-detail",
    component: TripDetail,
    meta: { title: "Trip" },
  },
  {
    path: "/new-trip",
    name: "new-trip",
    component: NewTrip,
    meta: { title: "New Trip" },
  },
];
