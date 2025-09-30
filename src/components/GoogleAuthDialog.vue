<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    :header="title"
    :style="{ width: '400px' }"
    :closable="true"
    :close-on-escape="true"
  >
    <div class="space-y-6">
      <!-- Verification Code Input Interface -->
      <div class="space-y-4">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <i class="pi pi-shield text-blue-600 dark:text-blue-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-3">Google Auth Verification</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Please enter the 6-digit verification code from Google Authenticator
          </p>
        </div>

        <!-- Verification Code Input -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Verification Code
          </label>
          <InputText
            v-model="authCode"
            type="text"
            placeholder="000000"
            maxlength="6"
            class="w-full text-center text-2xl font-mono tracking-widest"
            @input="onCodeInput"
            @keyup.enter="handleSubmit"
          />
        </div>
      </div>
    </div>

    <!-- Footer Buttons -->
    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button 
          label="Cancel" 
          severity="secondary"
          @click="handleCancel"
        />
        <Button 
          label="Confirm" 
          icon="pi pi-check"
          :disabled="!authCode || authCode.length !== 6"
          @click="handleSubmit"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

interface Props {
  visible: boolean
  title?: string
  identifier?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Google Auth Verification',
  identifier: 'default'
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [code: string, identifier: string]
  'cancel': [identifier: string]
}>()

// State management
const authCode = ref('')

// Computed properties
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Methods
const onCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // Only keep numbers
  authCode.value = value.slice(0, 6) // Maximum 6 digits
}

const handleSubmit = () => {
  if (!authCode.value || authCode.value.length !== 6) {
    return
  }
  
  emit('submit', authCode.value, props.identifier)
}

const handleCancel = () => {
  emit('cancel', props.identifier)
}

// Expose methods for parent component to call
defineExpose({
  resetCode: () => {
    authCode.value = ''
  }
})
</script>
