<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Header -->
    <nav class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <div
            class="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">G+</span>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <Button label="Logout" text class="text-gray-600 hover:text-gray-900" @click="handleLogout" />
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="text-gray-600">Loading card configurations...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <i class="pi pi-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h3 class="text-lg font-semibold text-red-800 mb-2">Loading Failed</h3>
          <p class="text-red-600 mb-6">{{ error }}</p>
          <Button label="Retry" icon="pi pi-refresh" severity="secondary" @click="fetchCardConfigs" />
        </div>
      </div>

      <!-- Card Selection Grid -->
      <div v-else-if="cardConfigs.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <CardItem v-for="card in cardConfigs" :key="card.cardName" :card="card"
          :selected="selectedCard?.cardName === card.cardName" @select="selectCard" @order="orderCard"
          @activate="activateCard" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="bg-gray-50 rounded-lg p-12 max-w-md mx-auto">
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
import { useAuthStore } from '@/stores/auth'
import { useCardStore } from '@/stores/card'
import CardItem from '@/components/CardItem.vue'
import type { CardConfig } from '@/api/card'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const cardStore = useCardStore()

// 响应式数据
const selectedCard = ref<CardConfig | null>(null)

// 计算属性
const loading = computed(() => cardStore.loading)
const error = computed(() => cardStore.error)
const cardConfigs = computed(() => cardStore.enabledCards)

// 获取卡片配置
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

// Logout handling
const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.add({
      severity: 'success',
      summary: 'Logged Out',
      detail: 'You have been logged out successfully',
      life: 3000
    })
    router.push('/login')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Logout Failed',
      detail: 'Failed to logout. Please try again.',
      life: 3000
    })
  }
}

// Fetch data when component mounts
onMounted(() => {
  fetchCardConfigs()
})
</script>
