<template>
  <div class="flex flex-col gap-6">

    <!-- ── Hero greeting ─────────────────────────────────────────── -->
    <div
      class="relative rounded-2xl overflow-hidden p-6 flex flex-col gap-1 min-h-[130px] justify-end"
      style="background: linear-gradient(140deg, #1e5631 0%, #40916c 55%, #74c69d 100%)"
    >
      <!-- dot texture -->
      <div
        class="absolute inset-0 opacity-[0.06]"
        style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 18px 18px;"
      ></div>
      <!-- large watermark word -->
      <span class="absolute right-6 bottom-3 text-[72px] font-black text-white/5 leading-none select-none tracking-tighter">
        Wander
      </span>

      <div class="relative flex items-end justify-between gap-4">
        <div>
          <p class="text-white/70 text-sm">{{ greetingTime }},</p>
          <h1 class="text-white text-2xl font-bold leading-tight mt-0.5">{{ auth.currentUser?.name ?? "Traveler" }} ✈️</h1>
          <p class="text-white/60 text-xs mt-1">{{ heroSubtitle }}</p>
        </div>
        <RouterLink :to="{ name: 'new-trip' }">
          <Button size="sm" class="bg-white text-primary-brand hover:bg-white/90 shrink-0 gap-1 shadow-sm">
            <Plus :size="14" /> New trip
          </Button>
        </RouterLink>
      </div>
    </div>

    <!-- ── Stat cards ─────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <!-- My Trips -->
      <div class="bg-white rounded-2xl p-4 flex flex-col gap-3 border border-transparent hover:border-secondary-brand transition-colors">
        <div class="flex items-center justify-between">
          <span class="h-8 w-8 rounded-xl bg-secondary-brand flex items-center justify-center text-primary-brand">
            <Plane :size="16" />
          </span>
          <span class="text-[11px] text-text-caption font-medium">Total</span>
        </div>
        <div>
          <p class="text-3xl font-bold text-text-primary">{{ myTripsCount }}</p>
          <p class="text-xs text-text-muted mt-0.5">My trips</p>
        </div>
        <p class="text-[11px] text-primary-brand font-medium">{{ upcomingCount }} upcoming</p>
      </div>

      <!-- Next trip countdown -->
      <div
        v-if="nextTrip"
        class="rounded-2xl p-4 flex flex-col gap-3 text-white"
        :style="heroGradients[nextTrip.trip.type] ?? heroGradients.Cultural"
      >
        <div class="flex items-center justify-between">
          <span class="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
            <CalendarDays :size="16" class="text-white" />
          </span>
          <span class="text-[11px] text-white/70 font-medium">Next trip</span>
        </div>
        <div>
          <p class="text-3xl font-bold">{{ daysToNext }}</p>
          <p class="text-xs text-white/80 mt-0.5">{{ daysToNext === 1 ? 'day' : 'days' }} away</p>
        </div>
        <p class="text-[11px] font-medium truncate text-white/80">{{ nextTrip.trip.name }}</p>
      </div>
      <div
        v-else
        class="bg-white rounded-2xl p-4 flex flex-col gap-3 border border-transparent hover:border-secondary-brand transition-colors"
      >
        <div class="flex items-center justify-between">
          <span class="h-8 w-8 rounded-xl bg-secondary-brand flex items-center justify-center text-primary-brand">
            <CalendarDays :size="16" />
          </span>
          <span class="text-[11px] text-text-caption font-medium">Next trip</span>
        </div>
        <div>
          <p class="text-3xl font-bold text-text-primary">—</p>
          <p class="text-xs text-text-muted mt-0.5">No trips planned</p>
        </div>
        <p class="text-[11px] text-text-caption font-medium">Plan something ✈️</p>
      </div>

      <!-- Shared with me -->
      <div class="bg-white rounded-2xl p-4 flex flex-col gap-3 border border-transparent hover:border-[#e0dcfc] transition-colors">
        <div class="flex items-center justify-between">
          <span class="h-8 w-8 rounded-xl bg-[#f0effe] flex items-center justify-center text-[#5b4fcf]">
            <UsersRound :size="16" />
          </span>
          <span class="text-[11px] text-text-caption font-medium">Shared</span>
        </div>
        <div>
          <p class="text-3xl font-bold text-text-primary">{{ sharedCount }}</p>
          <p class="text-xs text-text-muted mt-0.5">Shared with me</p>
        </div>
        <p class="text-[11px] text-[#5b4fcf] font-medium truncate">{{ sharedHint }}</p>
      </div>

      <!-- Budget overview -->
      <div class="bg-white rounded-2xl p-4 flex flex-col gap-3 border border-transparent hover:border-[#fde8c8] transition-colors">
        <div class="flex items-center justify-between">
          <span class="h-8 w-8 rounded-xl bg-[#fef3e2] flex items-center justify-center text-[#b5580a]">
            <CircleDollarSign :size="16" />
          </span>
          <span class="text-[11px] text-text-caption font-medium">Budget</span>
        </div>
        <div>
          <p class="text-3xl font-bold text-text-primary">{{ totalBudgetLabel }}</p>
          <p class="text-xs text-text-muted mt-0.5">Total planned</p>
        </div>
        <p class="text-[11px] text-[#b5580a] font-medium">{{ pendingPaymentsCount }} payment{{ pendingPaymentsCount === 1 ? '' : 's' }} pending</p>
      </div>
    </div>

    <!-- ── Next trip spotlight ─────────────────────────────────────── -->
    <div v-if="nextTrip" class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Next adventure</p>
        <RouterLink :to="{ name: 'trip-detail', params: { id: nextTrip.trip.id } }">
          <Button variant="link" size="sm" class="text-xs h-auto p-0">Open itinerary →</Button>
        </RouterLink>
      </div>

      <RouterLink
        :to="{ name: 'trip-detail', params: { id: nextTrip.trip.id } }"
        class="relative rounded-2xl overflow-hidden flex flex-col justify-end p-5 min-h-[140px] group"
        :style="heroGradients[nextTrip.trip.type] ?? heroGradients.Cultural"
      >
        <!-- dot texture -->
        <div class="absolute inset-0 opacity-[0.06]"
          style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 18px 18px;"></div>
        <!-- watermark -->
        <span class="absolute right-5 top-1/2 -translate-y-1/2 text-[80px] font-black text-white/5 leading-none select-none tracking-tighter">
          {{ nextTrip.trip.destination.split(',')[0] }}
        </span>

        <div class="relative flex items-end justify-between gap-4">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[11px] font-semibold text-white/80 bg-black/20 px-2 py-0.5 rounded-full">{{ nextTrip.trip.type }}</span>
              <span class="text-[11px] font-bold bg-secondary-brand text-primary-brand px-2 py-0.5 rounded-full">
                {{ daysToNext === 0 ? 'Today!' : daysToNext === 1 ? 'Tomorrow' : `In ${daysToNext} days` }}
              </span>
            </div>
            <h2 class="text-white text-xl font-bold mt-1">{{ nextTrip.trip.name }}</h2>
            <p class="text-white/70 text-sm flex items-center gap-1">
              <MapPin :size="12" />{{ nextTrip.trip.destination }}
            </p>
            <p class="text-white/50 text-xs">{{ formatRange(nextTrip.trip.startDate, nextTrip.trip.endDate) }}</p>
          </div>

          <div class="flex flex-col items-end gap-2 shrink-0">
            <!-- collaborator avatars -->
            <div class="flex -space-x-2">
              <div
                v-for="c in nextTrip.trip.collaborators.slice(0, 4)"
                :key="c.email"
                :title="c.email"
                class="w-7 h-7 rounded-full border-2 border-white/60 flex items-center justify-center text-[10px] font-bold text-white"
                :style="{ backgroundColor: avatarColor(c.email) }"
              >
                {{ c.email[0].toUpperCase() }}
              </div>
            </div>
            <!-- budget pill -->
            <span class="text-[11px] font-semibold text-white bg-black/20 px-2.5 py-1 rounded-full">
              {{ nextTrip.trip.budget.currency }} {{ nextTrip.trip.budget.total.toLocaleString() }}
            </span>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- ── Pending payments alert ──────────────────────────────────── -->
    <div v-if="pendingPayments.length > 0" class="flex flex-col gap-3">
      <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Awaiting payment</p>
      <div class="flex flex-col gap-2">
        <div
          v-for="item in pendingPayments"
          :key="item.key"
          class="bg-white rounded-xl px-4 py-3 flex items-center justify-between border-l-4 border-[#f4a100]"
        >
          <div class="flex items-center gap-3">
            <span class="h-8 w-8 rounded-lg bg-[#fef3e2] flex items-center justify-center text-[#b5580a] shrink-0">
              <CircleDollarSign :size="15" />
            </span>
            <div>
              <p class="text-sm font-medium text-text-primary">{{ item.tripName }}</p>
              <p class="text-xs text-text-muted">{{ item.email || 'Unnamed' }} · {{ item.currency }} {{ item.amount.toLocaleString() }}</p>
            </div>
          </div>
          <RouterLink :to="{ name: 'trip-detail', params: { id: item.tripId } }">
            <Button variant="outline" size="sm" class="text-xs">View</Button>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- ── My trips strip ──────────────────────────────────────────── -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">My trips</p>
        <RouterLink :to="{ name: 'mytrip' }">
          <Button variant="link" size="sm" class="text-xs h-auto p-0">See all →</Button>
        </RouterLink>
      </div>

      <div v-if="tripsStore.loading && tripsStore.list.length === 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Skeleton v-for="i in 4" :key="i" class="h-44 rounded-2xl" />
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <TripCard
          v-for="trip in recentTrips"
          :key="trip.id"
          :trip="trip"
        />
        <RouterLink
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

    <!-- ── Recent activity ────────────────────────────────────────── -->
    <div class="flex flex-col gap-3">
      <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Recent activity</p>

      <div class="bg-white rounded-2xl overflow-hidden">
        <p v-if="activity.length === 0" class="p-5 text-text-caption text-xs text-center">
          No activity yet — create a trip to get started.
        </p>
        <div v-else>
          <div
            v-for="(event, idx) in activity"
            :key="event.id"
            :class="['flex items-center gap-3 px-4 py-3', idx < activity.length - 1 ? 'border-b border-border' : '']"
          >
            <span :class="['h-8 w-8 rounded-xl flex items-center justify-center shrink-0', event.iconBg]">
              <component :is="event.icon" :size="15" :class="event.iconColor" />
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-primary truncate">{{ event.title }}</p>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="text-[11px] text-text-caption truncate">{{ event.tripName }}</span>
                <span class="text-text-caption text-[11px]">·</span>
                <span
                  :class="[
                    'text-[10px] font-medium px-1.5 py-px rounded-full truncate max-w-[140px]',
                    event.actor === auth.currentUser?.email
                      ? 'bg-secondary-brand text-primary-brand'
                      : 'bg-[#f0effe] text-[#5b4fcf]'
                  ]"
                >
                  {{ event.actor === auth.currentUser?.email ? 'You' : event.actor }}
                </span>
              </div>
            </div>
            <p class="text-[11px] text-text-caption shrink-0">{{ event.timestamp }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import {
  CalendarDays, CircleDollarSign, Hotel, MapPin, Pencil, Plane,
  Plus, Sparkles, Trash2, UserCheck, UserMinus, Users, Wallet, UsersRound
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import TripCard from "@/components/trips/TripCard.vue";
import { daysUntil, formatRange, timeAgo, tripStatus } from "@/lib/dates";
import { useAuthStore } from "@/stores/auth";
import { useTripsStore } from "@/stores/trips";
import type { Component } from "vue";

const auth = useAuthStore();
const tripsStore = useTripsStore();

const heroGradients: Record<string, string> = {
  Cultural:  "background: linear-gradient(140deg, #1e5631 0%, #40916c 60%, #52b788 100%)",
  Beach:     "background: linear-gradient(140deg, #023e8a 0%, #0096c7 60%, #48cae4 100%)",
  Adventure: "background: linear-gradient(140deg, #4d2600 0%, #c36b00 60%, #f4a261 100%)",
  Food:      "background: linear-gradient(140deg, #7b0d1e 0%, #c1121f 60%, #e85d04 100%)",
  Business:  "background: linear-gradient(140deg, #1a1a2e 0%, #3d3d5c 60%, #6c757d 100%)",
};

// ── Greeting ─────────────────────────────────────────────────────
const greetingTime = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
});

