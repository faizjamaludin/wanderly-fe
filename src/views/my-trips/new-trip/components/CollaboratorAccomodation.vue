<template>
  <form class="flex flex-col w-full max-w-2xl gap-2 px-4 sm:px-0" @submit="onSubmit">
    <!-- Collaborators -->
    <div class="bg-white rounded-lg flex flex-col p-4 gap-4">
      <p class="text-text-primary text-sm">Invite collaborators</p>
      <div class="w-full border bg-text-muted"></div>

      <Alert class="bg-[#e8f1fb] text-[#1a5fa8]">
        <CircleAlert />
        <AlertTitle class="text-[11px]">
          People you invite here can only see this trip — not your other itineraries
        </AlertTitle>
      </Alert>

      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          <Input
            v-model="newCollabEmail"
            placeholder="Email"
            class="flex-1"
            @keydown.enter.prevent="addCollaborator"
          />
          <Select v-model="newCollabRole">
            <SelectTrigger class="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" size="sm" @click="addCollaborator">Add</Button>
        </div>
        <p v-if="collabError" class="text-destructive text-xs">{{ collabError }}</p>

        <ul v-if="draft.collaborators.length" class="flex flex-col gap-1 mt-1">
          <li
            v-for="c in draft.collaborators"
            :key="c.email"
            class="flex items-center justify-between text-[12px] text-text-muted bg-background-brand rounded px-2 py-1"
          >
            <span>{{ c.email }} · {{ c.role }}</span>
            <button
              type="button"
              class="text-text-caption hover:text-destructive"
              @click="draft.removeCollaborator(c.email)"
            >
              <X :size="14" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- First accommodation -->
    <div class="bg-white rounded-lg flex flex-col p-4 gap-4">
      <p class="text-text-primary text-sm">First accommodation (optional)</p>
      <div class="w-full border bg-text-muted"></div>

      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Hotel / property name</FormLabel>
          <Input v-bind="componentField" placeholder="e.g. Kyoto Grand Hotel" />
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

      <FormField v-slot="{ componentField }" name="confirmationNum">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Confirmation no.</FormLabel>
          <Input v-bind="componentField" placeholder="Optional" />
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Pre-booked activities -->
    <div class="bg-white rounded-lg flex flex-col p-4 gap-4">
      <p class="text-text-primary text-sm">Pre-booked activities (optional)</p>
      <div class="w-full border bg-text-muted"></div>
      <p class="text-text-caption text-[12px]">
        Add flights, tours, restaurant bookings, or anything you've already arranged.
      </p>

      <!-- Activity list -->
      <ul v-if="draft.activities.length" class="flex flex-col gap-2">
        <li
          v-for="(a, idx) in draft.activities"
          :key="idx"
          class="flex items-start justify-between bg-background-brand rounded px-3 py-2 gap-2"
        >
          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-1.5">
              <span class="text-sm">{{ categoryEmoji(a.category) }}</span>
              <p class="text-sm text-text-primary">{{ a.name }}</p>
            </div>
            <p class="text-[11px] text-text-caption">
              {{ a.date }}<template v-if="a.time"> · {{ a.time }}</template>
              <template v-if="a.location"> · 📍 {{ a.location }}</template>
            </p>
          </div>
          <button type="button" class="text-text-caption hover:text-destructive mt-0.5" @click="draft.removeActivity(idx)">
            <X :size="14" />
          </button>
        </li>
      </ul>

      <!-- Add activity inline form -->
      <div v-if="!showActivityForm" class="flex">
        <button
          type="button"
          class="text-[12px] text-primary-brand hover:underline flex items-center gap-1"
          @click="showActivityForm = true"
        >
          <Plus :size="13" /> Add an activity
        </button>
      </div>

      <div v-else class="flex flex-col gap-3 border rounded-lg p-3 bg-background-brand">
        <div>
          <label class="text-text-muted text-[12px]">Activity name</label>
          <Input v-model="newAct.name" placeholder="e.g. Fushimi Inari hike" class="mt-1" />
        </div>

        <div>
          <label class="text-text-muted text-[12px]">Category</label>
          <div class="flex flex-wrap gap-1.5 mt-1">
            <button
              v-for="cat in ACTIVITY_CATEGORIES"
              :key="cat.value"
              type="button"
              :class="[
                'flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border cursor-pointer',
                newAct.category === cat.value
                  ? 'border-primary-brand text-primary-brand bg-secondary-brand'
                  : 'border-text-caption text-text-caption hover:border-text-muted'
              ]"
              @click="newAct.category = cat.value"
            >
              {{ cat.emoji }} {{ cat.label }}
            </button>
          </div>
        </div>

        <div class="flex gap-2">
          <div class="flex-1">
            <label class="text-text-muted text-[12px]">Date</label>
            <Input
              v-model="newAct.date"
              type="date"
              :min="draft.details.startDate"
              :max="draft.details.endDate"
              class="mt-1"
            />
          </div>
          <div class="flex-1">
            <label class="text-text-muted text-[12px]">Time (optional)</label>
            <Input v-model="newAct.time" type="time" class="mt-1" />
          </div>
        </div>

        <div>
          <label class="text-text-muted text-[12px]">Location (optional)</label>
          <Input v-model="newAct.location" placeholder="e.g. Fushimi-ku, Kyoto" class="mt-1" />
        </div>

        <div>
          <label class="text-text-muted text-[12px]">Booking ref / notes (optional)</label>
          <Input v-model="newAct.notes" placeholder="Confirmation number, tips…" class="mt-1" />
        </div>

        <p v-if="activityError" class="text-destructive text-xs">{{ activityError }}</p>

        <div class="flex justify-end gap-2">
          <Button type="button" size="sm" variant="outline" @click="cancelActivity">Cancel</Button>
          <Button type="button" size="sm" @click="saveActivity">Add</Button>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-end gap-2">
      <Button size="sm" type="button" variant="outline" @click="draft.goBack">Back</Button>
      <Button size="sm" type="submit" :disabled="isSubmitting">Next</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { CircleAlert, Plus, X } from "lucide-vue-next";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { accommodationSchema, collaboratorSchema } from "@/schemas/trip";
