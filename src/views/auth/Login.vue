<template>
  <div
    class="min-h-screen flex items-center justify-center bg-background-brand p-4"
  >
    <form
      class="w-full max-w-sm flex flex-col gap-4 bg-white rounded-lg p-6"
      @submit="onSubmit"
    >
      <div class="flex flex-col gap-1">
        <p class="text-text-primary text-lg font-medium">Welcome back</p>
        <p class="text-text-muted text-sm">Sign in to continue planning</p>
      </div>

      <Alert v-if="serverError" class="bg-[#fdecec] text-[#a8261a]">
        <CircleAlert />
        <AlertTitle class="text-[12px]">{{ serverError }}</AlertTitle>
      </Alert>

      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Email</FormLabel>
          <Input v-bind="componentField" placeholder="you@example.com" />
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Password</FormLabel>
          <Input v-bind="componentField" type="password" placeholder="••••••" />
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" :disabled="isSubmitting" size="sm">
        {{ isSubmitting ? "Signing in..." : "Sign in" }}
      </Button>

      <p class="text-text-muted text-xs text-center">
        New here?
        <RouterLink to="/register" class="text-primary-brand">
          Create an account
        </RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { CircleAlert } from "lucide-vue-next";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schemas/auth";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const serverError = ref<string | null>(null);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

const onSubmit = handleSubmit(async (values) => {
  serverError.value = null;
  try {
    await auth.login(values.email, values.password);
    const redirect =
      typeof route.query.redirect === "string" ? route.query.redirect : "/";
    router.replace(redirect);
  } catch (e) {
    serverError.value = e instanceof Error ? e.message : "Login failed";
  }
});
</script>
