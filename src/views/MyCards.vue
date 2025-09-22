<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Header -->
    <AppHeader title="Virtual Cards" :show-title="true" />

    <!-- Main Content -->
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <!-- Empty State -->
      <div v-if="cards.length === 0" class="text-center py-12">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <div
            class="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <i class="pi pi-credit-card text-gray-400 dark:text-gray-500 text-3xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Virtual Cards</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">You haven't applied for any virtual cards yet. Click the
            button below to apply for your first card</p>
          <button @click="goToApplyCard"
            class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            <i class="pi pi-plus mr-2"></i>
            Apply Virtual Card
          </button>
        </div>
      </div>

      <!-- Cards Display with Features -->
      <div v-else class="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
        <!-- Left Side: Card Display -->
        <div class="space-y-6 order-1 lg:order-1">
          <!-- Card Display Area with Navigation -->
          <div class="flex items-center justify-center gap-3 md:gap-6">
            <!-- Left Navigation Button -->
            <button v-if="cards.length > 1" @click="previousCard" :disabled="currentCardIndex === 0"
              class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              title="Previous card">
              <i class="pi pi-chevron-left text-gray-600 dark:text-gray-400 text-sm md:text-lg"></i>
            </button>

            <!-- Card Container -->
            <div class="flex-1 max-w-xs md:max-w-sm relative overflow-hidden">
              <div
                class="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-4 md:p-6 text-white shadow-lg min-h-[200px] md:min-h-[240px] flex flex-col justify-between cursor-grab active:cursor-grabbing"
                @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp"
                @mouseleave="handleMouseUp" @wheel="handleWheel" @keydown="handleKeyDown" tabindex="0"
                style="outline: none;">
                <!-- Card Header -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold opacity-75">BUI LINK PAY</span>
                  <button v-if="selectedCard" @click="toggleCardDetailsVisibility"
                    class="text-white/80 hover:text-white transition-colors">
                    <i :class="showCardDetails ? 'pi pi-eye' : 'pi pi-eye-slash'" class="text-sm"></i>
                  </button>
                </div>

                <!-- Card Details -->
                <div v-if="selectedCard" class="space-y-3 text-sm">
                  <!-- Card Number -->
                  <div class="text-xl font-mono tracking-wider">
                    {{ showCardDetails ? selectedCard.cardNo : '•••• •••• •••• ••••' }}
                  </div>

                  <!-- Card Info -->
                  <div class="flex justify-between items-center">
                    <span class="font-mono">
                      {{ showCardDetails ? '•••' : '•••' }}
                    </span>
                    <span>{{ showCardDetails ? 'MM/YY' : '••/••' }}</span>
                  </div>

                  <!-- Cardholder Name -->
                  <div class="text-sm">
                    {{ showCardDetails ? 'CARD HOLDER' : '••••••••••••' }}
                  </div>

                  <!-- Currency -->
                  <div class="text-xs opacity-75">
                    USD
                  </div>
                </div>

                <!-- Card Footer -->
                <div class="flex items-center justify-between">
                  <div class="text-base opacity-80">{{ showCardDetails ? 'CARD HOLDER' : '••••••••••••' }}</div>
                  <div class="w-16 h-10 bg-white rounded flex items-center justify-center">
                    <i class="pi pi-credit-card text-gray-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Navigation Button -->
            <button v-if="cards.length > 1" @click="nextCard" :disabled="currentCardIndex === cards.length - 1"
              class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              title="Next card">
              <i class="pi pi-chevron-right text-gray-600 dark:text-gray-400 text-sm md:text-lg"></i>
            </button>
          </div>

          <!-- Navigation Dots for Multiple Cards -->
          <div v-if="cards.length > 1" class="flex justify-center mt-4 space-x-2">
            <button v-for="(card, index) in cards" :key="index" @click="selectCard(index)"
              class="w-3 h-3 rounded-full transition-colors duration-200"
              :class="index === currentCardIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'">
            </button>
          </div>

          <!-- Action Buttons Row -->
          <div class="flex justify-center mt-6 space-x-6 md:space-x-8">
            <!-- Recharge Button -->
            <div class="flex flex-col items-center">
              <button @click="goToRecharge"
                class="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center mb-2">
                <i class="pi pi-arrow-down text-gray-600 dark:text-gray-400 text-lg md:text-xl"></i>
              </button>
              <span class="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Recharge</span>
            </div>

            <!-- Withdraw Button -->
            <div class="flex flex-col items-center">
              <button @click="goToWithdraw"
                class="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center mb-2">
                <i class="pi pi-arrow-up text-gray-600 dark:text-gray-400 text-lg md:text-xl"></i>
              </button>
              <span class="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Withdraw</span>
            </div>

            <!-- Details Button -->
            <div class="flex flex-col items-center">
              <button @click="goToDetails"
                class="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center mb-2">
                <i class="pi pi-calendar text-gray-600 dark:text-gray-400 text-lg md:text-xl"></i>
              </button>
              <span class="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Details</span>
            </div>

            <!-- Add Card Button -->
            <div class="flex flex-col items-center">
              <button @click="goToApplyCard"
                class="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center mb-2">
                <i class="pi pi-plus text-gray-600 dark:text-gray-400 text-lg md:text-xl"></i>
              </button>
              <span class="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Add Card</span>
            </div>
          </div>

          <!-- Card Limits Panel -->
          <div v-if="selectedCard"
            class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction Limits</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Daily Limit</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-white">${{ selectedCard.maxOnDaily
                  }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Monthly Limit</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-white">${{ selectedCard.maxOnMonthly
                  }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Single Transaction Limit</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-white">${{ selectedCard.maxOnPercent
                  }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Features and Actions -->
        <div class="space-y-6 order-2 lg:order-2">
          <!-- Features Section -->
          <div v-if="cards.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm w-full">
            <!-- Tabs -->
            <div class="flex border-b border-gray-200 dark:border-gray-700">
              <button v-for="tab in tabs" :key="tab.key" @click="handleTabChange(tab.key)"
                class="flex-1 px-4 py-3 text-sm font-medium transition-colors" :class="activeTab === tab.key
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
                {{ tab.label }}
              </button>
            </div>

            <!-- Transaction List -->
            <div class="p-4 md:p-6">
              <!-- No Cards State -->
              <div v-if="cards.length === 0" class="text-center py-12">
                <div
                  class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <i class="pi pi-credit-card text-gray-400 dark:text-gray-500 text-2xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Cards</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  <span v-if="activeTab === 'transaction'">Please apply for a virtual card first to view transaction
                    history</span>
                  <span v-else-if="activeTab === 'recharge'">Please apply for a virtual card first to view deposit
                    orders</span>
                  <span v-else-if="activeTab === 'withdraw'">Please apply for a virtual card first to view withdrawal
                    orders</span>
                  <span v-else>Please apply for a virtual card first to view related information</span>
                </p>
                <button @click="goToApplyCard"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  <i class="pi pi-plus mr-2"></i>
                  Apply Card
                </button>
              </div>

              <!-- Transaction Tab -->
              <div v-else-if="activeTab === 'transaction'" class="space-y-4">
                <!-- Loading State -->
                <div v-if="loading.transaction" class="flex justify-center py-8">
                  <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>

                <!-- Desktop: Swipe Pagination -->
                <div v-else-if="transactions.length > 0 && !isMobile" class="space-y-4">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.transaction.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileTransactionPages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2">
                        <div class="space-y-4">
                          <div v-for="(transaction, index) in page" :key="index"
                            class="flex items-center space-x-4 p-4 lg:p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div
                              class="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <i class="pi pi-minus text-gray-600 dark:text-gray-400 text-base lg:text-lg"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="font-medium text-gray-900 dark:text-white text-base lg:text-lg truncate">
                                {{ transaction.merchantNameLocation || 'Unknown Merchant' }}
                              </div>
                              <div class="text-sm lg:text-base text-gray-500 dark:text-gray-400">
                                {{ transaction.merchantLocation || 'Unknown Location' }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-medium text-gray-900 dark:text-white text-base lg:text-lg">
                                {{ formatTransactionAmount(transaction.transactionAmount,
                                transaction.transactionCurrency) }}
                              </div>
                              <div class="text-sm lg:text-base" :class="getStatusColor(transaction.status)">
                                {{ transaction.status }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Desktop Navigation -->
                  <div class="flex items-center justify-between">
                    <button @click="prevDesktopPage('transaction')"
                      :disabled="pagination.transaction.pageIndex === 0 || loading.transaction"
                      class="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <i class="pi pi-chevron-left"></i>
                      <span>Previous</span>
                    </button>

                    <div class="flex items-center space-x-4">
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        Page {{ pagination.transaction.pageIndex + 1 }}
                      </span>
                      <div v-if="loading.transaction" class="flex items-center space-x-2">
                        <i class="pi pi-spin pi-spinner text-blue-600"></i>
                        <span class="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
                      </div>
                    </div>

                    <button @click="nextDesktopPage('transaction')"
                      :disabled="!pagination.transaction.hasMore || loading.transaction"
                      class="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <span>Next</span>
                      <i class="pi pi-chevron-right"></i>
                    </button>
                  </div>
                </div>

                <!-- Mobile: Swipe Pagination -->
                <div v-else-if="transactions.length > 0 && isMobile" class="space-y-4">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.transaction.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileTransactionPages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2">
                        <div class="space-y-3">
                          <div v-for="(transaction, index) in page" :key="index"
                            class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div
                              class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <i class="pi pi-minus text-gray-600 dark:text-gray-400 text-sm"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="font-medium text-gray-900 dark:text-white text-sm truncate">
                                {{ transaction.merchantNameLocation || 'Unknown Merchant' }}
                              </div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">
                                {{ transaction.merchantLocation || 'Unknown Location' }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-medium text-gray-900 dark:text-white text-sm">
                                {{ formatTransactionAmount(transaction.transactionAmount,
                                  transaction.transactionCurrency)
                                }}
                              </div>
                              <div class="text-xs" :class="getStatusColor(transaction.status)">
                                {{ transaction.status }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Mobile Navigation -->
                  <div class="flex items-center justify-between">
                    <button @click="prevDesktopPage('transaction')"
                      :disabled="pagination.transaction.pageIndex === 0 || loading.transaction"
                      class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <i class="pi pi-chevron-left text-sm"></i>
                      <span class="text-sm">Previous</span>
                    </button>

                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-600 dark:text-gray-400">
                        Page {{ pagination.transaction.pageIndex + 1 }}
                      </span>
                      <div v-if="loading.transaction" class="flex items-center space-x-1">
                        <i class="pi pi-spin pi-spinner text-blue-600 text-xs"></i>
                      </div>
                    </div>

                    <button @click="nextDesktopPage('transaction')"
                      :disabled="!pagination.transaction.hasMore || loading.transaction"
                      class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <span class="text-sm">Next</span>
                      <i class="pi pi-chevron-right text-sm"></i>
                    </button>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8">
                  <i class="pi pi-list text-gray-400 dark:text-gray-500 text-4xl mb-4"></i>
                  <p class="text-gray-500 dark:text-gray-400 text-sm lg:text-base">No transaction history</p>
                </div>
              </div>

              <!-- Recharge Tab -->
              <div v-else-if="activeTab === 'recharge'" class="space-y-4">
                <!-- Loading State -->
                <div v-if="loading.recharge" class="flex justify-center py-8">
                  <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>

                <!-- Desktop: Swipe Pagination -->
                <div v-else-if="rechargeOrders.length > 0 && !isMobile" class="space-y-2">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.recharge.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileRechargePages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2">
                          <div v-for="(order, index) in page" :key="index"
                            class="flex items-center space-x-4 p-2 lg:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div
                              class="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <i class="pi pi-arrow-up text-blue-600 dark:text-blue-400 text-base lg:text-lg"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="font-medium text-gray-900 dark:text-white text-base lg:text-lg">
                                {{ order.num }}
                              </div>
                              <div class="text-sm lg:text-base text-gray-500 dark:text-gray-400">
                                {{ formatDate(order.createTime || '') }}
                              </div>
                              <div class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                                {{ order.token }} - {{ order.network }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-medium text-gray-900 dark:text-white text-base lg:text-lg">
                                {{ formatOrderAmount(order.amount, order.orderCurrency) }}
                              </div>
                              <div class="text-sm lg:text-base" :class="getStatusColor(order.type)">
                                {{ order.type === '1' ? 'Card Creation' : 'Recharge' }}
                              </div>
                              <div class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                                USD: {{ order.usdAmount }}
                              </div>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>

                  <!-- Desktop Navigation -->
                  <div class="flex items-center justify-between">
                    <button @click="prevDesktopPage('recharge')"
                      :disabled="pagination.recharge.pageNo === 0 || loading.recharge"
                      class="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <i class="pi pi-chevron-left"></i>
                      <span>Previous</span>
                    </button>

                    <div class="flex items-center space-x-4">
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        Page {{ pagination.recharge.pageNo + 1 }}
                      </span>
                      <div v-if="loading.recharge" class="flex items-center space-x-2">
                        <i class="pi pi-spin pi-spinner text-blue-600"></i>
                        <span class="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
                      </div>
                    </div>

                    <button @click="nextDesktopPage('recharge')"
                      :disabled="!pagination.recharge.hasMore || loading.recharge"
                      class="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <span>Next</span>
                      <i class="pi pi-chevron-right"></i>
                    </button>
                  </div>
                </div>

                <!-- Mobile: Swipe Pagination -->
                <div v-else-if="rechargeOrders.length > 0 && isMobile" class="space-y-2">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.recharge.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileRechargePages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2">
                        <div class="space-y-3">
                          <div v-for="(order, index) in page" :key="index"
                            class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div
                              class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <i class="pi pi-arrow-up text-blue-600 dark:text-blue-400 text-sm"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                {{ order.num }}
                              </div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">
                                {{ formatDate(order.createTime || '') }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-medium text-gray-900 dark:text-white text-sm">
                                {{ formatOrderAmount(order.amount, order.orderCurrency) }}
                              </div>
                              <div class="text-xs" :class="getStatusColor(order.type)">
                                {{ order.type === '1' ? 'Card Creation' : 'Recharge' }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Mobile Navigation -->
                  <div class="flex items-center justify-between">
                    <button @click="prevDesktopPage('recharge')"
                      :disabled="pagination.recharge.pageNo === 0 || loading.recharge"
                      class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <i class="pi pi-chevron-left text-sm"></i>
                      <span class="text-sm">Previous</span>
                    </button>

                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-600 dark:text-gray-400">
                        Page {{ pagination.recharge.pageNo + 1 }}
                      </span>
                      <div v-if="loading.recharge" class="flex items-center space-x-1">
                        <i class="pi pi-spin pi-spinner text-blue-600 text-xs"></i>
                      </div>
                    </div>

                    <button @click="nextDesktopPage('recharge')"
                      :disabled="!pagination.recharge.hasMore || loading.recharge"
                      class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <span class="text-sm">Next</span>
                      <i class="pi pi-chevron-right text-sm"></i>
                    </button>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8">
                  <i class="pi pi-arrow-up text-gray-400 dark:text-gray-500 text-4xl mb-4"></i>
                  <p class="text-gray-500 dark:text-gray-400 text-sm lg:text-base">No recharge history</p>
                </div>
              </div>

              <!-- Withdraw Tab -->
              <div v-else-if="activeTab === 'withdraw'" class="space-y-4">
                <!-- Loading State -->
                <div v-if="loading.withdraw" class="flex justify-center py-8">
                  <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>

                <!-- Desktop: Swipe Pagination -->
                <div v-else-if="withdrawOrders.length > 0 && !isMobile" class="space-y-4">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.withdraw.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileWithdrawPages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2">
                        <div class="space-y-4">
                          <div v-for="(order, index) in page" :key="index"
                            class="flex items-center space-x-4 p-4 lg:p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div
                              class="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <i class="pi pi-arrow-down text-green-600 dark:text-green-400 text-base lg:text-lg"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="font-medium text-gray-900 dark:text-white text-base lg:text-lg">
                                Withdraw Order #{{ order.num || 'N/A' }}
                              </div>
                              <div class="text-sm lg:text-base text-gray-500 dark:text-gray-400">
                                {{ formatDate(order.createTime || '') }}
                              </div>
                              <div class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                                {{ order.address || 'N/A' }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-medium text-gray-900 dark:text-white text-base lg:text-lg">
                                {{ formatWithdrawAmount(order.usdAmount, order.token) }}
                              </div>
                              <div class="text-sm lg:text-base" :class="getStatusColor(order.status)">
                                {{ order.status }}
                              </div>
                              <div class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                                Fee: {{ order.networkFee || 0 }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Desktop Navigation -->
                  <div class="flex items-center justify-between">
                    <button @click="prevDesktopPage('withdraw')"
                      :disabled="pagination.withdraw.pageNo === 0 || loading.withdraw"
                      class="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <i class="pi pi-chevron-left"></i>
                      <span>Previous</span>
                    </button>

                    <div class="flex items-center space-x-4">
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        Page {{ pagination.withdraw.pageNo + 1 }}
                      </span>
                      <div v-if="loading.withdraw" class="flex items-center space-x-2">
                        <i class="pi pi-spin pi-spinner text-blue-600"></i>
                        <span class="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
                      </div>
                    </div>

                    <button @click="nextDesktopPage('withdraw')"
                      :disabled="!pagination.withdraw.hasMore || loading.withdraw"
                      class="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <span>Next</span>
                      <i class="pi pi-chevron-right"></i>
                    </button>
                  </div>
                </div>

                <!-- Mobile: Swipe Pagination -->
                <div v-else-if="withdrawOrders.length > 0 && isMobile" class="space-y-4">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.withdraw.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileWithdrawPages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2">
                        <div class="space-y-3">
                          <div v-for="(order, index) in page" :key="index"
                            class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div
                              class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <i class="pi pi-arrow-down text-green-600 dark:text-green-400 text-sm"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="font-medium text-gray-900 dark:text-white text-sm mb-1">
                                Withdraw
                              </div>
                              <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                #{{ order.num || 'N/A' }}
                              </div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">
                                {{ formatDate(order.createTime || '') }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-medium text-gray-900 dark:text-white text-sm">
                                {{ formatWithdrawAmount(order.usdAmount, order.token) }}
                              </div>
                              <div class="text-xs" :class="getStatusColor(order.status)">
                                {{ order.status }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Mobile Navigation -->
                  <div class="flex items-center justify-between">
                    <button @click="prevDesktopPage('withdraw')"
                      :disabled="pagination.withdraw.pageNo === 0 || loading.withdraw"
                      class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <i class="pi pi-chevron-left text-sm"></i>
                      <span class="text-sm">Previous</span>
                    </button>

                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-600 dark:text-gray-400">
                        Page {{ pagination.withdraw.pageNo + 1 }}
                      </span>
                      <div v-if="loading.withdraw" class="flex items-center space-x-1">
                        <i class="pi pi-spin pi-spinner text-blue-600 text-xs"></i>
                      </div>
                    </div>

                    <button @click="nextDesktopPage('withdraw')"
                      :disabled="!pagination.withdraw.hasMore || loading.withdraw"
                      class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <span class="text-sm">Next</span>
                      <i class="pi pi-chevron-right text-sm"></i>
                    </button>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8">
                  <i class="pi pi-arrow-down text-gray-400 dark:text-gray-500 text-4xl mb-4"></i>
                  <p class="text-gray-500 dark:text-gray-400 text-sm lg:text-base">No withdraw history</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>



      <!-- Transaction History Section -->

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCardStore } from '@/stores/card'
import { useToast } from 'primevue/usetoast'
import AppHeader from '@/components/AppHeader.vue'
import { OrderAPI, type TransactionListItem, type DepositOrderListItem, type WithdrawOrderListItem, type WithdrawOrderPageResponse } from '@/api/order'

const router = useRouter()
const route = useRoute()
const cardStore = useCardStore()
const toast = useToast()

// Card data
const currentCardIndex = ref(0)

// Use real card list data
const cards = computed(() => {
  return cardStore.cardList.map((card, index) => ({
    id: card.cardId,
    cardNo: card.cardNo, // Use the card number from list
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

// Loading states
const loading = ref({
  transaction: false,
  recharge: false,
  withdraw: false
})

// Pagination states
const pagination = ref({
  transaction: { pageIndex: 0, pageSize: 5, hasMore: true },
  recharge: { pageNo: 0, pageSize: 5, hasMore: true },
  withdraw: { pageNo: 0, pageSize: 5, hasMore: true }
})

// Data arrays
const transactions = ref<TransactionListItem[]>([])
const rechargeOrders = ref<DepositOrderListItem[]>([])
const withdrawOrders = ref<WithdrawOrderListItem[]>([])

// Current selected card
const selectedCard = computed(() => {
  return cards.value[currentCardIndex.value] || cards.value[0]
})

// Card display state
const showCardDetails = ref(false)

// Mobile swipe pagination states
const mobilePagination = ref({
  transaction: { currentPage: 0, totalPages: 0, itemsPerPage: 5 }, // Changed to 5, consistent with API pageSize
  recharge: { currentPage: 0, totalPages: 0, itemsPerPage: 5 }, // Changed to 5, consistent with API pageSize
  withdraw: { currentPage: 0, totalPages: 0, itemsPerPage: 5 } // Changed to 5, consistent with API pageSize
})

// Mobile swipe data
const mobileTransactionPages = ref<TransactionListItem[][]>([])
const mobileRechargePages = ref<DepositOrderListItem[][]>([])
const mobileWithdrawPages = ref<WithdrawOrderListItem[][]>([])

// Check if mobile device
const isMobile = computed(() => {
  return window.innerWidth < 768
})

// Drag and drop states
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const dragThreshold = 50 // Minimum drag distance to trigger card switch

// Payment methods
const paymentMethods = ref([
  { name: 'WeChat Pay', icon: 'pi pi-wechat', supported: false },
  { name: 'OpenAI', icon: 'pi pi-openai', supported: true },
  { name: 'Apple Pay', icon: 'pi pi-apple', supported: true },
  { name: 'Alipay', icon: 'pi pi-alipay', supported: false },
  { name: 'ChatGPT Plus', icon: 'pi pi-chatgpt', supported: true },
  { name: 'Apple Music', icon: 'pi pi-music', supported: true }
])

// API functions
const fetchTransactions = async (pageIndex = 0) => {
  if (!selectedCard.value?.id) {
    console.log('No selected card ID available:', selectedCard.value)
    console.log('Cards available:', cards.value)
    return
  }

  try {
    loading.value.transaction = true
    console.log('Fetching transactions for card:', selectedCard.value.id, 'page:', pageIndex)

    const response = await OrderAPI.getTransactionList({
      pageIndex: pageIndex.toString(),
      pageSize: pagination.value.transaction.pageSize.toString(),
      cardId: selectedCard.value.id
    })

    if (response.success && response.model) {
      const newTransactions = response.model.content || []

      // Replace data on each call to achieve true pagination
      transactions.value = newTransactions
      pagination.value.transaction.pageIndex = pageIndex

      // Update mobile pagination
      updateMobilePagination('transaction', transactions.value)

      // Check if there are more pages
      pagination.value.transaction.hasMore = newTransactions.length === pagination.value.transaction.pageSize
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load transaction history',
      life: 3000
    })
  } finally {
    loading.value.transaction = false
  }
}

const fetchRechargeOrders = async (pageNo = 0) => {
  try {
    loading.value.recharge = true

    const response = await OrderAPI.getDepositOrderPage({
      pageNo,
      pageSize: pagination.value.recharge.pageSize
    })

    if (response.success && response.model) {
      const newOrders = response.model.content || []

      // Replace data on each call to achieve true pagination
      rechargeOrders.value = newOrders
      pagination.value.recharge.pageNo = pageNo

      // Update mobile pagination
      updateMobilePagination('recharge', rechargeOrders.value)

      // Check if there are more pages
      pagination.value.recharge.hasMore = newOrders.length === pagination.value.recharge.pageSize
    }
  } catch (error) {
    console.error('Error fetching recharge orders:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load recharge history',
      life: 3000
    })
  } finally {
    loading.value.recharge = false
  }
}

const fetchWithdrawOrders = async (pageNo = 0) => {
  try {
    loading.value.withdraw = true

    const response = await OrderAPI.getWithdrawOrderPage({
      pageNo,
      pageSize: pagination.value.withdraw.pageSize
    })

    if (response.success && response.model) {
      const newOrders = response.model.content || []

      // Replace data on each call to achieve true pagination
      withdrawOrders.value = newOrders
      pagination.value.withdraw.pageNo = pageNo

      // Update mobile pagination
      updateMobilePagination('withdraw', withdrawOrders.value)

      // Check if there are more pages
      pagination.value.withdraw.hasMore = newOrders.length === pagination.value.withdraw.pageSize
    }
  } catch (error) {
    console.error('Error fetching withdraw orders:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load withdraw history',
      life: 3000
    })
  } finally {
    loading.value.withdraw = false
  }
}


// Toggle card details visibility
const toggleCardDetailsVisibility = () => {
  showCardDetails.value = !showCardDetails.value
}

// Copy to clipboard
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.add({
      severity: 'success',
      summary: 'Copied',
      detail: 'Copied to clipboard',
      life: 2000
    })
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Copy failed',
      life: 3000
    })
  }
}

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

// Select card
const selectCard = (index: number) => {
  currentCardIndex.value = index
}

// Navigation functions
const goToApplyCard = () => {
  router.push('/apply-card')
}

const goToWithdraw = () => {
  if (!selectedCard.value?.id) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select a card first',
      life: 3000
    })
    return
  }
  
  // Navigate to withdraw page or show withdraw modal
  toast.add({
    severity: 'info',
    summary: 'Withdraw',
    detail: 'Withdraw functionality coming soon',
    life: 3000
  })
}

const goToDetails = () => {
  if (!selectedCard.value?.id) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select a card first',
      life: 3000
    })
    return
  }
  
  // Navigate to card details page or show details modal
  toast.add({
    severity: 'info',
    summary: 'Card Details',
    detail: 'Card details functionality coming soon',
    life: 3000
  })
}


const goToRecharge = () => {
  if (!selectedCard.value?.id) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select a card first',
      life: 3000
    })
    return
  }

  // Set card information to Pinia store for recharge operation
  // Create a CardBin object containing cardId for recharge
  const rechargeCardBin = {
    cardBin: '-',
    cardType: '-',
    cardScheme: '-', // Default card type
    cardCurrency: 'USD', // Default currency
    billingAddressUpdatable: 'false',
    expiryDateCustomization: 'false',
    remainingAvailableCard: 0,
    availableCard: 0,
    cardFormFactor: 'virtual_card',
    cardId: selectedCard.value?.id || '' // Add cardId for recharge
  }

  // Set to Pinia store
  cardStore.setSelectedCardBin(rechargeCardBin)
  cardStore.setSelectedCardConfig(null) // Recharge does not need card configuration

  // Navigate to card-holder-info page
  router.push({
    name: 'CardHolderInfo',
    query: {
      action: 'recharge'
    }
  })
}

