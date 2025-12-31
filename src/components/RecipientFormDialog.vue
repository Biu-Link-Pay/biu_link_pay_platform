<template>
  <Dialog v-model:visible="visible" modal :header="'Add Recipient'" :style="{ width: '90vw', maxWidth: '800px' }"
    :closable="true" @hide="handleClose">
    <template #default>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Bank Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bank Name <span class="text-red-500">*</span>
            </label>
            <Dropdown v-model="recipientForm.bankName" :options="bankNames" placeholder="Select bank"
              class="w-full" filter show-clear :class="{ 'p-invalid': recipientErrors.bankName }" />
            <small v-if="recipientErrors.bankName" class="text-red-500 text-xs mt-1">{{
              recipientErrors.bankName }}</small>
          </div>

          <!-- Bank Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bank Location <span class="text-red-500">*</span>
            </label>
            <InputText v-model="recipientForm.bankLocation" placeholder="Enter bank location" class="w-full"
              :class="{ 'p-invalid': recipientErrors.bankLocation }" />
            <small v-if="recipientErrors.bankLocation" class="text-red-500 text-xs mt-1">{{
              recipientErrors.bankLocation }}</small>
          </div>

          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency <span class="text-red-500">*</span>
            </label>
            <InputText v-model="recipientForm.currency" placeholder="Enter currency (e.g., USD)" class="w-full"
              :class="{ 'p-invalid': recipientErrors.currency }" />
            <small v-if="recipientErrors.currency" class="text-red-500 text-xs mt-1">{{
              recipientErrors.currency }}</small>
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <Dropdown v-model="selectedPhoneAreaCode" :options="phoneAreaCodes" option-label="label"
                option-value="value" placeholder="Code" class="w-32" filter show-clear
                :class="{ 'p-invalid': recipientErrors.phoneAreaCode }" />
              <InputText v-model="phoneNumber" placeholder="Enter phone number" class="flex-1"
                :class="{ 'p-invalid': recipientErrors.reservedPhoneNumber }" />
            </div>
            <small v-if="recipientErrors.phoneAreaCode || recipientErrors.reservedPhoneNumber"
              class="text-red-500 text-xs mt-1">
              {{ recipientErrors.phoneAreaCode || recipientErrors.reservedPhoneNumber }}
            </small>
          </div>

          <!-- Country (Fixed to Hong Kong) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country <span class="text-red-500">*</span>
            </label>
            <InputText :value="'Hong Kong'" readonly
              class="w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              :class="{ 'p-invalid': recipientErrors.recipientLocation }" />
            <small v-if="recipientErrors.recipientLocation" class="text-red-500 text-xs mt-1">{{
              recipientErrors.recipientLocation }}</small>
          </div>

          <!-- Recipient Province/State -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Province/State <span class="text-red-500">*</span>
            </label>
            <Dropdown v-if="hasStateOptions" v-model="selectedStateCode" :options="states" option-label="name"
              option-value="isoCode" placeholder="Select state or province" class="w-full" filter show-clear
              :class="{ 'p-invalid': recipientErrors.recipientProvince }" />
            <InputText v-else v-model="recipientForm.recipientProvince" placeholder="Enter province"
              class="w-full" :class="{ 'p-invalid': recipientErrors.recipientProvince }" />
            <small v-if="recipientErrors.recipientProvince" class="text-red-500 text-xs mt-1">{{
              recipientErrors.recipientProvince }}</small>
          </div>

          <!-- Recipient City -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            <Dropdown v-if="hasCityOptions" v-model="selectedCityName" :options="cities" option-label="name"
              option-value="name" placeholder="Select city" class="w-full" filter show-clear
              :class="{ 'p-invalid': recipientErrors.recipientCity }" />
            <InputText v-else v-model="recipientForm.recipientCity" placeholder="Enter city" class="w-full"
              :class="{ 'p-invalid': recipientErrors.recipientCity }" />
            <small v-if="recipientErrors.recipientCity" class="text-red-500 text-xs mt-1">{{
              recipientErrors.recipientCity }}</small>
          </div>

          <!-- Recipient Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipient Address <span class="text-red-500">*</span>
            </label>
            <InputText v-model="recipientForm.recipientAddress" placeholder="Enter address" class="w-full"
              :class="{ 'p-invalid': recipientErrors.recipientAddress }" />
            <small v-if="recipientErrors.recipientAddress" class="text-red-500 text-xs mt-1">{{
              recipientErrors.recipientAddress }}</small>
          </div>

          <!-- Bank Account Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bank Account Number <span class="text-red-500">*</span>
            </label>
            <InputText v-model="recipientForm.bankAccountNumber" placeholder="Enter bank account number"
              class="w-full" :class="{ 'p-invalid': recipientErrors.bankAccountNumber }" />
            <small v-if="recipientErrors.bankAccountNumber" class="text-red-500 text-xs mt-1">{{
              recipientErrors.bankAccountNumber }}</small>
          </div>

          <!-- SWIFT Code -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SWIFT Code <span class="text-red-500">*</span>
            </label>
            <InputText v-model="recipientForm.swiftCode" placeholder="Enter SWIFT code" class="w-full"
              :class="{ 'p-invalid': recipientErrors.swiftCode }" />
            <small v-if="recipientErrors.swiftCode" class="text-red-500 text-xs mt-1">{{
              recipientErrors.swiftCode }}</small>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="handleClose" />
        <Button label="Save Recipient" icon="pi pi-check" :loading="savingRecipient" @click="handleSave" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import { CardAPI, type SaveRecipientParams } from '@/api/card'
