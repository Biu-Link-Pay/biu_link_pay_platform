<template>
  <!-- Floating contact entry (hidden on login page) -->
  <div v-if="!isLoginPage">
    <!-- Mobile overlay background -->
    <transition name="contact-fade">
      <div v-if="isMobilePanelOpen" class="fixed inset-0 bg-black/40 md:hidden z-40" @click="closeMobilePanel"></div>
    </transition>

    <!-- Mobile button and panel -->
    <div class="md:hidden fixed right-4 bottom-24 z-50 flex flex-col items-end space-y-3">
      <transition name="mobile-panel">
        <div v-if="isMobilePanelOpen"
          class="contact-mobile-panel w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">Contact Us</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Please contact us via email:</p>
            </div>
            <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close"
              @click="closeMobilePanel">
              <i class="pi pi-times text-sm"></i>
            </button>
          </div>
          <div class="space-y-2">
            <a v-for="email in contactEmails" :key="email" :href="`mailto:${email}`"
              class="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
              <i class="pi pi-envelope text-gray-500 dark:text-gray-400 flex-shrink-0 text-xs"></i>
              <span class="text-xs font-medium text-gray-900 dark:text-white break-all flex-1">{{ email }}</span>
              <i
                class="pi pi-external-link text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0"></i>
            </a>
          </div>
        </div>
      </transition>

      <button
        class="w-14 h-14 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Contact Us" @click="toggleMobilePanel">
        <i class="pi pi-envelope text-xl"></i>
      </button>
    </div>

    <!-- Desktop slide-out panel -->
    <div class="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 transform z-50">
      <div class="contact-desktop-panel" :class="{ 'is-visible': isPopoverVisible }" @mouseleave="hidePopover">
        <div class="contact-panel-handle" @mouseenter="showPopover">
          <i class="pi pi-envelope text-lg"></i>
          <span>Contact</span>
        </div>
        <div class="contact-panel-body bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <p class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Contact Us</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">Please contact us via email:</p>
          <div class="space-y-2">
            <a v-for="email in contactEmails" :key="email" :href="`mailto:${email}`"
              class="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
              <i class="pi pi-envelope text-gray-500 dark:text-gray-400 flex-shrink-0 text-xs"></i>
              <span class="text-xs font-medium text-gray-900 dark:text-white break-all flex-1">{{ email }}</span>
              <i
                class="pi pi-external-link text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Contact emails
const contactEmails = ['support@biulinkpay.com', 'support@biulinkpay.org']

// Check if current page is login page
const isLoginPage = computed(() => route.name === 'Login')

// Popover visibility state
const isPopoverVisible = ref(false)
const isMobilePanelOpen = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

// Show popover
const showPopover = () => {
  // Clear any pending hide timer
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  isPopoverVisible.value = true
}

// Hide popover with delay
const hidePopover = () => {
  // Clear any existing timer
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
  // Delay hiding to allow mouse to move to popover
  hideTimer = setTimeout(() => {
    isPopoverVisible.value = false
    hideTimer = null
  }, 200) // 200ms delay
}

// Mobile panel controls
const toggleMobilePanel = () => {
  isMobilePanelOpen.value = !isMobilePanelOpen.value
}

const closeMobilePanel = () => {
  isMobilePanelOpen.value = false
}

// Cleanup on unmount
onUnmounted(() => {
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
})
</script>

<style scoped>
.contact-desktop-panel {
  width: 340px;
  display: flex;
  align-items: stretch;
  border-radius: 16px 0 0 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.25);
  transform: translateX(calc(100% - 34px));
  transition: transform 0.35s ease;
  background: transparent;
}

.contact-desktop-panel.is-visible {
  transform: translateX(0);
}

.contact-panel-handle {
  width: 34px;
  border-radius: 16px 0 0 16px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.55rem;
}

.contact-panel-handle span {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.contact-panel-body {
  flex: 1;
  border-radius: 0 16px 16px 0;
  padding: 1.25rem;
  backdrop-filter: blur(6px);
}

.contact-fade-enter-active,
.contact-fade-leave-active {
  transition: opacity 0.2s ease;
}

.contact-fade-enter-from,
.contact-fade-leave-to {
  opacity: 0;
}

.mobile-panel-enter-active,
.mobile-panel-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.mobile-panel-enter-from,
.mobile-panel-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 768px) {
  .contact-mobile-panel {
    backdrop-filter: blur(4px);
  }
}
</style>
