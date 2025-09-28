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

      <!-- 状态显示 -->
      <div v-if="authStatus === 'unbound'" class="text-center space-y-4">
        <div class="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
          <i class="pi pi-exclamation-triangle text-orange-600 dark:text-orange-400 text-2xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Google Auth 未绑定</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            请先绑定 Google Authenticator 才能进行验证
          </p>
        </div>
        <Button 
          label="去绑定" 
          icon="pi pi-link"
          class="w-full"
          @click="goToBind"
        />
      </div>

      <!-- 验证码输入 -->
      <div v-else-if="authStatus === 'ready'" class="space-y-4">
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
            :class="{ 'p-invalid': error }"
            :disabled="loading"
            @input="onCodeInput"
            @keyup.enter="handleVerify"
          />
          <small v-if="error" class="text-red-500">{{ error }}</small>
        </div>

        <!-- 提示信息 -->
        <div class="text-center">
          <div class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
            <i class="pi pi-info-circle mr-2"></i>
            验证码每 30 秒自动更新
          </div>
        </div>
      </div>

      <!-- 验证中状态 -->
      <div v-else-if="authStatus === 'verifying'" class="text-center space-y-4">
        <div class="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
          <i class="pi pi-spin pi-spinner text-blue-600 dark:text-blue-400 text-2xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">验证中...</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            正在验证您的 Google Auth 验证码
          </p>
        </div>
      </div>

      <!-- 验证成功 -->
      <div v-else-if="authStatus === 'success'" class="text-center space-y-4">
        <div class="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <i class="pi pi-check text-green-600 dark:text-green-400 text-2xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">验证成功</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Google Auth 验证通过
          </p>
        </div>
      </div>

      <!-- 验证失败 -->
      <div v-else-if="authStatus === 'failed'" class="text-center space-y-4">
        <div class="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <i class="pi pi-times text-red-600 dark:text-red-400 text-2xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">验证失败</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ error || '验证码错误，请重试' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button 
          label="取消" 
          severity="secondary"
          :disabled="loading"
          @click="handleCancel"
        />
        <Button 
          v-if="authStatus === 'ready'"
          label="验证" 
          icon="pi pi-check"
          :loading="loading"
          :disabled="!authCode || authCode.length !== 6"
          @click="handleVerify"
        />
        <Button 
          v-if="authStatus === 'success'"
          label="确定" 
          icon="pi pi-check"
          @click="handleSuccess"
        />
        <Button 
          v-if="authStatus === 'failed'"
          label="重试" 
          icon="pi pi-refresh"
          @click="handleRetry"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { AuthAPI } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

interface Props {
  visible: boolean
  title?: string
  onSuccess?: (result: boolean) => void
  onCancel?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Google Auth 验证',
  onSuccess: () => {},
  onCancel: () => {}
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'success': [result: boolean]
  'cancel': []
}>()

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

// 状态管理
const authStatus = ref<'unbound' | 'ready' | 'verifying' | 'success' | 'failed'>('ready')
const authCode = ref('')
const error = ref('')
const loading = ref(false)

// 计算属性
const visible = computed({
  get: () => {
    console.log('GoogleAuthDialog visible get:', props.visible)
    return props.visible
  },
  set: (value) => {
    console.log('GoogleAuthDialog visible set:', value)
    emit('update:visible', value)
  }
})

// 方法
const checkAuthStatus = async () => {
  console.log('checkAuthStatus called')
  try {
    const response = await AuthAPI.googleAuthResult()
    console.log('Auth status response:', response)
    
    if (response.success) {
      authStatus.value = response.model === 1 ? 'ready' : 'unbound'
      console.log('Auth status set to:', authStatus.value)
    } else {
      authStatus.value = 'unbound'
      console.log('Auth status set to unbound due to failed response')
    }
  } catch (error) {
    console.error('Check auth status error:', error)
    authStatus.value = 'unbound'
    console.log('Auth status set to unbound due to error')
  }
}

const onCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // 只保留数字
  authCode.value = value.slice(0, 6) // 最多6位
  
  // 清除错误状态
  if (error.value) {
    error.value = ''
  }
}

const handleVerify = async () => {
  if (!authCode.value || authCode.value.length !== 6) {
    error.value = '请输入6位验证码'
    return
  }

  loading.value = true
  authStatus.value = 'verifying'
  error.value = ''

  try {
    const response = await AuthAPI.googleAuthValid(authCode.value, '') // 这里需要从服务器获取或存储的密钥

    if (response.success && response.model) {
      authStatus.value = 'success'
      toast.add({
        severity: 'success',
        summary: '验证成功',
        detail: 'Google Auth 验证通过',
        life: 3000
      })
    } else {
      authStatus.value = 'failed'
      error.value = response.msg || '验证码错误'
      toast.add({
        severity: 'error',
        summary: '验证失败',
        detail: response.msg || '验证码错误，请重试',
        life: 3000
      })
    }
  } catch (err) {
    console.error('Verify auth code error:', err)
    authStatus.value = 'failed'
    error.value = '验证失败，请重试'
  } finally {
    loading.value = false
  }
}


const handleSuccess = () => {
  emit('success', true)
  emit('update:visible', false)
  props.onSuccess(true)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
  props.onCancel()
}

const handleRetry = () => {
  authStatus.value = 'ready'
  authCode.value = ''
  error.value = ''
}

const goToBind = () => {
  emit('update:visible', false)
  // 跳转到个人中心页面进行绑定
  router.push('/personal-center')
}


// 监听弹框显示状态
watch(visible, (newVisible) => {
  console.log('GoogleAuthDialog visible changed:', newVisible)
  if (newVisible) {
    console.log('GoogleAuthDialog opening, checking auth status')
    checkAuthStatus()
    authCode.value = ''
    error.value = ''
  } else {
    console.log('GoogleAuthDialog closing')
  }
})

// 组件卸载时的清理
onUnmounted(() => {
  // 清理工作
})
</script>
