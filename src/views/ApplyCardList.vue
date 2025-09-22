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
            <div class="overflow-hidden">
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

            <!-- Navigation Arrows -->
            <button v-if="currentCardIndex > 0"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg flex items-center justify-center z-10"
              @click="currentCardIndex--; selectedCard = cardConfigs[currentCardIndex]">
              <i class="pi pi-chevron-left text-gray-600 dark:text-gray-400"></i>
            </button>

            <button v-if="currentCardIndex < cardConfigs.length - 1"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg flex items-center justify-center z-10"
              @click="currentCardIndex++; selectedCard = cardConfigs[currentCardIndex]">
              <i class="pi pi-chevron-right text-gray-600"></i>
            </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useCardStore } from '@/stores/card'
import AppHeader from '@/components/AppHeader.vue'
import CardItem from '@/components/CardItem.vue'
import type { CardConfig } from '@/api/card'

const router = useRouter()
const toast = useToast()
const cardStore = useCardStore()

// Reactive data
const selectedCard = ref<CardConfig | null>(null)
const currentCardIndex = ref(0)

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


// Order card
const orderCard = (card: CardConfig) => {
  console.log('Order card clicked:', card)

  if (card.status === 1) {
    // Navigate to BIN selection page
    console.log('Navigating to CardBinSelection with card:', card.cardName)
    router.push({
      name: 'CardBinSelection',
      query: {
        cardName: card.cardName
      }
    })
  } else {
    toast.add({
      severity: 'warn',
      summary: 'Not Available',
      detail: `${card.cardName} is currently not available`,
      life: 3000
    })
  }
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
</style>
