<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Header -->
    <AppHeader title="Apply for a Card" :show-title="true" />

    <!-- Main Content -->
    <div
      class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 md:pb-6 lg:pb-8">
      <!-- Alert Banner -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="pi pi-credit-card text-white text-sm"></i>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300">New Virtual Cards Added to Your List</p>
        </div>
      </div>

      <!-- Fee Information -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(selectedCard?.applyFee || 0)
          }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Apply fee</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatRechargeFee(selectedCard?.rechargeFee
            ||
            0) }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Recharge fee</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(selectedCard?.monthlyFee || 0)
          }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Consumption fee</div>
        </div>
      </div>

      <!-- Card Selection -->
      <div class="mb-8">
        <!-- Loading State -->
        <div v-if="binLoading" class="flex justify-center py-12">
          <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span class="text-gray-600 dark:text-gray-400">Loading card BINs...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="binError" class="text-center py-8">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <i class="pi pi-exclamation-triangle text-red-500 text-2xl mb-3"></i>
            <p class="text-red-600 dark:text-red-400 text-sm">{{ binError }}</p>
            <button
              class="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
              @click="loadCardBins">
              Try Again
            </button>
          </div>
        </div>

        <!-- Card BIN Selection -->
        <div v-else-if="cardBins.length > 0" class="space-y-4">
          <!-- Mobile: Card Carousel -->
          <div class="md:hidden">
            <div class="relative">
              <div class="overflow-hidden" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
                @touchend="handleTouchEnd">
                <div class="flex transition-transform duration-300 ease-in-out"
                  :style="{ transform: `translateX(-${currentBinIndex * 100}%)` }">
                  <div v-for="(binInfo, index) in cardBins" :key="index" class="w-full flex-shrink-0 px-2">
                    <div class="rounded-xl p-6 text-white shadow-lg relative overflow-hidden" :style="{
                      backgroundImage: `url(${getCardBackgroundImage(binInfo.cardScheme)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      aspectRatio: '1035/582',
                      maxWidth: '100%',
                      width: '100%'
                    }">
                      <!-- Semi-transparent overlay for better text readability -->
                      <div class="absolute inset-0 bg-black/20 rounded-xl"></div>

                      <!-- Card content -->
                      <div class="relative z-10">
                        <!-- Card Header -->
                        <div class="flex items-center justify-between mb-2 mt-12">
                        </div>

                        <!-- Card Details -->
                        <div class="space-y-1 mb-2 text-sm">
                          <!-- Card Type and Currency -->
                          <div class="mt-4 text-right">
                            {{ binInfo.cardCurrency || 'USD' }}
                          </div>
                          <!-- Card BIN -->
                          <div class="text-base font-mono tracking-wider">
                            {{ formatCardNumber(binInfo.cardBin) }}
                          </div>
                          <!-- Available Cards -->
                        </div>
                        <!-- Card Footer -->
                        <div class="flex items-center justify-between">
                          <div>
                            <div class="text-xs opacity-60 mb-1">Available Cards</div>
                            <div class="text-sm md:text-base font-semibold">
                              {{ binInfo.remainingAvailableCard || 'Unlimited' }}
                            </div>
                          </div>
                          <div class="text-right">
                            <div class="text-xs opacity-60 mb-1">Address Update</div>
                            <div class="text-xs md:text-sm font-medium"
                              :class="binInfo.billingAddressUpdatable === 'true' ? 'text-green-300' : 'text-gray-300'">
                              {{ binInfo.billingAddressUpdatable === 'true' ? 'Supported' : 'Not Supported' }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dots Indicator -->
            <div class="flex justify-center mt-4 space-x-2">
              <div v-for="(binInfo, index) in cardBins" :key="index" class="w-2 h-2 rounded-full transition-colors"
                :class="currentBinIndex === index ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"></div>
            </div>

            <!-- Mobile Card Details -->
            <!-- <div class="mt-6">
              <div
                class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Card Details</h3>
                <div class="grid grid-cols-1 gap-4 text-sm">
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Card BIN:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ cardBins[currentBinIndex]?.cardBin || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Card Type:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ cardBins[currentBinIndex]?.cardType || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Card Scheme:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ cardBins[currentBinIndex]?.cardScheme || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Currency:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ cardBins[currentBinIndex]?.cardCurrency || 'USD' }}</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Available Cards:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ cardBins[currentBinIndex]?.remainingAvailableCard || 'Unlimited' }}</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Address Update:</span>
                    <span class="font-medium"
                      :class="cardBins[currentBinIndex]?.billingAddressUpdatable === 'true' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                      {{ cardBins[currentBinIndex]?.billingAddressUpdatable === 'true' ? 'Supported' : 'Not Supported' }}
                    </span>
                  </div>
                </div>
              </div>
            </div> -->
          </div>

          <!-- Desktop: Card Switcher Layout -->
          <div class="hidden md:block pt-16">
            <div class="w-full">
              <!-- Card Selection Header -->
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-4">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Select Card BIN</h2>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ currentBinIndex + 1 }} of {{ cardBins.length }} cards
                  </div>
                </div>

              </div>

              <!-- Card Carousel Container with Side Navigation -->
              <div class="flex items-center justify-center space-x-8">
                <!-- Left Navigation Button -->
                <button :disabled="currentBinIndex === 0"
                  class="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  @click="previousBin" title="Previous card">
                  <i class="pi pi-chevron-left text-gray-600 dark:text-gray-400 text-lg"></i>
                </button>

                <!-- Main Content Area -->
                <div class="flex-1 max-w-4xl">
                  <div ref="carouselContainer" class="overflow-hidden rounded-xl" @mousedown="handleMouseDown"
                    @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp"
                    @wheel="handleWheel" @keydown="handleKeyDown" tabindex="0" style="outline: none;">

                    <!-- Card Carousel -->
                    <div class="flex transition-transform duration-300 ease-in-out"
                      :style="{ transform: `translateX(-${currentBinIndex * 100}%)` }">
                      <div v-for="(binInfo, index) in cardBins" :key="index" class="w-full flex-shrink-0 px-4">
                        <div class="space-y-6 flex flex-col items-center">
                          <!-- Card Preview -->
                          <div
                            class="rounded-xl p-4 md:p-6 text-white cursor-grab active:cursor-grabbing relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600"
                            :style="{
                              backgroundImage: `url(${getCardBackgroundImage(binInfo.cardScheme)})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              aspectRatio: '1035/582',
                              maxWidth: '400px',
                              width: '100%'
                            }">

                            <!-- Card content -->
                            <div class="relative z-10 h-full flex flex-col justify-between">
                              <!-- Top section -->
                              <div class="flex items-center justify-between mb-4 mt-18">
                                <div class="flex items-center space-x-2">
                                </div>
                                <div class="text-right">
                                  <div class="text-xs md:text-sm opacity-80">{{ binInfo.cardCurrency || 'USD' }}</div>
                                </div>
                              </div>

                              <!-- Middle section - Card number -->
                              <div class="mb-4">
                                <div class="text-lg md:text-xl font-mono tracking-wider">
                                  {{ formatCardNumber(binInfo.cardBin) }}
                                </div>
                              </div>

                              <!-- Bottom section -->
                              <div class="flex justify-between items-end">
                                <div>
                                  <div class="text-xs opacity-60 mb-1">Available Cards</div>
                                  <div class="text-sm md:text-base font-semibold">
                                    {{ binInfo.remainingAvailableCard || 'Unlimited' }}
                                  </div>
                                </div>
                                <div class="text-right">
                                  <div class="text-xs opacity-60 mb-1">Address Update</div>
                                  <div class="text-xs md:text-sm font-medium"
                                    :class="binInfo.billingAddressUpdatable === 'true' ? 'text-green-300' : 'text-gray-300'">
                                    {{ binInfo.billingAddressUpdatable === 'true' ? 'Supported' : 'Not Supported' }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Card Details -->
                          <!-- <div
                          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Card Details</h3>
                          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                              <span class="text-gray-600 dark:text-gray-400">Card BIN:</span>
                              <span class="font-medium text-gray-900 dark:text-white">{{ binInfo.cardBin || 'N/A'
                              }}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                              <span class="text-gray-600 dark:text-gray-400">Card Type:</span>
                              <span class="font-medium text-gray-900 dark:text-white">{{ binInfo.cardType || 'N/A'
                              }}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                              <span class="text-gray-600 dark:text-gray-400">Card Scheme:</span>
                              <span class="font-medium text-gray-900 dark:text-white">{{ binInfo.cardScheme || 'N/A'
                              }}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                              <span class="text-gray-600 dark:text-gray-400">Currency:</span>
                              <span class="font-medium text-gray-900 dark:text-white">{{ binInfo.cardCurrency || 'USD'
                              }}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                              <span class="text-gray-600 dark:text-gray-400">Available Cards:</span>
                              <span class="font-medium text-gray-900 dark:text-white">{{ binInfo.remainingAvailableCard
                                || 'Unlimited'
                              }}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                              <span class="text-gray-600 dark:text-gray-400">Address Update:</span>
                              <span class="font-medium"
                                :class="binInfo.billingAddressUpdatable === 'true' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                                {{ binInfo.billingAddressUpdatable === 'true' ? 'Supported' : 'Not Supported' }}
                              </span>
                            </div>
                          </div>
                        </div> -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Navigation Button -->
                <button :disabled="currentBinIndex === cardBins.length - 1"
                  class="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  @click="nextBin" title="Next card">
                  <i class="pi pi-chevron-right text-gray-600 dark:text-gray-400 text-lg"></i>
                </button>
              </div>

              <!-- Dots Indicator -->
              <div class="flex justify-center mt-6 space-x-2">
                <button v-for="(binInfo, index) in cardBins" :key="index"
                  class="w-3 h-3 rounded-full transition-all duration-200 hover:scale-110"
                  :class="currentBinIndex === index ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'"
                  @click="selectBin(index)" :title="`Go to card ${index + 1}`">
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <i class="pi pi-credit-card text-gray-400 dark:text-gray-500 text-4xl mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Card BINs Available</h3>
            <p class="text-gray-600 dark:text-gray-400">No card BIN information found for this card type.</p>
          </div>
        </div>
      </div>

      <!-- Card Limit Information -->
      <div v-if="selectedCard" class="mb-8">
        <div
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
          <h3 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Card Limits</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="flex flex-col">
              <span
                class="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 whitespace-nowrap mb-1">Max
                Monthly</span>
              <span class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">{{
                formatCurrency(selectedCard.maxOnMonthly) }}</span>
            </div>
            <div class="flex flex-col">
              <span
                class="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 whitespace-nowrap mb-1">Max
                Daily</span>
              <span class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">{{
                formatCurrency(selectedCard.maxOnDaily) }}</span>
            </div>
            <div class="flex flex-col">
              <span
                class="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 whitespace-nowrap mb-1">Max
                Percent</span>
              <span class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">{{
                formatPercentage(selectedCard.maxOnPercent) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bottom-buttons-container relative md:static">
        <!-- Back Button -->
        <button class="bottom-button-dual bottom-button-dual-secondary flex items-center justify-center space-x-2"
          @click="goBack">
          <i class="pi pi-arrow-left"></i>
          <span>Back</span>
        </button>

        <!-- Order Button -->
        <button :disabled="!selectedBinInfo || binLoading" class="bottom-button-dual bottom-button-dual-primary"
          @click="orderCard">
          <span v-if="binLoading">Loading...</span>
          <span v-else-if="selectedBinInfo">Order {{ selectedBinInfo.cardType || 'Card' }}</span>
          <span v-else>Select a Card BIN</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useCardStore } from '@/stores/card'
