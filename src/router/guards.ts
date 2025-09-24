import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { RouteUtils } from '@/utils/auth'

/**
 * 设置路由守卫
 */
export function setupRouterGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    console.log('Route guard: navigating from', from.path, 'to', to.path)

    // 初始化认证状态
    authStore.initializeAuth()

    // 检查路由是否需要认证
    // 默认所有路由都需要认证，除非明确标记为 requiresAuth: false
    const requiresAuth = to.meta?.requiresAuth !== false

    if (requiresAuth) {
      console.log('Route requires authentication:', to.path)

      if (authStore.isAuthenticated && authStore.isLoggedIn) {
        console.log('User is authenticated, proceeding')

        // 已登录，检查 token 是否过期（可选）
        if (authStore.isTokenExpired && authStore.isTokenExpired()) {
          console.log('Token expired, attempting refresh')
          try {
            await authStore.refreshAuthToken()
            console.log('Token refreshed successfully')
            next()
          } catch (error) {
            console.error('Token refresh failed:', error)
            // 刷新失败，跳转到登录页
            RouteUtils.saveRedirectPath(to.fullPath)
            next({
              path: '/login',
              query: { redirect: to.fullPath }
            })
            return
          }
        } else {
          // KYC验证现在通过dialog进行，不再需要路由跳转
          // 允许用户访问所有页面，KYC验证在具体功能中处理
          console.log('User authenticated, allowing access to all pages')
          next()
        }
      } else {
        console.log('User not authenticated, redirecting to login')
        // 未登录，保存当前路径并跳转到登录页
        RouteUtils.saveRedirectPath(to.fullPath)
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    } else {
      // 不需要认证的路由
      console.log('Route does not require authentication:', to.path)

      // 如果已登录用户访问登录页，重定向到首页或之前保存的路径
      if (to.name === 'Login' && authStore.isAuthenticated && authStore.isLoggedIn) {
        console.log('Authenticated user accessing login page, redirecting')
        const redirectPath = RouteUtils.getSavedRedirectPath() || '/'
        RouteUtils.clearRedirectPath()
        next(redirectPath)
      } else {
        next()
      }
    }
  })

  // 全局后置钩子
  router.afterEach((to) => {
    // 设置页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - Vue Starter`
    } else {
      document.title = 'Vue Starter'
    }

    console.log('Route guard: navigation completed to', to.path)
  })
}
