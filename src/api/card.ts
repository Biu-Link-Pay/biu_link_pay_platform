import type { ApiResponse } from '@/types/api'
import { api } from '@/services/api'

// Card configuration related types
export interface CardConfig {
  cardPattern: number // 1=virtual card, 2=physical card
  cardName: string // Card name
  cardType: string // Card type, 1=regular card
  applyFee: number // Application fee
  monthlyFee: number // Monthly fee
  rechargeFee: number // Recharge fee
  maxOnMonthly: number // Monthly transaction limit
  maxOnDaily: number // Daily transaction limit
  maxOnPercent: number // Maximum single transaction amount
  status: number // 1:enabled, 2:disabled
  cardPicture: string | null // Card picture
  applyNumber: number // Apply number
}

// Card BIN related types
export interface CardBin {
  cardBin: string | null // cardBin
  cardType: string | null // Card type
  cardScheme: string | null // Card scheme
  cardCurrency: string | null // Card currency
  billingAddressUpdatable: string | null // Whether address can be updated
  expiryDateCustomization: string | null // Whether expiry date can be customized
  remainingAvailableCard: number | null // Remaining available cards
  availableCard: number | null // Number of cards issued
  cardFormFactor: string | null // Virtual card or physical card
  cardId?: string | null // Card ID, used for recharge operations
  cardNo?: string | null // Card number (optional, used for display/header)
  countryName?: string | null // Country name
  countryCode?: string | null // Country code
}

// Query card BIN parameters
export interface QueryCardBinParams {
  cardFormFactor: 'virtual_card' | 'physical_card' // virtual_card=virtual card, physical_card=physical card
}

// Cardholder information related types
export interface CardHolderInfo {
  residentialAddress: string // Billing address
  residentialCity: string // Billing city
  residentialCountryCode: string // Billing country code
  residentialPostalCode: string // Billing postal code
  residentialState: string // Billing state/province
}

// Payment method related types
export interface PaymentMethodQueryParams {
  orderType: 'IN' | 'OUT' // IN=deposit, OUT=withdrawal
}

export interface Crypto {
  name: string // Currency name
  fullName: string // Currency full name
  logoUrl: string // Logo image
}

export interface Network {
  name: string // Network name
  addressRegex: string // Address regex
  fullName: string // Full name
  sortName: string // Alias
  logoUrl: string // Logo image
}

export interface CryptoNetwork {
  minLimit: number // Minimum limit
  maxLimit: number // Maximum limit
  sorts: number // Sort order
  type: 'IN' | 'OUT' // Type, IN=deposit, OUT=withdrawal
  crypto: Crypto // Currency
  network: Network // Network
}

export interface PayType {
  name: string // Payment method name
  img: string | null // Image
  detailsImg: string | null // Detail image
  sorts: number // Sort order
  cryptoNetworks: CryptoNetwork[] // Currency networks
}

export interface PaymentMethodsResponse {
  payTypes: PayType[] // Payment methods list
}

// Cardholder query related types
export interface CardHolderResponse {
  cardholderId: string // Cardholder ID
  firstName: string // First name
  lastName: string // Last name
  cardholderNameAbbreviation: string // Cardholder full name
  residentialAddress: string // Billing address
  residentialCity: string // Billing city
  residentialCountryCode: string // Billing country code
  residentialPostalCode: string // Billing postal code
  residentialState: string // Billing state/province
}

// Card detail related types
export interface CardDetailQueryParams {
  cardId: string // Card ID
  faCode: string // Google Auth code
}

export interface CardDetailResponse {
  cardId: string // Card ID
  cardNo: string // Card number
  cardCurrency: string // Card currency
  firstName: string // First name
  lastName: string // Last name
  cvv: string // CVV
  expirationDate: string // Expiration date
  billingCountry: string // Billing country
  cardBalance: number // Balance
  billingState: string // Billing state/province
  billingCity: string // Billing city
  billingAddress: string // Billing address
  billingPostalCode: string // Billing postal code
  billingAddressUpdatable: string // Y=updatable, N=not updatable
}

// Card list related types
export interface CardListItem {
  cardId: string // Card ID
  cardNo: string // Card number
  maxOnMonthly: string // Monthly limit
  maxOnDaily: string // Daily limit
  maxOnPercent: string // Single transaction limit
  cardCurrency: string // Card currency
  cardScheme: string // Card scheme
  cardBalance: number // Card balance
}

// Transaction record pagination query related types
export interface TransactionListQueryParams {
  pageIndex: string // Page number
  pageSize: string // Items per page
  cardId: string // Card ID
}

export interface TransactionItem {
  status: string // Status
  transactionType: string // Transaction type
  arrivalAmount: number // Transaction amount
  transactionCurrency: string // Transaction currency
  merchantNameLocation: string // Merchant name
  merchantLocation: string // Merchant country
  feeDeductionAmount: number // Fee deduction amount
  feeDeductionCurrency: string // Fee deduction currency
  cardId: string // Card ID
}

export interface CardTransactionListResponse {
  content: TransactionItem[] // Transaction records list
  page: {
    size: number // Page size
    number: number // Current page number
    totalElements: number // Total elements
    totalPages: number // Total pages
  }
}

