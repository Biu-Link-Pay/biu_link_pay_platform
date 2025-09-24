<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Header -->
    <AppHeader title="Apply Card" :show-title="true" />

    <!-- Confirm Dialog -->
    <ConfirmDialog />

    <!-- Main Content -->
    <div class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="text-gray-600 dark:text-gray-400">Loading card configurations...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 w-full max-w-md mx-auto">
          <i class="pi pi-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Loading Failed</h3>
          <p class="text-red-600 dark:text-red-400 mb-6">{{ error }}</p>
          <Button label="Retry" icon="pi pi-refresh" severity="secondary" @click="fetchCardConfigs" />
        </div>
      </div>

      <!-- Card Selection -->
      <div v-else-if="cardConfigs.length > 0">
        <!-- Mobile: Card Carousel -->
        <div class="md:hidden">
          <div class="relative">
            <div class="overflow-hidden" 
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd">
              <div class="flex transition-transform duration-300 ease-in-out"
                :style="{ transform: `translateX(-${currentCardIndex * 100}%)` }">
                <div v-for="(card, index) in cardConfigs" :key="index" class="w-full flex-shrink-0 px-4">
                  <div class="relative">
                    <CardItem :card="card" :selected="currentCardIndex === index" @select="selectCard(card)"
                      @order="orderCard" @activate="activateCard" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Dots Indicator -->
          <div class="flex justify-center mt-4 space-x-2">
            <div v-for="(card, index) in cardConfigs" :key="index" class="w-2 h-2 rounded-full transition-colors"
              :class="currentCardIndex === index ? 'bg-blue-500' : 'bg-gray-300'"></div>
          </div>
        </div>

        <!-- Desktop: Grid Layout -->
        <div class="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
          <CardItem v-for="card in cardConfigs" :key="card.cardName" :card="card"
            :selected="selectedCard?.cardName === card.cardName" @select="selectCard" @order="orderCard"
            @activate="activateCard" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="bg-gray-50 rounded-lg p-12 w-full max-w-md mx-auto">
          <i class="pi pi-credit-card text-gray-400 text-5xl mb-6"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Cards Available</h3>
          <p class="text-gray-600">No card configurations found.</p>
        </div>
      </div>
    </div>

    <!-- KYC Verification Dialog -->
    <Dialog v-model:visible="showKycDialog" modal :closable="false" :style="{ width: '95vw', maxWidth: '800px' }" class="kyc-dialog">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">KYC Identity Verification</h3>
          <Button 
            icon="pi pi-times" 
            text 
            rounded 
            severity="secondary" 
            @click="closeKycDialog"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          />
        </div>
      </template>

      <div class="space-y-6">
        <!-- KYC SDK Container -->
        <div v-if="showKycSDK" class="relative !mb-0 h-108 w-full sm:h-80 md:h-96 lg:h-156 lg:w-320 overflow-auto">
          <div id="sumsub-websdk-container" class="h-full w-full rounded-lg border border-gray-200 dark:border-gray-700"></div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            label="Cancel" 
            severity="secondary" 
            @click="closeKycDialog"
            :disabled="isKycPolling"
          />
          <Button 
            v-if="!showKycSDK && !isKycPolling"
            label="Start Verification" 
            severity="primary"
            @click="launchKycSDK"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useCardStore } from '@/stores/card'
import { useAuthStore } from '@/stores/auth'
import { useErrorHandler } from '@/utils/errorHandler'
import AppHeader from '@/components/AppHeader.vue'
import CardItem from '@/components/CardItem.vue'
import Dialog from 'primevue/dialog'
import type { CardConfig } from '@/api/card'

const router = useRouter()
const toast = useToast()
const cardStore = useCardStore()
const authStore = useAuthStore()
const { handleError, handleSuccess } = useErrorHandler()

// Reactive data
const selectedCard = ref<CardConfig | null>(null)
const currentCardIndex = ref(0)

// Touch drag related state
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const dragThreshold = 50 // Drag threshold, switch card only when exceeding this distance

// KYC Dialog state
const showKycDialog = ref(false)
const kycAccessToken = ref('')
const showKycSDK = ref(false)
const isKycPolling = ref(false)
const kycPollingInterval = ref<NodeJS.Timeout | null>(null)
const pendingCard = ref<CardConfig | null>(null)

// Computed properties
const loading = computed(() => cardStore.loading)
const error = computed(() => cardStore.error)
const cardConfigs = computed(() => cardStore.enabledCards)

