import type { Accommodation, Activity, AuditEvent, Expense, PaymentStatus, Trip, TripInput } from "@/types";
import type { AccommodationInput, ActivityInput, ExpenseInput, TripRepository } from "../types";
import { readJson, writeJson, uid } from "./storage";
import { seedTrips } from "./fixtures";

const KEY = "trips";
const SEED_KEY = "trips:seeded";

function loadAll(): Trip[] {
  return readJson<Trip[]>(KEY, []);
}

function saveAll(trips: Trip[]): void {
  writeJson(KEY, trips);
}

function auditEvent(action: AuditEvent["action"], actorEmail: string, label: string): AuditEvent {
  return { id: uid(), action, actorEmail, label, at: new Date().toISOString() };
}

export class LocalTripRepository implements TripRepository {
  private ensureSeeded(ownerId: string): void {
    const seededFor = readJson<string | null>(SEED_KEY, null);
    if (seededFor === ownerId) return;
    const existing = loadAll();
    if (existing.length === 0) {
      saveAll(seedTrips(ownerId));
    }
    writeJson(SEED_KEY, ownerId);
  }

  async list(ownerId: string): Promise<Trip[]> {
    this.ensureSeeded(ownerId);
    return loadAll()
      .filter(
        (t) =>
          t.ownerId === ownerId ||
          t.collaborators.some((c) => c.userId === ownerId)
      )
      .map((t) => ({
        ...t,
        auditLog: t.auditLog ?? [],
        budget: { ...t.budget, splits: t.budget.splits ?? [], expenses: t.budget.expenses ?? [] },
        collaborators: t.collaborators.map((c) => ({
          ...c,
          status: c.status ?? ("pending" as const),
        })),
      }));
  }

  async byId(id: string): Promise<Trip | null> {
    return loadAll().find((t) => t.id === id) ?? null;
  }

  async create(ownerId: string, input: TripInput, actorEmail: string): Promise<Trip> {
    const trip: Trip = {
      ...input,
      activities: input.activities ?? [],
      id: uid(),
      ownerId,
      createdAt: new Date().toISOString(),
      auditLog: [auditEvent("trip.created", actorEmail, `Created "${input.name}"`)],
    };
    const all = loadAll();
    all.push(trip);
    saveAll(all);
    return trip;
  }

