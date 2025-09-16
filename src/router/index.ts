import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import { setupRouterGuards } from './guards'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
      requiresAuth: true
    }
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
