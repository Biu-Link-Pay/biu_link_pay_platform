import type {
  ApiResponse,
  LoginParams,
  LoginResponse,
  SendEmailParams,
  UserInfo,
} from '@/types/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { AuthAPI } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const isAuthenticated = ref(false)
  const user = ref<UserInfo | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const loading = ref(false)

  // KYC related state
  const kycStatus = ref<number | null>(null) // 0=not done, 1=approved, 2=temporarily rejected, 3=rejected
  const kycChecked = ref(false) // Whether KYC status has been checked

  // Computed properties
  const isLoggedIn = computed(() => isAuthenticated.value && !!token.value)
  const currentUser = computed(() => user.value)
  const authToken = computed(() => token.value)

  // KYC related computed properties
  const isKycApproved = computed(() => kycStatus.value === 1)
  const needsKyc = computed(() => kycStatus.value === 0 || kycStatus.value === 2 || kycStatus.value === 3)

  // Initialize authentication state
  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedRefreshToken = localStorage.getItem('refreshToken')
    const savedUser = localStorage.getItem('user')
    const savedKycStatus = localStorage.getItem('kycStatus')
    const savedKycChecked = localStorage.getItem('kycChecked')

    if (savedToken && savedRefreshToken) {
      token.value = savedToken
      refreshToken.value = savedRefreshToken
      isAuthenticated.value = true

      if (savedUser) {
        user.value = JSON.parse(savedUser)
      }
    }

    // Restore KYC status
    if (savedKycStatus) {
      kycStatus.value = Number.parseInt(savedKycStatus)
    }
    if (savedKycChecked) {
      kycChecked.value = savedKycChecked === 'true'
    }
  }

  // Send email verification code
  const sendEmailCode = async (params: SendEmailParams) => {
    loading.value = true
    try {
      const response: ApiResponse<null> = await AuthAPI.sendEmail(params)
      if (response.success) {
        return { success: true, message: 'Verification code sent successfully' }
      }
      else {
        return { success: false, message: response.msg || 'Send failed' }
      }
    }
    catch (error) {
      console.error('Failed to send email verification code:', error)
      return {
        success: false,
        message: (error as any)?.message || 'Send failed',
      }
    }
    finally {
      loading.value = false
    }
  }

  // User login
  const login = async (params: LoginParams) => {
    loading.value = true
    try {
      const response: ApiResponse<LoginResponse> = await AuthAPI.login(params)

      if (response.success && response.model) {
        // Save authentication info
        token.value = response.model.token
        refreshToken.value = response.model.refreshToken
        isAuthenticated.value = true

        // Save to local storage
        localStorage.setItem('token', response.model.token)
        localStorage.setItem('refreshToken', response.model.refreshToken)

        return { success: true, message: 'Login successful' }
      }
      else {
        return { success: false, message: response.msg || 'Login failed' }
      }
    }
    catch (error) {
      console.error('Login failed:', error)
      return {
        success: false,
        message: (error as any)?.message || 'Login failed',
      }
    }
    finally {
      loading.value = false
    }
  }

  // User logout
  const logout = async (): Promise<void> => {
    loading.value = true
    try {
      if (refreshToken.value) {
        await AuthAPI.logout({ refresh_token: refreshToken.value })
      }
    }
    catch {
      // 即使API调用失败，也要清除本地状态
    }
    finally {
      isAuthenticated.value = false
      user.value = null
      token.value = null
      refreshToken.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('kycStatus')
      localStorage.removeItem('kycChecked')
      try {
        const { useCardStore } = await import('./card')
        const cardStore = useCardStore()
        cardStore.reset()
      }
      catch {
        // ignore
      }
      loading.value = false
    }
  }

  // Refresh token
  const refreshAuthToken = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token')
    }

    try {
      const response: ApiResponse<LoginResponse> = await AuthAPI.refreshToken({
        refresh_token: refreshToken.value,
      })

      if (response.success && response.model) {
        token.value = response.model.token
        refreshToken.value = response.model.refreshToken

        // Update local storage
        localStorage.setItem('token', response.model.token)
        localStorage.setItem('refreshToken', response.model.refreshToken)

        return true
      }
      else {
        throw new Error(response.msg || 'Token refresh failed')
      }
    }
    catch (error) {
      console.error('Token refresh failed:', error)
      // Refresh failed, clear authentication state
      logout()
      throw error
    }
  }

  // Update user info
  const updateUserInfo = (userInfo: Partial<UserInfo>) => {
    if (user.value) {
      user.value = { ...user.value, ...userInfo }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  // Check if token is expired
  const isTokenExpired = () => {
    // Token expiration check logic can be added here
    // Currently simply return false
    return false
  }

  // Get KYC access token
  const getKycAccessToken = async (): Promise<string> => {
    if (!token.value || !refreshToken.value) {
      throw new Error('User not logged in')
    }

    try {
      const response: ApiResponse<string> = await AuthAPI.getKycAccessToken()

      if (response.success && response.model) {
        return response.model
      }
      else {
        throw new Error(response.msg || 'Failed to get KYC access token')
      }
    }
    catch (error) {
      console.error('Failed to get KYC access token:', error)
      throw error
    }
  }

  // Check KYC status
  const checkKycStatus = async (): Promise<number> => {
    if (!token.value || !refreshToken.value) {
      throw new Error('User not logged in')
    }

    try {
      const response: ApiResponse<number> = await AuthAPI.checkKycStatus()

      if (response.success && response.model !== null && response.model !== undefined) {
        kycStatus.value = response.model
        kycChecked.value = true

        // Save to local storage
        localStorage.setItem('kycStatus', response.model.toString())
        localStorage.setItem('kycChecked', 'true')

        return response.model
      }
      else {
        throw new Error(response.msg || 'Failed to check KYC status')
      }
    }
    catch (error) {
      console.error('Failed to check KYC status:', error)
      throw error
    }
  }

  return {
    // State
    isAuthenticated,
    user,
    token,
    refreshToken,
    loading,
    kycStatus,
    kycChecked,

    // Computed properties
    isLoggedIn,
    currentUser,
    authToken,
    isKycApproved,
    needsKyc,

    // Methods
    initializeAuth,
    sendEmailCode,
    login,
    refreshAuthToken,
    logout,
    updateUserInfo,
    isTokenExpired,
    getKycAccessToken,
    checkKycStatus,
  }
}, {
  persist: {
    key: 'auth-store',
    storage: localStorage,
  },
})
