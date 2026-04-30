import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type {
  Accommodation,
  Activity,
  Collaborator,
  TripInput,
  TripType,
  Budget,
} from "@/types";
import { useTripsStore } from "./trips";

export type DraftActivity = Omit<Activity, "id">;

export type DraftStep = "details" | "stay" | "budget";

export const STEP_ORDER: DraftStep[] = ["details", "stay", "budget"];

export interface DraftDetails {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  type: TripType | "";
  notes: string;
}

export interface DraftAccommodation {
  name: string;
  startDate: string;
  endDate: string;
  confirmationNum: string;
}

export interface DraftBudget {
  total: number;
  currency: string;
  splitMode: Budget["splitMode"];
  travelerCount: number;
}

const emptyDetails = (): DraftDetails => ({
  name: "",
  destination: "",
  startDate: "",
  endDate: "",
  type: "",
  notes: "",
});

const emptyAccommodation = (): DraftAccommodation => ({
  name: "",
  startDate: "",
  endDate: "",
  confirmationNum: "",
});

const emptyBudget = (): DraftBudget => ({
  total: 0,
  currency: "MYR",
  splitMode: "equal",
  travelerCount: 1,
});

export const useTripDraftStore = defineStore("tripDraft", () => {
  const currentStep = ref<DraftStep>("details");
  const details = ref<DraftDetails>(emptyDetails());
  const collaborators = ref<Collaborator[]>([]);
  const accommodation = ref<DraftAccommodation>(emptyAccommodation());
  const budget = ref<DraftBudget>(emptyBudget());
  const activities = ref<DraftActivity[]>([]);

  const stepIndex = computed(() => STEP_ORDER.indexOf(currentStep.value));
  const isFirst = computed(() => stepIndex.value === 0);
  const isLast = computed(() => stepIndex.value === STEP_ORDER.length - 1);

  function setDetails(values: DraftDetails) {
    details.value = values;
  }

  function addCollaborator(c: Collaborator) {
    if (
      collaborators.value.some(
        (existing) => existing.email.toLowerCase() === c.email.toLowerCase()
      )
    ) {
      return false;
    }
    collaborators.value.push({
      ...c,
      status: "pending",
      inviteToken: crypto.randomUUID(),
    });
    return true;
  }

  function removeCollaborator(email: string) {
    collaborators.value = collaborators.value.filter(
      (c) => c.email.toLowerCase() !== email.toLowerCase()
    );
  }

  function setAccommodation(values: DraftAccommodation) {
    accommodation.value = values;
  }

  function setBudget(values: DraftBudget) {
    budget.value = values;
  }

  function addActivity(a: DraftActivity) {
    activities.value.push(a);
  }

  function removeActivity(index: number) {
    activities.value.splice(index, 1);
  }

  function goNext() {
    const next = STEP_ORDER[stepIndex.value + 1];
    if (next) currentStep.value = next;
  }

  function goBack() {
    const prev = STEP_ORDER[stepIndex.value - 1];
    if (prev) currentStep.value = prev;
  }

  function reset() {
    currentStep.value = "details";
    details.value = emptyDetails();
    collaborators.value = [];
    accommodation.value = emptyAccommodation();
    budget.value = emptyBudget();
    activities.value = [];
  }

  function buildTripInput(ownerEmail: string): TripInput {
    const acc: Accommodation[] = accommodation.value.name
      ? [
          {
            id: crypto.randomUUID(),
            name: accommodation.value.name,
            startDate: accommodation.value.startDate,
            endDate: accommodation.value.endDate,
            confirmationNum: accommodation.value.confirmationNum || undefined,
          },
        ]
      : [];

    if (!details.value.type) {
      throw new Error("Trip type missing");
    }

    const count = budget.value.travelerCount;
    const perPerson =
      count > 0 ? Math.round((budget.value.total / count) * 100) / 100 : 0;

    // Seed list: owner first, then collaborators, pad with blanks to reach travelerCount
    const seededEmails: string[] = [ownerEmail];
    for (const c of collaborators.value) {
      if (seededEmails.length >= count) break;
      seededEmails.push(c.email);
    }
    while (seededEmails.length < count) {
      seededEmails.push("");
    }

    const splits = seededEmails.map((email) => ({
      email,
      amount: perPerson,
      paymentStatus: "unpaid" as const,
    }));

    return {
      name: details.value.name,
      destination: details.value.destination,
      startDate: details.value.startDate,
      endDate: details.value.endDate,
      type: details.value.type,
      notes: details.value.notes || undefined,
      collaborators: [...collaborators.value],
      accommodations: acc,
      activities: activities.value.map((a) => ({ ...a, id: crypto.randomUUID() })),
      budget: { ...budget.value, splits, expenses: [] },
      auditLog: [],
    };
  }

  async function finalize(ownerEmail: string): Promise<string> {
    const trips = useTripsStore();
    const input = buildTripInput(ownerEmail);
    const trip = await trips.create(input);
    reset();
    return trip.id;
  }

  return {
    currentStep,
    details,
    collaborators,
    accommodation,
    budget,
    activities,
    stepIndex,
    isFirst,
    isLast,
    setDetails,
    addCollaborator,
    removeCollaborator,
    setAccommodation,
    setBudget,
    addActivity,
    removeActivity,
    goNext,
    goBack,
    reset,
    finalize,
  };
});
