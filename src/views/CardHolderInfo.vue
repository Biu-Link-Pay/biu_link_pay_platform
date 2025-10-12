<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Unified Header -->
    <AppHeader title="Card Holder" :show-title="true" />

    <!-- Main Content -->
    <div
      class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 md:pb-6 lg:pb-8">
      <!-- Intro Banner -->
      <div v-if="!hasCards"
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="pi pi-id-card text-white text-sm"></i>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300">Manage your billing address for the card holder.</p>
        </div>
      </div>

      <!-- Card Information (only for recharge action) -->
      <CardInfoHeader v-if="route.query.action === 'recharge'" :card-no="currentCardNo" />

      <!-- Content: view or edit billing address -->
      <div class="space-y-8">
        <!-- Readonly view -->
        <div v-if="!hasCards && holder && !isEditing">
          <div
            class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <!-- Address Header -->
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <i class="pi pi-map-marker text-blue-600 dark:text-blue-400 text-lg"></i>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Billing Address
                </h4>
                <p class="text-xs text-gray-400 dark:text-gray-500">Primary address for card transactions</p>
              </div>
            </div>

            <!-- Address Content -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 space-y-4">
              <!-- Country and Postal Code Row -->
              <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <div class="flex items-center space-x-2">
                    <i class="pi pi-globe text-sm text-blue-600 dark:text-blue-400"></i>
                    <span
                      class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Country</span>
                  </div>
                  <p class="text-base font-semibold text-gray-900 dark:text-white ml-6">{{
                    getCountryName(holder.residentialCountryCode) }}</p>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center space-x-2">
                    <i class="pi pi-tag text-sm text-blue-600 dark:text-blue-400"></i>
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Postal
                      Code</span>
                  </div>
                  <p class="text-base font-semibold text-gray-900 dark:text-white ml-6">{{ holder.residentialPostalCode
                  }}</p>
                </div>
              </div>

              <!-- State and City Row -->
              <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <div class="flex items-center space-x-2">
                    <i class="pi pi-building text-sm text-blue-600 dark:text-blue-400"></i>
                    <span
                      class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">State/Province</span>
                  </div>
                  <p class="text-base font-semibold text-gray-900 dark:text-white ml-6">{{
                    getStateDisplay(holder.residentialCountryCode, holder.residentialState) }}
                  </p>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center space-x-2">
                    <i class="pi pi-home text-sm text-blue-600 dark:text-blue-400"></i>
                    <span
                      class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">City</span>
                  </div>
                  <p class="text-base font-semibold text-gray-900 dark:text-white ml-6">{{ holder.residentialCity }}</p>
                </div>
              </div>

              <!-- Address Row -->
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <i class="pi pi-map text-sm text-blue-600 dark:text-blue-400"></i>
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Address</span>
                </div>
                <p class="text-base font-semibold text-gray-900 dark:text-white ml-6 leading-relaxed">{{
                  holder.residentialAddress }}</p>
              </div>
            </div>

            <!-- Action Button -->
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-right">
              <Button label="Edit Address" icon="pi pi-pencil" @click="startEdit" />
            </div>
          </div>
        </div>

        <!-- Edit form -->
        <div v-if="!hasCards && isEditing">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing Address</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
              <Dropdown v-model="form.residentialCountryCode" :options="countries" option-label="name"
                option-value="code" placeholder="Select country" class="w-full" filter show-clear
                :class="{ 'p-invalid': errors.residentialCountryCode }" />
              <small v-if="errors.residentialCountryCode" class="text-red-500 text-xs mt-1">{{
                errors.residentialCountryCode }}</small>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State/Province</label>
                <Dropdown v-if="hasStateOptions" v-model="selectedStateCode" :options="states" option-label="name"
                  option-value="isoCode" placeholder="Select state or province" class="w-full" filter show-clear
                  :class="{ 'p-invalid': errors.residentialState }" />
                <InputText v-else v-model="form.residentialState" placeholder="Enter state/province" class="w-full"
                  :class="{ 'p-invalid': errors.residentialState }" />
                <small v-if="errors.residentialState" class="text-red-500 text-xs mt-1">{{ errors.residentialState
                  }}</small>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                <Dropdown v-if="hasCityOptions" v-model="selectedCityName" :options="cities" option-label="name"
                  option-value="name" placeholder="Select city" class="w-full" filter show-clear
                  :class="{ 'p-invalid': errors.residentialCity }" />
                <InputText v-else v-model="form.residentialCity" placeholder="Enter city" class="w-full"
                  :class="{ 'p-invalid': errors.residentialCity }" />
                <small v-if="errors.residentialCity" class="text-red-500 text-xs mt-1">{{ errors.residentialCity
                }}</small>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
              <InputText v-model="form.residentialAddress" placeholder="Enter your address" class="w-full"
                :class="{ 'p-invalid': errors.residentialAddress }" />
              <small v-if="errors.residentialAddress" class="text-red-500 text-xs mt-1">{{ errors.residentialAddress
              }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Postal Code</label>
              <InputText v-model="form.residentialPostalCode" placeholder="Enter postal code" class="w-full"
                :class="{ 'p-invalid': errors.residentialPostalCode }" />
              <small v-if="errors.residentialPostalCode" class="text-red-500 text-xs mt-1">{{
                errors.residentialPostalCode }}</small>
            </div>
            <!-- Edit form buttons -->
            <div class="mt-6 flex gap-3">
              <Button v-if="holder" label="Cancel" icon="pi pi-times" severity="secondary" class="flex-1"
                @click="cancelEdit" />
              <Button :label="holder ? 'Update' : 'Save'" icon="pi pi-check" :loading="loading"
                :class="holder ? 'flex-1' : 'w-full'" severity="primary" @click="saveAddress" />
            </div>
          </div>
        </div>

        <!-- Recharge Section -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Please complete your first Recharge</h2>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recharge amount</label>
            <div class="flex items-center gap-2">
              <InputText v-model="form.rechargeAmount" type="text" :placeholder="minAmount.toString()" class="w-32"
                :class="{ 'p-invalid': errors.rechargeAmount }" @blur="validateRechargeAmount" />
              <span class="text-gray-600 dark:text-gray-400">{{ cardStore.selectedCardBin?.cardCurrency }}</span>
            </div>
            <small v-if="errors.rechargeAmount" class="text-red-500 text-xs mt-1">{{ errors.rechargeAmount }}</small>
          </div>

          <!-- Quick Amount Buttons -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button v-for="amount in quickAmounts" :key="amount" :label="`${currentCurrencySymbol}${amount}`" :class="form.rechargeAmount === amount.toString()
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
              class="w-full py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              @click="form.rechargeAmount = amount.toString()" />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bottom-buttons-container relative md:static">
        <Button label="Back" icon="pi pi-arrow-left" severity="secondary"
          class="bottom-button-dual bottom-button-dual-secondary" @click="goBack" />
        <Button :disabled="!canConfirm" :label="confirmButtonText" icon="pi pi-check" :loading="loading"
          class="bottom-button-dual bottom-button-dual-primary" @click="handleConfirm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useCardStore } from '@/stores/card'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import AppHeader from '@/components/AppHeader.vue'
import CardInfoHeader from '@/components/CardInfoHeader.vue'
import { CardAPI } from '@/api/card'
import type { CardHolderInfo as HolderInfo, CardHolderResponse } from '@/api/card'
import * as CSC from 'country-state-city'

const { Country, State, City } = CSC

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()
const authStore = useAuthStore()
// Has cards state
const hasCards = computed(() => (cardStore.cardList?.length || 0) > 0)


// Holder + Editing state
const holder = ref<CardHolderResponse | null>(null)
const isEditing = ref(false)

// Form data (billing address + recharge)
const form = reactive<HolderInfo & { rechargeAmount: string }>({
  residentialAddress: '',
  residentialCity: '',
  residentialCountryCode: 'US',
  residentialPostalCode: '',
  residentialState: '',
  rechargeAmount: ''
})

// Form validation errors
const errors = reactive({
  residentialAddress: '',
  residentialCity: '',
  residentialState: '',
  residentialPostalCode: '',
  residentialCountryCode: '',
  rechargeAmount: ''
})

// Loading state
const loading = ref(false)

// Location data sourced from country-state-city library (Country / State / City)
interface CountryOption {
  name: string
  code: string
}

interface StateOption {
  name: string
  isoCode: string
}

interface CityOption {
  name: string
}

const countries = ref<CountryOption[]>(
  Country.getAllCountries()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(country => ({
      name: country.name,
      code: country.isoCode
    }))
)

const states = ref<StateOption[]>([])
const cities = ref<CityOption[]>([])
const selectedStateCode = ref<string | null>(null)
const selectedCityName = ref<string | null>(null)

// Helper to get country name from code
const getCountryName = (countryCode: string) => {
  const country = countries.value.find(c => c.code === countryCode)
  return country?.name || countryCode
}

// 将二字码返显为州名（仅对 US 处理；其他国家直接展示原值）
const getStateDisplay = (countryCode?: string, stateValue?: string) => {
  if (!stateValue) return ''
  const code = (countryCode || '').toUpperCase()
  if (!code) return stateValue
  const stateList = State.getStatesOfCountry(code) || []
  const byCode = stateList.find(s => s.isoCode.toUpperCase() === stateValue.toUpperCase())
  if (byCode) return byCode.name
  const byName = stateList.find(s => s.name.trim().toLowerCase() === stateValue.trim().toLowerCase())
  return byName?.name || stateValue
}

// Helper functions for cascading selects
const loadCitiesForState = (
  countryCode: string | null | undefined,
  stateIsoCode: string | null | undefined,
  preserveExisting = false
) => {
  if (!countryCode || !stateIsoCode) {
    cities.value = []
    selectedCityName.value = null
    if (!preserveExisting) {
      form.residentialCity = ''
    }
    return
  }

  const cityList = (City.getCitiesOfState(countryCode, stateIsoCode) || []).sort((a, b) => a.name.localeCompare(b.name))
  cities.value = cityList.map(city => ({ name: city.name }))

  if (preserveExisting && form.residentialCity) {
    const matchedCity = cityList.find(city => city.name === form.residentialCity)
    if (matchedCity) {
      selectedCityName.value = matchedCity.name
      return
    }
  }

  selectedCityName.value = null
  form.residentialCity = ''
}

const loadCitiesForCountry = (
  countryCode: string | null | undefined,
  preserveExisting = false
) => {
  if (!countryCode) {
    cities.value = []
    selectedCityName.value = null
    if (!preserveExisting) {
      form.residentialCity = ''
    }
    return
  }

  const cityList = (City.getCitiesOfCountry(countryCode) || []).sort((a, b) => a.name.localeCompare(b.name))
  cities.value = cityList.map(city => ({ name: city.name }))

  if (preserveExisting && form.residentialCity) {
    const matchedCity = cityList.find(city => city.name === form.residentialCity)
    if (matchedCity) {
      selectedCityName.value = matchedCity.name
      return
    }
  }

  selectedCityName.value = null
  form.residentialCity = ''
}

const loadStatesForCountry = (countryCode: string | null | undefined, preserveExisting = false) => {
  if (!countryCode) {
    states.value = []
    selectedStateCode.value = null
    loadCitiesForState(undefined, undefined, preserveExisting)
    if (!preserveExisting) {
      form.residentialState = ''
    }
    return
  }

  const stateList = (State.getStatesOfCountry(countryCode) || []).sort((a, b) => a.name.localeCompare(b.name))

  if (stateList.length === 0) {
    states.value = []
    selectedStateCode.value = null
    if (!preserveExisting) {
      form.residentialState = ''
    }
    loadCitiesForCountry(countryCode, preserveExisting)
    return
  }

  states.value = stateList.map(state => ({ name: state.name, isoCode: state.isoCode }))

  if (preserveExisting && form.residentialState) {
    const target = form.residentialState.trim()
    const matchedByCode = stateList.find(state => state.isoCode.toUpperCase() === target.toUpperCase())
    if (matchedByCode) { selectedStateCode.value = matchedByCode.isoCode; return }
    const matchedByName = stateList.find(state => state.name.trim() === target)
    if (matchedByName) { selectedStateCode.value = matchedByName.isoCode; return }
  }

  selectedStateCode.value = null
  form.residentialState = ''
  loadCitiesForState(countryCode, undefined, false)
}

watch(
  () => form.residentialCountryCode,
  (newCode, oldCode) => {
    if (oldCode == null) {
      loadStatesForCountry(newCode, true)
    } else if (newCode !== oldCode) {
      loadStatesForCountry(newCode, false)
    }
  }
)

watch(
  selectedStateCode,
  (newCode, oldCode) => {
    if (!newCode) {
      form.residentialState = ''
      if (states.value.length === 0) {
        loadCitiesForCountry(form.residentialCountryCode, !oldCode)
      } else {
        loadCitiesForState(form.residentialCountryCode, undefined, false)
      }
      return
    }

    const stateEntry = states.value.find(state => state.isoCode === newCode)
    // 始终保存 isoCode 到表单，便于后端接收 ISO 3166-2
    form.residentialState = stateEntry?.isoCode || newCode
    loadCitiesForState(form.residentialCountryCode, newCode, !oldCode)
  }
)

watch(
  selectedCityName,
  newCity => {
    form.residentialCity = newCity || ''
  }
)

const hasStateOptions = computed(() => states.value.length > 0)
const hasCityOptions = computed(() => cities.value.length > 0)

const initializeLocationSelections = () => {
  loadStatesForCountry(form.residentialCountryCode, true)
}

// Enhanced location initialization for edit mode  
const initializeLocationForEdit = async () => {
  if (!form.residentialCountryCode) return

  // Store original form values
  const originalState = form.residentialState
  const originalCity = form.residentialCity

  // First load states data to get available choices
  const stateList = State.getStatesOfCountry(form.residentialCountryCode) || []
  states.value = stateList.map(state => ({ name: state.name, isoCode: state.isoCode }))

  // Reset selections first
  selectedStateCode.value = null
  selectedCityName.value = null
  cities.value = []

  // Find and select matching state
  if (originalState && originalState.trim()) {
    const trimmed = originalState.trim()
    const matchedByCode = stateList.find(s => s.isoCode.toUpperCase() === trimmed.toUpperCase())
    const matchedState = matchedByCode || stateList.find(s => s.name.trim() === trimmed)
    if (matchedState) {
      selectedStateCode.value = matchedState.isoCode

      // Load cities for this state
      const cityOptions = City.getCitiesOfState(form.residentialCountryCode, matchedState.isoCode) || []
      cities.value = cityOptions
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(city => ({ name: city.name }))

      // Set city if available
      if (originalCity && originalCity.trim() && cityOptions.length > 0) {
        const matchedCity = cityOptions.find(city => city.name.trim() === originalCity.trim())
        if (matchedCity) {
          selectedCityName.value = matchedCity.name
        }
      }
      return
    }
  }

  // If no state match found, load country-wide cities as fallback
  loadCitiesForCountry(form.residentialCountryCode, true)
}
// Minimum amount based on action type
const minAmount = computed(() => {
  const action = route.query.action as string
  if (action === 'recharge') {
    return 20
  } else {
    // 申请新卡：20 + 申请卡费
    const applyFee = cardStore.selectedCardConfig?.applyFee || 0
    return 20 + applyFee
  }
})

// Quick recharge amounts - dynamic based on action type
const quickAmounts = computed(() => {
  const min = minAmount.value
  return [min, 50, 100, 200]
})

// Currency symbol mapping
const currencySymbols: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'CNH': '¥',
  'GBP': '£',
  'JPY': '¥',
  'CAD': 'C$',
  'AUD': 'A$',
  'CHF': 'CHF',
  'SGD': 'S$',
  'HKD': 'HK$'
}