import { useTripDraftStore } from "@/stores/tripDraft";
import { ACTIVITY_CATEGORIES, type ActivityCategory, type CollaboratorRole } from "@/types";

const draft = useTripDraftStore();

// Collaborators
const newCollabEmail = ref("");
const newCollabRole = ref<CollaboratorRole>("viewer");
const collabError = ref<string | null>(null);

function addCollaborator() {
  collabError.value = null;
  const parsed = collaboratorSchema.safeParse({
    email: newCollabEmail.value.trim(),
    role: newCollabRole.value,
  });
  if (!parsed.success) {
    collabError.value = parsed.error.issues[0]?.message ?? "Invalid";
    return;
  }
  const added = draft.addCollaborator({ ...parsed.data, status: "pending" });
  if (!added) {
    collabError.value = "That email is already added";
    return;
  }
  newCollabEmail.value = "";
}

// Accommodation form
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(accommodationSchema),
  initialValues: {
    name: draft.accommodation.name,
    startDate: draft.accommodation.startDate,
    endDate: draft.accommodation.endDate,
    confirmationNum: draft.accommodation.confirmationNum,
  },
});

const onSubmit = handleSubmit((values) => {
  draft.setAccommodation({
    name: values.name ?? "",
    startDate: values.startDate ?? "",
    endDate: values.endDate ?? "",
    confirmationNum: values.confirmationNum ?? "",
  });
  draft.goNext();
});

// Pre-booked activities
const showActivityForm = ref(false);
const activityError = ref<string | null>(null);

const emptyAct = () => ({
  name: "",
  category: "sightseeing" as ActivityCategory,
  date: draft.details.startDate,
  time: "",
  location: "",
  notes: "",
});

const newAct = reactive(emptyAct());

function categoryEmoji(cat: ActivityCategory): string {
  return ACTIVITY_CATEGORIES.find((c) => c.value === cat)?.emoji ?? "📌";
}

function cancelActivity() {
  showActivityForm.value = false;
  activityError.value = null;
  Object.assign(newAct, emptyAct());
}

function saveActivity() {
  activityError.value = null;
  if (!newAct.name.trim()) { activityError.value = "Activity name is required"; return; }
  if (!newAct.date) { activityError.value = "Date is required"; return; }
  draft.addActivity({
    name: newAct.name.trim(),
    category: newAct.category,
    date: newAct.date,
    time: newAct.time || undefined,
    location: newAct.location || undefined,
    notes: newAct.notes || undefined,
  });
  cancelActivity();
}
</script>
