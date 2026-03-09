import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// PrimeVue Components
import Button from 'primevue/button'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

import Tooltip from 'primevue/tooltip'
import { createApp } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import MyPreset from '@/theme/preset'
import { getFingerprintId } from '@/utils/fingerprint'
import App from './App.vue'

import i18n from './i18n'
import router from './router'
import 'primeicons/primeicons.css'
import './assets/styles/main.css'
import './styles/button-styles.css'
import './styles/layout-styles.css'

// 初始化指纹识别
getFingerprintId().then((fingerprintId) => {
  console.log('Fingerprint ID initialized:', fingerprintId)
}).catch((error) => {
  console.warn('Failed to initialize fingerprint:', error)
})

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

// Register PrimeVue Components
app.component('Button', Button)
app.component('Card', Card)
app.component('InputText', InputText)
app.component('Checkbox', Checkbox)
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)

app.use(pinia)
app.use(router)
app.use(i18n)

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

// 初始化用户store
const userStore = useUserStore()
userStore.initializeAuth()

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
    },
  },
})
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)

app.mount('#app')
