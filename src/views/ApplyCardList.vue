<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 overflow-y-auto md:bg-gray-50 "
    :style="{ minHeight: `calc(var(--app-vh, 1vh) * 100)` }">
    <!-- Navigation Header -->
    <AppHeader title="Apply Card" :show-title="true" />

    <!-- Main Content -->
    <div class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-7xl mx-auto py-6">
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
        <!-- Mobile: New compact panel style -->
        <div class="md:hidden">
          <div class="px-4">
            <div class="bg-white dark:bg-gray-900 p-4">
              <!-- Stats row -->
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Application fee</div>
                  <div class="text-base font-semibold text-gray-900 dark:text-white mt-1">
                    {{ formatMoney(currentCard?.applyFee) }}
                  </div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Monthly limit</div>
                  <div class="text-base font-semibold text-gray-900 dark:text-white mt-1">
                    {{ formatNumber(currentCard?.maxOnMonthly) }}
                  </div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Monthly fee</div>
                  <div class="text-base font-semibold text-gray-900 dark:text-white mt-1">
                    {{ formatMoney(currentCard?.monthlyFee) }}
                  </div>
                </div>
              </div>

              <!-- Card slider with preview effect -->
              <div class="mt-6 relative">
                <div class="overflow-visible" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
                  @touchend="handleTouchEnd">
                  <div class="relative flex items-center justify-center"
                    style="perspective: 1000px; min-height: 400px;">
                    <div v-for="(card, index) in cardConfigs" :key="index"
                      class="absolute top-0 left-1/2 transition-all duration-500 ease-out" :style="getCardStyle(index)">
                      <div class="rounded-2xl overflow-hidden bg-img" :style="{
                        aspectRatio: '9/16',
                        width: '55vw',
                        maxWidth: '220px'
                      }">
                        <img v-if="card.cardPicture" :src="card.cardPicture" alt="" class="rot-img" draggable="false" />
                        <div v-else
                          class="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                          {{ card.cardName }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Dots -->
                <div class="flex justify-center mt-6 space-x-2">
                  <button v-for="(card, index) in cardConfigs" :key="index"
                    class="w-8 h-1 rounded-full transition-colors"
                    :class="currentCardIndex === index ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
                    @click="selectCardByIndex(index)"></button>
                </div>
              </div>
            </div>
          </div>

          <!-- Title + brands -->
          <div class="text-center mt-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ currentCard?.cardPattern === 1 ? 'Virtual Card' : 'Physical Card' }}
            </h3>
          </div>

          <!-- Primary action -->
          <div class="px-4 mt-4">
            <Button :label="currentCard?.cardPattern === 1 ? 'Order a Virtual Card' : 'Order a Physical Card'"
              severity="primary" class="w-full" :disabled="currentCard?.cardPattern !== 1"
              @click="currentCard && orderCard(currentCard)" />
          </div>
        </div>

        <!-- Desktop: Grid Layout -->
        <div class="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
          <div v-for="card in cardConfigs" :key="card.cardName"
            class="card-hover-container transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg hover:-translate-y-1">
            <CardItem :card="card" :selected="selectedCard?.cardName === card.cardName" @select="selectCard"
              @order="orderCard" @activate="activateCard" />
          </div>
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
    <Dialog v-model:visible="showKycDialog" modal :closable="false"
      :style="{ width: '100vw', height: 'calc(var(--app-vh, 1vh) * 100)', maxWidth: 'none', maxHeight: 'none' }"
      class="kyc-dialog-fullscreen">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">KYC Identity Verification</h3>
          <Button icon="pi pi-times" text rounded severity="secondary" @click="closeKycDialog"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
        </div>
      </template>

      <div class="space-y-6">
        <!-- KYC SDK Container -->
        <div v-if="showKycSDK" class="relative !mb-0 h-[calc(var(--app-vh,1vh)*100-200px)] w-full overflow-auto">
          <div id="sumsub-websdk-container"
            class="h-full w-full rounded-lg border border-gray-200 dark:border-gray-700">
          </div>
        </div>


      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
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

// Card flip animation state - track rotation for each card (-180 or 0)
const cardFlipRotations = ref<Record<number, number>>({})
const isFlipping = ref(false)
const animatingRotation = ref(0) // Current animating rotation value

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
const pendingCard = ref<CardConfig | null>(null)

// Computed properties
const loading = computed(() => cardStore.loading)
const error = computed(() => cardStore.error)
const cardConfigs = computed(() => cardStore.enabledCards)

