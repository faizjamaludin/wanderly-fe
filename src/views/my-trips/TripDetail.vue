<template>
  <div class="flex flex-col gap-4">
    <!-- Loading -->
    <div v-if="trips.loading && !trip" class="flex flex-col gap-4">
      <Skeleton class="h-48 rounded-2xl" />
      <Skeleton class="h-64 rounded-xl" />
      <Skeleton class="h-32 rounded-xl" />
    </div>

    <!-- Not found -->
    <div
      v-else-if="!trip"
      class="bg-white rounded-xl p-8 flex flex-col items-center gap-3 text-center"
    >
      <p class="text-text-primary font-medium">Trip not found</p>
      <p class="text-xs text-text-caption">It may have been removed, or the link is incorrect.</p>
      <RouterLink :to="{ name: 'mytrip' }" class="mt-1">
        <Button size="sm" variant="outline">Back to My Trips</Button>
      </RouterLink>
    </div>

    <template v-else>
      <!-- Hero header -->
      <div
        class="relative rounded-2xl overflow-hidden min-h-[180px] flex flex-col justify-end p-6"
        :style="{ background: heroGradient }"
      >
        <div
          class="absolute inset-0 opacity-10"
          style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        ></div>

        <div class="relative flex items-end justify-between gap-4">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2 flex-wrap">
              <Badge class="bg-white/20 text-white border-white/30 text-[11px]">{{ trip.type }}</Badge>
              <Badge :class="['text-[11px]', statusBadgeClass]">{{ statusLabel }}</Badge>
            </div>
            <h1 class="text-white text-2xl font-semibold mt-1 leading-tight">{{ trip.name }}</h1>
            <p class="text-white/80 text-sm flex items-center gap-1">
              <MapPin :size="12" />{{ trip.destination }}
            </p>
            <p class="text-white/60 text-xs mt-0.5">
              {{ formatRange(trip.startDate, trip.endDate) }} · {{ tripDuration }} day{{ tripDuration === 1 ? '' : 's' }}
            </p>
          </div>

          <div class="flex flex-col items-end gap-2">
            <!-- Collaborator avatars -->
            <div class="flex -space-x-2">
              <div
                v-for="c in trip.collaborators.slice(0, 4)"
                :key="c.email"
                :title="c.email"
                class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-medium text-white"
                :style="{ backgroundColor: avatarColor(c.email) }"
              >
                {{ c.email[0].toUpperCase() }}
              </div>
              <div
                v-if="trip.collaborators.length > 4"
                class="w-8 h-8 rounded-full border-2 border-white bg-white/20 flex items-center justify-center text-[11px] text-white"
              >
                +{{ trip.collaborators.length - 4 }}
              </div>
            </div>

            <!-- Edit / Done toggle -->
            <div v-if="canEdit" class="flex items-center gap-2">
              <Button
                v-if="!editMode"
                size="sm"
                variant="outline"
                class="bg-white/10 border-white/30 text-white hover:bg-white/20 text-[11px]"
                @click="enterEditMode"
              >
                <Pencil :size="12" /> Edit itinerary
              </Button>
              <template v-else>
                <Button
                  size="sm"
                  variant="outline"
                  class="bg-white/10 border-white/30 text-white hover:bg-white/20 text-[11px]"
                  @click="cancelEditMode"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  class="bg-white text-primary-brand hover:bg-white/90 text-[11px]"
                  :disabled="saving"
                  @click="saveAll"
                >
                  {{ saving ? 'Saving…' : 'Save changes' }}
                </Button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit mode banner -->
      <div v-if="editMode" class="bg-[#e8f1fb] text-[#1a5fa8] rounded-xl px-4 py-2.5 flex items-center gap-2 text-[12px]">
        <Pencil :size="13" />
        You're editing this itinerary. Make your changes across all sections, then click <strong class="mx-1">Save changes</strong> to apply.
      </div>

      <!-- Trip Details section -->
      <div class="bg-white rounded-xl p-5 flex flex-col gap-4">
        <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Trip details</p>

        <!-- View mode -->
        <div v-if="!editMode" class="flex flex-col gap-1.5">
          <p v-if="trip.notes" class="text-text-muted text-sm whitespace-pre-line">{{ trip.notes }}</p>
          <p v-else class="text-text-caption text-xs italic">No notes added.</p>
        </div>

        <!-- Edit mode -->
        <div v-else class="flex flex-col gap-3">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="text-text-muted text-[12px]">Trip name</label>
              <Input v-model="draft.name" placeholder="Trip name" class="mt-1" />
            </div>
            <div class="col-span-2">
              <label class="text-text-muted text-[12px]">Destination</label>
              <Input v-model="draft.destination" placeholder="City, Country" class="mt-1" />
            </div>
            <div>
              <label class="text-text-muted text-[12px]">Start date</label>
              <Input v-model="draft.startDate" type="date" class="mt-1" />
            </div>
            <div>
              <label class="text-text-muted text-[12px]">End date</label>
              <Input v-model="draft.endDate" type="date" class="mt-1" />
            </div>
            <div class="col-span-2">
              <label class="text-text-muted text-[12px]">Notes</label>
              <Textarea v-model="draft.notes" placeholder="Anything to remember?" class="mt-1" />
            </div>
          </div>
        </div>
      </div>

      <!-- Itinerary section -->
      <div class="bg-white rounded-xl p-5 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Itinerary</p>
          <Button
            v-if="canEdit"
            size="sm"
            variant="outline"
            class="text-xs gap-1"
            @click="openActivitySheet(null, null)"
          >
            <Plus :size="13" /> Add activity
          </Button>
        </div>

        <div v-for="(day, dayIdx) in itinerary" :key="day.date" class="flex flex-col">
          <!-- Day header -->
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[11px] font-semibold text-white bg-primary-brand rounded-full px-2.5 py-0.5">
              Day {{ dayIdx + 1 }}
            </span>
            <span class="text-xs text-text-muted">{{ dayLabel(day.date) }}</span>
            <button
              v-if="canEdit"
              type="button"
              class="ml-auto text-[11px] text-primary-brand hover:underline"
              @click="openActivitySheet(day.date, null)"
            >
              + Add
            </button>
          </div>

          <!-- Empty day -->
          <div v-if="day.activities.length === 0" class="pl-3 mb-3">
            <p class="text-text-caption text-[11px] italic">Nothing planned yet.</p>
          </div>

          <!-- Activities -->
          <div v-else class="flex flex-col">
            <div
              v-for="(activity, aIdx) in day.activities"
              :key="activity.id"
              class="flex gap-3 group"
            >
              <!-- Timeline -->
              <div class="flex flex-col items-center">
                <span class="text-base leading-none mt-0.5">{{ categoryEmoji(activity.category) }}</span>
                <div
                  v-if="aIdx < day.activities.length - 1"
                  class="w-px flex-1 bg-border my-1 min-h-4"
                ></div>
              </div>

              <!-- Content -->
              <div class="flex-1 pb-3">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex flex-col gap-0.5">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p v-if="activity.time" class="text-[11px] text-text-caption font-mono">{{ activity.time }}</p>
                      <p class="text-sm text-text-primary font-medium">{{ activity.name }}</p>
                    </div>
                    <p v-if="activity.location" class="text-[11px] text-text-caption">
                      📍 {{ activity.location }}
                    </p>
                    <p v-if="activity.notes" class="text-[11px] text-text-muted mt-0.5">{{ activity.notes }}</p>
                  </div>
                  <!-- Edit/delete always visible in edit mode, hover-only otherwise -->
                  <div
                    v-if="canEdit"
                    :class="[
                      'flex items-center gap-1 transition-opacity',
                      editMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    ]"
                  >
                    <button
                      type="button"
                      class="text-text-caption hover:text-text-primary p-1"
                      @click="openActivitySheet(null, activity)"
                    >
                      <Pencil :size="12" />
                    </button>
                    <button
                      type="button"
                      class="text-text-caption hover:text-destructive p-1"
                      @click="onRemoveActivity(activity.id)"
                    >
                      <X :size="12" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Accommodations section -->
      <div class="bg-white rounded-xl p-5 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Accommodations</p>
          <Button
            v-if="canEdit"
            size="sm"
            variant="outline"
            class="text-xs gap-1"
            @click="addingAccommodation = true"
          >
            <Plus :size="13" /> Add
          </Button>
        </div>

        <p v-if="trip.accommodations.length === 0 && !addingAccommodation" class="text-text-caption text-xs">
          No accommodations added yet.
        </p>

        <div v-else class="flex flex-col gap-2">
          <div
            v-for="a in trip.accommodations"
            :key="a.id"
            class="flex items-start justify-between border rounded-lg px-3 py-2.5 group"
          >
            <div class="flex flex-col gap-0.5">
              <div class="flex items-center gap-1.5">
                <span class="text-base">🏨</span>
                <p class="text-sm text-text-primary font-medium">{{ a.name }}</p>
              </div>
              <p class="text-xs text-text-caption">
                {{ formatRange(a.startDate, a.endDate) }}
                <template v-if="a.confirmationNum"> · Ref <span class="font-mono">{{ a.confirmationNum }}</span></template>
              </p>
            </div>
            <button
              v-if="canEdit"
              type="button"
              :class="[
                'transition-opacity text-text-caption hover:text-destructive mt-0.5 p-1',
                editMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              ]"
              @click="onRemoveAccommodation(a.id)"
            >
              <X :size="13" />
            </button>
          </div>
        </div>

        <!-- Add accommodation inline form -->
        <div v-if="addingAccommodation && canEdit" class="border rounded-lg p-3 flex flex-col gap-3 bg-background-brand">
          <div>
            <label class="text-text-muted text-[12px]">Property name</label>
            <Input v-model="newAccomm.name" placeholder="e.g. Kyoto Grand Hotel" class="mt-1" />
          </div>
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="text-text-muted text-[12px]">Check-in</label>
              <Input v-model="newAccomm.startDate" type="date" :min="trip.startDate" :max="trip.endDate" class="mt-1" />
            </div>
            <div class="flex-1">
              <label class="text-text-muted text-[12px]">Check-out</label>
              <Input v-model="newAccomm.endDate" type="date" :min="trip.startDate" :max="trip.endDate" class="mt-1" />
            </div>
          </div>
          <div>
            <label class="text-text-muted text-[12px]">Confirmation no. (optional)</label>
            <Input v-model="newAccomm.confirmationNum" placeholder="Optional" class="mt-1" />
          </div>
          <p v-if="accommError" class="text-destructive text-xs">{{ accommError }}</p>
          <div class="flex justify-end gap-2">
            <Button size="sm" variant="outline" @click="cancelAddAccommodation">Cancel</Button>
            <Button size="sm" :disabled="savingAccomm" @click="saveAccommodation">
              {{ savingAccomm ? 'Saving…' : 'Add' }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Budget & Payment section -->
      <div class="bg-white rounded-xl p-5 flex flex-col gap-4">
        <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Budget</p>

        <!-- Budget totals: view vs edit -->
        <div v-if="!editMode" class="flex items-baseline gap-2">
          <p class="text-text-primary text-2xl font-semibold">
            {{ trip.budget.currency }} {{ trip.budget.total.toLocaleString() }}
          </p>
          <p class="text-xs text-text-caption">
            · {{ splitLabel }} · {{ trip.budget.travelerCount }} traveler{{ trip.budget.travelerCount === 1 ? '' : 's' }}
          </p>
        </div>
        <div v-else class="flex gap-3 items-end">
          <div class="flex-1">
            <label class="text-text-muted text-[12px]">Total budget</label>
            <Input v-model.number="draft.budget.total" type="number" min="0" class="mt-1" />
          </div>
          <div class="w-28">
            <label class="text-text-muted text-[12px]">Currency</label>
            <Select v-model="draft.budget.currency">
              <SelectTrigger class="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="c in CURRENCIES" :key="c" :value="c">{{ c }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Expense tracker -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <p class="text-[12px] text-text-muted font-medium">Payment tracker</p>
            <Button
              v-if="canEdit"
              size="sm"
              variant="outline"
              class="text-xs gap-1"
              type="button"
              @click="openExpenseSheet(null)"
            >
              <Plus :size="13" /> Add expense
            </Button>
          </div>

          <!-- Progress bar (shown when there are expenses) -->
          <div v-if="trip.budget.expenses.length > 0" class="flex flex-col gap-1">
            <div class="w-full h-2 rounded-full bg-border overflow-hidden">
              <div
                class="h-full rounded-full bg-primary-brand transition-all"
                :style="{ width: `${expensePaidPercent}%` }"
              ></div>
            </div>
            <div class="flex justify-between text-[11px] text-text-caption">
              <span>{{ trip.budget.currency }} {{ expensePaidAmount.toLocaleString() }} of expenses paid</span>
              <span>{{ expensePaidPercent }}%</span>
            </div>
          </div>

          <!-- Per-person accordion -->
          <div v-if="trip.budget.expenses.length > 0" class="flex flex-col gap-2">
            <div
              v-for="summary in personSummaries"
              :key="summary.email"
              class="border rounded-lg overflow-hidden"
            >
              <!-- Person header row -->
              <button
                type="button"
                class="w-full flex items-center justify-between px-3 py-2.5 hover:bg-background-brand transition-colors text-left"
                @click="openPerson = openPerson === summary.email ? null : summary.email"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium text-white shrink-0"
                    :style="{ backgroundColor: avatarColor(summary.email) }"
                  >
                    {{ summary.email[0].toUpperCase() }}
                  </div>
                  <div class="flex flex-col items-start">
                    <div class="flex items-center gap-1.5">
                      <p class="text-sm text-text-primary">{{ summary.email }}</p>
                      <span v-if="summary.email === auth.currentUser?.email" class="text-[10px] bg-secondary-brand text-primary-brand px-1.5 rounded-full">You</span>
                    </div>
                    <p class="text-[11px] text-text-caption">
                      Owes {{ trip.budget.currency }} {{ summary.totalOwed.toFixed(2) }}
                      · Paid {{ trip.budget.currency }} {{ summary.totalPaid.toFixed(2) }}
                      <span :class="summary.outstanding > 0 ? 'text-[#a36c00]' : 'text-primary-brand'">
                        · Due {{ trip.budget.currency }} {{ summary.outstanding.toFixed(2) }}
                      </span>
                    </p>
                  </div>
                </div>
                <ChevronDown
                  :size="14"
                  class="text-text-caption transition-transform shrink-0"
                  :class="openPerson === summary.email ? 'rotate-180' : ''"
                />
              </button>

              <!-- Expanded expense list -->
              <div v-show="openPerson === summary.email" class="border-t">
                <div
                  v-for="expense in summary.expenses"
                  :key="expense.id"
                  class="flex items-start justify-between px-3 py-2 gap-2 border-b last:border-b-0 bg-background-brand"
                >
                  <div class="flex flex-col gap-0.5 flex-1 min-w-0">
                    <p class="text-sm text-text-primary truncate">{{ expense.description }}</p>
                    <p class="text-[11px] text-text-caption">
                      Paid by {{ expense.paidBy === auth.currentUser?.email ? 'you' : expense.paidBy }}
                      · {{ trip.budget.currency }} {{ owedAmount(expense, summary.email).toFixed(2) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span
                      :class="[
                        'text-[11px] px-2 py-0.5 rounded-full font-medium',
                        expense.paymentStatus === 'paid'
                          ? 'bg-secondary-brand text-primary-brand'
                          : 'bg-[#fef3e2] text-[#a36c00]'
                      ]"
                    >
                      {{ expense.paymentStatus === 'paid' ? 'Paid' : 'Unpaid' }}
                    </span>
                    <button
                      v-if="canEdit"
                      type="button"
                      class="text-[11px] text-text-caption hover:text-text-primary border rounded px-2 py-0.5 whitespace-nowrap"
                      @click="onToggleExpensePaid(expense)"
                    >
                      {{ expense.paymentStatus === 'paid' ? 'Mark unpaid' : 'Mark paid' }}
                    </button>
                    <button
                      v-if="canEdit"
                      type="button"
                      class="text-text-caption hover:text-destructive p-1"
                      @click="openExpenseSheet(expense)"
                    >
                      <Pencil :size="12" />
                    </button>
                    <button
                      v-if="canEdit"
                      type="button"
                      class="text-text-caption hover:text-destructive p-1"
                      @click="onRemoveExpense(expense.id)"
                    >
                      <X :size="12" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No expenses yet + legacy splits fallback -->
          <template v-if="trip.budget.expenses.length === 0">
            <p v-if="trip.budget.splits.length === 0" class="text-text-caption text-xs">
              No expenses logged yet. Click "+ Add expense" to start tracking.
            </p>
            <template v-else>
              <p class="text-[11px] text-text-caption italic">No expenses logged yet. Legacy budget splits shown below.</p>
              <div
                v-for="split in trip.budget.splits"
                :key="split.email || 'anon'"
                class="flex items-center justify-between border rounded-lg px-3 py-2"
              >
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-1.5">
                    <p class="text-sm text-text-primary">{{ split.email || 'Unnamed traveler' }}</p>
                    <span v-if="split.email === auth.currentUser?.email" class="text-[10px] bg-secondary-brand text-primary-brand px-1.5 rounded-full">You</span>
                  </div>
                  <p class="text-xs text-text-caption">{{ trip.budget.currency }} {{ split.amount.toLocaleString() }}</p>
                </div>
                <span
                  :class="[
                    'text-[11px] px-2 py-0.5 rounded-full font-medium',
                    split.paymentStatus === 'paid'
                      ? 'bg-secondary-brand text-primary-brand'
                      : 'bg-[#fef3e2] text-[#a36c00]'
                  ]"
                >
                  {{ split.paymentStatus === 'paid' ? 'Paid' : 'Unpaid' }}
                </span>
              </div>
            </template>
          </template>
        </div>
      </div>

      <!-- Collaborators section -->
      <div class="bg-white rounded-xl p-5 flex flex-col gap-3">
        <p class="text-xs font-semibold text-text-muted uppercase tracking-wide">Collaborators</p>

        <p v-if="trip.collaborators.length === 0" class="text-text-caption text-xs">Just you for now.</p>

        <div v-else class="flex flex-col gap-2">
          <div
            v-for="c in trip.collaborators"
            :key="c.email"
            class="flex items-center justify-between border rounded-lg px-3 py-2 group"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium text-white shrink-0"
                :style="{ backgroundColor: avatarColor(c.email) }"
              >
                {{ c.email[0].toUpperCase() }}
              </div>
              <div class="flex flex-col">
                <p class="text-sm text-text-primary">{{ c.email }}</p>
                <div class="flex items-center gap-1.5">
                  <span class="text-[11px] text-text-caption capitalize">{{ c.role }}</span>
                  <span
                    :class="[
                      'text-[10px] px-1.5 rounded-full',
                      c.status === 'accepted'
                        ? 'bg-secondary-brand text-primary-brand'
                        : 'bg-[#fef3e2] text-[#a36c00]'
                    ]"
                  >
                    {{ c.status === 'accepted' ? 'Joined' : 'Pending' }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="isOwner" class="flex items-center gap-1">
              <!-- Role toggle -->
              <Select
                :model-value="c.role"
                @update:model-value="(r) => updateCollaboratorRole(c.email, r as CollaboratorRole)"
              >
                <SelectTrigger class="h-7 text-[11px] w-20 px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>

              <!-- Copy invite link (pending only) -->
              <button
                v-if="c.status === 'pending' && c.inviteToken"
                type="button"
                :title="copiedToken === c.inviteToken ? 'Copied!' : 'Copy invite link'"
                class="text-text-caption hover:text-primary-brand p-1"
                @click="copyInviteLink(c.inviteToken!)"
              >
                <component :is="copiedToken === c.inviteToken ? CheckCircle2 : Link" :size="14" />
              </button>

              <!-- Remove collaborator — always visible in edit mode, hover-only otherwise -->
              <button
                type="button"
                :class="[
                  'p-1 text-text-caption hover:text-destructive transition-opacity',
                  editMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                ]"
                title="Remove collaborator"
                @click="removeCollaborator(c.email)"
              >
                <X :size="14" />
              </button>
            </div>
          </div>
        </div>

        <!-- Add collaborator (owner only) -->
        <div v-if="isOwner" class="flex flex-col gap-2 pt-1">
          <div class="flex gap-2 items-center">
            <Input
              v-model="newCollabEmail"
              placeholder="Email address"
              class="flex-1 text-sm"
              @keydown.enter.prevent="addCollaborator"
            />
            <Select v-model="newCollabRole">
              <SelectTrigger class="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" @click="addCollaborator">Invite</Button>
          </div>
          <p v-if="collabError" class="text-destructive text-xs">{{ collabError }}</p>
        </div>
      </div>

      <!-- Danger zone (owner only) -->
      <div v-if="isOwner" class="flex items-center justify-end">
        <Button
          size="sm"
          variant="outline"
          class="text-destructive hover:text-destructive"
          :disabled="deleting"
          @click="onDelete"
        >
          <Trash2 :size="14" />
          {{ deleting ? 'Deleting…' : 'Delete trip' }}
        </Button>
      </div>
    </template>
  </div>

  <!-- Activity Sheet -->
  <ActivitySheet
    v-if="trip"
    v-model:open="sheetOpen"
    :min-date="trip.startDate"
    :max-date="trip.endDate"
    :default-date="sheetDefaultDate"
    :editing="editingActivity"
    @save="onSaveActivity"
  />

  <!-- Expense Sheet -->
  <ExpenseSheet
    v-if="trip"
    v-model:open="expenseSheetOpen"
    :trip-members="tripMembers"
    :currency="trip.budget.currency"
    :editing="editingExpense"
    @save="onSaveExpense"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import {
  CheckCircle2, ChevronDown, Link, MapPin, Pencil, Plus, Trash2, X,
} from "lucide-vue-next";
import Badge from "@/components/ui/badge/Badge.vue";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import ActivitySheet from "@/components/trips/ActivitySheet.vue";
import ExpenseSheet from "@/components/trips/ExpenseSheet.vue";
import { eachDay, dayLabel, formatRange, tripStatus } from "@/lib/dates";
import {
  ACTIVITY_CATEGORIES, SPLIT_MODES,
  type Activity, type ActivityCategory, type CollaboratorRole, type Expense, type PaymentStatus,
} from "@/types";
import type { ActivityInput, AccommodationInput, ExpenseInput } from "@/repositories/types";
import { useAuthStore } from "@/stores/auth";
import { useTripsStore } from "@/stores/trips";

