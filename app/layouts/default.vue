<script setup lang="ts">
import { LayoutDashboard, ReceiptText, Coffee } from 'lucide-vue-next'
</script>

<template>
  <div class="flex h-screen bg-gray-50 text-gray-800 font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-xl hidden md:flex flex-col z-20">
      <div class="p-6 text-center border-b border-green-100">
        <h1 class="text-2xl font-bold text-green-700 tracking-wide">Es Teh DEMO</h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-2">
        <NuxtLink to="/" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors" active-class="bg-green-50 text-green-700 font-semibold" :class="$route.path === '/' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'">
          <Coffee class="w-5 h-5" />
          <span>Menu Kasir</span>
        </NuxtLink>
        <NuxtLink to="/rekap" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors" active-class="bg-green-50 text-green-700 font-semibold" :class="$route.path === '/rekap' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'">
          <ReceiptText class="w-5 h-5" />
          <span>Rekap Pesanan</span>
        </NuxtLink>
        <NuxtLink to="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors" active-class="bg-green-50 text-green-700 font-semibold" :class="$route.path === '/dashboard' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'">
          <LayoutDashboard class="w-5 h-5" />
          <span>Dashboard</span>
        </NuxtLink>
      </nav>
      
      <div class="p-4 border-t border-green-100 text-sm text-gray-400 text-center">
        &copy; 2026 TeaShop
      </div>
    </aside>

    <!-- Mobile Nav (Bottom) -->
    <nav class="md:hidden fixed bottom-0 w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex justify-around p-3">
      <NuxtLink to="/" class="flex flex-col items-center gap-1" :class="$route.path === '/' ? 'text-green-600' : 'text-gray-500'">
        <Coffee class="w-6 h-6" />
        <span class="text-xs font-medium">Kasir</span>
      </NuxtLink>
      <NuxtLink to="/rekap" class="flex flex-col items-center gap-1" :class="$route.path === '/rekap' ? 'text-green-600' : 'text-gray-500'">
        <ReceiptText class="w-6 h-6" />
        <span class="text-xs font-medium">Rekap</span>
      </NuxtLink>
      <NuxtLink to="/dashboard" class="flex flex-col items-center gap-1" :class="$route.path === '/dashboard' ? 'text-green-600' : 'text-gray-500'">
        <LayoutDashboard class="w-6 h-6" />
        <span class="text-xs font-medium">Dashboard</span>
      </NuxtLink>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden flex flex-col mb-16 md:mb-0 relative z-10">
      <div class="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
        <!-- Route Transitions can be added in app.vue or here -->
        <slot />
      </div>
    </main>
  </div>
</template>
