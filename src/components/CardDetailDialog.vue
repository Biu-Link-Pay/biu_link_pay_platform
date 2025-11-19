<template>
  <Dialog :visible="visible" modal header="Card Details" :style="{ width: '90vw', maxWidth: '600px' }"
    :breakpoints="{ '960px': '75vw', '640px': '95vw' }" :draggable="false" class="card-detail-dialog"
    @update:visible="onUpdateVisible">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-3xl text-blue-600 mb-3"></i>
        <p class="text-sm text-gray-600">Loading card details...</p>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-exclamation-triangle text-red-600 text-2xl"></i>
      </div>
      <p class="text-sm text-red-600 mb-4">{{ error }}</p>
      <button @click="$emit('retry')"
        class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        :disabled="loading">
        <i class="pi pi-refresh mr-2"></i>
        Retry
      </button>
    </div>

    <div v-else-if="cardDetail" class="space-y-6">
      <!-- Card Number Section -->
      <div
        class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-blue-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400 tracking-wide">Card Number</div>
          <button
            @click="() => { copyToClipboard(formatCardNumber(cardDetail?.cardNo)); toast.add({ severity: 'success', summary: 'Success', detail: 'Card number copied to clipboard', life: 2000 }) }"
            class="p-1.5 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy card number">
            <i class="pi pi-copy text-blue-600 dark:text-blue-400 text-sm"></i>
          </button>
        </div>
        <div class="text-xl font-mono text-gray-900 dark:text-white tracking-[0.3em] font-bold">
          {{ formatCardNumber(cardDetail.cardNo) }}
        </div>
      </div>

      <!-- Card Balance Section -->
      <div
        class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-green-200 dark:border-gray-700">
        <div class="mb-3">
          <div class="text-xs font-semibold uppercase text-green-600 dark:text-green-400 tracking-wide">Available
            Balance</div>
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ formatBalance(cardDetail.cardBalance) }} {{ cardDetail.cardCurrency }}
        </div>
      </div>

      <!-- Card Information Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wide">Cardholder
          </div>
          <div class="text-base font-semibold text-gray-900 dark:text-white">
            {{ cardDetail.firstName }} {{ cardDetail.lastName }}
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wide">Currency
          </div>
          <div class="text-base font-semibold text-gray-900 dark:text-white">
            {{ cardDetail.cardCurrency }}
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wide">Expiration
          </div>
          <div class="text-base font-semibold text-gray-900 dark:text-white">
            {{ cardDetail.expirationDate }}
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wide">CVV</div>
          <div class="text-base font-semibold text-gray-900 dark:text-white">
            {{ cardDetail.cvv }}
          </div>
        </div>
      </div>

      <!-- Billing Address Section -->
      <div v-if="hasBillingAddress" class="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide">Billing Address
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="() => { copyToClipboard(`${localDetail?.billingAddress || ''}, ${localDetail?.billingCity || ''}, ${localDetail?.billingState || ''} ${localDetail?.billingPostalCode || ''}, ${localDetail?.billingCountry || ''}`); toast.add({ severity: 'success', summary: 'Success', detail: 'Address copied to clipboard', life: 2000 }) }"
              class="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Copy address">
              <i class="pi pi-copy text-gray-600 dark:text-gray-300 text-sm"></i>
            </button>
            <Button label="Edit" icon="pi pi-pencil" size="small" @click="startEdit" />
          </div>
        </div>

        <!-- Readonly view -->
        <div v-if="!isEditing" class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <div class="font-medium break-all whitespace-pre-wrap">{{ localDetail?.billingAddress }}</div>
          <div>{{ localDetail?.billingCity }}, {{ displayState || getStateDisplay(localDetail?.billingCountry,
            localDetail?.billingState) }} {{ localDetail?.billingPostalCode }}</div>
          <div>{{ displayCountry || localDetail?.billingCountry }}</div>
        </div>

        <!-- Edit form -->
        <div v-else class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <Dropdown v-model="form.residentialCountryCode" :options="countries" option-label="name" option-value="code"
              placeholder="Select country" class="w-full" filter show-clear
              :class="{ 'p-invalid': errors.residentialCountryCode }" />
            <small v-if="errors.residentialCountryCode" class="text-red-500 text-xs mt-1">{{
              errors.residentialCountryCode }}</small>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
              <Dropdown v-if="hasStateOptions" v-model="selectedStateCode" :options="states" option-label="name"
                option-value="isoCode" placeholder="Select state or province" class="w-full" filter show-clear
                :class="{ 'p-invalid': errors.residentialState }" />
              <InputText v-else v-model="form.residentialState" placeholder="Enter state/province" class="w-full"
                :class="{ 'p-invalid': errors.residentialState }" />
              <small v-if="errors.residentialState" class="text-red-500 text-xs mt-1">{{ errors.residentialState
              }}</small>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <InputText v-model="form.residentialAddress" placeholder="Enter address" class="w-full"
              :class="{ 'p-invalid': errors.residentialAddress }" />
            <small v-if="errors.residentialAddress" class="text-red-500 text-xs mt-1">{{ errors.residentialAddress
            }}</small>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
            <InputText v-model="form.residentialPostalCode" placeholder="Enter postal code" class="w-full"
              :class="{ 'p-invalid': errors.residentialPostalCode }" />
            <small v-if="errors.residentialPostalCode" class="text-red-500 text-xs mt-1">{{ errors.residentialPostalCode
            }}</small>
          </div>

          <div class="mt-2 flex gap-3">
            <Button label="Cancel" icon="pi pi-times" severity="secondary" class="flex-1" @click="cancelEdit" />
            <Button label="Save" icon="pi pi-check" class="flex-1" :loading="saving" @click="saveAddress" />
          </div>
        </div>
      </div>

      <!-- Security Reminder -->
      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <i class="pi pi-shield text-amber-600 dark:text-amber-400 text-sm"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-amber-800 dark:text-amber-200">
              Security Reminder: Please do not share, copy, or screenshot this information.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500">
      No card details available.
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import type { CardDetailResponse } from '@/api/card'
import { useClipboard } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'
import { CardAPI } from '@/api/card'
import type { CardHolderInfo as HolderInfo } from '@/api/card'
import { getCountries, getStatesOfCountry, getCitiesOfState, getCitiesOfCountry, tryGetStateDisplayFromCache, normalizeStateCode, getStateDisplayName, type CountryOption, type StateOption, type CityOption } from '@/services/geo'
import { useCardStore } from '@/stores/card'

