<template>
  <div class="flex flex-col gap-4 max-w-xl">
    <div class="bg-white rounded-lg p-6 flex flex-col gap-3">
      <p class="uppercase text-xs text-text-muted font-medium">Profile</p>
      <div class="flex flex-col gap-1">
        <p class="text-text-caption text-[12px]">Name</p>
        <p class="text-text-primary text-sm">
          {{ auth.currentUser?.name ?? "—" }}
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-text-caption text-[12px]">Email</p>
        <p class="text-text-primary text-sm">
          {{ auth.currentUser?.email ?? "—" }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-lg p-6 flex items-center justify-between">
      <div class="flex flex-col">
        <p class="text-text-primary text-sm">Dark mode</p>
        <p class="text-text-caption text-[11px]">
          Toggle the app's color theme
        </p>
      </div>
      <button
        type="button"
        :class="
          cn(
            'relative h-6 w-11 rounded-full transition-colors',
            isDark ? 'bg-primary-brand' : 'bg-text-caption/40'
          )
        "
        @click="toggleDark"
      >
        <span
          :class="
            cn(
              'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform',
              isDark && 'translate-x-5'
            )
          "
        />
      </button>
    </div>

    <div class="bg-white rounded-lg p-6 flex items-center justify-between">
      <div class="flex flex-col">
        <p class="text-text-primary text-sm">Sign out</p>
        <p class="text-text-caption text-[11px]">
          End your session on this device.
        </p>
      </div>
      <RouterLink :to="{ name: 'logout' }">
        <Button size="sm" variant="outline">Log out</Button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const THEME_KEY = "wanderly:theme";
const isDark = ref(false);

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

function toggleDark() {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
  localStorage.setItem(THEME_KEY, isDark.value ? "dark" : "light");
}

onMounted(() => {
  isDark.value = localStorage.getItem(THEME_KEY) === "dark";
  applyTheme(isDark.value);
});
</script>
