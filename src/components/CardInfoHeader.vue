<template>
  <div class="w-full mb-6 md:mb-8">
    <h3 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">Your Card</h3>
    <div
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 md:space-x-4">
          <div
            class="w-10 h-7 md:w-12 md:h-8 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
            <div
              class="w-5 h-3.5 md:w-6 md:h-4 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-sm flex items-center justify-center">
              <div class="w-2.5 h-1.5 md:w-3 md:h-2 bg-white rounded-sm"></div>
            </div>
          </div>
          <div v-if="balance !== undefined">
            <div class="text-xs md:text-sm text-gray-600 dark:text-gray-400">Balance</div>
            <div v-if="loading" class="text-base md:text-lg font-bold text-gray-900 dark:text-white">
              <i class="pi pi-spin pi-spinner text-sm"></i>
            </div>
            <div v-else class="text-base md:text-lg font-bold text-gray-900 dark:text-white">
              {{ formatBalance }}
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">Card Number</div>
          <div class="text-base md:text-lg font-mono font-semibold text-gray-900 dark:text-white">
            **** {{ maskedCardNumber }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  cardNo?: string
  balance?: number
  loading?: boolean
}

const props = defineProps<Props>()

const maskedCardNumber = computed(() => {
  const cardNumber = props.cardNo || ''
  if (cardNumber && cardNumber.length >= 4) return cardNumber.slice(-4)
  return '****'
})

const formatBalance = computed(() => {
  if (props.balance === undefined || props.balance === null) return '$0.00'
  return `$${props.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
})
</script>

<style scoped></style>
