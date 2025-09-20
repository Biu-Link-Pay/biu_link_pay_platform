<template>
  <div
    class="relative bg-white dark:bg-gray-800 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"
    :class="selected ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
    @click="$emit('select')">
    <!-- Selection Indicator -->
    <div v-if="selected" class="absolute top-3 right-3">
      <div class="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
        <i class="pi pi-check text-white text-xs"></i>
      </div>
    </div>

    <!-- Card BIN Info -->
    <div class="space-y-3">
      <!-- Card BIN -->
      <div class="text-center">
        <div class="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {{ binInfo.cardBin || '**** ****' }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">Card BIN</div>
      </div>

      <!-- Card Details -->
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500 dark:text-gray-400">Type:</span>
          <span class="text-xs font-medium text-gray-900 dark:text-white">{{ binInfo.cardType || 'N/A' }}</span>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500 dark:text-gray-400">Scheme:</span>
          <span class="text-xs font-medium text-gray-900 dark:text-white">{{ binInfo.cardScheme || 'N/A' }}</span>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500 dark:text-gray-400">Currency:</span>
          <span class="text-xs font-medium text-gray-900 dark:text-white">{{ binInfo.cardCurrency || 'USD' }}</span>
        </div>
      </div>

      <!-- Availability -->
      <div class="pt-2 border-t border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500 dark:text-gray-400">Available:</span>
          <span class="text-xs font-medium" :class="getAvailabilityClass()">
            {{ getAvailabilityText() }}
          </span>
        </div>
      </div>

      <!-- Features -->
      <div class="pt-2 border-t border-gray-100">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400">Features:</span>
          <div class="flex space-x-1">
            <div v-if="binInfo.billingAddressUpdatable === 'true'"
              class="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center"
              title="Address Update Supported">
              <i class="pi pi-home text-green-600 text-xs"></i>
            </div>
            <div v-if="binInfo.expiryDateCustomization === 'true'"
              class="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center"
              title="Expiry Date Customization">
              <i class="pi pi-calendar text-blue-600 text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Overlay -->
    <div v-if="selected" class="absolute inset-0 bg-yellow-400/10 rounded-xl pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CardBin } from '@/api/card'

// 定义 props
interface Props {
  binInfo: CardBin
  selected: boolean
}

const props = defineProps<Props>()

// 定义 emits
const emit = defineEmits<{
  select: []
}>()

// 获取可用性文本
const getAvailabilityText = () => {
  const available = props.binInfo.remainingAvailableCard
  if (available === null || available === undefined) {
    return 'Unlimited'
  }
  return available > 0 ? available.toString() : 'Out of Stock'
}

// 获取可用性样式类
const getAvailabilityClass = () => {
  const available = props.binInfo.remainingAvailableCard
  if (available === null || available === undefined || available > 0) {
    return 'text-green-600'
  }
  return 'text-red-600'
}
</script>
