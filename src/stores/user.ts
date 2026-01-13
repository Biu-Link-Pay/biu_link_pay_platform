import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthAPI } from '@/api/auth'
import { i18n } from '@/i18n'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

// Extended user information to include complete user details
export interface UserDetails {
  id?: number
  name?: string
  email: string
  avatar?: string
  userNum?: string
  kycStatus?: number
  firstName?: string
  googleAuthStatus?: number
  cardRewardPoints?: number
}

export const useUserStore = defineStore('user', () => {
  const t = i18n.global.t
  // State
  const user = ref<UserDetails | null>(null)
  const isLoggedIn = ref(false)
  const loading = ref(false)

  // Computed properties
  const userName = computed(() => user.value?.name || user.value?.firstName || t('Guest'))
  const userEmail = computed(() => user.value?.email || '')
  const userAvatar = computed(() => user.value?.avatar || '')
  const userNum = computed(() => user.value?.userNum || '')
  const kycStatus = computed(() => user.value?.kycStatus || 0)
  const googleAuthStatus = computed(() => user.value?.googleAuthStatus || 0)
  const cardRewardPoints = computed(() => user.value?.cardRewardPoints ?? 0)

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

  // Fetch user profile information
  const fetchUserProfile = async () => {
    loading.value = true
    try {
      const response = await AuthAPI.getUserProfile()

      if (response.success && response.model) {
        const profile = response.model
        // Update user information
        user.value = {
          ...user.value,
          userNum: profile.userNum,
          email: profile.userEmail,
          firstName: profile.firstName,
          kycStatus: profile.kycStatus,
          googleAuthStatus: profile.googleAuthStatus,
          cardRewardPoints: profile.cardRewardPoints
        }

        // Save to local storage
        localStorage.setItem('userDetails', JSON.stringify(user.value))

        return { success: true, data: profile }
      } else {
        return { success: false, message: response.msg || t('Failed to get user profile') }
      }
    } catch (error) {
      console.error('Failed to get user profile:', error)
      return {
        success: false,
        message: (error as any)?.message || t('Failed to get user profile')
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

    // Login state is managed by authStore, no need to set isLoggedIn here
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
    cardRewardPoints,

    // Methods
    logout,
    updateProfile,
    fetchUserProfile,
    initializeAuth
  }
})