// Data formatters
const formatTransactionAmount = (amount: number, currency: string) => {
  const sign = amount < 0 ? '-' : '+'
  return `${sign}${Math.abs(amount).toFixed(2)} ${currency}`
}

const formatOrderAmount = (amount: number, currency: string) => {
  return `${amount.toFixed(2)} ${currency}`
}

const formatWithdrawAmount = (usdAmount: number | null, token: string | null) => {
  if (usdAmount === null || token === null) return 'N/A'
  return `${token} ${usdAmount.toFixed(2)}`
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Status color helper
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'success':
      return 'text-green-600 dark:text-green-400'
    case 'pending':
    case 'in processing':
    case 'processing':
      return 'text-blue-600 dark:text-blue-400'
    case 'failed':
    case 'fail':
      return 'text-red-600 dark:text-red-400'
    case 'cancel':
    case 'cancelled':
      return 'text-orange-600 dark:text-orange-400'
    case 'init':
      return 'text-yellow-600 dark:text-yellow-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

// Drag and drop handlers
const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true
  startX.value = event.clientX
  currentX.value = event.clientX

  // Prevent text selection
  event.preventDefault()
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
      nextCard()
    } else {
      // Swipe right, show previous card
      previousCard()
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
    nextCard()
  } else {
    // Scroll up, show previous card
    previousCard()
  }
}

