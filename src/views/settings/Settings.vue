<template>
  <div class="flex flex-col gap-6 max-w-xl">

    <!-- Profile -->
    <div class="flex flex-col gap-3">
      <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Profile</p>

      <div class="bg-white rounded-2xl overflow-hidden">

        <!-- Avatar + name header -->
        <div class="flex items-center gap-4 px-5 py-5 border-b border-border">
          <!-- Avatar with upload overlay -->
          <div class="relative shrink-0 group">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold overflow-hidden"
              :style="!avatarPreview && !auth.currentUser?.avatar ? { backgroundColor: avatarColor(auth.currentUser?.email ?? '') } : {}"
            >
              <img
                v-if="avatarPreview || auth.currentUser?.avatar"
                :src="avatarPreview || auth.currentUser?.avatar"
                class="w-full h-full object-cover"
                alt="avatar"
              />
              <span v-else>
                {{ (auth.currentUser?.name ?? auth.currentUser?.email ?? 'U')[0].toUpperCase() }}
              </span>
            </div>
            <button
              type="button"
              class="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Change photo"
              @click="triggerAvatarUpload"
            >
              <Camera :size="16" class="text-white" />
            </button>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onAvatarChange"
            />
          </div>

          <div class="flex flex-col gap-0.5 min-w-0">
            <p class="text-sm font-semibold text-text-primary truncate">
              {{ auth.currentUser?.name ?? '—' }}
            </p>
            <p class="text-xs text-text-caption truncate">{{ auth.currentUser?.email }}</p>
          </div>
        </div>

        <!-- Editable fields -->
        <div class="flex flex-col divide-y divide-border">
          <!-- Name -->
          <div class="flex items-center justify-between px-5 py-3.5 gap-4">
            <label class="text-[12px] text-text-muted shrink-0 w-20">Name</label>
            <input
              v-if="editing"
              v-model="draft.name"
              class="flex-1 text-sm text-text-primary bg-background-brand rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-primary-brand min-w-0"
              placeholder="Your name"
            />
            <p v-else class="text-sm text-text-primary font-medium text-right">{{ auth.currentUser?.name || '—' }}</p>
          </div>

          <!-- Email (read-only) -->
          <div class="flex items-center justify-between px-5 py-3.5 gap-4">
            <label class="text-[12px] text-text-muted shrink-0 w-20">Email</label>
            <p class="text-sm text-text-primary font-medium text-right">{{ auth.currentUser?.email }}</p>
          </div>

          <!-- Phone -->
          <div class="flex items-center justify-between px-5 py-3.5 gap-4">
            <label class="text-[12px] text-text-muted shrink-0 w-20">Phone</label>
            <input
              v-if="editing"
              v-model="draft.phone"
              type="tel"
              class="flex-1 text-sm text-text-primary bg-background-brand rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-primary-brand min-w-0 text-right"
              placeholder="e.g. +60 12-345 6789"
            />
            <p v-else class="text-sm text-right" :class="auth.currentUser?.phone ? 'text-text-primary font-medium' : 'text-text-caption italic'">
              {{ auth.currentUser?.phone || 'Not set' }}
            </p>
          </div>

          <!-- Location -->
          <div class="flex items-center justify-between px-5 py-3.5 gap-4">
            <label class="text-[12px] text-text-muted shrink-0 w-20">Location</label>
            <input
              v-if="editing"
              v-model="draft.location"
              class="flex-1 text-sm text-text-primary bg-background-brand rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-primary-brand min-w-0 text-right"
              placeholder="e.g. Kuala Lumpur, MY"
            />
            <p v-else class="text-sm text-right" :class="auth.currentUser?.location ? 'text-text-primary font-medium' : 'text-text-caption italic'">
              {{ auth.currentUser?.location || 'Not set' }}
            </p>
          </div>

          <!-- Bio -->
          <div class="flex flex-col gap-2 px-5 py-3.5">
            <label class="text-[12px] text-text-muted">Bio</label>
            <textarea
              v-if="editing"
              v-model="draft.bio"
              rows="2"
              class="w-full text-sm text-text-primary bg-background-brand rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-primary-brand resize-none"
              placeholder="A short line about yourself"
            />
            <p v-else class="text-sm" :class="auth.currentUser?.bio ? 'text-text-primary' : 'text-text-caption italic'">
              {{ auth.currentUser?.bio || 'Not set' }}
            </p>
          </div>
        </div>

        <!-- Edit / Save actions -->
        <div class="px-5 py-3.5 border-t border-border flex justify-end gap-2">
          <template v-if="editing">
            <Button size="sm" variant="outline" @click="cancelEdit">Cancel</Button>
            <Button size="sm" :disabled="saving" @click="saveProfile">
              {{ saving ? 'Saving…' : 'Save changes' }}
            </Button>
          </template>
          <Button v-else size="sm" variant="outline" class="gap-1.5" @click="startEdit">
            <Pencil :size="13" /> Edit profile
          </Button>
        </div>

      </div>
    </div>

    <!-- Preferences -->
    <div class="flex flex-col gap-3">
      <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Preferences</p>

      <div class="bg-white rounded-2xl overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4">
          <div class="flex items-center gap-3">
            <span class="h-8 w-8 rounded-xl bg-secondary-brand flex items-center justify-center shrink-0">
              <Moon :size="15" class="text-primary-brand" />
            </span>
            <div class="flex flex-col gap-0.5">
              <p class="text-sm text-text-primary font-medium">Dark mode</p>
              <p class="text-[11px] text-text-caption">Toggle the app's colour theme</p>
            </div>
          </div>
          <button
            type="button"
            :class="cn(
              'relative h-6 w-11 rounded-full transition-colors shrink-0',
              isDark ? 'bg-primary-brand' : 'bg-border'
            )"
            @click="toggleDark"
          >
            <span
              :class="cn(
                'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                isDark && 'translate-x-5'
              )"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Account -->
    <div class="flex flex-col gap-3">
      <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Account</p>

      <div class="bg-white rounded-2xl overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4">
          <div class="flex items-center gap-3">
            <span class="h-8 w-8 rounded-xl bg-[#fdecec] flex items-center justify-center shrink-0">
              <LogOut :size="15" class="text-destructive" />
            </span>
            <div class="flex flex-col gap-0.5">
              <p class="text-sm text-text-primary font-medium">Sign out</p>
              <p class="text-[11px] text-text-caption">End your session on this device</p>
            </div>
          </div>
          <RouterLink :to="{ name: 'logout' }">
            <Button size="sm" variant="outline" class="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60">
              Log out
            </Button>
          </RouterLink>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { RouterLink } from "vue-router";