import { OrderAPI } from '@/api/order'
import { getStatesOfCountry, getCitiesOfState, getCitiesOfCountry, type StateOption, type CityOption } from '@/services/geo'
import { getCountryCallingCode } from 'libphonenumber-js'
import { getCountries as getGeoCountries } from '@/services/geo'

interface Props {
  visible: boolean
  bankNames: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'saved': []
}>()

const toast = useToast()

// Dialog visibility
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Saving state
const savingRecipient = ref(false)

// Phone number data
const phoneAreaCodes = ref<Array<{ label: string; value: string }>>([])
const selectedPhoneAreaCode = ref<string>('+852') // Default to Hong Kong
const phoneNumber = ref<string>('')

// Location data for address input
const states = ref<StateOption[]>([])
const cities = ref<CityOption[]>([])
const selectedCountryCode = ref<string>('HK') // Fixed to Hong Kong
const selectedStateCode = ref<string | null>(null)
const selectedCityName = ref<string | null>(null)

// Recipient form data
const recipientForm = reactive<SaveRecipientParams>({
  bankName: '',
  bankLocation: '',
  currency: '',
  reservedPhoneNumber: '',
  recipientLocation: '',
  recipientProvince: '',
  recipientCity: '',
  recipientAddress: '',
  bankAccountNumber: '',
  swiftCode: ''
})

// Recipient form validation errors
const recipientErrors = reactive({
  bankName: '',
  bankLocation: '',
  currency: '',
  phoneAreaCode: '',
  reservedPhoneNumber: '',
  recipientLocation: '',
  recipientProvince: '',
  recipientCity: '',
  recipientAddress: '',
  bankAccountNumber: '',
  swiftCode: ''
})

// Computed properties for location options
const hasStateOptions = computed(() => states.value.length > 0)
const hasCityOptions = computed(() => cities.value.length > 0)

// Helper functions for cascading location selects
const loadCitiesForState = async (
  countryCode: string | null | undefined,
  stateIsoCode: string | null | undefined,
  preserveExisting = false
) => {
  if (!countryCode || !stateIsoCode) {
    cities.value = []
    selectedCityName.value = null
    if (!preserveExisting) {
      recipientForm.recipientCity = ''
    }
    return
  }

  try {
    const list = await getCitiesOfState(countryCode, stateIsoCode)
    const cityList = list.slice().sort((a, b) => a.name.localeCompare(b.name))
    cities.value = cityList.map(city => ({ name: city.name }))

    if (preserveExisting && recipientForm.recipientCity) {
      const matchedCity = cityList.find(city => city.name === recipientForm.recipientCity)
      if (matchedCity) {
        selectedCityName.value = matchedCity.name
        return
      }
    }

    selectedCityName.value = null
    recipientForm.recipientCity = ''
  } catch (error) {
    console.error('Error loading cities for state:', error)
    cities.value = []
    selectedCityName.value = null
    if (!preserveExisting) {
      recipientForm.recipientCity = ''
    }
  }
}

