import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'
import { getCachedFingerprintId, getFingerprintId } from '@/utils/fingerprint'
import { useAuthStore } from '@/stores/auth'

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: 'https://api.biulinkpay.online', // 正式环境 API 基础 URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    console.log('发送请求:', config.url)

    // 添加认证 token
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.token = `${token}`
    }
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken && config.headers) {
      config.headers.refresh_token = `${refreshToken}`
    }
    // 添加 fingerprint-id（除了登录相关的请求）
    const isLoginRequest = config.url?.includes('/login') ||
      config.url?.includes('/sendEmailCode') ||
      config.url?.includes('/refreshToken')

    if (!isLoginRequest && config.headers) {
      // 尝试获取缓存的指纹ID
      let fingerprintId = getCachedFingerprintId()

      // 如果没有缓存的指纹ID，则获取新的
      if (!fingerprintId) {
        try {
          fingerprintId = await getFingerprintId()
        } catch (error) {
          console.warn('Failed to get fingerprint ID:', error)
        }
      }

      // 添加指纹ID到请求头
      if (fingerprintId) {
        config.headers['fingerprint-id'] = fingerprintId
      }
    }
    if (config.method === 'get' && !config.data) {
      // 对于没有 data 和 params 的 GET 请求，添加时间戳防止缓存
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数
    console.log('响应成功:', response.status, response.config.url)

    // 检查业务状态码
    const data = response.data as ApiResponse
    if (data && data.code !== '0' && data.error) {
      console.error('业务错误:', data.msg)
      return Promise.reject(new Error(data.msg))
    }

    return response
  },
  async (error) => {
    // 超出 2xx 范围的状态码都会触发该函数
    console.error('响应错误:', error.response?.status, error.config?.url)

    // 处理常见错误状态码
    if (error.response) {
      const { status } = error.response

      switch (status) {
        case 401:
          // 检查是否是刷新token请求本身返回401
          const isRefreshTokenRequest = error.config?.url?.includes('/card/consume/login/refresh')

          if (isRefreshTokenRequest) {
            // 刷新token请求本身返回401，直接清空token信息并跳转登录页
            console.error('刷新token请求返回401，直接跳转登录页')
            const authStore = useAuthStore()

            // 直接清空认证状态，不调用logout接口
            authStore.isAuthenticated = false
            authStore.user = null
            authStore.token = null
            authStore.refreshToken = null

            // 清除本地存储
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')

            // 跳转到登录页
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            break
          }

          // 未授权，尝试刷新 token
          if (!error.config._retry) {
            error.config._retry = true
            try {
              console.log('检测到401错误，尝试刷新token...')

              // 使用AuthStore刷新token
              const authStore = useAuthStore()
              await authStore.refreshAuthToken()

              console.log('Token刷新成功，重新发送请求')

              // 更新请求头中的token
              if (error.config.headers) {
                error.config.headers.token = authStore.token
                error.config.headers.refresh_token = authStore.refreshToken
              }

              // 重新发送原始请求
              return api.request(error.config)
            } catch (refreshError) {
              console.error('刷新 token 失败:', refreshError)

              // 刷新失败，直接清空认证状态并跳转到登录页
              const authStore = useAuthStore()

              // 直接清空认证状态，不调用logout接口
              authStore.isAuthenticated = false
              authStore.user = null
              authStore.token = null
              authStore.refreshToken = null

              // 清除本地存储
              localStorage.removeItem('token')
              localStorage.removeItem('refreshToken')
              localStorage.removeItem('user')

              // 跳转到登录页
              if (typeof window !== 'undefined') {
                window.location.href = '/login'
              }
            }
          } else {
            // 已经重试过，仍然401，直接清空认证状态并跳转登录
            console.error('Token刷新后仍然401，跳转登录页')
            const authStore = useAuthStore()

            // 直接清空认证状态，不调用logout接口
            authStore.isAuthenticated = false
            authStore.user = null
            authStore.token = null
            authStore.refreshToken = null

            // 清除本地存储
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')

            // 跳转到登录页
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
          }
          break
        case 403:
          error.message = 'Access denied'
          break
        case 404:
          error.message = 'Resource not found'
          break
        case 500:
          error.message = 'Internal server error'
          break
        case 502:
          error.message = 'The system is updating. Please try again later'
          break
        default:
          error.message = `Request failed with status ${status}`
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      error.message = 'Network error, please check your connection'
    } else {
      // 发生了一些问题，触发了错误
      error.message = `Request configuration error: ${error.message}`
    }

    return Promise.reject(error)
  }
)

// API 服务类
export class ApiService {
  // 获取所有文章
  async getPosts() {
    return api.get('/posts')
  }

  // 根据 ID 获取文章
  async getPost(id: number) {
    return api.get(`/posts/${id}`)
  }

  // 创建文章
  async createPost(data: { title: string; body: string; userId: number }) {
    return api.post('/posts', data)
  }

  // 更新文章
  async updatePost(id: number, data: { title: string; body: string }) {
    return api.put(`/posts/${id}`, data)
  }

  // 删除文章
  async deletePost(id: number) {
    return api.delete(`/posts/${id}`)
  }

  // 获取用户信息
  async getUsers() {
    return api.get('/users')
  }

  // 根据 ID 获取用户
  async getUser(id: number) {
    return api.get(`/users/${id}`)
  }

  // 通用 GET 请求
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.get(url, config)
  }

  // 通用 POST 请求
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.post(url, data, config)
  }

  // 通用 PUT 请求
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.put(url, data, config)
  }

  // 通用 DELETE 请求
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.delete(url, config)
  }
}

// 创建 API 服务实例
export const apiService = new ApiService()

// 导出 axios 实例以供其他用途
export { api }
export default api
