import { api } from '@/services/api'

// 支付方式查询参数
export interface PaymentMethodsQueryParams {
  orderType: 'IN' | 'OUT' // IN=入金，OUT=出金
}

// 汇率查询参数
export interface RateQueryParams {
  cryptoUnit: string // 币种单位
  network: string // 网络
  number: string // 数量
  saleDirection: 'SELL' | 'BUY' // 方向，SELL=出金，BUY=入金
  exchange: 'WALLET' | 'BINANCE' // 交易所，目前 WALLET OR BINANCE
  fiatUnit: string // 充值的法币单位
}

// 订单币种信息
export interface OrderCrypto {
  name: string // 币种名称
  fullName: string // 币种全名
  logoUrl: string // 图片
}

// 订单网络信息
export interface OrderNetwork {
  name: string // 网络名称
  addressRegex: string // 地址规则
  fullName: string // 全面
  sortName: string // 别名
  logoUrl: string // 图片
}

// 订单币种网络信息
export interface OrderCryptoNetwork {
  minLimit: number // 最小值
  maxLimit: number // 最大值
  sorts: number // 排序
  type: 'IN' | 'OUT' // 类型，IN=入金，OUT=出金
  crypto: OrderCrypto // 币种
  network: OrderNetwork // 网络
}

// 订单支付方式
export interface OrderPayType {
  name: string // 支付方式名称
  img: string | null // 图片
  detailsImg: string | null // 详细图片
  sorts: number // 排序
  cryptoNetworks: OrderCryptoNetwork[] // 币种网络
}

// 订单支付方式响应数据
export interface OrderPaymentMethodsModel {
  payTypes: OrderPayType[]
}

// 订单支付方式响应
export interface OrderPaymentMethodsResponse {
  code: string
  msg: string
  model: OrderPaymentMethodsModel
  success: boolean
  error: boolean
}

// 法币明细
export interface OrderFiatDetail {
  fiatUnit: string | null // 法币单位
  fiatFee: string // 法币手续费
  fiatAmount: string // 法币金额
  fiatToUsdRate: string // 法币对USDT汇率
  totalAmountFiat: string // 法币总金额
}

// 数币明细
export interface OrderCryptoDetail {
  cryptoUnit: string // 币种单位
  cryptoFee: string // 数币手续费
  cryptoAmount: string // 数币金额
  cryptoToUsdTRate: string // 数币汇率
  totalAmountCrypto: string // 数币总金额
}

// 汇率查询响应数据
export interface OrderRateModel {
  currencyType: string // 币种类型
  saleDirection: string // 方向
  usdTFee: string // 手续费
  number: string // 数量
  totalAmountUsdT: string // 应付金额
  fiatDetail: OrderFiatDetail // 法币明细
  cryptoDetail: OrderCryptoDetail // 数币明细
}

// 汇率查询响应
export interface OrderRateResponse {
  code: string
  msg: string
  model: OrderRateModel
  success: boolean
  error: boolean
}

// 订单相关 API
export class OrderAPI {
  /**
   * 查询支付方式
   * @param params 查询参数
   * @returns 支付方式列表
   */
  static async getPaymentMethods(params: PaymentMethodsQueryParams): Promise<OrderPaymentMethodsResponse> {
    const response = await api.get<OrderPaymentMethodsResponse>('/card/consume/common/paymentMethods', {
      params: {
        orderType: params.orderType
      }
    })
    return response.data
  }

  /**
   * 查询汇率
   * @param params 查询参数
   * @returns 汇率信息
   */
  static async getRate(params: RateQueryParams): Promise<OrderRateResponse> {
    const response = await api.post<OrderRateResponse>('/card/consume/common/rate', {
      cryptoUnit: params.cryptoUnit,
      network: params.network,
      number: params.number,
      saleDirection: params.saleDirection,
      exchange: params.exchange,
      fiatUnit: params.fiatUnit
    })
    return response.data
  }
}

// 导出所有类型和 API
export default OrderAPI
