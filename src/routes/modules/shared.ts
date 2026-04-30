import type { RouteRecordRaw } from "vue-router";
import Shared from "@/views/shared/Shared.vue";
import AcceptInvite from "@/views/shared/AcceptInvite.vue";

export const sharedRoutes: RouteRecordRaw[] = [
  {
    path: "/shared",
    name: "shared",
    component: Shared,
    meta: { title: "Shared with me" },
  },
  {
    path: "/invite/:token",
    name: "accept-invite",
    component: AcceptInvite,
    meta: { title: "Accept Invitation" },
  },
];
