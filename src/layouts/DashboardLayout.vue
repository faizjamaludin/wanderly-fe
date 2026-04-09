<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex sticky top-0 shadow-xs bg-[#FDFDFD] h-fit py-3 md:py-4 shrink-0 items-center justify-between gap-2 px-4 md:px-6 z-10"
      >
        <div class="flex flex-col leading-5">
          <p class="text-[15px] text-text-primary">Dashboard</p>
          <p class="text-[12px] text-text-muted">Welcome back, Faiz</p>
        </div>
        <RouterLink :to="{ name: 'new-trip' }" asChild>
          <Button
            variant="outline"
            size="sm"
            class="text-text-muted text-[12px]"
            ><Plus /> New trip</Button
          >
        </RouterLink>
      </header>
      <div class="flex flex-1 flex-col items-center gap-4 pb-0">
        <div class="w-full h-full bg-background-brand p-4">
          <router-view />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import AppSidebar from "../components/sidebar/components/AppSidebar.vue";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { Plus } from "lucide-vue-next";
</script>
