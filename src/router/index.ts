import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import { setupRouterGuards } from './guards'

const routes = [
  {
    path: '/',
    redirect: '/card-list'
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
    path: '/card-list',
    name: 'CardList',
    component: () => import('@/views/CardList.vue'),
    meta: {
      title: 'Card List',
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
    path: '/payment-confirmation',
    name: 'PaymentConfirmation',
    component: () => import('@/views/PaymentConfirmation.vue'),
    meta: {
      title: 'Payment Confirmation',
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
