<template>
  <form class="flex flex-col w-full max-w-2xl gap-2 px-4 sm:px-0" @submit="onSubmit">
    <div class="bg-white rounded-lg flex flex-col p-4 gap-4">
      <p class="text-text-primary text-sm">Budget for this trip</p>
      <div class="w-full border bg-text-muted"></div>

      <div class="flex gap-2 items-start w-full">
        <FormField v-slot="{ componentField }" name="total">
          <FormItem class="w-full">
            <FormLabel class="text-text-muted text-[12px]">
              Total budget
            </FormLabel>
            <Input
              v-bind="componentField"
              type="number"
              min="0"
              placeholder="12000"
            />
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="currency">
          <FormItem class="w-full">
            <FormLabel class="text-text-muted text-[12px]">Currency</FormLabel>
            <Select
              :model-value="componentField.modelValue"
              @update:model-value="componentField['onUpdate:modelValue']"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="c in CURRENCIES" :key="c" :value="c">
                  {{ c }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <FormItem>
        <FormLabel class="text-text-muted text-[12px]">Split mode</FormLabel>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="mode in SPLIT_MODES"
            :key="mode.value"
            type="button"
            :class="
              cn(
                'flex items-center text-[12px] px-2 py-1 rounded-full border cursor-pointer',
                splitValue === mode.value
                  ? 'border-primary-brand text-primary-brand bg-secondary-brand'
                  : 'border-text-caption text-text-caption hover:border-text-muted'
              )
            "
            @click="setSplit(mode.value)"
          >
            {{ mode.label }}
          </button>
        </div>
        <p v-if="splitError" class="text-destructive text-sm">
          {{ splitError }}
        </p>
      </FormItem>

      <FormField v-slot="{ value, handleChange }" name="travelerCount">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">
            Travelers
          </FormLabel>
          <NumberField
            :model-value="value"
            :min="1"
            @update:model-value="handleChange"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Per-person preview -->
      <div
        v-if="perPersonAmount > 0"
        class="flex items-center justify-between bg-background-brand rounded-lg px-3 py-2"
      >
        <p class="text-[12px] text-text-muted">Per person</p>
        <p class="text-[13px] font-medium text-text-primary">
          {{ currencyValue }} {{ perPersonAmount.toLocaleString() }}
        </p>
      </div>
    </div>

    <Alert v-if="submitError" class="bg-[#fdecec] text-[#a8261a]">
      <CircleAlert />
      <AlertTitle class="text-[12px]">{{ submitError }}</AlertTitle>
    </Alert>

    <div class="flex items-center justify-end gap-2">
      <Button size="sm" type="button" variant="outline" @click="draft.goBack">
        Back
      </Button>
      <Button size="sm" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Creating..." : "Create trip" }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { CircleAlert } from "lucide-vue-next";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { budgetSchema } from "@/schemas/trip";
import { useTripDraftStore } from "@/stores/tripDraft";
import { SPLIT_MODES, type SplitMode } from "@/types";
import { useAuthStore } from "@/stores/auth";

const CURRENCIES = ["MYR", "USD", "EUR", "JPY", "GBP", "SGD", "AUD", "CAD"];

const draft = useTripDraftStore();
const auth = useAuthStore();
const router = useRouter();
const submitError = ref<string | null>(null);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(budgetSchema),
  initialValues: {
    total: draft.budget.total,
    currency: draft.budget.currency,
    splitMode: draft.budget.splitMode,
    travelerCount: draft.budget.travelerCount,
  },
});

const {
  value: splitValue,
  setValue: setSplitValue,
  errorMessage: splitError,
} = useField<SplitMode>("splitMode");

const { value: totalValue } = useField<number>("total");
const { value: currencyValue } = useField<string>("currency");
const { value: travelerCountValue } = useField<number>("travelerCount");

const perPersonAmount = computed(() => {
  const total = Number(totalValue.value) || 0;
  const count = Number(travelerCountValue.value) || 1;
  if (total <= 0 || count <= 0) return 0;
  return Math.round((total / count) * 100) / 100;
});

function setSplit(mode: SplitMode) {
  setSplitValue(mode);
}

const onSubmit = handleSubmit(async (values) => {
  submitError.value = null;
  draft.setBudget({
    total: values.total,
    currency: values.currency,
    splitMode: values.splitMode as SplitMode,
    travelerCount: values.travelerCount,
  });
  try {
    const ownerEmail = auth.currentUser?.email ?? "";
    const id = await draft.finalize(ownerEmail);
    router.push({ name: "trip-detail", params: { id } });
  } catch (e) {
    submitError.value =
      e instanceof Error ? e.message : "Failed to create trip";
  }
});
</script>
