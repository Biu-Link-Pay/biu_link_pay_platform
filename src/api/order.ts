import { api } from '@/services/api'

// Payment method query parameters
export interface PaymentMethodsQueryParams {
  orderType: 'IN' | 'OUT' // IN=deposit, OUT=withdrawal
}

// Exchange rate query parameters
export interface RateQueryParams {
  cryptoUnit: string // Currency unit
  network: string // Network
  number: string // Amount
  saleDirection: 'SELL' | 'BUY' // Direction, SELL=withdrawal, BUY=deposit
  exchange: 'WALLET' | 'BINANCE' // Exchange, currently WALLET OR BINANCE
  fiatUnit: string // Fiat currency unit for recharge
  cardRewardPoints: number // Card reward points
}

// Order currency information
export interface OrderCrypto {
  name: string // Currency name
  fullName: string // Currency full name
  logoUrl: string // Logo image
}

// Order network information
export interface OrderNetwork {
  name: string // Network name
  addressRegex: string // Address regex
  fullName: string // Full name
  sortName: string // Alias
  logoUrl: string // Logo image
}

// Order currency network information
export interface OrderCryptoNetwork {
  minLimit: number // Minimum limit
  maxLimit: number // Maximum limit
  sorts: number // Sort order
  type: 'IN' | 'OUT' // Type, IN=deposit, OUT=withdrawal
  crypto: OrderCrypto // Currency
  network: OrderNetwork // Network
}

// Order payment method
export interface OrderPayType {
  name: string // Payment method name
  img: string | null // Image
  detailsImg: string | null // Detail image
  sorts: number // Sort order
  expires: number // Expiration time
  cryptoNetworks: OrderCryptoNetwork[] // Currency networks
}

// Order payment method response data
export interface OrderPaymentMethodsModel {
  payTypes: OrderPayType[]
}

// Order payment method response
export interface OrderPaymentMethodsResponse {
  code: string
  msg: string
  model: OrderPaymentMethodsModel
  success: boolean
  error: boolean
}

// Fiat currency details
export interface OrderFiatDetail {
  fiatUnit: string | null // Fiat currency unit
  fiatFee: string // Fiat currency fee
  fiatAmount: string // Fiat currency amount
  fiatToUsdRate: string // Fiat currency to USDT exchange rate
  totalAmountFiat: string // Total fiat currency amount
}

// Digital currency details
export interface OrderCryptoDetail {
  cryptoUnit: string // Currency unit
  cryptoFee: string // Digital currency fee
  cryptoAmount: string // Digital currency amount
  cryptoToUsdTRate: string // Digital currency exchange rate
  totalAmountCrypto: string // Total digital currency amount
}

// Exchange rate query response data
export interface OrderRateModel {
  currencyType: string // Currency type
  saleDirection: string // Direction
  usdTFee: string // Fee
  number: string // Amount
  totalAmountUsdT: string // Total amount to pay
  fiatDetail: OrderFiatDetail // Fiat currency details
  cryptoDetail: OrderCryptoDetail // Digital currency details
  cardPoints: number // Card points
}

// Exchange rate query response
export interface OrderRateResponse {
  code: string
  msg: string
  model: OrderRateModel
  success: boolean
  error: boolean
}

// Create deposit order request parameters
export interface CreateDepositOrderParams {
  cardPattern: string // 1:virtual card 2:physical card
  type: string // 1:apply card 2:recharge
  cardBin: string // Card BIN
  payType: string // BINANCE, WALLET
  amount: number // Order amount
  orderCurrency: string // Order currency
  userCardId: string // User cardId, when type is 1, cardBin is required, when type is 2, userCardId is required
  token?: string // Token
  network?: string // Network
  address?: string // Address
  cardNo?: string // Card number, required when type is 2 (recharge)
  cardRewardPoints: number // Card reward points
}