const loadCitiesForCountry = async (
  countryCode: string | null | undefined,
  preserveExisting = false
) => {
  if (!countryCode) {
    cities.value = []
    selectedCityName.value = null
    if (!preserveExisting) {
      recipientForm.recipientCity = ''
    }
    return
  }

  try {
    const list = await getCitiesOfCountry(countryCode)
    const cityList = list.slice().sort((a, b) => a.name.localeCompare(b.name))
    cities.value = cityList.map(city => ({ name: city.name }))

    if (preserveExisting && recipientForm.recipientCity) {
      const matchedCity = cityList.find(city => city.name === recipientForm.recipientCity)
      if (matchedCity) {
        selectedCityName.value = matchedCity.name
        return
      }
    }

    selectedCityName.value = null
    recipientForm.recipientCity = ''
  } catch (error) {
    console.error('Error loading cities for country:', error)
    cities.value = []
    selectedCityName.value = null
    if (!preserveExisting) {
      recipientForm.recipientCity = ''
    }
  }
}

const loadStatesForCountry = async (countryCode: string | null | undefined, preserveExisting = false) => {
  if (!countryCode) {
    states.value = []
    selectedStateCode.value = null
    await loadCitiesForState(undefined, undefined, preserveExisting)
    if (!preserveExisting) {
      recipientForm.recipientProvince = ''
    }
    return
  }

  try {
    const stateList = await getStatesOfCountry(countryCode)
    if (stateList.length === 0) {
      states.value = []
      selectedStateCode.value = null
      if (!preserveExisting) {
        recipientForm.recipientProvince = ''
      }
      await loadCitiesForCountry(countryCode, preserveExisting)
      return
    }

    states.value = stateList.map(state => ({ name: state.name, isoCode: state.isoCode }))

    if (preserveExisting && recipientForm.recipientProvince) {
      const target = recipientForm.recipientProvince.trim()
      // Parse format: {countryCode}_{stateCode} (e.g., HK_HWC)
      let stateCodeToMatch = target
      if (target.includes('_')) {
        const parts = target.split('_')
        if (parts.length >= 2) {
          stateCodeToMatch = parts.slice(1).join('_') // Get everything after first underscore
        }
      }

      const matchedByCode = stateList.find(state => state.isoCode.toUpperCase() === stateCodeToMatch.toUpperCase())
      if (matchedByCode) {
        selectedStateCode.value = matchedByCode.isoCode
        // Update to correct format
        recipientForm.recipientProvince = `${countryCode}_${matchedByCode.isoCode}`
        await loadCitiesForState(countryCode, matchedByCode.isoCode, preserveExisting)
        return
      }
      const matchedByName = stateList.find(state => state.name.trim() === stateCodeToMatch)
      if (matchedByName) {
        selectedStateCode.value = matchedByName.isoCode
        // Update to correct format
        recipientForm.recipientProvince = `${countryCode}_${matchedByName.isoCode}`
        await loadCitiesForState(countryCode, matchedByName.isoCode, preserveExisting)
        return
      }
    }

    selectedStateCode.value = null
    recipientForm.recipientProvince = ''
    await loadCitiesForState(countryCode, undefined, false)
  } catch (error) {
    console.error('Error loading states for country:', error)
    states.value = []
    selectedStateCode.value = null
    if (!preserveExisting) {
      recipientForm.recipientProvince = ''
    }
    await loadCitiesForCountry(countryCode, preserveExisting)
  }
}

// Country is fixed to HK, so we don't need to watch for changes
// Initialize recipientLocation with HK
recipientForm.recipientLocation = 'HK'

