import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { AuthAPI } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { i18n } from '@/i18n'

export interface GoogleAuthOptions {
  title?: string
  onSuccess?: (result: boolean) => void
  onCancel?: () => void
}

export function useGoogleAuth() {
  const toast = useToast()
  const authStore = useAuthStore()
  const t = i18n.global.t

  const showDialog = ref(false)
  const loading = ref(false)
  const options = ref<GoogleAuthOptions>({})

  /**
   * Show Google Auth verification dialog
   * @param opts Configuration options
   */
  const showAuthDialog = (opts: GoogleAuthOptions = {}) => {
    options.value = {
      title: t('Google Auth Verification'),
      ...opts
    }
    showDialog.value = true
  }

  /**
   * Hide verification dialog
   */
  const hideAuthDialog = () => {
    showDialog.value = false
  }

  /**
   * Check Google Auth binding status
   * @returns Promise<boolean> Whether bound or not
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
   * Verify Google Auth code
   * @param code Verification code
   * @param secret Secret key (optional, if empty server will use user's bound key)
   * @returns Promise<boolean> Verification result
   */
  const verifyAuthCode = async (code: string, secret?: string): Promise<boolean> => {
    try {
      const response = await AuthAPI.googleAuthValid(code, secret || '') // If empty, server will use user's bound key

      if (response.success && response.model) {
        toast.add({
          severity: 'success',
          summary: t('Verification Successful'),
          detail: t('Google Auth verification passed'),
          life: 3000
        })
        return true
      } else {
        toast.add({
          severity: 'error',
          summary: t('Verification Failed'),
          detail: response.msg || t('Incorrect verification code'),
          life: 3000
        })
        return false
      }
    } catch (error) {
      console.error('Verify auth code error:', error)
    toast.add({
      severity: 'error',
      summary: t('Verification Failed'),
      detail: (error as any)?.message || t('Network error, please try again'),
      life: 3000
    })
      return false
    }
  }

  /**
   * Get current verification code
   * @param secret Secret key
   * @returns Promise<string | null> Verification code
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
   * Generate Google Auth secret key and QR code
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
   * Execute operation that requires authentication
   * @param operation Operation function that requires authentication
   * @param opts Configuration options
   */
  const executeWithAuth = async <T>(
    operation: () => Promise<T> | T,
    opts: GoogleAuthOptions = {}
  ): Promise<T | null> => {
    // Check if bound
    const isBound = await checkAuthStatus()
    if (!isBound) {
      toast.add({
        severity: 'warn',
        summary: t('Google Auth Not Bound'),
        detail: t('Please bind Google Authenticator first'),
        life: 3000
      })
      return null
    }

    // Show verification dialog
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
