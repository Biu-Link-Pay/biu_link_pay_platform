<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Unified Header -->
    <AppHeader title="Card Holder" :show-title="true" />

    <!-- Main Content -->
    <div
      class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <!-- Intro Banner -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="pi pi-id-card text-white text-sm"></i>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300">Manage your billing address for the card holder.</p>
        </div>
      </div>

      <!-- Content: view or edit billing address -->
      <div class="space-y-8">
        <!-- Readonly view -->
        <div v-if="holder && !isEditing">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Billing Address</h3>
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-400">Address:</span>
                <span class="font-medium text-gray-900 dark:text-white ml-4 text-right">{{ holder.residentialAddress
                }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span class="text-gray-600">City:</span>
                <span class="font-medium text-gray-900 dark:text-white ml-4 text-right">{{ holder.residentialCity
                }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span class="text-gray-600">State/Province:</span>
                <span class="font-medium text-gray-900 dark:text-white ml-4 text-right">{{ holder.residentialState
                }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span class="text-gray-600">Postal Code:</span>
                <span class="font-medium text-gray-900 dark:text-white ml-4 text-right">{{ holder.residentialPostalCode
                }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Country:</span>
                <span class="font-medium text-gray-900 dark:text-white ml-4 text-right">{{ holder.residentialCountryCode
                }}</span>
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <Button label="Edit" icon="pi pi-pencil" class="w-full sm:w-auto" @click="startEdit" />
            </div>
          </div>
        </div>

        <!-- Edit form -->
        <div v-if="isEditing">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing Address</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
              <InputText v-model="form.residentialAddress" placeholder="Enter your address" class="w-full"
                :class="{ 'p-invalid': errors.residentialAddress }" />
              <small v-if="errors.residentialAddress" class="text-red-500 text-xs mt-1">{{ errors.residentialAddress
              }}</small>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                <InputText v-model="form.residentialCity" placeholder="Enter city" class="w-full"
                  :class="{ 'p-invalid': errors.residentialCity }" />
                <small v-if="errors.residentialCity" class="text-red-500 text-xs mt-1">{{ errors.residentialCity
                }}</small>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State/Province</label>
                <InputText v-model="form.residentialState" placeholder="Enter state/province" class="w-full"
                  :class="{ 'p-invalid': errors.residentialState }" />
                <small v-if="errors.residentialState" class="text-red-500 text-xs mt-1">{{ errors.residentialState
                }}</small>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Postal Code</label>
                <InputText v-model="form.residentialPostalCode" placeholder="Enter postal code" class="w-full"
                  :class="{ 'p-invalid': errors.residentialPostalCode }" />
                <small v-if="errors.residentialPostalCode" class="text-red-500 text-xs mt-1">{{
                  errors.residentialPostalCode }}</small>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                <Dropdown v-model="form.residentialCountryCode" :options="countries" option-label="name"
                  option-value="code" placeholder="Select country" class="w-full"
                  :class="{ 'p-invalid': errors.residentialCountryCode }" />
                <small v-if="errors.residentialCountryCode" class="text-red-500 text-xs mt-1">{{
                  errors.residentialCountryCode }}</small>
              </div>
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
              <InputText v-model="form.rechargeAmount" type="text" placeholder="20" class="w-32"
                :class="{ 'p-invalid': errors.rechargeAmount }" />
              <span class="text-gray-600 dark:text-gray-400">{{ cardStore.selectedCardBin?.cardCurrency }}</span>
            </div>
            <small v-if="errors.rechargeAmount" class="text-red-500 text-xs mt-1">{{ errors.rechargeAmount }}</small>
          </div>

          <!-- Quick Amount Buttons -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button v-for="amount in quickAmounts" :key="amount" :label="`$${amount}`" :class="form.rechargeAmount === amount.toString()
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
              class="w-full py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              @click="form.rechargeAmount = amount.toString()" />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bottom-buttons-container">
        <Button label="Back" icon="pi pi-arrow-left" severity="secondary"
          class="bottom-button-dual bottom-button-dual-secondary" @click="goBack" />
        <Button :disabled="!canConfirm" :label="confirmButtonText" icon="pi pi-check" :loading="loading"
          class="bottom-button-dual bottom-button-dual-primary" @click="handleConfirm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useCardStore } from '@/stores/card'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import AppHeader from '@/components/AppHeader.vue'
import { CardAPI } from '@/api/card'
import type { CardHolderInfo as HolderInfo, CardHolderResponse } from '@/api/card'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()
const authStore = useAuthStore()

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
  rechargeAmount: '20'
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

// Countries
const countries = ref([
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Canada', code: 'CA' },
  { name: 'Australia', code: 'AU' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Japan', code: 'JP' },
  { name: 'China', code: 'CN' }
])

// Quick recharge amounts
const quickAmounts = ref([20, 50, 100, 200])

// Computed properties for button states
const canConfirm = computed(() => {
  return !isEditing.value && !!holder.value
})

const confirmButtonText = computed(() => {
  if (isEditing.value) {
    return 'Please save address first'
  } else if (!holder.value) {
    return 'Please add address first'
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
    const response = await CardAPI.queryCardHolder(buildHeaders())
    if (response.success && response.model) {
      holder.value = response.model
      // Prefill form from holder
      form.residentialAddress = response.model.residentialAddress
      form.residentialCity = response.model.residentialCity
      form.residentialCountryCode = response.model.residentialCountryCode
      form.residentialPostalCode = response.model.residentialPostalCode
      form.residentialState = response.model.residentialState
      isEditing.value = false
    } else {
      // Not found -> allow create directly
      holder.value = null
      isEditing.value = true
    }
  } catch (e) {
    // Treat as not found
    holder.value = null
    isEditing.value = true
  } finally {
    loading.value = false
  }
}

const startEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  // Reset form to original values
  if (holder.value) {
    form.residentialAddress = holder.value.residentialAddress
    form.residentialCity = holder.value.residentialCity
    form.residentialCountryCode = holder.value.residentialCountryCode
    form.residentialPostalCode = holder.value.residentialPostalCode
    form.residentialState = holder.value.residentialState
  } else {
    // Reset to empty if no holder
    form.residentialAddress = ''
    form.residentialCity = ''
    form.residentialCountryCode = 'US'
    form.residentialPostalCode = ''
    form.residentialState = ''
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

  if (!form.residentialAddress.trim()) {
    addressErrors.residentialAddress = 'Address is required'
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
    const holderInfo: HolderInfo = {
      residentialAddress: form.residentialAddress,
      residentialCity: form.residentialCity,
      residentialCountryCode: form.residentialCountryCode,
      residentialPostalCode: form.residentialPostalCode,
      residentialState: form.residentialState
    }

    let ok = false
    if (holder.value) {
      // Update
      const resp = await CardAPI.updateCardHolder(holderInfo, buildHeaders())
      ok = !!resp.success
    } else {
      // Create (use store helper)
      const result = await cardStore.saveCardHolder(holderInfo)
      ok = !!result.success
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
        detail: 'Failed to save your billing address. Please try again.',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Error saving billing address:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred. Please try again.',
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
  const rechargeAmount = parseFloat(form.rechargeAmount)
  if (!form.rechargeAmount || isNaN(rechargeAmount) || rechargeAmount <= 0) {
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
          action: route.query.action || 'apply' // 传递操作类型：recharge 或 apply
        }
      })
    }, 2000)
  } catch (error) {
    console.error('Error confirming recharge:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred. Please try again.',
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


// Initialize: query holder
onMounted(() => {
  loadHolder()
})
</script>
