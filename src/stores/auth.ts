import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authRepository } from "@/repositories";
import type { User } from "@/types";
import type { ProfileUpdate } from "@/repositories/types";

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref<User | null>(null);
  const token = ref<string | null>(null);
  const ready = ref(false);

  const isAuthenticated = computed(() => !!currentUser.value && !!token.value);

  async function init() {
    if (ready.value) return;
    const session = await authRepository.currentSession();
    if (session) {
      currentUser.value = session.user;
      token.value = session.token;
    }
    ready.value = true;
  }

  async function login(email: string, password: string) {
    const session = await authRepository.login(email, password);
    currentUser.value = session.user;
    token.value = session.token;
  }

  async function register(name: string, email: string, password: string) {
    const session = await authRepository.register(name, email, password);
    currentUser.value = session.user;
    token.value = session.token;
  }

  async function logout() {
    await authRepository.logout();
    currentUser.value = null;
    token.value = null;
  }

  async function updateProfile(patch: Partial<ProfileUpdate>): Promise<void> {
    if (!currentUser.value) throw new Error("Not authenticated");
    const updated = await authRepository.updateProfile(currentUser.value.id, patch);
    currentUser.value = updated;
  }

  return {
    currentUser,
    token,
    ready,
    isAuthenticated,
    init,
    login,
    register,
    logout,
    updateProfile,
  };
});
