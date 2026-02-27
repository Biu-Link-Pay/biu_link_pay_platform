<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Unified Header -->
    <AppHeader title="Withdraw" :show-title="true" />

    <!-- Main Content -->
    <div
      class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 md:pb-6 lg:pb-8">
      <!-- Card Information -->
      <CardInfoHeader :card-no="cardInfo.cardNo" :balance="balance" :loading="!cardDetail" />

      <!-- Content -->
      <div class="mt-6 space-y-8">
        <!-- Withdraw Amount Section -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Withdraw amount
          </h2>
          <div class="mb-3 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
            Available {{ formatCurrency(balance) }} · Limit {{ formatCurrency(minimumBalance) }} -
            {{ formatCurrency(getMaxWithdrawAmount()) }} {{ cardInfo.cardCurrency }}
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Withdraw amount
            </label>
            <div class="flex items-center gap-2">
              <InputText v-model="withdrawAmountInput" type="text" :placeholder="minimumBalance.toString()" class="w-32"
                :class="{ 'p-invalid': errors.withdrawAmount }" @blur="handleAmountBlur" />
              <span class="text-gray-600 dark:text-gray-400">
                {{ cardInfo.cardCurrency }}
              </span>
              <Button label="Max" size="small" severity="secondary" @click="setMaxAmount" />
            </div>
            <small v-if="errors.withdrawAmount" class="text-red-500 text-xs mt-1">
              {{ errors.withdrawAmount }}
            </small>
          </div>

          <!-- Quick Amount Buttons (removed as per latest requirement) -->
        </div>

        <!-- Reward Points -->
        <div v-if="availableRewardPoints > 0"
          class="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-sm space-y-2">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-orange-500 dark:text-orange-300">
                Card Reward Points
              </p>
              <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {{ availableRewardPoints.toLocaleString() }} pts
              </p>
              <p class="text-[11px] text-gray-500 dark:text-gray-400">
                100 pts = 1 {{ cardInfo.cardCurrency || 'USD' }}
              </p>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only" v-model="applyRewardPoints" :disabled="!canUseRewardPoints" />
              <span class="relative w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-200"
                :class="applyRewardPoints && canUseRewardPoints ? 'bg-orange-500 dark:bg-orange-400' : ''">
                <span
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200"
                  :class="applyRewardPoints && canUseRewardPoints ? 'translate-x-6' : ''"></span>
              </span>
            </label>
          </div>
          <div class="mt-2 flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-200">
            <div class="flex items-center gap-1.5">
              <span>Use</span>
              <input type="number" min="0" :max="maxUsablePoints" step="1" v-model.number="pointsToUse"
                :disabled="!applyRewardPoints || !canUseRewardPoints"
                class="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-transparent disabled:opacity-50" />
              <span class="text-[10px] text-gray-500 dark:text-gray-400">pts</span>
            </div>
            <span class="text-[10px] text-gray-400 dark:text-gray-500">
              Max {{ maxUsablePoints.toLocaleString() }} pts
            </span>
          </div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            <span v-if="applyRewardPoints && canUseRewardPoints && appliedRewardPoints > 0">
              Using {{ appliedRewardPoints.toLocaleString() }} pts (≈
              {{ formatCurrency(discountAmount) }} value)
            </span>
            <span v-else>
              You can use up to {{ maxUsablePoints.toLocaleString() }} pts
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bottom-buttons-container relative md:static mt-10">
        <Button label="Back" icon="pi pi-arrow-left" severity="secondary"
          class="bottom-button-dual bottom-button-dual-secondary" @click="goBack" />
        <Button :disabled="!canContinue" icon="pi pi-arrow-right" :loading="loading"
          class="bottom-button-dual bottom-button-dual-primary" @click="handleContinue">
          <span class="text-sm md:text-base">
            {{ buttonLabel }}
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { ComponentPublicInstance } from 'vue'

export default {
  name: 'WithdrawSettings',
  beforeRouteEnter(to, from, next) {
    next((vm: ComponentPublicInstance) => {
      // 如果不是从 WithdrawOrder 返回的，则重置页面
      if (from.name !== 'WithdrawOrder' && (vm as any).initPage) {
        ;(vm as any).initPage()
      }
    })
  }
}
</script>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import AppHeader from '@/components/AppHeader.vue'
import CardInfoHeader from '@/components/CardInfoHeader.vue'
import { useCardStore } from '@/stores/card'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()
const userStore = useUserStore()

// Card information from route query
const cardInfo = ref({
  cardId: '',
  cardNo: '',
  cardCurrency: 'USD',
  maxOnDaily: 0,
  maxOnMonthly: 0,
  maxOnPercent: 0
})

// Card detail & balance from cache
const cardDetail = ref<any>(null)
const balance = ref(0)
const minimumBalance = ref(1.0)

