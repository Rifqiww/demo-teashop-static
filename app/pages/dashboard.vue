<script setup lang="ts">
import { LayoutDashboard, History, MenuSquare } from 'lucide-vue-next'
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Dashboard Tabs/Navigation -->
    <div class="mb-6">
      <nav class="bg-gray-100/80 p-1.5 rounded-2xl flex items-center gap-1">
        <NuxtLink 
          to="/dashboard" 
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm font-semibold"
          active-class="bg-white text-green-700 shadow-sm"
          exact-active-class="bg-white text-green-700 shadow-sm"
          :class="$route.path === '/dashboard' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        >
          <LayoutDashboard class="w-4.5 h-4.5" />
          <span class="hidden sm:inline">Overview</span>
          <span class="sm:hidden">Status</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/dashboard/riwayat-penjualan" 
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm font-semibold"
          active-class="bg-white text-green-700 shadow-sm"
          exact-active-class="bg-white text-green-700 shadow-sm"
          :class="$route.path === '/dashboard/riwayat-penjualan' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        >
          <History class="w-4.5 h-4.5" />
          <span class="hidden sm:inline">Riwayat Penjualan</span>
          <span class="sm:hidden">Riwayat</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/dashboard/manajemen-menu" 
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm font-semibold"
          active-class="bg-white text-green-700 shadow-sm"
          exact-active-class="bg-white text-green-700 shadow-sm"
          :class="$route.path === '/dashboard/manajemen-menu' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        >
          <MenuSquare class="w-4.5 h-4.5" />
          <span class="hidden sm:inline">Manajemen Menu</span>
          <span class="sm:hidden">Menu</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Nested Page Content -->
    <div class="flex-1 overflow-hidden">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}
</style>