// Get current currency symbol
const currentCurrencySymbol = computed(() => {
  const currency = cardStore.selectedCardBin?.cardCurrency || 'USD'
  return currencySymbols[currency] || '$'
})

// Current card number from route/store for header
const currentCardNo = computed(() => (cardStore.getSelectedCardBin()?.cardNo || ''))

// Computed properties for button states
const canConfirm = computed(() => {
  return !isEditing.value && !!holder.value
})

const confirmButtonText = computed(() => {
  if (isEditing.value) {
    return 'Save Address First'
  } else if (!holder.value) {
    return 'Add Address First'
  } else {
    return 'Confirm'
  }
})

// Build headers for API
const buildHeaders = () => {
  const token = authStore.token || localStorage.getItem('token') || ''
  const refreshToken = authStore.refreshToken || localStorage.getItem('refreshToken') || ''
  return {
    token,
    'fingerprint-id': 'default-fingerprint-id',
    refresh_token: refreshToken
  }
}

// Decimal precision per currency (default 2)
const currencyDecimals: Record<string, number> = {
  JPY: 0
}
const currentDecimals = computed(() => {
  const currency = cardStore.selectedCardBin?.cardCurrency || 'USD'
  return currencyDecimals[currency] ?? 2
})

// Sanitize amount string to limited decimals without float errors
const sanitizeAmountString = (value: string, decimals: number): string => {
  const raw = (value || '').toString().trim().replace(/[^\d.]/g, '')
  if (!raw) return ''
  const firstDot = raw.indexOf('.')
  let normalized = firstDot >= 0
    ? raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, '')
    : raw
  let [intPart, fracPart = ''] = normalized.split('.')
  intPart = intPart.replace(/^0+(?=\d)/, '') || '0'
  if (decimals <= 0) return intPart
  if (fracPart) fracPart = fracPart.slice(0, decimals)
  return fracPart ? `${intPart}.${fracPart}` : intPart
}

