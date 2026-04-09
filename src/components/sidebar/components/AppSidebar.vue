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
              <SidebarMenuButton
                as-child
                class="text-[13px] text-text-muted hover:bg-secondary-brand hover:text-primary-brand"
                :class="{
                  'bg-secondary-brand text-primary-brand  ':
                    route.path === child.url,
                }"
              >
                <RouterLink :to="child.url">
                  <component :is="child.icon" />
                  <span>{{ child.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
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

const route = useRoute();
</script>
