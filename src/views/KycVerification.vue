<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useErrorHandler } from '@/utils/errorHandler'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

// Page metadata
defineOptions({
  name: 'KycVerification'
})

// Reactive data
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { handleError, handleSuccess } = useErrorHandler()

const kycAccessToken = ref('')
const showKycSDK = ref(false)
const pollingInterval = ref<NodeJS.Timeout | null>(null)
const isPolling = ref(false)

// 启动 KYC SDK
async function launchKycSDK(): Promise<void> {
  try {
    // 获取访问令牌
    const token = await authStore.getKycAccessToken()
    kycAccessToken.value = token

    // 显示 SDK 容器
    showKycSDK.value = true

    // 等待 DOM 更新
    await nextTick()

    // 直接调用 Sumsub SDK
    if (typeof window !== 'undefined' && (window as any).snsWebSdk) {
      const snsWebSdkInstance = (window as any).snsWebSdk
        .init(token, () => getNewAccessToken())
        .withConf({ lang: 'zh' })
        .withOptions({ addViewportTag: false, adaptIframeHeight: true })
        .on('idCheck.onStepCompleted', (payload: any) => {
          console.log('onStepCompleted', payload)
        })
        .on('idCheck.onError', (error: any) => {
          console.log('onError', error)
        })
        .build()

      snsWebSdkInstance.launch('#sumsub-websdk-container')

      handleSuccess('Please follow the prompts to complete identity verification')
    } else {
      throw new Error('Sumsub SDK not loaded')
    }
  } catch (error) {
    console.error('Failed to start KYC SDK:', error)
    showKycSDK.value = false
    handleError(error, {
      fallbackMessage: 'Unable to start KYC verification. Please try again.'
    })
  }
}

// 获取新的访问令牌
async function getNewAccessToken(): Promise<string> {
  try {
    const newToken = await authStore.getKycAccessToken()
    kycAccessToken.value = newToken
    return newToken
  } catch (error) {
    console.error('Token refresh failed:', error)
    throw error
  }
}

// 开始轮询 KYC 状态
function startKycPolling(): void {
  if (isPolling.value) {
    return
  }

  isPolling.value = true
  console.log('Start polling KYC status')

  pollingInterval.value = setInterval(async () => {
    try {
      const result = await authStore.checkKycStatus()
      console.log('KYC status from polling:', result)

      if (result === 1) {
        // KYC passed, go to card bin page
        stopKycPolling()
        handleSuccess('Congratulations! Your identity verification has passed. Redirecting to card page...')
        
        setTimeout(async () => {
          const returnTo = route.query.returnTo as string
          const targetPath = returnTo || '/card-bin-selection'
          await router.push(targetPath)
        }, 2000)
      } else if (result === 3) {
        // KYC rejected, return to apply card page
        stopKycPolling()
        handleError('KYC verification was rejected. Returning to apply card page...', {
          fallbackMessage: 'KYC verification was rejected. Please contact support for more information.'
        })
        
        setTimeout(async () => {
          await router.push('/apply-card')
        }, 2000)
      }
      // Status 0 and 2: no action, continue polling
    } catch (error) {
      console.error('KYC status polling failed:', error)
    }
  }, 5000) // Poll every 5 seconds
}

// Stop KYC status polling
function stopKycPolling(): void {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
  isPolling.value = false
  console.log('Stopped KYC status polling')
}

// Recheck KYC status
async function recheckKycStatus(): Promise<void> {
  try {
    const result = await authStore.checkKycStatus()

    if (result === 1) {
      handleSuccess('Congratulations! Your identity verification has passed. Redirecting...')

      // Delayed redirect
      setTimeout(async () => {
        const returnTo = route.query.returnTo as string
        const targetPath = returnTo || '/card-bin-selection'
        await router.push(targetPath)
      }, 2000)
    } else if (result === 0 || result === 2) {
      // If KYC status 0 or 2, restart KYC verification
      showKycSDK.value = false
      await launchKycSDK()
    } else if (result === 3) {
      // If KYC status 3 (rejected), return to apply card page
      handleError('KYC verification was rejected. Returning to apply card page...', {
        fallbackMessage: 'KYC verification was rejected. Please contact support for more information.'
      })
      
      setTimeout(async () => {
        await router.push('/apply-card')
      }, 2000)
    }
  } catch (error) {
    console.error('Recheck KYC status failed:', error)
  }
}

// Back to login page
function backToLogin(): void {
  router.push('/login')
}

