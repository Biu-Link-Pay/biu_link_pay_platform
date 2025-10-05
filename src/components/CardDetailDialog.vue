<template>
  <Dialog :visible="visible" modal header="Card Details" :style="{ width: '90vw', maxWidth: '600px' }"
    :breakpoints="{ '960px': '75vw', '640px': '95vw' }" :draggable="false" class="card-detail-dialog"
    @update:visible="onUpdateVisible">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-3xl text-blue-600 mb-3"></i>
        <p class="text-sm text-gray-600">Loading card details...</p>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-exclamation-triangle text-red-600 text-2xl"></i>
      </div>
      <p class="text-sm text-red-600 mb-4">{{ error }}</p>
      <button @click="$emit('retry')"
        class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        :disabled="loading">
        <i class="pi pi-refresh mr-2"></i>
        Retry
      </button>
    </div>

    <div v-else-if="cardDetail" class="space-y-6">
      <!-- Card Number Section -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs font-semibold uppercase text-blue-600 tracking-wide">Card Number</div>
          <button @click="copyToClipboard(formatCardNumber(cardDetail.cardNo))"
            class="p-1.5 hover:bg-blue-100 rounded-lg transition-colors" title="Copy card number">
            <i class="pi pi-copy text-blue-600 text-sm"></i>
          </button>
        </div>
        <div class="text-xl font-mono text-gray-900 tracking-[0.3em] font-bold">
          {{ formatCardNumber(cardDetail.cardNo) }}
        </div>
      </div>

      <!-- Card Balance Section -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <div class="mb-3">
          <div class="text-xs font-semibold uppercase text-green-600 tracking-wide">Available Balance</div>
        </div>
        <div class="text-2xl font-bold text-gray-900">
          {{ formatBalance(cardDetail.cardBalance) }} {{ cardDetail.cardCurrency }}
        </div>
      </div>

      <!-- Card Information Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wide">Cardholder</div>
          <div class="text-base font-semibold text-gray-900">
            {{ cardDetail.firstName }} {{ cardDetail.lastName }}
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wide">Currency</div>
          <div class="text-base font-semibold text-gray-900">
            {{ cardDetail.cardCurrency }}
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wide">Expiration</div>
          <div class="text-base font-semibold text-gray-900">
            {{ cardDetail.expirationDate }}
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wide">CVV</div>
          <div class="text-base font-semibold text-gray-900">
            {{ cardDetail.cvv }}
          </div>
        </div>
      </div>

      <!-- Billing Address Section -->
      <div class="bg-gray-50 rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs font-semibold uppercase text-gray-500 tracking-wide">Billing Address</div>
          <button
            @click="copyToClipboard(`${cardDetail.billingAddress}, ${cardDetail.billingCity}, ${cardDetail.billingState} ${cardDetail.billingPostalCode}, ${cardDetail.billingCountry}`)"
            class="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="Copy address">
            <i class="pi pi-copy text-gray-600 text-sm"></i>
          </button>
        </div>
        <div class="space-y-1 text-sm text-gray-700">
          <div class="font-medium">{{ cardDetail.billingAddress }}</div>
          <div>{{ cardDetail.billingCity }}, {{ cardDetail.billingState }} {{ cardDetail.billingPostalCode }}</div>
          <div>{{ cardDetail.billingCountry }}</div>
        </div>
      </div>

      <!-- Address Update Status -->
      <div class="flex items-center gap-2 p-3 rounded-lg" :class="isAddressUpdatable(cardDetail.billingAddressUpdatable)
        ? 'bg-green-50 border border-green-200'
        : 'bg-orange-50 border border-orange-200'">
        <i :class="isAddressUpdatable(cardDetail.billingAddressUpdatable)
          ? 'pi pi-check-circle text-green-600'
          : 'pi pi-info-circle text-orange-600'"></i>
        <span :class="isAddressUpdatable(cardDetail.billingAddressUpdatable)
          ? 'text-green-700 text-sm'
          : 'text-orange-700 text-sm'">
          {{ isAddressUpdatable(cardDetail.billingAddressUpdatable)
            ? 'Billing address can be updated'
            : 'Billing address cannot be updated' }}
        </span>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500">
      No card details available.
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import type { CardDetailResponse } from '@/api/card'
import { copyWithToast } from '@/utils'
import { useToast } from 'primevue/usetoast'

interface Props {
  visible: boolean
  loading: boolean
  error: string | null
  cardDetail: CardDetailResponse | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'retry'): void
}>()

const visible = computed(() => props.visible)
const toast = useToast()

const onUpdateVisible = (value: boolean) => {
  emit('update:visible', value)
}

const copyToClipboard = async (text: string) => {
  await copyWithToast(text, toast)
}

const formatCardNumber = (cardNo?: string) => {
  if (!cardNo) return 'N/A'
  const digits = cardNo.replace(/\D/g, '')
  if (!digits) return 'N/A'
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

const isAddressUpdatable = (value?: string | null) => {
  if (!value) {
    return false
  }
  const normalized = value.toString().trim().toLowerCase()
  return normalized === 'y' || normalized === 'true' || normalized === '1'
}

const formatBalance = (balance: number) => {
  return Number(balance || 0).toFixed(2)
}
</script>

<style scoped>
/* Card Detail Dialog Styles */
::deep(.card-detail-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
}

::deep(.card-detail-dialog .p-dialog-header .p-dialog-title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

::deep(.card-detail-dialog .p-dialog-content) {
  padding: 2rem;
  background: #ffffff;
}

::deep(.card-detail-dialog .p-dialog-footer) {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1rem 2rem;
}

/* Dark mode dialog styles */
::deep(.dark .card-detail-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid #334155;
}

::deep(.dark .card-detail-dialog .p-dialog-header .p-dialog-title) {
  color: #f1f5f9;
}

::deep(.dark .card-detail-dialog .p-dialog-content) {
  background: #1e293b;
}

::deep(.dark .card-detail-dialog .p-dialog-footer) {
  background: #1e293b;
  border-top: 1px solid #334155;
}
</style>
