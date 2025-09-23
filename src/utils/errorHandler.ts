import { useToast } from 'primevue/usetoast'

/**
 * 错误处理工具函数
 */
export function useErrorHandler() {
  const toast = useToast()

  /**
   * 处理错误
   * @param error 错误对象
   * @param options 错误处理选项
   */
  const handleError = (
    error: any,
    options: {
      fallbackMessage?: string
      showToast?: boolean
      logError?: boolean
    } = {}
  ) => {
    const {
      fallbackMessage = '操作失败，请稍后重试',
      showToast = true,
      logError = true
    } = options

    // 记录错误日志
    if (logError) {
      console.error('Error occurred:', error)
    }

    // 获取错误消息
    let errorMessage = fallbackMessage

    if (typeof error === 'string') {
      errorMessage = error
    } else if (error?.message) {
      errorMessage = error.message
    } else if (error?.response?.data?.msg) {
      errorMessage = error.response.data.msg
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    // 显示错误提示
    if (showToast) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000
      })
    }

    return errorMessage
  }

  /**
   * 处理成功消息
   * @param message 成功消息
   * @param options 成功处理选项
   */
  const handleSuccess = (
    message: string,
    options: {
      showToast?: boolean
      title?: string
    } = {}
  ) => {
    const {
      showToast = true,
      title = 'Success'
    } = options

    // 显示成功提示
    if (showToast) {
      toast.add({
        severity: 'success',
        summary: title,
        detail: message,
        life: 3000
      })
    }

    return message
  }

  /**
   * 处理警告消息
   * @param message 警告消息
   * @param options 警告处理选项
   */
  const handleWarning = (
    message: string,
    options: {
      showToast?: boolean
      title?: string
    } = {}
  ) => {
    const {
      showToast = true,
      title = 'Warning'
    } = options

    // 显示警告提示
    if (showToast) {
      toast.add({
        severity: 'warn',
        summary: title,
        detail: message,
        life: 4000
      })
    }

    return message
  }

  /**
   * 处理信息消息
   * @param message 信息消息
   * @param options 信息处理选项
   */
  const handleInfo = (
    message: string,
    options: {
      showToast?: boolean
      title?: string
    } = {}
  ) => {
    const {
      showToast = true,
      title = 'Info'
    } = options

    // 显示信息提示
    if (showToast) {
      toast.add({
        severity: 'info',
        summary: title,
        detail: message,
        life: 3000
      })
    }

    return message
  }

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo
  }
}