// Get card configuration
const fetchCardConfigs = async () => {
  const result = await cardStore.fetchCardConfigs()

  if (result.success) {
    // toast.add({
    //   severity: 'success',
    //   summary: 'Load Successful',
    //   detail: 'Card configurations loaded successfully',
    //   life: 2000
    // })
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

const currentCard = computed(() => cardConfigs.value[currentCardIndex.value])

const formatMoney = (val?: number) => {
  if (val === undefined || val === null) return '—'
  return `${val} USD`
}

const formatNumber = (val?: number) => {
  if (val === undefined || val === null) return '—'
  return val.toLocaleString('en-US') + ' USD'
}

// Get card style for carousel with preview effect
const getCardStyle = (index: number) => {
  const diff = index - currentCardIndex.value
  const isActive = diff === 0

  // Calculate position and scale
  let translateX = '-50%' // Start from center (because left: 50%)
  let translateZ = '0'
  let scale = 1
  let opacity = 1
  let rotateY = 0
  let zIndex = 0

  if (diff === 0) {
    // Current card - center, full scale, with flip rotation
    translateX = '-50%'
    translateZ = '0'
    scale = 1
    opacity = 1
    // Use animating rotation if flipping, otherwise use stored rotation (initialized to -180 for first flip)
    if (isFlipping.value && index === currentCardIndex.value) {
      rotateY = animatingRotation.value
    } else {
      // Default to -180 (back) for cards that haven't been flipped yet
      rotateY = cardFlipRotations.value[index] ?? -180
    }
    zIndex = 10
  } else if (diff === 1) {
    // Next card - right side, smaller, always at back (-180)
    translateX = 'calc(-50% + 85%)'
    translateZ = '-100px'
    scale = 0.8
    opacity = 0.5
    rotateY = -180
    zIndex = 5
  } else if (diff === -1) {
    // Previous card - left side, smaller, always at back (-180)
    translateX = 'calc(-50% - 85%)'
    translateZ = '-100px'
    scale = 0.8
    opacity = 0.5
    rotateY = -180
    zIndex = 5
  } else {
    // Hidden cards
    translateX = diff > 0 ? 'calc(-50% + 200%)' : 'calc(-50% - 200%)'
    translateZ = '-200px'
    scale = 0.6
    opacity = 0
    rotateY = diff > 0 ? -30 : 30
    zIndex = 0
  }

  return {
    transform: `translateX(${translateX}) translateZ(${translateZ}) scale(${scale}) rotateY(${rotateY}deg)`,
    opacity: opacity.toString(),
    zIndex: zIndex.toString(),
    pointerEvents: (isActive ? 'auto' : 'none') as 'auto' | 'none'
  }
}

// Trigger card flip animation for current card (180 degree flip from back to front)
const triggerCardFlip = () => {
  if (isFlipping.value) return

  isFlipping.value = true
  const cardIndex = currentCardIndex.value

  // Always start from back (-180) and flip to front (0)
  const startRotation = -180
  const targetRotation = 0

  // Animate flip rotation
  const duration = 600 // ms
  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    animatingRotation.value = startRotation + ((targetRotation - startRotation) * easeProgress)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // Set final rotation value to front (0)
      cardFlipRotations.value = {
        ...cardFlipRotations.value,
        [cardIndex]: targetRotation
      }
      animatingRotation.value = targetRotation
      isFlipping.value = false
    }
  }

  requestAnimationFrame(animate)
}

