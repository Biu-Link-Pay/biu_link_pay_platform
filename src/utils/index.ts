// 格式化日期
export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const d = new Date(date)

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 深拷贝
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  return obj
}

// 生成随机字符串
export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

// 验证邮箱格式
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证手机号格式（中国大陆）
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取文件扩展名
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// 生成唯一 ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 数组去重
export const uniqueArray = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(array)]
  }

  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

// 对象转 URL 查询参数
export const objectToQueryString = (obj: Record<string, any>): string => {
  const params = new URLSearchParams()

  Object.keys(obj).forEach(key => {
    const value = obj[key]
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, String(value))
    }
  })

  return params.toString()
}

// 从 URL 查询参数获取对象
export const queryStringToObject = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString)
  const obj: Record<string, string> = {}

  for (const [key, value] of params) {
    obj[key] = value
  }

  return obj
}

// 首字母大写
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// 驼峰转横线
export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// 横线转驼峰
export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

// 复制到剪贴板的兼容性工具函数
export interface CopyOptions {
  onSuccess?: (text: string) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}
export const copyToClipboard = async (text: string, options?: CopyOptions): Promise<boolean> => {
  const {
    onSuccess,
    onError,
    successMessage = 'Text copied to clipboard',
    errorMessage = 'Failed to copy to clipboard'
  } = options || {}

  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      onSuccess?.(text)
      return true
    }

    // 降级使用 document.execCommand (适用于旧浏览器或非 HTTPS 环境)
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    textArea.style.opacity = '0'
    textArea.setAttribute('readonly', '')
    textArea.setAttribute('aria-hidden', 'true')

    document.body.appendChild(textArea)

    // 确保元素获得焦点
    textArea.focus()
    textArea.select()
    textArea.setSelectionRange(0, text.length)

    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)

    if (successful) {
      onSuccess?.(text)
      return true
    } else {
      throw new Error('execCommand copy failed')
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(errorMessage)
    onError?.(err)
    return false
  }
}

// 带 Toast 提示的复制函数（用于 Vue 组件）
export const copyWithToast = async (
  text: string,
  toast: any,
  options?: Partial<CopyOptions>
): Promise<boolean> => {
  const {
    successMessage = 'Copied to clipboard',
    errorMessage = 'Failed to copy to clipboard'
  } = options || {}

  return copyToClipboard(text, {
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Copied!',
        detail: successMessage,
        life: 2000
      })
    },
    onError: (error) => {
      console.error('Copy error:', error)
      toast.add({
        severity: 'error',
        summary: 'Copy Failed',
        detail: errorMessage,
        life: 3000
      })
    },
    ...options
  })
}
// 导出其他工具模块
export * from './auth'
export * from './fingerprint'
