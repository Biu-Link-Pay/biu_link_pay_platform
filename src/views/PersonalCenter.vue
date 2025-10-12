<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Unified Header -->
    <AppHeader title="Personal Center" :show-title="true" />

    <!-- Main Content -->
    <div
      class="w-full max-w-2xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <!-- Desktop Layout -->
      <div class="hidden md:block">
        <div class="max-w-4xl mx-auto">
          <!-- User Information Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div class="flex items-center space-x-6">
              <!-- User Avatar -->
              <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <i class="pi pi-user text-white text-2xl"></i>
              </div>

              <!-- User Info -->
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ userProfile?.firstName || 'User' }}
                </h2>
                <div class="space-y-3">
                  <!-- Email -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Email</span>
                    <span class="text-sm text-gray-900 dark:text-white">{{ maskedEmail }}</span>
                  </div>

                  <!-- KYC Status -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">KYC</span>
                    <div class="flex items-center space-x-2">
                      <i v-if="kycStatus === 1" class="pi pi-check text-green-500"></i>
                      <i v-else-if="kycStatus === 2" class="pi pi-exclamation-triangle text-yellow-500"></i>
                      <i v-else-if="kycStatus === 3" class="pi pi-times text-red-500"></i>
                      <i v-else class="pi pi-clock text-gray-500"></i>
                      <span :class="kycStatusClass">{{ kycStatusText }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Google Authentication -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              @click="navigateToGoogleAuth">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <i class="pi pi-google text-blue-600 dark:text-blue-400 text-lg"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Google Authentication</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Manage your Google account binding</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="googleAuthStatusClass">{{ googleAuthStatusText }}</span>
                  <i class="pi pi-chevron-right text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- Language -->
            <!-- <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                 @click="navigateToLanguage">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <i class="pi pi-globe text-green-600 dark:text-green-400 text-lg"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Language</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Change your language preference</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-600 dark:text-gray-400">EN-US</span>
                  <i class="pi pi-chevron-right text-gray-400"></i>
                </div>
              </div>
            </div> -->

            <!-- Terms of Service -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              @click="navigateToTerms">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div
                    class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <i class="pi pi-file text-purple-600 dark:text-purple-400 text-lg"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Terms of Service</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Read our terms and conditions</p>
                  </div>
                </div>
                <i class="pi pi-chevron-right text-gray-400"></i>
              </div>
            </div>

            <!-- Privacy Policy -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              @click="navigateToPrivacy">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div
                    class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                    <i class="pi pi-shield text-indigo-600 dark:text-indigo-400 text-lg"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Privacy Policy</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Learn about our privacy practices</p>
                  </div>
                </div>
                <i class="pi pi-chevron-right text-gray-400"></i>
              </div>
            </div>

            <!-- Safety Validation -->
            <!-- <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                 @click="navigateToSafety">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <i class="pi pi-shield text-orange-600 dark:text-orange-400 text-lg"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Safety Validation</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Security and verification settings</p>
                  </div>
                </div>
                <i class="pi pi-chevron-right text-gray-400"></i>
              </div>
            </div> -->

            <!-- Referral Code -->
            <!-- <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                 @click="navigateToReferral">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
                    <i class="pi pi-gift text-pink-600 dark:text-pink-400 text-lg"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">Referral Code</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Manage your referral settings</p>
                  </div>
                </div>
                <i class="pi pi-chevron-right text-gray-400"></i>
              </div>
            </div> -->
          </div>

          <!-- Log Out Button -->
          <div class="mt-8">
            <button @click="handleLogout"
              class="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <div class="flex items-center justify-center space-x-4">
                <div class="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <i class="pi pi-sign-out text-red-600 dark:text-red-400 text-lg"></i>
                </div>
                <div class="text-center">
                  <h3 class="font-semibold text-red-600 dark:text-red-400">Log Out</h3>
                  <p class="text-sm text-red-500 dark:text-red-500">Sign out of your account</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="md:hidden space-y-4 pb-32">
        <!-- User Information Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-4 mb-4">
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <i class="pi pi-user text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ userProfile?.firstName || 'User' }}</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ maskedEmail }}</p>
            </div>
          </div>

          <!-- Email -->
          <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Email</span>
            <span class="text-sm text-gray-900 dark:text-white">{{ maskedEmail }}</span>
          </div>

          <!-- KYC Status -->
          <div class="flex items-center justify-between py-3">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">KYC</span>
            <div class="flex items-center space-x-2">
              <i v-if="kycStatus === 1" class="pi pi-check text-green-500"></i>
              <i v-else-if="kycStatus === 2" class="pi pi-exclamation-triangle text-yellow-500"></i>
              <i v-else-if="kycStatus === 3" class="pi pi-times text-red-500"></i>
              <i v-else class="pi pi-clock text-gray-500"></i>
              <span :class="kycStatusClass">{{ kycStatusText }}</span>
            </div>
          </div>
        </div>

        <!-- Settings List -->
        <div class="space-y-2">
          <!-- Google Authentication -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
            @click="navigateToGoogleAuth">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <i class="pi pi-google text-blue-600 dark:text-blue-400"></i>
              </div>
              <span class="font-medium text-gray-900 dark:text-white">Google Authentication</span>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="googleAuthStatusClass">{{ googleAuthStatusText }}</span>
              <i class="pi pi-chevron-right text-gray-400"></i>
            </div>
          </div>

          <!-- Language -->
          <!-- <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
               @click="navigateToLanguage">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <i class="pi pi-globe text-green-600 dark:text-green-400"></i>
              </div>
              <span class="font-medium text-gray-900 dark:text-white">Language</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">EN-US</span>
              <i class="pi pi-chevron-right text-gray-400"></i>
            </div>
          </div> -->

          <!-- Terms of Service -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
            @click="navigateToTerms">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <i class="pi pi-file text-purple-600 dark:text-purple-400"></i>
              </div>
              <span class="font-medium text-gray-900 dark:text-white">Terms of Service</span>
            </div>
            <i class="pi pi-chevron-right text-gray-400"></i>
          </div>

          <!-- Privacy Policy -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
            @click="navigateToPrivacy">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                <i class="pi pi-shield text-indigo-600 dark:text-indigo-400"></i>
              </div>
              <span class="font-medium text-gray-900 dark:text-white">Privacy Policy</span>
            </div>
            <i class="pi pi-chevron-right text-gray-400"></i>
          </div>

          <!-- Safety Validation -->
          <!-- <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
               @click="navigateToSafety">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <i class="pi pi-shield text-orange-600 dark:text-orange-400"></i>
              </div>
              <span class="font-medium text-gray-900 dark:text-white">Safety Validation</span>
            </div>
            <i class="pi pi-chevron-right text-gray-400"></i>
          </div> -->

          <!-- Referral Code -->
          <!-- <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
               @click="navigateToReferral">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
                <i class="pi pi-gift text-pink-600 dark:text-pink-400"></i>
              </div>
              <span class="font-medium text-gray-900 dark:text-white">Referral code</span>
            </div>
            <i class="pi pi-chevron-right text-gray-400"></i>
          </div> -->

          <!-- Log Out -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
            @click="handleLogout">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <i class="pi pi-sign-out text-red-600 dark:text-red-400"></i>
              </div>
              <span class="font-medium text-red-600 dark:text-red-400">Log Out</span>
            </div>
            <i class="pi pi-chevron-right text-gray-400"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Google Auth Binding Dialog -->
  <Dialog v-model:visible="showGoogleAuthBindDialog" modal header="Bind Google Authenticator"
    :style="{ width: '500px' }" :closable="!bindLoading" :close-on-escape="!bindLoading">
    <div class="space-y-6">
      <!-- Step 1: Scan QR Code -->
      <div class="text-center space-y-4">
        <div class="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
          <i class="pi pi-qrcode text-blue-600 dark:text-blue-400 text-3xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Step 1: Scan QR Code</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Use Google Authenticator app to scan the QR code below
          </p>
        </div>

        <!-- QR Code Display -->
        <div v-if="bindQrCode" class="flex justify-center">
          <img :src="`data:image/png;base64,${bindQrCode}`" alt="Google Auth QR Code"
            class="w-48 h-48 border border-gray-200 dark:border-gray-700 rounded-lg" />
        </div>

        <!-- Secret Key Display -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Or manually enter the secret key:</p>
          <div class="flex items-center space-x-2">
            <InputText :model-value="bindSecretKey" readonly class="flex-1 font-mono text-sm" />
            <Button icon="pi pi-copy" severity="secondary" size="small" @click="copySecretKey" />
          </div>
        </div>
      </div>

      <!-- Step 2: Enter Verification Code -->
      <div class="space-y-4">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Step 2: Enter Verification Code</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Enter the 6-digit verification code from Google Authenticator
          </p>
        </div>

        <div class="flex justify-center">
          <InputText v-model="bindAuthCode" placeholder="Enter 6-digit code" maxlength="6"
            class="w-48 text-center text-lg font-mono tracking-widest" :disabled="bindLoading"
            @input="onBindCodeInput" />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-3">
        <Button label="Cancel" severity="secondary" :disabled="bindLoading" @click="cancelBind" />
        <Button label="Confirm Binding" icon="pi pi-check" :loading="bindLoading"
          :disabled="!bindAuthCode || bindAuthCode.length !== 6" @click="confirmBind" />
      </div>
    </div>
  </Dialog>

  <!-- Google Auth Unbind Dialog -->
  <Dialog v-model:visible="showGoogleAuthUnbindDialog" modal header="Unbind Google Authenticator"
    :style="{ width: '400px' }" :closable="!unbindLoading" :close-on-escape="!unbindLoading">
    <div class="space-y-6">
      <!-- 警告图标和消息 -->
      <div class="text-center space-y-4">
        <div class="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400 text-2xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Confirm Unbind</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            After unbinding, you will not be able to use Google Authenticator for two-factor authentication. Are you
            sure you want to continue?
          </p>
        </div>
      </div>

      <!-- Enter Verification Code -->
      <div class="space-y-4">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Enter Verification Code</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Please enter the 6-digit verification code from Google Authenticator
          </p>
        </div>

        <div class="flex justify-center">
          <InputText v-model="unbindAuthCode" placeholder="Enter 6-digit code" maxlength="6"
            class="w-48 text-center text-lg font-mono tracking-widest" :disabled="unbindLoading"
            @input="onUnbindCodeInput" />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-3">
        <Button label="Cancel" severity="secondary" :disabled="unbindLoading" @click="cancelUnbind" />
        <Button label="Confirm Unbind" icon="pi pi-times" severity="danger" :loading="unbindLoading"
          :disabled="!unbindAuthCode || unbindAuthCode.length !== 6" @click="handleUnbindGoogleAuth" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useClipboard } from '@vueuse/core'
