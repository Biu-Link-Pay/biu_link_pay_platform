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
 * 认证相关 API
 */
export class AuthAPI {
  /**
   * 发送邮件验证码
   * @param params 邮件参数
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
   * 用户登录
   * @param params 登录参数
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
   * 刷新 token
   * @param params 刷新 token 参数
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
   * 用户登出
   * @param params 登出参数
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
}

// 导出单个函数以便于使用
export const {
  sendEmail,
  login,
  refreshToken,
  logout
} = AuthAPI
