// 通用 API 响应类型
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  code?: number
}

// 分页响应类型
export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 用户相关类型
export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

// 文章相关类型
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  createdAt?: string
  updatedAt?: string
}

// 评论相关类型
export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
  createdAt?: string
}

// 表单验证错误类型
export interface ValidationError {
  field: string
  message: string
}

// 登录表单类型
export interface LoginForm {
  email: string
  password: string
  remember?: boolean
}

// 注册表单类型
export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// 用户资料更新类型
export interface UpdateProfileForm {
  name?: string
  email?: string
  avatar?: string
}

// 应用状态类型
export interface AppState {
  loading: boolean
  error: string | null
  theme: 'light' | 'dark'
  language: string
}

// 路由元信息类型
export interface RouteMeta {
  title?: string
  requiresAuth?: boolean
  roles?: string[]
}

// 菜单项类型
export interface MenuItem {
  id: string
  title: string
  icon?: string
  path?: string
  children?: MenuItem[]
  roles?: string[]
}

// 通知类型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: number
}

// 文件上传类型
export interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
}