// Create deposit order response data
export interface CreateDepositOrderModel {
  orderNum: string // Order number
  webUrl: string // Payment link
  deeplink: string // Deep payment link, redirect to local app
  qrcodeLink: string // QR code link
  exchange: string // Exchange, BINANCE OR WALLET
}

// Create deposit order response
export interface CreateDepositOrderResponse {
  code: string
  msg: string
  model: CreateDepositOrderModel
  success: boolean
  error: boolean
}

// 入金订单详情项
export interface DepositOrderDetailItem {
  cardPattern: string | null // 1:虚拟卡 2:实体卡
  type: string | null // 1:办卡 2:充值
  cardBin: string | null // 卡段
  payType: string | null // 1:binancePay，2:wallet
  amount: number | null // 订单金额
  orderCurrency: string | null // 订单币种
  token: string | null // token
  network: string | null // 网络
  address: string | null // 地址
  status: string // 订单状态 INIT：待支付，PENDING:处理中,SUCCESS：支付成功，FAIL：失败，CANCEL：已取消
  webUrl: string // 支付链接
  createTime?: string | null // 创建时间
  currentTime?: string | null // 当前时间
  hashId?: string | null // 交易哈希
  errorMessage?: string | null // 错误信息
  expires?: number // 过期时间
  cardNo?: string | null // 卡号（可选）
  cardRewardPoints: number // 卡奖励点数
  cryptoAmount: number // 数字货币金额
}

// 入金订单详情查询响应
export interface DepositOrderDetailResponse {
  code: string
  msg: string
  model: DepositOrderDetailItem
  success: boolean
  error: boolean
}

// 入金订单列表项
export interface DepositOrderListItem {
  num: string // 订单号
  type: string // 1:办卡 2:充值
  amount: number // 订单金额
  orderCurrency: string // 订单币种
  token: string // 币种
  network: string // 网络
  usdAmount: number // usd金额
  networkFee: number // 网络费
  address: string // 地址
  createTime: string | null // 创建时间
  currentTime: string | null // 当前时间
  webUrl: string // 支付链接
  cardNo: string // 卡号
  cardRewardPoints: number // 卡奖励点数
  status?: string // 订单状态（可选，API可能不返回）
}

// 分页信息
export interface PageInfo {
  size: number // 每页条数
  number: number // 当前页码
  totalElements: number // 总元素数
  totalPages: number // 总页数
}

// 入金订单分页查询响应数据
export interface DepositOrderPageModel {
  content: DepositOrderListItem[] // 订单列表
  page: PageInfo // 分页信息
}

// 入金订单分页查询响应
export interface DepositOrderPageResponse {
  code: string
  msg: string
  model: DepositOrderPageModel
  success: boolean
  error: boolean
}

// 入金订单分页查询参数
export interface DepositOrderPageParams {
  pageNo: number // 第几页
  pageSize: number // 每页条数
}

// 入金订单详情查询参数
export interface DepositOrderDetailParams {
  num: string // 订单号
}

// 出金订单详情项
export interface WithdrawOrderDetailItem {
  num: string | null // 订单号
  type: string | null // 1:提现 2:退款
  token: string | null // token
  network: string | null // 网络
  usdAmount: number | null // usd金额
  networkFee: number | null // 网络费
  address: string | null // 地址
  hashId: string | null // hashId
  createTime: string | null // 创建时间
  status: string // 订单状态 INIT：待支付，PENDING:处理中,SUCCESS：支付成功，FAIL：失败，CANCEL：已取消
  usdTAmount: number | null // usd金额
  orderCurrency: string | null // 订单币种
  cardNo?: string | null // 卡号（可选）
  cardRewardPoints: number // 卡奖励点数
  failReason: string | null // 失败原因
}

// 出金订单详情查询响应
export interface WithdrawOrderDetailResponse {
  code: string
  msg: string
  model: WithdrawOrderDetailItem
  success: boolean
  error: boolean
}

