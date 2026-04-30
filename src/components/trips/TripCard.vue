<template>
  <RouterLink
    :to="{ name: 'trip-detail', params: { id: trip.id } }"
    class="group flex flex-col rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-transparent hover:border-white"
  >
    <!-- Gradient header with texture -->
    <div
      class="relative h-28 flex flex-col justify-between p-3.5"
      :style="{ background: heroGradient }"
    >
      <!-- Dot texture -->
      <div
        class="absolute inset-0 opacity-[0.07]"
        style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 16px 16px;"
      ></div>

      <!-- Destination watermark -->
      <div class="absolute bottom-2 right-3 text-white/10 text-4xl font-black uppercase tracking-tighter leading-none select-none truncate max-w-[80%]">
        {{ destinationShort }}
      </div>

      <!-- Top: type pill -->
      <div class="relative flex items-start justify-between">
        <span class="text-[10px] font-semibold text-white/90 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
          {{ trip.type }}
        </span>
        <!-- Status badge -->
        <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full', statusChipClass]">
          {{ statusLabel }}
        </span>
      </div>

      <!-- Bottom: avatars + countdown -->
      <div class="relative flex items-end justify-between">
        <div class="flex -space-x-1.5">
          <div
            v-for="c in trip.collaborators.slice(0, 3)"
            :key="c.email"
            :title="c.email"
            class="w-5 h-5 rounded-full border-[1.5px] border-white/70 flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
            :style="{ backgroundColor: avatarColor(c.email) }"
          >
            {{ c.email[0].toUpperCase() }}
          </div>
          <div
            v-if="trip.collaborators.length > 3"
            class="w-5 h-5 rounded-full border-[1.5px] border-white/70 bg-black/25 flex items-center justify-center text-[9px] text-white"
          >
            +{{ trip.collaborators.length - 3 }}
          </div>
        </div>
        <span class="text-[10px] text-white/75 font-mono tabular-nums bg-black/15 px-1.5 py-0.5 rounded">
          {{ countdownLabel }}
        </span>
      </div>
    </div>

    <!-- Card body -->
    <div class="flex flex-col px-3.5 pt-2.5 pb-3 gap-0.5">
      <p class="text-[13px] font-semibold text-text-primary leading-snug line-clamp-1 group-hover:text-primary-brand transition-colors duration-200">
        {{ trip.name }}
      </p>
      <div class="flex items-center gap-1 text-[11px] text-text-caption mt-0.5">
        <MapPin :size="10" class="shrink-0 text-text-caption" />
        <span class="truncate">{{ trip.destination }}</span>
      </div>
      <p class="text-[10px] text-text-caption/70 mt-1 tabular-nums">
        {{ formatRange(trip.startDate, trip.endDate) }}
      </p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { MapPin } from "lucide-vue-next";
import { formatRange, tripStatus, daysUntil } from "@/lib/dates";
import type { Trip } from "@/types";

const props = defineProps<{ trip: Trip }>();

const status = computed(() => tripStatus(props.trip.startDate, props.trip.endDate));

const statusLabel = computed(() => {
  if (status.value === "upcoming") return "Upcoming";
  if (status.value === "ongoing") return "Now";
  return "Past";
});

const statusChipClass = computed(() => {
  if (status.value === "upcoming") return "bg-secondary-brand text-primary-brand";
  if (status.value === "ongoing") return "bg-[#dbeeff] text-[#1a5fa8]";
  return "bg-white/20 text-white/70";
});

const heroGradients: Record<string, string> = {
  Cultural:  "linear-gradient(140deg, #1e5631 0%, #40916c 60%, #52b788 100%)",
  Beach:     "linear-gradient(140deg, #023e8a 0%, #0096c7 60%, #48cae4 100%)",
  Adventure: "linear-gradient(140deg, #4d2600 0%, #c36b00 60%, #f4a261 100%)",
  Food:      "linear-gradient(140deg, #7b0d1e 0%, #c1121f 60%, #e85d04 100%)",
  Business:  "linear-gradient(140deg, #1a1a2e 0%, #3d3d5c 60%, #6c757d 100%)",
};

const heroGradient = computed(() =>
  heroGradients[props.trip.type] ?? heroGradients.Cultural
);

// First word of destination for watermark
const destinationShort = computed(() =>
  props.trip.destination.split(",")[0].trim()
);

const countdownLabel = computed(() => {
  if (status.value === "ongoing") return "● Live";
  if (status.value === "past") {
    const start = new Date(props.trip.startDate);
    const end = new Date(props.trip.endDate);
    const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
    return `${days}d`;
  }
  const days = daysUntil(props.trip.startDate);
  if (days === 0) return "Today!";
  if (days === 1) return "Tomorrow";
  return `in ${days}d`;
});

function avatarColor(email: string): string {
  const colors = ["#1b6ca8", "#6b4226", "#c1121f", "#6a2d6a", "#2d4a6a", "#2d6a4f"];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
</script>
