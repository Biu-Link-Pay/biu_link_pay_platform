<template>
  <!-- Contact Us Button with Hover Popover (hidden on login page) -->
  <div v-if="!isLoginPage" class="contact-us-container fixed right-4 bottom-24 md:right-6 md:bottom-28 z-50"
    @mouseenter="showPopover" @mouseleave="hidePopover">
    <button
      class="w-14 h-14 md:w-16 md:h-16 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      aria-label="Contact Us">
      <i class="pi pi-envelope text-xl md:text-2xl"></i>
    </button>

    <!-- Hover Popover -->
    <div class="contact-popover" :class="{ 'is-visible': isPopoverVisible }" @mouseenter="showPopover"
      @mouseleave="hidePopover">
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px] md:min-w-[320px]">
        <p class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Contact Us
        </p>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Please contact us via email:
        </p>
        <div class="space-y-2">
          <a v-for="email in contactEmails" :key="email" :href="`mailto:${email}`"
            class="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer group">
            <i class="pi pi-envelope text-gray-500 dark:text-gray-400 flex-shrink-0 text-xs"></i>
            <span class="text-xs font-medium text-gray-900 dark:text-white break-all flex-1">{{ email }}</span>
            <i
              class="pi pi-external-link text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0"></i>
          </a>
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

// Cleanup on unmount
onUnmounted(() => {
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
})
</script>

<style scoped>
.contact-popover {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out, visibility 0.2s;
  pointer-events: none;
  z-index: 60;
}

.contact-popover.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

/* Arrow pointing to button */
.contact-popover::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 24px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.dark .contact-popover::after {
  border-top-color: #1f2937;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .contact-popover {
    right: auto;
    left: 0;
    min-width: calc(100vw - 2rem);
    max-width: calc(100vw - 2rem);
  }

  .contact-popover::after {
    right: auto;
    left: 24px;
  }
}
</style>
