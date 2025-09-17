<template>
  <Card class="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
    <template #content>
      <div class="p-6">
        <!-- Card Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-1">{{ card.cardName }}</h3>
            <p class="text-sm text-gray-500 mb-2">{{ cardTypeText }}</p>
            <div class="flex items-center space-x-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="statusClasses">
                <i :class="statusIcon" class="mr-1"></i>
                {{ statusText }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-900">${{ card.applyFee }}</div>
            <div class="text-sm text-gray-500">Apply Fee</div>
          </div>
        </div>

        <!-- Card Image -->
        <div class="mb-4">
          <div
            class="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <img :src="card.cardPicture || ''" :alt="card.cardName" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Card Description -->
        <div class="mb-4">
          <p class="text-gray-600 leading-relaxed">{{ cardDescription }}</p>
        </div>

        <!-- Card Details -->
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">Card Details:</h4>
          <ul class="space-y-2">
            <li class="flex items-center justify-between text-sm text-gray-600">
              <span>Monthly Fee:</span>
              <span class="font-medium">${{ card.monthlyFee }}</span>
            </li>
            <li class="flex items-center justify-between text-sm text-gray-600">
              <span>Recharge Fee:</span>
              <span class="font-medium">${{ card.rechargeFee }}</span>
            </li>
            <li class="flex items-center justify-between text-sm text-gray-600">
              <span>Monthly Limit:</span>
              <span class="font-medium">${{ card.maxOnMonthly }}</span>
            </li>
            <li class="flex items-center justify-between text-sm text-gray-600">
              <span>Daily Limit:</span>
              <span class="font-medium">${{ card.maxOnDaily }}</span>
            </li>
            <li class="flex items-center justify-between text-sm text-gray-600">
              <span>Max Single Transaction:</span>
              <span class="font-medium">${{ card.maxOnPercent }}</span>
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <div class="flex space-x-2">
            <Button :label="`Order a ${card.cardPattern === 1 ? 'Virtual' : 'Physical'} Card`" severity="primary"
              class="flex-1" :disabled="card.status !== 1" @click="$emit('order', card)" />
            <Button v-if="card.cardPattern === 2" :label="`Activate my Physical Card`" severity="primary" class="flex-1"
              :disabled="card.status !== 1" @click="$emit('activate', card)" />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { CardConfig } from '@/api/card'

// 定义 props
interface Props {
  card: CardConfig
  selected: boolean
}

const props = defineProps<Props>()

// 定义 emits
const emit = defineEmits<{
  select: [card: Props['card']]
  order: [card: Props['card']]
  activate: [card: Props['card']]
}>()

// 计算属性
const statusClasses = computed(() => {
  switch (props.card.status) {
    case 1: // 启用
      return 'bg-green-100 text-green-800'
    case 2: // 禁用
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const statusIcon = computed(() => {
  switch (props.card.status) {
    case 1: // 启用
      return 'pi pi-check-circle'
    case 2: // 禁用
      return 'pi pi-times-circle'
    default:
      return 'pi pi-info-circle'
  }
})

const statusText = computed(() => {
  switch (props.card.status) {
    case 1: // 启用
      return 'Available'
    case 2: // 禁用
      return 'Unavailable'
    default:
      return 'Unknown'
  }
})

const cardTypeText = computed(() => {
  return props.card.cardPattern === 1 ? 'Virtual Card' : 'Physical Card'
})

const cardDescription = computed(() => {
  if (props.card.cardPattern === 1) {
    return 'A virtual card for online transactions, offering convenience and security.'
  } else if (props.card.cardPattern === 2) {
    return 'A physical card for in-store and online purchases, providing a tangible payment solution.'
  }
  return 'Flexible payment solution for various needs.'
})
</script>