// Get card configuration
const fetchCardConfigs = async () => {
  const result = await cardStore.fetchCardConfigs()

  if (result.success) {
    toast.add({
      severity: 'success',
      summary: 'Load Successful',
      detail: 'Card configurations loaded successfully',
      life: 2000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Load Failed',
      detail: result.error || 'Failed to load card configurations',
      life: 3000
    })
  }
}

// Select card
const selectCard = (card: CardConfig) => {
  selectedCard.value = card
  // Find the index of the selected card in mobile carousel
  const cardIndex = cardConfigs.value.findIndex(c => c.cardName === card.cardName)
  if (cardIndex !== -1) {
    currentCardIndex.value = cardIndex
  }
  toast.add({
    severity: 'info',
    summary: 'Card Selected',
    detail: `Selected ${card.cardName}`,
    life: 2000
  })
}

// Touch event handlers for mobile
const handleTouchStart = (event: TouchEvent) => {
  // Check if touch is on a button or interactive element
  const target = event.target as HTMLElement
  if (target.closest('button') || target.closest('[role="button"]') || target.closest('a')) {
    return // Don't handle touch events on buttons
  }
  
  if (event.touches.length === 1) {
    isDragging.value = true
    startX.value = event.touches[0].clientX
    currentX.value = event.touches[0].clientX
    event.preventDefault()
  }
}

const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging.value || event.touches.length !== 1) return
  
  currentX.value = event.touches[0].clientX
  event.preventDefault()
}

const handleTouchEnd = () => {
  if (!isDragging.value) return

  const deltaX = startX.value - currentX.value

  // Switch card based on swipe distance and direction
  if (Math.abs(deltaX) > dragThreshold) {
    if (deltaX > 0) {
      // Swipe left, show next card
      if (currentCardIndex.value < cardConfigs.value.length - 1) {
        currentCardIndex.value++
        selectedCard.value = cardConfigs.value[currentCardIndex.value]
      }
    } else {
      // Swipe right, show previous card
      if (currentCardIndex.value > 0) {
        currentCardIndex.value--
        selectedCard.value = cardConfigs.value[currentCardIndex.value]
      }
    }
  }

  isDragging.value = false
  startX.value = 0
  currentX.value = 0
}


// Order card
const orderCard = async (card: CardConfig) => {
  console.log('Order card clicked:', card)

  if (card.status !== 1) {
    toast.add({
      severity: 'warn',
      summary: 'Not Available',
      detail: `${card.cardName} is currently not available`,
      life: 3000
    })
    return
  }

  // Check if user has cards
  const hasCards = cardStore.hasCards
  
  if (!hasCards) {
    // No cards, need to check KYC status first
    console.log('User has no cards, checking KYC status...')
    await checkKycAndNavigate(card)
  } else {
    // Has cards, navigate directly to BIN selection
    console.log('User has cards, navigating directly to CardBinSelection')
    navigateToCardBinSelection(card)
  }
}

// Check KYC status and navigate accordingly
const checkKycAndNavigate = async (card: CardConfig) => {
  try {
    // Check KYC status
    const kycStatus = await authStore.checkKycStatus()
    console.log('KYC status:', kycStatus)

    switch (kycStatus) {
      case 1: // KYC通过
        console.log('KYC approved, navigating to CardBinSelection')
        navigateToCardBinSelection(card)
        break
        
      case 0: // 未做KYC
      case 2: // KYC临时拒绝
        console.log('KYC not completed or temporarily rejected, opening KYC dialog')
        pendingCard.value = card
        showKycDialog.value = true
        await launchKycSDK()
        break
        
      case 3: // KYC拒绝
        console.log('KYC rejected, showing error message')
        handleError('KYC验证被拒绝，请联系客服获取更多信息', {
          fallbackMessage: 'KYC验证被拒绝，请联系客服获取更多信息'
        })
        break
        
      default:
        console.log('Unknown KYC status:', kycStatus)
        handleError('KYC状态未知，请重试', {
          fallbackMessage: 'KYC状态未知，请重试'
        })
    }
  } catch (error) {
    console.error('Error checking KYC status:', error)
    handleError(error, {
      fallbackMessage: '检查KYC状态失败，请重试'
    })
  }
}

// Navigate to card BIN selection page
const navigateToCardBinSelection = (card: CardConfig) => {
  console.log('Navigating to CardBinSelection with card:', card.cardName)
  router.push({
    name: 'CardBinSelection',
    query: {
      cardName: card.cardName
    }
  })
}

