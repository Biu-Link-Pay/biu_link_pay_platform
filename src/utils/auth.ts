import type { UserInfo } from '@/types/api'

// Token 相关工具函数
export const TokenUtils = {
  /**
   * 获取存储的 token
   */
  getToken(): string | null {
    return localStorage.getItem('token')
  },

  /**
   * 获取存储的刷新 token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  },

  /**
   * 设置 token
   */
  setToken(token: string): void {
    localStorage.setItem('token', token)
  },

  /**
   * 设置刷新 token
   */
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken)
  },

  /**
   * 清除所有 token
   */
  clearTokens(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  },

  /**
   * 检查是否有有效的 token
   */
  hasValidToken(): boolean {
    const token = this.getToken()
    const refreshToken = this.getRefreshToken()
    return !!(token && refreshToken)
  }
}

// 用户信息相关工具函数
export const UserUtils = {
  /**
   * 获取存储的用户信息
   */
  getUserInfo(): UserInfo | null {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        return null
      }
    }
    return null
  },

  /**
   * 设置用户信息
   */
  setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem('user', JSON.stringify(userInfo))
  },

  /**
   * 清除用户信息
   */
  clearUserInfo(): void {
    localStorage.removeItem('user')
  },

  /**
   * 更新用户信息
   */
  updateUserInfo(updates: Partial<UserInfo>): void {
    const currentUser = this.getUserInfo()
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates }
      this.setUserInfo(updatedUser)
    }
  }
}

// 认证状态检查工具函数
export const AuthUtils = {
  /**
   * 检查是否已登录
   */
  isAuthenticated(): boolean {
    return TokenUtils.hasValidToken() && !!UserUtils.getUserInfo()
  },

  /**
   * 清除所有认证信息
   */
  clearAuth(): void {
    TokenUtils.clearTokens()
    UserUtils.clearUserInfo()
  },

  /**
   * 获取认证头信息
   */
  getAuthHeaders(): Record<string, string> {
    const token = TokenUtils.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },

  /**
   * 验证邮箱格式
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * 验证验证码格式（6位数字）
   */
  isValidCode(code: string): boolean {
    const codeRegex = /^\d{6}$/
    return codeRegex.test(code)
  },

  /**
   * 格式化邮箱（隐藏部分字符）
   */
  maskEmail(email: string): string {
    if (!email || !this.isValidEmail(email)) {
      return email
    }
    
    const [username, domain] = email.split('@')
    const maskedUsername = username.length > 2 
      ? username.substring(0, 2) + '*'.repeat(username.length - 2)
      : username
    
    return `${maskedUsername}@${domain}`
  }
}

// 路由守卫工具函数
export const RouteUtils = {
  /**
   * 检查路由是否需要认证
   */
  requiresAuth(route: any): boolean {
    return route.meta?.requiresAuth === true
  },

  /**
   * 获取登录重定向路径
   */
  getLoginRedirectPath(): string {
    const currentPath = window.location.pathname
    return currentPath === '/' ? '/login' : currentPath
  },

  /**
   * 保存当前路径用于登录后重定向
   */
  saveRedirectPath(path: string): void {
    sessionStorage.setItem('redirectPath', path)
  },

  /**
   * 获取保存的重定向路径
   */
  getSavedRedirectPath(): string | null {
    return sessionStorage.getItem('redirectPath')
  },

  /**
   * 清除保存的重定向路径
   */
  clearRedirectPath(): void {
    sessionStorage.removeItem('redirectPath')
  }
}

// 错误处理工具函数
export const ErrorUtils = {
  /**
   * 处理认证相关错误
   */
  handleAuthError(error: any): string {
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          return '登录已过期，请重新登录'
        case 403:
          return '没有权限访问此资源'
        case 404:
          return '请求的资源不存在'
        case 500:
          return '服务器内部错误，请稍后重试'
        default:
          return data?.msg || `请求失败 (${status})`
      }
    } else if (error.request) {
      return '网络连接失败，请检查网络设置'
    } else {
      return error.message || '未知错误'
    }
  },

  /**
   * 格式化 API 错误消息
   */
  formatApiError(error: any): string {
    if (typeof error === 'string') {
      return error
    }
    
    if (error?.message) {
      return error.message
    }
    
    if (error?.response?.data?.msg) {
      return error.response.data.msg
    }
    
    return '操作失败，请稍后重试'
  }
}
