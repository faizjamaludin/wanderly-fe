<template>
  <div class="flex flex-col gap-4">
    <div v-if="trips.loading && trips.list.length === 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
      <Skeleton v-for="i in 4" :key="i" class="h-30 rounded-lg" />
    </div>

    <div
      v-else-if="sharedTrips.length === 0"
      class="flex flex-col items-center justify-center bg-white rounded-lg p-12 gap-2"
    >
      <p class="text-sm text-text-primary">Nothing shared with you yet</p>
      <p class="text-xs text-text-caption">
        Trips others invite you to will appear here.
      </p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
      <TripCard v-for="trip in sharedTrips" :key="trip.id" :trip="trip" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TripCard from "@/components/trips/TripCard.vue";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import { useAuthStore } from "@/stores/auth";
import { useTripsStore } from "@/stores/trips";

const auth = useAuthStore();
const trips = useTripsStore();

const sharedTrips = computed(() =>
  trips.list.filter((t) => t.ownerId !== auth.currentUser?.id)
);
</script>