// Recipient (收款人) related types
// Save recipient request parameters
export interface SaveRecipientParams {
  bankName: string // 银行名称
  bankLocation: string // 银行位置
  currency: string // 币种
  reservedPhoneNumber: string // 手机号，带区号
  recipientLocation: string // 收款人位置
  recipientProvince: string // 收款人省份
  recipientCity: string | null // 收款人城市（可选）
  recipientAddress: string // 收款人地址
  bankAccountNumber: string // 银行账号
  swiftCode: string // swiftCode
}

// Save recipient response
export interface SaveRecipientResponse {
  code: string
  msg: string
  model: null
  success: boolean
  error: boolean
}

// Query recipient response data
export interface QueryRecipientModel {
  id: string
  contactId: string
  cardNumber: string // 银行卡号
}

// Query recipient response
export interface QueryRecipientResponse {
  code: string
  msg: string
  model: QueryRecipientModel
  success: boolean
  error: boolean
}

// Delete recipient response
export interface DeleteRecipientResponse {
  code: string
  msg: string
  model: null
  success: boolean
  error: boolean
}

// Note: token, refresh_token, and fingerprint-id are automatically added by request interceptor

/**
 * Card related API
 */
export class CardAPI {
  /**
   * Query card configuration
   * @returns Promise<ApiResponse<CardConfig[]>>
   */
  static async getCardConfig(): Promise<ApiResponse<CardConfig[]>> {
    const response = await api.get('/card/consume/common/cardConfig')
    return response.data
  }

  /**
   * Query card BIN
   * @param params Query parameters
   * @returns Promise<ApiResponse<CardBin[]>>
   */
  static async queryCardBin(params: QueryCardBinParams): Promise<ApiResponse<CardBin[]>> {
    const response = await api.get('/card/consume/operator/queryCardBin', {
      params: {
        cardFormFactor: params.cardFormFactor
      }
    })
    return response.data
  }

  /**
   * Save cardholder information
   * @param holderInfo Cardholder information
   * @returns Promise<ApiResponse<null>>
   */
  static async saveCardHolder(holderInfo: CardHolderInfo): Promise<ApiResponse<null>> {
    const response = await api.post('/card/consume/operator/saveHolder', holderInfo)
    return response.data
  }

  /**
   * Query cardholder information
   * @returns Promise<ApiResponse<CardHolderResponse>>
   */
  static async queryCardHolder(): Promise<ApiResponse<CardHolderResponse>> {
    const response = await api.get('/card/consume/operator/queryHolder')
    return response.data
  }

  /**
   * Update cardholder information
   * @param holderInfo Cardholder information
   * @returns Promise<ApiResponse<null>>
   */
  static async updateCardHolder(holderInfo: CardHolderInfo): Promise<ApiResponse<null>> {
    const response = await api.post('/card/consume/operator/updateHolder', holderInfo)
    return response.data
  }

  /**
   * Query card details
   * @param params Card detail query parameters
   * @returns Promise<ApiResponse<CardDetailResponse>>
   */
  static async queryCardDetail(params: CardDetailQueryParams): Promise<ApiResponse<CardDetailResponse>> {
    const response = await api.get('/card/consume/operator/queryCardDetailInfo', {
      params: {
        cardId: params.cardId,
        faCode: params.faCode
      }
    })
    return response.data
  }

  /**
   * Query card list
   * @returns Promise<ApiResponse<CardListItem[]>>
   */
  static async queryCardList(): Promise<ApiResponse<CardListItem[]>> {
    const response = await api.get('/card/consume/operator/queryCardList')
    return response.data
  }

  /**
   * Transaction records pagination query
   * @param params Pagination query parameters
   * @returns Promise<ApiResponse<CardTransactionListResponse>>
   */
  static async queryTransactionList(params: TransactionListQueryParams): Promise<ApiResponse<CardTransactionListResponse>> {
    const response = await api.post('/card/consume/operator/queryTransactionList', params)
    return response.data
  }

  /**
   * Save recipient information
   * @param params Recipient information parameters
   * @returns Promise<SaveRecipientResponse>
   */
  static async saveRecipient(params: SaveRecipientParams): Promise<SaveRecipientResponse> {
    const response = await api.post<SaveRecipientResponse>('/card/consume/operator/saveRecipient', {
      bankName: params.bankName,
      bankLocation: params.bankLocation,
      currency: params.currency,
      reservedPhoneNumber: params.reservedPhoneNumber,
      recipientLocation: params.recipientLocation,
      recipientProvince: params.recipientProvince,
      recipientCity: params.recipientCity,
      recipientAddress: params.recipientAddress,
      bankAccountNumber: params.bankAccountNumber,
      swiftCode: params.swiftCode
    })
    return response.data
  }

  /**
   * Query recipient information
   * @returns Promise<QueryRecipientResponse>
   */
  static async queryRecipient(): Promise<QueryRecipientResponse> {
    const response = await api.post<QueryRecipientResponse>('/card/consume/operator/queryRecipient', {})
    return response.data
  }

  /**
   * Delete recipient information
   * @returns Promise<DeleteRecipientResponse>
   */
  static async deleteRecipient(): Promise<DeleteRecipientResponse> {
    const response = await api.post<DeleteRecipientResponse>('/card/consume/operator/deleteRecipient', {})
    return response.data
  }
}

// Export individual functions for easy use
export const {
  getCardConfig,
  queryCardBin,
  saveCardHolder,
  queryCardHolder,
  updateCardHolder,
  queryCardDetail,
  queryCardList,
  queryTransactionList,
  saveRecipient,
  queryRecipient,
  deleteRecipient
} = CardAPI
