import type { Activity, Accommodation, AuthSession, Expense, PaymentStatus, Trip, TripInput, User } from "@/types";

export type ActivityInput = Omit<Activity, "id">;
export type AccommodationInput = Omit<Accommodation, "id">;
export type ExpenseInput = Omit<Expense, "id" | "createdAt">;

export interface TripRepository {
  list(ownerId: string): Promise<Trip[]>;
  byId(id: string): Promise<Trip | null>;
  create(ownerId: string, input: TripInput, actorEmail: string): Promise<Trip>;
  update(id: string, patch: Partial<TripInput>, actorEmail: string): Promise<Trip>;
  remove(id: string): Promise<void>;
  addActivity(tripId: string, input: ActivityInput, actorEmail: string): Promise<Activity>;
  removeActivity(tripId: string, activityId: string, actorEmail: string): Promise<void>;
  updateActivity(tripId: string, activityId: string, patch: Partial<ActivityInput>, actorEmail: string): Promise<Activity>;
  addAccommodation(tripId: string, input: AccommodationInput, actorEmail: string): Promise<Accommodation>;
  removeAccommodation(tripId: string, accommodationId: string, actorEmail: string): Promise<void>;
  updatePaymentStatus(tripId: string, email: string, status: PaymentStatus, actorEmail: string): Promise<Trip>;
  addExpense(tripId: string, input: ExpenseInput, actorEmail: string): Promise<Expense>;
  removeExpense(tripId: string, expenseId: string, actorEmail: string): Promise<void>;
  toggleExpensePaid(tripId: string, expenseId: string, status: PaymentStatus, actorEmail: string): Promise<Trip>;
  acceptInvite(inviteToken: string, userId: string): Promise<Trip>;
}

export type ProfileUpdate = Pick<User, "name" | "bio" | "location" | "phone" | "avatar">;

export interface AuthRepository {
  register(name: string, email: string, password: string): Promise<AuthSession>;
  login(email: string, password: string): Promise<AuthSession>;
  logout(): Promise<void>;
  currentSession(): Promise<AuthSession | null>;
  currentUser(): Promise<User | null>;
  updateProfile(userId: string, patch: Partial<ProfileUpdate>): Promise<User>;
}