// ── Derived lists ─────────────────────────────────────────────────
const ownedTrips = computed(() =>
  tripsStore.list.filter((t) => t.ownerId === auth.currentUser?.id)
);
const sharedTrips = computed(() =>
  tripsStore.list.filter((t) => t.ownerId !== auth.currentUser?.id)
);

const myTripsCount = computed(() => ownedTrips.value.length);
const sharedCount = computed(() => sharedTrips.value.length);

const upcomingCount = computed(() =>
  ownedTrips.value.filter((t) => tripStatus(t.startDate, t.endDate) === "upcoming").length
);

const sharedHint = computed(() => {
  const next = sharedTrips.value[0];
  return next ? next.name : "Nothing shared yet";
});

const nextTrip = computed(() => {
  const upcoming = tripsStore.list
    .filter((t) => tripStatus(t.startDate, t.endDate) === "upcoming")
    .map((t) => ({ trip: t, days: daysUntil(t.startDate) }))
    .filter((x) => x.days >= 0)
    .sort((a, b) => a.days - b.days);
  return upcoming[0] ?? null;
});

const daysToNext = computed(() => nextTrip.value?.days ?? null);

const heroSubtitle = computed(() => {
  if (!nextTrip.value) return "Where will you go next?";
  const d = daysToNext.value;
  if (d === 0) return "Your trip starts today — have an amazing journey!";
  if (d === 1) return "Your next adventure is tomorrow. Ready?";
  return `${d} days until ${nextTrip.value.trip.name}.`;
});

