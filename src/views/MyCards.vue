<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Header -->
    <AppHeader title="Virtual Cards" :show-title="true" />

    <!-- Main Content -->
    <div
      class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <!-- Virtual Card Display -->
      <div class="mb-8">
        <!-- Empty State -->
        <div v-if="cards.length === 0" class="text-center py-12">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div
              class="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <i class="pi pi-credit-card text-gray-400 dark:text-gray-500 text-3xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">暂无虚拟卡片</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">您还没有申请任何虚拟卡片，点击下方按钮开始申请您的第一张卡片</p>
            <button @click="goToApplyCard"
              class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              <i class="pi pi-plus mr-2"></i>
              申请虚拟卡片
            </button>
          </div>
        </div>

        <!-- Cards Display -->
        <div v-else>
          <!-- Mobile: Card Carousel (上下布局) -->
          <div class="md:hidden">
            <div class="relative">
              <div class="overflow-hidden">
                <div class="flex transition-transform duration-300"
                  :style="{ transform: `translateX(-${currentCardIndex * 100}%)` }">
                  <div v-for="(card, index) in cards" :key="index" class="w-full flex-shrink-0 px-2">
                    <div class="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 text-white shadow-lg">
                      <!-- Card Header -->
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-semibold opacity-75">BUI LINK PAY</span>
                        <button v-if="cardDetail" @click="toggleCardDetailsVisibility"
                          class="text-white/80 hover:text-white transition-colors">
                          <i :class="showCardDetails ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
                        </button>
                      </div>

                      <!-- Card Details -->
                      <div v-if="cardDetail" class="space-y-2 mb-4 text-sm">
                        <!-- Full Card Number -->
                        <div class="text-base font-mono tracking-wider">
                          {{ showCardDetails ? cardDetail.cardNo : '•••• •••• •••• ••••' }}
                        </div>

                        <!-- CVV and Expiry -->
                        <div class="flex justify-between items-center">
                          <span class="font-mono">
                            {{ showCardDetails ? cardDetail.cvv : '•••' }}
                          </span>
                          <span>{{ cardDetail.expirationDate }}</span>
                        </div>

                        <!-- Cardholder Name -->
                        <div class="text-sm">
                          {{ cardDetail.firstName }} {{ cardDetail.lastName }}
                        </div>

                        <!-- Currency -->
                        <div class="text-xs opacity-75">
                          {{ cardDetail.cardCurrency }}
                        </div>
                      </div>

                      <!-- Card Footer -->
                      <div class="flex items-center justify-between">
                        <div class="text-sm opacity-80">{{ cardDetail ? `${cardDetail.firstName} ${cardDetail.lastName}`
                          : 'Card Holder' }}</div>
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

            <!-- Mobile Card Limits -->
            <div v-if="selectedCard"
              class="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">交易限额</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">日交易限额</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">${{ selectedCard.maxOnDaily }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">月交易限额</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">${{ selectedCard.maxOnMonthly
                  }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">单笔限额</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">${{ selectedCard.maxOnPercent
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop: Card and Details Side by Side (左右布局) -->
          <div class="hidden md:block">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <!-- Left Side: Card Display -->
              <div class="space-y-6">
                <!-- Card Display Area -->
                <div class="relative">
                  <div
                    class="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-8 text-white shadow-lg min-h-[240px] flex flex-col justify-between">
                    <!-- Card Header -->
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-semibold opacity-75">BUI LINK PAY</span>
                      <button v-if="cardDetail" @click="toggleCardDetailsVisibility"
                        class="text-white/80 hover:text-white transition-colors">
                        <i :class="showCardDetails ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
                      </button>
                    </div>

                    <!-- Card Details -->
                    <div v-if="cardDetail" class="space-y-2 mb-4 text-sm">
                      <!-- Full Card Number -->
                      <div class="text-lg font-mono tracking-wider">
                        {{ showCardDetails ? cardDetail.cardNo : '•••• •••• •••• ••••' }}
                      </div>

                      <!-- CVV and Expiry -->
                      <div class="flex justify-between items-center">
                        <span class="font-mono">
                          {{ showCardDetails ? cardDetail.cvv : '•••' }}
                        </span>
                        <span>{{ cardDetail.expirationDate }}</span>
                      </div>
                      <!-- Currency -->
                      <div class="text-xs opacity-75">
                        {{ cardDetail.cardCurrency }}
                      </div>
                    </div>
                    <!-- Card Footer -->
                    <div class="flex items-center justify-between">
                      <div class="text-base opacity-80">{{ cardDetail ? `${cardDetail.firstName} ${cardDetail.lastName}`
                        : 'Card Holder' }}</div>
                      <div class="w-16 h-10 bg-white rounded flex items-center justify-center">
                        <i class="pi pi-credit-card text-gray-600 text-xl"></i>
                      </div>
                    </div>
                  </div>

                  <!-- Navigation Arrows -->
                  <button @click="previousCard" :disabled="currentCardIndex === 0"
                    class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="pi pi-chevron-left text-white"></i>
                  </button>
                  <button @click="nextCard" :disabled="currentCardIndex === cards.length - 1"
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="pi pi-chevron-right text-white"></i>
                  </button>
                </div>

                <!-- Card Indicators -->
                <div class="flex justify-center space-x-2">
                  <button v-for="(card, index) in cards" :key="index" @click="selectCard(index)"
                    class="w-3 h-3 rounded-full transition-colors"
                    :class="index === currentCardIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'">
                  </button>
                </div>
              </div>

              <!-- Right Side: Card Limits & Actions -->
              <div class="space-y-6">
                <!-- Card Limits Panel -->
                <div v-if="selectedCard"
                  class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">交易限额</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">日交易限额</span>
                      <span class="text-lg font-semibold text-gray-900 dark:text-white">${{ selectedCard.maxOnDaily
                      }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">月交易限额</span>
                      <span class="text-lg font-semibold text-gray-900 dark:text-white">${{ selectedCard.maxOnMonthly
                      }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">单笔限额</span>
                      <span class="text-lg font-semibold text-gray-900 dark:text-white">${{ selectedCard.maxOnPercent
                      }}</span>
                    </div>
                  </div>
                </div>
                <!-- Loading State -->
                <div v-if="loadingCardDetail"
                  class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-center space-x-3">
                    <i class="pi pi-spin pi-spinner text-blue-600 dark:text-blue-400"></i>
                    <span class="text-gray-600 dark:text-gray-400">加载卡片详情中...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div v-if="cards.length > 0"
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6 mb-8 w-full max-w-4xl mx-auto">
        <button @click="goToRecharge"
          class="flex flex-col items-center space-y-2 lg:space-y-3 p-4 lg:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div
            class="w-12 h-12 lg:w-14 lg:h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <i class="pi pi-arrow-up text-blue-600 dark:text-blue-400 text-lg lg:text-xl"></i>
          </div>
          <span class="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300">Recharge</span>
        </button>

        <button
          class="flex flex-col items-center space-y-2 lg:space-y-3 p-4 lg:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div
            class="w-12 h-12 lg:w-14 lg:h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <i class="pi pi-arrow-down text-green-600 dark:text-green-400 text-lg lg:text-xl"></i>
          </div>
          <span class="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300">Withdraw</span>
        </button>

        <button
          class="flex flex-col items-center space-y-2 lg:space-y-3 p-4 lg:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div
            class="w-12 h-12 lg:w-14 lg:h-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <i class="pi pi-list text-purple-600 dark:text-purple-400 text-lg lg:text-xl"></i>
          </div>
          <span class="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300">Details</span>
        </button>

        <button
          class="flex flex-col items-center space-y-2 lg:space-y-3 p-4 lg:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div
            class="w-12 h-12 lg:w-14 lg:h-14 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <i class="pi pi-qrcode text-orange-600 dark:text-orange-400 text-lg lg:text-xl"></i>
          </div>
          <span class="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300">Scan</span>
        </button>
      </div>

      <!-- Transaction History Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm w-full max-w-4xl mx-auto">
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
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">暂无卡片</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              <span v-if="activeTab === 'transaction'">请先申请虚拟卡片以查看交易记录</span>
              <span v-else-if="activeTab === 'recharge'">请先申请虚拟卡片以查看入金订单</span>
              <span v-else-if="activeTab === 'withdraw'">请先申请虚拟卡片以查看出金订单</span>
              <span v-else>请先申请虚拟卡片以查看相关信息</span>
            </p>
            <button @click="goToApplyCard"
              class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              <i class="pi pi-plus mr-2"></i>
              申请卡片
            </button>
          </div>

          <!-- Transaction Tab -->
          <div v-else-if="activeTab === 'transaction'" class="space-y-4">
            <!-- Loading State -->
            <div v-if="loading.transaction" class="flex justify-center py-8">
              <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
            </div>

            <!-- Desktop: List Layout -->
            <div v-else-if="transactions.length > 0 && !isMobile" class="space-y-4">
              <div v-for="(transaction, index) in transactions" :key="index"
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
                    {{ formatTransactionAmount(transaction.transactionAmount, transaction.transactionCurrency) }}
                  </div>
                  <div class="text-sm lg:text-base" :class="getStatusColor(transaction.status)">
                    {{ transaction.status }}
                  </div>
                </div>
              </div>

              <!-- Load More Button -->
              <div v-if="pagination.transaction.hasMore && !loading.transaction" class="mt-6 text-center">
                <button @click="loadMoreTransactions"
                  class="text-blue-600 dark:text-blue-400 text-base lg:text-lg font-medium hover:underline px-6 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Load More
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
                            {{ formatTransactionAmount(transaction.transactionAmount, transaction.transactionCurrency)
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
              <div v-if="mobilePagination.transaction.totalPages > 1" class="flex items-center justify-between">
                <button @click="prevMobilePage('transaction')"
                  :disabled="mobilePagination.transaction.currentPage === 0"
                  class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  <i class="pi pi-chevron-left text-sm"></i>
                  <span class="text-sm">Previous</span>
                </button>

                <div class="flex space-x-2">
                  <div v-for="i in mobilePagination.transaction.totalPages" :key="i" class="w-2 h-2 rounded-full"
                    :class="i - 1 === mobilePagination.transaction.currentPage ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'">
                  </div>
                </div>

                <button @click="nextMobilePage('transaction')"
                  :disabled="mobilePagination.transaction.currentPage === mobilePagination.transaction.totalPages - 1"
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

            <!-- Desktop: List Layout -->
            <div v-else-if="rechargeOrders.length > 0 && !isMobile" class="space-y-4">
              <div v-for="(order, index) in rechargeOrders" :key="index"
                class="flex items-center space-x-4 p-4 lg:p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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

              <!-- Load More Button -->
              <div v-if="pagination.recharge.hasMore && !loading.recharge" class="mt-6 text-center">
                <button @click="loadMoreRecharge"
                  class="text-blue-600 dark:text-blue-400 text-base lg:text-lg font-medium hover:underline px-6 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Load More
                </button>
              </div>
            </div>

            <!-- Mobile: Swipe Pagination -->
            <div v-else-if="rechargeOrders.length > 0 && isMobile" class="space-y-4">
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
              <div v-if="mobilePagination.recharge.totalPages > 1" class="flex items-center justify-between">
                <button @click="prevMobilePage('recharge')" :disabled="mobilePagination.recharge.currentPage === 0"
                  class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  <i class="pi pi-chevron-left text-sm"></i>
                  <span class="text-sm">Previous</span>
                </button>

                <div class="flex space-x-2">
                  <div v-for="i in mobilePagination.recharge.totalPages" :key="i" class="w-2 h-2 rounded-full"
                    :class="i - 1 === mobilePagination.recharge.currentPage ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'">
                  </div>
                </div>

                <button @click="nextMobilePage('recharge')"
                  :disabled="mobilePagination.recharge.currentPage === mobilePagination.recharge.totalPages - 1"
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

            <!-- Desktop: List Layout -->
            <div v-else-if="withdrawOrders.length > 0 && !isMobile" class="space-y-4">
              <div v-for="(order, index) in withdrawOrders" :key="index"
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

              <!-- Load More Button -->
              <div v-if="pagination.withdraw.hasMore && !loading.withdraw" class="mt-6 text-center">
                <button @click="loadMoreWithdraw"
                  class="text-blue-600 dark:text-blue-400 text-base lg:text-lg font-medium hover:underline px-6 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Load More
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
              <div v-if="mobilePagination.withdraw.totalPages > 1" class="flex items-center justify-between">
                <button @click="prevMobilePage('withdraw')" :disabled="mobilePagination.withdraw.currentPage === 0"
                  class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  <i class="pi pi-chevron-left text-sm"></i>
                  <span class="text-sm">Previous</span>
                </button>

                <div class="flex space-x-2">
                  <div v-for="i in mobilePagination.withdraw.totalPages" :key="i" class="w-2 h-2 rounded-full"
                    :class="i - 1 === mobilePagination.withdraw.currentPage ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'">
                  </div>
                </div>

                <button @click="nextMobilePage('withdraw')"
                  :disabled="mobilePagination.withdraw.currentPage === mobilePagination.withdraw.totalPages - 1"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCardStore } from '@/stores/card'
import { useToast } from 'primevue/usetoast'
import AppHeader from '@/components/AppHeader.vue'
import { OrderAPI, type TransactionListItem, type DepositOrderListItem, type WithdrawOrderListItem, type WithdrawOrderPageResponse } from '@/api/order'
import { CardAPI, type CardDetailResponse } from '@/api/card'

const router = useRouter()
const route = useRoute()
const cardStore = useCardStore()
const toast = useToast()

// Card data
const currentCardIndex = ref(0)

// 使用真实的卡片列表数据
const cards = computed(() => {
  return cardStore.cardList.map((card, index) => ({
    id: card.cardId,
    maskedNumber: card.cardNo,
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
  transaction: { pageIndex: 0, pageSize: 10, hasMore: true },
  recharge: { pageNo: 0, pageSize: 10, hasMore: true },
  withdraw: { pageNo: 0, pageSize: 10, hasMore: true }
})

// Data arrays
const transactions = ref<TransactionListItem[]>([])
const rechargeOrders = ref<DepositOrderListItem[]>([])
const withdrawOrders = ref<WithdrawOrderListItem[]>([])

// Current selected card
const selectedCard = computed(() => {
  return cards.value[currentCardIndex.value] || cards.value[0]
})

// 卡片详情
const cardDetail = ref<CardDetailResponse | null>(null)
const loadingCardDetail = ref(false)
const showCardDetails = ref(false)

// Mobile swipe pagination states
const mobilePagination = ref({
  transaction: { currentPage: 0, totalPages: 0, itemsPerPage: 5 },
  recharge: { currentPage: 0, totalPages: 0, itemsPerPage: 5 },
  withdraw: { currentPage: 0, totalPages: 0, itemsPerPage: 5 }
})

// Mobile swipe data
const mobileTransactionPages = ref<TransactionListItem[][]>([])
const mobileRechargePages = ref<DepositOrderListItem[][]>([])
const mobileWithdrawPages = ref<WithdrawOrderListItem[][]>([])

// Check if mobile device
const isMobile = computed(() => {
  return window.innerWidth < 768
})

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
const fetchTransactions = async (loadMore = false) => {
  if (!selectedCard.value?.id) {
    console.log('No selected card ID available:', selectedCard.value)
    console.log('Cards available:', cards.value)
    return
  }

  try {
    loading.value.transaction = true
    console.log('Fetching transactions for card:', selectedCard.value.id)

    const pageIndex = loadMore ? pagination.value.transaction.pageIndex + 1 : 0
    const response = await OrderAPI.getTransactionList({
      pageIndex: pageIndex.toString(),
      pageSize: pagination.value.transaction.pageSize.toString(),
      cardId: selectedCard.value.id
    })

    if (response.success && response.model) {
      const newTransactions = response.model.content || []

      if (loadMore) {
        transactions.value.push(...newTransactions)
        pagination.value.transaction.pageIndex = pageIndex
      } else {
        transactions.value = newTransactions
        pagination.value.transaction.pageIndex = 0
      }

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

const fetchRechargeOrders = async (loadMore = false) => {
  try {
    loading.value.recharge = true

    const pageNo = loadMore ? pagination.value.recharge.pageNo + 1 : 0
    const response = await OrderAPI.getDepositOrderPage({
      pageNo,
      pageSize: pagination.value.recharge.pageSize
    })

    if (response.success && response.model) {
      const newOrders = response.model.content || []

      if (loadMore) {
        rechargeOrders.value.push(...newOrders)
        pagination.value.recharge.pageNo = pageNo
      } else {
        rechargeOrders.value = newOrders
        pagination.value.recharge.pageNo = 0
      }

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

const fetchWithdrawOrders = async (loadMore = false) => {
  try {
    loading.value.withdraw = true

    const pageNo = loadMore ? pagination.value.withdraw.pageNo + 1 : 0
    const response = await OrderAPI.getWithdrawOrderPage({
      pageNo,
      pageSize: pagination.value.withdraw.pageSize
    })

    if (response.success && response.model) {
      const newOrders = response.model.content || []

      if (loadMore) {
        withdrawOrders.value.push(...newOrders)
        pagination.value.withdraw.pageNo = pageNo
      } else {
        withdrawOrders.value = newOrders
        pagination.value.withdraw.pageNo = 0
      }

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

// 获取卡片详情
const fetchCardDetail = async (cardId: string) => {
  if (!cardId) return

  try {
    loadingCardDetail.value = true
    const response = await CardAPI.queryCardDetail(
      { cardId },
      cardStore.getRequestHeaders()
    )

    if (response.success && response.model) {
      cardDetail.value = response.model
    }
  } catch (error) {
    console.error('Failed to fetch card detail:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load card details',
      life: 3000
    })
  } finally {
    loadingCardDetail.value = false
  }
}

// 切换卡片详情显示/隐藏
const toggleCardDetailsVisibility = () => {
  showCardDetails.value = !showCardDetails.value
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.add({
      severity: 'success',
      summary: 'Copied',
      detail: '已复制到剪贴板',
      life: 2000
    })
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: '复制失败',
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

// 选择卡片
const selectCard = (index: number) => {
  currentCardIndex.value = index
}

// Navigation functions
const goToApplyCard = () => {
  router.push('/apply-card')
}

const goToRecharge = () => {
  if (!selectedCard.value?.id) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: '请先选择一张卡片',
      life: 3000
    })
    return
  }

  // 为充值操作设置卡片信息到 Pinia store
  // 创建一个包含 cardId 的 CardBin 对象用于充值
  const rechargeCardBin = {
    cardBin: '-',
    cardType: '-',
    cardScheme: '-', // 默认卡种
    cardCurrency: cardDetail.value?.cardCurrency || 'USD', // 默认币种
    billingAddressUpdatable: 'false',
    expiryDateCustomization: 'false',
    remainingAvailableCard: 0,
    availableCard: 0,
    cardFormFactor: 'virtual_card',
    cardId: cardDetail.value?.cardId || '' // 添加 cardId 用于充值
  }

  // 设置到 Pinia store
  cardStore.setSelectedCardBin(rechargeCardBin)
  cardStore.setSelectedCardConfig(null) // 充值不需要卡片配置

  // 跳转到 card-holder-info 页面
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

// Load more functions
const loadMoreTransactions = () => {
  if (pagination.value.transaction.hasMore && !loading.value.transaction) {
    fetchTransactions(true)
  }
}

const loadMoreRecharge = () => {
  if (pagination.value.recharge.hasMore && !loading.value.recharge) {
    fetchRechargeOrders(true)
  }
}

const loadMoreWithdraw = () => {
  if (pagination.value.withdraw.hasMore && !loading.value.withdraw) {
    fetchWithdrawOrders(true)
  }
}

// Tab change handler
const handleTabChange = (tabKey: string) => {
  console.log('Tab changed to:', tabKey)
  activeTab.value = tabKey

  // Load data for the selected tab
  switch (tabKey) {
    case 'transaction':
      // Always fetch transactions when switching to transaction tab
      console.log('Switching to transaction tab, fetching transactions...')
      fetchTransactions()
      break
    case 'recharge':
      if (rechargeOrders.value.length === 0) {
        fetchRechargeOrders()
      }
      break
    case 'withdraw':
      if (withdrawOrders.value.length === 0) {
        fetchWithdrawOrders()
      }
      break
  }
}

// Watch for card changes
watch(currentCardIndex, () => {
  // Reload transactions when card changes
  if (activeTab.value === 'transaction') {
    transactions.value = []
    pagination.value.transaction.pageIndex = 0
    fetchTransactions()
  }

  // Reset card details visibility and fetch new card detail when card changes
  showCardDetails.value = false
  if (selectedCard.value?.id) {
    fetchCardDetail(selectedCard.value.id)
  }
})

// 组件挂载时获取卡片列<
onMounted(async () => {
  console.log('MyCards component mounted')
  console.log('Initial card list length:', cardStore.cardList.length)

  // 如果卡片列表为空，则重新获取
  if (cardStore.cardList.length === 0) {
    console.log('Fetching card list...')
    await cardStore.fetchCardList()
    console.log('Card list fetched, length:', cardStore.cardList.length)
  }

  // 加载初始数据
  console.log('Cards computed length:', cards.value.length)
  if (cards.value.length > 0) {
    console.log('Loading initial transactions and card detail...')
    await fetchTransactions()
    if (selectedCard.value?.id) {
      await fetchCardDetail(selectedCard.value.id)
    }
  } else {
    console.log('No cards available, skipping transaction fetch')
  }

  // 检查是否有支付成功的查询参<
  if (route.query.success === 'true') {
    const message = route.query.message as string || 'Payment completed successfully'
    toast.add({
      severity: 'success',
      summary: 'Payment Success',
      detail: message,
      life: 5000
    })

    // 清除查询参数，避免刷新页面时重复显示
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