const CURRENCIES = ["MYR", "USD", "EUR", "JPY", "GBP", "SGD", "AUD", "CAD"];

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const trips = useTripsStore();

const deleting = ref(false);
const saving = ref(false);
const sheetOpen = ref(false);
const sheetDefaultDate = ref<string | undefined>();
const editingActivity = ref<Activity | null>(null);

// Global edit mode
const editMode = ref(false);

// Draft state for editable fields (populated when edit mode is entered)
const draft = reactive({
  name: "",
  destination: "",
  startDate: "",
  endDate: "",
  notes: "",
  budget: { total: 0, currency: "MYR" },
});

// Expense sheet state
const expenseSheetOpen = ref(false);
const editingExpense = ref<Expense | null>(null);
const openPerson = ref<string | null>(null);

// Accommodation add state
const addingAccommodation = ref(false);
const savingAccomm = ref(false);
const accommError = ref<string | null>(null);
const newAccomm = reactive({ name: "", startDate: "", endDate: "", confirmationNum: "" });

// Collaborator add state
const newCollabEmail = ref("");
const newCollabRole = ref<CollaboratorRole>("viewer");
const collabError = ref<string | null>(null);
const copiedToken = ref<string | null>(null);

onMounted(() => {
  if (trips.list.length === 0) trips.load();
});