import AppHeader from '@/components/AppHeader.vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { AuthAPI } from '@/api/auth'
import type { UserProfile } from '@/types/api'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const authStore = useAuthStore()
const userStore = useUserStore()

// User profile data
const userProfile = ref<UserProfile | null>(null)
const loading = ref(false)

// Google Auth binding dialog state
const showGoogleAuthBindDialog = ref(false)
const bindSecretKey = ref('')
const bindQrCode = ref('')
const bindAuthCode = ref('')
const bindLoading = ref(false)

// Google Auth unbind dialog state
const showGoogleAuthUnbindDialog = ref(false)
const unbindAuthCode = ref('')
const unbindLoading = ref(false)

// Computed properties
const maskedEmail = computed(() => {
  if (!userProfile.value?.userEmail) return 'sh****@example.com'
  const email = userProfile.value.userEmail
  const [username, domain] = email.split('@')
  if (username.length <= 2) return email
  return `${username.slice(0, 2)}****@${domain}`
})

const kycStatus = computed(() => userProfile.value?.kycStatus ?? 0)

const kycStatusText = computed(() => {
  switch (kycStatus.value) {
    case 1: return 'Approved'
    case 2: return 'Temporarily Rejected'
    case 3: return 'Rejected'
    default: return 'Not Completed'
  }
})