import { Camera, LogOut, Moon, Pencil } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

// ── Theme ────────────────────────────────────────────────────────
const THEME_KEY = "wanderly:theme";
const isDark = ref(false);

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

function toggleDark() {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
  localStorage.setItem(THEME_KEY, isDark.value ? "dark" : "light");
}

onMounted(() => {
  isDark.value = localStorage.getItem(THEME_KEY) === "dark";
  applyTheme(isDark.value);
});

// ── Avatar ───────────────────────────────────────────────────────
const avatarInput = ref<HTMLInputElement | null>(null);
const avatarPreview = ref<string | null>(null);

function avatarColor(email: string): string {
  const colors = ["#2d6a4f", "#0077b6", "#6b4226", "#c1121f", "#6a2d6a", "#2d4a6a"];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function triggerAvatarUpload() {
  avatarInput.value?.click();
}

function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    avatarPreview.value = ev.target?.result as string;
    if (!editing.value) startEdit();
    draft.avatar = avatarPreview.value;
  };
  reader.readAsDataURL(file);
}

// ── Profile editing ──────────────────────────────────────────────
const editing = ref(false);
const saving = ref(false);
const draft = reactive({ name: "", phone: "", location: "", bio: "", avatar: "" });

function startEdit() {
  draft.name = auth.currentUser?.name ?? "";
  draft.phone = auth.currentUser?.phone ?? "";
  draft.location = auth.currentUser?.location ?? "";
  draft.bio = auth.currentUser?.bio ?? "";
  draft.avatar = auth.currentUser?.avatar ?? "";
  editing.value = true;
}

function cancelEdit() {
  editing.value = false;
  avatarPreview.value = null;
}

async function saveProfile() {
  if (!draft.name.trim()) return;
  saving.value = true;
  try {
    await auth.updateProfile({
      name: draft.name.trim(),
      phone: draft.phone.trim() || undefined,
      location: draft.location.trim() || undefined,
      bio: draft.bio.trim() || undefined,
      avatar: draft.avatar || undefined,
    });
    editing.value = false;
    avatarPreview.value = null;
  } finally {
    saving.value = false;
  }
}
</script>
