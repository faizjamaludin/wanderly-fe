<template>
  <form>
    <div class="bg-white rounded-lg flex flex-col w-136 p-4 gap-4">
      <!-- title form -->
      <p class="text-text-primary text-sm">Trip details</p>
      <div class="w-full border bg-text-muted"></div>

      <!-- trip name -->
      <FormField v-slot="{ componentField }" name="tripName">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Trip name</FormLabel>
          <Input v-bind="componentField" placeholder="e.g. Kyoto Spring 2025" />
        </FormItem>
      </FormField>

      <!-- destination`` -->
      <FormField v-slot="{ componentField }" name="destination">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Destination</FormLabel>
          <Input v-bind="componentField" placeholder="City, Country" />
        </FormItem>
      </FormField>

      <!-- start and end date -->
      <div class="flex gap-2 items-center w-full">
        <FormField v-slot="{ componentField }" name="startDate">
          <FormItem class="w-full">
            <FormLabel class="text-text-muted text-[12px]"
              >Start date</FormLabel
            >
            <Input v-bind="componentField" placeholder="City, Country" />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="endDate">
          <FormItem class="w-full">
            <FormLabel class="text-text-muted text-[12px]">End date</FormLabel>
            <Input v-bind="componentField" placeholder="City, Country" />
          </FormItem>
        </FormField>
      </div>

      <!-- trip type -->
      <div class="flex gap-2">
        <span
          class="flex items-center text-[12px] text-text-caption border border-text-caption px-2 py-1 rounded-full"
        >
          Cultural
        </span>

        <span
          class="flex items-center text-[12px] text-text-caption border border-text-caption px-2 py-1 rounded-full"
        >
          Beach
        </span>

        <span
          class="flex items-center text-[12px] text-text-caption border border-text-caption px-2 py-1 rounded-full"
        >
          Adventure
        </span>

        <span
          class="flex items-center text-[12px] text-text-caption border border-text-caption px-2 py-1 rounded-full"
        >
          Food
        </span>

        <span
          class="flex items-center text-[12px] text-text-caption border border-text-caption px-2 py-1 rounded-full"
        >
          Business
        </span>
      </div>

      <FormField v-slot="{ componentField }" name="destination">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Notes</FormLabel>
          <Input v-bind="componentField" placeholder="City, Country" />
        </FormItem>
      </FormField>
    </div>
  </form>
</template>

<script setup lang="ts">
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
</script>