// Activate card
const activateCard = (card: CardConfig) => {
  toast.add({
    severity: 'success',
    summary: 'Card Activated',
    detail: `${card.cardName} has been successfully activated`,
    life: 3000
  })
}

// Launch KYC SDK
const launchKycSDK = async () => {
  try {
    console.log('Launching KYC SDK...')
    
    // Get KYC access token
    const token = await authStore.getKycAccessToken()
    kycAccessToken.value = token
    showKycSDK.value = true
    
    // Initialize Sumsub Web SDK with delay to ensure SDK is loaded
    await nextTick()
    setTimeout(() => {
      initializeSumsubSDK()
    }, 5000)
    
    // Start polling for KYC status
    startKycPolling()
  } catch (error) {
    console.error('Failed to launch KYC SDK:', error)
    handleError(error, {
      fallbackMessage: '启动KYC验证失败，请重试'
    })
  }
}

// Initialize Sumsub SDK
const initializeSumsubSDK = () => {
  try {
    // Check if snsWebSdk is available
    if (typeof (window as any).snsWebSdk === 'undefined') {
      console.error('snsWebSdk is not loaded')
      handleError('KYC验证组件未加载，请刷新页面重试', {
        fallbackMessage: 'KYC验证组件未加载，请刷新页面重试'
      })
      return
    }

    console.log('Initializing Sumsub SDK with token:', kycAccessToken.value)
    
    // Use the same initialization method as KycVerification.vue
    const snsWebSdkInstance = (window as any).snsWebSdk
      .init(kycAccessToken.value, () => getNewAccessToken())
      .withConf({ lang: 'en' })
      .withOptions({ 
        adaptIframeHeight: true,
        scrollIntoView: true,
      })
      .on('idCheck.onStepCompleted', (payload: any) => {
        console.log('onStepCompleted', payload)
      })
      .on('idCheck.onError', (error: any) => {
        console.error('Sumsub SDK error:', error)
        handleError('KYC验证过程中出现错误', {
          fallbackMessage: 'KYC验证过程中出现错误，请重试'
        })
      })
      .on('idCheck.onFinished', (payload: any) => {
        console.log('KYC verification finished:', payload)
        showKycSDK.value = false
        // Check KYC status after completion
        checkKycStatusAfterCompletion()
      })
      .build()

    snsWebSdkInstance.launch('#sumsub-websdk-container')
    
    handleSuccess('请按照提示完成身份验证流程')
  } catch (error) {
    console.error('Failed to initialize Sumsub SDK:', error)
    handleError('初始化KYC验证失败', {
      fallbackMessage: '初始化KYC验证失败，请重试'
    })
  }
}

// Get new access token (for token refresh)
const getNewAccessToken = async (): Promise<string> => {
  try {
    const newToken = await authStore.getKycAccessToken()
    kycAccessToken.value = newToken
    return newToken
  } catch (error) {
    console.error('Token refresh failed:', error)
    throw error
  }
}

// Start KYC polling
const startKycPolling = () => {
  if (isKycPolling.value) return
  
  isKycPolling.value = true
  console.log('Starting KYC status polling')
  
  kycPollingInterval.value = setInterval(async () => {
    try {
      const result = await authStore.checkKycStatus()
      console.log('KYC polling result:', result)
      
      if (result === 1) {
        // KYC approved
        stopKycPolling()
        showKycDialog.value = false
        handleSuccess('KYC验证通过，您现在可以申请卡片了')
        
        // Clear pending card
        pendingCard.value = null
      } else if (result === 3) {
        // KYC rejected
        stopKycPolling()
        showKycDialog.value = false
        handleError('KYC验证被拒绝，请联系客服获取更多信息', {
          fallbackMessage: 'KYC验证被拒绝，请联系客服获取更多信息'
        })
        pendingCard.value = null
      }
      // Status 0 and 2 continue polling
    } catch (error) {
      console.error('KYC polling error:', error)
    }
  }, 100) // Poll every 5 seconds
}

// Stop KYC polling
const stopKycPolling = () => {
  if (kycPollingInterval.value) {
    clearInterval(kycPollingInterval.value)
    kycPollingInterval.value = null
  }
  isKycPolling.value = false
  console.log('KYC polling stopped')
}

// Check KYC status after completion
const checkKycStatusAfterCompletion = async () => {
  try {
    const result = await authStore.checkKycStatus()
    if (result === 1) {
      showKycDialog.value = false
      handleSuccess('KYC验证通过，您现在可以申请卡片了')
      
      // Clear pending card
      pendingCard.value = null
    }
  } catch (error) {
    console.error('Error checking KYC status after completion:', error)
  }
}

