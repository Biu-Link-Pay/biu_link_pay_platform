<template>
  <div class="min-h-screen bg-white">
    <!-- Mobile Header -->
    <div class="md:hidden">
      <div class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <button class="w-10 h-10 flex items-center justify-center" @click="goBack">
          <i class="pi pi-arrow-left text-gray-600"></i>
        </button>
        <h1 class="text-lg font-semibold text-gray-900">Apply for a Card</h1>
        <div class="w-10"></div>
      </div>

      <!-- Mobile Status Bar -->
      <div class="flex items-center justify-between px-4 py-2 bg-gray-50 text-xs text-gray-600">
        <span>9:27</span>
        <div class="flex items-center space-x-1">
          <i class="pi pi-signal text-sm"></i>
          <i class="pi pi-wifi text-sm"></i>
          <i class="pi pi-battery-full text-sm"></i>
        </div>
      </div>
    </div>

    <!-- Desktop Header -->
    <div class="hidden md:block">
      <nav class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <button class="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              @click="goBack">
              <i class="pi pi-arrow-left text-gray-600"></i>
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Apply for a Card</h1>
          </div>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 py-6 md:px-6 md:py-8">
      <!-- Step Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-center space-x-4 mb-4">
          <div class="flex items-center">
            <div
              class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1</div>
            <span class="ml-2 text-sm font-medium text-gray-900">Card Selection</span>
          </div>
          <div class="w-8 h-0.5 bg-blue-600"></div>
          <div class="flex items-center">
            <div
              class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              2</div>
            <span class="ml-2 text-sm font-medium text-gray-900">Personal Info</span>
          </div>
          <div class="w-8 h-0.5 bg-gray-300"></div>
          <div class="flex items-center">
            <div
              class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
              3</div>
            <span class="ml-2 text-sm font-medium text-gray-500">Confirmation</span>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="space-y-8">
        <!-- Personal Information Section -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-6">Please enter your information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <!-- First Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">First name</label>
              <InputText v-model="form.firstName" placeholder="Enter first name" class="w-full"
                :class="{ 'p-invalid': errors.firstName }" />
              <small v-if="errors.firstName" class="text-red-500 text-xs mt-1">{{ errors.firstName }}</small>
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Last name</label>
              <InputText v-model="form.lastName" placeholder="Enter last name" class="w-full"
                :class="{ 'p-invalid': errors.lastName }" />
              <small v-if="errors.lastName" class="text-red-500 text-xs mt-1">{{ errors.lastName }}</small>
            </div>
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
            <div class="flex gap-2">
              <Dropdown v-model="form.countryCode" :options="countryCodes" option-label="label" option-value="value"
                placeholder="+1" class="w-24" />
              <InputText v-model="form.phoneNumber" placeholder="Enter phone number" class="flex-1"
                :class="{ 'p-invalid': errors.phoneNumber }" />
            </div>
            <small v-if="errors.phoneNumber" class="text-red-500 text-xs mt-1">{{ errors.phoneNumber }}</small>
          </div>
        </div>

        <!-- Address Information Section -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>

          <div class="space-y-4">
            <!-- Address -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <InputText v-model="form.residentialAddress" placeholder="Enter your address" class="w-full"
                :class="{ 'p-invalid': errors.residentialAddress }" />
              <small v-if="errors.residentialAddress" class="text-red-500 text-xs mt-1">{{ errors.residentialAddress
              }}</small>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- City -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                <InputText v-model="form.residentialCity" placeholder="Enter city" class="w-full"
                  :class="{ 'p-invalid': errors.residentialCity }" />
                <small v-if="errors.residentialCity" class="text-red-500 text-xs mt-1">{{ errors.residentialCity
                }}</small>
              </div>

              <!-- State -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                <InputText v-model="form.residentialState" placeholder="Enter state/province" class="w-full"
                  :class="{ 'p-invalid': errors.residentialState }" />
                <small v-if="errors.residentialState" class="text-red-500 text-xs mt-1">{{ errors.residentialState
                }}</small>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Postal Code -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <InputText v-model="form.residentialPostalCode" placeholder="Enter postal code" class="w-full"
                  :class="{ 'p-invalid': errors.residentialPostalCode }" />
                <small v-if="errors.residentialPostalCode" class="text-red-500 text-xs mt-1">{{
                  errors.residentialPostalCode }}</small>
              </div>

              <!-- Country -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <Dropdown v-model="form.residentialCountryCode" :options="countries" option-label="name"
                  option-value="code" placeholder="Select country" class="w-full"
                  :class="{ 'p-invalid': errors.residentialCountryCode }" />
                <small v-if="errors.residentialCountryCode" class="text-red-500 text-xs mt-1">{{
                  errors.residentialCountryCode }}</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Recharge Section -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-6">Please complete your first Recharge</h2>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Recharge amount</label>
            <div class="flex items-center gap-2">
              <InputText v-model.number="form.rechargeAmount" type="number" placeholder="10" class="w-32"
                :class="{ 'p-invalid': errors.rechargeAmount }" />
              <span class="text-gray-600">USD</span>
            </div>
            <small v-if="errors.rechargeAmount" class="text-red-500 text-xs mt-1">{{ errors.rechargeAmount }}</small>
          </div>

          <!-- Quick Amount Buttons -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button v-for="amount in quickAmounts" :key="amount" :label="`$${amount}`"
              :class="form.rechargeAmount === amount ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
              class="w-full py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
              @click="form.rechargeAmount = amount" />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4">
        <Button label="Back" icon="pi pi-arrow-left" severity="secondary" class="w-full sm:w-auto" @click="goBack" />
        <Button label="Confirm" icon="pi pi-check" :loading="loading" class="w-full sm:flex-1" @click="handleConfirm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useCardStore } from '@/stores/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()

