import type { ApiResponse } from '@/types/api'
import { api } from '@/services/api'

// 卡片配置相关类型
export interface CardConfig {
  cardPattern: number // 1=虚拟卡，2=实体卡
  cardName: string // 卡名称
  cardType: string // 卡类型，1=普通卡
  applyFee: number // 申请费
  monthlyFee: number // 月费
  rechargeFee: number // 充值费
  maxOnMonthly: number // 月交易限额
  maxOnDaily: number // 日交易限额
  maxOnPercent: number // 单笔交易最大金额
  status: number // 1:启用,2:禁用
  cardPicture: string | null // 卡图片
}

// 卡片 BIN 相关类型
export interface CardBin {
  cardBin: string | null // cardBin
  cardType: string | null // 卡类型
  cardScheme: string | null // 卡种类
  cardCurrency: string | null // 卡币种
  billingAddressUpdatable: string | null // 地址是否支持修改
  expiryDateCustomization: string | null // 过期时间是否支持修改
  remainingAvailableCard: number | null // 剩余可开卡数量
  availableCard: number | null // 已开卡数量
  cardFormFactor: string | null // 虚拟卡or实体卡
}

// 查询卡 BIN 参数
export interface QueryCardBinParams {
  cardFormFactor: 'virtual_card' | 'physical_card' // virtual_card=虚拟卡，physical_card=实体卡
}

// 持卡人信息相关类型
export interface CardHolderInfo {
  residentialAddress: string // 账单地址
  residentialCity: string // 账单城市
  residentialCountryCode: string // 账单国家二字码
  residentialPostalCode: string // 账单邮编
  residentialState: string // 账单州/省
}

// 请求头参数（fingerprint-id 由拦截器自动添加）
export interface CardRequestHeaders {
  token: string
  refresh_token: string
}

/**
 * 卡片相关 API
 */
export class CardAPI {
  /**
   * 查询卡配置
   * @param headers 请求头参数（fingerprint-id 由拦截器自动添加）
   * @returns Promise<ApiResponse<CardConfig[]>>
   */
  static async getCardConfig(headers: CardRequestHeaders): Promise<ApiResponse<CardConfig[]>> {
    const response = await api.get('/card/consume/common/cardConfig', {
      headers: {
        'token': headers.token,
        'refresh_token': headers.refresh_token
        // fingerprint-id 由请求拦截器自动添加
      }
    })
    return response.data
  }

  /**
   * 查询卡 BIN
   * @param params 查询参数
   * @param headers 请求头参数（fingerprint-id 由拦截器自动添加）
   * @returns Promise<ApiResponse<CardBin[]>>
   */
  static async queryCardBin(
    params: QueryCardBinParams,
    headers: CardRequestHeaders
  ): Promise<ApiResponse<CardBin[]>> {
    const response = await api.get('/card/consume/operator/queryCardBin', {
      params: {
        cardFormFactor: params.cardFormFactor
      },
      headers: {
        'token': headers.token,
        'refresh_token': headers.refresh_token
        // fingerprint-id 由请求拦截器自动添加
      }
    })
    return response.data
  }

  /**
   * 保存持卡人信息
   * @param holderInfo 持卡人信息
   * @param headers 请求头参数（fingerprint-id 由拦截器自动添加）
   * @returns Promise<ApiResponse<null>>
   */
  static async saveCardHolder(
    holderInfo: CardHolderInfo,
    headers: CardRequestHeaders
  ): Promise<ApiResponse<null>> {
    const response = await api.post('/card/consume/operator/saveHolder', holderInfo, {
      headers: {
        'token': headers.token,
        'refresh_token': headers.refresh_token
        // fingerprint-id 由请求拦截器自动添加
      }
    })
    return response.data
  }
}

// 导出单个函数以便于使用
export const {
  getCardConfig,
  queryCardBin,
  saveCardHolder
} = CardAPI
