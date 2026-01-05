<template>
  <div>
    <!-- Desktop Layout -->
    <div class="hidden md:block space-y-8">
      <!-- Withdrawal Form -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i class="pi pi-arrow-up text-blue-600 dark:text-blue-400 text-base"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Withdrawal Details</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Configure your withdrawal settings</p>
            </div>
          </div>
          <span class="inline-flex items-center text-xs font-medium uppercase tracking-wide text-blue-600">
            <span class="w-2 h-2 mr-2 rounded-full bg-blue-500 animate-pulse"></span>
            {{ cardInfo.cardCurrency }} available
          </span>
        </div>

        <div class="space-y-6">
          <!-- Withdraw Amount Section -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
            <div class="flex items-center space-x-2 mb-4">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Withdraw amount</label>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(totalWithdrawAmount) }}
                <span v-if="appliedRewardPoints > 0"
                  class="ml-2 text-base font-semibold text-orange-500 dark:text-orange-400">
                  (Use {{ appliedRewardPoints.toLocaleString() }} pts)
                </span>
              </div>
              <span class="text-gray-700 dark:text-gray-300 font-medium">{{ cardInfo.cardCurrency }}</span>
            </div>
          </div>

          <!-- Fiat Currency Selection -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
            <div class="flex items-center space-x-2 mb-4">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Fiat Currency</label>
            </div>
            <div class="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0">
              <Dropdown v-model="selectedFiatCurrency" :options="fiatCurrencyOptions" option-label="label" disabled
                option-value="value" placeholder="Select currency" class="w-full md:w-96" filter show-clear />
              <span class="text-sm text-gray-600 dark:text-gray-400">Select the currency you want to receive</span>
            </div>
          </div>

          <!-- Recipient Information Section -->
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Recipient Information
            </label>

            <!-- Loading State -->
            <div v-if="recipientLoading" class="flex items-center justify-center py-8">
              <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
              <span class="ml-2 text-gray-600 dark:text-gray-400">Loading recipient information...</span>
            </div>

            <!-- Recipient Display (if exists) -->
            <div v-else-if="recipientInfo"
              class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-4">
                    <i class="pi pi-user text-blue-600 dark:text-blue-400"></i>
                    <h4 class="text-base font-semibold text-gray-900 dark:text-white">Saved Recipient</h4>
                  </div>
                  <div class="text-sm">
                    <div class="flex items-center space-x-2">
                      <span class="text-gray-600 dark:text-gray-400">Card Number:</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ recipientInfo.cardNumber || 'N/A'
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2 ml-4">
                  <Button label="Delete" icon="pi pi-trash" severity="danger" size="small"
                    @click="handleDeleteRecipient" />
                </div>
              </div>
            </div>

            <!-- Add Recipient Button (if empty and not loading) -->
            <div v-else-if="!recipientLoading && !recipientInfo"
              class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div class="flex flex-col items-center justify-center py-8">
                <i class="pi pi-user-plus text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">No recipient information found</p>
                <Button label="Add Recipient" icon="pi pi-plus" @click="showRecipientDialog = true" />
              </div>
            </div>
          </div>

          <!-- Receive Amount Section -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
            <div class="flex items-center space-x-2 mb-4">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Receive amount</label>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
              <span class="text-gray-600 dark:text-gray-400">Loading payment methods...</span>
            </div>

            <!-- Payment Methods Grid (Grouped by methodType) -->
            <div v-else class="space-y-4">
              <div v-for="group in paymentMethodGroups" :key="group.methodType"
                class="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                <!-- Group Header -->
                <div class="bg-gray-100 dark:bg-gray-700 px-5 py-3 flex items-center justify-between cursor-pointer"
                  @click="toggleGroup(group.methodType)">
                  <div class="flex items-center space-x-3">
                    <i class="pi pi-chevron-down text-gray-600 dark:text-gray-300 transition-transform duration-200"
                      :class="{ 'rotate-180': expandedGroups[group.methodType] }"></i>
                    <h4 class="text-base font-semibold text-gray-900 dark:text-white">
                      {{ formatMethodType(group.methodType) }}
                    </h4>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      ({{ group.fiatPaymentMethod?.length || 0 }})
                    </span>
                  </div>
                </div>
                <!-- Group Content -->
                <div v-show="expandedGroups[group.methodType]" class="p-4 space-y-3">
                  <div v-for="paymentMethod in group.fiatPaymentMethod" :key="paymentMethod.methodCode"
                    class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer transition-all duration-200"
                    :class="selectedPaymentMethod?.methodCode === paymentMethod.methodCode
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 shadow-md ring-2 ring-blue-100 dark:ring-blue-800/60'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-sm'"
                    @click="selectPaymentMethod(paymentMethod)">
                    <div class="flex flex-col gap-3">
                      <div class="flex items-center space-x-4">
                        <div
                          class="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-600">
                          <img v-if="paymentMethod.logoUrl" :src="paymentMethod.logoUrl" :alt="paymentMethod.methodName"
                            class="w-full h-full object-cover" />
                          <div v-else
                            class="w-full h-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center">
                            <span class="text-white font-bold">{{ paymentMethod.methodName.charAt(0) }}</span>
                          </div>
                        </div>
                        <div class="flex-1">
                          <div class="font-semibold text-gray-900 dark:text-white">{{ paymentMethod.methodName }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                            <div>
                              Limit: {{ formatCurrency(paymentMethod.minLimit) }} - {{
                                formatCurrency(paymentMethod.maxLimit)
                              }}
                            </div>
                            <div class="flex items-center space-x-3">
                              <span v-if="paymentMethod.fixedFee > 0">
                                Fixed Fee: {{ formatCurrency(paymentMethod.fixedFee) }}
                              </span>
                              <span v-if="paymentMethod.feeRatio > 0">
                                Fee Ratio: {{ (paymentMethod.feeRatio * 100).toFixed(2) }}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="selectedPaymentMethod?.methodCode === paymentMethod.methodCode"
                          class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <i class="pi pi-check text-white text-xs"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rate Error State -->
            <div v-if="rateError" class="mt-2 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
              <i class="pi pi-exclamation-triangle"></i>
              <span>{{ rateError }}</span>
            </div>
          </div>

          <!-- Exchange Rate Info -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex flex-col gap-1">
                <div class="flex flex-wrap items-center space-x-2">
                  <span class="text-sm text-gray-600 dark:text-gray-400">You will receive</span>
                  <span class="text-base font-bold text-gray-900 dark:text-white">{{ receiveAmount }}</span>
                  <span class="text-base font-bold text-gray-900 dark:text-white">{{ selectedFiatCurrency }}</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">from</span>
                  <span class="text-base font-bold text-gray-900 dark:text-white">{{
                    formatCurrency(withdrawAmount)
                  }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <i class="pi pi-clock"></i>
                <span>{{ countdown }}s</span>
              </div>
            </div>
            <div v-if="fiatRate?.target?.rate" class="text-xs text-gray-600 dark:text-gray-400 mb-2">
              1 {{ cardInfo.cardCurrency }} ≈ {{ fiatRate.target.rate }} {{ selectedFiatCurrency }}
            </div>
            <!-- Fee Details -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-700 dark:text-gray-300">Transaction Fee</span>
              <span class="text-gray-700 dark:text-gray-300">
                {{ formatCurrency(feeAmount) }} {{ fiatRate?.feeDetail?.currency || selectedFiatCurrency }}
              </span>
            </div>
          </div>

          <!-- Amount Limit Warning (Desktop) -->
          <div v-if="selectedPaymentMethod && !isReceiveAmountWithinLimit"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400 text-lg"></i>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">Receive Amount Out of Range
                </h4>
                <p class="text-sm text-red-700 dark:text-red-300">{{ receiveLimitErrorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Method Fields Section -->
          <div v-if="selectedPaymentMethod && selectedPaymentMethod.fields && selectedPaymentMethod.fields.length > 0"
            class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
            <div class="flex items-center space-x-2 mb-4">
              <i class="pi pi-cog text-blue-600 dark:text-blue-400"></i>
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">Payment Method Details</h4>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="field in selectedPaymentMethod.fields" :key="field.name">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <!-- Text Input -->
                <InputText v-if="field.type === 'text'" v-model="paymentMethodFields[field.name]"
                  :placeholder="field.placeholder" class="w-full"
                  :maxlength="field.maxLength ? parseInt(field.maxLength) : undefined"
                  :minlength="field.minLength ? parseInt(field.minLength) : undefined"
                  :class="{ 'p-invalid': paymentMethodFieldErrors[field.name] }" />
                <!-- Select Dropdown -->
                <Dropdown
                  v-else-if="field.type === 'select' && Array.isArray(field.options) && field.options.length > 0"
                  v-model="paymentMethodFields[field.name]" :options="field.options" :placeholder="field.placeholder"
                  class="w-full" filter show-clear :class="{ 'p-invalid': paymentMethodFieldErrors[field.name] }" />
                <!-- Fallback to InputText if type is unknown -->
                <InputText v-else v-model="paymentMethodFields[field.name]" :placeholder="field.placeholder"
                  :maxlength="field.maxLength ? parseInt(field.maxLength) : undefined"
                  :minlength="field.minLength ? parseInt(field.minLength) : undefined" class="w-full"
                  :class="{ 'p-invalid': paymentMethodFieldErrors[field.name] }" />
                <small v-if="paymentMethodFieldErrors[field.name]" class="text-red-500 text-xs mt-1">
                  {{ paymentMethodFieldErrors[field.name] }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-4">
        <Button label="Back" icon="pi pi-arrow-left" severity="secondary" class="flex-1" size="large" @click="goBack" />
        <Button label="Withdraw" icon="pi pi-send" class="flex-1" size="large" :disabled="!isFormValid"
          :loading="isSubmitting" @click="handleWithdraw" />
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="md:hidden space-y-4">
      <!-- Withdraw Amount -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2 mb-3">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Withdraw amount</label>
        </div>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ formatCurrency(totalWithdrawAmount) }}
            <span v-if="appliedRewardPoints > 0"
              class="ml-1 text-xs font-semibold text-orange-500 dark:text-orange-400">
              (Use {{ appliedRewardPoints.toLocaleString() }} pts)
            </span>
          </div>
          <span class="text-gray-700 dark:text-gray-300 font-medium">{{ cardInfo.cardCurrency }}</span>
        </div>
      </div>

      <!-- Fiat Currency Selection (Mobile) -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2 mb-3">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Fiat Currency</label>
        </div>
        <Dropdown v-model="selectedFiatCurrency" :options="fiatCurrencyOptions" option-label="label" disabled
          option-value="value" placeholder="Select currency" class="w-full" filter show-clear />
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">Select the currency you want to receive</p>
      </div>

      <!-- Recipient Information Section (Mobile) -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
          Recipient Information
        </label>

        <!-- Loading State -->
        <div v-if="recipientLoading" class="flex items-center justify-center py-8">
          <i class="pi pi-spin pi-spinner text-xl text-blue-600 dark:text-blue-400"></i>
          <span class="ml-2 text-xs text-gray-600 dark:text-gray-400">Loading...</span>
        </div>

        <!-- Recipient Display (if exists) -->
        <div v-else-if="recipientInfo"
          class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-3">
                <i class="pi pi-user text-blue-600 dark:text-blue-400 text-sm"></i>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Saved Recipient</h4>
              </div>
              <div class="text-xs">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-600 dark:text-gray-400">Card Number:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ recipientInfo.cardNumber || 'N/A' }}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-col space-y-2 ml-3">
              <Button label="Delete" icon="pi pi-trash" severity="danger" size="small" class="text-xs"
                @click="handleDeleteRecipient" />
            </div>
          </div>
        </div>

        <!-- Add Recipient Button (if empty and not loading) -->
        <div v-else-if="!recipientLoading && !recipientInfo"
          class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div class="flex flex-col items-center justify-center py-6">
            <i class="pi pi-user-plus text-3xl text-gray-400 dark:text-gray-500 mb-3"></i>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">No recipient information found</p>
            <Button label="Add Recipient" icon="pi pi-plus" size="small" @click="showRecipientDialog = true" />
          </div>
        </div>
      </div>

      <!-- Payment Methods Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i class="pi pi-credit-card text-blue-600 text-sm"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h3>
            </div>
          </div>
          <div v-if="selectedPaymentMethod" class="w-4 h-4 bg-blue-600 rounded-full"></div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
          <span class="ml-2 text-gray-600 dark:text-gray-400">Loading payment methods...</span>
        </div>

        <!-- Payment Methods Options (Grouped by methodType) -->
        <div v-else class="space-y-3">
          <div v-for="group in paymentMethodGroups" :key="group.methodType"
            class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <!-- Group Header -->
            <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2.5 flex items-center justify-between cursor-pointer"
              @click="toggleGroup(group.methodType)">
              <div class="flex items-center space-x-2">
                <i class="pi pi-chevron-down text-gray-600 dark:text-gray-300 text-xs transition-transform duration-200"
                  :class="{ 'rotate-180': expandedGroups[group.methodType] }"></i>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatMethodType(group.methodType) }}
                </h4>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  ({{ group.fiatPaymentMethod?.length || 0 }})
                </span>
              </div>
            </div>
            <!-- Group Content -->
            <div v-show="expandedGroups[group.methodType]" class="p-3 space-y-2">
              <div v-for="paymentMethod in group.fiatPaymentMethod" :key="paymentMethod.methodCode"
                class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 cursor-pointer transition-all duration-200"
                :class="selectedPaymentMethod?.methodCode === paymentMethod.methodCode ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 shadow-md' : 'hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm'"
                @click="selectPaymentMethod(paymentMethod)">

                <!-- Payment Method Header -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3 flex-1">
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-600">
                      <img v-if="paymentMethod.logoUrl" :src="paymentMethod.logoUrl" :alt="paymentMethod.methodName"
                        class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full bg-gray-400 flex items-center justify-center">
                        <span class="text-white font-bold text-sm">{{ paymentMethod.methodName.charAt(0) }}</span>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-gray-900 dark:text-white text-sm">{{ paymentMethod.methodName }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                        <div>
                          Limit: {{ formatCurrency(paymentMethod.minLimit) }} - {{
                            formatCurrency(paymentMethod.maxLimit)
                          }}
                        </div>
                        <div class="flex items-center space-x-2 flex-wrap">
                          <span v-if="paymentMethod.fixedFee > 0">
                            Fixed: {{ formatCurrency(paymentMethod.fixedFee) }}
                          </span>
                          <span v-if="paymentMethod.feeRatio > 0">
                            Rate: {{ (paymentMethod.feeRatio * 100).toFixed(2) }}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Selection Indicator -->
                  <div v-if="selectedPaymentMethod?.methodCode === paymentMethod.methodCode"
                    class="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                    <i class="pi pi-check text-white text-xs"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rate Error State -->
      <div v-if="rateError" class="mt-2 flex items-center space-x-2 text-xs text-red-600 dark:text-red-400">
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ rateError }}</span>
      </div>

      <!-- Exchange Rate Info (Mobile) -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <div class="flex items-center space-x-1">
              <span class="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">You will receive</span>
              <div class="flex">
                <span class="text-xs font-bold text-gray-900 dark:text-white">{{ receiveAmount }}</span>
                <span class="text-xs font-bold text-gray-900 dark:text-white">{{ selectedFiatCurrency }}</span>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">from</span>
              <span class="text-xs font-bold text-gray-900 dark:text-white">{{ formatCurrency(withdrawAmount)
              }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-1 text-xs text-gray-500">
            <i class="pi pi-clock"></i>
            <span>{{ countdown }}s</span>
          </div>
        </div>
        <div v-if="fiatRate?.target?.rate" class="text-xs text-gray-600 dark:text-gray-400 mt-2">
          1 {{ cardInfo.cardCurrency }} ≈ {{ fiatRate.target.rate }} {{ selectedFiatCurrency }}
        </div>
        <!-- Fee Details (Mobile) -->
        <div class="flex items-center justify-between text-xs mt-2">
          <span class="text-gray-600 dark:text-gray-400">Transaction Fee</span>
          <span class="text-gray-600 dark:text-gray-400">
            {{ formatCurrency(feeAmount) }} {{ fiatRate?.feeDetail?.currency || selectedFiatCurrency }}
          </span>
        </div>
      </div>

      <!-- Amount Limit Warning (Mobile) -->
      <div v-if="selectedPaymentMethod && !isReceiveAmountWithinLimit"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400"></i>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">Receive Amount Out of Range</h4>
            <p class="text-xs text-red-700 dark:text-red-300">{{ receiveLimitErrorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Payment Method Fields Section (Mobile) -->
      <div v-if="selectedPaymentMethod && selectedPaymentMethod.fields && selectedPaymentMethod.fields.length > 0"
        class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2 mb-3">
          <i class="pi pi-cog text-blue-600 dark:text-blue-400 text-sm"></i>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Payment Method Details</h4>
        </div>
        <div class="space-y-3">
          <div v-for="field in selectedPaymentMethod.fields" :key="field.name">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>
            <!-- Text Input -->
            <InputText v-if="field.type === 'text'" v-model="paymentMethodFields[field.name]"
              :placeholder="field.placeholder" class="w-full text-sm"
              :maxlength="field.maxLength ? parseInt(field.maxLength) : undefined"
              :minlength="field.minLength ? parseInt(field.minLength) : undefined"
              :class="{ 'p-invalid': paymentMethodFieldErrors[field.name] }" />
            <!-- Select Dropdown -->
            <Dropdown v-else-if="field.type === 'select' && Array.isArray(field.options) && field.options.length > 0"
              v-model="paymentMethodFields[field.name]" :options="field.options" :placeholder="field.placeholder"
              class="w-full text-sm" filter show-clear :class="{ 'p-invalid': paymentMethodFieldErrors[field.name] }" />
            <!-- Fallback to InputText if type is unknown -->
            <InputText v-else v-model="paymentMethodFields[field.name]" :placeholder="field.placeholder"
              :maxlength="field.maxLength ? parseInt(field.maxLength) : undefined"
              :minlength="field.minLength ? parseInt(field.minLength) : undefined" class="w-full text-sm"
              :class="{ 'p-invalid': paymentMethodFieldErrors[field.name] }" />
            <small v-if="paymentMethodFieldErrors[field.name]" class="text-red-500 text-xs mt-1">
              {{ paymentMethodFieldErrors[field.name] }}
            </small>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <Button label="Back" icon="pi pi-arrow-left" severity="secondary" class="flex-1" size="large" @click="goBack" />
        <Button label="Withdraw" icon="pi pi-send" class="flex-1" size="large" :disabled="!isFormValid"
          :loading="isSubmitting" @click="handleWithdraw" />
      </div>
    </div>
  </div>

  <!-- Recipient Form Dialog -->
  <RecipientFormDialog v-model:visible="showRecipientDialog" :bank-names="bankNames" @saved="handleRecipientSaved" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import { OrderAPI, type FiatPaymentMethodItem, type FiatRateModel, type FiatPaymentMethodsModel } from '@/api/order'
import { CardAPI, type QueryRecipientModel } from '@/api/card'
import { useCardStore } from '@/stores/card'
import { useUserStore } from '@/stores/user'
import RecipientFormDialog from './RecipientFormDialog.vue'

interface Props {
  cardInfo: {
    cardId: string
    cardNo: string
    cardCurrency: string
    maxOnDaily: number
    maxOnMonthly: number
    maxOnPercent: number
  }
  cardDetail: any
  balance: number
  withdrawAmount: number
  appliedRewardPoints: number
  isDeleteAction: boolean
}

const props = defineProps<Props>()

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const cardStore = useCardStore()
const userStore = useUserStore()

// Form submission state
const isSubmitting = ref(false)

// Payment methods from API (grouped by methodType)
const paymentMethodGroups = ref<FiatPaymentMethodsModel[]>([])
const loading = ref(false)
// Expanded groups state
const expandedGroups = ref<Record<string, boolean>>({})

// Selected payment method
const selectedPaymentMethod = ref<FiatPaymentMethodItem | null>(null)
// Fiat currency unit - for withdrawal, this is the target fiat currency
// Default to HKD for Hong Kong
const selectedFiatCurrency = ref('HKD')

// Fiat currency options
const fiatCurrencyOptions = [
  { label: 'HKD - Hong Kong Dollar', value: 'HKD' },
  { label: 'USD - US Dollar', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'GBP - British Pound', value: 'GBP' },
  { label: 'CNY - Chinese Yuan', value: 'CNY' },
  { label: 'JPY - Japanese Yen', value: 'JPY' },
  { label: 'SGD - Singapore Dollar', value: 'SGD' },
  { label: 'AUD - Australian Dollar', value: 'AUD' },
  { label: 'CAD - Canadian Dollar', value: 'CAD' },
  { label: 'CHF - Swiss Franc', value: 'CHF' }
]

// Reward points
const discountAmount = computed(() => {
  const value = props.appliedRewardPoints / 100
  if (!Number.isFinite(value))
    return 0
  return parseFloat(value.toFixed(2))
})

// Total withdraw amount = cash amount + equivalent points amount
const totalWithdrawAmount = computed(() => {
  const base = props.withdrawAmount || 0
  const bonus = discountAmount.value || 0
  return base + bonus
})

// Fiat rate data
const fiatRate = ref<FiatRateModel | null>(null)
const rateLoading = ref(false)
const rateError = ref('')

// Rate polling state
const ratePollingInterval = ref<NodeJS.Timeout | null>(null)
const isRatePolling = ref(false)

// Countdown state
const countdown = ref(0)
const countdownInterval = ref<NodeJS.Timeout | null>(null)

// Receive amount and fee
const receiveAmount = ref(0)
const feeAmount = ref(0)

// Recipient information
const recipientInfo = ref<QueryRecipientModel | null>(null)
const recipientLoading = ref(true) // Start with true to prevent showing form before fetch completes

// Bank names from API
const bankNames = ref<string[]>([])

// Recipient dialog visibility
const showRecipientDialog = ref(false)

// Payment method dynamic fields
const paymentMethodFields = reactive<Record<string, string>>({})
const paymentMethodFieldErrors = reactive<Record<string, string>>({})

// Methods
const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Format method type for display
const formatMethodType = (methodType: string): string => {
  const typeMap: Record<string, string> = {
    'BANK_TRANSFER': 'Bank Transfer',
    'WALLET': 'Wallet',
    'CREDIT_CARD': 'Credit Card',
    'DEBIT_CARD': 'Debit Card'
  }
  return typeMap[methodType] || methodType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Toggle group expansion
const toggleGroup = (methodType: string) => {
  expandedGroups.value[methodType] = !expandedGroups.value[methodType]
}

// Initialize payment method fields
const initializePaymentMethodFields = (paymentMethod: FiatPaymentMethodItem) => {
  // Clear previous fields
  Object.keys(paymentMethodFields).forEach(key => {
    delete paymentMethodFields[key]
  })
  Object.keys(paymentMethodFieldErrors).forEach(key => {
    delete paymentMethodFieldErrors[key]
  })

  // Initialize fields from payment method
  if (paymentMethod.fields && Array.isArray(paymentMethod.fields)) {
    paymentMethod.fields.forEach(field => {
      paymentMethodFields[field.name] = ''
      paymentMethodFieldErrors[field.name] = ''
    })
  }
}

// Validate payment method fields
const validatePaymentMethodFields = (): boolean => {
  if (!selectedPaymentMethod.value || !selectedPaymentMethod.value.fields) {
    return true // No fields to validate
  }

  let isValid = true
  selectedPaymentMethod.value.fields.forEach(field => {
    const value = paymentMethodFields[field.name]
    const valueStr = typeof value === 'string' ? value.trim() : ''

    // Check if required field is empty
    if (field.required) {
      if (value === undefined || value === null || value === '' || valueStr === '') {
        paymentMethodFieldErrors[field.name] = `${field.label} is required`
        isValid = false
        return
      }
    }

    // Check minLength
    if (field.minLength && valueStr !== '') {
      const minLength = parseInt(field.minLength)
      if (!isNaN(minLength) && valueStr.length < minLength) {
        paymentMethodFieldErrors[field.name] = `${field.label} must be at least ${minLength} characters`
        isValid = false
        return
      }
    }

    // Check maxLength
    if (field.maxLength && valueStr !== '') {
      const maxLength = parseInt(field.maxLength)
      if (!isNaN(maxLength) && valueStr.length > maxLength) {
        paymentMethodFieldErrors[field.name] = `${field.label} must not exceed ${maxLength} characters`
        isValid = false
        return
      }
    }

    paymentMethodFieldErrors[field.name] = ''
  })

  return isValid
}

// Select payment method
const selectPaymentMethod = (paymentMethod: FiatPaymentMethodItem) => {
  if (selectedPaymentMethod.value?.methodCode === paymentMethod.methodCode) {
    console.log('Payment method unchanged, skipping operations')
    return
  }

  console.log('Payment method changed from', selectedPaymentMethod.value?.methodCode, 'to', paymentMethod.methodCode)

  selectedPaymentMethod.value = paymentMethod

  // Initialize dynamic fields for the selected payment method
  initializePaymentMethodFields(paymentMethod)

  // Restart polling when payment method changes
  stopRatePolling()
  if (selectedPaymentMethod.value) {
    startRatePolling()
  }
}

// Check if receive amount is within selected payment method's limit
const isReceiveAmountWithinLimit = computed(() => {
  if (!selectedPaymentMethod.value) return true

  const receiveUsdAmount = receiveAmount.value || 0
  if (isNaN(receiveUsdAmount)) return true

  const minLimit = selectedPaymentMethod.value.minLimit
  const maxLimit = selectedPaymentMethod.value.maxLimit
  return receiveUsdAmount >= minLimit && receiveUsdAmount <= maxLimit
})

// Get receive amount limit error message
const receiveLimitErrorMessage = computed(() => {
  if (!selectedPaymentMethod.value) return ''

  const receiveUsdAmount = receiveAmount.value || 0
  if (isNaN(receiveUsdAmount)) return ''

  const minLimit = selectedPaymentMethod.value.minLimit
  const maxLimit = selectedPaymentMethod.value.maxLimit

  if (receiveUsdAmount < minLimit) {
    return `Receive amount must be at least ${formatCurrency(minLimit)} for ${selectedPaymentMethod.value.methodName}`
  }
  if (receiveUsdAmount > maxLimit) {
    return `Receive amount exceeds maximum limit of ${formatCurrency(maxLimit)} for ${selectedPaymentMethod.value.methodName}`
  }
  return ''
})

// Start countdown timer
const startCountdown = () => {
  countdown.value = 15
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  countdownInterval.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval.value!)
      countdownInterval.value = null
    }
  }, 1000)
}

