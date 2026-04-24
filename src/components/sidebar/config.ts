import { LayoutGrid, Plane, SlidersHorizontal, Users } from "lucide-vue-next";

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
        url: "",
        icon: Users,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        url: "",
        icon: SlidersHorizontal,
      },
    ],
  },
];
