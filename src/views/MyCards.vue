<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900">Virtual Cards</h1>
        <button class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <i class="pi pi-plus text-gray-600 text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-6 py-6">
      <!-- Card Balance Section -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">Card balance</span>
          <button class="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
            <i class="pi pi-info text-gray-500 text-xs"></i>
          </button>
        </div>
        <div class="text-3xl font-bold text-gray-900">$ {{ cardBalance }}</div>
      </div>

      <!-- Virtual Card Display -->
      <div class="mb-8">
        <div class="relative">
          <!-- Card Carousel -->
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
                      <img src="/mastercard-logo.png" alt="Mastercard" class="h-6" />
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

      <!-- Quick Action Buttons -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        <button
          class="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="pi pi-arrow-up text-blue-600 text-lg"></i>
          </div>
          <span class="text-sm font-medium text-gray-700">Recharge</span>
        </button>

        <button
          class="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <i class="pi pi-arrow-down text-green-600 text-lg"></i>
          </div>
          <span class="text-sm font-medium text-gray-700">Withdraw</span>
        </button>

        <button
          class="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <i class="pi pi-list text-purple-600 text-lg"></i>
          </div>
          <span class="text-sm font-medium text-gray-700">Details</span>
        </button>

        <button
          class="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <i class="pi pi-qrcode text-orange-600 text-lg"></i>
          </div>
          <span class="text-sm font-medium text-gray-700">Scan</span>
        </button>
      </div>

      <!-- Transaction History Section -->
      <div class="bg-white rounded-lg shadow-sm">
        <!-- Tabs -->
        <div class="flex border-b border-gray-200">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
            class="flex-1 px-4 py-3 text-sm font-medium transition-colors" :class="activeTab === tab.key
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'">
            {{ tab.label }}
          </button>
        </div>

        <!-- Transaction List -->
        <div class="p-4">
          <div v-if="activeTab === 'transaction'" class="space-y-4">
            <div v-for="transaction in transactions" :key="transaction.id" class="flex items-center space-x-4">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <i class="pi pi-minus text-gray-600"></i>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ transaction.merchant }}</div>
                <div class="text-sm text-gray-500">{{ transaction.date }}</div>
              </div>
              <div class="text-right">
                <div class="font-medium text-gray-900">{{ transaction.amount }}</div>
                <div class="text-sm" :class="getStatusColor(transaction.status)">
                  {{ transaction.status }}
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'recharge'" class="text-center py-8">
            <i class="pi pi-arrow-up text-gray-400 text-4xl mb-4"></i>
            <p class="text-gray-500">No recharge history</p>
          </div>

          <div v-else-if="activeTab === 'withdraw'" class="text-center py-8">
            <i class="pi pi-arrow-down text-gray-400 text-4xl mb-4"></i>
            <p class="text-gray-500">No withdraw history</p>
          </div>

          <!-- More Button -->
          <div v-if="activeTab === 'transaction'" class="mt-4 text-center">
            <button class="text-blue-600 text-sm font-medium">More ></button>
          </div>
        </div>
      </div>

      <!-- Supported Payment Methods -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Overseas Mainstream Cases</h3>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="method in paymentMethods" :key="method.name"
            class="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <i :class="method.icon" :class="method.supported ? 'text-green-600' : 'text-gray-400'"></i>
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-900">{{ method.name }}</div>
            </div>
            <div class="w-5 h-5 rounded-full flex items-center justify-center"
              :class="method.supported ? 'bg-green-100' : 'bg-red-100'">
              <i :class="method.supported ? 'pi pi-check text-green-600' : 'pi pi-times text-red-600'"
                class="text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">Powered by</p>
        <div class="mt-2">
          <span class="text-blue-600 font-semibold">PrimePay</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Card data
const cardBalance = ref('1362.82')
const currentCardIndex = ref(0)

const cards = ref([
  {
    id: 1,
    maskedNumber: '**** **** **** 0298',
    holderName: 'John Tan',
    type: 'TOKEN POCKET LITE'
  },
  {
    id: 2,
    maskedNumber: '**** **** **** 1234',
    holderName: 'John Tan',
    type: 'TOKEN POCKET LITE'
  }
])

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
      return 'text-green-600'
    case 'In processing':
      return 'text-blue-600'
    case 'Failed':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}
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
</style>