// Watch for state changes
watch(
  selectedStateCode,
  async (newCode, oldCode) => {
    if (!newCode) {
      recipientForm.recipientProvince = ''
      if (states.value.length === 0) {
        await loadCitiesForCountry(selectedCountryCode.value, !oldCode)
      } else {
        await loadCitiesForState(selectedCountryCode.value, undefined, false)
      }
      return
    }

    const stateEntry = states.value.find(state => state.isoCode === newCode)
    // Save as {countryCode}_{stateCode} format (e.g., HK_HWC)
    const stateCode = stateEntry?.isoCode || newCode
    recipientForm.recipientProvince = `${selectedCountryCode.value}_${stateCode}`
    await loadCitiesForState(selectedCountryCode.value, newCode, !oldCode)
  }
)

// Watch for city changes
watch(
  selectedCityName,
  newCity => {
    recipientForm.recipientCity = newCity || ''
  }
)

// Initialize phone area codes using library
const initializePhoneAreaCodes = async () => {
  try {
    // Get all countries from geo service
    const countries = await getGeoCountries()
    const areaCodeList: Array<{ label: string; value: string }> = []
    const callingCodeMap = new Map<string, { name: string; code: string }>()

    // Get calling code for each country using libphonenumber-js
    for (const country of countries) {
      try {
        const callingCode = getCountryCallingCode(country.code as any)
        if (callingCode) {
          const code = `+${callingCode}`
          // If multiple countries share the same calling code, keep the first one or prefer HK
          if (!callingCodeMap.has(code) || country.code === 'HK') {
            callingCodeMap.set(code, {
              name: country.name,
              code: country.code
            })
          }
        }
      } catch (error) {
        // Skip countries without calling code
        console.warn(`No calling code for ${country.code}: ${country.name}`)
      }
    }

    // Build area code list
    callingCodeMap.forEach(({ name, code: countryCode }, callingCode) => {
      areaCodeList.push({
        label: `${name} (${callingCode})`,
        value: callingCode
      })
    })

    // Sort by country name, put Hong Kong first
    areaCodeList.sort((a, b) => {
      if (a.value === '+852') return -1
      if (b.value === '+852') return 1
      return a.label.localeCompare(b.label)
    })

    phoneAreaCodes.value = areaCodeList
    console.log('Phone area codes initialized from library:', areaCodeList.length, 'codes')
  } catch (error) {
    console.error('Error initializing phone area codes:', error)
    // Fallback to common area codes
    phoneAreaCodes.value = [
      { label: 'Hong Kong (+852)', value: '+852' },
      { label: 'China (+86)', value: '+86' },
      { label: 'United States (+1)', value: '+1' },
      { label: 'United Kingdom (+44)', value: '+44' },
      { label: 'Singapore (+65)', value: '+65' },
      { label: 'Japan (+81)', value: '+81' },
      { label: 'South Korea (+82)', value: '+82' },
      { label: 'Australia (+61)', value: '+61' },
      { label: 'Canada (+1)', value: '+1' },
      { label: 'Taiwan (+886)', value: '+886' },
      { label: 'Malaysia (+60)', value: '+60' },
      { label: 'Thailand (+66)', value: '+66' }
    ]
  }
}

// Initialize location data (Hong Kong only)
const initializeLocationData = async () => {
  try {
    // Country is fixed to Hong Kong
    selectedCountryCode.value = 'HK'
    recipientForm.recipientLocation = 'HK'

    // Load Hong Kong states/cities
    await loadStatesForCountry('HK', false)
  } catch (error) {
    console.error('Error initializing location data:', error)
  }
}

// Reset recipient form
const resetRecipientForm = () => {
  // Reset form
  Object.keys(recipientForm).forEach(key => {
    recipientForm[key as keyof SaveRecipientParams] = '' as any
  })
  Object.keys(recipientErrors).forEach(key => {
    recipientErrors[key as keyof typeof recipientErrors] = ''
  })
  // Reset location selections to default (Hong Kong)
  selectedCountryCode.value = 'HK'
  recipientForm.recipientLocation = 'HK'
  selectedStateCode.value = null
  selectedCityName.value = null
  recipientForm.recipientProvince = ''
  recipientForm.recipientCity = ''
  recipientForm.bankName = ''
  selectedPhoneAreaCode.value = '+852'
  phoneNumber.value = ''
  recipientForm.reservedPhoneNumber = ''
}

