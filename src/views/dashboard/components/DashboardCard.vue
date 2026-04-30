<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <!-- card my trips -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span
        class="flex h-7 w-7 items-center justify-center rounded-sm bg-secondary-brand text-primary-brand"
      >
        <Plane :size="17" />
      </span>
      <p class="uppercase text-xs text-text-muted">My Trips</p>
      <p class="text-2xl">{{ myTripsCount }}</p>
      <p class="text-text-caption text-[11px]">
        {{ upcomingCount }} upcoming
      </p>
    </div>

    <!-- card shared with me -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span
        class="flex h-7 w-7 items-center justify-center rounded-sm bg-[#f0effe] text-[#5b4fcf]"
      >
        <UsersRound :size="17" />
      </span>
      <p class="uppercase text-xs text-text-muted">Shared with Me</p>
      <p class="text-2xl">{{ sharedCount }}</p>
      <p class="text-text-caption text-[11px]">
        {{ sharedHint }}
      </p>
    </div>

    <!-- card days to next trip -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span
        class="flex h-7 w-7 items-center justify-center rounded-sm bg-[#e8f1fb] text-[#1a5fa8]"
      >
        <Clock :size="17" />
      </span>
      <p class="uppercase text-xs text-text-muted">Days to Next trip</p>
      <p class="text-2xl">{{ daysToNextTrip ?? "—" }}</p>
      <p class="text-text-caption text-[11px]">
        {{ nextTripHint }}
      </p>
    </div>

    <!-- card total spent -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span
        class="flex h-7 w-7 items-center justify-center rounded-sm bg-[#FEF3E2] text-[#b5580a]"
      >
        <CircleDollarSign :size="17" />
      </span>
      <p class="uppercase text-xs text-text-muted">Total Spent</p>
      <p class="text-2xl">{{ totalSpentLabel }}</p>
      <p class="text-text-caption text-[11px]">across all trips</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CircleDollarSign, Clock, Plane, UsersRound } from "lucide-vue-next";
import { daysUntil, tripStatus } from "@/lib/dates";
import { useAuthStore } from "@/stores/auth";
import { useTripsStore } from "@/stores/trips";

const auth = useAuthStore();
const trips = useTripsStore();

const ownedTrips = computed(() =>
  trips.list.filter((t) => t.ownerId === auth.currentUser?.id)
);

const sharedTrips = computed(() =>
  trips.list.filter((t) => t.ownerId !== auth.currentUser?.id)
);

const myTripsCount = computed(() => ownedTrips.value.length);
const sharedCount = computed(() => sharedTrips.value.length);

const upcomingCount = computed(
  () =>
    ownedTrips.value.filter(
      (t) => tripStatus(t.startDate, t.endDate) === "upcoming"
    ).length
);

const sharedHint = computed(() => {
  const next = sharedTrips.value[0];
  return next ? next.name : "Nothing shared yet";
});

const nextTrip = computed(() => {
  const upcoming = trips.list
    .filter((t) => tripStatus(t.startDate, t.endDate) === "upcoming")
    .map((t) => ({ trip: t, days: daysUntil(t.startDate) }))
    .filter((x) => x.days >= 0)
    .sort((a, b) => a.days - b.days);
  return upcoming[0] ?? null;
});

const daysToNextTrip = computed(() => nextTrip.value?.days ?? null);

const nextTripHint = computed(() => {
  if (!nextTrip.value) return "No upcoming trips";
  return nextTrip.value.trip.name;
});

const totalByCurrency = computed(() => {
  const map = new Map<string, number>();
  for (const t of trips.list) {
    map.set(t.budget.currency, (map.get(t.budget.currency) ?? 0) + t.budget.total);
  }
  return map;
});

function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toLocaleString();
}

const totalSpentLabel = computed(() => {
  const entries = Array.from(totalByCurrency.value.entries());
  if (entries.length === 0) return "—";
  const [currency, total] = entries.sort((a, b) => b[1] - a[1])[0];
  return `${currency} ${formatCompact(total)}`;
});
</script>
