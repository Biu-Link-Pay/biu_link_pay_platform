<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Header -->
    <AppHeader title="Virtual Cards" :show-title="true" />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8 lg:py-12">
      <!-- Card Balance Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Card balance</span>
          <button class="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <i class="pi pi-info text-gray-500 dark:text-gray-400 text-xs"></i>
          </button>
        </div>
        <div class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">$ {{ cardBalance }}</div>
      </div>

      <!-- Virtual Card Display -->
      <div class="mb-8">
        <!-- Mobile: Card Carousel -->
        <div class="md:hidden">
          <div class="relative">
            <div class="overflow-hidden">
              <div class="flex transition-transform duration-300"
                :style="{ transform: `translateX(-${currentCardIndex * 100}%)` }">
                <div v-for="(card, index) in cards" :key="index" class="w-full flex-shrink-0 px-2">
                  <div class="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 text-white shadow-lg">
                    <!-- Card Header -->
                    <div class="flex items-center justify-between mb-4">
                      <span class="text-xs font-semibold opacity-75">TOKEN POCKET LITE</span>
                      <i class="pi pi-chevron-down text-white text-sm"></i>
                    </div>

                    <!-- Card Number -->
                    <div class="text-xl font-mono tracking-wider mb-4">{{ card.maskedNumber }}</div>

                    <!-- Card Footer -->
                    <div class="flex items-center justify-between">
                      <div class="text-sm opacity-80">{{ card.holderName }}</div>
                      <div class="w-12 h-8 bg-white rounded flex items-center justify-center">
                        <i class="pi pi-credit-card text-gray-600 text-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Arrows -->
            <button v-if="cards.length > 1" @click="previousCard"
              class="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <i class="pi pi-chevron-left text-gray-600 text-sm"></i>
            </button>
            <button v-if="cards.length > 1" @click="nextCard"
              class="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <i class="pi pi-chevron-right text-gray-600 text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Desktop: Grid Layout -->
        <div class="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div v-for="(card, index) in cards" :key="index" class="w-full">
            <div
              class="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
              <!-- Card Header -->
              <div class="flex items-center justify-between mb-6">
                <span class="text-sm font-semibold opacity-75">TOKEN POCKET LITE</span>
                <i class="pi pi-chevron-down text-white text-sm"></i>
              </div>

              <!-- Card Number -->
              <div class="text-2xl font-mono tracking-wider mb-6">{{ card.maskedNumber }}</div>

              <!-- Card Footer -->
              <div class="flex items-center justify-between">
                <div class="text-base opacity-80">{{ card.holderName }}</div>
                <div class="w-16 h-10 bg-white rounded flex items-center justify-center">
                  <i class="pi pi-credit-card text-gray-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
        <button
          class="flex flex-col items-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <i class="pi pi-arrow-up text-blue-600 dark:text-blue-400 text-lg"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Recharge</span>
        </button>

        <button
          class="flex flex-col items-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <i class="pi pi-arrow-down text-green-600 dark:text-green-400 text-lg"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Withdraw</span>
        </button>

        <button
          class="flex flex-col items-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <i class="pi pi-list text-purple-600 dark:text-purple-400 text-lg"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Details</span>
        </button>

        <button
          class="flex flex-col items-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <i class="pi pi-qrcode text-orange-600 dark:text-orange-400 text-lg"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Scan</span>
        </button>
      </div>

      <!-- Transaction History Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-4xl mx-auto">
        <!-- Tabs -->
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
            class="flex-1 px-4 py-3 text-sm font-medium transition-colors" :class="activeTab === tab.key
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
            {{ tab.label }}
          </button>
        </div>

        <!-- Transaction List -->
        <div class="p-4 md:p-6">
          <div v-if="activeTab === 'transaction'" class="space-y-4">
            <div v-for="transaction in transactions" :key="transaction.id"
              class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <i class="pi pi-minus text-gray-600 dark:text-gray-400"></i>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900 dark:text-white">{{ transaction.merchant }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ transaction.date }}</div>
              </div>
              <div class="text-right">
                <div class="font-medium text-gray-900 dark:text-white">{{ transaction.amount }}</div>
                <div class="text-sm" :class="getStatusColor(transaction.status)">
                  {{ transaction.status }}
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'recharge'" class="text-center py-8">
            <i class="pi pi-arrow-up text-gray-400 dark:text-gray-500 text-4xl mb-4"></i>
            <p class="text-gray-500 dark:text-gray-400">No recharge history</p>
          </div>

          <div v-else-if="activeTab === 'withdraw'" class="text-center py-8">
            <i class="pi pi-arrow-down text-gray-400 dark:text-gray-500 text-4xl mb-4"></i>
            <p class="text-gray-500 dark:text-gray-400">No withdraw history</p>
          </div>

          <!-- More Button -->
          <div v-if="activeTab === 'transaction'" class="mt-4 text-center">
            <button class="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">More ></button>
          </div>
        </div>
      </div>

      <!-- Supported Payment Methods -->
      <div class="mt-8 max-w-4xl mx-auto">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">Overseas Mainstream Cases</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="method in paymentMethods" :key="method.name"
            class="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <i
                :class="[method.icon, method.supported ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500']"></i>
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-900 dark:text-white">{{ method.name }}</div>
            </div>
            <div class="w-6 h-6 rounded-full flex items-center justify-center"
              :class="method.supported ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'">
              <i :class="method.supported ? 'pi pi-check text-green-600 dark:text-green-400' : 'pi pi-times text-red-600 dark:text-red-400'"
                class="text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-12 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">Powered by</p>
        <div class="mt-2">
          <span class="text-blue-600 dark:text-blue-400 font-semibold">PrimePay</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCardStore } from '@/stores/card'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const cardStore = useCardStore()

