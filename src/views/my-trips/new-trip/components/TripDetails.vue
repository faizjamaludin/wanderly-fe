<template>
  <form class="flex flex-col w-full max-w-2xl gap-2 px-4 sm:px-0" @submit="onSubmit">
    <div class="bg-white rounded-lg flex flex-col p-4 gap-4">
      <p class="text-text-primary text-sm">Trip details</p>
      <div class="w-full border bg-text-muted"></div>

      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Trip name</FormLabel>
          <Input v-bind="componentField" placeholder="e.g. Kyoto Spring 2025" />
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="destination">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Destination</FormLabel>
          <Input v-bind="componentField" placeholder="City, Country" />
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="flex gap-2 items-start w-full">
        <FormField v-slot="{ componentField }" name="startDate">
          <FormItem class="w-full">
            <FormLabel class="text-text-muted text-[12px]">Start date</FormLabel>
            <Input v-bind="componentField" type="date" />
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="endDate">
          <FormItem class="w-full">
            <FormLabel class="text-text-muted text-[12px]">End date</FormLabel>
            <Input v-bind="componentField" type="date" />
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <FormItem>
        <FormLabel class="text-text-muted text-[12px]">Trip type</FormLabel>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="t in TRIP_TYPES"
            :key="t"
            type="button"
            :class="
              cn(
                'flex items-center text-[12px] px-2 py-1 rounded-full border cursor-pointer',
                typeValue === t
                  ? 'border-primary-brand text-primary-brand bg-secondary-brand'
                  : 'border-text-caption text-text-caption hover:border-text-muted'
              )
            "
            @click="setType(t)"
          >
            {{ t }}
          </button>
        </div>
        <p v-if="typeError" class="text-destructive text-sm">{{ typeError }}</p>
      </FormItem>

      <FormField v-slot="{ componentField }" name="notes">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Notes</FormLabel>
          <Textarea
            v-bind="componentField"
            placeholder="Anything to remember?"
          />
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="flex items-center justify-end gap-2">
      <Button size="sm" type="button" variant="outline" @click="onCancel">
        Cancel
      </Button>
      <Button size="sm" type="submit" :disabled="isSubmitting">Next</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { tripDetailsSchema } from "@/schemas/trip";
import { useTripDraftStore } from "@/stores/tripDraft";
import { TRIP_TYPES, type TripType } from "@/types";

const draft = useTripDraftStore();
const router = useRouter();

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(tripDetailsSchema),
  initialValues: {
    name: draft.details.name,
    destination: draft.details.destination,
    startDate: draft.details.startDate,
    endDate: draft.details.endDate,
    type: draft.details.type || undefined,
    notes: draft.details.notes,
  },
});

const {
  value: typeValue,
  setValue: setTypeValue,
  errorMessage: typeError,
} = useField<TripType>("type");

function setType(t: TripType) {
  setTypeValue(t);
}

const onSubmit = handleSubmit((values) => {
  draft.setDetails({
    name: values.name,
    destination: values.destination,
    startDate: values.startDate,
    endDate: values.endDate,
    type: values.type as TripType,
    notes: values.notes ?? "",
  });
  draft.goNext();
});

function onCancel() {
  draft.reset();
  router.push("/");
}
</script>
