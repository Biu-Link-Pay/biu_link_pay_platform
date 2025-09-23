import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const loading = ref(false)
  
  // Computed properties
  const userName = computed(() => user.value?.name || '游客')
  const userEmail = computed(() => user.value?.email || '')
  const userAvatar = computed(() => user.value?.avatar || '')
  
  // Methods
  const login = async (email: string, password: string) => {
    loading.value = true
    
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate user data
      user.value = {
        id: 1,
        name: 'Test User',
        email: email,
        avatar: 'https://via.placeholder.com/100'
      }
      
      isLoggedIn.value = true
      
      // Save to local storage
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('isLoggedIn', 'true')
      
      return { success: true, message: 'Login successful' }
    } catch (error) {
      return { success: false, message: 'Login failed' }
    } finally {
      loading.value = false
    }
  }
  
  const logout = () => {
    user.value = null
    isLoggedIn.value = false
    
    // Clear local storage
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
  }
  
  const updateProfile = (updates: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }
  
  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user')
    const savedLoginStatus = localStorage.getItem('isLoggedIn')
    
    if (savedUser && savedLoginStatus === 'true') {
      user.value = JSON.parse(savedUser)
      isLoggedIn.value = true
    }
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
    
    // Methods
    login,
    logout,
    updateProfile,
    initializeAuth
  }
})
