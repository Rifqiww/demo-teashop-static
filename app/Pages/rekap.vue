<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore } from '~/stores/order'
import { CheckCheck, Clock, Receipt, AlertCircle, ShoppingBag, BarChart3, SaveAll, X } from 'lucide-vue-next'

const orderStore = useOrderStore()
const showSummaryDialog = ref(false)
const showConfirmCloseDialog = ref(false)

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number)
}

const totalTodayRevenue = computed(() => {
  return orderStore.todayBatches.reduce((sum, batch) => sum + batch.totalAmount, 0)
})

const totalTodayItems = computed(() => {
  return orderStore.todayBatches.reduce((sum, batch) => sum + batch.totalItems, 0)
})

const viewSummary = () => {
  showSummaryDialog.value = true
}

const closeDay = () => {
  showConfirmCloseDialog.value = true
}

const confirmCloseDay = () => {
  orderStore.summarizeAndCloseDay()
  showConfirmCloseDialog.value = false
  showSummaryDialog.value = false
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Rekap Pesanan</h2>
        <p class="text-gray-500 mt-1 text-sm sm:text-base">Daftar pesanan yang telah diselesaikan hari ini</p>
      </div>
      
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button 
          @click="viewSummary"
          :disabled="orderStore.todayBatches.length === 0"
          class="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <BarChart3 class="w-5 h-5" />
          Lihat Simpulan
        </button>
        <!-- <button 
          @click="closeDay"
          :disabled="orderStore.todayBatches.length === 0"
          class="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-green-600/30 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <SaveAll class="w-5 h-5" />
          Tutup Pembukuan
        </button> -->
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="bg-white rounded-2xl p-6 border border-green-100 shadow-sm flex items-center gap-4">
        <div class="bg-green-50 p-4 rounded-xl text-green-600">
          <Receipt class="w-8 h-8" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Total Pendapatan (Hari Ini)</p>
          <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ formatRupiah(totalTodayRevenue) }}</h3>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex items-center gap-4">
        <div class="bg-blue-50 p-4 rounded-xl text-blue-600">
          <ShoppingBag class="w-8 h-8" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Total Item Terjual</p>
          <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ totalTodayItems }} Item</h3>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="orderStore.todayBatches.length === 0" class="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="bg-gray-50 p-6 rounded-full text-gray-400 mb-4">
        <AlertCircle class="w-12 h-12" />
      </div>
      <h3 class="text-xl font-semibold text-gray-700">Belum Ada Rekap Pesanan</h3>
      <p class="text-gray-500 mt-2 max-w-md text-center">Selesaikan pesanan pada menu Kasir untuk melihat rekap pesanan di sini.</p>
    </div>

    <!-- Batches List -->
    <div v-else class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
      <div 
        v-for="(batch, index) in orderStore.todayBatches" 
        :key="batch.id"
        class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-4 mb-4 gap-2">
          <div class="flex items-center gap-3">
            <div class="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-lg">#{{ index + 1 }}</div>
            <div>
              <p class="text-sm text-gray-500 font-medium">{{ batch.date }}</p>
              <div class="flex items-center gap-1 text-green-600 font-medium mt-0.5">
                <Clock class="w-4 h-4" />
                <span>{{ batch.timestamp }}</span>
              </div>
            </div>
          </div>
          <div class="text-left sm:text-right mt-2 sm:mt-0 border-t border-gray-50 sm:border-none pt-2 sm:pt-0">
            <p class="text-xs sm:text-sm text-gray-500">Total Batch</p>
            <p class="text-lg font-bold text-green-600">{{ formatRupiah(batch.totalAmount) }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div 
            v-for="item in batch.items" 
            :key="item.menuId"
            class="bg-gray-50 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-1"
          >
            <div>
              <p class="font-medium text-gray-800 text-sm">{{ item.name }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ item.quantity }}x @ {{ formatRupiah(item.price) }}</p>
            </div>
            <p class="font-semibold text-green-700 text-sm sm:text-right">{{ formatRupiah(item.price * item.quantity) }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Summary Dialog -->
    <div v-if="showSummaryDialog" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div class="flex items-center gap-3">
            <div class="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <BarChart3 class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Simpulan Penjualan</h3>
              <p class="text-xs text-gray-500">Berdasarkan data hari ini</p>
            </div>
          </div>
          <button @click="showSummaryDialog = false" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-5 overflow-y-auto custom-scrollbar flex-1">
          <div v-if="orderStore.todaySummary" class="space-y-6">
            <!-- Overview -->
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div class="flex-1 bg-green-50 p-4 rounded-xl border border-green-100">
                <p class="text-xs text-green-700 font-medium mb-1">Total Pendapatan</p>
                <p class="text-xl font-bold text-green-800">{{ formatRupiah(orderStore.todaySummary.totalRevenue) }}</p>
              </div>
              <div class="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p class="text-xs text-blue-700 font-medium mb-1">Item Terjual</p>
                <p class="text-xl font-bold text-blue-800">{{ orderStore.todaySummary.totalItemsSold }} Pcs</p>
              </div>
            </div>

            <!-- Best Sellers List -->
            <div>
              <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <CheckCheck class="w-4 h-4 text-green-500" />
                Rincian Produk Terjual
              </h4>
              <div class="space-y-3">
                <div v-for="(item, index) in orderStore.todaySummary.itemSummary" :key="index" 
                     class="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {{ index + 1 }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800 text-sm">{{ item.name }}</p>
                      <p class="text-xs text-gray-500">{{ item.quantity }} Terjual</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-green-600 text-sm">{{ formatRupiah(item.revenue) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="p-5 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-3">
          <button @click="showSummaryDialog = false" class="flex-1 py-2.5 px-4 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
            Kembali
          </button>
          <button @click="closeDay" class="flex-1 py-2.5 px-4 rounded-xl font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors flex items-center justify-center gap-2">>
            <SaveAll class="w-4 h-4" />
            Tutup Pembukuan
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Close Dialog -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showConfirmCloseDialog" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="showConfirmCloseDialog = false"></div>
          
          <div class="bg-white w-full max-w-sm rounded-3xl shadow-xl relative flex flex-col z-10 p-6 text-center transform transition-transform scale-100">>
            <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-sm">
              <AlertCircle class="w-10 h-10" />
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Tutup Pembukuan?</h3>
            <p class="text-gray-500 text-sm mb-8 leading-relaxed">
              Data hari ini akan dipindahkan ke <span class="font-semibold text-gray-700">Riwayat Dashboard</span> dan rekap halaman ini akan dikosongkan. Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div class="flex gap-3">
              <button @click="showConfirmCloseDialog = false" class="flex-1 py-3 px-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                Batal
              </button>
              <button @click="confirmCloseDay" class="flex-1 py-3 px-4 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-sm transition-colors">>
                Ya, Tutup
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .bg-white {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-leave-active .bg-white {
  transition: transform 0.15s ease-in;
}

.fade-enter-from .bg-white,
.fade-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
