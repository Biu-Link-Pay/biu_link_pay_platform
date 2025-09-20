<template>
  <div class="not-found-page min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
    <Card class="w-full max-w-md mx-auto text-center">
      <template #content>
        <div class="p-8">
          <div class="mb-6">
            <i class="pi pi-exclamation-triangle text-6xl text-orange-500 mb-4"></i>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">404</h1>
            <p class="text-gray-600 mb-8">Sorry, page not found</p>
          </div>
          
          <Button 
            label="Back to Home" 
            icon="pi pi-home"
            @click="$router.push('/')"
            class="w-full"
            size="large"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
// 404 page component
</script>
