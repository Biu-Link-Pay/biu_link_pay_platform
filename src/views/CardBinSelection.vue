<template>
  <div class="min-h-screen bg-white">
    <!-- Mobile Header -->
    <div class="md:hidden">
      <div class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <button class="w-10 h-10 flex items-center justify-center" @click="goBack">
          <i class="pi pi-arrow-left text-gray-600"></i>
        </button>
        <h1 class="text-lg font-semibold text-gray-900">Apply for a Card</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Desktop Header -->
    <div class="hidden md:block">
      <nav class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <button class="flex items-center space-x-2 text-gray-600 hover:text-gray-900" @click="goBack">
              <i class="pi pi-arrow-left"></i>
              <span>Back</span>
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Apply for a Card</h1>
          </div>

          <div class="flex items-center space-x-4">
            <div
              class="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">G+</span>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="max-w-md mx-auto md:max-w-4xl px-4 py-6">
      <!-- Alert Banner -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="pi pi-credit-card text-white text-sm"></i>
          </div>
          <p class="text-sm text-gray-700">New Virtual Cards Added to Your List</p>
        </div>
      </div>

      <!-- Fee Information -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(selectedCard?.applyFee || 0) }}</div>
          <div class="text-sm text-gray-500">Apply fee</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ formatPercentage(selectedCard?.rechargeFee || 0) }}</div>
          <div class="text-sm text-gray-500">Recharge fee</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(selectedCard?.monthlyFee || 0) }}</div>
          <div class="text-sm text-gray-500">Consumption fee</div>
        </div>
      </div>

      <!-- Card Selection -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 text-center md:text-left">
          Select Card BIN
        </h2>

        <!-- Loading State -->
        <div v-if="binLoading" class="flex justify-center py-12">
          <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span class="text-gray-600">Loading card BINs...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="binError" class="text-center py-8">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6">
            <i class="pi pi-exclamation-triangle text-red-500 text-2xl mb-3"></i>
            <p class="text-red-600 text-sm">{{ binError }}</p>
            <button class="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium" @click="loadCardBins">
              Try Again
            </button>
          </div>
        </div>

        <!-- Card BIN Selection -->
        <div v-else-if="cardBins.length > 0" class="space-y-4">
          <!-- Mobile: Card Carousel -->
          <div class="md:hidden">
            <div class="relative">
              <div class="overflow-hidden">
                <div class="flex transition-transform duration-300 ease-in-out"
                  :style="{ transform: `translateX(-${currentBinIndex * 100}%)` }">
                  <div v-for="(binInfo, index) in cardBins" :key="index" class="w-full flex-shrink-0 px-4">
                    <div class="relative">
                      <CardBinItem :bin-info="binInfo" :selected="currentBinIndex === index"
                        @select="selectBin(index)" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation Arrows -->
              <button v-if="currentBinIndex > 0"
                class="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full shadow-lg flex items-center justify-center"
                @click="previousBin">
                <i class="pi pi-chevron-left text-gray-600"></i>
              </button>

              <button v-if="currentBinIndex < cardBins.length - 1"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full shadow-lg flex items-center justify-center"
                @click="nextBin">
                <i class="pi pi-chevron-right text-gray-600"></i>
              </button>
            </div>

            <!-- Dots Indicator -->
            <div class="flex justify-center mt-4 space-x-2">
              <div v-for="(binInfo, index) in cardBins" :key="index" class="w-2 h-2 rounded-full transition-colors"
                :class="currentBinIndex === index ? 'bg-yellow-400' : 'bg-gray-300'"></div>
            </div>
          </div>

          <!-- Desktop: Grid Layout -->
          <div class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardBinItem v-for="(binInfo, index) in cardBins" :key="index" :bin-info="binInfo"
              :selected="selectedBinIndex === index" @select="selectBin(index)" />
          </div>

          <!-- Selected Card Info -->
          <div v-if="selectedBinInfo" class="mt-6">
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">Selected Card Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Card BIN:</span>
                  <span class="font-medium text-gray-900">{{ selectedBinInfo.cardBin || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Card Type:</span>
                  <span class="font-medium text-gray-900">{{ selectedBinInfo.cardType || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Card Scheme:</span>
                  <span class="font-medium text-gray-900">{{ selectedBinInfo.cardScheme || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Currency:</span>
                  <span class="font-medium text-gray-900">{{ selectedBinInfo.cardCurrency || 'USD' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Available Cards:</span>
                  <span class="font-medium text-gray-900">{{ selectedBinInfo.remainingAvailableCard || 'Unlimited'
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Address Update:</span>
                  <span class="font-medium"
                    :class="selectedBinInfo.billingAddressUpdatable === 'true' ? 'text-green-600' : 'text-gray-500'">
                    {{ selectedBinInfo.billingAddressUpdatable === 'true' ? 'Supported' : 'Not Supported' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="bg-gray-50 rounded-lg p-8">
            <i class="pi pi-credit-card text-gray-400 text-4xl mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No Card BINs Available</h3>
            <p class="text-gray-600">No card BIN information found for this card type.</p>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="sticky bottom-4 md:relative md:bottom-auto">
        <button :disabled="!selectedBinInfo || binLoading"
          class="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useCardStore } from '@/stores/card'
import CardBinItem from '@/components/CardBinItem.vue'
import type { CardConfig, CardBin } from '@/api/card'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()

// 响应式数据
const currentBinIndex = ref(0)
const selectedBinIndex = ref<number | null>(null)
const binLoading = ref(false)
const binError = ref<string | null>(null)

// 获取卡片配置
const selectedCard = computed<CardConfig | null>(() => {
  const cardName = route.query.cardName as string
  return cardStore.getCardConfigByName(cardName || '') || null
})

// 获取卡片 BIN 列表
const cardBins = computed(() => cardStore.cardBins)

// 选中的 BIN 信息
const selectedBinInfo = computed<CardBin | null>(() => {
  if (selectedBinIndex.value !== null && cardBins.value[selectedBinIndex.value]) {
    return cardBins.value[selectedBinIndex.value]
  }
  return null
})

// 加载卡片 BIN 信息
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

    if (!result.success) {
      binError.value = result.error || 'Failed to load card BINs'
    }
  } catch (error) {
    binError.value = error instanceof Error ? error.message : 'Failed to load card BINs'
  } finally {
    binLoading.value = false
  }
}

// 选择 BIN
const selectBin = (index: number) => {
  selectedBinIndex.value = index
  currentBinIndex.value = index
}

// 上一个 BIN
const previousBin = () => {
  if (currentBinIndex.value > 0) {
    currentBinIndex.value--
    selectedBinIndex.value = currentBinIndex.value
  }
}

// 下一个 BIN
const nextBin = () => {
  if (currentBinIndex.value < cardBins.value.length - 1) {
    currentBinIndex.value++
    selectedBinIndex.value = currentBinIndex.value
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 订购卡片
const orderCard = () => {
  if (selectedBinInfo.value) {
    // 跳转到持卡人信息输入页面
    router.push({
      name: 'CardHolderInfo',
      query: {
        cardName: route.query.cardName,
        binInfo: JSON.stringify(selectedBinInfo.value)
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

// 格式化货币
const formatCurrency = (amount: number) => {
  return `$${amount}`
}

// 格式化百分比
const formatPercentage = (percentage: number) => {
  return `${percentage}%`
}

// 组件挂载时加载数据
onMounted(() => {
  loadCardBins()
})
</script>