const trip = computed(() => trips.byId(route.params.id as string));

const isOwner = computed(() => !!trip.value && trip.value.ownerId === auth.currentUser?.id);
const canEdit = computed(() => {
  if (!trip.value || !auth.currentUser) return false;
  if (isOwner.value) return true;
  return trip.value.collaborators.some(
    (c) => c.userId === auth.currentUser!.id && c.role === "editor" && c.status === "accepted"
  );
});

const status = computed(() =>
  trip.value ? tripStatus(trip.value.startDate, trip.value.endDate) : null
);

const statusLabel = computed(() => {
  if (status.value === "upcoming") return "Upcoming";
  if (status.value === "ongoing") return "Ongoing";
  if (status.value === "past") return "Past";
  return "";
});

const statusBadgeClass = computed(() => {
  if (status.value === "upcoming") return "bg-secondary-brand text-primary-brand";
  if (status.value === "ongoing") return "bg-[#e8f1fb] text-[#1a5fa8]";
  return "bg-white/20 text-white/80";
});

const heroGradients: Record<string, string> = {
  Cultural: "linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)",
  Beach:    "linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)",
  Adventure:"linear-gradient(135deg, #6b4226 0%, #e07b39 100%)",
  Food:     "linear-gradient(135deg, #c1121f 0%, #e85d04 100%)",
  Business: "linear-gradient(135deg, #343a40 0%, #6c757d 100%)",
};

