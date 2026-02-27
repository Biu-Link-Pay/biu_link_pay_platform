import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '@/services/api'

export interface ApiData {
  id: number
  title: string
  body: string
  userId: number
}

export const useApiStore = defineStore('api', () => {
  // 状态
  const data = ref<ApiData[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算属性
  const hasData = computed(() => data.value.length > 0)
  const isLoading = computed(() => loading.value)
  
  // 方法
  const fetchPosts = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.getPosts()
      data.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch data'
      console.error('API Error:', err)
    } finally {
      loading.value = false
    }
  }
  
  const fetchRandomData = async () => {
    loading.value = true
    error.value = null
    
    try {
      // 模拟随机数据
      const mockData: ApiData = {
        id: Math.floor(Math.random() * 1000),
        title: '示例标题',
        body: '这是一个示例数据，用于演示 API 调用功能。',
        userId: 1
      }
      
      data.value = [mockData]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch data'
      console.error('API Error:', err)
    } finally {
      loading.value = false
    }
  }
  
  const clearData = () => {
    data.value = []
    error.value = null
  }
  
  return {
    // 状态
    data,
    loading,
    error,
    
    // 计算属性
    hasData,
    isLoading,
    
    // 方法
    fetchPosts,
    fetchRandomData,
    clearData
  }
})