// Keyboard navigation handler
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      previousCard()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextCard()
      break
  }
}

// Mobile pagination functions
const createMobilePages = <T>(items: T[], itemsPerPage: number): T[][] => {
  const pages: T[][] = []
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage))
  }
  return pages
}

const updateMobilePagination = (tabKey: string, items: any[]) => {
  const itemsPerPage = mobilePagination.value[tabKey as keyof typeof mobilePagination.value].itemsPerPage
  const pages = createMobilePages(items, itemsPerPage)

  switch (tabKey) {
    case 'transaction':
      mobileTransactionPages.value = pages
      mobilePagination.value.transaction.totalPages = pages.length
      break
    case 'recharge':
      mobileRechargePages.value = pages
      mobilePagination.value.recharge.totalPages = pages.length
      break
    case 'withdraw':
      mobileWithdrawPages.value = pages
      mobilePagination.value.withdraw.totalPages = pages.length
      break
  }
}

// Mobile swipe navigation
const nextMobilePage = (tabKey: string) => {
  const pagination = mobilePagination.value[tabKey as keyof typeof mobilePagination.value]
  if (pagination.currentPage < pagination.totalPages - 1) {
    pagination.currentPage++
  }
}

const prevMobilePage = (tabKey: string) => {
  const pagination = mobilePagination.value[tabKey as keyof typeof mobilePagination.value]
  if (pagination.currentPage > 0) {
    pagination.currentPage--
  }
}

