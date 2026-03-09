<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  visible: boolean
  title?: string
  identifier?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Google Auth Verification',
  identifier: 'default',
  loading: false,
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
  set: value => emit('update:visible', value),
})

// Methods
function onCodeInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // Only keep numbers
  authCode.value = value.slice(0, 6) // Maximum 6 digits
}

function handleSubmit() {
  if (!authCode.value || authCode.value.length !== 6 || props.loading) {
    return
  }

  emit('submit', authCode.value, props.identifier)
}

function handleCancel() {
  emit('cancel', props.identifier)
}

// Expose methods for parent component to call
defineExpose({
  resetCode: () => {
    authCode.value = ''
  },
})
</script>

<template>
  <Dialog
    v-model:visible="visible" modal :header="title" :style="{ width: '400px' }" :closable="true"
    :close-on-escape="true"
  >
    <div class="space-y-6">
      <!-- Verification Code Input Interface -->
      <div class="space-y-4">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <i class="pi pi-shield text-blue-600 dark:text-blue-400 text-2xl" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-3">
            Google Auth Verification
          </h3>
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
            v-model="authCode" type="text" :placeholder="t('googleAuth.codePlaceholder')" maxlength="6"
            class="w-full text-center text-2xl font-mono tracking-widest" @input="onCodeInput"
            @keyup.enter="handleSubmit"
          />
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-between space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button :label="t('googleAuth.cancel')" severity="secondary" :disabled="props.loading" class="flex-1" @click="handleCancel" />
        <Button
          :label="t('googleAuth.confirm')" icon="pi pi-check" :loading="props.loading" :disabled="!authCode || authCode.length !== 6 || props.loading"
          class="flex-1" @click="handleSubmit"
        />
      </div>
    </div>
  </Dialog>
</template>