// Form data
const form = reactive({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  countryCode: '+1',
  residentialAddress: '',
  residentialCity: '',
  residentialState: '',
  residentialPostalCode: '',
  residentialCountryCode: 'US',
  rechargeAmount: 10
})

// Form validation errors
const errors = reactive({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  residentialAddress: '',
  residentialCity: '',
  residentialState: '',
  residentialPostalCode: '',
  residentialCountryCode: '',
  rechargeAmount: ''
})

// Loading state
const loading = ref(false)

// Country codes for phone
const countryCodes = ref([
  { label: '+1', value: '+1' },
  { label: '+44', value: '+44' },
  { label: '+86', value: '+86' },
  { label: '+81', value: '+81' },
  { label: '+33', value: '+33' },
  { label: '+49', value: '+49' }
])

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
const quickAmounts = ref([10, 50, 100, 200])

// Validation functions
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validate required fields
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required'
    isValid = false
  }

  if (!form.residentialAddress.trim()) {
    errors.residentialAddress = 'Address is required'
    isValid = false
  }

  if (!form.residentialCity.trim()) {
    errors.residentialCity = 'City is required'
    isValid = false
  }

  if (!form.residentialState.trim()) {
    errors.residentialState = 'State/Province is required'
    isValid = false
  }

  if (!form.residentialPostalCode.trim()) {
    errors.residentialPostalCode = 'Postal code is required'
    isValid = false
  }

  if (!form.residentialCountryCode) {
    errors.residentialCountryCode = 'Country is required'
    isValid = false
  }

  if (!form.rechargeAmount || form.rechargeAmount <= 0) {
    errors.rechargeAmount = 'Please enter a valid recharge amount'
    isValid = false
  }

  return isValid
}

// Handle form submission
const handleConfirm = async () => {
  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields',
      life: 3000
    })
    return
  }

  loading.value = true

  try {
    // Prepare card holder info for API
    const holderInfo = {
      residentialAddress: form.residentialAddress,
      residentialCity: form.residentialCity,
      residentialCountryCode: form.residentialCountryCode,
      residentialPostalCode: form.residentialPostalCode,
      residentialState: form.residentialState
    }

    // Save card holder information
    const result = await cardStore.saveCardHolder(holderInfo)

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Information Saved',
        detail: result.message || 'Your information has been saved successfully',
        life: 3000
      })

      // Navigate to confirmation page or next step
      setTimeout(() => {
        router.push({
          name: 'CardList',
          query: {
            success: 'true',
            message: 'Card application submitted successfully'
          }
        })
      }, 2000)
    } else {
      toast.add({
        severity: 'error',
        summary: 'Save Failed',
        detail: result.error || 'Failed to save your information. Please try again.',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Error saving card holder info:', error)
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


// Initialize form with route params if available
onMounted(() => {
  // Get card info from route query if available
  const cardName = route.query.cardName as string
  if (cardName) {
    console.log('Applying for card:', cardName)
  }
})
</script>
