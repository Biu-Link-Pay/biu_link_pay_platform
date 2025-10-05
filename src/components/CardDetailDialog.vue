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
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs font-semibold uppercase text-blue-600 tracking-wide">Card Number</div>
          <button @click="copyToClipboard(formatCardNumber(cardDetail.cardNo))"
            class="p-1.5 hover:bg-blue-100 rounded-lg transition-colors" title="Copy card number">
            <i class="pi pi-copy text-blue-600 text-sm"></i>
          </button>
        </div>
        <div class="text-xl font-mono text-gray-900 tracking-[0.3em] font-bold">
          {{ formatCardNumber(cardDetail.cardNo) }}
        </div>
      </div>

      <!-- Card Balance Section -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <div class="mb-3">
          <div class="text-xs font-semibold uppercase text-green-600 tracking-wide">Available Balance</div>
        </div>
        <div class="text-2xl font-bold text-gray-900">
          {{ formatBalance(cardDetail.cardBalance) }} {{ cardDetail.cardCurrency }}
        </div>
      </div>

      <!-- Card Information Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wide">Cardholder</div>
          <div class="text-base font-semibold text-gray-900">
            {{ cardDetail.firstName }} {{ cardDetail.lastName }}
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wide">Currency</div>
          <div class="text-base font-semibold text-gray-900">
            {{ cardDetail.cardCurrency }}
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wide">Expiration</div>
          <div class="text-base font-semibold text-gray-900">
            {{ cardDetail.expirationDate }}
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wide">CVV</div>
          <div class="text-base font-semibold text-gray-900">
            {{ cardDetail.cvv }}
          </div>
        </div>
      </div>

      <!-- Billing Address Section -->
      <div class="bg-gray-50 rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs font-semibold uppercase text-gray-500 tracking-wide">Billing Address</div>
          <div class="flex items-center gap-2">
            <button
              @click="copyToClipboard(`${localDetail?.billingAddress || ''}, ${localDetail?.billingCity || ''}, ${localDetail?.billingState || ''} ${localDetail?.billingPostalCode || ''}, ${localDetail?.billingCountry || ''}`)"
              class="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="Copy address">
              <i class="pi pi-copy text-gray-600 text-sm"></i>
            </button>
            <Button v-if="canEdit && !isEditing" label="Edit" icon="pi pi-pencil" size="small" @click="startEdit" />
          </div>
        </div>

        <!-- Readonly view -->
        <div v-if="!isEditing" class="space-y-1 text-sm text-gray-700">
          <div class="font-medium">{{ localDetail?.billingAddress }}</div>
          <div>{{ localDetail?.billingCity }}, {{ localDetail?.billingState }} {{ localDetail?.billingPostalCode }}
          </div>
          <div>{{ localDetail?.billingCountry }}</div>
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

      <!-- Address Update Status -->
      <div class="flex items-center gap-2 p-3 rounded-lg" :class="isAddressUpdatable(cardDetail.billingAddressUpdatable)
        ? 'bg-green-50 border border-green-200'
        : 'bg-orange-50 border border-orange-200'">
        <i :class="isAddressUpdatable(cardDetail.billingAddressUpdatable)
          ? 'pi pi-check-circle text-green-600'
          : 'pi pi-info-circle text-orange-600'"></i>
        <span :class="isAddressUpdatable(cardDetail.billingAddressUpdatable)
          ? 'text-green-700 text-sm'
          : 'text-orange-700 text-sm'">
          {{ isAddressUpdatable(cardDetail.billingAddressUpdatable)
            ? 'Billing address can be updated'
            : 'Billing address cannot be updated' }}
        </span>
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
import { copyWithToast } from '@/utils'
import { useToast } from 'primevue/usetoast'
import { CardAPI } from '@/api/card'
import type { CardHolderInfo as HolderInfo } from '@/api/card'
import * as CSC from 'country-state-city'

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
}>()

const visible = computed(() => props.visible)
const toast = useToast()

