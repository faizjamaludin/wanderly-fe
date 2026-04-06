<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex sticky top-0 shadow-xs bg-[#FDFDFD] h-fit py-3 md:py-4 shrink-0 items-center justify-center gap-2 px-4 md:px-6 z-10"
      ></header>
      <div class="flex flex-1 flex-col items-center gap-4 pb-0">
        <div class="w-full h-full bg-background-brand p-4">
          <router-view />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import AppSidebar from "../components/sidebar/components/AppSidebar.vue";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
</script>