// Card data
const cardBalance = ref('1362.82')
const currentCardIndex = ref(0)

// 使用真实的卡片列表数据
const cards = computed(() => {
  return cardStore.cardList.map((card, index) => ({
    id: card.cardId,
    maskedNumber: card.cardNo,
    holderName: 'John Tan', // 这里可以从用户信息获取
    type: 'TOKEN POCKET LITE',
    maxOnMonthly: card.maxOnMonthly,
    maxOnDaily: card.maxOnDaily,
    maxOnPercent: card.maxOnPercent
  }))
})

// Tabs
const tabs = ref([
  { key: 'transaction', label: 'Transaction' },
  { key: 'recharge', label: 'Recharge' },
  { key: 'withdraw', label: 'Withdraw' }
])

const activeTab = ref('transaction')

// Transaction data
const transactions = ref([
  {
    id: 1,
    merchant: 'Amazon',
    date: '2023-02-06 01:00:45',
    amount: '-100 USD',
    status: 'Completed'
  },
  {
    id: 2,
    merchant: 'Facebook',
    date: '2023-02-06 01:00:45',
    amount: '-200 USD',
    status: 'In processing'
  },
  {
    id: 3,
    merchant: 'Stripe',
    date: '2023-02-06 01:00:45',
    amount: '-100 USD',
    status: 'Failed'
  },
  {
    id: 4,
    merchant: 'Google Ads',
    date: '2023-02-06 01:00:45',
    amount: '-100 USD',
    status: 'Completed'
  }
])

// Payment methods
const paymentMethods = ref([
  { name: 'WeChat Pay', icon: 'pi pi-wechat', supported: false },
  { name: 'OpenAI', icon: 'pi pi-openai', supported: true },
  { name: 'Apple Pay', icon: 'pi pi-apple', supported: true },
  { name: 'Alipay', icon: 'pi pi-alipay', supported: false },
  { name: 'ChatGPT Plus', icon: 'pi pi-chatgpt', supported: true },
  { name: 'Apple Music', icon: 'pi pi-music', supported: true }
])

// Card navigation
const previousCard = () => {
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--
  }
}

const nextCard = () => {
  if (currentCardIndex.value < cards.value.length - 1) {
    currentCardIndex.value++
  }
}

// Status color helper
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'text-green-600 dark:text-green-400'
    case 'In processing':
      return 'text-blue-600 dark:text-blue-400'
    case 'Failed':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

// 组件挂载时获取卡片列表
onMounted(async () => {
  // 如果卡片列表为空，则重新获取
  if (cardStore.cardList.length === 0) {
    await cardStore.fetchCardList()
  }
})
</script>

<style scoped>
/* Card carousel styles */
.transition-transform {
  transition: transform 0.3s ease-in-out;
}

/* Custom scrollbar for transaction list */
.space-y-4::-webkit-scrollbar {
  width: 4px;
}

.space-y-4::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.space-y-4::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.space-y-4::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Dark mode scrollbar */
.dark .space-y-4::-webkit-scrollbar-track {
  background: #374151;
}

.dark .space-y-4::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .space-y-4::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive optimizations */
@media (max-width: 768px) {
  .max-w-7xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Dark mode optimizations */
@media (prefers-color-scheme: dark) {
  .bg-gray-50 {
    background-color: #111827;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-gray-200 {
    border-color: #000;
  }

  .text-gray-600 {
    color: #000;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .transition-transform {
    transition: none;
  }

  .transition-shadow {
    transition: none;
  }
}
</style>