// Close KYC dialog
const closeKycDialog = () => {
  showKycDialog.value = false
  showKycSDK.value = false
  stopKycPolling()
  pendingCard.value = null
  kycAccessToken.value = ''
}

// Watch KYC status changes
watch(() => authStore.kycStatus, (newStatus) => {
  if (newStatus === 1 && showKycDialog.value) {
    // KYC approved while dialog is open
    stopKycPolling()
    showKycDialog.value = false
    handleSuccess('KYC验证通过，您现在可以申请卡片了')
    
    // Clear pending card
    pendingCard.value = null
  } else if (newStatus === 3 && showKycDialog.value) {
    // KYC rejected while dialog is open
    stopKycPolling()
    showKycDialog.value = false
    handleError('KYC验证被拒绝，请联系客服获取更多信息', {
      fallbackMessage: 'KYC验证被拒绝，请联系客服获取更多信息'
    })
    pendingCard.value = null
  }
})


// Clean up on unmount
onUnmounted(() => {
  stopKycPolling()
})

// Fetch data when component mounts
onMounted(() => {
  fetchCardConfigs()
})
</script>

<style scoped>
/* Carousel container styles */
.overflow-hidden {
  border-radius: 12px;
}

/* Carousel item styles */
.flex-shrink-0 {
  min-width: 100%;
}

/* Navigation button styles */
.absolute button {
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.absolute button:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Indicator styles */
.space-x-2>div {
  transition: all 0.3s ease;
}

.space-x-2>div:hover {
  transform: scale(1.2);
}

/* Mobile optimization */
@media (max-width: 768px) {
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .mt-4 {
    margin-top: 1rem;
  }
}

/* Dark mode support */
.dark .bg-white\/80 {
  background-color: rgba(31, 41, 55, 0.8);
}

.dark .text-gray-600 {
  color: #d1d5db;
}

.dark .bg-gray-300 {
  background-color: #4b5563;
}

.dark .bg-blue-500 {
  background-color: #3b82f6;
}

/* KYC SDK Container scrollbar styles */
#sumsub-websdk-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
  position: relative;
}

#sumsub-websdk-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

#sumsub-websdk-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

#sumsub-websdk-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

#sumsub-websdk-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Force iframe scrolling */
#sumsub-websdk-container iframe {
  width: 100% !important;
}

#sumsub-websdk-container iframe::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}

#sumsub-websdk-container iframe::-webkit-scrollbar-track {
  background: #f1f5f9 !important;
  border-radius: 4px !important;
}

#sumsub-websdk-container iframe::-webkit-scrollbar-thumb {
  background: #cbd5e1 !important;
  border-radius: 4px !important;
}

#sumsub-websdk-container iframe::-webkit-scrollbar-thumb:hover {
  background: #94a3b8 !important;
}

/* Dark mode scrollbar */
.dark #sumsub-websdk-container {
  scrollbar-color: #4b5563 #1f2937;
}

.dark #sumsub-websdk-container::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark #sumsub-websdk-container::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark #sumsub-websdk-container::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Dark mode iframe scrollbar */
.dark #sumsub-websdk-container iframe {
  scrollbar-color: #4b5563 #1f2937 !important;
}

.dark #sumsub-websdk-container iframe::-webkit-scrollbar-track {
  background: #1f2937 !important;
}

.dark #sumsub-websdk-container iframe::-webkit-scrollbar-thumb {
  background: #4b5563 !important;
}

.dark #sumsub-websdk-container iframe::-webkit-scrollbar-thumb:hover {
  background: #6b7280 !important;
}

/* Responsive KYC Dialog */
.kyc-dialog {
  max-height: 90vh;
  overflow-y: auto;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .kyc-dialog {
    width: 95vw !important;
    max-width: 95vw !important;
    margin: 0.5rem !important;
  }
  
  .kyc-dialog .p-dialog-content {
    padding: 1rem !important;
  }
  
  .kyc-dialog .p-dialog-header {
    padding: 1rem !important;
  }
}

/* Tablet optimizations */
@media (min-width: 641px) and (max-width: 1024px) {
  .kyc-dialog {
    width: 90vw !important;
    max-width: 90vw !important;
  }
}

/* Desktop optimizations */
@media (min-width: 1025px) {
  .kyc-dialog {
    width: 800px !important;
    max-width: 800px !important;
  }
}
</style>