// Fetch fiat rate from API
const fetchFiatRate = async () => {
  // 既可以根据提现金额计算汇率，也可以仅根据积分计算汇率（提现金额为 0）
  if (!selectedPaymentMethod.value || (!props.withdrawAmount && !props.appliedRewardPoints)) {
    console.log('Skipping fiat rate fetch:', {
      hasPaymentMethod: !!selectedPaymentMethod.value,
      withdrawAmount: props.withdrawAmount,
      appliedRewardPoints: props.appliedRewardPoints
    })
    return
  }

  rateLoading.value = true
  rateError.value = ''

  try {
    console.log('Fetching fiat rate for withdrawal...', {
      amount: props.withdrawAmount,
      fiatUnit: selectedFiatCurrency.value,
      cardRewardPoints: props.appliedRewardPoints,
      paymentMethod: selectedPaymentMethod.value?.methodName
    })

    const requestedPoints = props.appliedRewardPoints || 0

    const response = await OrderAPI.getFiatRate({
      number: props.withdrawAmount.toString(),
      saleDirection: 'SELL', // Withdrawal uses SELL
      fiatUnit: selectedFiatCurrency.value,
      cardRewardPoints: requestedPoints,
      methodCode: selectedPaymentMethod.value.methodCode
    })

    if (response.success && response.model) {
      fiatRate.value = response.model
      console.log('Fiat rate loaded:', response.model)

      // Update receive amount and fee
      if (response.model.target) {
        receiveAmount.value = response.model.target.amount || 0
      }
      if (response.model.feeDetail) {
        feeAmount.value = response.model.feeDetail.amount || 0
      }

      // Note: We keep the user-selected currency, don't override it from response
      // The response currency should match the selected currency
    } else {
      throw new Error(response.msg || 'Failed to get fiat rate')
    }
  } catch (error) {
    console.error('Error fetching fiat rate:', error)
    rateError.value = (error as any)?.message || 'Failed to get fiat rate'

    fiatRate.value = null
    receiveAmount.value = 0
    feeAmount.value = 0
  } finally {
    rateLoading.value = false
  }
}

