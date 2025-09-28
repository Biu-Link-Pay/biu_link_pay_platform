// 通用 API 响应类型
export interface ApiResponse<T = any> {
  code: string
  msg: string
  model: T | null
  success: boolean
  error: boolean
}

// 登录相关类型
export interface LoginParams {
  email: string
  code: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
}

export interface RefreshTokenParams {
  refresh_token: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}

export interface SendEmailParams {
  email: string
}

export interface LogoutParams {
  refresh_token: string
}

// 用户详情相关类型
export interface UserProfile {
  userNum: string
  userEmail: string
  kycStatus: number // 0=未做kyc，1=kyc通过，2=kyc临时拒绝，3=kyc拒绝
  firstName: string
  googleAuthStatus: number // 0:未认证,1:已认证
}

export interface UserProfileParams {
  token: string
  refresh_token: string
  // fingerprint-id is automatically added by request interceptor
}

// Google Auth 相关类型
export interface GoogleAuthGeneralResponse {
  secretKey: string
  qrCode: string
}

// KYC 相关类型
// 注意：根据API规范，KYC访问令牌直接返回字符串，KYC状态直接返回数字
// 0=未做kyc，1=kyc通过，2=kyc临时拒绝，3=kyc拒绝，临时拒绝可以再次申请kyc

// 用户信息类型
export interface UserInfo {
  id?: string
  email: string
  name?: string
  avatar?: string
}

// 认证状态类型
export interface AuthState {
  isAuthenticated: boolean
  user: UserInfo | null
  token: string | null
  refreshToken: string | null
  loading: boolean
}

// API 错误类型
export interface ApiError {
  code: string
  msg: string
  success: boolean
  error: boolean
}

// 请求配置类型
export interface RequestConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

// 分页参数类型
export interface PaginationParams {
  page?: number
  pageSize?: number
}

// 分页响应类型
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
