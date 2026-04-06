<template>
  <div class="flex flex-col gap-4">
    <DashboardCard />

    <!-- my trips -->
    <div class="flex justify-between items-center">
      <p class="uppercase text-xs text-text-muted font-medium">My Trips</p>
      <Button variant="link" size="sm">See all</Button>
    </div>

    <div class="grid grid-cols-7 gap-4">
      <!-- trips card -->
      <div
        v-for=" in 6"
        class="flex flex-col border bg-white rounded-lg overflow-hidden"
      >
        <div class="h-15 bg-primary-brand"></div>
        <div class="flex flex-col p-4 gap-1">
          <p class="text-sm">Kyoto & Osaka</p>
          <p class="text-xs text-text-caption">14 - 22 Mar 2025</p>
          <Badge>Upcoming</Badge>
        </div>
      </div>

      <div
        class="flex flex-col gap-2 items-center justify-center border border-dashed bg-white rounded-lg cursor-pointer hover:bg-secondary-brand hover:border-primary-brand ease-in-out duration-200 group"
      >
        <span
          class="h-5 w-5 rounded-full border flex items-center justify-center text-text-muted group-hover:text-primary-brand group-hover:border-primary-brand"
        >
          <Plus
        /></span>
        <p class="text-sm text-text-primary group-hover:text-primary-brand">
          New trip
        </p>
        <p class="text-[10px] text-text-caption group-hover:text-primary-brand">
          Plan your next adventure
        </p>
      </div>
    </div>

    <!-- my trips -->
    <div class="flex justify-between">
      <p class="uppercase text-xs text-text-muted font-medium">
        Recent Activity
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import DashboardCard from "./components/DashboardCard.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import { Plus } from "lucide-vue-next";
</script>
