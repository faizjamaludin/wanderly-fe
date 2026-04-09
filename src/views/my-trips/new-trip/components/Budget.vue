<template>
  <form class="flex flex-col w-136 gap-2">
    <div class="bg-white rounded-lg flex flex-col p-4 gap-4">
      <!-- title form -->
      <p class="text-text-primary text-sm">Budget for this trip</p>
      <!-- seperator -->
      <div class="w-full border bg-text-muted"></div>

      <!-- start and end date -->
      <div class="flex gap-2 items-center w-full">
        <FormField v-slot="{ componentField }" name="totalBudget">
          <FormItem class="w-full">
            <FormLabel class="text-text-muted text-[12px]"
              >Total Budget</FormLabel
            >
            <Input v-bind="componentField" placeholder="12000" />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="endDate">
          <FormItem class="w-full">
            <FormLabel class="text-text-muted text-[12px]">Currency</FormLabel>
            <Input v-bind="componentField" placeholder="City, Country" />
          </FormItem>
        </FormField>
      </div>

      <!-- trip type -->
      <div class="flex gap-2">
        <span
          class="flex items-center text-[12px] text-text-caption border border-text-caption px-2 py-1 rounded-full"
        >
          Equal Split
        </span>

        <span
          class="flex items-center text-[12px] text-text-caption border border-text-caption px-2 py-1 rounded-full"
        >
          Custom %
        </span>

        <span
          class="flex items-center text-[12px] text-text-caption border border-text-caption px-2 py-1 rounded-full"
        >
          Pay as you go
        </span>
      </div>

      <FormField v-slot="{ componentField }" name="trave">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Trip name</FormLabel>
          <NumberField
            id="age"
            :default-value="4"
            :min="0"
            v-bind="componentField"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </FormItem>
      </FormField>
    </div>
    <div class="flex items-center justify-end gap-2">
      <Button size="sm">Back</Button>
      <Button size="sm">Next</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
</script>
