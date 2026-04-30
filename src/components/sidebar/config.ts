import {
  LayoutGrid,
  LogOut,
  Plane,
  SlidersHorizontal,
  Users,
} from "lucide-vue-next";

export const mainSidebar = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutGrid,
      },
      {
        title: "My Trips",
        url: "/mytrip",
        icon: Plane,
      },
      {
        title: "Shared with me",
        url: "/shared",
        icon: Users,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: SlidersHorizontal,
      },
      {
        title: "Log out",
        url: "/logout",
        icon: LogOut,
      },
    ],
  },
];
