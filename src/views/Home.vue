<template>
  <div class="home-page min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
    <Card class="w-full max-w-2xl">
      <template #content>
        <div class="p-8 text-center">
          <div class="mb-8">
            <i class="pi pi-vue text-6xl text-blue-600 mb-4"></i>
            <h1 class="text-4xl font-bold text-gray-800 mb-4">Vue Starter</h1>
            <p class="text-xl text-gray-600 mb-8">
              Modern Vue 3 Project Template
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button label="Login" icon="pi pi-sign-in" @click="$router.push('/login')" class="w-full sm:w-auto px-8"
              size="large" />
            <Button label="Apply Card" icon="pi pi-credit-card" @click="$router.push('/apply-card')"
              class="w-full sm:w-auto px-8" size="large" severity="secondary" />
          </div>

          <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <i class="pi pi-vue text-3xl text-green-500 mb-2"></i>
              <h3 class="font-semibold text-gray-800">Vue 3</h3>
              <p class="text-sm text-gray-600">Composition API</p>
            </div>
            <div class="text-center">
              <i class="pi pi-palette text-3xl text-purple-500 mb-2"></i>
              <h3 class="font-semibold text-gray-800">PrimeVue</h3>
              <p class="text-sm text-gray-600">Component Library</p>
            </div>
            <div class="text-center">
              <i class="pi pi-paint-brush text-3xl text-cyan-500 mb-2"></i>
              <h3 class="font-semibold text-gray-800">Tailwind</h3>
              <p class="text-sm text-gray-600">CSS Framework</p>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
// Home page component
</script>
