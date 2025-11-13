import type { 
  ApiResponse, 
  LoginParams, 
  LoginResponse, 
  RefreshTokenParams, 
  RefreshTokenResponse,
  SendEmailParams,
  LogoutParams,
  UserProfile,
  UserProfileParams,
  GoogleAuthGeneralResponse
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
        code: params.code,
        license: params.license
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
   * @returns Promise<ApiResponse<string>>
   */
  static async getKycAccessToken(): Promise<ApiResponse<string>> {
    const response = await api.get('/card/consume/common/kycAccessToken')
    return response.data
  }

  /**
   * Check KYC result status
   * @returns Promise<ApiResponse<number>>
   */
  static async checkKycStatus(): Promise<ApiResponse<number>> {
    const response = await api.get('/card/consume/common/kycResult')
    return response.data
  }

  /**
   * Get user profile
   * @returns Promise<ApiResponse<UserProfile>>
   */
  static async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await api.get('/card/consume/common/userProfile')
    return response.data
  }

  /**
   * Generate Google Auth secret key and QR code
   * @returns Promise<ApiResponse<GoogleAuthGeneralResponse>>
   */
  static async googleAuthGeneral(): Promise<ApiResponse<GoogleAuthGeneralResponse>> {
    const response = await api.get('/card/consume/common/googleAuthGeneral')
    return response.data
  }

  /**
   * Get Google Auth code
   * @param secret Secret key
   * @returns Promise<ApiResponse<string>>
   */
  static async googleAuthCode(secret: string): Promise<ApiResponse<string>> {
    const response = await api.get('/card/consume/common/googleAuthCode', {
      params: {
        secret
      }
    })
    return response.data
  }

  /**
   * Validate Google Auth code
   * @param code Verification code
   * @param secret Secret key
   * @returns Promise<ApiResponse<boolean>>
   */
  static async googleAuthValid(code: string, secret: string): Promise<ApiResponse<boolean>> {
    const response = await api.get('/card/consume/common/googleAuthValid', {
      params: {
        code,
        secret
      }
    })
    return response.data
  }

  /**
   * Get Google Auth result status
   * @returns Promise<ApiResponse<number>> - 0:未认证,1:已认证
   */
  static async googleAuthResult(): Promise<ApiResponse<number>> {
    const response = await api.get('/card/consume/common/googleAuthResult')
    return response.data
  }

  /**
   * Unbind Google Auth
   * @param code 2FA verification code
   * @returns Promise<ApiResponse<boolean>>
   */
  static async googleAuthUnbind(code: string): Promise<ApiResponse<boolean>> {
    const response = await api.get('/card/consume/common/googleAuthUnbind', {
      params: {
        code
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
  checkKycStatus,
  getUserProfile,
  googleAuthGeneral,
  googleAuthCode,
  googleAuthValid,
  googleAuthResult,
  googleAuthUnbind
} = AuthAPI
