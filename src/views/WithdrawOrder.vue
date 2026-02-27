<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Unified Header -->
    <AppHeader title="Withdraw" :show-title="true" />

    <!-- Main Content -->
    <div
      class="w-full max-w-2xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <!-- Desktop Layout -->
      <div v-if="isDesktopView">
        <div class="max-w-4xl xl:max-w-5xl mx-auto space-y-8">
          <CardInfoHeader :card-no="cardInfo.cardNo" :balance="balance" :loading="!cardDetail" />

          <!-- Tab Buttons -->
          <div
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden">
            <div class="flex">
              <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                class="flex-1 px-6 py-4 text-center text-base font-semibold transition-all duration-200 relative"
                :class="activeTab === tab.key
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'">
                <span class="relative z-10">{{ tab.label }}</span>
                <span v-if="activeTab === tab.key"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></span>
              </button>
            </div>
          </div>

          <!-- Crypto Withdrawal Tab Content -->
          <CryptoWithdrawal v-if="activeTab === 'crypto'" :card-info="cardInfo" :card-detail="cardDetail"
            :balance="balance" :withdraw-amount="withdrawAmount" :applied-reward-points="appliedRewardPoints"
            :is-delete-action="isDeleteAction" />

          <!-- Fiat Withdrawal Tab Content -->
          <FiatWithdrawal v-if="activeTab === 'fiat'" :card-info="cardInfo" :card-detail="cardDetail" :balance="balance"
            :withdraw-amount="withdrawAmount" :applied-reward-points="appliedRewardPoints"
            :is-delete-action="isDeleteAction" />
        </div>
      </div>

      <!-- Mobile Layout -->
      <div v-else class="space-y-4 pb-32">
        <CardInfoHeader :card-no="cardInfo.cardNo" :balance="balance" :loading="!cardDetail" />

        <!-- Tab Buttons -->
        <div
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div class="flex">
            <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
              class="flex-1 px-4 py-3 text-center text-sm font-semibold transition-all duration-200 relative" :class="activeTab === tab.key
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
              <span class="relative z-10">{{ tab.label }}</span>
              <span v-if="activeTab === tab.key"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></span>
            </button>
          </div>
        </div>

        <!-- Crypto Withdrawal Tab Content -->
        <CryptoWithdrawal v-if="activeTab === 'crypto'" :card-info="cardInfo" :card-detail="cardDetail"
          :balance="balance" :withdraw-amount="withdrawAmount" :applied-reward-points="appliedRewardPoints"
          :is-delete-action="isDeleteAction" />

        <!-- Fiat Withdrawal Tab Content -->
        <FiatWithdrawal v-if="activeTab === 'fiat'" :card-info="cardInfo" :card-detail="cardDetail" :balance="balance"
          :withdraw-amount="withdrawAmount" :applied-reward-points="appliedRewardPoints"
          :is-delete-action="isDeleteAction" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useMediaQuery } from '@vueuse/core'
import AppHeader from '@/components/AppHeader.vue'
import CardInfoHeader from '@/components/CardInfoHeader.vue'
import CryptoWithdrawal from '@/components/CryptoWithdrawal.vue'
import FiatWithdrawal from '@/components/FiatWithdrawal.vue'
import { useCardStore } from '@/stores/card'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()

// Tab state
const activeTab = ref<'crypto' | 'fiat'>('crypto')

// Render exactly one layout to avoid double-mounting child components
const isDesktopView = useMediaQuery('(min-width: 768px)')

// Tab definitions
const tabs = [
  { key: 'crypto' as const, label: 'Crypto Withdrawal' },
  { key: 'fiat' as const, label: 'Fiat Withdrawal' }
]

// Card information from route query
const cardInfo = ref({
  cardId: '',
  cardNo: '',
  cardCurrency: 'USD',
  maxOnDaily: 0,
  maxOnMonthly: 0,
  maxOnPercent: 0
})

// Form data
const balance = ref(0.00)
const withdrawAmount = ref(0)
const isDeleteAction = computed(() => (route.query.action as string) === 'delete')

// Reward points: read-only, configured on WithdrawSettings page
const appliedRewardPoints = ref(0)