// Select card by index with animation
const selectCardByIndex = (index: number) => {
  if (index === currentCardIndex.value) return

  // Reset previous card back to -180 (back side) when leaving
  const prevIndex = currentCardIndex.value
  cardFlipRotations.value = {
    ...cardFlipRotations.value,
    [prevIndex]: -180
  }

  // Switch to new card
  currentCardIndex.value = index
  selectedCard.value = cardConfigs.value[index]

  // Trigger flip animation for new card
  triggerCardFlip()
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
    let shouldSwitch = false
    if (deltaX > 0) {
      // Swipe left, show next card
      if (currentCardIndex.value < cardConfigs.value.length - 1) {
        shouldSwitch = true
        currentCardIndex.value++
        selectedCard.value = cardConfigs.value[currentCardIndex.value]
      }
    } else {
      // Swipe right, show previous card
      if (currentCardIndex.value > 0) {
        shouldSwitch = true
        currentCardIndex.value--
        selectedCard.value = cardConfigs.value[currentCardIndex.value]
      }
    }

    // Trigger flip animation on successful switch
    if (shouldSwitch) {
      triggerCardFlip()
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
      case 1: // KYC approved
        console.log('KYC approved, navigating to CardBinSelection')
        navigateToCardBinSelection(card)
        break

      case 0: // KYC not done
      case 2: // KYC temporarily rejected
        console.log('KYC not completed or temporarily rejected, opening KYC dialog')
        pendingCard.value = card
        showKycDialog.value = true
        await launchKycSDK()
        break

      case 3: // KYC rejected
        console.log('KYC rejected, showing error message')
        handleError('KYC verification was rejected. Please contact support for more information.', {
          fallbackMessage: 'KYC verification was rejected. Please contact support for more information.'
        })
        break

      default:
        console.log('Unknown KYC status:', kycStatus)
        handleError('Unknown KYC status, please try again.', {
          fallbackMessage: 'Unknown KYC status, please try again.'
        })
    }
  } catch (error) {
    console.error('Error checking KYC status:', error)
    handleError(error, {
      fallbackMessage: 'Failed to check KYC status, please try again.'
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
    initializeSumsubSDK()

    // Start polling for KYC status
    startKycPolling()
  } catch (error) {
    console.error('Failed to launch KYC SDK:', error)
    handleError(error, {
      fallbackMessage: 'Failed to start KYC verification, please try again.'
    })
  }
}

// Initialize Sumsub SDK
const initializeSumsubSDK = () => {
  try {
    // Check if snsWebSdk is available
    if (typeof (window as any).snsWebSdk === 'undefined') {
      console.error('snsWebSdk is not loaded')
      handleError('KYC verification component is not loaded. Please refresh the page and try again.', {
        fallbackMessage: 'KYC verification component is not loaded. Please refresh the page and try again.'
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
        handleError('An error occurred during KYC verification', {
          fallbackMessage: 'An error occurred during KYC verification, please try again.'
        })
      })
      .build()

    snsWebSdkInstance.launch('#sumsub-websdk-container')

    handleSuccess('Please follow the instructions to complete identity verification.')
  } catch (error) {
    console.error('Failed to initialize Sumsub SDK:', error)
    handleError('Failed to initialize KYC verification', {
      fallbackMessage: 'Failed to initialize KYC verification, please try again.'
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

  const pollKycStatus = async () => {
    if (!isKycPolling.value) return

    try {
      const result = await authStore.checkKycStatus()
      console.log('KYC polling result:', result)

      if (result === 1) {
        // KYC approved
        stopKycPolling()
        showKycDialog.value = false
        handleSuccess('KYC verification approved. You can now apply for a card.')

        // Clear pending card
        pendingCard.value = null
      } else if (result === 3) {
        // KYC rejected
        stopKycPolling()
        showKycDialog.value = false
        handleError('KYC verification was rejected. Please contact support for more information.', {
          fallbackMessage: 'KYC verification was rejected. Please contact support for more information.'
        })
        pendingCard.value = null
      } else {
        // Status 0 and 2 continue polling after a delay
        setTimeout(pollKycStatus, 1000) // Wait 5 seconds before next poll
      }
    } catch (error) {
      console.error('KYC polling error:', error)
      // On error, wait before retrying
      setTimeout(pollKycStatus, 1000) // Wait 5 seconds before retry
    }
  }

  // Start the first poll immediately
  pollKycStatus()
}

// Stop KYC polling
const stopKycPolling = () => {
  isKycPolling.value = false
  console.log('KYC polling stopped')
}

// Viewport height fix for mobile browsers
const setAppViewportHeight = () => {
  const vhUnit = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--app-vh', `${vhUnit}px`)
}

const handleResize = () => setAppViewportHeight()
const handleOrientationChange = () => {
  // Delay to wait for address bar/UI to settle
  setTimeout(setAppViewportHeight, 200)
}


// Close KYC dialog
const closeKycDialog = () => {
  showKycDialog.value = false
  showKycSDK.value = false
  stopKycPolling()
  pendingCard.value = null
  kycAccessToken.value = ''
}

// Removed watch on authStore.kycStatus to avoid duplicate handling with polling


// Clean up on unmount
onUnmounted(() => {
  stopKycPolling()
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('orientationchange', handleOrientationChange)
})

// Fetch data when component mounts
onMounted(() => {
  setAppViewportHeight()
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('orientationchange', handleOrientationChange)
  fetchCardConfigs()

  // Initialize first card with flip animation after a short delay
  nextTick(() => {
    setTimeout(() => {
      triggerCardFlip()
    }, 300)
  })
})
</script>

<style scoped>
/* Mobile card container */
.bg-img {
  position: relative;
  overflow: hidden;
}

/* Center, rotate image and cover container */
.bg-img .rot-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  transform-origin: center center;
  /* 容器是 9:16，旋转后图片宽度应该填满容器高度 */
  /* 容器高度 = 宽度 * (16/9)，图片宽度要等于这个高度，即 width = 容器宽度 * 16/9 = 177.78% */
  width: 177.78%;
  height: auto;
  max-width: none;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
}

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

/* Fullscreen KYC Dialog */
.kyc-dialog-fullscreen {
  width: 100vw !important;
  height: calc(var(--app-vh, 1vh) * 100) !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

.kyc-dialog-fullscreen .p-dialog {
  width: 100vw !important;
  height: calc(var(--app-vh, 1vh) * 100) !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

.kyc-dialog-fullscreen .p-dialog-content {
  height: calc((var(--app-vh, 1vh) * 100) - 80px) !important;
  padding: 1rem !important;
  overflow-y: auto !important;
}

.kyc-dialog-fullscreen .p-dialog-header {
  padding: 1rem !important;
  border-bottom: 1px solid #e5e7eb;
}

.dark .kyc-dialog-fullscreen .p-dialog-header {
  border-bottom-color: #374151;
}

/* Remove legacy 100vh overrides to rely on --app-vh */

/* Card hover effects for desktop */
.card-hover-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.card-hover-container:hover {
  transform: scale(1.02) translateY(-4px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(59, 130, 246, 0.1);
  z-index: 10;
}

.card-hover-container:hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
  border-radius: 12px;
  z-index: -1;
}

/* Dark mode hover effects */
.dark .card-hover-container:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.3),
    0 4px 6px -2px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(59, 130, 246, 0.2);
}

.dark .card-hover-container:hover::before {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
}

/* Smooth transitions */
.card-hover-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover-container * {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
