import type { Trip } from "@/types";

export function seedTrips(ownerId: string): Trip[] {
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(),
      name: "Kyoto & Osaka",
      destination: "Kyoto, Japan",
      startDate: "2025-03-14",
      endDate: "2025-03-22",
      type: "Cultural",
      notes: "Cherry blossom season",
      collaborators: [],
      accommodations: [
        {
          id: crypto.randomUUID(),
          name: "Kyoto Grand Hotel",
          startDate: "2025-03-14",
          endDate: "2025-03-18",
          confirmationNum: "KGH-20948",
        },
      ],
      activities: [
        {
          id: crypto.randomUUID(),
          date: "2025-03-14",
          time: "14:00",
          name: "Check in – Kyoto Grand Hotel",
          location: "Kyoto Station area",
          category: "accommodation" as const,
        },
        {
          id: crypto.randomUUID(),
          date: "2025-03-14",
          time: "19:00",
          name: "Nishiki Market evening stroll",
          location: "Nishiki Market",
          notes: "Try the skewers and fresh tofu",
          category: "food" as const,
        },
        {
          id: crypto.randomUUID(),
          date: "2025-03-15",
          time: "09:00",
          name: "Fushimi Inari Taisha",
          location: "Fushimi-ku, Kyoto",
          notes: "Go early to beat the crowds",
          category: "sightseeing" as const,
        },
        {
          id: crypto.randomUUID(),
          date: "2025-03-15",
          time: "13:00",
          name: "Ramen lunch at Ichiran",
          location: "Kyoto Kawaramachi",
          category: "food" as const,
        },
        {
          id: crypto.randomUUID(),
          date: "2025-03-16",
          time: "08:30",
          name: "Arashiyama Bamboo Grove",
          location: "Arashiyama, Kyoto",
          category: "sightseeing" as const,
        },
        {
          id: crypto.randomUUID(),
          date: "2025-03-18",
          time: "10:00",
          name: "Shinkansen to Osaka",
          location: "Kyoto Station",
          category: "transport" as const,
        },
      ],
      budget: {
        total: 6200,
        currency: "MYR",
        splitMode: "equal",
        travelerCount: 2,
        splits: [],
        expenses: [],
      },
      ownerId,
      createdAt: now,
      auditLog: [],
    },
  ];
}
