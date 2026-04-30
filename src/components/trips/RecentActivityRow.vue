<template>
  <div class="flex justify-between items-center p-4 border-b last:border-b-0">
    <div class="flex items-center gap-2">
      <span :class="cn('h-7 w-7 rounded-sm', iconClass)"></span>
      <div class="flex flex-col">
        <p class="text-text-primary text-xs font-medium">{{ title }}</p>
        <span class="flex items-center text-text-muted text-[11px]">
          {{ subtitle }}<template v-if="meta"><Dot /> {{ meta }}</template>
        </span>
      </div>
    </div>
    <p class="text-text-caption text-xs">{{ timestamp }}</p>
  </div>
</template>

<script setup lang="ts">
import { Dot } from "lucide-vue-next";
import { cn } from "@/lib/utils";

defineProps<{
  iconClass: string;
  title: string;
  subtitle: string;
  meta?: string;
  timestamp: string;
}>();
</script>
