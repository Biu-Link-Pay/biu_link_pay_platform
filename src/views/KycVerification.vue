<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useErrorHandler } from '@/utils/errorHandler'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

// 页面元信息
defineOptions({
  name: 'KycVerification'
})

// 响应式数据
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

      handleSuccess('请按照提示完成身份验证流程')
    } else {
      throw new Error('Sumsub SDK 未加载')
    }
  } catch (error) {
    console.error('启动 KYC SDK 失败:', error)
    showKycSDK.value = false
    handleError(error, {
      fallbackMessage: '无法启动 KYC 验证组件，请重试'
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
    console.error('令牌刷新失败:', error)
    throw error
  }
}

// 开始轮询 KYC 状态
function startKycPolling(): void {
  if (isPolling.value) {
    return
  }

  isPolling.value = true
  console.log('开始轮询 KYC 状态')

  pollingInterval.value = setInterval(async () => {
    try {
      const result = await authStore.checkKycStatus()
      console.log('轮询获取到 KYC 状态:', result)

      if (result === 1) {
        // KYC 通过，跳转到卡bin页面
        stopKycPolling()
        handleSuccess('恭喜！您的身份验证已通过，正在跳转到卡bin页面...')
        
        setTimeout(async () => {
          const returnTo = route.query.returnTo as string
          const targetPath = returnTo || '/card-bin-selection'
          await router.push(targetPath)
        }, 2000)
      } else if (result === 3) {
        // KYC 被拒绝，返回申请卡片页面
        stopKycPolling()
        handleError('KYC 验证被拒绝，正在返回申请卡片页面...', {
          fallbackMessage: 'KYC 验证被拒绝，请联系客服获取更多信息'
        })
        
        setTimeout(async () => {
          await router.push('/apply-card')
        }, 2000)
      }
      // 状态 0 和 2 不做处理，继续轮询
    } catch (error) {
      console.error('轮询 KYC 状态失败:', error)
    }
  }, 5000) // 每5秒轮询一次
}

// 停止轮询 KYC 状态
function stopKycPolling(): void {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
  isPolling.value = false
  console.log('停止轮询 KYC 状态')
}

// 重新检查 KYC 状态
async function recheckKycStatus(): Promise<void> {
  try {
    const result = await authStore.checkKycStatus()

    if (result === 1) {
      handleSuccess('恭喜！您的身份验证已通过，正在跳转...')

      // 延迟跳转
      setTimeout(async () => {
        const returnTo = route.query.returnTo as string
        const targetPath = returnTo || '/card-bin-selection'
        await router.push(targetPath)
      }, 2000)
    } else if (result === 0 || result === 2) {
      // 如果 KYC 状态是 0 或 2，重新启动 KYC 验证
      showKycSDK.value = false
      await launchKycSDK()
    } else if (result === 3) {
      // 如果 KYC 状态是 3（被拒绝），返回申请卡片页面
      handleError('KYC 验证被拒绝，正在返回申请卡片页面...', {
        fallbackMessage: 'KYC 验证被拒绝，请联系客服获取更多信息'
      })
      
      setTimeout(async () => {
        await router.push('/apply-card')
      }, 2000)
    }
  } catch (error) {
    console.error('重新检查 KYC 状态失败:', error)
  }
}

// 返回登录页面
function backToLogin(): void {
  router.push('/login')
}

// 生命周期
onMounted(async () => {
  console.log('KYC 验证页面已挂载')
  console.log('认证状态:', {
    isLoggedIn: authStore.isLoggedIn,
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    user: authStore.user,
    kycStatus: authStore.kycStatus,
    kycChecked: authStore.kycChecked
  })

  // 等待一下让认证状态完全初始化
  await new Promise(resolve => setTimeout(resolve, 100))

  // 检查是否已登录
  if (!authStore.isLoggedIn) {
    console.log('用户未登录，跳转到登录页')
    await router.push('/login')
    return
  }

  // 如果 KYC 已通过，直接跳转
  if (authStore.isKycApproved) {
    console.log('KYC 已通过，跳转到卡片列表')
    const returnTo = route.query.returnTo as string
    const targetPath = returnTo || '/apply-card'
    await router.push(targetPath)
    return
  }

  // 自动启动 KYC 验证
  console.log('开始 KYC 验证')
  await launchKycSDK()
  
  // 启动轮询
  startKycPolling()
})

// 监听 Pinia store 中的 KYC 状态变化
watch(() => authStore.kycStatus, async (newStatus) => {
  if (newStatus === 1) {
    // KYC 已通过，显示成功消息并跳转
    handleSuccess('恭喜！您的身份验证已通过，正在跳转到仪表板...')

    // 延迟跳转让用户看到成功消息
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
    <!-- Toast 消息 -->
    <Toast />

    <!-- KYC 状态信息 -->
    <div v-if="authStore.needsKyc && !showKycSDK" class="p-4">
      <div class="max-w-4xl mx-auto">
        <div
          v-if="authStore.kycStatus === 0"
          class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div class="flex items-start">
            <i class="pi pi-info-circle text-blue-600 dark:text-blue-400 mt-1 mr-3"></i>
            <div>
              <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">KYC 未完成</h3>
              <p class="text-blue-800 dark:text-blue-200 text-sm">
                请完成您的身份验证以访问系统。KYC 验证将自动开始。
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
              <h3 class="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">KYC 暂时被拒绝</h3>
              <p class="text-yellow-800 dark:text-yellow-200 text-sm">
                您的 KYC 验证暂时被拒绝。您可以重新申请验证。KYC 验证将自动开始。
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
              <h3 class="font-semibold text-red-900 dark:text-red-100 mb-2">KYC 被拒绝</h3>
              <p class="text-red-800 dark:text-red-200 text-sm">
                您的 KYC 验证被拒绝。请联系客服获取更多信息。
              </p>
            </div>
          </div>
        </div>

        <!-- 轮询状态显示 -->
        <div v-if="isPolling" class="mt-4 text-center">
          <div class="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <i class="pi pi-spin pi-spinner text-blue-600 dark:text-blue-400 mr-2"></i>
            <span class="text-blue-800 dark:text-blue-200 text-sm">
              正在自动检查 KYC 状态...
            </span>
          </div>
        </div>

        <!-- KYC 操作按钮 -->
        <div class="flex justify-center mt-6 space-x-4">
          <Button
            label="重新检查 KYC 状态"
            icon="pi pi-refresh"
            class="min-h-[48px] text-base font-medium"
            severity="secondary"
            @click="recheckKycStatus"
          />
          <Button
            v-if="isPolling"
            label="停止轮询"
            icon="pi pi-pause"
            class="min-h-[48px] text-base font-medium"
            severity="warning"
            @click="stopKycPolling"
          />
          <Button
            v-else
            label="开始轮询"
            icon="pi pi-play"
            class="min-h-[48px] text-base font-medium"
            severity="success"
            @click="startKycPolling"
          />
          <Button
            label="返回登录"
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
