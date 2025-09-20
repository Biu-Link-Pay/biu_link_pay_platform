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
  cardId?: string | null // 卡片ID，用于充值操作
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

// 支付方式相关类型
export interface PaymentMethodQueryParams {
  orderType: 'IN' | 'OUT' // IN=入金，OUT=出金
}

export interface Crypto {
  name: string // 币种名称
  fullName: string // 币种全名
  logoUrl: string // 图片
}

export interface Network {
  name: string // 网络名称
  addressRegex: string // 地址规则
  fullName: string // 全面
  sortName: string // 别名
  logoUrl: string // 图片
}

export interface CryptoNetwork {
  minLimit: number // 最小值
  maxLimit: number // 最大值
  sorts: number // 排序
  type: 'IN' | 'OUT' // 类型，IN=入金，OUT=出金
  crypto: Crypto // 币种
  network: Network // 网络
}

export interface PayType {
  name: string // 支付方式名称
  img: string | null // 图片
  detailsImg: string | null // 详细图片
  sorts: number // 排序
  cryptoNetworks: CryptoNetwork[] // 币种网络
}

export interface PaymentMethodsResponse {
  payTypes: PayType[] // 支付方式列表
}

// 持卡人查询相关类型
export interface CardHolderResponse {
  cardholderId: string // 持卡人ID
  firstName: string // firstName
  lastName: string // lastName
  cardholderNameAbbreviation: string // 持卡人全名
  residentialAddress: string // 账单地址
  residentialCity: string // 账单城市
  residentialCountryCode: string // 账单国家二字码
  residentialPostalCode: string // 账单邮编
  residentialState: string // 账单地址州/省
}

// 卡详情相关类型
export interface CardDetailQueryParams {
  cardId: string // 卡ID
}

export interface CardDetailResponse {
  cardId: string // 卡ID
  cardNo: string // 卡号
  cardCurrency: string // 卡币种
  firstName: string // firstName
  lastName: string // lastName
  cvv: string // cvv
  expirationDate: string // 过期时间
}

// 卡列表相关类型
export interface CardListItem {
  cardId: string // 卡ID
  cardNo: string // 卡号
  maxOnMonthly: string // 月限额
  maxOnDaily: string // 日限额
  maxOnPercent: string // 单笔限额
}

// 消费记录分页查询相关类型
export interface TransactionListQueryParams {
  pageIndex: string // 第几页
  pageSize: string // 每页多少条
  cardId: string // 卡ID
}

export interface TransactionItem {
  status: string // 状态
  transactionType: string // 交易类型
  transactionAmount: number // 交易金额
  transactionCurrency: string // 交易币种
  merchantNameLocation: string // 商家名字
  merchantLocation: string // 商户所在国家
  feeDeductionAmount: number // 手续费扣费金额
  feeDeductionCurrency: string // 手续费扣费币种
  cardId: string // 卡ID
}

export interface TransactionListResponse {
  content: TransactionItem[] // 交易记录列表
  page: {
    size: number // 每页大小
    number: number // 当前页码
    totalElements: number // 总元素数
    totalPages: number // 总页数
  }
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

  /**
   * 查询支付方式
   * @param params 支付方式查询参数
   * @param headers 请求头参数（fingerprint-id 由拦截器自动添加）
   * @returns Promise<ApiResponse<PaymentMethodsResponse>>
   */
  static async getPaymentMethods(
    params: PaymentMethodQueryParams,
    headers: CardRequestHeaders
  ): Promise<ApiResponse<PaymentMethodsResponse>> {
    const response = await api.get('/card/consume/common/paymentMethods', {
      params: {
        orderType: params.orderType
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
   * 查询持卡人信息
   * @param headers 请求头参数（fingerprint-id 由拦截器自动添加）
   * @returns Promise<ApiResponse<CardHolderResponse>>
   */
  static async queryCardHolder(
    headers: CardRequestHeaders
  ): Promise<ApiResponse<CardHolderResponse>> {
    const response = await api.get('/card/consume/operator/queryHolder', {
      headers: {
        'token': headers.token,
        'refresh_token': headers.refresh_token
        // fingerprint-id 由请求拦截器自动添加
      }
    })
    return response.data
  }

  /**
   * 修改持卡人信息
   * @param holderInfo 持卡人信息
   * @param headers 请求头参数（fingerprint-id 由拦截器自动添加）
   * @returns Promise<ApiResponse<null>>
   */
  static async updateCardHolder(
    holderInfo: CardHolderInfo,
    headers: CardRequestHeaders
  ): Promise<ApiResponse<null>> {
    const response = await api.post('/card/consume/operator/updateHolder', holderInfo, {
      headers: {
        'token': headers.token,
        'refresh_token': headers.refresh_token
        // fingerprint-id 由请求拦截器自动添加
      }
    })
    return response.data
  }

  /**
   * 查询卡详情
   * @param params 卡详情查询参数
   * @param headers 请求头参数（fingerprint-id 由拦截器自动添加）
   * @returns Promise<ApiResponse<CardDetailResponse>>
   */
  static async queryCardDetail(
    params: CardDetailQueryParams,
    headers: CardRequestHeaders
  ): Promise<ApiResponse<CardDetailResponse>> {
    const response = await api.get('/card/consume/operator/queryCardDetailInfo', {
      params: {
        cardId: params.cardId
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
   * 查询卡列表
   * @param headers 请求头参数（fingerprint-id 由拦截器自动添加）
   * @returns Promise<ApiResponse<CardListItem[]>>
   */
  static async queryCardList(
    headers: CardRequestHeaders
  ): Promise<ApiResponse<CardListItem[]>> {
    const response = await api.get('/card/consume/operator/queryCardList', {
      headers: {
        'token': headers.token,
        'refresh_token': headers.refresh_token
        // fingerprint-id 由请求拦截器自动添加
      }
    })
    return response.data
  }

  /**
   * 消费记录分页查询
   * @param params 分页查询参数
   * @param headers 请求头参数（fingerprint-id 由拦截器自动添加）
   * @returns Promise<ApiResponse<TransactionListResponse>>
   */
  static async queryTransactionList(
    params: TransactionListQueryParams,
    headers: CardRequestHeaders
  ): Promise<ApiResponse<TransactionListResponse>> {
    const response = await api.post('/card/consume/operator/queryTransactionList', params, {
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
  saveCardHolder,
  getPaymentMethods,
  queryCardHolder,
  updateCardHolder,
  queryCardDetail,
  queryCardList,
  queryTransactionList
} = CardAPI