// Start rate polling every 15s
const startRatePolling = () => {
  if (isRatePolling.value) return
  if (!selectedPaymentMethod.value) return
  isRatePolling.value = true
  fetchFiatRate()
  startCountdown()
  ratePollingInterval.value = setInterval(() => {
    fetchFiatRate()
    startCountdown()
  }, 15000)
}

// Stop rate polling
const stopRatePolling = () => {
  if (ratePollingInterval.value) {
    clearInterval(ratePollingInterval.value)
    ratePollingInterval.value = null
  }
  isRatePolling.value = false
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
  countdown.value = 0
}

// Fetch payment methods from API
const fetchPaymentMethods = async () => {
  loading.value = true
  try {
    console.log('Fetching fiat payment methods for withdrawal...')

    const response = await OrderAPI.getFiatPaymentMethods({
      orderType: 'OUT' // OUT = withdrawal
    })

    loading.value = false
    console.log('Fiat payment methods API response:', response)
    if (response.success && response.model && Array.isArray(response.model)) {
      // 保留分组结构
      paymentMethodGroups.value = response.model
      console.log('Fiat payment methods loaded:', paymentMethodGroups.value.length, 'groups:', paymentMethodGroups.value)

      // Initialize expanded groups (expand all by default)
      paymentMethodGroups.value.forEach(group => {
        if (group.methodType) {
          expandedGroups.value[group.methodType] = true
        }
      })

      // Auto-select first payment method if available
      const firstGroup = paymentMethodGroups.value.find(group =>
        group.fiatPaymentMethod && group.fiatPaymentMethod.length > 0
      )
      if (firstGroup && firstGroup.fiatPaymentMethod && firstGroup.fiatPaymentMethod.length > 0) {
        const firstMethod = firstGroup.fiatPaymentMethod[0]
        selectedPaymentMethod.value = firstMethod
        console.log('Auto-selected payment method:', firstMethod.methodName)

        // Initialize dynamic fields for the auto-selected payment method
        initializePaymentMethodFields(firstMethod)

        // Note: rate polling will do the first fetch immediately; avoid duplicate fetch on init
      } else {
        console.log('No fiat payment methods available')
      }
    } else {
      console.warn('No fiat payment methods returned from API')
      throw new Error(response.msg || 'No fiat payment methods available')
    }
  } catch (error) {
    loading.value = false
    console.error('Error fetching fiat payment methods:', error)
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: (error as any)?.message || 'Failed to load payment methods',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Watch for amount changes to fetch new exchange rate
watch(() => props.withdrawAmount, (newAmount, oldAmount) => {
  // 当金额变化且大于0时，重新获取汇率
  // 或者即使金额为 0，只要使用了积分也要请求汇率
  if (selectedPaymentMethod.value && newAmount !== oldAmount && (newAmount > 0 || props.appliedRewardPoints > 0)) {
    console.log('Amount changed, fetching new fiat rate...', {
      oldAmount,
      newAmount,
      appliedRewardPoints: props.appliedRewardPoints
    })
    // restart polling to refresh immediately
    stopRatePolling()
    startRatePolling()
  }
})

// Watch for fiat currency changes to fetch new exchange rate
watch(selectedFiatCurrency, (newCurrency, oldCurrency) => {
  if (selectedPaymentMethod.value && newCurrency !== oldCurrency && (props.withdrawAmount > 0 || props.appliedRewardPoints > 0)) {
    console.log('Fiat currency changed, fetching new fiat rate...', {
      oldCurrency,
      newCurrency,
      withdrawAmount: props.withdrawAmount,
      appliedRewardPoints: props.appliedRewardPoints
    })
    // restart polling to refresh immediately
    stopRatePolling()
    startRatePolling()
  }
})

// Query recipient information
const fetchRecipient = async () => {
  recipientLoading.value = true
  try {
    console.log('Fetching recipient information...')
    const response = await CardAPI.queryRecipient()

    if (response.success && response.model) {
      recipientInfo.value = response.model
      console.log('Recipient information loaded:', response.model)
    } else {
      // If no recipient found, set to null
      recipientInfo.value = null
      console.log('No recipient information found')
    }
  } catch (error) {
    console.error('Error fetching recipient:', error)
    // If error, assume no recipient exists
    recipientInfo.value = null
  } finally {
    recipientLoading.value = false
  }
}

// Query bank information
const fetchBankInfo = async () => {
  try {
    console.log('Fetching bank information...')
    const response = await OrderAPI.getBankQuery()

    if (response.success && response.model && Array.isArray(response.model)) {
      // Find Hong Kong banks from the array
      const hkBankData = response.model.find(item => item.countryCode === 'HK')

      if (hkBankData && hkBankData.bankName && Array.isArray(hkBankData.bankName)) {
        bankNames.value = hkBankData.bankName
        console.log('Hong Kong bank names loaded:', hkBankData.bankName.length, 'banks')
      } else {
        console.warn('No Hong Kong bank information found in API response')
        bankNames.value = []
      }
    } else {
      console.warn('No bank information returned from API')
      bankNames.value = []
    }
  } catch (error) {
    console.error('Error fetching bank information:', error)
    bankNames.value = []
  }
}


// Delete recipient
const handleDeleteRecipient = () => {
  if (!recipientInfo.value) return

  confirm.require({
    message: 'Are you sure you want to delete this recipient? This action cannot be undone.',
    header: 'Delete Recipient',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => {
      try {
        console.log('Deleting recipient information...')

        const response = await CardAPI.deleteRecipient()

        if (response.success) {
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Recipient information deleted successfully',
            life: 3000
          })

          // Clear recipient info
          recipientInfo.value = null
        } else {
          throw new Error(response.msg || 'Failed to delete recipient')
        }
      } catch (error) {
        console.error('Error deleting recipient:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: (error as any)?.message || 'Failed to delete recipient information',
          life: 3000
        })
      }
    }
  })
}