// Lifecycle
onMounted(async () => {
  console.log('KYC verification page mounted')
  console.log('Auth status:', {
    isLoggedIn: authStore.isLoggedIn,
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    user: authStore.user,
    kycStatus: authStore.kycStatus,
    kycChecked: authStore.kycChecked
  })

  // Wait for auth to initialize
  await new Promise(resolve => setTimeout(resolve, 100))

  // Check if logged in
  if (!authStore.isLoggedIn) {
    console.log('User not logged in, redirect to login')
    await router.push('/login')
    return
  }

  // If KYC approved, redirect
  if (authStore.isKycApproved) {
    console.log('KYC approved, redirect to card list')
    const returnTo = route.query.returnTo as string
    const targetPath = returnTo || '/apply-card'
    await router.push(targetPath)
    return
  }

  // Auto start KYC verification
  console.log('Start KYC verification')
  await launchKycSDK()
  
  // Start polling
  startKycPolling()
})

// Watch KYC status in Pinia store
watch(() => authStore.kycStatus, async (newStatus) => {
  if (newStatus === 1) {
    // KYC approved, show success and redirect
    handleSuccess('Congratulations! Your identity verification has passed. Redirecting to dashboard...')

    // Delay redirect so user sees success message
    setTimeout(async () => {
      const returnTo = route.query.returnTo as string
      const targetPath = returnTo || '/apply-card'
      await router.push(targetPath)
    }, 2000)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Toast messages -->
    <Toast />

    <!-- KYC status info -->
    <div v-if="authStore.needsKyc && !showKycSDK" class="p-4">
      <div class="max-w-4xl mx-auto">
        <div
          v-if="authStore.kycStatus === 0"
          class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div class="flex items-start">
            <i class="pi pi-info-circle text-blue-600 dark:text-blue-400 mt-1 mr-3"></i>
            <div>
              <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">KYC Incomplete</h3>
              <p class="text-blue-800 dark:text-blue-200 text-sm">
                Please complete your identity verification to access the system. KYC verification will start automatically.
              </p>
            </div>
          </div>
        </div>

        <div
          v-else-if="authStore.kycStatus === 2"
          class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <div class="flex items-start">
            <i class="pi pi-exclamation-triangle text-yellow-600 dark:text-yellow-400 mt-1 mr-3"></i>
            <div>
              <h3 class="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">KYC Temporarily Rejected</h3>
              <p class="text-yellow-800 dark:text-yellow-200 text-sm">
                Your KYC verification was temporarily rejected. You can reapply. KYC verification will start automatically.
              </p>
            </div>
          </div>
        </div>

        <div
          v-else-if="authStore.kycStatus === 3"
          class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
        >
          <div class="flex items-start">
            <i class="pi pi-times-circle text-red-600 dark:text-red-400 mt-1 mr-3"></i>
            <div>
              <h3 class="font-semibold text-red-900 dark:text-red-100 mb-2">KYC Rejected</h3>
              <p class="text-red-800 dark:text-red-200 text-sm">
                Your KYC verification was rejected. Please contact support for more information.
              </p>
            </div>
          </div>
        </div>

        <!-- Polling status display -->
        <div v-if="isPolling" class="mt-4 text-center">
          <div class="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <i class="pi pi-spin pi-spinner text-blue-600 dark:text-blue-400 mr-2"></i>
            <span class="text-blue-800 dark:text-blue-200 text-sm">
              Automatically checking KYC status...
            </span>
          </div>
        </div>

        <!-- KYC action buttons -->
        <div class="flex justify-center mt-6 space-x-4">
          <Button
            label="Recheck KYC Status"
            icon="pi pi-refresh"
            class="min-h-[48px] text-base font-medium"
            severity="secondary"
            @click="recheckKycStatus"
          />
          <Button
            v-if="isPolling"
            label="Stop Polling"
            icon="pi pi-pause"
            class="min-h-[48px] text-base font-medium"
            severity="warning"
            @click="stopKycPolling"
          />
          <Button
            v-else
            label="Start Polling"
            icon="pi pi-play"
            class="min-h-[48px] text-base font-medium"
            severity="success"
            @click="startKycPolling"
          />
          <Button
            label="Back to Login"
            icon="pi pi-arrow-left"
            class="min-h-[48px] text-base font-medium"
            severity="secondary"
            @click="backToLogin"
          />
        </div>
      </div>
    </div>

    <!-- KYC SDK 容器 - 全屏显示 -->
    <div v-if="showKycSDK" class="h-screen w-full">
      <div
        id="sumsub-websdk-container"
        class="h-full w-full"
      >
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全屏容器样式 */
.h-screen {
  height: 100vh;
  height: 100dvh; /* 动态视口高度，更好的移动端支持 */
}

/* 移动端优化 */
@media (max-width: 640px) {
  .min-h-screen {
    padding: 1rem;
  }
}

/* 暗色模式优化 */
@media (prefers-color-scheme: dark) {
  .bg-gray-50 {
    background-color: #111827;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .border-blue-200 {
    border-color: #000;
  }

  .text-blue-800 {
    color: #000;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