import AppHeader from '@/components/AppHeader.vue'
import CardBinItem from '@/components/CardBinItem.vue'
import type { CardConfig, CardBin } from '@/api/card'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()

// Reactive data
const currentBinIndex = ref(0)
const selectedBinIndex = ref<number | null>(null)
const binLoading = ref(false)
const binError = ref<string | null>(null)

// Mouse drag related state
const carouselContainer = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const dragThreshold = 50 // Drag threshold, switch card only when exceeding this distance

// Get card configuration
const selectedCard = computed<CardConfig | null>(() => {
  const cardName = route.query.cardName as string
  return cardStore.getCardConfigByName(cardName || '') || null
})

// Get card BIN list
const cardBins = computed(() => cardStore.cardBins)

// Selected BIN information
const selectedBinInfo = computed<CardBin | null>(() => {
  if (selectedBinIndex.value !== null && cardBins.value[selectedBinIndex.value]) {
    return cardBins.value[selectedBinIndex.value]
  }
  return null
})

// Load card BIN information
const loadCardBins = async () => {
  if (!selectedCard.value) {
    binError.value = 'No card selected'
    return
  }

  binLoading.value = true
  binError.value = null

  try {
    const cardFormFactor = selectedCard.value.cardPattern === 1 ? 'virtual_card' : 'physical_card'
    const result = await cardStore.fetchCardBins({ cardFormFactor })

    if (result.success && cardStore.cardBins.length > 0) {
      // Select first BIN by default
      selectedBinIndex.value = 0
      currentBinIndex.value = 0
    } else {
      binError.value = result.error || 'Failed to load card BINs'
    }
  } catch (error) {
    binError.value = error instanceof Error ? error.message : 'Failed to load card BINs'
  } finally {
    binLoading.value = false
  }
}