// Handle recipient saved callback
const handleRecipientSaved = async () => {
  // Refresh recipient information after saving
  await fetchRecipient()
}

// Initialize on mount
onMounted(async () => {
  console.log('FiatWithdrawal mounted, starting initialization...')

  // Initialize card list if needed
  if (cardStore.cardList.length === 0) {
    await cardStore.fetchCardList({ silent: true })
  }

  // Fetch bank information first (needed for recipient form dialog)
  await fetchBankInfo()

  // Fetch recipient information and payment methods in parallel (they don't depend on each other)
  Promise.all([
    fetchRecipient(),
    fetchPaymentMethods()
  ]).then(() => {
    // Start rate polling after payment methods are loaded
    if (selectedPaymentMethod.value) {
      startRatePolling()
    }
  }).catch(error => {
    console.error('Error during parallel initialization:', error)
  })
})

// Go back
const goBack = () => {
  router.back()
}

// Form validation
const isFormValid = computed(() => {
  // Check if recipient information is saved
  if (!recipientInfo.value) {
    return false
  }

  // Check if payment method is selected
  if (!selectedPaymentMethod.value) {
    return false
  }

  // Check if receive amount is within limit
  if (!isReceiveAmountWithinLimit.value) {
    return false
  }

  // Check if amount is valid
  const hasFiatAmount = props.withdrawAmount > 0
  const hasPoints = props.appliedRewardPoints > 0

  if (!hasFiatAmount && !hasPoints) {
    return false
  }

  // Validate payment method fields
  if (!validatePaymentMethodFields()) {
    return false
  }

  return true
})

