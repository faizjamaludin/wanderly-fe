<template>
  <div class="flex flex-col gap-6">
    <!-- Filter tabs -->
    <div class="flex items-center gap-2">
      <button
        v-for="opt in filters"
        :key="opt.value"
        type="button"
        :class="[
          'px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
          filter === opt.value
            ? 'bg-primary-brand text-white border-primary-brand shadow-sm'
            : 'bg-white text-text-muted border-border hover:border-primary-brand hover:text-primary-brand'
        ]"
        @click="filter = opt.value"
      >
        {{ opt.label }}
        <span
          v-if="countByFilter[opt.value] > 0"
          :class="[
            'ml-1 px-1.5 py-px rounded-full text-[10px] font-semibold',
            filter === opt.value ? 'bg-white/20 text-white' : 'bg-border text-text-muted'
          ]"
        >{{ countByFilter[opt.value] }}</span>
      </button>
    </div>

    <!-- Skeleton loading -->
    <div v-if="tripsStore.loading && tripsStore.list.length === 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <Skeleton v-for="i in 5" :key="i" class="h-44 rounded-2xl" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="filtered.length === 0"
      class="flex flex-col items-center justify-center bg-white rounded-2xl p-14 gap-3 text-center border border-dashed border-border"
    >
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
        :style="{ background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)' }">
        🗺️
      </div>
      <p class="text-sm font-semibold text-text-primary mt-1">{{ emptyTitle }}</p>
      <p class="text-xs text-text-caption max-w-xs">{{ emptyHint }}</p>
      <RouterLink v-if="filter === 'all'" :to="{ name: 'new-trip' }" class="mt-2">
        <Button size="sm" class="gap-1"><Plus :size="14" /> Plan a trip</Button>
      </RouterLink>
    </div>

    <!-- Grouped trip list -->
    <template v-else>
      <!-- Ongoing group -->
      <div v-if="groupedFiltered.ongoing.length > 0" class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#1a5fa8] animate-pulse"></span>
          <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Happening now</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <TripCard v-for="trip in groupedFiltered.ongoing" :key="trip.id" :trip="trip" />
        </div>
      </div>

      <!-- Upcoming group -->
      <div v-if="groupedFiltered.upcoming.length > 0" class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-primary-brand"></span>
          <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Upcoming</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <TripCard v-for="trip in groupedFiltered.upcoming" :key="trip.id" :trip="trip" />
          <!-- New trip CTA card (only in all/upcoming view) -->
          <RouterLink
            v-if="filter === 'all' || filter === 'upcoming'"
            :to="{ name: 'new-trip' }"
            class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border hover:border-primary-brand hover:bg-secondary-brand/30 transition-all duration-200 min-h-[11rem] gap-2 group"
          >
            <div class="w-8 h-8 rounded-full bg-secondary-brand flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus :size="16" class="text-primary-brand" />
            </div>
            <p class="text-xs font-medium text-text-caption group-hover:text-primary-brand transition-colors">New trip</p>
          </RouterLink>
        </div>
      </div>

      <!-- Past group -->
      <div v-if="groupedFiltered.past.length > 0" class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-text-caption"></span>
          <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Past trips</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 opacity-80">
          <TripCard v-for="trip in groupedFiltered.past" :key="trip.id" :trip="trip" />
        </div>
      </div>

      <!-- New trip CTA when no upcoming trips shown -->
      <div
        v-if="groupedFiltered.upcoming.length === 0 && (filter === 'all' || filter === 'upcoming')"
        class="flex flex-col gap-3"
      >
        <div v-if="filter === 'all'" class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-primary-brand"></span>
          <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Upcoming</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <RouterLink
            :to="{ name: 'new-trip' }"
            class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border hover:border-primary-brand hover:bg-secondary-brand/30 transition-all duration-200 min-h-[11rem] gap-2 group"
          >
            <div class="w-8 h-8 rounded-full bg-secondary-brand flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus :size="16" class="text-primary-brand" />
            </div>
            <p class="text-xs font-medium text-text-caption group-hover:text-primary-brand transition-colors">Plan a trip</p>
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { Plus } from "lucide-vue-next";
import TripCard from "@/components/trips/TripCard.vue";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import { Button } from "@/components/ui/button";
import { tripStatus, type TripStatus } from "@/lib/dates";
import { useTripsStore } from "@/stores/trips";

type FilterValue = TripStatus | "all";

const tripsStore = useTripsStore();
const filter = ref<FilterValue>("all");

const filters: Array<{ label: string; value: FilterValue }> = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Past", value: "past" },
];

const filtered = computed(() => {
  if (filter.value === "all") return tripsStore.list;
  return tripsStore.list.filter(
    (t) => tripStatus(t.startDate, t.endDate) === filter.value
  );
});

const groupedFiltered = computed(() => ({
  ongoing:  filtered.value.filter((t) => tripStatus(t.startDate, t.endDate) === "ongoing"),
  upcoming: filtered.value.filter((t) => tripStatus(t.startDate, t.endDate) === "upcoming"),
  past:     filtered.value.filter((t) => tripStatus(t.startDate, t.endDate) === "past"),
}));

const countByFilter = computed(() => ({
  all:      tripsStore.list.length,
  upcoming: tripsStore.list.filter((t) => tripStatus(t.startDate, t.endDate) === "upcoming").length,
  ongoing:  tripsStore.list.filter((t) => tripStatus(t.startDate, t.endDate) === "ongoing").length,
  past:     tripsStore.list.filter((t) => tripStatus(t.startDate, t.endDate) === "past").length,
}));

const emptyTitle = computed(() => {
  switch (filter.value) {
    case "upcoming": return "Nothing planned yet";
    case "ongoing":  return "No active trips";
    case "past":     return "No past trips";
    default:         return "No trips yet";
  }
});

const emptyHint = computed(() => {
  switch (filter.value) {
    case "upcoming": return "Start planning your next adventure.";
    case "ongoing":  return "Nothing in progress right now.";
    case "past":     return "Your completed trips will appear here.";
    default:         return "Create your first itinerary and start exploring.";
  }
});
</script>
