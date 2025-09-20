import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CardAPI } from '@/api/card'
import { useAuthStore } from '@/stores/auth'
import type { ApiResponse } from '@/types/api'
import type {
  CardConfig,
  CardBin,
  QueryCardBinParams,
  CardHolderInfo,
  CardListItem,
  TransactionListQueryParams,
  TransactionListResponse
} from '@/api/card'

export const useCardStore = defineStore('card', () => {
  // 状态
  const cardConfigs = ref<CardConfig[]>([
    // 测试数据
    {
      cardPattern: 1,
      cardName: 'Virtual Mastercard',
      cardType: '1',
      applyFee: 10,
      monthlyFee: 5,
      rechargeFee: 2,
      maxOnMonthly: 10000,
      maxOnDaily: 1000,
      maxOnPercent: 500,
      status: 1, // 启用
      cardPicture: null
    },
    {
      cardPattern: 2,
      cardName: 'Physical Visa',
      cardType: '1',
      applyFee: 25,
      monthlyFee: 8,
      rechargeFee: 3,
      maxOnMonthly: 20000,
      maxOnDaily: 2000,
      maxOnPercent: 1000,
      status: 1, // 启用
      cardPicture: null
    },
    {
      cardPattern: 1,
      cardName: 'Virtual Amex',
      cardType: '1',
      applyFee: 15,
      monthlyFee: 7,
      rechargeFee: 2.5,
      maxOnMonthly: 15000,
      maxOnDaily: 1500,
      maxOnPercent: 750,
      status: 2, // 禁用
      cardPicture: null
    }
  ])
  const cardBins = ref<CardBin[]>([])
  const cardList = ref<CardListItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 选中的卡片 BIN 信息
  const selectedCardBin = ref<CardBin | null>(null)
  const selectedCardConfig = ref<CardConfig | null>(null)

  // 订单信息
  const currentOrder = ref<any>(null)

  // 计算属性
  const availableCards = computed(() =>
    cardConfigs.value.filter(card => card.status === 1)
  )

  const virtualCards = computed(() =>
    cardConfigs.value.filter(card => card.cardPattern === 1)
  )

  const physicalCards = computed(() =>
    cardConfigs.value.filter(card => card.cardPattern === 2)
  )

  const enabledCards = computed(() =>
    cardConfigs.value.filter(card => card.status === 1)
  )

  const hasCards = computed(() => cardList.value.length > 0)

  // 获取请求头
  const getRequestHeaders = () => {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('token') || ''
    const refreshToken = authStore.refreshToken || localStorage.getItem('refreshToken') || ''

    return {
      token,
      'fingerprint-id': 'default-fingerprint-id', // 这里可以从设备指纹获取
      refresh_token: refreshToken
    }
  }

  // 获取卡片配置
  const fetchCardConfigs = async () => {
    loading.value = true
    error.value = null

    try {
      const headers = getRequestHeaders()
      const response: ApiResponse<CardConfig[]> = await CardAPI.getCardConfig(headers)

      if (response.success && response.model) {
        cardConfigs.value = response.model
        return { success: true, data: response.model }
      } else {
        throw new Error(response.msg || '获取卡片配置失败')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取卡片配置失败'
      console.error('获取卡片配置失败:', err)
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  // 查询卡片 BIN
  const fetchCardBins = async (params: QueryCardBinParams) => {
    loading.value = true
    error.value = null

    try {
      const headers = getRequestHeaders()
      const response: ApiResponse<CardBin[]> = await CardAPI.queryCardBin(params, headers)

      if (response.success && response.model) {
        cardBins.value = response.model
        return { success: true, data: response.model }
      } else {
        throw new Error(response.msg || '查询卡片 BIN 失败')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '查询卡片 BIN 失败'
      console.error('查询卡片 BIN 失败:', err)
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  // 保存持卡人信息
  const saveCardHolder = async (holderInfo: CardHolderInfo) => {
    loading.value = true
    error.value = null

    try {
      const headers = getRequestHeaders()
      const response: ApiResponse<null> = await CardAPI.saveCardHolder(holderInfo, headers)

      if (response.success) {
        return { success: true, message: '持卡人信息保存成功' }
      } else {
        throw new Error(response.msg || '保存持卡人信息失败')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '保存持卡人信息失败'
      console.error('保存持卡人信息失败:', err)
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  // 获取卡片列表
  const fetchCardList = async () => {
    loading.value = true
    error.value = null

    try {
      const headers = getRequestHeaders()
      const response: ApiResponse<CardListItem[]> = await CardAPI.queryCardList(headers)

      if (response.success && response.model) {
        cardList.value = response.model
        return { success: true, data: response.model }
      } else {
        throw new Error(response.msg || '获取卡片列表失败')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取卡片列表失败'
      console.error('获取卡片列表失败:', err)
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  // 根据名称获取卡片配置
  const getCardConfigByName = (cardName: string): CardConfig | undefined => {
    return cardConfigs.value.find(card => card.cardName === cardName)
  }

  // 根据类型获取卡片配置
  const getCardConfigsByType = (cardType: string): CardConfig[] => {
    return cardConfigs.value.filter(card => card.cardType === cardType)
  }

  // 根据模式获取卡片配置
  const getCardConfigsByPattern = (cardPattern: number): CardConfig[] => {
    return cardConfigs.value.filter(card => card.cardPattern === cardPattern)
  }

  // 获取启用的卡片配置
  const getEnabledCardConfigs = (): CardConfig[] => {
    return cardConfigs.value.filter(card => card.status === 1)
  }

  // 设置选中的卡片 BIN
  const setSelectedCardBin = (cardBin: CardBin | null) => {
    selectedCardBin.value = cardBin
  }

  // 设置选中的卡片配置
  const setSelectedCardConfig = (cardConfig: CardConfig | null) => {
    selectedCardConfig.value = cardConfig
  }

  // 设置当前订单信息
  const setCurrentOrder = (order: any) => {
    currentOrder.value = order
  }

  // 清除当前订单信息
  const clearCurrentOrder = () => {
    currentOrder.value = null
  }

  // 清除选中的卡片信息
  const clearSelectedCard = () => {
    selectedCardBin.value = null
    selectedCardConfig.value = null
  }

  // 清除错误状态
  const clearError = () => {
    error.value = null
  }

  // 重置状态
  const reset = () => {
    cardConfigs.value = []
    cardBins.value = []
    cardList.value = []
    loading.value = false
    error.value = null
    selectedCardBin.value = null
    selectedCardConfig.value = null
    currentOrder.value = null
  }

  return {
    // 状态
    cardConfigs,
    cardBins,
    cardList,
    loading,
    error,
    selectedCardBin,
    selectedCardConfig,
    currentOrder,

    // 计算属性
    availableCards,
    virtualCards,
    physicalCards,
    enabledCards,
    hasCards,

    // 方法
    fetchCardConfigs,
    fetchCardBins,
    saveCardHolder,
    fetchCardList,
    getCardConfigByName,
    getCardConfigsByType,
    getCardConfigsByPattern,
    getEnabledCardConfigs,
    setSelectedCardBin,
    setSelectedCardConfig,
    setCurrentOrder,
    clearCurrentOrder,
    clearSelectedCard,
    clearError,
    reset
  }
}, {
  persist: {
    key: 'card-store',
    storage: localStorage
  }
})
