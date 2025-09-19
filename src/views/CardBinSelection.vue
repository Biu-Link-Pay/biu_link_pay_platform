<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Header -->
    <AppHeader title="Apply for a Card" :show-title="true" />

    <!-- Main Content -->
    <div class="max-w-md mx-auto md:max-w-4xl px-4 py-6 md:py-8">
      <!-- Alert Banner -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
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
                        @select="() => selectBin(index)" />
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
                :class="currentBinIndex === index ? 'bg-blue-500' : 'bg-gray-300'"></div>
            </div>
          </div>

          <!-- Desktop: Card Switcher Layout -->
          <div class="hidden md:block">
            <div class="max-w-6xl mx-auto">
              <!-- Card Selection Header -->
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-4">
                  <h2 class="text-xl font-semibold text-gray-900">Select Card BIN</h2>
                  <div class="text-sm text-gray-500">
                    {{ currentBinIndex + 1 }} of {{ cardBins.length }} cards
                  </div>
                </div>

                <!-- Navigation Controls -->
                <div class="flex items-center space-x-2">
                  <button :disabled="currentBinIndex === 0"
                    class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    @click="previousBin" title="Previous card">
                    <i class="pi pi-chevron-left text-gray-600"></i>
                  </button>

                  <button :disabled="currentBinIndex === cardBins.length - 1"
                    class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    @click="nextBin" title="Next card">
                    <i class="pi pi-chevron-right text-gray-600"></i>
                  </button>
                </div>
              </div>

              <!-- Card Carousel Container -->
              <div class="relative">
                <div ref="carouselContainer" class="overflow-hidden rounded-xl" @mousedown="handleMouseDown"
                  @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp" @wheel="handleWheel"
                  @keydown="handleKeyDown" tabindex="0" style="outline: none;">

                  <!-- Card Carousel -->
                  <div class="flex transition-transform duration-300 ease-in-out"
                    :style="{ transform: `translateX(-${currentBinIndex * 100}%)` }">
                    <div v-for="(binInfo, index) in cardBins" :key="index" class="w-full flex-shrink-0 px-4">
                      <div class="space-y-6">
                        <!-- Card Preview -->
                        <div
                          class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white shadow-lg cursor-grab active:cursor-grabbing"
                          :class="{ 'ring-2 ring-blue-300': currentBinIndex === index }">
                          <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center space-x-3">
                              <div class="w-12 h-8 bg-yellow-400 rounded-sm"></div>
                              <div class="text-lg font-semibold">{{ binInfo.cardType || 'Card' }}</div>
                            </div>
                            <div class="text-right">
                              <div class="text-sm opacity-80">{{ binInfo.cardCurrency || 'USD' }}</div>
                              <div class="text-xs opacity-60">{{ binInfo.cardScheme || 'Card Scheme' }}</div>
                            </div>
                          </div>

                          <div class="mb-6">
                            <div class="text-2xl font-mono tracking-wider mb-2">
                              {{ formatCardNumber(binInfo.cardBin) }}
                            </div>
                          </div>

                          <div class="flex justify-between items-end">
                            <div>
                              <div class="text-xs opacity-60 mb-1">Available Cards</div>
                              <div class="text-lg font-semibold">
                                {{ binInfo.remainingAvailableCard || 'Unlimited' }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="text-xs opacity-60 mb-1">Address Update</div>
                              <div class="text-sm font-medium"
                                :class="binInfo.billingAddressUpdatable === 'true' ? 'text-green-300' : 'text-gray-300'">
                                {{ binInfo.billingAddressUpdatable === 'true' ? 'Supported' : 'Not Supported' }}
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Card Details -->
                        <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                          <h3 class="text-lg font-semibold text-gray-900 mb-4">Card Details</h3>
                          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                            <div class="flex justify-between py-2 border-b border-gray-100">
                              <span class="text-gray-600">Card BIN:</span>
                              <span class="font-medium text-gray-900">{{ binInfo.cardBin || 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100">
                              <span class="text-gray-600">Card Type:</span>
                              <span class="font-medium text-gray-900">{{ binInfo.cardType || 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100">
                              <span class="text-gray-600">Card Scheme:</span>
                              <span class="font-medium text-gray-900">{{ binInfo.cardScheme || 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100">
                              <span class="text-gray-600">Currency:</span>
                              <span class="font-medium text-gray-900">{{ binInfo.cardCurrency || 'USD' }}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100">
                              <span class="text-gray-600">Available Cards:</span>
                              <span class="font-medium text-gray-900">{{ binInfo.remainingAvailableCard || 'Unlimited'
                              }}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100">
                              <span class="text-gray-600">Address Update:</span>
                              <span class="font-medium"
                                :class="binInfo.billingAddressUpdatable === 'true' ? 'text-green-600' : 'text-gray-500'">
                                {{ binInfo.billingAddressUpdatable === 'true' ? 'Supported' : 'Not Supported' }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

      <!-- Action Buttons -->
      <div class="sticky bottom-4 md:relative md:bottom-auto">
        <div class="flex gap-3">
          <!-- Back Button -->
          <button
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg flex items-center justify-center space-x-2"
            @click="goBack">
            <i class="pi pi-arrow-left"></i>
            <span>Back</span>
          </button>

          <!-- Order Button -->
          <button :disabled="!selectedBinInfo || binLoading"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
            @click="orderCard">
            <span v-if="binLoading">Loading...</span>
            <span v-else-if="selectedBinInfo">Order {{ selectedBinInfo.cardType || 'Card' }}</span>
            <span v-else>Select a Card BIN</span>
          </button>
        </div>
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

// 响应式数据
const currentBinIndex = ref(0)
const selectedBinIndex = ref<number | null>(null)
const binLoading = ref(false)
const binError = ref<string | null>(null)

// 鼠标滑动相关状态
const carouselContainer = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const dragThreshold = 50 // 滑动阈值，超过此距离才切换卡片

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

    if (result.success && cardStore.cardBins.length > 0) {
      // 默认选中第一个 BIN
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

// 选择 BIN
const selectBin = (index: number | null) => {
  if (index !== null && index >= 0 && index < cardBins.value.length) {
    selectedBinIndex.value = index
    currentBinIndex.value = index
  }
}

// 处理下拉选择变化
const handleSelectChange = () => {
  if (selectedBinIndex.value !== null) {
    selectBin(selectedBinIndex.value)
  }
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

// 鼠标滑动处理函数
const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true
  startX.value = event.clientX
  currentX.value = event.clientX

  // 防止文本选择
  event.preventDefault()

  // 设置焦点以便键盘导航
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

  // 根据滑动距离和方向切换卡片
  if (Math.abs(deltaX) > dragThreshold) {
    if (deltaX > 0) {
      // 向左滑动，显示下一张卡片
      nextBin()
    } else {
      // 向右滑动，显示上一张卡片
      previousBin()
    }
  }

  isDragging.value = false
  startX.value = 0
  currentX.value = 0
}

// 鼠标滚轮处理
const handleWheel = (event: WheelEvent) => {
  event.preventDefault()

  if (event.deltaY > 0) {
    // 向下滚动，显示下一张卡片
    nextBin()
  } else {
    // 向上滚动，显示上一张卡片
    previousBin()
  }
}

// 键盘导航处理
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

// 格式化卡片号码
const formatCardNumber = (cardBin: string | null) => {
  if (!cardBin) {
    return '**** **** **** ****'
  }

  // 移除所有空格和特殊字符，只保留数字
  const cleanBin = cardBin.replace(/\D/g, '')

  // 如果 BIN 长度大于等于 19 位，直接截取前 19 位
  if (cleanBin.length >= 19) {
    return cleanBin.slice(0, 19).replace(/(.{4})/g, '$1 ').trim()
  }

  // 如果 BIN 长度小于 19 位，用 * 补全到 19 位
  const paddedNumber = cleanBin + '*'.repeat(19 - cleanBin.length)

  // 每 4 位添加一个空格
  return paddedNumber.replace(/(.{4})/g, '$1 ').trim()
}

// 组件挂载时加载数据
onMounted(async () => {
  await loadCardBins()

  // 等待 DOM 更新后设置焦点
  await nextTick()
  if (carouselContainer.value) {
    carouselContainer.value.focus()
  }
})
</script>