// Select BIN
const selectBin = (index: number | null) => {
  if (index !== null && index >= 0 && index < cardBins.value.length) {
    selectedBinIndex.value = index
    currentBinIndex.value = index
  }
}

// Handle dropdown selection change
const handleSelectChange = () => {
  if (selectedBinIndex.value !== null) {
    selectBin(selectedBinIndex.value)
  }
}

// Previous BIN
const previousBin = () => {
  if (currentBinIndex.value > 0) {
    currentBinIndex.value--
    selectedBinIndex.value = currentBinIndex.value
  }
}

// Next BIN
const nextBin = () => {
  if (currentBinIndex.value < cardBins.value.length - 1) {
    currentBinIndex.value++
    selectedBinIndex.value = currentBinIndex.value
  }
}

// Mouse drag handler
const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true
  startX.value = event.clientX
  currentX.value = event.clientX

  // Prevent text selection
  event.preventDefault()

  // Set focus for keyboard navigation
  if (carouselContainer.value) {
    carouselContainer.value.focus()
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return

  currentX.value = event.clientX
  event.preventDefault()
}

const handleMouseUp = () => {
  if (!isDragging.value) return

  const deltaX = startX.value - currentX.value

  // Switch card based on drag distance and direction
  if (Math.abs(deltaX) > dragThreshold) {
    if (deltaX > 0) {
      // Swipe left, show next card
      nextBin()
    } else {
      // Swipe right, show previous card
      previousBin()
    }
  }

  isDragging.value = false
  startX.value = 0
  currentX.value = 0
}