const kycStatusClass = computed(() => {
  switch (kycStatus.value) {
    case 1: return 'text-green-600 dark:text-green-400'
    case 2: return 'text-yellow-600 dark:text-yellow-400'
    case 3: return 'text-red-600 dark:text-red-400'
    default: return 'text-gray-600 dark:text-gray-400'
  }
})

// Google authentication status
const googleAuthStatus = computed(() => userProfile.value?.googleAuthStatus ?? 0)

const googleAuthStatusText = computed(() => {
  switch (googleAuthStatus.value) {
    case 1: return 'Connected'
    default: return 'Not Connected'
  }
})

const googleAuthStatusClass = computed(() => {
  switch (googleAuthStatus.value) {
    case 1: return 'text-green-600 dark:text-green-400'
    default: return 'text-gray-600 dark:text-gray-400'
  }
})

// Fetch user profile
const fetchUserProfile = async () => {
  if (!authStore.token || !authStore.refreshToken) {
    console.warn('No authentication tokens available')
    return
  }

  loading.value = true
  try {
    const response = await AuthAPI.getUserProfile()

    if (response.success && response.model) {
      userProfile.value = response.model

      // 同时更新 Pinia 用户详情
      const profile = response.model
      userStore.updateProfile({
        userNum: profile.userNum,
        email: profile.userEmail,
        firstName: profile.firstName,
        kycStatus: profile.kycStatus,
        googleAuthStatus: profile.googleAuthStatus
      })

      console.log('User profile updated in Pinia store:', profile)
    } else {
      console.error('Failed to fetch user profile:', response.msg)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load user profile',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as any)?.message || 'Failed to load user profile',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Navigation methods
const navigateToGoogleAuth = async () => {
  if (googleAuthStatus.value === 1) {
    // 已绑定，显示解绑对话框
    showGoogleAuthUnbindDialog.value = true
  } else {
    // 未绑定，开始绑定流程
    try {
      loading.value = true
      const response = await AuthAPI.googleAuthGeneral()

      if (response.success && response.model) {
        // 显示绑定弹框
        showGoogleAuthBindDialog.value = true
        bindSecretKey.value = response.model.secretKey
        bindQrCode.value = response.model.qrCode
      } else {
        toast.add({
          severity: 'error',
          summary: 'Binding Failed',
          detail: response.msg || 'Failed to get binding information',
          life: 3000
        })
      }
    } catch (error) {
      console.error('Google Auth bind error:', error)
      toast.add({
        severity: 'error',
        summary: 'Binding Failed',
        detail: (error as any)?.message || 'Network error, please try again later',
        life: 3000
      })
    } finally {
      loading.value = false
    }
  }
}

const navigateToLanguage = () => {
  // TODO: Implement navigation to language settings
  toast.add({
    severity: 'info',
    summary: 'Coming Soon',
    detail: 'Language settings page is under development',
    life: 3000
  })
}

const navigateToTerms = () => {
  window.open('https://static.biulinkpay.online/compliance/TermsOfService.html', '_blank', 'noopener,noreferrer')
}

const navigateToPrivacy = () => {
  window.open('https://static.biulinkpay.online/compliance/PrivacyPolicy.html', '_blank', 'noopener,noreferrer')
}

const navigateToSafety = () => {
  // TODO: Implement navigation to safety validation
  toast.add({
    severity: 'info',
    summary: 'Coming Soon',
    detail: 'Safety validation page is under development',
    life: 3000
  })
}

const navigateToReferral = () => {
  // TODO: Implement navigation to referral code
  toast.add({
    severity: 'info',
    summary: 'Coming Soon',
    detail: 'Referral code page is under development',
    life: 3000
  })
}

// Logout handler
const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.add({
      severity: 'success',
      summary: 'Logged Out',
      detail: 'You have been successfully logged out',
      life: 3000
    })
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    toast.add({
      severity: 'error',
      summary: 'Logout Failed',
      detail: (error as any)?.message || 'Failed to logout. Please try again.',
      life: 3000
    })
  }
}

// Google Auth binding methods
const onBindCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // 只保留数字
  bindAuthCode.value = value.slice(0, 6) // 最多6位
}

