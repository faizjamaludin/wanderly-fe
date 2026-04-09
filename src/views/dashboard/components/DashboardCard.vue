<template>
  <div class="grid grid-cols-4 gap-4">
    <!-- card my trips -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span class="h-7 w-7 rounded-sm bg-secondary-brand"></span>
      <p class="uppercase text-xs text-text-muted">My Trips</p>
      <p class="text-2xl">3</p>
      <p class="text-text-caption text-[11px]">1 upcoming</p>
    </div>

    <!-- card shared with me -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span class="h-7 w-7 rounded-sm bg-secondary-brand"></span>
      <p class="uppercase text-xs text-text-muted">Shared with Me</p>
      <p class="text-2xl">1</p>
      <p class="text-text-caption text-[11px]">Bali 2025 by Nurul</p>
    </div>

    <!-- card shared with me -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span class="h-7 w-7 rounded-sm bg-secondary-brand"></span>
      <p class="uppercase text-xs text-text-muted">Days to Next trip</p>
      <p class="text-2xl">8</p>
      <p class="text-text-caption text-[11px]">Bali 2025 by Nurul</p>
    </div>

    <!-- card total spent -->
    <div class="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <span class="h-7 w-7 rounded-sm bg-secondary-brand"></span>
      <p class="uppercase text-xs text-text-muted">Total Spent</p>
      <p class="text-2xl">RM 6.2k</p>
      <p class="text-text-caption text-[11px]">across all trips</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