// Desktop pagination navigation - directly call API
const nextDesktopPage = (tabKey: string) => {
  switch (tabKey) {
    case 'transaction':
      if (pagination.value.transaction.hasMore && !loading.value.transaction) {
        const nextPage = pagination.value.transaction.pageIndex + 1
        fetchTransactions(nextPage)
      }
      break
    case 'recharge':
      if (pagination.value.recharge.hasMore && !loading.value.recharge) {
        const nextPage = pagination.value.recharge.pageNo + 1
        fetchRechargeOrders(nextPage)
      }
      break
    case 'withdraw':
      if (pagination.value.withdraw.hasMore && !loading.value.withdraw) {
        const nextPage = pagination.value.withdraw.pageNo + 1
        fetchWithdrawOrders(nextPage)
      }
      break
  }
}

const prevDesktopPage = (tabKey: string) => {
  switch (tabKey) {
    case 'transaction':
      if (pagination.value.transaction.pageIndex > 0 && !loading.value.transaction) {
        const prevPage = pagination.value.transaction.pageIndex - 1
        fetchTransactions(prevPage)
      }
      break
    case 'recharge':
      if (pagination.value.recharge.pageNo > 0 && !loading.value.recharge) {
        const prevPage = pagination.value.recharge.pageNo - 1
        fetchRechargeOrders(prevPage)
      }
      break
    case 'withdraw':
      if (pagination.value.withdraw.pageNo > 0 && !loading.value.withdraw) {
        const prevPage = pagination.value.withdraw.pageNo - 1
        fetchWithdrawOrders(prevPage)
      }
      break
  }
}