  async update(id: string, patch: Partial<TripInput>, actorEmail: string): Promise<Trip> {
    const all = loadAll();
    const idx = all.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`Trip ${id} not found`);
    const log = [...(all[idx].auditLog ?? []), auditEvent("trip.updated", actorEmail, `Updated trip details`)];
    const updated = { ...all[idx], ...patch, auditLog: log };
    all[idx] = updated;
    saveAll(all);
    return updated;
  }

  async remove(id: string): Promise<void> {
    saveAll(loadAll().filter((t) => t.id !== id));
  }

  async addActivity(tripId: string, input: ActivityInput, actorEmail: string): Promise<Activity> {
    const all = loadAll();
    const idx = all.findIndex((t) => t.id === tripId);
    if (idx === -1) throw new Error(`Trip ${tripId} not found`);
    const activity: Activity = { ...input, id: uid() };
    const log = [...(all[idx].auditLog ?? []), auditEvent("activity.added", actorEmail, `Added activity "${input.name}"`)];
    all[idx] = { ...all[idx], activities: [...(all[idx].activities ?? []), activity], auditLog: log };
    saveAll(all);
    return activity;
  }

  async removeActivity(tripId: string, activityId: string, actorEmail: string): Promise<void> {
    const all = loadAll();
    const idx = all.findIndex((t) => t.id === tripId);
    if (idx === -1) return;
    const removed = all[idx].activities.find((a) => a.id === activityId);
    const log = [...(all[idx].auditLog ?? []), auditEvent("activity.removed", actorEmail, `Removed activity "${removed?.name ?? activityId}"`)];
    all[idx] = {
      ...all[idx],
      activities: all[idx].activities.filter((a) => a.id !== activityId),
      auditLog: log,
    };
    saveAll(all);
  }

  async updateActivity(tripId: string, activityId: string, patch: Partial<ActivityInput>, actorEmail: string): Promise<Activity> {
    const all = loadAll();
    const idx = all.findIndex((t) => t.id === tripId);
    if (idx === -1) throw new Error(`Trip ${tripId} not found`);
    const aIdx = all[idx].activities.findIndex((a) => a.id === activityId);
    if (aIdx === -1) throw new Error(`Activity ${activityId} not found`);
    const updated = { ...all[idx].activities[aIdx], ...patch };
    all[idx].activities[aIdx] = updated;
    const log = [...(all[idx].auditLog ?? []), auditEvent("activity.updated", actorEmail, `Edited activity "${updated.name}"`)];
    all[idx] = { ...all[idx], auditLog: log };
    saveAll(all);
    return updated;
  }

  async addAccommodation(tripId: string, input: AccommodationInput, actorEmail: string): Promise<Accommodation> {
    const all = loadAll();
    const idx = all.findIndex((t) => t.id === tripId);
    if (idx === -1) throw new Error(`Trip ${tripId} not found`);
    const acc: Accommodation = { ...input, id: uid() };
    const log = [...(all[idx].auditLog ?? []), auditEvent("accommodation.added", actorEmail, `Added accommodation "${input.name}"`)];
    all[idx] = { ...all[idx], accommodations: [...(all[idx].accommodations ?? []), acc], auditLog: log };
    saveAll(all);
    return acc;
  }

  async removeAccommodation(tripId: string, accommodationId: string, actorEmail: string): Promise<void> {
    const all = loadAll();
    const idx = all.findIndex((t) => t.id === tripId);
    if (idx === -1) return;
    const removed = all[idx].accommodations.find((a) => a.id === accommodationId);
    const log = [...(all[idx].auditLog ?? []), auditEvent("accommodation.removed", actorEmail, `Removed accommodation "${removed?.name ?? accommodationId}"`)];
    all[idx] = {
      ...all[idx],
      accommodations: all[idx].accommodations.filter((a) => a.id !== accommodationId),
      auditLog: log,
    };
    saveAll(all);
  }

  async updatePaymentStatus(tripId: string, email: string, status: PaymentStatus, actorEmail: string): Promise<Trip> {
    const all = loadAll();
    const idx = all.findIndex((t) => t.id === tripId);
    if (idx === -1) throw new Error(`Trip ${tripId} not found`);
    const splits = all[idx].budget.splits.map((s) =>
      s.email.toLowerCase() === email.toLowerCase() ? { ...s, paymentStatus: status } : s
    );
    const action = status === "paid" ? "payment.marked_paid" : "payment.marked_unpaid";
    const label = status === "paid" ? `Marked ${email} as paid` : `Marked ${email} as unpaid`;
    const log = [...(all[idx].auditLog ?? []), auditEvent(action, actorEmail, label)];
    all[idx] = { ...all[idx], budget: { ...all[idx].budget, splits }, auditLog: log };
    saveAll(all);
    return all[idx];
  }

  async addExpense(tripId: string, input: ExpenseInput, actorEmail: string): Promise<Expense> {
    const all = loadAll();
    const idx = all.findIndex((t) => t.id === tripId);
    if (idx === -1) throw new Error(`Trip ${tripId} not found`);
    const expense: Expense = { ...input, id: uid(), createdAt: new Date().toISOString() };
    const expenses = [...(all[idx].budget.expenses ?? []), expense];
    const log = [...(all[idx].auditLog ?? []), auditEvent("expense.added", actorEmail, `Added expense "${input.description}"`)];
    all[idx] = { ...all[idx], budget: { ...all[idx].budget, expenses }, auditLog: log };
    saveAll(all);
    return expense;
  }

  async removeExpense(tripId: string, expenseId: string, actorEmail: string): Promise<void> {
    const all = loadAll();
    const idx = all.findIndex((t) => t.id === tripId);
    if (idx === -1) return;
    const removed = (all[idx].budget.expenses ?? []).find((e) => e.id === expenseId);
    const expenses = (all[idx].budget.expenses ?? []).filter((e) => e.id !== expenseId);
    const log = [...(all[idx].auditLog ?? []), auditEvent("expense.removed", actorEmail, `Removed expense "${removed?.description ?? expenseId}"`)];
    all[idx] = { ...all[idx], budget: { ...all[idx].budget, expenses }, auditLog: log };
    saveAll(all);
  }

  async toggleExpensePaid(tripId: string, expenseId: string, status: PaymentStatus, actorEmail: string): Promise<Trip> {
    const all = loadAll();
    const idx = all.findIndex((t) => t.id === tripId);
    if (idx === -1) throw new Error(`Trip ${tripId} not found`);
    const expenses = (all[idx].budget.expenses ?? []).map((e) =>
      e.id === expenseId ? { ...e, paymentStatus: status } : e
    );
    const expense = (all[idx].budget.expenses ?? []).find((e) => e.id === expenseId);
    const action = status === "paid" ? "expense.paid" : "expense.unpaid";
    const label = status === "paid"
      ? `Marked expense "${expense?.description ?? expenseId}" as paid`
      : `Marked expense "${expense?.description ?? expenseId}" as unpaid`;
    const log = [...(all[idx].auditLog ?? []), auditEvent(action, actorEmail, label)];
    all[idx] = { ...all[idx], budget: { ...all[idx].budget, expenses }, auditLog: log };
    saveAll(all);
    return all[idx];
  }

  async acceptInvite(inviteToken: string, userId: string): Promise<Trip> {
    const all = loadAll();
    const idx = all.findIndex((t) =>
      t.collaborators.some((c) => c.inviteToken === inviteToken)
    );
    if (idx === -1) throw new Error("Invalid invite token");
    const collab = all[idx].collaborators.find((c) => c.inviteToken === inviteToken);
    const log = [...(all[idx].auditLog ?? []), auditEvent("collaborator.invited", collab?.email ?? "", `${collab?.email ?? "Someone"} joined the trip`)];
    all[idx] = {
      ...all[idx],
      collaborators: all[idx].collaborators.map((c) =>
        c.inviteToken === inviteToken ? { ...c, status: "accepted" as const, userId } : c
      ),
      auditLog: log,
    };
    saveAll(all);
    return all[idx];
  }
}