// ── Budget stats ──────────────────────────────────────────────────
const totalByCurrency = computed(() => {
  const map = new Map<string, number>();
  for (const t of tripsStore.list) {
    map.set(t.budget.currency, (map.get(t.budget.currency) ?? 0) + t.budget.total);
  }
  return map;
});

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toLocaleString();
}

const totalBudgetLabel = computed(() => {
  const entries = Array.from(totalByCurrency.value.entries());
  if (entries.length === 0) return "—";
  const [currency, total] = entries.sort((a, b) => b[1] - a[1])[0];
  return `${currency} ${formatCompact(total)}`;
});

// ── Pending payments ──────────────────────────────────────────────
const pendingPayments = computed(() => {
  const result: { key: string; tripId: string; tripName: string; email: string; amount: number; currency: string }[] = [];
  for (const t of tripsStore.list) {
    for (const s of t.budget.splits) {
      if (s.paymentStatus === "unpaid" && s.amount > 0) {
        result.push({
          key: `${t.id}-${s.email}`,
          tripId: t.id,
          tripName: t.name,
          email: s.email,
          amount: s.amount,
          currency: t.budget.currency,
        });
      }
    }
  }
  return result.slice(0, 4);
});

const pendingPaymentsCount = computed(() => pendingPayments.value.length);

