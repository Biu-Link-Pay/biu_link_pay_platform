import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthAPI } from '@/api/auth'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

// 扩展用户信息以包含完整的用户详情
export interface UserDetails {
  id?: number
  name?: string
  email: string
  avatar?: string
  userNum?: string
  kycStatus?: number
  firstName?: string
  googleAuthStatus?: number
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<UserDetails | null>(null)
  const isLoggedIn = ref(false)
  const loading = ref(false)

  // Computed properties
  const userName = computed(() => user.value?.name || user.value?.firstName || '游客')
  const userEmail = computed(() => user.value?.email || '')
  const userAvatar = computed(() => user.value?.avatar || '')
  const userNum = computed(() => user.value?.userNum || '')
  const kycStatus = computed(() => user.value?.kycStatus || 0)
  const googleAuthStatus = computed(() => user.value?.googleAuthStatus || 0)

  // Methods

  const logout = () => {
    user.value = null
    isLoggedIn.value = false

    // Clear local storage
    localStorage.removeItem('userDetails')
    localStorage.removeItem('isLoggedIn')
  }

  const updateProfile = (updates: Partial<UserDetails>) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('userDetails', JSON.stringify(user.value))
    }
  }

  // 获取用户详情信息
  const fetchUserProfile = async () => {
    loading.value = true
    try {
      const response = await AuthAPI.getUserProfile()

      if (response.success && response.model) {
        const profile = response.model
        // 更新用户信息
        user.value = {
          ...user.value,
          userNum: profile.userNum,
          email: profile.userEmail,
          firstName: profile.firstName,
          kycStatus: profile.kycStatus,
          googleAuthStatus: profile.googleAuthStatus
        }

        // 保存到本地存储
        localStorage.setItem('userDetails', JSON.stringify(user.value))

        return { success: true, data: profile }
      } else {
        return { success: false, message: response.msg || '获取用户详情失败' }
      }
    } catch (error) {
      console.error('获取用户详情失败:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : '获取用户详情失败'
      }
    } finally {
      loading.value = false
    }
  }

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('userDetails')

    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }

    // 登录状态由authStore管理，这里不需要设置isLoggedIn
  }

  return {
    // State
    user,
    isLoggedIn,
    loading,

    // Computed properties
    userName,
    userEmail,
    userAvatar,
    userNum,
    kycStatus,
    googleAuthStatus,

    // Methods
    logout,
    updateProfile,
    fetchUserProfile,
    initializeAuth
  }
})