// Validate recipient form
const validateRecipientForm = () => {
  Object.keys(recipientErrors).forEach(key => {
    recipientErrors[key as keyof typeof recipientErrors] = ''
  })

  let isValid = true

  if (!recipientForm.bankName) {
    recipientErrors.bankName = 'Bank name is required'
    isValid = false
  }

  if (!recipientForm.bankLocation) {
    recipientErrors.bankLocation = 'Bank location is required'
    isValid = false
  }

  if (!recipientForm.currency) {
    recipientErrors.currency = 'Currency is required'
    isValid = false
  }

  if (!selectedPhoneAreaCode.value) {
    recipientErrors.phoneAreaCode = 'Phone area code is required'
    isValid = false
  }

  if (!phoneNumber.value || phoneNumber.value.trim() === '') {
    recipientErrors.reservedPhoneNumber = 'Phone number is required'
    isValid = false
  } else {
    // Save only phone number without area code
    recipientForm.reservedPhoneNumber = phoneNumber.value.trim()
  }

  if (!selectedCountryCode.value) {
    recipientErrors.recipientLocation = 'Country is required'
    isValid = false
  } else {
    recipientForm.recipientLocation = selectedCountryCode.value
  }

  if (hasStateOptions.value) {
    // If using dropdown, format as {countryCode}_{stateCode}
    if (!selectedStateCode.value) {
      recipientErrors.recipientProvince = 'Province/State is required'
      isValid = false
    } else {
      recipientForm.recipientProvince = `${selectedCountryCode.value}_${selectedStateCode.value}`
    }
  } else {
    // If manually entering, ensure format is {countryCode}_{value}
    if (!recipientForm.recipientProvince || recipientForm.recipientProvince.trim() === '') {
      recipientErrors.recipientProvince = 'Province/State is required'
      isValid = false
    } else {
      // If not already in format, prepend country code
      const provinceValue = recipientForm.recipientProvince.trim()
      if (!provinceValue.includes('_')) {
        recipientForm.recipientProvince = `${selectedCountryCode.value}_${provinceValue}`
      } else if (!provinceValue.startsWith(`${selectedCountryCode.value}_`)) {
        // If has underscore but wrong country code, fix it
        const parts = provinceValue.split('_')
        recipientForm.recipientProvince = `${selectedCountryCode.value}_${parts.slice(1).join('_')}`
      }
    }
  }

  // City is optional, set to null if empty
  if (!recipientForm.recipientCity || recipientForm.recipientCity.trim() === '') {
    recipientForm.recipientCity = null as any
  }

  if (!recipientForm.recipientAddress) {
    recipientErrors.recipientAddress = 'Recipient address is required'
    isValid = false
  }

  if (!recipientForm.bankAccountNumber) {
    recipientErrors.bankAccountNumber = 'Bank account number is required'
    isValid = false
  }

  if (!recipientForm.swiftCode) {
    recipientErrors.swiftCode = 'SWIFT code is required'
    isValid = false
  }

  return isValid
}

// Save recipient
const handleSave = async () => {
  if (!validateRecipientForm()) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields',
      life: 3000
    })
    return
  }

  savingRecipient.value = true

  try {
    // Ensure city is null if empty
    const submitData = {
      ...recipientForm,
      recipientCity: recipientForm.recipientCity && recipientForm.recipientCity.trim() !== ''
        ? recipientForm.recipientCity.trim()
        : null
    }

    console.log('Saving recipient information...', submitData)

    const response = await CardAPI.saveRecipient(submitData)

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Recipient information saved successfully',
        life: 3000
      })

      // Reset form
      resetRecipientForm()

      // Close dialog and emit saved event
      visible.value = false
      emit('saved')
    } else {
      throw new Error(response.msg || 'Failed to save recipient')
    }
  } catch (error) {
    console.error('Error saving recipient:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as any)?.message || 'Failed to save recipient information',
      life: 3000
    })
  } finally {
    savingRecipient.value = false
  }
}

// Handle dialog close
const handleClose = () => {
  resetRecipientForm()
  visible.value = false
}

// Initialize on mount
onMounted(async () => {
  await initializePhoneAreaCodes()
  await initializeLocationData()
})

// Watch for dialog visibility to reset form when opened
watch(() => props.visible, (newValue) => {
  if (newValue) {
    resetRecipientForm()
  }
})
</script>