interface Props {
  visible: boolean
  loading: boolean
  error: string | null
  cardDetail: CardDetailResponse | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'retry'): void
  (e: 'updated', value: CardDetailResponse): void
}>()

const visible = computed(() => props.visible)
const toast = useToast()

const onUpdateVisible = (value: boolean) => {
  emit('update:visible', value)
}

const { copy: copyToClipboard } = useClipboard()
const cardStore = useCardStore()

// Country/State/City data (declare early to avoid init-order issues)
const countries = ref<CountryOption[]>([])
// 初始化国家列表（静态 JSON）
getCountries()
  .then(list => { countries.value = list; return list })
  .then(() => { refreshDisplayNames?.() })
  .catch(() => { countries.value = [] })

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

const formatBalance = (balance: number) => {
  return Number(balance || 0).toFixed(2)
}

// Local copy to reflect immediate address updates on success
const localDetail = ref<CardDetailResponse | null>(null)
const displayCountry = ref<string>('')
const displayState = ref<string>('')

// 是否有可展示的账单地址信息：
// 当 billingAddress、billingAddressUpdatable、billingCity、billingCountry、
// billingPostalCode、billingState 这几个字段全部为空/空字符串/未定义时，不展示地址模块
const hasBillingAddress = computed(() => {
  const d = localDetail.value
  if (!d)
    return false

  const fields = [
    d.billingAddress,
    d.billingAddressUpdatable,
    d.billingCity,
    d.billingCountry,
    d.billingPostalCode,
    d.billingState
  ]

  return fields.some((v) => {
    if (v === null || v === undefined)
      return false
    const s = String(v).trim()
    return s.length > 0
  })
})

