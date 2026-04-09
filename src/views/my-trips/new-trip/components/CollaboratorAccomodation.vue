<template>
  <form class="flex flex-col w-136 gap-2">
    <div class="bg-white rounded-lg flex flex-col p-4 gap-4">
      <!-- title form -->
      <p class="text-text-primary text-sm">Invite collaborators</p>
      <div class="w-full border bg-text-muted"></div>

      <Alert class="bg-[#e8f1fb] text-[#1a5fa8]">
        <CircleAlert />
        <AlertTitle class="text-[11px]">
          People you invite here can only see this trip — not your other
          itineraries
        </AlertTitle>
      </Alert>

      <div class="flex gap-2 items-center">
        <!-- email -->
        <FormField v-slot="{ componentField }" name="email">
          <FormItem class="w-full">
            <Input v-bind="componentField" placeholder="Email" />
          </FormItem>
        </FormField>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple"> Apple </SelectItem>
          </SelectContent>
        </Select>

        <Button size="sm">Add</Button>
      </div>
    </div>

    <div class="bg-white rounded-lg flex flex-col p-4 gap-4">
      <!-- title form -->
      <p class="text-text-primary text-sm">First accommodation (optional)</p>
      <div class="w-full border bg-text-muted"></div>

      <!-- hotel / property name -->
      <FormField v-slot="{ componentField }" name="accomodationName">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]"
            >Hotel / property name</FormLabel
          >
          <Input v-bind="componentField" placeholder="e.g. Kyoto Grand Hotel" />
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
      <!-- confirmation no. -->
      <FormField v-slot="{ componentField }" name="confirmationNum">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">
            Confirmation no.
          </FormLabel>
          <Input v-bind="componentField" placeholder="Optional" />
        </FormItem>
      </FormField>
    </div>
    <div class="flex items-center justify-end gap-2">
      <Button size="sm">Cancel</Button>
      <Button size="sm">Next</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleAlert } from "lucide-vue-next";
</script>