// 出金订单详情查询参数
export interface WithdrawOrderDetailParams {
  num: string // 订单号
}

// 出金订单分页查询参数
export interface WithdrawOrderPageParams {
  pageNo: number // 第几页
  pageSize: number // 每页条数
}

// 出金订单列表项（分页查询）
export interface WithdrawOrderListItem {
  num: string | null // 订单号
  type: string | null // 1:提现 2:退款
  token: string | null // token
  network: string | null // 网络
  usdAmount: number | null // usd金额
  networkFee: number | null // 网络费
  address: string | null // 地址
  hashId: string | null // hashId
  createTime: string | null // 创建时间
  cardNo: string // 卡号
  status?: string // 订单状态（可选，API可能不返回）
  orderCurrency?: string | null // 订单币种（可选）
  cardRewardPoints: number // 卡奖励点数
}

// 出金订单分页查询响应数据
export interface WithdrawOrderPageModel {
  content: WithdrawOrderListItem[] // 出金订单列表
  page: PageInfo // 分页信息
}

// 出金订单分页查询响应
export interface WithdrawOrderPageResponse {
  code: string
  msg: string
  model: WithdrawOrderPageModel
  success: boolean
  error: boolean
}

// 创建出金订单请求参数
export interface CreateWithdrawOrderParams {
  cardPattern: string // 1:虚拟卡 2:实体卡
  type: string // 1:提现 2:退款
  cardId: string // 卡ID
  token: string // token
  network: string // 网络
  address: string // 地址
  delFlag: boolean // true=删卡，false=不删卡
  withdrawAmount: string // 提现金额
  cardNo: string // 卡号
  cardRewardPoints: number // 卡奖励点数
  payType: string // 支付类型,如果提现法币，填写法币支付方式，提现数币，添加WALLET 或者BINANCE
  customParam: string // 提现法币相关参数
  faCode: string // 2fa码
}

// 创建出金订单响应
export interface CreateWithdrawOrderResponse {
  code: string
  msg: string
  model: string // 订单号
  success: boolean
  error: boolean
}

// 消费记录项
export interface TransactionListItem {
  status: string // 状态
  transactionType: string // 交易类型
  transactionAmount: number // 交易金额
  transactionCurrency: string // 交易币种
  merchantNameLocation: string // 商家名字
  merchantLocation: string // 商户所在国家
  feeDeductionAmount: number // 手续费扣费金额
  feeDeductionCurrency: string // 手续费扣费币种
  cardId: string // 卡ID
  createTime: string // 创建时间
  msg?: string // 失败原因（失败状态时显示）
  cardRewardPoints: number // 卡奖励点数
}

// 消费记录分页查询参数
export interface TransactionListParams {
  pageIndex: string // 第几页
  pageSize: string // 每页多少条
  cardId: string // 卡ID
}

// 消费记录分页查询响应数据
export interface TransactionListModel {
  content: TransactionListItem[] // 消费记录列表
  page: PageInfo // 分页信息
}

// 消费记录分页查询响应
export interface TransactionListResponse {
  code: string
  msg: string
  model: TransactionListModel
  success: boolean
  error: boolean
}

// 查询法币汇率请求参数
export interface FiatRateParams {
  number: string // 数量
  saleDirection: 'SELL' | 'BUY' // 方向，SELL=出金，BUY=入金
  fiatUnit: string // 充值的法币单位
  cardRewardPoints: number // 卡积分
  methodCode: string // 支付方式
}

// 源币种信息
export interface FiatRateSource {
  currency: string // 币种
  amount: number // 金额
}

// 目标币种信息
export interface FiatRateTarget {
  currency: string // 币种
  rate: number // 汇率
  amount: number // 金额
}

// 费明细
export interface FiatRateFeeDetail {
  feeRatio: number // 费率
  fixedFee: number // 固定手续费
  amount: number // 手续费金额
  currency: string // 手续费币种
}

