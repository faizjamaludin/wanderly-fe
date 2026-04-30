export type TripType = "Cultural" | "Beach" | "Adventure" | "Food" | "Business";

export const TRIP_TYPES: TripType[] = [
  "Cultural",
  "Beach",
  "Adventure",
  "Food",
  "Business",
];

export type SplitMode = "equal" | "custom" | "payg";

export const SPLIT_MODES: { value: SplitMode; label: string }[] = [
  { value: "equal", label: "Equal Split" },
  { value: "custom", label: "Custom %" },
  { value: "payg", label: "Pay as you go" },
];

export type CollaboratorRole = "viewer" | "editor";
export type CollaboratorStatus = "pending" | "accepted";

export interface Collaborator {
  userId?: string;
  email: string;
  role: CollaboratorRole;
  status: CollaboratorStatus;
  inviteToken?: string;
}

export type PaymentStatus = "unpaid" | "paid";

export interface BudgetSplit {
  email: string;
  amount: number;
  paymentStatus: PaymentStatus;
}

export interface ExpenseOwedBy {
  email: string;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  owedBy: ExpenseOwedBy[];
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Accommodation {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  confirmationNum?: string;
}

export interface Budget {
  total: number;
  currency: string;
  splitMode: SplitMode;
  travelerCount: number;
  splits: BudgetSplit[];
  expenses: Expense[];
}

export type ActivityCategory =
  | "sightseeing"
  | "food"
  | "transport"
  | "accommodation"
  | "adventure"
  | "shopping"
  | "other";

export const ACTIVITY_CATEGORIES: { value: ActivityCategory; label: string; emoji: string }[] = [
  { value: "sightseeing", label: "Sightseeing", emoji: "🏛️" },
  { value: "food", label: "Food & Drink", emoji: "🍜" },
  { value: "transport", label: "Transport", emoji: "✈️" },
  { value: "accommodation", label: "Accommodation", emoji: "🏨" },
  { value: "adventure", label: "Adventure", emoji: "🧗" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "other", label: "Other", emoji: "📌" },
];

export interface Activity {
  id: string;
  date: string;
  time?: string;
  name: string;
  location?: string;
  notes?: string;
  category: ActivityCategory;
}

export type AuditAction =
  | "trip.created"
  | "trip.updated"
  | "activity.added"
  | "activity.updated"
  | "activity.removed"
  | "accommodation.added"
  | "accommodation.removed"
  | "collaborator.invited"
  | "collaborator.removed"
  | "collaborator.role_changed"
  | "payment.marked_paid"
  | "payment.marked_unpaid"
  | "expense.added"
  | "expense.removed"
  | "expense.paid"
  | "expense.unpaid";

export interface AuditEvent {
  id: string;
  action: AuditAction;
  actorEmail: string;
  label: string;
  at: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  type: TripType;
  notes?: string;
  collaborators: Collaborator[];
  accommodations: Accommodation[];
  activities: Activity[];
  budget: Budget;
  ownerId: string;
  createdAt: string;
  auditLog: AuditEvent[];
}

export type TripInput = Omit<Trip, "id" | "createdAt" | "ownerId">;
