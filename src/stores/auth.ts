import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthAPI } from '@/api/auth'
import type {
  AuthState,
  UserInfo,
  LoginParams,
  SendEmailParams,
  ApiResponse,
  LoginResponse
} from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const isAuthenticated = ref(false)
  const user = ref<UserInfo | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const loading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => isAuthenticated.value && !!token.value)
  const currentUser = computed(() => user.value)
  const authToken = computed(() => token.value)

  // 初始化认证状态
  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedRefreshToken = localStorage.getItem('refreshToken')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedRefreshToken) {
      token.value = savedToken
      refreshToken.value = savedRefreshToken
      isAuthenticated.value = true

      if (savedUser) {
        user.value = JSON.parse(savedUser)
      }
    }
  }

  // 发送邮件验证码
  const sendEmailCode = async (params: SendEmailParams) => {
    loading.value = true
    try {
      const response: ApiResponse<null> = await AuthAPI.sendEmail(params)
      if (response.success) {
        return { success: true, message: '验证码发送成功' }
      } else {
        return { success: false, message: response.msg || '发送失败' }
      }
    } catch (error) {
      console.error('发送邮件验证码失败:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : '发送失败'
      }
    } finally {
      loading.value = false
    }
  }

  // 用户登录
  const login = async (params: LoginParams) => {
    loading.value = true
    try {
      const response: ApiResponse<LoginResponse> = await AuthAPI.login(params)

      if (response.success && response.model) {
        // 保存认证信息
        token.value = response.model.token
        refreshToken.value = response.model.refreshToken
        isAuthenticated.value = true

        // 保存到本地存储
        localStorage.setItem('token', response.model.token)
        localStorage.setItem('refreshToken', response.model.refreshToken)

        // 设置用户信息
        user.value = {
          email: params.email,
          id: params.email // 使用邮箱作为 ID
        }
        localStorage.setItem('user', JSON.stringify(user.value))

        return { success: true, message: '登录成功' }
      } else {
        return { success: false, message: response.msg || '登录失败' }
      }
    } catch (error) {
      console.error('登录失败:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : '登录失败'
      }
    } finally {
      loading.value = false
    }
  }

  // 刷新 token
  const refreshAuthToken = async () => {
    if (!refreshToken.value) {
      throw new Error('没有刷新 token')
    }

    try {
      const response: ApiResponse<LoginResponse> = await AuthAPI.refreshToken({
        refresh_token: refreshToken.value
      })

      if (response.success && response.model) {
        token.value = response.model.token
        refreshToken.value = response.model.refreshToken

        // 更新本地存储
        localStorage.setItem('token', response.model.token)
        localStorage.setItem('refreshToken', response.model.refreshToken)

        return true
      } else {
        throw new Error(response.msg || '刷新 token 失败')
      }
    } catch (error) {
      console.error('刷新 token 失败:', error)
      // 刷新失败，清除认证状态
      logout()
      throw error
    }
  }

  // 用户登出
  const logout = async () => {
    loading.value = true
    try {
      // 如果有刷新 token，调用登出接口
      if (refreshToken.value) {
        await AuthAPI.logout({ refresh_token: refreshToken.value })
      }
    } catch (error) {
      console.error('登出请求失败:', error)
    } finally {
      // 清除所有认证信息
      isAuthenticated.value = false
      user.value = null
      token.value = null
      refreshToken.value = null

      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      loading.value = false
    }
  }

  // 更新用户信息
  const updateUserInfo = (userInfo: Partial<UserInfo>) => {
    if (user.value) {
      user.value = { ...user.value, ...userInfo }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  // 检查 token 是否过期
  const isTokenExpired = () => {
    // 这里可以添加 token 过期检查逻辑
    // 目前简单返回 false
    return false
  }


  return {
    // 状态
    isAuthenticated,
    user,
    token,
    refreshToken,
    loading,

    // 计算属性
    isLoggedIn,
    currentUser,
    authToken,

    // 方法
    initializeAuth,
    sendEmailCode,
    login,
    refreshAuthToken,
    logout,
    updateUserInfo,
    isTokenExpired
  }
}, {
  persist: {
    key: 'auth-store',
    storage: localStorage
  }
})