// Amount input (string) and parsed number
const withdrawAmountInput = ref('')
const withdrawAmountNumber = computed(() => {
  const v = parseFloat(withdrawAmountInput.value)
  return Number.isFinite(v) && v > 0 ? v : 0
})

// Errors
const errors = ref({
  withdrawAmount: ''
})

// Currency symbol mapping (reuse with other pages)
const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  CNH: '¥',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  SGD: 'S$',
  HKD: 'HK$'
}

const currentCurrencySymbol = computed(() => {
  const currency = cardInfo.value.cardCurrency || 'USD'
  return currencySymbols[currency] || '$'
})

// Decimal precision per currency (default 2, JPY 0)
const currencyDecimals: Record<string, number> = {
  JPY: 0
}
const currentDecimals = computed(() => {
  const currency = cardInfo.value.cardCurrency || 'USD'
  return currencyDecimals[currency] ?? 2
})

const formatCurrency = (amount: number) => {
  const decimals = currentDecimals.value
  return `${currentCurrencySymbol.value}${amount.toFixed(decimals)}`
}

// Reward points usage (100 pts = 1 fiat)
const availableRewardPoints = computed(() => userStore.cardRewardPoints || 0)
const applyRewardPoints = ref(false)
const pointsToUse = ref(0)
const canUseRewardPoints = computed(() => availableRewardPoints.value > 0)
const maxUsablePoints = computed(() => availableRewardPoints.value)

const appliedRewardPoints = ref(0)
const discountAmount = ref(0)

const recalculateRewardPoints = () => {
  const points = applyRewardPoints.value ? Math.min(pointsToUse.value, maxUsablePoints.value) : 0
  appliedRewardPoints.value = points
  const discount = points / 100
  discountAmount.value = parseFloat(discount.toFixed(currentDecimals.value))
}

watch(applyRewardPoints, (value) => {
  if (!value) {
    pointsToUse.value = 0
    appliedRewardPoints.value = 0
    discountAmount.value = 0
  } else {
    pointsToUse.value = maxUsablePoints.value
    recalculateRewardPoints()
  }
})

watch(pointsToUse, (value) => {
  if (!applyRewardPoints.value) return
  if (value < 0) {
    pointsToUse.value = 0
  } else if (value > maxUsablePoints.value) {
    pointsToUse.value = maxUsablePoints.value
  }
  recalculateRewardPoints()
})

watch(availableRewardPoints, () => {
  recalculateRewardPoints()
})

// Whether we can continue to next step
const canContinue = computed(() => {
  const hasFiatAmount = withdrawAmountNumber.value > 0
  const hasPoints = appliedRewardPoints.value > 0
  return hasFiatAmount || hasPoints
})

// Button label: show fiat amount + points value (if any)
const buttonLabel = computed(() => {
  const fiat = withdrawAmountNumber.value
  const pointsValue = discountAmount.value

  const hasFiat = fiat > 0
  const hasPoints = pointsValue > 0

  if (!hasFiat && !hasPoints)
    return 'Continue'

  if (hasFiat && hasPoints)
    return `${formatCurrency(fiat)} + ${formatCurrency(pointsValue)} in points`

  if (hasFiat)
    return formatCurrency(fiat)

  return `${formatCurrency(pointsValue)} in points`
})

// Get maximum withdraw amount (reuse logic from WithdrawOrder.vue)
const getMaxWithdrawAmount = () => {
  if (!cardDetail.value) return balance.value

  const cardBalance = (cardDetail.value as any).cardBalance || 0
  const availableBalance = parseFloat(cardBalance.toString()) || 0

  const maxDaily = cardInfo.value.maxOnDaily || availableBalance
  const maxPercent = cardInfo.value.maxOnPercent || availableBalance

  return Math.min(availableBalance, maxDaily, maxPercent)
}

// Initialize card info from route
const initializeCardInfo = () => {
  if (route.query.cardId) {
    cardInfo.value = {
      cardId: route.query.cardId as string,
      cardNo: (route.query.cardNo as string) || '',
      cardCurrency: (route.query.cardCurrency as string) || 'USD',
      maxOnDaily: parseFloat(route.query.maxOnDaily as string) || 0,
      maxOnMonthly: parseFloat(route.query.maxOnMonthly as string) || 0,
      maxOnPercent: parseFloat(route.query.maxOnPercent as string) || 0
    }
    minimumBalance.value = 1.0
  }
}