watch(
  () => props.cardDetail,
  (val) => {
    localDetail.value = val ? { ...val } : null
    refreshDisplayNames()
  },
  { immediate: true }
)

async function refreshDisplayNames() {
  const countryCode = localDetail.value?.billingCountry || ''
  const stateValue = localDetail.value?.billingState || ''
  // country name: resolve via cached country list
  if (countryCode) {
    if (countries.value.length === 0) {
      try { countries.value = await getCountries() } catch { }
    }
    const match = countries.value.find(c => (c.code || '').toUpperCase() === countryCode.toUpperCase())
    displayCountry.value = match?.name || countryCode
  } else {
    displayCountry.value = ''
  }
  // state name
  if (countryCode && stateValue) {
    try {
      const name = await getStateDisplayName(countryCode, stateValue)
      displayState.value = name || stateValue
    } catch {
      displayState.value = stateValue
    }
  } else {
    displayState.value = ''
  }
}

watch(() => countries.value, () => { refreshDisplayNames() })

// ----- Edit billing address -----
const isEditing = ref(false)
const saving = ref(false)
// const canEdit = computed(() => isAddressUpdatable(props.cardDetail?.billingAddressUpdatable))

const states = ref<StateOption[]>([])
const cities = ref<CityOption[]>([])
const selectedStateCode = ref<string | null>(null)
const selectedCityName = ref<string | null>(null)

const form = reactive<HolderInfo>({
  residentialAddress: '',
  residentialCity: '',
  residentialCountryCode: 'US',
  residentialPostalCode: '',
  residentialState: ''
})

const errors = reactive({
  residentialAddress: '',
  residentialCity: '',
  residentialState: '',
  residentialPostalCode: '',
  residentialCountryCode: ''
})

const hasStateOptions = computed(() => states.value.length > 0)
const hasCityOptions = computed(() => cities.value.length > 0)

const loadCitiesForState = (countryCode?: string | null, stateIsoCode?: string | null, preserveExisting = false) => {
  if (!countryCode || !stateIsoCode) {
    cities.value = []
    selectedCityName.value = null
    if (!preserveExisting) form.residentialCity = ''
    return
  }
  getCitiesOfState(countryCode || '', stateIsoCode || '').then(list => {
    const cityList = list.slice().sort((a, b) => a.name.localeCompare(b.name))
    cities.value = cityList.map(c => ({ name: c.name }))
    if (preserveExisting && form.residentialCity) {
      const matched = cityList.find(c => c.name === form.residentialCity)
      if (matched) selectedCityName.value = matched.name
    }
  })
}

const loadCitiesForCountry = (countryCode?: string | null, preserveExisting = false) => {
  if (!countryCode) {
    cities.value = []
    selectedCityName.value = null
    if (!preserveExisting) form.residentialCity = ''
    return
  }
  getCitiesOfCountry(countryCode || '').then(list => {
    const cityList = list.slice().sort((a, b) => a.name.localeCompare(b.name))
    cities.value = cityList.map(c => ({ name: c.name }))
    if (preserveExisting && form.residentialCity) {
      const matched = cityList.find(c => c.name === form.residentialCity)
      if (matched) selectedCityName.value = matched.name
    }
  })
}

const loadStatesForCountry = (countryCode?: string | null, preserveExisting = false) => {
  if (!countryCode) {
    states.value = []
    selectedStateCode.value = null
    loadCitiesForState(undefined, undefined, preserveExisting)
    if (!preserveExisting) form.residentialState = ''
    return
  }
  getStatesOfCountry(countryCode || '').then(stateList => {
    if (stateList.length === 0) {
      states.value = []
      selectedStateCode.value = null
      if (!preserveExisting) form.residentialState = ''
      loadCitiesForCountry(countryCode, preserveExisting)
      return
    }
    states.value = stateList.map(s => ({ name: s.name, isoCode: s.isoCode }))
    if (preserveExisting && form.residentialState) {
      const matched = stateList.find(s => s.name === form.residentialState)
      if (matched) selectedStateCode.value = matched.isoCode
    }
  })
}

watch(() => form.residentialCountryCode, (newCode, oldCode) => {
  if (!oldCode) loadStatesForCountry(newCode, true)
  else if (newCode !== oldCode) loadStatesForCountry(newCode, false)
})