// Initialize withdraw amount & reward points from previous settings page
const initializeFromRoute = () => {
  const amountStr = route.query.amount as string
  if (amountStr) {
    const parsed = parseFloat(amountStr)
    if (!Number.isNaN(parsed) && parsed >= 0) {
      withdrawAmount.value = parsed
    }
  }

  const pointsParam = route.query.cardRewardPoints
  if (pointsParam != null) {
    const parsedPoints = Number(pointsParam)
    if (Number.isFinite(parsedPoints) && parsedPoints > 0) {
      appliedRewardPoints.value = parsedPoints
    }
  }
}

// Card detail from cache
const cardDetail = ref<any>(null)

// Calculate maximum withdraw amount based on card balance
const getMaxWithdrawAmount = () => {
  if (!cardDetail.value) return balance.value

  const cardBalance = (cardDetail.value as any).cardBalance || 0
  const availableBalance = parseFloat(cardBalance.toString()) || 0

  const maxDaily = cardInfo.value.maxOnDaily || availableBalance
  const maxPercent = cardInfo.value.maxOnPercent || availableBalance

  return Math.min(availableBalance, maxDaily, maxPercent)
}

// Initialize card information from route query
const initializeCardInfo = () => {
  if (route.query.cardId) {
    cardInfo.value = {
      cardId: route.query.cardId as string,
      cardNo: route.query.cardNo as string || '',
      cardCurrency: route.query.cardCurrency as string || 'USD',
      maxOnDaily: parseFloat(route.query.maxOnDaily as string) || 0,
      maxOnMonthly: parseFloat(route.query.maxOnMonthly as string) || 0,
      maxOnPercent: parseFloat(route.query.maxOnPercent as string) || 0
    }
  }
}

// Validate and load card details: both withdraw and delete get data from route or cardList (no cache)
const validateAndLoadCardDetails = () => {
  const routeCardId = route.query.cardId as string
  const routeCardNo = route.query.cardNo as string
  const routeCardBalance = route.query.cardBalance as string

  if (!routeCardId || !routeCardNo) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Parameters',
      detail: 'Missing card information. Please go back and try again.',
      life: 3000
    })
    router.push('/my-cards')
    return false
  }

  // Both withdraw and delete get data from route or cardList
  const balanceFromRoute = parseFloat(routeCardBalance)
  if (Number.isFinite(balanceFromRoute)) {
    balance.value = balanceFromRoute
    cardDetail.value = {
      cardId: routeCardId,
      cardNo: routeCardNo,
      cardCurrency: (route.query.cardCurrency as string) || 'USD',
      cardBalance: balance.value
    }
    return true
  }

  const cardFromList = cardStore.cardList.find(c => c.cardId === routeCardId)
  if (cardFromList && cardFromList.cardNo === routeCardNo) {
    balance.value = parseFloat(String(cardFromList.cardBalance ?? 0)) || 0
    cardDetail.value = {
      cardId: cardFromList.cardId,
      cardNo: cardFromList.cardNo,
      cardCurrency: cardFromList.cardCurrency,
      cardBalance: balance.value
    }
    cardInfo.value = {
      ...cardInfo.value,
      cardId: cardFromList.cardId,
      cardNo: cardFromList.cardNo,
      cardCurrency: cardFromList.cardCurrency,
      maxOnDaily: parseFloat(String(cardFromList.maxOnDaily ?? 0)) || 0,
      maxOnMonthly: parseFloat(String(cardFromList.maxOnMonthly ?? 0)) || 0,
      maxOnPercent: parseFloat(String(cardFromList.maxOnPercent ?? 0)) || 0
    }
    return true
  }

  toast.add({
    severity: 'error',
    summary: 'Invalid Parameters',
    detail: 'Unable to get card information. Please go back and try again.',
    life: 3000
  })
  router.push('/my-cards')
  return false
}

// Initialize on mount
onMounted(async () => {
  console.log('WithdrawOrder mounted, starting initialization...')

  initializeCardInfo()
  initializeFromRoute()

  // Ensure card list is loaded (for masked card number)
  if (cardStore.cardList.length === 0) {
    await cardStore.fetchCardList({ silent: true })
  }

  // Validate and load card details from route or cardList
  const isValid = validateAndLoadCardDetails()
  console.log('Card validation result:', isValid)

  // Continue only if validation passes
  if (isValid) {
    // If delete action, set amount to maximum upfront
    if (isDeleteAction.value) {
      withdrawAmount.value = getMaxWithdrawAmount()
    }
  }
})
</script>
