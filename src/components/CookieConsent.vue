<template>
  <div v-if="visible"
    class="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] pointer-events-auto w-full px-4 md:px-0">
    <div class="bg-white shadow-sm border border-black/5 rounded-[14px] w-full max-w-[360px] ml-auto">
      <div class="flex flex-row p-5 gap-5 items-start">
        <p class="m-0 p-0 text-[16px] leading-[1.2em] text-gray-700 flex-1">
          We use cookies to personalize content, run ads, and analyze traffic.
        </p>
        <div class="flex items-center justify-center">
          <button type="button" @click="dismiss"
            class="appearance-none outline-none border-0 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-[16px] leading-none cursor-pointer hover:bg-gray-200 active:scale-[0.98] transition">
            Okay
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'cookie-consent-dismissed'
const visible = ref(false)

onMounted(() => {
  try {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    visible.value = dismissed !== 'true'
  } catch {
    // 如果无法访问 localStorage，则默认展示
    visible.value = true
  }
})

const dismiss = () => {
  try {
    localStorage.setItem(STORAGE_KEY, 'true')
  } catch { }
  visible.value = false
}
</script>
