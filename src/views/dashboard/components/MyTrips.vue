<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
    <template v-if="tripsStore.loading && tripsStore.list.length === 0">
      <Skeleton v-for="i in 4" :key="i" class="h-30 rounded-lg" />
    </template>

    <template v-else>
      <TripCard v-for="trip in tripsStore.list" :key="trip.id" :trip="trip" />

      <RouterLink
        :to="{ name: 'new-trip' }"
        class="flex flex-col gap-2 items-center justify-center border border-dashed bg-white rounded-lg cursor-pointer hover:bg-secondary-brand hover:border-primary-brand ease-in-out duration-200 group p-4"
      >
        <span
          class="h-5 w-5 rounded-full border flex items-center justify-center text-text-muted group-hover:text-primary-brand group-hover:border-primary-brand"
        >
          <Plus />
        </span>
        <p class="text-sm text-text-primary group-hover:text-primary-brand">
          New trip
        </p>
        <p class="text-[11px] text-text-caption group-hover:text-primary-brand">
          Plan your next adventure
        </p>
      </RouterLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Plus } from "lucide-vue-next";
import TripCard from "@/components/trips/TripCard.vue";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import { useTripsStore } from "@/stores/trips";

const tripsStore = useTripsStore();
</script>
