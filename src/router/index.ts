import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import { setupRouterGuards } from './guards'

const routes = [
  {
    path: '/',
    redirect: '/apply-card'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login',
      requiresAuth: false
    }
  },
  {
    path: '/apply-card',
    name: 'ApplyCardList',
    component: () => import('@/views/ApplyCardList.vue'),
    meta: {
      title: 'Apply Card',
      requiresAuth: true
    }
  },
  {
    path: '/card-bin-selection',
    name: 'CardBinSelection',
    component: () => import('@/views/CardBinSelection.vue'),
    meta: {
      title: 'Select Card BIN',
      requiresAuth: true
    }
  },
  {
    path: '/card-holder-info',
    name: 'CardHolderInfo',
    component: () => import('@/views/CardHolderInfo.vue'),
    meta: {
      title: 'Card Holder Information',
      requiresAuth: true
    }
  },
  {
    path: '/payment-method-selection',
    name: 'PaymentMethodSelection',
    component: () => import('@/views/PaymentMethodSelection.vue'),
    meta: {
      title: 'Payment Method Selection',
      requiresAuth: true
    }
  },
  {
    path: '/crypto-payment',
    name: 'CryptoPayment',
    component: () => import('@/views/CryptoPayment.vue'),
    meta: {
      title: 'Crypto Payment',
      requiresAuth: true
    }
  },
  {
    path: '/my-cards',
    name: 'MyCards',
    component: () => import('@/views/MyCards.vue'),
    meta: {
      title: 'My Cards',
      requiresAuth: true
    }
  },
  {
    path: '/payment-result',
    name: 'PaymentResult',
    component: () => import('@/views/PaymentResult.vue'),
    meta: {
      title: 'Payment Result',
      requiresAuth: true
    }
  },
  {
    path: '/kyc-verification',
    name: 'KycVerification',
    component: () => import('@/views/KycVerification.vue'),
    meta: {
      title: 'KYC Verification',
      requiresAuth: true
    }
  },
  {
    path: '/personal-center',
    name: 'PersonalCenter',
    component: () => import('@/views/PersonalCenter.vue'),
    meta: {
      title: 'Personal Center',
      requiresAuth: true
    }
  },
  {
    path: '/withdraw',
    name: 'WithdrawOrder',
    component: () => import('@/views/WithdrawOrder.vue'),
    meta: {
      title: 'Withdraw',
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Page Not Found',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 设置路由守卫
setupRouterGuards(router)

export default router