// Convert amount string to minor units using integers
const toMinorUnits = (value: string, decimals: number): number => {
  if (!value) return NaN as unknown as number
  const [intPartRaw, fracRaw = ''] = value.split('.')
  const intPart = parseInt(intPartRaw || '0', 10)
  const fracPart = (fracRaw || '').padEnd(decimals, '0').slice(0, decimals)
  const fracInt = decimals > 0 ? parseInt(fracPart || '0', 10) : 0
  const base = Math.pow(10, decimals)
  return intPart * base + fracInt
}

// Validation functions (now only for recharge since address validation is in saveAddress)
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Only validate recharge amount since address validation is handled separately
  const rechargeAmount = parseFloat(form.rechargeAmount)
  if (!form.rechargeAmount || isNaN(rechargeAmount) || rechargeAmount <= 0) {
    errors.rechargeAmount = 'Please enter a valid recharge amount'
    isValid = false
  }

  return isValid
}

// Load current holder info
const loadHolder = async () => {
  try {
    loading.value = true
    const response = await CardAPI.queryCardHolder()
    if (response.success && response.model) {
      holder.value = response.model
      // Prefill form from holder
      form.residentialAddress = response.model.residentialAddress
      form.residentialCity = response.model.residentialCity
      form.residentialCountryCode = response.model.residentialCountryCode
      form.residentialPostalCode = response.model.residentialPostalCode
      form.residentialState = response.model.residentialState
      isEditing.value = false
      // Use enhanced initialization for proper display
      await initializeLocationForEdit()
    } else {
      holder.value = null
      isEditing.value = true
      form.residentialAddress = ''
      form.residentialCity = ''
      form.residentialCountryCode = 'US'
      form.residentialPostalCode = ''
      form.residentialState = ''
      selectedStateCode.value = null
      selectedCityName.value = null
      initializeLocationSelections()
    }
  } catch (e) {
    holder.value = null
    isEditing.value = true
    form.residentialAddress = ''
    form.residentialCity = ''
    form.residentialCountryCode = 'US'
    form.residentialPostalCode = ''
    form.residentialState = ''
    selectedStateCode.value = null
    selectedCityName.value = null
    initializeLocationSelections()
  } finally {
    loading.value = false
  }
}