// Handle withdraw
const handleWithdraw = async () => {
  if (!isFormValid.value) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please complete all required fields and ensure recipient information is saved',
      life: 3000
    })
    return
  }

  if (!props.cardInfo.cardId) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Card information is missing. Please go back and try again.',
      life: 3000
    })
    return
  }

  if (!selectedPaymentMethod.value) {
    toast.add({
      severity: 'error',
      summary: 'Selection Error',
      detail: 'Please select a payment method.',
      life: 3000
    })
    return
  }

  if (!recipientInfo.value) {
    toast.add({
      severity: 'error',
      summary: 'Recipient Required',
      detail: 'Please save recipient information first.',
      life: 3000
    })
    return
  }

  if (!isReceiveAmountWithinLimit.value) {
    toast.add({
      severity: 'error',
      summary: 'Amount Out of Range',
      detail: receiveLimitErrorMessage.value || 'Receive amount is out of the allowed range',
      life: 5000
    })
    return
  }

  isSubmitting.value = true

  try {
    const cardFromList = cardStore.cardList.find(card => card.cardId === props.cardInfo.cardId)
    const maskedCardNo = cardFromList?.cardNo || props.cardInfo.cardNo || ''

    // Build customParam with recipient information and payment method fields
    const customParamData: Record<string, any> = {
      contactId: recipientInfo.value.contactId,
      methodCode: selectedPaymentMethod.value.methodCode
    }

    // Add payment method fields to customParam
    if (selectedPaymentMethod.value.fields && Array.isArray(selectedPaymentMethod.value.fields)) {
      selectedPaymentMethod.value.fields.forEach(field => {
        const value = paymentMethodFields[field.name]
        if (value !== undefined && value !== null && value !== '') {
          customParamData[field.name] = value
        }
      })
    }

    const customParam = JSON.stringify(customParamData)

    const response = await OrderAPI.createWithdrawOrder({
      cardPattern: '1',
      type: '1',
      cardId: props.cardInfo.cardId,
      token: selectedFiatCurrency.value, // 法币出金传法币单位（如 HKD），数币出金传数币单位（如 USDT）
      network: selectedPaymentMethod.value.methodName, // Use payment method name as network
      address: '', // Use contactId as address
      delFlag: props.isDeleteAction,
      withdrawAmount: (props.isDeleteAction ? props.balance : props.withdrawAmount).toString(),
      cardNo: maskedCardNo,
      cardRewardPoints: props.appliedRewardPoints,
      payType: selectedPaymentMethod.value.methodCode, // Fiat payment method code
      customParam: customParam
    })

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Withdraw Order Created',
        detail: `Order #${response.model} has been submitted successfully`,
        life: 3000
      })

      userStore.fetchUserProfile().catch(error => {
        console.warn('Failed to refresh user profile after withdraw order:', error)
      })

      router.push({
        name: 'PaymentResult',
        query: {
          orderNum: response.model,
          status: 'PENDING',
          amount: props.withdrawAmount.toString(),
          currency: selectedFiatCurrency.value,
          network: selectedPaymentMethod.value.methodName,
          address: recipientInfo.value.contactId,
          type: 'withdraw'
        }
      })
    } else {
      throw new Error(response.msg || 'Failed to create withdraw order')
    }
  } catch (error) {
    console.error('Withdraw error:', error)
    toast.add({
      severity: 'error',
      summary: 'Withdraw Failed',
      detail: (error as any)?.message || 'Failed to create withdraw order. Please try again.',
      life: 3000
    })
  } finally {
    isSubmitting.value = false
  }
}

// Clean up
onUnmounted(() => {
  stopRatePolling()
})
</script>
