# API 使用指南

本项目已集成完整的 API 管理系统，包括认证和卡片相关的接口。

## 📁 文件结构

```
src/api/
├── auth.ts          # 认证相关 API
├── card.ts          # 卡片相关 API
├── index.ts         # API 统一导出
└── README.md        # 使用文档

src/stores/
├── auth.ts          # 认证状态管理
├── card.ts          # 卡片状态管理
└── counter.ts       # 计数器状态管理
```

## 🔐 认证 API

### 发送邮件验证码
```typescript
import { AuthAPI } from '@/api/auth'

const result = await AuthAPI.sendEmail({ email: 'user@example.com' })
```

### 用户登录
```typescript
const result = await AuthAPI.login({ 
  email: 'user@example.com', 
  code: '123456' 
})
```

### 刷新 Token
```typescript
const result = await AuthAPI.refreshToken({ 
  refresh_token: 'your-refresh-token' 
})
```

### 用户登出
```typescript
const result = await AuthAPI.logout({ 
  refresh_token: 'your-refresh-token' 
})
```

## 💳 卡片 API

### 获取卡片配置
```typescript
import { CardAPI } from '@/api/card'

const headers = {
  token: 'your-token',
  'fingerprint-id': 'device-fingerprint',
  refresh_token: 'your-refresh-token'
}

const result = await CardAPI.getCardConfig(headers)
```

### 查询卡片 BIN
```typescript
const result = await CardAPI.queryCardBin(
  { cardFormFactor: 'virtual_card' },
  headers
)
```

## 🏪 状态管理

### 认证状态管理
```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 登录
await authStore.login({ email: 'user@example.com', code: '123456' })

// 登出
await authStore.logout()

// 检查登录状态
const isLoggedIn = authStore.isLoggedIn
```

### 卡片状态管理
```typescript
import { useCardStore } from '@/stores/card'

const cardStore = useCardStore()

// 获取卡片配置
await cardStore.fetchCardConfigs()

// 查询卡片 BIN
await cardStore.fetchCardBins({ cardFormFactor: 'virtual_card' })

// 获取启用的卡片
const enabledCards = cardStore.enabledCards
```

## 🔄 持久化配置

所有 store 都已配置持久化，数据会自动保存到 localStorage：

- **auth-store**: 保存认证信息（用户信息、token 等）
- **card-store**: 保存卡片配置和 BIN 信息
- **counter-store**: 保存计数器状态

## 🛡️ 请求拦截器

API 服务已配置自动拦截器：

1. **请求拦截器**：
   - 自动添加认证 token
   - 添加防缓存时间戳
   - 请求日志记录

2. **响应拦截器**：
   - 自动处理业务错误
   - Token 过期自动刷新
   - 网络错误处理

## 📱 页面路由

- `/` - 首页
- `/login` - 登录页面
- `/card-list` - 卡片列表页面
- `/card-bin-selection` - 卡片 BIN 选择页面

## 🎯 使用示例

### 完整的登录流程
```typescript
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

const authStore = useAuthStore()
const toast = useToast()

// 1. 发送验证码
const sendResult = await authStore.sendEmailCode({ email: 'user@example.com' })
if (sendResult.success) {
  toast.add({
    severity: 'success',
    summary: '验证码已发送',
    detail: '请查看您的邮箱'
  })
}

// 2. 登录
const loginResult = await authStore.login({ 
  email: 'user@example.com', 
  code: '123456' 
})
if (loginResult.success) {
  toast.add({
    severity: 'success',
    summary: '登录成功',
    detail: '欢迎回来！'
  })
  // 跳转到卡片列表页面
  router.push('/card-list')
}
```

### 获取卡片配置流程
```typescript
import { useCardStore } from '@/stores/card'

const cardStore = useCardStore()

// 获取卡片配置
const result = await cardStore.fetchCardConfigs()
if (result.success) {
  // 获取启用的卡片
  const enabledCards = cardStore.enabledCards
  
  // 根据名称获取特定卡片
  const specificCard = cardStore.getCardConfigByName('virtual_card')
  
  // 查询该卡片的 BIN 信息
  if (specificCard) {
    const cardFormFactor = specificCard.cardPattern === 1 ? 'virtual_card' : 'physical_card'
    await cardStore.fetchCardBins({ cardFormFactor })
  }
}
```

## 🔧 配置说明

### API 基础配置
- **基础 URL**: `https://api.biulinkpay.online`
- **超时时间**: 10 秒
- **请求头**: 自动添加 Content-Type 和认证信息

### 持久化配置
- **存储方式**: localStorage
- **数据过期**: 手动清除或浏览器清理
- **敏感数据**: 仅保存必要的认证信息

## 🚀 开发建议

1. **错误处理**: 始终检查 API 返回的 success 字段
2. **加载状态**: 使用 store 中的 loading 状态显示加载动画
3. **数据缓存**: 利用持久化减少不必要的 API 调用
4. **类型安全**: 使用 TypeScript 类型确保数据结构正确
