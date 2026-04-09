<template>
  <div class="flex flex-col gap-4">
    <DashboardCard />

    <!-- my trips -->
    <div class="flex justify-between items-center">
      <p class="uppercase text-xs text-text-muted font-medium">My Trips</p>
      <Button variant="link" size="sm">See all</Button>
    </div>
    <MyTrips />

    <!-- my trips -->
    <div class="flex justify-between">
      <p class="uppercase text-xs text-text-muted font-medium">
        Recent Activity
      </p>
    </div>

    <div class="flex flex-col bg-white rounded-lg">
      <!-- added -->
      <div class="flex justify-between items-center p-4 border-b">
        <div class="flex items-center gap-2">
          <span class="h-7 w-7 bg-secondary-brand rounded-sm"></span>
          <div class="flex flex-col">
            <p class="text-text-primary text-xs font-medium">
              Fushimi Inari tour added
            </p>
            <span class="flex items-center text-text-muted text-[11px]">
              Kyoto & Osaka <Dot /> by Nurul
            </span>
          </div>
        </div>

        <p class="text-text-caption text-xs">2h ago</p>
      </div>

      <!-- booking -->
      <div class="flex justify-between items-center p-4 border-b">
        <div class="flex items-center gap-2">
          <span class="h-7 w-7 bg-[#e8f1fb] rounded-sm"></span>
          <div class="flex flex-col">
            <p class="text-text-primary text-sm">Hotel booking confirmed</p>
            <span class="flex items-center text-text-muted text-[11px]">
              Kyoto Grand Hotel <Dot /> Ref KGH-20948
            </span>
          </div>
        </div>

        <p class="text-text-caption text-xs">2h ago</p>
      </div>

      <!-- invited -->
      <div class="flex justify-between items-center p-4 border-b">
        <div class="flex items-center gap-2">
          <span class="h-7 w-7 bg-[#f0effe] rounded-sm"></span>
          <div class="flex flex-col">
            <p class="text-text-primary text-sm">
              Nurul invited you to Bali 2025
            </p>
            <span class="flex items-center text-text-muted text-[11px]">
              Shared with me <Dot /> Editor role
            </span>
          </div>
        </div>

        <p class="text-text-caption text-xs">2h ago</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import DashboardCard from "./components/DashboardCard.vue";
import MyTrips from "./components/MyTrips.vue";
import { Dot } from "lucide-vue-next";
</script>