// Load more functions - removed, using Previous/Next buttons for pagination

// Tab change handler
const handleTabChange = (tabKey: string) => {
  console.log('Tab changed to:', tabKey)
  activeTab.value = tabKey

  // Reset to first page and refresh data
  switch (tabKey) {
    case 'transaction':
      pagination.value.transaction.pageIndex = 0
      fetchTransactions(0)
      break
    case 'recharge':
      pagination.value.recharge.pageNo = 0
      fetchRechargeOrders(0)
      break
    case 'withdraw':
      pagination.value.withdraw.pageNo = 0
      fetchWithdrawOrders(0)
      break
  }
}

// Watch for card changes
watch(currentCardIndex, () => {
  // Reload transactions when card changes
  if (activeTab.value === 'transaction') {
    transactions.value = []
    // Reset pagination state
    pagination.value.transaction.pageIndex = 0
    pagination.value.transaction.hasMore = true
    mobilePagination.value.transaction.currentPage = 0
    fetchTransactions(0)
  }

  // Reset card details visibility when card changes
  showCardDetails.value = false
})

// Get card list when component mounts
onMounted(async () => {
  console.log('MyCards component mounted')
  console.log('Initial card list length:', cardStore.cardList.length)

  // If card list is empty, fetch again
  if (cardStore.cardList.length === 0) {
    console.log('Fetching card list...')
    await cardStore.fetchCardList()
    console.log('Card list fetched, length:', cardStore.cardList.length)
  }

  // Load initial data
  console.log('Cards computed length:', cards.value.length)
  if (cards.value.length > 0) {
    console.log('Loading initial transactions...')
    await fetchTransactions()
  } else {
    console.log('No cards available, skipping transaction fetch')
  }

  // Check if there are payment success query parameters
  if (route.query.success === 'true') {
    const message = route.query.message as string || 'Payment completed successfully'
    toast.add({
      severity: 'success',
      summary: 'Payment Success',
      detail: message,
      life: 5000
    })

    // Clear query parameters to avoid duplicate display on page refresh
    router.replace({ name: 'MyCards' })
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
