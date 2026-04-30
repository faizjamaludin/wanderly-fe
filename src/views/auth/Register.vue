<template>
  <div
    class="min-h-screen flex items-center justify-center bg-background-brand p-4"
  >
    <form
      class="w-full max-w-sm flex flex-col gap-4 bg-white rounded-lg p-6"
      @submit="onSubmit"
    >
      <div class="flex flex-col gap-1">
        <p class="text-text-primary text-lg font-medium">Create your account</p>
        <p class="text-text-muted text-sm">Start planning your next trip</p>
      </div>

      <Alert v-if="serverError" class="bg-[#fdecec] text-[#a8261a]">
        <CircleAlert />
        <AlertTitle class="text-[12px]">{{ serverError }}</AlertTitle>
      </Alert>

      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel class="text-text-muted text-[12px]">Name</FormLabel>
          <Input v-bind="componentField" placeholder="Faiz" />
          <FormMessage />
        </FormItem>
      </FormField>

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
        {{ isSubmitting ? "Creating account..." : "Create account" }}
      </Button>

      <p class="text-text-muted text-xs text-center">
        Already have an account?
        <RouterLink to="/login" class="text-primary-brand">Sign in</RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { CircleAlert } from "lucide-vue-next";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/schemas/auth";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const serverError = ref<string | null>(null);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(registerSchema),
});

const onSubmit = handleSubmit(async (values) => {
  serverError.value = null;
  try {
    await auth.register(values.name, values.email, values.password);
    router.replace("/");
  } catch (e) {
    serverError.value = e instanceof Error ? e.message : "Registration failed";
  }
});
</script>
