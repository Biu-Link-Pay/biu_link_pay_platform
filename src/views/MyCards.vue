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
      <div v-else class="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 mb-8">
        <!-- Left Side: Card Display -->
        <div class="space-y-6 order-1 lg:order-1">
          <!-- Card Display Area with Navigation -->
          <div class="flex items-center justify-center gap-3 md:gap-6">
            <!-- Left Navigation Button - Hidden on mobile -->
            <button v-if="cards.length > 1" @click="previousCard" :disabled="currentCardIndex === 0"
              class="hidden md:flex flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 items-center justify-center"
              title="Previous card">
              <i class="pi pi-chevron-left text-gray-600 dark:text-gray-400 text-sm md:text-lg"></i>
            </button>

            <!-- Card Container -->
            <div class="flex-1 max-w-xs md:max-w-sm relative overflow-hidden md:flex-1">
              <Transition :name="cardTransitionName" mode="out-in">
                <div v-if="selectedCard" :key="selectedCard.id || selectedCard.cardNo || currentCardIndex"
                  class="rounded-xl p-4 md:p-6 text-white shadow-lg cursor-grab active:cursor-grabbing relative overflow-hidden"
                  :style="{
                    backgroundImage: `url(${getCardBackgroundImage(selectedCard.cardScheme)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    aspectRatio: '1035/582',
                    maxWidth: '400px',
                    width: '100%'
                  }" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp"
                  @mouseleave="handleMouseUp" @wheel="handleWheel" @keydown="handleKeyDown"
                  @touchstart.passive="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
                  @touchcancel="handleTouchEnd" tabindex="0" style="outline: none;">

                  <!-- Semi-transparent overlay for better text readability -->
                  <div class="absolute inset-0 bg-black/20 rounded-xl"></div>

                  <!-- Card content -->
                  <div class="relative z-10 h-full flex flex-col justify-between">
                    <!-- Card Header -->
                    <!-- Card Details -->
                    <div v-if="selectedCard" class="space-y-5 text-sm">
                      <div class="md:mt-14 mt-20 w-full flex justify-end items-baseline gap-2">
                        <span class="text-sm md:text-base font-bold text-white tabular-nums">
                          {{ selectedCard.cardBalance }}
                        </span>
                        <span class="text-sm md:text-base font-medium text-white/90 normal-case">
                          {{ selectedCard.cardCurrency || 'N/A' }}
                        </span>
                      </div>
                      <!-- Card Number -->
                      <div class="text-lg md:text-xl font-mono tracking-[0.35em]">
                        {{ selectedCard.cardNo }}
                      </div>

                      <!-- Card Info -->

                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Right Navigation Button - Hidden on mobile -->
            <button v-if="cards.length > 1" @click="nextCard" :disabled="currentCardIndex === cards.length - 1"
              class="hidden md:flex flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 items-center justify-center"
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
          <div class="flex justify-center mt-6 space-x-4 md:space-x-6">
            <!-- Recharge Button -->
            <div class="flex flex-col items-center">
              <button @click="goToRecharge"
                class="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center mb-2">
                <i class="pi pi-arrow-down text-gray-600 dark:text-gray-400 text-base md:text-lg"></i>
              </button>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">Recharge</span>
            </div>

            <!-- Withdraw Button -->
            <div class="flex flex-col items-center">
              <button @click="goToWithdraw"
                class="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center mb-2">
                <i class="pi pi-arrow-up text-gray-600 dark:text-gray-400 text-base md:text-lg"></i>
              </button>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">Withdraw</span>
            </div>

            <!-- Details Button -->
            <div class="flex flex-col items-center">
              <button @click="goToDetails"
                class="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center mb-2">
                <i class="pi pi-calendar text-gray-600 dark:text-gray-400 text-base md:text-lg"></i>
              </button>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">Details</span>
            </div>

            <!-- Delete Card Button -->
            <div class="flex flex-col items-center">
              <button @click="goToDeleteCard"
                class="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-colors flex items-center justify-center mb-2">
                <i class="pi pi-trash text-red-600 dark:text-red-400 text-base md:text-lg"></i>
              </button>
              <span class="text-xs text-red-600 dark:text-red-400 font-medium">Delete</span>
            </div>

            <!-- Add Card Button -->
            <div class="flex flex-col items-center">
              <button @click="goToApplyCard"
                class="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center mb-2">
                <i class="pi pi-plus text-gray-600 dark:text-gray-400 text-base md:text-lg"></i>
              </button>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">Add Card</span>
            </div>
          </div>

          <!-- Card Limits Panel -->
          <div v-if="selectedCard"
            class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <i class="pi pi-shield text-blue-600 dark:text-blue-400 text-lg"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Transaction Limits</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Your card spending limits</p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <i class="pi pi-calendar text-green-600 dark:text-green-400 text-sm"></i>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Limit</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Maximum per day</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ selectedCard.maxOnDaily != null ? `$${selectedCard.maxOnDaily}` : 'NO LIMIT' }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <i class="pi pi-calendar-plus text-blue-600 dark:text-blue-400 text-sm"></i>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Limit</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Maximum per month</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ selectedCard.maxOnMonthly != null ? `$${selectedCard.maxOnMonthly}` : 'NO LIMIT' }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <i class="pi pi-credit-card text-orange-600 dark:text-orange-400 text-sm"></i>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Single Transaction</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Maximum per transaction</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ selectedCard.maxOnPercent != null ? `$${selectedCard.maxOnPercent}` : 'NO LIMIT' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Features and Actions -->
        <div class="space-y-8 order-2 lg:order-2">
          <!-- Features Section -->
          <div v-if="cards.length > 0"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm w-full border border-gray-200 dark:border-gray-700">
            <!-- Tabs -->
            <div
              class="flex flex-wrap gap-2 md:gap-4 border-b border-gray-200 dark:border-gray-700 px-2 md:px-3 lg:px-4">
              <button v-for="tab in tabs" :key="tab.key" @click="handleTabChange(tab.key)"
                class="flex-1 basis-0 px-3 py-2 text-center text-sm md:text-base lg:text-base font-semibold transition-colors md:px-4 md:py-3 lg:px-6 lg:py-3 rounded-t-md"
                :class="activeTab === tab.key
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
                {{ tab.label }}
              </button>
            </div>

            <!-- Transaction List -->
            <div class="p-3 md:p-4 lg:p-5">
              <!-- No Cards State -->
              <div v-if="cards.length === 0" class="text-center py-8">
                <div
                  class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <i class="pi pi-credit-card text-gray-400 dark:text-gray-500 text-2xl"></i>
                </div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">No Cards</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
              <div v-else-if="activeTab === 'transaction'" class="space-y-4 lg:space-y-6">
                <!-- Loading State -->
                <div v-if="loading.transaction" class="flex justify-center py-6">
                  <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>

                <!-- Desktop: Swipe Pagination -->
                <div v-else-if="transactions.length > 0 && !isMobile" class="space-y-3 lg:space-y-4">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.transaction.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileTransactionPages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2 lg:px-4">
                        <div class="space-y-3 lg:space-y-4">
                          <div v-for="(transaction, index) in page" :key="index"
                            class="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 lg:p-5 rounded-xl">
                            <div
                              class="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <i class="pi pi-minus text-gray-600 dark:text-gray-400 text-base lg:text-lg"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="font-medium text-gray-900 dark:text-white text-sm lg:text-base truncate">
                                {{ transaction.merchantNameLocation || transaction.transactionType || '' }}
                              </div>
                              <div class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                                {{ transaction.merchantLocation || '' }}
                              </div>
                              <div v-if="transaction.feeDeductionAmount"
                                class="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                Fee: {{ transaction.feeDeductionAmount.toFixed(2) }} {{ transaction.feeDeductionCurrency
                                }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                                {{ formatTransactionAmount(transaction.transactionAmount,
                                  transaction.transactionCurrency)
                                }}
                              </div>
                              <div class="text-xs lg:text-sm" :class="getStatusColor(transaction.status)">
                                {{ transaction.status }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Desktop Navigation -->
                  <div class="flex items-center justify-between mt-4 px-2">
                    <button @click="prevDesktopPage('transaction')"
                      :disabled="pagination.transaction.pageIndex === 0 || loading.transaction"
                      class="group flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-600 disabled:hover:shadow-none transition-all duration-200">
                      <i
                        class="pi pi-chevron-left text-xs group-hover:transform group-hover:-translate-x-0.5 transition-transform"></i>
                      <span>Previous</span>
                    </button>

                    <button @click="nextDesktopPage('transaction')"
                      :disabled="!pagination.transaction.hasMore || loading.transaction"
                      class="group flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-600 disabled:hover:shadow-none transition-all duration-200">
                      <span>Next</span>
                      <i
                        class="pi pi-chevron-right text-xs group-hover:transform group-hover:translate-x-0.5 transition-transform"></i>
                    </button>
                  </div>
                </div>

                <!-- Mobile: Swipe Pagination -->
                <div v-else-if="transactions.length > 0 && isMobile" class="space-y-3 lg:space-y-4">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.transaction.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileTransactionPages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2 lg:px-4">
                        <div class="space-y-2 lg:space-y-3">
                          <div v-for="(transaction, index) in page" :key="index"
                            class="flex items-center space-x-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div
                              class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <i class="pi pi-minus text-gray-600 dark:text-gray-400 text-xs"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="font-medium text-gray-900 dark:text-white text-xs truncate">
                                {{ transaction.merchantNameLocation || transaction.transactionType || '' }}
                              </div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">
                                {{ transaction.merchantLocation || '' }}
                              </div>
                              <div v-if="transaction.feeDeductionAmount"
                                class="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                                Fee: {{ transaction.feeDeductionAmount.toFixed(2) }} {{ transaction.feeDeductionCurrency
                                }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-medium text-gray-900 dark:text-white text-xs">
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
                  <div class="flex items-center justify-between mt-3 px-1">
                    <button @click="prevDesktopPage('transaction')"
                      :disabled="pagination.transaction.pageIndex === 0 || loading.transaction"
                      class="group flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 active:border-blue-500 dark:active:border-blue-400 active:text-blue-600 dark:active:text-blue-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150">
                      <i class="pi pi-chevron-left text-[10px]"></i>
                      <span>Prev</span>
                    </button>

                    <button @click="nextDesktopPage('transaction')"
                      :disabled="!pagination.transaction.hasMore || loading.transaction"
                      class="group flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 active:border-blue-500 dark:active:border-blue-400 active:text-blue-600 dark:active:text-blue-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150">
                      <span>Next</span>
                      <i class="pi pi-chevron-right text-[10px]"></i>
                    </button>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-6">
                  <i class="pi pi-list text-gray-400 dark:text-gray-500 text-3xl mb-4"></i>
                  <p class="text-gray-500 dark:text-gray-400 text-sm">No transaction history</p>
                </div>
              </div>

              <!-- Recharge Tab -->
              <div v-else-if="activeTab === 'recharge'" class="space-y-3 lg:space-y-4">
                <!-- Loading State -->
                <div v-if="loading.recharge" class="flex justify-center py-6">
                  <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>

                <!-- Desktop: Swipe Pagination -->
                <div v-else-if="rechargeOrders.length > 0 && !isMobile" class="space-y-2 lg:space-y-3">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.recharge.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileRechargePages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2 lg:px-4">
                        <div v-for="(order, index) in page" :key="index"
                          class="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 lg:p-5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                          @click="goToPaymentResult(order)">
                          <div
                            class="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <i class="pi pi-arrow-up text-blue-600 dark:text-blue-400 text-base lg:text-lg"></i>
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                              {{ order.num }}
                            </div>
                            <div class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                              {{ formatDate(order.createTime || '') }}
                            </div>
                          </div>
                          <div class="text-right">
                            <div class="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                              {{ formatOrderAmount(order.amount, order.orderCurrency) }}
                            </div>
                            <div class="text-xs lg:text-sm" :class="getStatusColor(order.status)">
                              {{ order.status }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Desktop Navigation -->
                  <div class="flex items-center justify-between mt-4 px-2">
                    <button @click="prevDesktopPage('recharge')"
                      :disabled="pagination.recharge.pageNo === 0 || loading.recharge"
                      class="group flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-600 disabled:hover:shadow-none transition-all duration-200">
                      <i
                        class="pi pi-chevron-left text-xs group-hover:transform group-hover:-translate-x-0.5 transition-transform"></i>
                      <span>Previous</span>
                    </button>

                    <button @click="nextDesktopPage('recharge')"
                      :disabled="!pagination.recharge.hasMore || loading.recharge"
                      class="group flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-600 disabled:hover:shadow-none transition-all duration-200">
                      <span>Next</span>
                      <i
                        class="pi pi-chevron-right text-xs group-hover:transform group-hover:translate-x-0.5 transition-transform"></i>
                    </button>
                  </div>
                </div>

                <!-- Mobile: Swipe Pagination -->
                <div v-else-if="rechargeOrders.length > 0 && isMobile" class="space-y-2 lg:space-y-3">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.recharge.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileRechargePages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2 lg:px-4">
                        <div class="space-y-2 lg:space-y-3">
                          <div v-for="(order, index) in page" :key="index"
                            class="flex items-center space-x-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            @click="goToPaymentResult(order)">
                            <div
                              class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <i class="pi pi-arrow-up text-blue-600 dark:text-blue-400 text-sm"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="font-medium text-gray-900 dark:text-white text-xs">
                                {{ order.num }}
                              </div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">
                                {{ formatDate(order.createTime || '') }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-medium text-gray-900 dark:text-white text-xs">
                                {{ formatOrderAmount(order.amount, order.orderCurrency) }}
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
                  <div class="flex items-center justify-between mt-3 px-1">
                    <button @click="prevDesktopPage('recharge')"
                      :disabled="pagination.recharge.pageNo === 0 || loading.recharge"
                      class="group flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 active:border-blue-500 dark:active:border-blue-400 active:text-blue-600 dark:active:text-blue-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150">
                      <i class="pi pi-chevron-left text-[10px]"></i>
                      <span>Prev</span>
                    </button>

                    <button @click="nextDesktopPage('recharge')"
                      :disabled="!pagination.recharge.hasMore || loading.recharge"
                      class="group flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 active:border-blue-500 dark:active:border-blue-400 active:text-blue-600 dark:active:text-blue-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150">
                      <span>Next</span>
                      <i class="pi pi-chevron-right text-[10px]"></i>
                    </button>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-6">
                  <i class="pi pi-arrow-up text-gray-400 dark:text-gray-500 text-3xl mb-4"></i>
                  <p class="text-gray-500 dark:text-gray-400 text-sm">No recharge history</p>
                </div>
              </div>

              <!-- Withdraw Tab -->
              <div v-else-if="activeTab === 'withdraw'" class="space-y-3 lg:space-y-4">
                <!-- Loading State -->
                <div v-if="loading.withdraw" class="flex justify-center py-6">
                  <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>

                <!-- Desktop: Swipe Pagination -->
                <div v-else-if="withdrawOrders.length > 0 && !isMobile" class="space-y-3 lg:space-y-4">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.withdraw.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileWithdrawPages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2 lg:px-4">
                        <div class="space-y-3 lg:space-y-4">
                          <div v-for="(order, index) in page" :key="index"
                            class="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 lg:p-5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            @click="goToWithdrawResult(order)">
                            <div
                              class="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <i class="pi pi-arrow-down text-green-600 dark:text-green-400 text-base lg:text-lg"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                                {{ order.num || 'N/A' }}
                              </div>
                              <div class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                                {{ formatDate(order.createTime || '') }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                                {{ formatWithdrawAmount(order.usdAmount, order.orderCurrency) }}
                              </div>
                              <div class="text-xs lg:text-sm" :class="getStatusColor(order.status)">
                                {{ order.status }}
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
                      class="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <i class="pi pi-chevron-left text-sm"></i>
                      <span class="text-sm">Previous</span>
                    </button>

                    <button @click="nextDesktopPage('withdraw')"
                      :disabled="!pagination.withdraw.hasMore || loading.withdraw"
                      class="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <span class="text-sm">Next</span>
                      <i class="pi pi-chevron-right text-sm"></i>
                    </button>
                  </div>
                </div>

                <!-- Mobile: Swipe Pagination -->
                <div v-else-if="withdrawOrders.length > 0 && isMobile" class="space-y-3 lg:space-y-4">
                  <div class="relative overflow-hidden">
                    <div class="flex transition-transform duration-300"
                      :style="{ transform: `translateX(-${mobilePagination.withdraw.currentPage * 100}%)` }">
                      <div v-for="(page, pageIndex) in mobileWithdrawPages" :key="pageIndex"
                        class="w-full flex-shrink-0 px-2 lg:px-4">
                        <div class="space-y-2 lg:space-y-3">
                          <div v-for="(order, index) in page" :key="index"
                            class="flex items-center space-x-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            @click="goToWithdrawResult(order)">
                            <div
                              class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <i class="pi pi-arrow-down text-green-600 dark:text-green-400 text-sm"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="font-medium text-gray-900 dark:text-white text-xs">
                                {{ order.num || 'N/A' }}
                              </div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">
                                {{ formatDate(order.createTime || '') }}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-medium text-gray-900 dark:text-white text-xs">
                                {{ formatWithdrawAmount(order.usdAmount, order.orderCurrency) }}
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
                      class="flex items-center space-x-1 px-2 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <i class="pi pi-chevron-left text-xs"></i>
                      <span class="text-xs">Previous</span>
                    </button>
                    <button @click="nextDesktopPage('withdraw')"
                      :disabled="!pagination.withdraw.hasMore || loading.withdraw"
                      class="flex items-center space-x-1 px-2 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <span class="text-xs">Next</span>
                      <i class="pi pi-chevron-right text-xs"></i>
                    </button>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-6">
                  <i class="pi pi-arrow-down text-gray-400 dark:text-gray-500 text-3xl mb-4"></i>
                  <p class="text-gray-500 dark:text-gray-400 text-sm">No withdraw history</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- Transaction History Section -->

      <CardDetailDialog v-model:visible="showDetailDialog" :loading="detailLoading" :error="detailError"
        :card-detail="cardDetail" @retry="retryCardDetail" @updated="onDetailUpdated" />

      <!-- Google Auth Dialog -->
      <GoogleAuthDialog ref="googleAuthDialogRef" v-model:visible="showGoogleAuthDialog" title="Security Verification"
        :identifier="pendingAction || 'default'" @submit="onGoogleAuthSubmit" @cancel="onGoogleAuthCancel" />


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCardStore } from '@/stores/card'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'
import AppHeader from '@/components/AppHeader.vue'
import CardDetailDialog from '@/components/CardDetailDialog.vue'
import GoogleAuthDialog from '@/components/GoogleAuthDialog.vue'
import { CardAPI, type CardDetailResponse } from '@/api/card'
import { OrderAPI, type TransactionListItem, type DepositOrderListItem, type WithdrawOrderListItem, type WithdrawOrderPageResponse } from '@/api/order'
import { useClipboard } from '@vueuse/core'

const router = useRouter()
const route = useRoute()
const cardStore = useCardStore()
const toast = useToast()
const userStore = useUserStore()

// Card data
const currentCardIndex = ref(0)

// Google Auth Dialog state
const showGoogleAuthDialog = ref(false)
const pendingAction = ref<'withdraw' | 'details' | 'delete' | null>(null)
const googleAuthDialogRef = ref()

// Whether Google Authenticator is bound
const isGoogleAuthBound = computed(() => userStore.googleAuthStatus === 1)

// Polling for transaction list
let transactionPollingInterval: NodeJS.Timeout | null = null
const isComponentMounted = ref(false)


// Google Auth callbacks
const onGoogleAuthSubmit = async (code: string, identifier: string): Promise<void> => {
  console.log('Google Auth submit:', code, 'identifier:', identifier)

  if (!selectedCard.value?.id) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a card first',
      life: 3000
    })
    return
  }

  try {
    // Verify code by calling card detail API
    console.log('Verifying code, calling card detail API...')
    const response = await CardAPI.queryCardDetail({
      cardId: selectedCard.value.id,
      faCode: code
    })

    if (response.success && response.model) {
      // Verification successful, cache current card details
      cardStore.cacheCurrentCardDetail(response.model)
      console.log('Code verification successful, current card details cached')

      // Close verification dialog and reset code
      showGoogleAuthDialog.value = false
      googleAuthDialogRef.value?.resetCode()

      // Execute subsequent operations based on identifier
      if (identifier === 'withdraw') {
        await executeWithdrawAction(response.model)
      } else if (identifier === 'details') {
        await executeDetailsAction(response.model)
      } else if (identifier === 'delete') {
        await executeDeleteAction(response.model)
      }

      // Reset pending action
      pendingAction.value = null

      // Show success message
      toast.add({
        severity: 'success',
        summary: 'Verification Successful',
        detail: 'Google Auth verification passed, operation completed',
        life: 3000
      })

    } else {
      // Verification failed
      throw new Error(response.msg || 'Invalid verification code')
    }

  } catch (error) {
    console.error('Verification failed:', error)

    // If verification fails, reset code but don't close dialog, let user retry
    googleAuthDialogRef.value?.resetCode()

    toast.add({
      severity: 'error',
      summary: 'Verification Failed',
      detail: (error as any)?.message || 'Invalid verification code, please try again',
      life: 3000
    })
  }
}

const onGoogleAuthCancel = (identifier: string): void => {
  console.log('Google Auth cancelled for:', identifier)
  showGoogleAuthDialog.value = false
  pendingAction.value = null
}

// Use real card list data
const cards = computed(() => {
  return cardStore.cardList.map(card => ({
    id: card.cardId,
    cardNo: card.cardNo, // Use the card number from list
    maxOnMonthly: card.maxOnMonthly,
    maxOnDaily: card.maxOnDaily,
    maxOnPercent: card.maxOnPercent,
    cardCurrency: card.cardCurrency,
    cardScheme: card.cardScheme.toLowerCase(), // Default card scheme since it's not available in CardListItem
    cardBalance: card.cardBalance
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

const showDetailDialog = ref(false)
const detailLoading = ref(false)
const detailError = ref<string | null>(null)
const cardDetail = ref<CardDetailResponse | null>(null)
// Keep parent in sync when dialog updates address
const onDetailUpdated = (updated: CardDetailResponse) => {
  cardDetail.value = updated
  cardStore.cacheCurrentCardDetail(updated)
}

// Execute actions after Google Auth verification
const executeWithdrawAction = async (cardDetail: CardDetailResponse) => {
  console.log('Executing withdraw operation, card details:', cardDetail)

  // Navigate to withdraw page with card information
  // Card details are already cached in Pinia store, no need to pass verification code
  router.push({
    name: 'WithdrawOrder',
    query: {
      cardId: cardDetail.cardId,
      cardNo: cardDetail.cardNo,
      cardCurrency: cardDetail.cardCurrency,
      action: 'withdraw'
      // No need to pass faCode anymore as verification is completed
    }
  })
}

const executeDetailsAction = async (cardDetailData: CardDetailResponse) => {
  console.log('Displaying card details:', cardDetailData)

  // Directly use cached card details to show detail dialog
  showDetailDialog.value = true
  cardDetail.value = cardDetailData
}

const executeDeleteAction = async (cardDetail: CardDetailResponse) => {
  console.log('Executing delete operation, card details:', cardDetail)

  // Navigate to WithdrawOrder with delete action
  router.push({
    name: 'WithdrawOrder',
    query: {
      cardId: cardDetail.cardId,
      cardNo: cardDetail.cardNo,
      cardCurrency: cardDetail.cardCurrency,
      action: 'delete'
      // No need to pass faCode anymore as verification is completed
    }
  })
}


// Card transition animation state
const transitionDirection = ref<'next' | 'prev'>('next')
const cardTransitionName = computed(() =>
  transitionDirection.value === 'next' ? 'card-slide-left' : 'card-slide-right'
)

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
      const pageInfo = response.model.page

      // Replace data on each call to achieve true pagination
      transactions.value = newTransactions
      pagination.value.transaction.pageIndex = pageIndex

      // Update mobile pagination
      updateMobilePagination('transaction', transactions.value)

      // Check if there are more pages based on page info
      pagination.value.transaction.hasMore = pageInfo ? pageInfo.number < pageInfo.totalPages - 1 : false
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as any)?.message || 'Failed to load transaction history',
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
      const pageInfo = response.model.page

      // Replace data on each call to achieve true pagination
      rechargeOrders.value = newOrders
      pagination.value.recharge.pageNo = pageNo

      // Update mobile pagination
      updateMobilePagination('recharge', rechargeOrders.value)

      // Check if there are more pages based on page info
      pagination.value.recharge.hasMore = pageInfo ? pageInfo.number < pageInfo.totalPages - 1 : false
    }
  } catch (error) {
    console.error('Error fetching recharge orders:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as any)?.message || 'Failed to load recharge history',
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
      const pageInfo = response.model.page

      // Replace data on each call to achieve true pagination
      withdrawOrders.value = newOrders
      pagination.value.withdraw.pageNo = pageNo

      // Update mobile pagination
      updateMobilePagination('withdraw', withdrawOrders.value)

      // Check if there are more pages based on page info
      pagination.value.withdraw.hasMore = pageInfo ? pageInfo.number < pageInfo.totalPages - 1 : false
    }
  } catch (error) {
    console.error('Error fetching withdraw orders:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as any)?.message || 'Failed to load withdraw history',
      life: 3000
    })
  } finally {
    loading.value.withdraw = false
  }
}


// Copy to clipboard using vueuse
const { copy: copyToClipboard } = useClipboard()

// Balance related functions
const formatBalance = (balance: number) => {
  return balance.toFixed(2)
}


// Card navigation
const previousCard = () => {
  if (currentCardIndex.value > 0) {
    transitionDirection.value = 'prev'
    currentCardIndex.value--
  }
}

const nextCard = () => {
  if (currentCardIndex.value < cards.value.length - 1) {
    transitionDirection.value = 'next'
    currentCardIndex.value++
  }
}

// Select card
const selectCard = (index: number) => {
  if (index === currentCardIndex.value) {
    return
  }

  transitionDirection.value = index > currentCardIndex.value ? 'next' : 'prev'
  currentCardIndex.value = index
}

// Navigation functions
const goToApplyCard = () => {
  router.push('/apply-card')
}

const goToWithdraw = async () => {
  console.log('goToWithdraw called')

  if (!selectedCard.value?.id) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select a card first',
      life: 3000
    })
    return
  }

  // Require Google Auth binding
  if (!isGoogleAuthBound.value) {
    toast.add({
      severity: 'warn',
      summary: 'Security Verification',
      detail: 'Please bind Google Authenticator in Personal Center first',
      life: 3000
    })
    router.push({ name: 'PersonalCenter' })
    return
  }

  // Set pending action and show Google Auth dialog
  console.log('Setting pending action to withdraw and showing dialog')
  pendingAction.value = 'withdraw'
  showGoogleAuthDialog.value = true
  console.log('showGoogleAuthDialog.value:', showGoogleAuthDialog.value)
}

const handleCardDetailError = (message: string) => {
  detailError.value = message
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: message,
    life: 3000
  })
}

const loadCardDetail = async (cardId: string, faCode: string = '') => {
  detailLoading.value = true
  detailError.value = null
  cardDetail.value = null

  try {
    // If no verification code, try to get current card details from cache first
    if (!faCode) {
      const cachedDetail = cardStore.getCachedCurrentCardDetail()
      if (cachedDetail) {
        console.log('Getting current card details from cache:', cachedDetail)
        cardDetail.value = cachedDetail
        detailLoading.value = false
        return
      }
    }

    // If not in cache or verification code needed, call API
    const response = await CardAPI.queryCardDetail({ cardId, faCode })
    if (response.success && response.model) {
      if (!showDetailDialog.value) {
        return
      }

      // Cache current card details
      cardStore.cacheCurrentCardDetail(response.model)
      cardDetail.value = response.model
    } else {
      // Throw error for upper level handling
      throw new Error(response.msg || 'Failed to load card details')
    }
  } catch (error) {
    const message = (error as any)?.message || 'Failed to load card details'
    handleCardDetailError(message)
    // Re-throw error for upper level handling
    throw error
  } finally {
    detailLoading.value = false
  }
}

const goToDetails = async () => {
  console.log('goToDetails called')

  if (!selectedCard.value?.id) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select a card first',
      life: 3000
    })
    return
  }

  // Require Google Auth binding
  if (!isGoogleAuthBound.value) {
    toast.add({
      severity: 'warn',
      summary: 'Security Verification',
      detail: 'Please bind Google Authenticator in Personal Center first',
      life: 3000
    })
    router.push({ name: 'PersonalCenter' })
    return
  }

  // Set pending action and show Google Auth dialog
  console.log('Setting pending action to details and showing dialog')
  pendingAction.value = 'details'
  showGoogleAuthDialog.value = true
  console.log('showGoogleAuthDialog.value:', showGoogleAuthDialog.value)
}

const goToDeleteCard = async () => {
  console.log('goToDeleteCard called')

  if (!selectedCard.value?.id) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select a card first',
      life: 3000
    })
    return
  }

  // Require Google Auth binding
  if (!isGoogleAuthBound.value) {
    toast.add({
      severity: 'warn',
      summary: 'Security Verification',
      detail: 'Please bind Google Authenticator in Personal Center first',
      life: 3000
    })
    router.push({ name: 'PersonalCenter' })
    return
  }

  // Set pending action and show Google Auth dialog
  console.log('Setting pending action to delete and showing dialog')
  pendingAction.value = 'delete'
  showGoogleAuthDialog.value = true
  console.log('showGoogleAuthDialog.value:', showGoogleAuthDialog.value)
}

const retryCardDetail = async () => {
  if (!selectedCard.value?.id) {
    return
  }

  await loadCardDetail(selectedCard.value.id, '')
}

watch(showDetailDialog, visible => {
  if (!visible) {
    detailLoading.value = false
    detailError.value = null
    cardDetail.value = null
  }
})

watch(
  () => selectedCard.value?.id,
  newId => {
    if (showDetailDialog.value && newId) {
      loadCardDetail(newId, '')
    }
  }
)

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
    cardCurrency: selectedCard.value?.cardCurrency || 'USD',
    cardNo: selectedCard.value?.cardNo || '',
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

// Navigate to payment result page
const goToPaymentResult = (order: DepositOrderListItem) => {
  const statusUpper = (order.status || '').toString().toUpperCase()

  if (statusUpper === 'INIT') {
    // 订单待支付，跳转到加密支付页
    router.push({
      name: 'CryptoPayment',
      query: {
        orderNum: order.num,
        amount: order.amount?.toString?.() || '0',
        currency: (order as any).token || '',
        network: (order as any).network || '',
        cryptoAmount: (order as any).usdAmount?.toString?.() || '',
        from: 'myCards'
      }
    })
    return
  }

  // 其他状态走结果页
  router.push({
    name: 'PaymentResult',
    query: {
      orderNum: order.num,
      status: order.status, // 使用订单实际状态
      amount: order.amount.toString(),
      currency: order.token,
      network: order.network,
      cryptoAmount: order.usdAmount.toString(),
      paymentMethod: 'Crypto Payment',
      type: 'deposit', // 入金订单
      from: 'myCards' // 标识来源
    }
  })
}

// Navigate to withdraw result page
const goToWithdrawResult = (order: WithdrawOrderListItem) => {
  router.push({
    name: 'PaymentResult',
    query: {
      orderNum: order.num,
      status: order.status, // 使用订单实际状态
      amount: order.usdAmount?.toString() || '0',
      type: 'withdraw', // 出金订单
      from: 'myCards' // 标识来源
    }
  })
}


// Data formatters
const formatCardNumber = (cardNo?: string) => {
  if (!cardNo) return 'N/A'
  const digits = cardNo.replace(/\D/g, '')
  if (!digits) return 'N/A'
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

const isAddressUpdatable = (value?: string | null) => {
  if (!value) {
    return false
  }
  const normalized = value.toString().trim().toLowerCase()
  return normalized === 'y' || normalized === 'true' || normalized === '1'
}

const cardLastFour = (cardNo?: string) => {
  if (!cardNo) return 'N/A'
  const digits = cardNo.replace(/\D/g, '')
  if (!digits) return 'N/A'
  return digits.length <= 4 ? digits : digits.slice(-4)
}

const formatTransactionAmount = (amount: number, currency: string) => {
  return `${amount.toFixed(2)} ${currency}`
}

const formatOrderAmount = (amount: number, currency: string) => {
  return `${amount.toFixed(2)} ${currency}`
}

const formatWithdrawAmount = (usdAmount: number | null, orderCurrency: string | null) => {
  if (usdAmount === null || orderCurrency === null) return 'N/A'
  return `${usdAmount.toFixed(2)} ${orderCurrency} `
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

// Status color helper
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'succeed':
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

const startDrag = (position: number) => {
  isDragging.value = true
  startX.value = position
  currentX.value = position
}

const updateDrag = (position: number) => {
  if (!isDragging.value) return
  currentX.value = position
}

const endDrag = () => {
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

// Drag and drop handlers
const handleMouseDown = (event: MouseEvent) => {
  startDrag(event.clientX)

  // Prevent text selection
  event.preventDefault()
}

const handleMouseMove = (event: MouseEvent) => {
  updateDrag(event.clientX)

  if (isDragging.value) {
    event.preventDefault()
  }
}

const handleMouseUp = () => {
  endDrag()
}

const handleTouchStart = (event: TouchEvent) => {
  if (event.touches.length === 0) return
  startDrag(event.touches[0].clientX)
}

const handleTouchMove = (event: TouchEvent) => {
  if (event.touches.length === 0) return
  updateDrag(event.touches[0].clientX)

  if (isDragging.value && event.cancelable) {
    event.preventDefault()
  }
}

const handleTouchEnd = () => {
  endDrag()
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

// Start polling for transaction list
const startTransactionPolling = () => {
  // Clear existing interval if any
  stopTransactionPolling()

  // Start polling every 1 minute (60000ms)
  transactionPollingInterval = setInterval(() => {
    if (!isComponentMounted.value || activeTab.value !== 'transaction') {
      return
    }

    // Silently refresh transactions without showing loading state
    const currentPageIndex = pagination.value.transaction.pageIndex
    fetchTransactions(currentPageIndex)
  }, 60000) // 1 minute

  console.log('Transaction polling started')
}

// Stop polling for transaction list
const stopTransactionPolling = () => {
  if (transactionPollingInterval) {
    clearInterval(transactionPollingInterval)
    transactionPollingInterval = null
    console.log('Transaction polling stopped')
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

    // Restart polling
    startTransactionPolling()
  }

})

// Watch for tab changes to control polling
watch(activeTab, (newTab) => {
  if (newTab === 'transaction' && cards.value.length > 0) {
    // Start polling when switching to transaction tab
    startTransactionPolling()
  } else {
    // Stop polling when switching away from transaction tab
    stopTransactionPolling()
  }
})

// Get card list when component mounts
onMounted(async () => {
  console.log('MyCards component mounted')
  isComponentMounted.value = true

  // Always fetch fresh card list data on page entry
  console.log('Fetching fresh card list...')
  try {
    await cardStore.fetchCardList()
    console.log('Card list fetched, length:', cardStore.cardList.length)
  } catch (error) {
    console.error('Error fetching card list:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as any)?.message || 'Failed to load card list',
      life: 3000
    })
  }

  // Load initial data
  console.log('Cards computed length:', cards.value.length)
  if (cards.value.length > 0) {
    console.log('Loading initial transactions...')
    await fetchTransactions()

    // Start polling if on transaction tab
    if (activeTab.value === 'transaction') {
      startTransactionPolling()
    }
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

// Watch for route changes to handle card selection
watch(() => route.query.cardNo, async (newCardNo, oldCardNo) => {
  console.log('Route cardNo changed from', oldCardNo, 'to', newCardNo)
  if (newCardNo && cards.value.length > 0) {
    const targetCardIndex = cards.value.findIndex(card => card.cardNo === newCardNo)
    if (targetCardIndex !== -1) {
      console.log('Selecting card based on query parameter:', newCardNo, 'at index:', targetCardIndex)
      currentCardIndex.value = targetCardIndex
      // Clear the query parameter to avoid selecting the same card on refresh
      router.replace({ name: 'MyCards' })
    } else {
      console.warn('Card not found with cardNo:', newCardNo)
      // Clear the invalid query parameter
      router.replace({ name: 'MyCards' })
    }
  }
}, { immediate: true })

// Cleanup when component unmounts
onUnmounted(() => {
  console.log('MyCards component unmounted')
  isComponentMounted.value = false
  stopTransactionPolling()
})
</script>

<style scoped>
/* Card carousel styles */
.transition-transform {
  transition: transform 0.3s ease-in-out;
}

.card-slide-left-enter-active,
.card-slide-left-leave-active,
.card-slide-right-enter-active,
.card-slide-right-leave-active {
  transition: all 0.35s ease;
}

.card-slide-left-enter-from,
.card-slide-right-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.card-slide-left-leave-to,
.card-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
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

  .card-slide-left-enter-active,
  .card-slide-left-leave-active,
  .card-slide-right-enter-active,
  .card-slide-right-leave-active {
    transition: none;
  }
}

/* Dialog styles moved into CardDetailDialog.vue */
</style>