// 查询法币汇率响应数据
export interface FiatRateModel {
  source: FiatRateSource // 源币种信息
  target: FiatRateTarget // 目标币种信息
  feeDetail: FiatRateFeeDetail // 费明细
  cardPoints: string // 卡积分
}

// 查询法币汇率响应
export interface FiatRateResponse {
  code: string
  msg: string
  model: FiatRateModel
  success: boolean
  error: boolean
}

// 法币支付方式字段
export interface FiatPaymentMethodField {
  name: string // 名称
  label: string // 展示名称
  required: boolean // 必填true，非必填false
  type: string // 传值类型
  options: null | any // 可选项
  placeholder: string // 展示信息
  maxLength: string // 最大长度
  minLength: string // 最小长度
}

// 法币支付方式项
export interface FiatPaymentMethodItem {
  methodCode: string // 支付方式code
  methodName: string // 支付方式名称
  minLimit: number // 最小限额
  maxLimit: number // 最大限额
  fixedFee: number // 固定手续费
  feeRatio: number // 手续费率
  logoUrl: string // logo
  remark: null | string // 备注
  expireTime: number // 过期时间
  type: string // IN=入金，OUT=出金
  fields: FiatPaymentMethodField[] // 参数传值
}

// 查询法币支付方式响应数据
export interface FiatPaymentMethodsModel {
  methodType: string // 支付方式类型
  fiatPaymentMethod: FiatPaymentMethodItem[] // 法币支付方式
}

// 查询法币支付方式响应
export interface FiatPaymentMethodsResponse {
  code: string
  msg: string
  model: FiatPaymentMethodsModel[] // 返回数组，每个元素包含 methodType 和 fiatPaymentMethod
  success: boolean
  error: boolean
}

// 查询法币支付方式请求参数
export interface FiatPaymentMethodsParams {
  orderType: 'IN' | 'OUT' // IN=入金，OUT=出金
}

// 银行信息查询响应数据
export interface BankQueryModel {
  bankName: string[] // 银行名称
  countryCode: string // 国家code
}

// 银行信息查询响应
export interface BankQueryResponse {
  code: string
  msg: string
  model: BankQueryModel[] // 数组形式，每个元素包含某个国家的银行列表
  success: boolean
  error: boolean
}

// Order related API
export class OrderAPI {
  /**
   * Query payment methods
   * @param params Query parameters
   * @returns Payment methods list
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
   * Query exchange rate
   * @param params Query parameters
   * @returns Exchange rate information
   */
  static async getRate(params: RateQueryParams): Promise<OrderRateResponse> {
    const response = await api.post<OrderRateResponse>('/card/consume/common/rate', {
      cryptoUnit: params.cryptoUnit,
      network: params.network,
      number: params.number,
      saleDirection: params.saleDirection,
      exchange: params.exchange,
      fiatUnit: params.fiatUnit,
      cardRewardPoints: params.cardRewardPoints
    })
    return response.data
  }

  /**
   * Create deposit order
   * @param params Create order parameters
   * @returns Create order response
   */
  static async createDepositOrder(params: CreateDepositOrderParams): Promise<CreateDepositOrderResponse> {
    const response = await api.post<CreateDepositOrderResponse>('/card/consume/order/createDepositOrder', {
      cardPattern: params.cardPattern,
      type: params.type,
      cardBin: params.cardBin,
      payType: params.payType,
      amount: params.amount,
      orderCurrency: params.orderCurrency,
      userCardId: params.userCardId,
      token: params.token,
      network: params.network,
      address: params.address,
      cardNo: params.cardNo,
      cardRewardPoints: params.cardRewardPoints
    })
    return response.data
  }

