import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { tripRepository } from "@/repositories";
import type { Accommodation, Activity, Expense, PaymentStatus, Trip, TripInput } from "@/types";
import type { AccommodationInput, ActivityInput, ExpenseInput } from "@/repositories/types";
import { useAuthStore } from "./auth";

export const useTripsStore = defineStore("trips", () => {
  const trips = ref<Trip[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const list = computed(() => trips.value);

  function byId(id: string): Trip | undefined {
    return trips.value.find((t) => t.id === id);
  }

  function actorEmail(): string {
    return useAuthStore().currentUser?.email ?? "";
  }

  async function load() {
    const auth = useAuthStore();
    if (!auth.currentUser) { trips.value = []; return; }
    loading.value = true;
    error.value = null;
    try {
      trips.value = await tripRepository.list(auth.currentUser.id);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load trips";
    } finally {
      loading.value = false;
    }
  }

  async function create(input: TripInput): Promise<Trip> {
    const auth = useAuthStore();
    if (!auth.currentUser) throw new Error("Not authenticated");
    const trip = await tripRepository.create(auth.currentUser.id, input, auth.currentUser.email);
    trips.value.push(trip);
    return trip;
  }

  async function update(id: string, patch: Partial<TripInput>): Promise<Trip> {
    const updated = await tripRepository.update(id, patch, actorEmail());
    const idx = trips.value.findIndex((t) => t.id === id);
    if (idx !== -1) trips.value[idx] = updated;
    return updated;
  }

  async function remove(id: string): Promise<void> {
    await tripRepository.remove(id);
    trips.value = trips.value.filter((t) => t.id !== id);
  }

  async function addActivity(tripId: string, input: ActivityInput): Promise<Activity> {
    const activity = await tripRepository.addActivity(tripId, input, actorEmail());
    const trip = trips.value.find((t) => t.id === tripId);
    if (trip) trip.activities.push(activity);
    return activity;
  }

  async function removeActivity(tripId: string, activityId: string): Promise<void> {
    await tripRepository.removeActivity(tripId, activityId, actorEmail());
    const trip = trips.value.find((t) => t.id === tripId);
    if (trip) trip.activities = trip.activities.filter((a) => a.id !== activityId);
  }

  async function updateActivity(tripId: string, activityId: string, patch: Partial<ActivityInput>): Promise<Activity> {
    const activity = await tripRepository.updateActivity(tripId, activityId, patch, actorEmail());
    const trip = trips.value.find((t) => t.id === tripId);
    if (trip) {
      const idx = trip.activities.findIndex((a) => a.id === activityId);
      if (idx !== -1) trip.activities[idx] = activity;
    }
    return activity;
  }

  async function addAccommodation(tripId: string, input: AccommodationInput): Promise<Accommodation> {
    const acc = await tripRepository.addAccommodation(tripId, input, actorEmail());
    const trip = trips.value.find((t) => t.id === tripId);
    if (trip) trip.accommodations.push(acc);
    return acc;
  }

  async function removeAccommodation(tripId: string, accommodationId: string): Promise<void> {
    await tripRepository.removeAccommodation(tripId, accommodationId, actorEmail());
    const trip = trips.value.find((t) => t.id === tripId);
    if (trip) trip.accommodations = trip.accommodations.filter((a) => a.id !== accommodationId);
  }

  async function updatePaymentStatus(tripId: string, email: string, status: PaymentStatus): Promise<void> {
    const updated = await tripRepository.updatePaymentStatus(tripId, email, status, actorEmail());
    const idx = trips.value.findIndex((t) => t.id === tripId);
    if (idx !== -1) trips.value[idx] = updated;
  }

  async function addExpense(tripId: string, input: ExpenseInput): Promise<Expense> {
    const expense = await tripRepository.addExpense(tripId, input, actorEmail());
    const trip = trips.value.find((t) => t.id === tripId);
    if (trip) trip.budget.expenses = [...(trip.budget.expenses ?? []), expense];
    return expense;
  }

  async function removeExpense(tripId: string, expenseId: string): Promise<void> {
    await tripRepository.removeExpense(tripId, expenseId, actorEmail());
    const trip = trips.value.find((t) => t.id === tripId);
    if (trip) trip.budget.expenses = (trip.budget.expenses ?? []).filter((e) => e.id !== expenseId);
  }

  async function toggleExpensePaid(tripId: string, expenseId: string, status: PaymentStatus): Promise<void> {
    const updated = await tripRepository.toggleExpensePaid(tripId, expenseId, status, actorEmail());
    const idx = trips.value.findIndex((t) => t.id === tripId);
    if (idx !== -1) trips.value[idx] = updated;
  }

  async function acceptInvite(inviteToken: string): Promise<Trip> {
    const auth = useAuthStore();
    if (!auth.currentUser) throw new Error("Not authenticated");
    const trip = await tripRepository.acceptInvite(inviteToken, auth.currentUser.id);
    const idx = trips.value.findIndex((t) => t.id === trip.id);
    if (idx !== -1) trips.value[idx] = trip;
    else trips.value.push(trip);
    return trip;
  }

  function reset() {
    trips.value = [];
    error.value = null;
  }

  return {
    trips,
    loading,
    error,
    list,
    byId,
    load,
    create,
    update,
    remove,
    addActivity,
    removeActivity,
    updateActivity,
    addAccommodation,
    removeAccommodation,
    updatePaymentStatus,
    addExpense,
    removeExpense,
    toggleExpensePaid,
    acceptInvite,
    reset,
  };
});
