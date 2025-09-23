import type { 
  ApiResponse, 
  LoginParams, 
  LoginResponse, 
  RefreshTokenParams, 
  RefreshTokenResponse,
  SendEmailParams,
  LogoutParams
} from '@/types/api'
import { api } from '@/services/api'

/**
 * Authentication related API
 */
export class AuthAPI {
  /**
   * Send email verification code
   * @param params Email parameters
   * @returns Promise<ApiResponse<null>>
   */
  static async sendEmail(params: SendEmailParams): Promise<ApiResponse<null>> {
    const response = await api.get('/card/consume/login/sendEmail', {
      params: {
        email: params.email
      }
    })
    return response.data
  }

  /**
   * User login
   * @param params Login parameters
   * @returns Promise<ApiResponse<LoginResponse>>
   */
  static async login(params: LoginParams): Promise<ApiResponse<LoginResponse>> {
    const response = await api.get('/card/consume/login', {
      params: {
        email: params.email,
        code: params.code
      }
    })
    return response.data
  }

  /**
   * Refresh token
   * @param params Refresh token parameters
   * @returns Promise<ApiResponse<RefreshTokenResponse>>
   */
  static async refreshToken(params: RefreshTokenParams): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await api.get('/card/consume/login/refresh', {
      headers: {
        'refresh_token': params.refresh_token
      }
    })
    return response.data
  }

  /**
   * User logout
   * @param params Logout parameters
   * @returns Promise<ApiResponse<null>>
   */
  static async logout(params: LogoutParams): Promise<ApiResponse<null>> {
    const response = await api.get('/card/consume/login/out', {
      headers: {
        'refresh_token': params.refresh_token
      }
    })
    return response.data
  }

  /**
   * Get KYC access token
   * @param headers Request header parameters (fingerprint-id is automatically added by interceptor)
   * @returns Promise<ApiResponse<string>>
   */
  static async getKycAccessToken(headers: { token: string; refresh_token: string }): Promise<ApiResponse<string>> {
    const response = await api.get('/card/consume/common/kycAccessToken', {
      headers: {
        'token': headers.token,
        'refresh_token': headers.refresh_token
        // fingerprint-id is automatically added by request interceptor
      }
    })
    return response.data
  }

  /**
   * Check KYC result status
   * @param headers Request header parameters (fingerprint-id is automatically added by interceptor)
   * @returns Promise<ApiResponse<number>>
   */
  static async checkKycStatus(headers: { token: string; refresh_token: string }): Promise<ApiResponse<number>> {
    const response = await api.get('/card/consume/common/kycResult', {
      headers: {
        'token': headers.token,
        'refresh_token': headers.refresh_token
        // fingerprint-id is automatically added by request interceptor
      }
    })
    return response.data
  }
}

// Export individual functions for easy use
export const {
  sendEmail,
  login,
  refreshToken,
  logout,
  getKycAccessToken,
  checkKycStatus
} = AuthAPI
