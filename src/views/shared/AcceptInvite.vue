<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
    <div v-if="state === 'loading'" class="flex flex-col items-center gap-2">
      <Spinner class="w-8 h-8 text-primary-brand" />
      <p class="text-text-muted text-sm">Accepting invitation…</p>
    </div>

    <div v-else-if="state === 'success'" class="flex flex-col items-center gap-3 text-center">
      <div class="w-14 h-14 rounded-full bg-secondary-brand flex items-center justify-center">
        <CheckCircle2 class="text-primary-brand w-7 h-7" />
      </div>
      <p class="text-text-primary font-medium">You're in!</p>
      <p class="text-text-muted text-sm">You've joined <strong>{{ tripName }}</strong></p>
      <Button size="sm" @click="router.push({ name: 'mytrip' })">View my trips</Button>
    </div>

    <div v-else-if="state === 'error'" class="flex flex-col items-center gap-3 text-center">
      <p class="text-text-primary font-medium">Invite not found</p>
      <p class="text-text-muted text-sm">{{ errorMsg }}</p>
      <RouterLink :to="{ name: 'mytrip' }">
        <Button size="sm" variant="outline">Go home</Button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { CheckCircle2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTripsStore } from "@/stores/trips";

const route = useRoute();
const router = useRouter();
const trips = useTripsStore();

const state = ref<"loading" | "success" | "error">("loading");
const tripName = ref("");
const errorMsg = ref("The link may be invalid or already used.");

onMounted(async () => {
  const token = route.params.token as string;
  try {
    const trip = await trips.acceptInvite(token);
    tripName.value = trip.name;
    state.value = "success";
  } catch {
    state.value = "error";
  }
});
</script>