const onUpdateVisible = (value: boolean) => {
  emit('update:visible', value)
}

const copyToClipboard = async (text: string) => {
  await copyWithToast(text, toast)
}

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

watch(
  () => props.cardDetail,
  (val) => {
    localDetail.value = val ? { ...val } : null
  },
  { immediate: true }
)

// ----- Edit billing address -----
const isEditing = ref(false)
const saving = ref(false)
const canEdit = computed(() => isAddressUpdatable(props.cardDetail?.billingAddressUpdatable))

// Country/State/City data
const { Country, State, City } = CSC

interface CountryOption { name: string; code: string }
interface StateOption { name: string; isoCode: string }
interface CityOption { name: string }

const countries = ref<CountryOption[]>(
  Country.getAllCountries()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(c => ({ name: c.name, code: c.isoCode }))
)
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
  const cityList = (City.getCitiesOfState(countryCode, stateIsoCode) || []).sort((a, b) => a.name.localeCompare(b.name))
  cities.value = cityList.map(c => ({ name: c.name }))
  if (preserveExisting && form.residentialCity) {
    const matched = cityList.find(c => c.name === form.residentialCity)
    if (matched) selectedCityName.value = matched.name
  }
}

const loadCitiesForCountry = (countryCode?: string | null, preserveExisting = false) => {
  if (!countryCode) {
    cities.value = []
    selectedCityName.value = null
    if (!preserveExisting) form.residentialCity = ''
    return
  }
  const cityList = (City.getCitiesOfCountry(countryCode) || []).sort((a, b) => a.name.localeCompare(b.name))
  cities.value = cityList.map(c => ({ name: c.name }))
  if (preserveExisting && form.residentialCity) {
    const matched = cityList.find(c => c.name === form.residentialCity)
    if (matched) selectedCityName.value = matched.name
  }
}

const loadStatesForCountry = (countryCode?: string | null, preserveExisting = false) => {
  if (!countryCode) {
    states.value = []
    selectedStateCode.value = null
    loadCitiesForState(undefined, undefined, preserveExisting)
    if (!preserveExisting) form.residentialState = ''
    return
  }
  const stateList = (State.getStatesOfCountry(countryCode) || []).sort((a, b) => a.name.localeCompare(b.name))
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
  form.residentialState = stateEntry?.name || ''
  loadCitiesForState(form.residentialCountryCode, newCode, !oldCode)
})

watch(selectedCityName, (newCity) => {
  form.residentialCity = newCity || ''
})

const startEdit = () => {
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
  const stateList = State.getStatesOfCountry(form.residentialCountryCode) || []
  const matchedState = stateList.find(s => s.name.trim() === form.residentialState.trim())
  selectedStateCode.value = matchedState ? matchedState.isoCode : null
  if (selectedStateCode.value) {
    const cityList = City.getCitiesOfState(form.residentialCountryCode, selectedStateCode.value) || []
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
  if (!form.residentialAddress.trim()) { errors.residentialAddress = 'Address is required'; ok = false }
  if (!form.residentialCity.trim()) { errors.residentialCity = 'City is required'; ok = false }
  if (!form.residentialState.trim()) { errors.residentialState = 'State/Province is required'; ok = false }
  if (!form.residentialPostalCode.trim()) { errors.residentialPostalCode = 'Postal code is required'; ok = false }
  if (!form.residentialCountryCode) { errors.residentialCountryCode = 'Country is required'; ok = false }
  return ok
}

const saveAddress = async () => {
  if (!validate()) return
  saving.value = true
  try {
    const holderInfo: HolderInfo = { ...form }
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
      }
      isEditing.value = false
    } else {
      toast.add({ severity: 'error', summary: 'Save Failed', detail: (resp as any)?.msg || 'Failed to save billing address', life: 3000 })
    }
  } catch (error) {
    console.error('Failed to save billing address:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred. Please try again.', life: 3000 })
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
</style>
