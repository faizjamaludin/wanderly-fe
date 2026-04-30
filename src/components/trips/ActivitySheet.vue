<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent side="right" class="w-full sm:max-w-md overflow-y-auto">
      <SheetHeader class="mb-4">
        <SheetTitle>{{ editing ? "Edit activity" : "Add activity" }}</SheetTitle>
        <SheetDescription>
          {{ editing ? "Update this activity's details." : "Add a new activity to your itinerary." }}
        </SheetDescription>
      </SheetHeader>

      <form class="flex flex-col gap-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel class="text-text-muted text-[12px]">Activity name</FormLabel>
            <Input v-bind="componentField" placeholder="e.g. Fushimi Inari hike" />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Category</FormLabel>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in ACTIVITY_CATEGORIES"
              :key="cat.value"
              type="button"
              :class="
                cn(
                  'flex items-center gap-1 text-[12px] px-2 py-1 rounded-full border cursor-pointer',
                  categoryValue === cat.value
                    ? 'border-primary-brand text-primary-brand bg-secondary-brand'
                    : 'border-text-caption text-text-caption hover:border-text-muted'
                )
              "
              @click="setCategoryValue(cat.value)"
            >
              {{ cat.emoji }} {{ cat.label }}
            </button>
          </div>
          <p v-if="categoryError" class="text-destructive text-sm">{{ categoryError }}</p>
        </FormItem>

        <div class="flex gap-2">
          <FormField v-slot="{ componentField }" name="date">
            <FormItem class="flex-1">
              <FormLabel class="text-text-muted text-[12px]">Date</FormLabel>
              <Input v-bind="componentField" type="date" :min="minDate" :max="maxDate" />
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="time">
            <FormItem class="flex-1">
              <FormLabel class="text-text-muted text-[12px]">Time (optional)</FormLabel>
              <Input v-bind="componentField" type="time" />
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ componentField }" name="location">
          <FormItem>
            <FormLabel class="text-text-muted text-[12px]">Location (optional)</FormLabel>
            <Input v-bind="componentField" placeholder="e.g. Fushimi-ku, Kyoto" />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="notes">
          <FormItem>
            <FormLabel class="text-text-muted text-[12px]">Notes (optional)</FormLabel>
            <Textarea v-bind="componentField" placeholder="Any tips or reminders?" />
            <FormMessage />
          </FormItem>
        </FormField>

        <SheetFooter class="mt-2">
          <SheetClose as-child>
            <Button type="button" variant="outline" size="sm">Cancel</Button>
          </SheetClose>
          <Button type="submit" size="sm" :disabled="isSubmitting">
            {{ editing ? "Save changes" : "Add activity" }}
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ACTIVITY_CATEGORIES, type Activity, type ActivityCategory } from "@/types";
import type { ActivityInput } from "@/repositories/types";

const props = defineProps<{
  open: boolean;
  minDate: string;
  maxDate: string;
  defaultDate?: string;
  editing?: Activity | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  save: [input: ActivityInput];
}>();

const activitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(
    ACTIVITY_CATEGORIES.map((c) => c.value) as [ActivityCategory, ...ActivityCategory[]]
  ),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: toTypedSchema(activitySchema),
});

const { value: categoryValue, setValue: setCategoryValue, errorMessage: categoryError } =
  useField<ActivityCategory>("category");

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm({
        values: {
          name: props.editing?.name ?? "",
          category: props.editing?.category ?? ("sightseeing" as ActivityCategory),
          date: props.editing?.date ?? props.defaultDate ?? props.minDate,
          time: props.editing?.time ?? "",
          location: props.editing?.location ?? "",
          notes: props.editing?.notes ?? "",
        },
      });
    }
  }
);

const onSubmit = handleSubmit((values) => {
  emit("save", {
    name: values.name,
    category: values.category,
    date: values.date,
    time: values.time || undefined,
    location: values.location || undefined,
    notes: values.notes || undefined,
  });
  emit("update:open", false);
});
</script>
