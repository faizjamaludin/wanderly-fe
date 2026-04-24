<template>
  <Sidebar>
    <SidebarHeader></SidebarHeader>
    <SidebarContent>
      <SidebarGroup v-for="item in mainSidebar">
        <SidebarGroupLabel class="uppercase text-[10px] text-[#a09e97]">{{
          item.title
        }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="child in item.items">
              <SidebarMenuButton class="text-[13px] text-text-muted">
                <component :is="child.icon" />
                <a :href="child.url">{{ child.title }}</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { mainSidebar } from "../config";
import SidebarMenuItem from "@/components/ui/sidebar/SidebarMenuItem.vue";
import SidebarMenuButton from "@/components/ui/sidebar/SidebarMenuButton.vue";
</script>
