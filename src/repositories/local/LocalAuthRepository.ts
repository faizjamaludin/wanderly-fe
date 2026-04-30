import type { AuthSession, User } from "@/types";
import type { AuthRepository, ProfileUpdate } from "../types";
import { readJson, removeKey, uid, writeJson } from "./storage";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

const USERS_KEY = "users";
const SESSION_KEY = "session";

function loadUsers(): StoredUser[] {
  return readJson<StoredUser[]>(USERS_KEY, []);
}

function saveUsers(users: StoredUser[]): void {
  writeJson(USERS_KEY, users);
}

function toUser(stored: StoredUser): User {
  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    avatar: stored.avatar,
    bio: stored.bio,
    location: stored.location,
    phone: stored.phone,
  };
}

export class LocalAuthRepository implements AuthRepository {
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthSession> {
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists");
    }
    const stored: StoredUser = { id: uid(), name, email, password };
    users.push(stored);
    saveUsers(users);
    const session: AuthSession = { user: toUser(stored), token: uid() };
    writeJson(SESSION_KEY, session);
    return session;
  }

  async login(email: string, password: string): Promise<AuthSession> {
    const users = loadUsers();
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) throw new Error("Invalid email or password");
    const session: AuthSession = { user: toUser(match), token: uid() };
    writeJson(SESSION_KEY, session);
    return session;
  }

  async logout(): Promise<void> {
    removeKey(SESSION_KEY);
  }

  async currentSession(): Promise<AuthSession | null> {
    return readJson<AuthSession | null>(SESSION_KEY, null);
  }

  async currentUser(): Promise<User | null> {
    const session = await this.currentSession();
    return session?.user ?? null;
  }

  async updateProfile(userId: string, patch: Partial<ProfileUpdate>): Promise<User> {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("User not found");
    users[idx] = { ...users[idx], ...patch };
    saveUsers(users);
    const updated = toUser(users[idx]);
    // Refresh stored session
    const session = readJson<AuthSession | null>(SESSION_KEY, null);
    if (session) writeJson(SESSION_KEY, { ...session, user: updated });
    return updated;
  }
}