const heroGradient = computed(() =>
  trip.value ? (heroGradients[trip.value.type] ?? heroGradients.Cultural) : heroGradients.Cultural
);

const tripDuration = computed(() => {
  if (!trip.value) return 0;
  const start = new Date(trip.value.startDate);
  const end = new Date(trip.value.endDate);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
});

function avatarColor(email: string): string {
  const colors = ["#2d6a4f", "#0077b6", "#6b4226", "#c1121f", "#6a2d6a", "#2d4a6a"];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function categoryEmoji(cat: ActivityCategory): string {
  return ACTIVITY_CATEGORIES.find((c) => c.value === cat)?.emoji ?? "📌";
}

const itinerary = computed(() => {
  if (!trip.value) return [];
  return eachDay(trip.value.startDate, trip.value.endDate).map((date) => ({
    date,
    activities: [...(trip.value!.activities ?? [])]
      .filter((a) => a.date === date)
      .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? "")),
  }));
});

const splitLabel = computed(() =>
  trip.value
    ? SPLIT_MODES.find((s) => s.value === trip.value!.budget.splitMode)?.label ?? trip.value.budget.splitMode
    : ""
);

// All people who can appear in splits: owner + collaborators
const tripMembers = computed(() => {
  if (!trip.value) return [];
  const ownerEmail = auth.currentUser?.email ?? "";
  const members: { email: string; label: string }[] = [];
  if (ownerEmail) members.push({ email: ownerEmail, label: `${ownerEmail} (you)` });
  for (const c of trip.value.collaborators) {
    if (c.email.toLowerCase() !== ownerEmail.toLowerCase()) {
      members.push({ email: c.email, label: c.email });
    }
  }
  return members;
});

