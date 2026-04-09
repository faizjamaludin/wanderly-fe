<template>
  <div class="grid grid-cols-4 gap-4">
    <!-- card my trips -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span
        class="flex h-7 w-7 items-center justify-center rounded-sm bg-secondary-brand text-primary-brand"
      >
        <Plane :size="17" />
      </span>
      <p class="uppercase text-xs text-text-muted">My Trips</p>
      <p class="text-2xl">3</p>
      <p class="text-text-caption text-[11px]">1 upcoming</p>
    </div>

    <!-- card shared with me -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span
        class="flex h-7 w-7 items-center justify-center rounded-sm bg-[#f0effe] text-[#5b4fcf]"
      >
        <UsersRound :size="17" />
      </span>
      <p class="uppercase text-xs text-text-muted">Shared with Me</p>
      <p class="text-2xl">1</p>
      <p class="text-text-caption text-[11px]">Bali 2025 by Nurul</p>
    </div>

    <!-- card days to next trip -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span
        class="flex h-7 w-7 items-center justify-center rounded-sm bg-[#e8f1fb] text-[#1a5fa8]"
      >
        <Clock :size="17" />
      </span>
      <p class="uppercase text-xs text-text-muted">Days to Next trip</p>
      <p class="text-2xl">8</p>
      <p class="text-text-caption text-[11px]">Bali 2025 by Nurul</p>
    </div>

    <!-- card total spent -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span
        class="flex h-7 w-7 items-center justify-center rounded-sm bg-[#FEF3E2] text-[#b5580a]"
      >
        <CircleDollarSign :size="17" />
      </span>
      <p class="uppercase text-xs text-text-muted">Total Spent</p>
      <p class="text-2xl">RM 6.2k</p>
      <p class="text-text-caption text-[11px]">across all trips</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleDollarSign, Clock, Plane, UsersRound } from "lucide-vue-next";
</script>
