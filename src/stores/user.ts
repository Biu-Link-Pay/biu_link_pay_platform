import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const loading = ref(false)
  
  // 计算属性
  const userName = computed(() => user.value?.name || '游客')
  const userEmail = computed(() => user.value?.email || '')
  const userAvatar = computed(() => user.value?.avatar || '')
  
  // 方法
  const login = async (email: string, password: string) => {
    loading.value = true
    
    try {
      // 模拟登录 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟用户数据
      user.value = {
        id: 1,
        name: '测试用户',
        email: email,
        avatar: 'https://via.placeholder.com/100'
      }
      
      isLoggedIn.value = true
      
      // 保存到本地存储
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('isLoggedIn', 'true')
      
      return { success: true, message: '登录成功' }
    } catch (error) {
      return { success: false, message: '登录失败' }
    } finally {
      loading.value = false
    }
  }
  
  const logout = () => {
    user.value = null
    isLoggedIn.value = false
    
    // 清除本地存储
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
    // 状态
    user,
    isLoggedIn,
    loading,
    
    // 计算属性
    userName,
    userEmail,
    userAvatar,
    
    // 方法
    login,
    logout,
    updateProfile,
    initializeAuth
  }
})
