<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Header -->
    <AppHeader :title="$t('Delete Card')" :show-title="true" />

    <!-- Main Content -->
    <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <!-- Card Information Display -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <i class="pi pi-trash text-red-600 dark:text-red-400 text-lg"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('Delete Virtual Card') }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('This action cannot be undone') }}</p>
          </div>
        </div>

        <!-- Card Details -->
        <div v-if="cardInfo" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wide">
                {{ $t('Card Number') }}
              </div>
              <div class="text-base font-mono text-gray-900 dark:text-white">
                {{ formatCardNumber(cardInfo.cardNo) }}
              </div>
            </div>
            <div>
              <div class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wide">
                {{ $t('Currency') }}
              </div>
              <div class="text-base font-semibold text-gray-900 dark:text-white">
                {{ cardInfo.cardCurrency }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Warning Section -->
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
        <div class="flex items-start space-x-3">
          <div
            class="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400 text-sm"></i>
          </div>
          <div class="flex-1">
            <h4 class="text-base font-semibold text-red-800 dark:text-red-300 mb-2">{{ $t('Warning') }}</h4>
            <div class="text-sm text-red-700 dark:text-red-400 space-y-2">
              <p>{{ $t('Deleting this virtual card will:') }}</p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>{{ $t('Permanently remove the card from your account') }}</li>
                <li>{{ $t('Cancel any pending transactions') }}</li>
                <li>{{ $t('Make the card number unusable for future transactions') }}</li>
                <li>{{ $t('Not affect your remaining balance (if any)') }}</li>
              </ul>
              <p class="font-medium mt-3">{{ $t('This action cannot be undone.') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <!-- Cancel Button -->
        <button @click="goBack"
          class="flex-1 sm:flex-none px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <i class="pi pi-arrow-left mr-2"></i>
          {{ $t('Cancel') }}
        </button>

        <!-- Delete Button -->
        <button @click="confirmDelete" :disabled="loading"
          class="flex-1 sm:flex-none px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center">
          <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
          <i v-else class="pi pi-trash mr-2"></i>
          {{ loading ? $t('Deleting...') : $t('Delete Card') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { t } = useI18n({ useScope: 'global' })

// Component state
const loading = ref(false)
const cardInfo = ref<{
  cardId: string
  cardNo: string
  cardCurrency: string
} | null>(null)

// Utility functions
const formatCardNumber = (cardNo?: string) => {
  if (!cardNo) return t('N/A')
  const digits = cardNo.replace(/\D/g, '')
  if (!digits) return t('N/A')
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

// Navigation functions
const goBack = () => {
  router.back()
}

// Delete confirmation
const confirmDelete = async () => {
  if (!cardInfo.value) {
    toast.add({
      severity: 'error',
      summary: t('Error'),
      detail: t('No card information available'),
      life: 3000
    })
    return
  }

  try {
    loading.value = true

    // TODO: Implement actual delete API call
    console.log('Deleting card:', cardInfo.value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Show success message
    toast.add({
      severity: 'success',
      summary: t('Success'),
      detail: t('Card deleted successfully'),
      life: 3000
    })

    // Navigate back to cards list
    router.push({ name: 'MyCards' })

  } catch (error) {
    console.error('Error deleting card:', error)
    toast.add({
      severity: 'error',
      summary: t('Error'),
      detail: (error as any)?.message || t('Failed to delete card. Please try again.'),
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Initialize component
onMounted(() => {
  // Get card information from route query parameters
  const cardId = route.query.cardId as string
  const cardNo = route.query.cardNo as string
  const cardCurrency = route.query.cardCurrency as string

  if (cardId && cardNo && cardCurrency) {
    cardInfo.value = {
      cardId,
      cardNo,
      cardCurrency
    }
  } else {
    toast.add({
      severity: 'error',
      summary: t('Error'),
      detail: t('Invalid card information'),
      life: 3000
    })
    router.push({ name: 'MyCards' })
  }
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
