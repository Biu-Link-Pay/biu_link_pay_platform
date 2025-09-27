<template>
  <!-- Fixed top navigation -->
  <div class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
    <div class="flex justify-between items-center">
      <i></i>

      <button
        @click="cancel"
        class="flex items-center px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors cursor-pointer"
      >
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Main content with top padding to account for fixed header -->
  <div class="pt-16">
    <div id="sumsub-websdk-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function back() {
  router.back()
}

function cancel() {
  // Clean up SDK instance before leaving
  if (snsWebSdkInstance) {
    snsWebSdkInstance.destroy()
  }
  // Navigate to home or previous page
  router.push('/apply-card')
}

declare global {
  interface Window {
    snsWebSdk: any
  }
}

let snsWebSdkInstance: any = null

function launchWebSdk(accessToken: string, applicantEmail?: string, applicantPhone?: string) {
  snsWebSdkInstance = window.snsWebSdk
    .init(accessToken, () => getNewAccessToken())
    .withConf({
      lang: "en",
      email: applicantEmail,
      phone: applicantPhone,
    })
    .withOptions({ addViewportTag: false, adaptIframeHeight: true })
    .on("idCheck.onStepCompleted", (payload: any) => {
      console.log("onStepCompleted", payload);
    })
    .on("idCheck.onError", (error: any) => {
      console.log("onError", error);
    })
    .onMessage((type: string, payload: any) => {
      console.log("onMessage", type, payload);
    })
    .build();
  snsWebSdkInstance.launch("#sumsub-websdk-container");
}

function getNewAccessToken(): Promise<string> {
  return Promise.resolve("123");
}

const token = "_act-sbx-jwt-eyJhbGciOiJub25lIn0.eyJqdGkiOiJfYWN0LXNieC1hZDFhZmM0ZS02MjQyLTQ0YzMtYjVmYS05YmE1NGVkZTA2NjItdjIiLCJ1cmwiOiJodHRwczovL2FwaS5zdW1zdWIuY29tIn0.-v2";

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://static.sumsub.com/idensic/static/sns-websdk-builder.js'
  script.onload = () => {
    launchWebSdk(token)
  }
  document.head.appendChild(script)
})

onUnmounted(() => {
  if (snsWebSdkInstance) {
    snsWebSdkInstance.destroy()
  }
})
</script>