const startEdit = async () => {
  isEditing.value = true

  // Always update form from holder to ensure we have latest values  
  if (holder.value) {
    form.residentialAddress = holder.value.residentialAddress
    form.residentialCity = holder.value.residentialCity
    form.residentialCountryCode = holder.value.residentialCountryCode
    form.residentialPostalCode = holder.value.residentialPostalCode
    form.residentialState = holder.value.residentialState
  }

  // Use enhanced initialization to properly set selections  
  await initializeLocationForEdit()
}

const cancelEdit = async () => {
  // Reset form to original values
  if (holder.value) {
    form.residentialAddress = holder.value.residentialAddress
    form.residentialCity = holder.value.residentialCity
    form.residentialCountryCode = holder.value.residentialCountryCode
    form.residentialPostalCode = holder.value.residentialPostalCode
    form.residentialState = holder.value.residentialState
    // Use enhanced initialization to properly display loaded values
    await initializeLocationForEdit()
  } else {
    // Reset to empty if no holder
    form.residentialAddress = ''
    form.residentialCity = ''
    form.residentialCountryCode = 'US'
    form.residentialPostalCode = ''
    form.residentialState = ''
    selectedStateCode.value = null
    selectedCityName.value = null
    initializeLocationSelections()
  }
  isEditing.value = false
}

