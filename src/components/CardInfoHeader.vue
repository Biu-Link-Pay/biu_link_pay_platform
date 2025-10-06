<template>
  <div class="mb-8">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Card</h3>
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-8 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
            <div
              class="w-6 h-4 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-sm flex items-center justify-center">
              <div class="w-3 h-2 bg-white rounded-sm"></div>
            </div>
          </div>
          <div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-600 dark:text-gray-400">Card Number</div>
          <div class="text-lg font-mono font-semibold text-gray-900 dark:text-white">
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
}

const props = defineProps<Props>()

const maskedCardNumber = computed(() => {
  const cardNumber = props.cardNo || ''
  if (cardNumber && cardNumber.length >= 4) return cardNumber.slice(-4)
  return '****'
})
</script>

<style scoped></style>