const expensePaidAmount = computed(() => {
  if (!trip.value) return 0;
  return trip.value.budget.expenses
    .filter((e) => e.paymentStatus === "paid")
    .reduce((sum, e) => sum + e.amount, 0);
});

const expenseTotalAmount = computed(() => {
  if (!trip.value) return 0;
  return trip.value.budget.expenses.reduce((sum, e) => sum + e.amount, 0);
});

const expensePaidPercent = computed(() => {
  if (expenseTotalAmount.value === 0) return 0;
  return Math.round((expensePaidAmount.value / expenseTotalAmount.value) * 100);
});

const personSummaries = computed(() => {
  if (!trip.value) return [];
  return tripMembers.value.map((member) => {
    const expenses = trip.value!.budget.expenses.filter((e) =>
      e.owedBy.some((o) => o.email.toLowerCase() === member.email.toLowerCase())
    );
    const totalOwed = expenses.reduce((sum, e) => {
      const share = e.owedBy.find((o) => o.email.toLowerCase() === member.email.toLowerCase());
      return sum + (share?.amount ?? 0);
    }, 0);
    const totalPaid = expenses
      .filter((e) => e.paymentStatus === "paid")
      .reduce((sum, e) => {
        const share = e.owedBy.find((o) => o.email.toLowerCase() === member.email.toLowerCase());
        return sum + (share?.amount ?? 0);
      }, 0);
    return {
      email: member.email,
      totalOwed: Math.round(totalOwed * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      outstanding: Math.round((totalOwed - totalPaid) * 100) / 100,
      expenses,
    };
  }).filter((s) => s.expenses.length > 0);
});

function owedAmount(expense: Expense, email: string): number {
  return expense.owedBy.find((o) => o.email.toLowerCase() === email.toLowerCase())?.amount ?? 0;
}

// Edit mode entry / exit
function populateDraft() {
  if (!trip.value) return;
  draft.name = trip.value.name;
  draft.destination = trip.value.destination;
  draft.startDate = trip.value.startDate;
  draft.endDate = trip.value.endDate;
  draft.notes = trip.value.notes ?? "";
  draft.budget.total = trip.value.budget.total;
  draft.budget.currency = trip.value.budget.currency;
}

function enterEditMode() {
  populateDraft();
  editMode.value = true;
}

function cancelEditMode() {
  editMode.value = false;
  addingAccommodation.value = false;
  accommError.value = null;
}

// Re-populate draft if trip data changes while editing (e.g. after a sub-action save)
watch(trip, (t) => { if (editMode.value && t) populateDraft(); }, { deep: false });

async function saveAll() {
  if (!trip.value) return;
  saving.value = true;
  try {
    await trips.update(trip.value.id, {
      name: draft.name,
      destination: draft.destination,
      startDate: draft.startDate,
      endDate: draft.endDate,
      notes: draft.notes || undefined,
      budget: {
        ...trip.value.budget,
        total: draft.budget.total,
        currency: draft.budget.currency,
      },
    });
    editMode.value = false;
  } finally {
    saving.value = false;
  }
}

// Activity sheet
function openActivitySheet(date: string | null, activity: Activity | null) {
  editingActivity.value = activity;
  sheetDefaultDate.value = date ?? undefined;
  sheetOpen.value = true;
}

async function onSaveActivity(input: ActivityInput) {
  if (!trip.value) return;
  if (editingActivity.value) {
    await trips.updateActivity(trip.value.id, editingActivity.value.id, input);
  } else {
    await trips.addActivity(trip.value.id, input);
  }
}

async function onRemoveActivity(activityId: string) {
  if (!trip.value) return;
  await trips.removeActivity(trip.value.id, activityId);
}

// Accommodation
function cancelAddAccommodation() {
  addingAccommodation.value = false;
  accommError.value = null;
  newAccomm.name = "";
  newAccomm.startDate = "";
  newAccomm.endDate = "";
  newAccomm.confirmationNum = "";
}

async function saveAccommodation() {
  if (!trip.value) return;
  accommError.value = null;
  if (!newAccomm.name.trim()) { accommError.value = "Property name is required"; return; }
  if (!newAccomm.startDate) { accommError.value = "Check-in date is required"; return; }
  if (!newAccomm.endDate) { accommError.value = "Check-out date is required"; return; }
  if (newAccomm.endDate < newAccomm.startDate) { accommError.value = "Check-out must be after check-in"; return; }
  savingAccomm.value = true;
  try {
    const input: AccommodationInput = {
      name: newAccomm.name.trim(),
      startDate: newAccomm.startDate,
      endDate: newAccomm.endDate,
      confirmationNum: newAccomm.confirmationNum || undefined,
    };
    await trips.addAccommodation(trip.value.id, input);
    cancelAddAccommodation();
  } finally {
    savingAccomm.value = false;
  }
}

async function onRemoveAccommodation(accommodationId: string) {
  if (!trip.value) return;
  await trips.removeAccommodation(trip.value.id, accommodationId);
}

// Expense handlers
function openExpenseSheet(expense: Expense | null) {
  editingExpense.value = expense;
  expenseSheetOpen.value = true;
}

async function onSaveExpense(input: ExpenseInput) {
  if (!trip.value) return;
  if (editingExpense.value) {
    await trips.removeExpense(trip.value.id, editingExpense.value.id);
    await trips.addExpense(trip.value.id, input);
  } else {
    await trips.addExpense(trip.value.id, input);
  }
}

async function onRemoveExpense(expenseId: string) {
  if (!trip.value) return;
  await trips.removeExpense(trip.value.id, expenseId);
}

async function onToggleExpensePaid(expense: Expense) {
  if (!trip.value) return;
  const next: PaymentStatus = expense.paymentStatus === "paid" ? "unpaid" : "paid";
  await trips.toggleExpensePaid(trip.value.id, expense.id, next);
}

// Collaborators
async function addCollaborator() {
  if (!trip.value) return;
  collabError.value = null;
  const email = newCollabEmail.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    collabError.value = "Enter a valid email";
    return;
  }
  const existing = trip.value.collaborators.find((c) => c.email.toLowerCase() === email.toLowerCase());
  if (existing) { collabError.value = "Already invited"; return; }

  const token = crypto.randomUUID();
  await trips.update(trip.value.id, {
    collaborators: [
      ...trip.value.collaborators,
      { email, role: newCollabRole.value, status: "pending", inviteToken: token },
    ],
  });
  newCollabEmail.value = "";
  collabError.value = null;
}

async function removeCollaborator(email: string) {
  if (!trip.value) return;
  await trips.update(trip.value.id, {
    collaborators: trip.value.collaborators.filter(
      (c) => c.email.toLowerCase() !== email.toLowerCase()
    ),
  });
}

async function updateCollaboratorRole(email: string, role: CollaboratorRole) {
  if (!trip.value) return;
  await trips.update(trip.value.id, {
    collaborators: trip.value.collaborators.map((c) =>
      c.email.toLowerCase() === email.toLowerCase() ? { ...c, role } : c
    ),
  });
}

async function copyInviteLink(token: string) {
  const url = `${window.location.origin}/invite/${token}`;
  try {
    await navigator.clipboard.writeText(url);
    copiedToken.value = token;
    setTimeout(() => { copiedToken.value = null; }, 2000);
  } catch {
    prompt("Copy this invite link:", url);
  }
}

// Delete trip
async function onDelete() {
  if (!trip.value) return;
  if (!confirm(`Delete "${trip.value.name}"? This cannot be undone.`)) return;
  deleting.value = true;
  try {
    await trips.remove(trip.value.id);
    router.push({ name: "mytrip" });
  } finally {
    deleting.value = false;
  }
}
</script>
