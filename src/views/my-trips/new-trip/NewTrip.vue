<template>
  <div class="flex flex-col items-center gap-6">
    <ol class="flex items-center gap-2 text-[12px]">
      <li
        v-for="(step, idx) in steps"
        :key="step.key"
        class="flex items-center gap-2"
      >
        <span
          :class="
            cn(
              'h-6 w-6 rounded-full flex items-center justify-center border',
              idx === draft.stepIndex
                ? 'bg-primary-brand text-white border-primary-brand'
                : idx < draft.stepIndex
                  ? 'bg-secondary-brand text-primary-brand border-primary-brand'
                  : 'bg-white text-text-caption border-text-caption'
            )
          "
        >
          {{ idx + 1 }}
        </span>
        <span
          :class="
            idx === draft.stepIndex
              ? 'text-text-primary'
              : 'text-text-muted'
          "
        >
          {{ step.label }}
        </span>
        <span
          v-if="idx < steps.length - 1"
          class="w-8 border-t border-text-caption mx-1"
        ></span>
      </li>
    </ol>

    <component :is="activeComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from "vue";
import { cn } from "@/lib/utils";
import { useTripDraftStore, STEP_ORDER } from "@/stores/tripDraft";
import TripDetails from "./components/TripDetails.vue";
import CollaboratorAccomodation from "./components/CollaboratorAccomodation.vue";
import Budget from "./components/Budget.vue";

const draft = useTripDraftStore();

const steps = [
  { key: "details", label: "Trip details" },
  { key: "stay", label: "Collaborators & stay" },
  { key: "budget", label: "Budget" },
] as const;

const stepComponents = {
  details: TripDetails,
  stay: CollaboratorAccomodation,
  budget: Budget,
} as const;

const activeComponent = computed(
  () => stepComponents[draft.currentStep as (typeof STEP_ORDER)[number]]
);

onBeforeUnmount(() => {
  draft.reset();
});
</script>