watch(selectedStateCode, (newCode, oldCode) => {
  if (!newCode) {
    form.residentialState = ''
    if (states.value.length === 0) loadCitiesForCountry(form.residentialCountryCode, !oldCode)
    else loadCitiesForState(form.residentialCountryCode, undefined, false)
    return
  }
  const stateEntry = states.value.find(s => s.isoCode === newCode)
  // 保存 isoCode 至表单
  form.residentialState = stateEntry?.isoCode || newCode
  loadCitiesForState(form.residentialCountryCode, newCode, !oldCode)
})

watch(selectedCityName, (newCity) => {
  form.residentialCity = newCity || ''
})

const startEdit = async () => {
  if (!props.cardDetail) return
  isEditing.value = true
  // Prefill
  form.residentialAddress = props.cardDetail.billingAddress || ''
  form.residentialCity = props.cardDetail.billingCity || ''
  form.residentialCountryCode = props.cardDetail.billingCountry || 'US'
  form.residentialPostalCode = props.cardDetail.billingPostalCode || ''
  form.residentialState = props.cardDetail.billingState || ''
  // Initialize cascading selects
  loadStatesForCountry(form.residentialCountryCode, true)
  // Try set state/city selections from names
  const stateList = await getStatesOfCountry(form.residentialCountryCode)
  const trimmed = (form.residentialState || '').trim()
  const matchedByCode = stateList.find(s => s.isoCode.toUpperCase() === trimmed.toUpperCase())
  const matchedState = matchedByCode || stateList.find(s => s.name.trim() === trimmed)
  selectedStateCode.value = matchedState ? matchedState.isoCode : null
  if (selectedStateCode.value) {
    const cityList = await getCitiesOfState(form.residentialCountryCode, selectedStateCode.value)
    cities.value = cityList.sort((a, b) => a.name.localeCompare(b.name)).map(c => ({ name: c.name }))
    const matchedCity = cityList.find(c => c.name.trim() === form.residentialCity.trim())
    selectedCityName.value = matchedCity ? matchedCity.name : null
  } else {
    loadCitiesForCountry(form.residentialCountryCode, true)
  }
}

const cancelEdit = () => {
  isEditing.value = false
  // reset selections
  selectedStateCode.value = null
  selectedCityName.value = null
  states.value = []
  cities.value = []
}

const clearErrors = () => {
  errors.residentialAddress = ''
  errors.residentialCity = ''
  errors.residentialState = ''
  errors.residentialPostalCode = ''
  errors.residentialCountryCode = ''
}

const validate = () => {
  clearErrors()
  let ok = true
  // 地址只允许中文、英文、数字及 . - , / 和空格
  const address = form.residentialAddress.trim()
  const addressPattern = /^[\u4e00-\u9fa5A-Za-z0-9\s.,\-/]+$/
  if (!address) { errors.residentialAddress = 'Address is required'; ok = false }
  else if (address.length > 100) { errors.residentialAddress = 'Address must be at most 100 characters'; ok = false }
  else if (!addressPattern.test(address)) {
    errors.residentialAddress = 'Only Chinese/English letters, numbers and . - , / are allowed'
    ok = false
  }
  if (!form.residentialCity.trim()) { errors.residentialCity = 'City is required'; ok = false }
  if (!form.residentialState.trim()) { errors.residentialState = 'State/Province is required'; ok = false }
  const postal = form.residentialPostalCode.trim()
  if (!postal) { errors.residentialPostalCode = 'Postal code is required'; ok = false }
  else if (postal.length > 10) { errors.residentialPostalCode = 'Postal code must be at most 10 characters'; ok = false }
  if (!form.residentialCountryCode) { errors.residentialCountryCode = 'Country is required'; ok = false }
  return ok
}

// Map state code to display name based on country (ISO 3166-2). Falls back to raw value.
const getStateDisplay = (countryCode?: string, stateValue?: string) => {
  if (!stateValue) return ''
  const code = (countryCode || '').toUpperCase()
  if (!code) return stateValue
  const cached = tryGetStateDisplayFromCache(code, stateValue)
  if (cached && cached !== stateValue) return cached
  return stateValue
}