const saveAddress = async () => {
  // Validate only address fields
  const addressErrors = {
    residentialAddress: '',
    residentialCity: '',
    residentialState: '',
    residentialPostalCode: '',
    residentialCountryCode: ''
  }

  let isValid = true

  // 地址只允许中文、英文、数字及 . - , / 和空格
  const address = form.residentialAddress.trim()
  const addressPattern = /^[\u4e00-\u9fa5A-Za-z0-9\s.,\-/]+$/
  if (!address) {
    addressErrors.residentialAddress = 'Address is required'
    isValid = false
  } else if (!addressPattern.test(address)) {
    addressErrors.residentialAddress = 'Only Chinese/English letters, numbers and . - , / are allowed'
    isValid = false
  }

  if (!form.residentialCity.trim()) {
    addressErrors.residentialCity = 'City is required'
    isValid = false
  }

  if (!form.residentialState.trim()) {
    addressErrors.residentialState = 'State/Province is required'
    isValid = false
  }

  if (!form.residentialPostalCode.trim()) {
    addressErrors.residentialPostalCode = 'Postal code is required'
    isValid = false
  }

  if (!form.residentialCountryCode) {
    addressErrors.residentialCountryCode = 'Country is required'
    isValid = false
  }

  errors.residentialAddress = addressErrors.residentialAddress
  errors.residentialCity = addressErrors.residentialCity
  errors.residentialState = addressErrors.residentialState
  errors.residentialPostalCode = addressErrors.residentialPostalCode
  errors.residentialCountryCode = addressErrors.residentialCountryCode

  if (!isValid) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill in all required address fields',
      life: 3000
    })
    return
  }

  loading.value = true

  try {
    // 针对美国，向后端传州二字码（ISO）
    // 始终向后端发送 ISO 3166-2 的州/省 isoCode（各国长度不一）
    let stateToSend = form.residentialState
    if (selectedStateCode.value) {
      stateToSend = selectedStateCode.value
    } else if (form.residentialCountryCode) {
      const list = State.getStatesOfCountry(form.residentialCountryCode) || []
      const byCode = list.find(s => s.isoCode.toUpperCase() === form.residentialState.trim().toUpperCase())
      if (byCode) stateToSend = byCode.isoCode
      else {
        const byName = list.find(s => s.name.trim().toLowerCase() === form.residentialState.trim().toLowerCase())
        if (byName) stateToSend = byName.isoCode
      }
    }

    const holderInfo: HolderInfo = {
      residentialAddress: form.residentialAddress,
      residentialCity: form.residentialCity,
      residentialCountryCode: form.residentialCountryCode,
      residentialPostalCode: form.residentialPostalCode,
      residentialState: stateToSend
    }

    let ok = false
    let response = null
    if (holder.value) {
      // Update
      const resp = await CardAPI.updateCardHolder(holderInfo)
      ok = !!resp.success
      response = resp
    } else {
      // Create (use store helper)
      const result = await cardStore.saveCardHolder(holderInfo)
      ok = !!result.success
      response = result
    }

    if (ok) {
      toast.add({
        severity: 'success',
        summary: 'Saved',
        detail: 'Billing address saved successfully',
        life: 3000
      })
      // Reload holder & exit edit mode
      await loadHolder()
      isEditing.value = false
    } else {
      toast.add({
        severity: 'error',
        summary: 'Save Failed',
        detail: (response as any)?.msg || 'Failed to save your billing address. Please try again.',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Error saving billing address:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as any)?.message || 'An unexpected error occurred. Please try again.',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Handle form submission (only recharge confirmation now)
const handleConfirm = async () => {
  // Check if we can confirm (address must be saved and not in editing mode)
  if (!canConfirm.value) {
    if (isEditing.value) {
      toast.add({
        severity: 'warn',
        summary: 'Please save address first',
        detail: 'You need to save your billing address before confirming',
        life: 3000
      })
    } else if (!holder.value) {
      toast.add({
        severity: 'warn',
        summary: 'Please add address first',
        detail: 'You need to add your billing address before confirming',
        life: 3000
      })
    }
    return
  }

  // Only validate recharge amount since address is handled separately
  const sanitized = sanitizeAmountString(form.rechargeAmount, currentDecimals.value)
  form.rechargeAmount = sanitized
  const minor = toMinorUnits(form.rechargeAmount, currentDecimals.value)
  if (!form.rechargeAmount || Number.isNaN(minor) || minor <= 0) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please enter a valid recharge amount',
      life: 3000
    })
    return
  }

  loading.value = true

  try {
    // Handle recharge confirmation
    toast.add({
      severity: 'success',
      summary: 'Confirmed',
      detail: `Recharge amount $${form.rechargeAmount} confirmed successfully`,
      life: 3000
    })

    // Navigate to payment method selection page
    setTimeout(() => {
      router.push({
        name: 'PaymentMethodSelection',
        query: {
          amount: form.rechargeAmount,
          name: holder.value?.residentialAddress ? 'John Tan' : 'New User',
          action: route.query.action || 'apply' // Pass operation type: recharge or apply
        }
      })
    }, 2000)
  } catch (error) {
    console.error('Error confirming recharge:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as any)?.message || 'An unexpected error occurred. Please try again.',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Go back to previous page
const goBack = () => {
  router.back()
}

// Validate recharge amount (on blur)
const validateRechargeAmount = () => {
  const decimals = currentDecimals.value
  form.rechargeAmount = sanitizeAmountString(form.rechargeAmount, decimals)
  if (!form.rechargeAmount) return

  const minor = toMinorUnits(form.rechargeAmount, decimals)
  const minMinor = minAmount.value * Math.pow(10, decimals)
  if (Number.isNaN(minor)) return
  if (minor < minMinor) {
    form.rechargeAmount = minAmount.value.toString()
    toast.add({
      severity: 'info',
      summary: 'Amount Adjusted',
      detail: `Minimum recharge amount is ${minAmount.value}`,
      life: 2000
    })
  }
}
// Initialize: query holder and card info
onMounted(async () => {
  // Set default recharge amount based on action type
  form.rechargeAmount = minAmount.value.toString()

  await loadHolder()
  // Ensure card list is up to date
  try {
    await cardStore.fetchCardList()
  } catch (error) {
    console.warn('Failed to fetch card list:', error)
  }
})
</script>
