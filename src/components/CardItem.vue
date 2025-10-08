<template>
  <Card class="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
    <template #content>
      <div class="p-6">
        <!-- Card Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ card.cardName }}</h3>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">${{ card.applyFee }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Apply Fee</div>
          </div>
        </div>

        <!-- Card Image -->
        <div class="mb-4">
          <div
            class="w-full rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <img :src="card.cardPicture || ''" :alt="card.cardName" class="w-full h-auto object-contain" />
          </div>
        </div>

        <!-- Card Details -->
        <div class="mb-6">
          <div class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 sm:p-6">
            <h4 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Card Details
            </h4>
            <div class="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
              <div class="flex flex-col">
                <span
                  class="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 whitespace-nowrap">Monthly
                  Fee</span>
                <span class="text-base font-semibold text-gray-900 dark:text-white">${{ card.monthlyFee }}</span>
              </div>
              <div class="flex flex-col">
                <span
                  class="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 whitespace-nowrap">Recharge
                  Fee</span>
                <span class="text-base font-semibold text-gray-900 dark:text-white">{{ card.rechargeFee }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <div class="flex space-x-2">
            <Button :label="`Order a ${card.cardPattern === 1 ? 'Virtual' : 'Physical'} Card`" severity="primary"
              class="flex-1" :disabled="card.cardPattern !== 1" @click="$emit('order', card)" />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { CardConfig } from '@/api/card'

// Define props
interface Props {
  card: CardConfig
  selected: boolean
}

const props = defineProps<Props>()

// Define emits
const emit = defineEmits<{
  select: [card: Props['card']]
  order: [card: Props['card']]
  activate: [card: Props['card']]
}>()

// Computed properties
const statusClasses = computed(() => {
  switch (props.card.status) {
    case 1: // Enabled
      return 'bg-green-100 text-green-800'
    case 2: // Disabled
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const statusIcon = computed(() => {
  switch (props.card.status) {
    case 1: // Enabled
      return 'pi pi-check-circle'
    case 2: // Disabled
      return 'pi pi-times-circle'
    default:
      return 'pi pi-info-circle'
  }
})


const cardTypeText = computed(() => {
  return props.card.cardPattern === 1 ? 'Virtual Card' : 'Physical Card'
})

</script>
