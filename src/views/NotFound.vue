<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div
    class="not-found-page min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
  >
    <Card class="w-full max-w-md mx-auto text-center">
      <template #content>
        <div class="p-8">
          <div class="mb-6">
            <i class="pi pi-exclamation-triangle text-6xl text-orange-500 mb-4" />
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              404
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mb-8">
              {{ t('notFound.description') }}
            </p>
          </div>

          <Button :label="t('notFound.backToHome')" icon="pi pi-home" class="w-full" size="large" @click="$router.push('/')" />
        </div>
      </template>
    </Card>
  </div>
</template>
