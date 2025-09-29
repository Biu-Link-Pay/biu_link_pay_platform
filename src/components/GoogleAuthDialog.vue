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
      <!-- 验证码输入界面 -->
      <div class="space-y-4">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <i class="pi pi-shield text-blue-600 dark:text-blue-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-3">Google Auth 验证</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            请输入 Google Authenticator 中的 6 位验证码
          </p>
        </div>

        <!-- 验证码输入框 -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            验证码
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

        <!-- 提示信息 -->
        <div class="text-center">
          <div class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
            <i class="pi pi-info-circle mr-2"></i>
            验证码每 30 秒自动更新
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button 
          label="取消" 
          severity="secondary"
          @click="handleCancel"
        />
        <Button 
          label="确定" 
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
  title: 'Google Auth 验证',
  identifier: 'default'
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [code: string, identifier: string]
  'cancel': [identifier: string]
}>()

// 状态管理
const authCode = ref('')

// 计算属性
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 方法
const onCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // 只保留数字
  authCode.value = value.slice(0, 6) // 最多6位
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

// 暴露方法供父组件调用
defineExpose({
  resetCode: () => {
    authCode.value = ''
  }
})
</script>