const { copy: copyToClipboard } = useClipboard()

const copySecretKey = async () => {
  try {
    await copyToClipboard(bindSecretKey.value)
    toast.add({
      severity: 'success',
      summary: 'Copy Successful',
      detail: 'Secret key copied to clipboard',
      life: 2000
    })
  } catch (error) {
    console.error('Copy failed:', error)
    toast.add({
      severity: 'error',
      summary: 'Copy Failed',
      detail: (error as any)?.message || 'Please copy the secret key manually',
      life: 3000
    })
  }
}

const cancelBind = () => {
  showGoogleAuthBindDialog.value = false
  bindAuthCode.value = ''
  bindSecretKey.value = ''
  bindQrCode.value = ''
}

const confirmBind = async () => {
  if (!bindAuthCode.value || bindAuthCode.value.length !== 6) {
    toast.add({
      severity: 'warn',
      summary: 'Invalid Code',
      detail: 'Please enter a 6-digit verification code',
      life: 3000
    })
    return
  }

  try {
    bindLoading.value = true

    // 验证验证码
    const response = await AuthAPI.googleAuthValid(bindAuthCode.value, bindSecretKey.value)

    if (response.success && response.model) {
      // 验证成功，刷新用户信息
      await fetchUserProfile()

      toast.add({
        severity: 'success',
        summary: 'Binding Successful',
        detail: 'Google Authenticator bound successfully',
        life: 3000
      })

      showGoogleAuthBindDialog.value = false
      bindAuthCode.value = ''
      bindSecretKey.value = ''
      bindQrCode.value = ''
    } else {
      toast.add({
        severity: 'error',
        summary: 'Verification Failed',
        detail: response.msg || 'Invalid verification code, please try again',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Google Auth bind error:', error)
    toast.add({
      severity: 'error',
      summary: 'Binding Failed',
      detail: (error as any)?.message || 'Network error, please try again later',
      life: 3000
    })
  } finally {
    bindLoading.value = false
  }
}

// Google Auth unbind handler
const handleUnbindGoogleAuth = async () => {
  if (!unbindAuthCode.value || unbindAuthCode.value.length !== 6) {
    toast.add({
      severity: 'warn',
      summary: 'Invalid Code',
      detail: 'Please enter a 6-digit verification code',
      life: 3000
    })
    return
  }

  try {
    unbindLoading.value = true

    const response = await AuthAPI.googleAuthUnbind(unbindAuthCode.value)

    if (response.success && response.model) {
      // 解绑成功，刷新用户信息
      await fetchUserProfile()

      toast.add({
        severity: 'success',
        summary: 'Unbind Successful',
        detail: 'Google Authenticator unbound successfully',
        life: 3000
      })

      showGoogleAuthUnbindDialog.value = false
      unbindAuthCode.value = ''
    } else {
      toast.add({
        severity: 'error',
        summary: 'Unbind Failed',
        detail: response.msg || 'Invalid verification code, please try again',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Google Auth unbind error:', error)
    toast.add({
      severity: 'error',
      summary: 'Unbind Failed',
      detail: (error as any)?.message || 'Network error, please try again later',
      life: 3000
    })
  } finally {
    unbindLoading.value = false
  }
}

// Unbind dialog methods
const onUnbindCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // 只保留数字
  unbindAuthCode.value = value.slice(0, 6) // 最多6位
}

const cancelUnbind = () => {
  showGoogleAuthUnbindDialog.value = false
  unbindAuthCode.value = ''
}

// Initialize
onMounted(() => {
  fetchUserProfile()
})
</script>