// 提现：从 route 加载卡信息（不再依赖 cache，卡列表数据由 MyCards 通过 route 传递）
const validateAndLoadCardDetails = () => {
  const routeCardId = route.query.cardId as string
  const routeCardNo = route.query.cardNo as string
  const routeCardBalance = route.query.cardBalance as string

  if (!routeCardId || !routeCardNo) {
    toast.add({
      severity: 'error',
      summary: '参数错误',
      detail: '缺少卡片信息，请返回重新操作',
      life: 3000
    })
    router.push('/my-cards')
    return false
  }

  // 优先使用 route 中的 cardBalance（来自 MyCards 卡列表）
  const balanceFromRoute = parseFloat(routeCardBalance)
  if (Number.isFinite(balanceFromRoute)) {
    balance.value = balanceFromRoute
    cardDetail.value = {
      cardId: routeCardId,
      cardNo: routeCardNo,
      cardCurrency: (route.query.cardCurrency as string) || 'USD',
      cardBalance: balance.value
    }
    initializeCardInfo()
    return true
  }

  // 兼容：若 route 无 cardBalance，尝试从 cardStore.cardList 获取
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
    summary: '参数错误',
    detail: '无法获取卡片信息，请返回重新操作',
    life: 3000
  })
  router.push('/my-cards')
  return false
}

// Amount helpers
const sanitizeAmountString = (value: string): string => {
  const decimals = currentDecimals.value
  const raw = (value || '').toString().trim().replace(/[^\d.]/g, '')
  if (!raw) return ''
  const firstDot = raw.indexOf('.')
  let normalized = firstDot >= 0
    ? raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, '')
    : raw
  let [intPart, fracPart = ''] = normalized.split('.')
  intPart = intPart.replace(/^0+(?=\d)/, '') || '0'
  if (decimals <= 0) return intPart
  if (fracPart) fracPart = fracPart.slice(0, decimals)
  return fracPart ? `${intPart}.${fracPart}` : intPart
}

const handleAmountBlur = () => {
  withdrawAmountInput.value = sanitizeAmountString(withdrawAmountInput.value)
}

const setMaxAmount = () => {
  const decimals = currentDecimals.value
  const max = getMaxWithdrawAmount()
  withdrawAmountInput.value = max.toFixed(decimals)
}

// Validate before continue
const validateAmountAndPoints = () => {
  errors.value.withdrawAmount = ''

  const amount = withdrawAmountNumber.value
  const hasFiatAmount = amount > 0
  const hasPoints = appliedRewardPoints.value > 0

  if (!hasFiatAmount && !hasPoints) {
    errors.value.withdrawAmount = 'Amount or points must be greater than 0'
    return false
  }

  if (hasFiatAmount) {
    if (amount < minimumBalance.value) {
      errors.value.withdrawAmount = `Amount must be at least ${formatCurrency(minimumBalance.value)}`
      return false
    }
    if (amount > balance.value) {
      errors.value.withdrawAmount = 'Amount exceeds available balance'
      return false
    }
    if (amount > getMaxWithdrawAmount()) {
      errors.value.withdrawAmount = `Amount exceeds maximum withdraw limit of ${formatCurrency(getMaxWithdrawAmount())}`
      return false
    }
  }

  return true
}

const loading = ref(false)

const handleContinue = async () => {
  handleAmountBlur()
  recalculateRewardPoints()

  if (!validateAmountAndPoints()) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: errors.value.withdrawAmount || 'Please check your withdraw amount and points',
      life: 3000
    })
    return
  }

  loading.value = true
  try {
    toast.add({
      severity: 'success',
      summary: 'Confirmed',
      detail: `Withdraw amount ${formatCurrency(withdrawAmountNumber.value)} confirmed`,
      life: 2000
    })

    router.push({
      name: 'WithdrawOrder',
      query: {
        cardId: cardInfo.value.cardId,
        cardNo: cardInfo.value.cardNo,
        cardCurrency: cardInfo.value.cardCurrency,
        cardBalance: balance.value.toString(),
        maxOnDaily: cardInfo.value.maxOnDaily.toString(),
        maxOnMonthly: cardInfo.value.maxOnMonthly.toString(),
        maxOnPercent: cardInfo.value.maxOnPercent.toString(),
        action: route.query.action || 'withdraw',
        amount: withdrawAmountNumber.value.toString(),
        cardRewardPoints: appliedRewardPoints.value || 0
      }
    })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'MyCards' })
}

// Initialize page
const initPage = () => {
  // Reset state
  applyRewardPoints.value = false
  pointsToUse.value = 0
  withdrawAmountInput.value = ''
  errors.value.withdrawAmount = ''
  
  initializeCardInfo()
  const ok = validateAndLoadCardDetails()
  if (!ok) return

  // Initialize default amount as minimum
  const decimals = currentDecimals.value
  withdrawAmountInput.value = minimumBalance.value.toFixed(decimals)
}

// Expose initPage
defineExpose({
  initPage
})

onMounted(() => {
  initPage()
})
</script>
