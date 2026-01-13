import type { UserInfo } from '@/types/api'
import { i18n } from '@/i18n'

// Token related utility functions
export const TokenUtils = {
  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('token')
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  },

  /**
   * Set token
   */
  setToken(token: string): void {
    localStorage.setItem('token', token)
  },

  /**
   * Set refresh token
   */
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken)
  },

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  },

  /**
   * Check if has valid token
   */
  hasValidToken(): boolean {
    const token = this.getToken()
    const refreshToken = this.getRefreshToken()
    return !!(token && refreshToken)
  }
}

// User information related utility functions
export const UserUtils = {
  /**
   * Get stored user information
   */
  getUserInfo(): UserInfo | null {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error('Failed to parse user information:', error)
        return null
      }
    }
    return null
  },

  /**
   * Set user information
   */
  setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem('user', JSON.stringify(userInfo))
  },

  /**
   * Clear user information
   */
  clearUserInfo(): void {
    localStorage.removeItem('user')
  },

  /**
   * Update user information
   */
  updateUserInfo(updates: Partial<UserInfo>): void {
    const currentUser = this.getUserInfo()
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates }
      this.setUserInfo(updatedUser)
    }
  }
}

// Authentication state check utility functions
export const AuthUtils = {
  /**
   * Check if user is logged in
   */
  isAuthenticated(): boolean {
    return TokenUtils.hasValidToken() && !!UserUtils.getUserInfo()
  },

  /**
   * Clear all authentication information
   */
  clearAuth(): void {
    TokenUtils.clearTokens()
    UserUtils.clearUserInfo()
  },

  /**
   * Get authentication headers
   */
  getAuthHeaders(): Record<string, string> {
    const token = TokenUtils.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate verification code format (6 digits)
   */
  isValidCode(code: string): boolean {
    const codeRegex = /^\d{6}$/
    return codeRegex.test(code)
  },

  /**
   * Format email (hide partial characters)
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

// Route guard utility functions
export const RouteUtils = {
  /**
   * Check if route requires authentication
   */
  requiresAuth(route: any): boolean {
    return route.meta?.requiresAuth === true
  },

  /**
   * Get login redirect path
   */
  getLoginRedirectPath(): string {
    const currentPath = window.location.pathname
    return currentPath === '/' ? '/login' : currentPath
  },

  /**
   * Save current path for redirect after login
   */
  saveRedirectPath(path: string): void {
    sessionStorage.setItem('redirectPath', path)
  },

  /**
   * Get saved redirect path
   */
  getSavedRedirectPath(): string | null {
    return sessionStorage.getItem('redirectPath')
  },

  /**
   * Clear saved redirect path
   */
  clearRedirectPath(): void {
    sessionStorage.removeItem('redirectPath')
  }
}

// Error handling utility functions
export const ErrorUtils = {
  t: i18n.global.t,
  /**
   * Handle authentication related errors
   */
  handleAuthError(error: any): string {
    const t = ErrorUtils.t
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          return t('Login expired, please login again')
        case 403:
          return t('No permission to access this resource')
        case 404:
          return t('Requested resource does not exist')
        case 500:
          return t('Internal server error, please try again later')
        default:
          return data?.msg || t('Request failed ({status})', { status })
      }
    } else if (error.request) {
      return t('Network connection failed, please check network settings')
    } else {
      return error.message || t('Unknown error')
    }
  },

  /**
   * Format API error message
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

    return ErrorUtils.t('Operation failed, please try again later')
  }
}