// ── Recent trips strip ────────────────────────────────────────────
const recentTrips = computed(() =>
  [...tripsStore.list]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
);

// ── Activity feed ─────────────────────────────────────────────────
interface ActivityEvent {
  id: string;
  icon: Component;
  iconBg: string;
  iconColor: string;
  title: string;
  actor: string;
  tripName: string;
  timestamp: string;
  sortKey: number;
}

type AuditMeta = { icon: Component; iconBg: string; iconColor: string };

const auditMeta: Record<string, AuditMeta> = {
  "trip.created":            { icon: Sparkles,   iconBg: "bg-secondary-brand",  iconColor: "text-primary-brand" },
  "trip.updated":            { icon: Pencil,      iconBg: "bg-[#f0effe]",        iconColor: "text-[#5b4fcf]" },
  "activity.added":          { icon: Plus,        iconBg: "bg-secondary-brand",  iconColor: "text-primary-brand" },
  "activity.updated":        { icon: Pencil,      iconBg: "bg-[#e8f1fb]",        iconColor: "text-[#1a5fa8]" },
  "activity.removed":        { icon: Trash2,      iconBg: "bg-[#fdecec]",        iconColor: "text-destructive" },
  "accommodation.added":     { icon: Hotel,       iconBg: "bg-[#e8f1fb]",        iconColor: "text-[#1a5fa8]" },
  "accommodation.removed":   { icon: Trash2,      iconBg: "bg-[#fdecec]",        iconColor: "text-destructive" },
  "collaborator.invited":    { icon: UserCheck,   iconBg: "bg-[#f0effe]",        iconColor: "text-[#5b4fcf]" },
  "collaborator.removed":    { icon: UserMinus,   iconBg: "bg-[#fdecec]",        iconColor: "text-destructive" },
  "collaborator.role_changed":{ icon: Users,      iconBg: "bg-[#f0effe]",        iconColor: "text-[#5b4fcf]" },
  "payment.marked_paid":     { icon: Wallet,      iconBg: "bg-secondary-brand",  iconColor: "text-primary-brand" },
  "payment.marked_unpaid":   { icon: Wallet,      iconBg: "bg-[#fef3e2]",        iconColor: "text-[#b5580a]" },
};

const activity = computed<ActivityEvent[]>(() => {
  const events: ActivityEvent[] = [];

  for (const trip of tripsStore.list) {
    for (const entry of trip.auditLog ?? []) {
      const meta = auditMeta[entry.action] ?? auditMeta["trip.updated"];
      events.push({
        id: entry.id,
        icon: meta.icon,
        iconBg: meta.iconBg,
        iconColor: meta.iconColor,
        title: entry.label,
        actor: entry.actorEmail,
        tripName: trip.name,
        timestamp: timeAgo(entry.at),
        sortKey: new Date(entry.at).getTime(),
      });
    }
  }

  return events.sort((a, b) => b.sortKey - a.sortKey).slice(0, 8);
});

// ── Helpers ───────────────────────────────────────────────────────
function avatarColor(email: string): string {
  const colors = ["#1b6ca8", "#6b4226", "#c1121f", "#6a2d6a", "#2d4a6a", "#2d6a4f"];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
</script>
