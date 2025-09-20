import FingerprintJS from '@fingerprintjs/fingerprintjs'

/**
 * 指纹识别工具类
 */
export class FingerprintUtils {
  private static fpPromise: Promise<any> | null = null
  private static fingerprintId: string | null = null

  /**
   * 初始化指纹识别
   */
  private static async initFingerprint(): Promise<any> {
    if (!this.fpPromise) {
      this.fpPromise = FingerprintJS.load()
    }
    return this.fpPromise
  }

  /**
   * 获取设备指纹ID
   * @returns Promise<string> 指纹ID
   */
  static async getFingerprintId(): Promise<string> {
    // 如果已经获取过，直接返回缓存的指纹ID
    if (this.fingerprintId) {
      return this.fingerprintId
    }

    try {
      const fp = await this.initFingerprint()
      const result = await fp.get()

      // 缓存指纹ID
      this.fingerprintId = result.visitorId

      // 将指纹ID存储到localStorage，避免重复计算
      if (this.fingerprintId) {
        localStorage.setItem('fingerprint-id', this.fingerprintId)
        return this.fingerprintId
      }
      
      throw new Error('Failed to generate fingerprint ID')
    } catch (error) {
      console.error('Failed to get fingerprint:', error)

      // 如果获取失败，尝试从localStorage获取
      const cachedFingerprint = localStorage.getItem('fingerprint-id')
      if (cachedFingerprint) {
        this.fingerprintId = cachedFingerprint
        return cachedFingerprint
      }

      // 如果都失败了，生成一个随机ID作为备用
      const fallbackId = this.generateFallbackId()
      this.fingerprintId = fallbackId
      localStorage.setItem('fingerprint-id', fallbackId)

      return fallbackId
    }
  }

  /**
   * 生成备用指纹ID
   * @returns string 随机生成的指纹ID
   */
  private static generateFallbackId(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 15)
    return `fallback_${timestamp}_${random}`
  }

  /**
   * 清除缓存的指纹ID（用于测试或重置）
   */
  static clearFingerprint(): void {
    this.fingerprintId = null
    localStorage.removeItem('fingerprint-id')
  }

  /**
   * 获取缓存的指纹ID（同步方法）
   * @returns string | null 缓存的指纹ID或null
   */
  static getCachedFingerprintId(): string | null {
    return this.fingerprintId || localStorage.getItem('fingerprint-id')
  }

  /**
   * 检查指纹ID是否有效
   * @param fingerprintId 指纹ID
   * @returns boolean 是否有效
   */
  static isValidFingerprintId(fingerprintId: string): boolean {
    return Boolean(fingerprintId && fingerprintId.length > 0 && fingerprintId !== 'null' && fingerprintId !== 'undefined')
  }
}

// 导出默认实例方法
export const getFingerprintId = () => FingerprintUtils.getFingerprintId()
export const getCachedFingerprintId = () => FingerprintUtils.getCachedFingerprintId()
export const clearFingerprint = () => FingerprintUtils.clearFingerprint()

export default FingerprintUtils
