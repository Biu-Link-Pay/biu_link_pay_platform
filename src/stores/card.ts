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
  CardDetailResponse
} from '@/api/card'

export const useCardStore = defineStore('card', () => {
  // State
  const cardConfigs = ref<CardConfig[]>([
    // Test data
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
      status: 1, // Enabled
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
      status: 1, // Enabled
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
      status: 2, // Disabled
      cardPicture: null
    }
  ])
  const cardBins = ref<CardBin[]>([])
  const cardList = ref<CardListItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Selected card BIN info
  const selectedCardBin = ref<CardBin | null>(null)
  const selectedCardConfig = ref<CardConfig | null>(null)

  // Order info
  const currentOrder = ref<any>(null)

  // Current card detail cache (only store one current card detail)
  const currentCardDetail = ref<CardDetailResponse | null>(null)

  // Computed properties
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

  // Get request headers
  const getRequestHeaders = () => {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('token') || ''
    const refreshToken = authStore.refreshToken || localStorage.getItem('refreshToken') || ''

    return {
      token,
      'fingerprint-id': 'default-fingerprint-id', // Can be obtained from device fingerprint
      refresh_token: refreshToken
    }
  }

  // Get card configuration
  const fetchCardConfigs = async () => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<CardConfig[]> = await CardAPI.getCardConfig()

      if (response.success && response.model) {
        cardConfigs.value = response.model
        return { success: true, data: response.model }
      } else {
        throw new Error(response.msg || 'Failed to get card configuration')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get card configuration'
      console.error('Failed to get card configuration:', err)
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  // Query card BIN
  const fetchCardBins = async (params: QueryCardBinParams) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<CardBin[]> = await CardAPI.queryCardBin(params)

      if (response.success && response.model) {
        cardBins.value = response.model
        return { success: true, data: response.model }
      } else {
        throw new Error(response.msg || 'Failed to query card BIN')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to query card BIN'
      console.error('Failed to query card BIN:', err)
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  // Save cardholder info
  const saveCardHolder = async (holderInfo: CardHolderInfo) => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<null> = await CardAPI.saveCardHolder(holderInfo)

      if (response.success) {
        return { success: true, message: 'Cardholder info saved successfully' }
      } else {
        throw new Error(response.msg || 'Failed to save cardholder info')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save cardholder info'
      console.error('Failed to save cardholder info:', err)
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  // Get card list
  const fetchCardList = async () => {
    loading.value = true
    error.value = null

    try {
      const response: ApiResponse<CardListItem[]> = await CardAPI.queryCardList()

      if (response.success && response.model) {
        cardList.value = response.model
        return { success: true, data: response.model }
      } else {
        throw new Error(response.msg || 'Failed to get card list')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get card list'
      console.error('Failed to get card list:', err)
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  // Get card configuration by name
  const getCardConfigByName = (cardName: string): CardConfig | undefined => {
    return cardConfigs.value.find(card => card.cardName === cardName)
  }

  // Get card configurations by type
  const getCardConfigsByType = (cardType: string): CardConfig[] => {
    return cardConfigs.value.filter(card => card.cardType === cardType)
  }

  // Get card configurations by pattern
  const getCardConfigsByPattern = (cardPattern: number): CardConfig[] => {
    return cardConfigs.value.filter(card => card.cardPattern === cardPattern)
  }

  // Get enabled card configurations
  const getEnabledCardConfigs = (): CardConfig[] => {
    return cardConfigs.value.filter(card => card.status === 1)
  }
  // Get selected card BIN
  const getSelectedCardBin = (): CardBin | null => {
    return selectedCardBin.value
  }
  // Set selected card BIN
  const setSelectedCardBin = (cardBin: CardBin | null) => {
    selectedCardBin.value = cardBin
  }

  // Set selected card configuration
  const setSelectedCardConfig = (cardConfig: CardConfig | null) => {
    selectedCardConfig.value = cardConfig
  }

  // Set current order info
  const setCurrentOrder = (order: any) => {
    currentOrder.value = order
  }

  // Clear current order info
  const clearCurrentOrder = () => {
    currentOrder.value = null
  }

  // Cache current card detail
  const cacheCurrentCardDetail = (cardDetail: CardDetailResponse) => {
    currentCardDetail.value = cardDetail
  }

  // Get cached current card detail
  const getCachedCurrentCardDetail = (): CardDetailResponse | null => {
    return currentCardDetail.value
  }

  // Clear current card detail cache
  const clearCurrentCardDetailCache = () => {
    currentCardDetail.value = null
  }

  // Clear selected card info
  const clearSelectedCard = () => {
    selectedCardBin.value = null
    selectedCardConfig.value = null
  }

  // Clear error state
  const clearError = () => {
    error.value = null
  }

  // Reset state
  const reset = () => {
    cardConfigs.value = []
    cardBins.value = []
    cardList.value = []
    loading.value = false
    error.value = null
    selectedCardBin.value = null
    selectedCardConfig.value = null
    currentOrder.value = null
    currentCardDetail.value = null
  }

  return {
    // State
    cardConfigs,
    cardBins,
    cardList,
    loading,
    error,
    selectedCardBin,
    selectedCardConfig,
    currentOrder,
    currentCardDetail,

    // Computed properties
    availableCards,
    virtualCards,
    physicalCards,
    enabledCards,
    hasCards,

    // Methods
    fetchCardConfigs,
    fetchCardBins,
    saveCardHolder,
    fetchCardList,
    getCardConfigByName,
    getCardConfigsByType,
    getCardConfigsByPattern,
    getEnabledCardConfigs,
    getSelectedCardBin,
    setSelectedCardBin,
    setSelectedCardConfig,
    setCurrentOrder,
    clearCurrentOrder,
    clearSelectedCard,
    clearError,
    reset,
    getRequestHeaders,
    cacheCurrentCardDetail,
    getCachedCurrentCardDetail,
    clearCurrentCardDetailCache
  }
}, {
  persist: {
    key: 'card-store',
    storage: localStorage
  }
})
