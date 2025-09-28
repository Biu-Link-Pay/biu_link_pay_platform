import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { AuthAPI } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

export interface GoogleAuthOptions {
  title?: string
  onSuccess?: (result: boolean) => void
  onCancel?: () => void
}

export function useGoogleAuth() {
  const toast = useToast()
  const authStore = useAuthStore()
  
  const showDialog = ref(false)
  const loading = ref(false)
  const options = ref<GoogleAuthOptions>({})

  /**
   * 显示 Google Auth 验证弹框
   * @param opts 配置选项
   */
  const showAuthDialog = (opts: GoogleAuthOptions = {}) => {
    options.value = {
      title: 'Google Auth 验证',
      ...opts
    }
    showDialog.value = true
  }

  /**
   * 隐藏验证弹框
   */
  const hideAuthDialog = () => {
    showDialog.value = false
  }

  /**
   * 检查 Google Auth 绑定状态
   * @returns Promise<boolean> 是否已绑定
   */
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const response = await AuthAPI.googleAuthResult()
      
      return response.success && response.model === 1
    } catch (error) {
      console.error('Check auth status error:', error)
      return false
    }
  }

  /**
   * 验证 Google Auth 验证码
   * @param code 验证码
   * @param secret 密钥（可选，如果为空则从服务器获取）
   * @returns Promise<boolean> 验证结果
   */
  const verifyAuthCode = async (code: string, secret?: string): Promise<boolean> => {
    try {
      const response = await AuthAPI.googleAuthValid(code, secret || '') // 如果为空，服务器会使用用户绑定的密钥

      if (response.success && response.model) {
        toast.add({
          severity: 'success',
          summary: '验证成功',
          detail: 'Google Auth 验证通过',
          life: 3000
        })
        return true
      } else {
        toast.add({
          severity: 'error',
          summary: '验证失败',
          detail: response.msg || '验证码错误',
          life: 3000
        })
        return false
      }
    } catch (error) {
      console.error('Verify auth code error:', error)
      toast.add({
        severity: 'error',
        summary: '验证失败',
        detail: '网络错误，请重试',
        life: 3000
      })
      return false
    }
  }

  /**
   * 获取当前验证码
   * @param secret 密钥
   * @returns Promise<string | null> 验证码
   */
  const getCurrentCode = async (secret: string): Promise<string | null> => {
    try {
      const response = await AuthAPI.googleAuthCode(secret)

      if (response.success) {
        return response.model
      }
      return null
    } catch (error) {
      console.error('Get current code error:', error)
      return null
    }
  }

  /**
   * 生成 Google Auth 密钥和二维码
   * @returns Promise<{secretKey: string, qrCode: string} | null>
   */
  const generateAuthKey = async () => {
    try {
      const response = await AuthAPI.googleAuthGeneral()

      if (response.success && response.model) {
        return {
          secretKey: response.model.secretKey,
          qrCode: response.model.qrCode
        }
      }
      return null
    } catch (error) {
      console.error('Generate auth key error:', error)
      return null
    }
  }

  /**
   * 执行需要验证的操作
   * @param operation 需要验证的操作函数
   * @param opts 配置选项
   */
  const executeWithAuth = async <T>(
    operation: () => Promise<T> | T,
    opts: GoogleAuthOptions = {}
  ): Promise<T | null> => {
    // 检查是否已绑定
    const isBound = await checkAuthStatus()
    if (!isBound) {
      toast.add({
        severity: 'warn',
        summary: '未绑定 Google Auth',
        detail: '请先绑定 Google Authenticator',
        life: 3000
      })
      return null
    }

    // 显示验证弹框
    return new Promise((resolve) => {
      showAuthDialog({
        ...opts,
        onSuccess: async (result) => {
          if (result) {
            try {
              const operationResult = await operation()
              resolve(operationResult)
            } catch (error) {
              console.error('Operation error:', error)
              resolve(null)
            }
          } else {
            resolve(null)
          }
        },
        onCancel: () => {
          resolve(null)
        }
      })
    })
  }

  return {
    showDialog,
    loading,
    options,
    showAuthDialog,
    hideAuthDialog,
    checkAuthStatus,
    verifyAuthCode,
    getCurrentCode,
    generateAuthKey,
    executeWithAuth
  }
}