// Touch event handlers for mobile
const handleTouchStart = (event: TouchEvent) => {
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
      nextBin()
    } else {
      // Swipe right, show previous card
      previousBin()
    }
  }

  isDragging.value = false
  startX.value = 0
  currentX.value = 0
}

// Mouse wheel handler
const handleWheel = (event: WheelEvent) => {
  event.preventDefault()

  if (event.deltaY > 0) {
    // Scroll down, show next card
    nextBin()
  } else {
    // Scroll up, show previous card
    previousBin()
  }
}

// Keyboard navigation handler
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      previousBin()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextBin()
      break
    case 'Home':
      event.preventDefault()
      selectBin(0)
      break
    case 'End':
      event.preventDefault()
      selectBin(cardBins.value.length - 1)
      break
  }
}

// Go back to previous page
const goBack = () => {
  router.back()
}

// Order card
const orderCard = () => {
  if (selectedBinInfo.value && selectedCard.value) {
    // Store selected card information to Pinia store
    cardStore.setSelectedCardBin(selectedBinInfo.value)
    cardStore.setSelectedCardConfig(selectedCard.value)

    // Navigate to cardholder info input page, only pass necessary parameters
    router.push({
      name: 'CardHolderInfo',
      query: {
        cardName: route.query.cardName
      }
    })
  } else {
    toast.add({
      severity: 'warn',
      summary: 'Selection Required',
      detail: 'Please select a card BIN before proceeding',
      life: 3000
    })
  }
}

// Format currency
const formatCurrency = (amount: number) => {
  return `$${amount}`
}
// formatRechargeFee
const formatRechargeFee = (amount: number) => {
  return `${amount}%`
}
// Format percentage
const formatPercentage = (percentage: number) => {
  return `$${percentage}`
}

// Format card number
const formatCardNumber = (cardBin: string | null) => {
  if (!cardBin) {
    return '**** **** **** ****'
  }

  // Remove all spaces and special characters, keep only numbers
  const cleanBin = cardBin.replace(/\D/g, '')

  // If BIN length is >= 19 digits, directly take first 19 digits
  if (cleanBin.length >= 19) {
    return cleanBin.slice(0, 19).replace(/(.{4})/g, '$1 ').trim()
  }

  // If BIN length is < 19 digits, pad with * to 19 digits
  const paddedNumber = cleanBin + '*'.repeat(19 - cleanBin.length)

  // Add a space every 4 digits
  return paddedNumber.replace(/(.{4})/g, '$1 ').trim()
}

// Get card background image based on card scheme
const getCardBackgroundImage = (cardScheme: string | null) => {
  console.log('Card Scheme:', cardScheme) // Debug log

  if (!cardScheme) {
    console.log('No card scheme, using default Mastercard')
    return 'https://static.biulinkpay.online/images/master.png' // Default to Mastercard
  }

  const scheme = cardScheme.toLowerCase()
  console.log('Normalized scheme:', scheme) // Debug log

  if (scheme.includes('master') || scheme.includes('mastercard')) {
    console.log('Using Mastercard background')
    return 'https://static.biulinkpay.online/images/master.png'
  } else if (scheme.includes('visa')) {
    console.log('Using Visa background')
    return 'https://static.biulinkpay.online/images/visa.png'
  } else if (scheme.includes('discover')) {
    console.log('Using Discover background')
    return 'https://static.biulinkpay.online/images/discover.png'
  } else {
    console.log('Unknown scheme, using default Mastercard')
    // Default to Mastercard for unknown schemes
    return 'https://static.biulinkpay.online/images/master.png'
  }
}

// Load data when component mounts
onMounted(async () => {
  await loadCardBins()

  // Wait for DOM update then set focus
  await nextTick()
  if (carouselContainer.value) {
    carouselContainer.value.focus()
  }
})
</script>
