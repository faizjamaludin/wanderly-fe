<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent side="right" class="w-full sm:max-w-md overflow-y-auto">
      <SheetHeader>
        <SheetTitle>{{ editing ? "Edit expense" : "Add expense" }}</SheetTitle>
        <SheetDescription>
          {{ editing ? "Update this expense." : "Log a payment and split it among trip members." }}
        </SheetDescription>
      </SheetHeader>

      <form class="flex flex-col gap-4 px-4 pb-4" @submit="onSubmit">
        <!-- Description -->
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel class="text-text-muted text-[12px]">Description</FormLabel>
            <Input v-bind="componentField" placeholder="e.g. Lunch at Nasi Kandar" class="mt-1" />
            <FormMessage class="text-[11px]" />
          </FormItem>
        </FormField>

        <!-- Amount + Paid by -->
        <div class="flex gap-3">
          <FormField v-slot="{ componentField }" name="amount">
            <FormItem class="flex-1">
              <FormLabel class="text-text-muted text-[12px]">Amount ({{ currency }})</FormLabel>
              <Input v-bind="componentField" type="number" min="0" step="0.01" placeholder="0.00" class="mt-1" />
              <FormMessage class="text-[11px]" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="paidBy">
            <FormItem class="flex-1">
              <FormLabel class="text-text-muted text-[12px]">Paid by</FormLabel>
              <Select
                :model-value="componentField.modelValue"
                @update:model-value="componentField['onUpdate:modelValue']"
              >
                <SelectTrigger class="mt-1 w-full">
                  <SelectValue placeholder="Who paid?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="m in tripMembers" :key="m.email" :value="m.email">
                    {{ m.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage class="text-[11px]" />
            </FormItem>
          </FormField>
        </div>

        <!-- Owed by -->
        <div class="flex flex-col gap-1.5">
          <label class="text-text-muted text-[12px]">Owed by</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="m in tripMembers"
              :key="m.email"
              type="button"
              :class="
                cn(
                  'text-[12px] px-3 py-1 rounded-full border transition-colors',
                  owedByEmails.includes(m.email)
                    ? 'border-primary-brand text-primary-brand bg-secondary-brand'
                    : 'border-border text-text-caption hover:border-text-muted hover:text-text-muted'
                )
              "
              @click="toggleOwedBy(m.email)"
            >
              {{ m.label }}
            </button>
          </div>
          <p v-if="owedByError" class="text-destructive text-[11px]">{{ owedByError }}</p>
        </div>

        <!-- Split mode -->
        <div v-if="owedByEmails.length > 0" class="flex flex-col gap-2 border rounded-lg p-3 bg-background-brand">
          <div class="flex items-center justify-between">
            <label class="text-text-muted text-[12px]">Split</label>
            <div class="flex gap-1.5">
              <button
                type="button"
                :class="
                  cn(
                    'text-[12px] px-2.5 py-0.5 rounded-full border transition-colors',
                    splitMode === 'equal'
                      ? 'border-primary-brand text-primary-brand bg-secondary-brand'
                      : 'border-border text-text-caption hover:border-text-muted'
                  )
                "
                @click="setSplitMode('equal')"
              >
                Equal
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'text-[12px] px-2.5 py-0.5 rounded-full border transition-colors',
                    splitMode === 'custom'
                      ? 'border-primary-brand text-primary-brand bg-secondary-brand'
                      : 'border-border text-text-caption hover:border-text-muted'
                  )
                "
                @click="setSplitMode('custom')"
              >
                Custom
              </button>
            </div>
          </div>

          <!-- Equal split rows -->
          <div v-if="splitMode === 'equal'" class="flex flex-col gap-1">
            <div
              v-for="m in owedByEmails"
              :key="m"
              class="flex items-center justify-between text-[12px] px-2 py-1.5 rounded-md"
            >
              <span class="text-text-muted">{{ memberLabel(m) }}</span>
              <span class="text-text-primary font-medium">{{ currency }} {{ equalShare.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Custom amount rows -->
          <div v-else class="flex flex-col gap-2">
            <div v-for="m in owedByEmails" :key="m" class="flex items-center gap-2">
              <span class="text-[12px] text-text-muted flex-1 truncate">{{ memberLabel(m) }}</span>
              <Input
                v-model.number="customAmounts[m]"
                type="number"
                min="0"
                step="0.01"
                class="w-28 h-8 text-sm"
                :placeholder="`0.00`"
              />
            </div>
            <div
              class="flex justify-between text-[11px] pt-1 border-t"
              :class="customRemainder !== 0 ? 'text-destructive' : 'text-primary-brand'"
            >
              <span>Remaining</span>
              <span>{{ currency }} {{ customRemainder.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment status -->
        <div class="flex flex-col gap-1.5">
          <label class="text-text-muted text-[12px]">Payment status</label>
          <div class="flex gap-2">
            <button
              type="button"
              :class="
                cn(
                  'text-[12px] px-3 py-1 rounded-full border transition-colors',
                  paymentStatus === 'unpaid'
                    ? 'border-[#a36c00] text-[#a36c00] bg-[#fef3e2]'
                    : 'border-border text-text-caption hover:border-text-muted'
                )
              "
              @click="paymentStatus = 'unpaid'"
            >
              Unpaid
            </button>
            <button
              type="button"
              :class="
                cn(
                  'text-[12px] px-3 py-1 rounded-full border transition-colors',
                  paymentStatus === 'paid'
                    ? 'border-primary-brand text-primary-brand bg-secondary-brand'
                    : 'border-border text-text-caption hover:border-text-muted'
                )
              "
              @click="paymentStatus = 'paid'"
            >
              Paid
            </button>
          </div>
        </div>

        <SheetFooter class="mt-2">
          <SheetClose as-child>
            <Button type="button" variant="outline" size="sm">Cancel</Button>
          </SheetClose>
          <Button type="submit" size="sm" :disabled="isSubmitting">
            {{ editing ? "Save changes" : "Add expense" }}
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useForm } from "vee-validate";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Expense, PaymentStatus } from "@/types";
import type { ExpenseInput } from "@/repositories/types";

const props = defineProps<{
  open: boolean;
  tripMembers: { email: string; label: string }[];
  currency: string;
  editing?: Expense | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  save: [input: ExpenseInput];
}>();

const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(0, "Amount must be 0 or more"),
  paidBy: z.string().min(1, "Select who paid"),
});

const { handleSubmit, isSubmitting, resetForm, values } = useForm({
  validationSchema: toTypedSchema(expenseSchema),
});

const owedByEmails = ref<string[]>([]);
const owedByError = ref<string | null>(null);
const splitMode = ref<"equal" | "custom">("equal");
const customAmounts = reactive<Record<string, number>>({});
const paymentStatus = ref<PaymentStatus>("unpaid");

function memberLabel(email: string): string {
  return props.tripMembers.find((m) => m.email === email)?.label ?? email;
}

function toggleOwedBy(email: string) {
  const idx = owedByEmails.value.indexOf(email);
  if (idx === -1) {
    owedByEmails.value.push(email);
    customAmounts[email] = 0;
  } else {
    owedByEmails.value.splice(idx, 1);
    delete customAmounts[email];
  }
}

function setSplitMode(mode: "equal" | "custom") {
  splitMode.value = mode;
  if (mode === "custom") {
    const share = equalShare.value;
    owedByEmails.value.forEach((e) => { customAmounts[e] = share; });
  }
}

const equalShare = computed(() => {
  const total = Number(values.amount) || 0;
  const count = owedByEmails.value.length;
  if (count === 0) return 0;
  return Math.round((total / count) * 100) / 100;
});

const customRemainder = computed(() => {
  const total = Number(values.amount) || 0;
  const used = owedByEmails.value.reduce((sum, e) => sum + (Number(customAmounts[e]) || 0), 0);
  return Math.round((total - used) * 100) / 100;
});

function buildOwedBy(): { email: string; amount: number }[] {
  return owedByEmails.value.map((email) => ({
    email,
    amount: splitMode.value === "equal" ? equalShare.value : (Number(customAmounts[email]) || 0),
  }));
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    resetForm({
      values: {
        description: props.editing?.description ?? "",
        amount: props.editing?.amount ?? (undefined as unknown as number),
        paidBy: props.editing?.paidBy ?? (props.tripMembers[0]?.email ?? ""),
      },
    });
    owedByEmails.value = props.editing ? props.editing.owedBy.map((o) => o.email) : [];
    splitMode.value = "equal";
    paymentStatus.value = props.editing?.paymentStatus ?? "unpaid";
    owedByError.value = null;
    if (props.editing) {
      props.editing.owedBy.forEach((o) => { customAmounts[o.email] = o.amount; });
    }
  }
);

const onSubmit = handleSubmit((values) => {
  if (owedByEmails.value.length === 0) {
    owedByError.value = "Select at least one person who owes";
    return;
  }
  owedByError.value = null;
  emit("save", {
    description: values.description,
    amount: values.amount,
    paidBy: values.paidBy,
    owedBy: buildOwedBy(),
    paymentStatus: paymentStatus.value,
  });
  emit("update:open", false);
});
</script>
