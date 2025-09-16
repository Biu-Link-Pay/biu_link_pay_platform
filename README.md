# Vue Starter

一个基于 Vue 3 + Pinia + TypeScript + Axios + PrimeVue + Tailwind CSS 的现代化项目模板。

## 🚀 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供类型安全
- **Pinia** - Vue 的状态管理库
- **Axios** - 基于 Promise 的 HTTP 客户端
- **PrimeVue** - 功能丰富的 Vue 组件库
- **PrimeIcons** - 专业的图标库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vite** - 下一代前端构建工具
- **Vue Router** - Vue.js 官方路由管理器
- **@antfu/eslint-config** - 现代化的 ESLint 配置

## 📁 项目结构

```
vue-starter/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 可复用组件
│   ├── views/             # 页面组件
│   ├── stores/            # Pinia 状态管理
│   ├── services/          # API 服务
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   ├── router/            # 路由配置
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## 🛠️ 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 类型检查

```bash
npm run type-check
```

### 代码检查

```bash
npm run lint
```

## 🎯 功能特性

- ✅ Vue 3 Composition API
- ✅ TypeScript 支持
- ✅ Pinia 状态管理
- ✅ Axios HTTP 客户端
- ✅ PrimeVue 组件库
- ✅ PrimeIcons 图标库
- ✅ Tailwind CSS 样式框架
- ✅ Vue Router 路由管理
- ✅ Vite 构建工具
- ✅ @antfu/eslint-config 代码检查
- ✅ 响应式设计
- ✅ 现代化 UI 组件
- ✅ Toast 消息提示
- ✅ 加载状态管理

## 📦 主要依赖

### 生产依赖

- `vue` - Vue 3 框架
- `vue-router` - 路由管理
- `pinia` - 状态管理
- `axios` - HTTP 客户端
- `primevue` - Vue 组件库
- `primeicons` - 图标库

### 开发依赖

- `typescript` - TypeScript 编译器
- `vite` - 构建工具
- `@vitejs/plugin-vue` - Vue 插件
- `vue-tsc` - TypeScript 检查
- `@antfu/eslint-config` - 现代化 ESLint 配置
- `tailwindcss` - CSS 框架
- `autoprefixer` - CSS 前缀处理
- `postcss` - CSS 后处理器

## 🔧 配置说明

### TypeScript 配置

项目使用严格的 TypeScript 配置，包括：

- 严格的类型检查
- 路径别名支持 (`@/` 指向 `src/`)
- Vue 单文件组件类型支持

### Vite 配置

- 开发服务器端口：3000
- 自动打开浏览器
- 路径别名配置
- 构建优化配置

### Tailwind CSS 配置

- 自定义颜色主题
- 响应式设计支持
- 自定义动画和过渡效果
- 组件样式类

### ESLint 配置

- @antfu/eslint-config 现代化配置
- Vue 3 支持
- TypeScript 支持
- 自动修复功能

## 📝 使用示例

### 状态管理 (Pinia)

```typescript
// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

### API 调用 (Axios)

```typescript
// services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.example.com'
})

export const apiService = {
  async getUsers() {
    return api.get('/users')
  }
}
```

### 组件使用

```vue
<template>
  <div class="p-6">
    <Card class="mb-4">
      <template #content>
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4">计数器示例</h2>
          <Button 
            @click="increment" 
            icon="pi pi-plus"
            :label="`计数: ${count}`"
            class="mb-4"
          />
          <div class="mt-4">
            <Message 
              v-if="showMessage"
              severity="success" 
              :closable="false"
              text="计数器已更新！"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
const showMessage = ref(false)

const count = computed(() => counterStore.count)

const increment = () => {
  counterStore.increment()
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
  }, 2000)
}
</script>
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
