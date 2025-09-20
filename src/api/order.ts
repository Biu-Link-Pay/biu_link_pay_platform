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

// 创建入金订单请求参数
export interface CreateDepositOrderParams {
  cardPattern: string // 1:虚拟卡 2:实体卡
  type: string // 1:办卡 2:充值
  cardBin: string // 卡段
  payType: string // 1:binancePay，2:wallet
  amount: number // 订单金额
  orderCurrency: string // 订单币种
  userCardId: string // 用户cardId，当类型为1时，cardBin必填,类型为2时，userCardId必填
  token?: string // token
  network?: string // 网络
  address?: string // 地址
}

// 创建入金订单响应数据
export interface CreateDepositOrderModel {
  orderNum: string // 订单号
  webUrl: string // 支付链接
  deeplink: string // 深度支付链接，跳转本地app
  qrcodeLink: string // 二维码链接
  exchange: string // 交易所,BINANCE OR WALLET
}

// 创建入金订单响应
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
}

// 出金订单详情查询响应
export interface WithdrawOrderDetailResponse {
  code: string
  msg: string
  model: WithdrawOrderDetailItem[]
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
  status: string // 订单状态
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

  /**
   * 创建入金订单
   * @param params 创建订单参数
   * @returns 创建订单响应
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
      address: params.address
    })
    return response.data
  }

  /**
   * 查询入金订单详情
   * @param params 查询参数
   * @returns 订单详情
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
   * 分页查询入金订单
   * @param params 分页查询参数
   * @returns 订单分页列表
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
   * 查询出金订单详情
   * @param params 查询参数
   * @returns 出金订单详情
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
   * 分页查询出金订单
   * @param params 分页查询参数
   * @returns 出金订单分页列表
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
   * 消费记录分页查询
   * @param params 查询参数
   * @returns 消费记录分页列表
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
}

// 导出所有类型和 API
export default OrderAPI