  /**
   * Create withdraw order
   * @param params Create withdraw order parameters
   * @returns Create withdraw order response
   */
  static async createWithdrawOrder(params: CreateWithdrawOrderParams): Promise<CreateWithdrawOrderResponse> {
    const response = await api.post<CreateWithdrawOrderResponse>('/card/consume/order/createWithdrawOrder', {
      cardPattern: params.cardPattern,
      type: params.type,
      cardId: params.cardId,
      token: params.token,
      network: params.network,
      address: params.address,
      delFlag: params.delFlag,
      withdrawAmount: params.withdrawAmount,
      cardNo: params.cardNo,
      cardRewardPoints: params.cardRewardPoints,
      payType: params.payType,
      customParam: params.customParam,
      faCode: params.faCode
    })
    return response.data
  }

  /**
   * Query deposit order details
   * @param params Query parameters
   * @returns Order details
   */
  static async getDepositOrderDetail(params: DepositOrderDetailParams): Promise<DepositOrderDetailResponse> {
    const response = await api.get<DepositOrderDetailResponse>('/card/consume/order/queryDepositOrder', {
      params: {
        num: params.num
      }
    })
    return response.data
  }

  /**
   * Paginated query deposit orders
   * @param params Pagination query parameters
   * @returns Order pagination list
   */
  static async getDepositOrderPage(params: DepositOrderPageParams): Promise<DepositOrderPageResponse> {
    const response = await api.get<DepositOrderPageResponse>('/card/consume/order/queryPageDepositOrder', {
      params: {
        pageNo: params.pageNo,
        pageSize: params.pageSize
      }
    })
    return response.data
  }

  /**
   * Query withdrawal order details
   * @param params Query parameters
   * @returns Withdrawal order details
   */
  static async getWithdrawOrderDetail(params: WithdrawOrderDetailParams): Promise<WithdrawOrderDetailResponse> {
    const response = await api.get<WithdrawOrderDetailResponse>('/card/consume/order/queryWithdrawOrder', {
      params: {
        num: params.num
      }
    })
    return response.data
  }

  /**
   * Paginated query withdrawal orders
   * @param params Pagination query parameters
   * @returns Withdrawal order pagination list
   */
  static async getWithdrawOrderPage(params: WithdrawOrderPageParams): Promise<WithdrawOrderPageResponse> {
    const response = await api.get<WithdrawOrderPageResponse>('/card/consume/order/queryPageWithdrawOrder', {
      params: {
        pageNo: params.pageNo,
        pageSize: params.pageSize
      }
    })
    return response.data
  }

  /**
   * Transaction records pagination query
   * @param params Query parameters
   * @returns Transaction records pagination list
   */
  static async getTransactionList(params: TransactionListParams): Promise<TransactionListResponse> {
    const response = await api.request<TransactionListResponse>({
      method: 'GET',
      url: '/card/consume/operator/queryTransactionList',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        cardId: params.cardId
      }
    })
    return response.data
  }

  /**
   * Query fiat currency exchange rate
   * @param params Query parameters
   * @returns Fiat currency exchange rate information
   */
  static async getFiatRate(params: FiatRateParams): Promise<FiatRateResponse> {
    const response = await api.post<FiatRateResponse>('/card/consume/common/fiatRate', {
      number: params.number,
      saleDirection: params.saleDirection,
      fiatUnit: params.fiatUnit,
      cardRewardPoints: params.cardRewardPoints,
      methodCode: params.methodCode
    })
    return response.data
  }

  /**
   * Query fiat payment methods
   * @param params Query parameters
   * @returns Fiat payment methods list
   */
  static async getFiatPaymentMethods(params: FiatPaymentMethodsParams): Promise<FiatPaymentMethodsResponse> {
    const response = await api.get<FiatPaymentMethodsResponse>('/card/consume/common/fiatPaymentMethods', {
      params: {
        orderType: params.orderType
      }
    })
    return response.data
  }

  /**
   * Query bank information
   * @returns Bank information
   */
  static async getBankQuery(): Promise<BankQueryResponse> {
    const response = await api.get<BankQueryResponse>('/card/consume/common/bankQuery')
    return response.data
  }
}

// Export all types and API
export default OrderAPI