const saveAddress = async () => {
  if (!validate()) return
  saving.value = true
  try {
    // 始终提交 ISO 3166-2 州/省代码（各国长度可能不同）
    let stateToSend = form.residentialState
    if (selectedStateCode.value) {
      stateToSend = selectedStateCode.value
    } else if (form.residentialCountryCode) {
      stateToSend = await normalizeStateCode(form.residentialCountryCode, form.residentialState)
    }

    const holderInfo: HolderInfo = {
      ...form,
      residentialState: stateToSend
    }
    const resp = await CardAPI.updateCardHolder(holderInfo)
    if (resp && (resp as any).success) {
      toast.add({ severity: 'success', summary: 'Saved', detail: 'Billing address saved successfully', life: 3000 })
      // Update local display immediately
      if (localDetail.value) {
        localDetail.value.billingAddress = form.residentialAddress
        localDetail.value.billingCity = form.residentialCity
        localDetail.value.billingCountry = form.residentialCountryCode
        localDetail.value.billingPostalCode = form.residentialPostalCode
        localDetail.value.billingState = form.residentialState
        // 同步更新到 Pinia 缓存，避免下次读取旧缓存
        cardStore.cacheCurrentCardDetail({ ...localDetail.value })
        // 通知父级刷新或替换详情数据
        emit('updated', { ...localDetail.value })
        // 刷新显示名称
        await refreshDisplayNames()
      }
      isEditing.value = false
    } else {
      toast.add({ severity: 'error', summary: 'Save Failed', detail: (resp as any)?.msg || 'Failed to save billing address', life: 3000 })
    }
  } catch (error) {
    console.error('Failed to save billing address:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: (error as any)?.message || 'An unexpected error occurred. Please try again.', life: 3000 })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Card Detail Dialog Styles */
::deep(.card-detail-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
}

::deep(.card-detail-dialog .p-dialog-header .p-dialog-title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

::deep(.card-detail-dialog .p-dialog-content) {
  padding: 2rem;
  background: #ffffff;
}

::deep(.card-detail-dialog .p-dialog-footer) {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1rem 2rem;
}

/* Dark mode dialog styles */
::deep(.dark .card-detail-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid #334155;
}

::deep(.dark .card-detail-dialog .p-dialog-header .p-dialog-title) {
  color: #f1f5f9;
}

::deep(.dark .card-detail-dialog .p-dialog-content) {
  background: #1e293b;
}

::deep(.dark .card-detail-dialog .p-dialog-footer) {
  background: #1e293b;
  border-top: 1px solid #334155;
}

/* Dark mode content overrides inside dialog */
:deep(.dark .card-detail-dialog .bg-gradient-to-r.from-blue-50.to-indigo-50) {
  background-image: linear-gradient(135deg, #0f172a, #1f2937) !important;
  border-color: #334155 !important;
}

:deep(.dark .card-detail-dialog .bg-gradient-to-r.from-green-50.to-emerald-50) {
  background-image: linear-gradient(135deg, #0f172a, #064e3b) !important;
  border-color: #334155 !important;
}

:deep(.dark .card-detail-dialog .bg-gray-50) {
  background-color: #374151 !important;
}

:deep(.dark .card-detail-dialog .text-gray-900) {
  color: #f9fafb !important;
}

:deep(.dark .card-detail-dialog .text-gray-700) {
  color: #e5e7eb !important;
}

:deep(.dark .card-detail-dialog .text-gray-500) {
  color: #cbd5e1 !important;
}

:deep(.dark .card-detail-dialog .border-blue-200),
:deep(.dark .card-detail-dialog .border-green-200),
:deep(.dark .card-detail-dialog .border-gray-200) {
  border-color: #334155 !important;
}

/* Button hover backgrounds in dark mode */
:deep(.dark .card-detail-dialog .hover\:bg-blue-100:hover) {
  background-color: #334155 !important;
}

:deep(.dark .card-detail-dialog .hover\:bg-gray-200:hover) {
  background-color: #374151 !important;
}
</style>
