<script setup lang="ts">
import { ref } from 'vue'
import { useOrderStore } from '~/stores/order'
import { CalendarDays, ChevronRight, X, BarChart3, CheckCheck } from 'lucide-vue-next'

const orderStore = useOrderStore()

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number)
}

// History Dialog State
const showHistoryDialog = ref(false)
const selectedHistory = ref<any>(null)

const openHistoryDetail = (history: any) => {
  selectedHistory.value = history
  showHistoryDialog.value = true
}
</script>

<template>
  <div class="h-full flex flex-col gap-6 custom-scrollbar overflow-y-auto pr-2 pb-20 md:pb-0">
    <div class="mb-2">
      <h2 class="text-3xl font-bold text-gray-800">Riwayat Penjualan</h2>
      <p class="text-gray-500 mt-1">Rekapitulasi penjualan di hari-hari sebelumnya</p>
    </div>

    <!-- Empty State -->
    <div v-if="orderStore.salesHistory.length === 0" class="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200 min-h-[300px]">
      <div class="bg-gray-50 p-6 rounded-full text-gray-400 mb-4">
        <CalendarDays class="w-12 h-12" />
      </div>
      <h3 class="text-xl font-semibold text-gray-700">Belum Ada Riwayat Penjualan</h3>
      <p class="text-gray-500 mt-2 max-w-md text-center">Data histori penjualan akan muncul setelah Anda menutup pembukuan harian.</p>
    </div>

    <!-- Riwayat Penjualan List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="history in orderStore.salesHistory" 
        :key="history.id"
        @click="openHistoryDetail(history)"
        class="bg-white hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-xl p-5 cursor-pointer shadow-sm hover:shadow-md transition-all group"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="font-bold text-lg text-gray-800 group-hover:text-green-800 transition-colors">{{ history.date }}</p>
            <p class="text-sm text-gray-500 mt-0.5">{{ history.totalItemsSold }} item terjual</p>
          </div>
          <div class="bg-gray-50 p-2 rounded-lg text-gray-400 group-hover:text-green-600 group-hover:bg-white shadow-sm transition-all">
            <ChevronRight class="w-5 h-5" />
          </div>
        </div>
        <div class="pt-4 border-t border-gray-100 group-hover:border-green-200 transition-colors">
          <p class="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Total Pendapatan</p>
          <p class="font-bold text-green-600 text-xl">{{ formatRupiah(history.totalRevenue) }}</p>
        </div>
      </div>
    </div>

    <!-- History Detail Dialog -->
    <div v-if="showHistoryDialog && selectedHistory" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div class="flex items-center gap-3">
            <div class="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <BarChart3 class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Detail Rekap Penjualan</h3>
              <p class="text-xs text-gray-500">{{ selectedHistory.date }}</p>
            </div>
          </div>
          <button @click="showHistoryDialog = false" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-5 overflow-y-auto custom-scrollbar flex-1">
          <div class="space-y-6">
            <!-- Overview -->
            <div class="flex gap-4">
              <div class="flex-1 bg-green-50 p-4 rounded-xl border border-green-100">
                <p class="text-xs text-green-700 font-medium mb-1">Total Pendapatan</p>
                <p class="text-xl font-bold text-green-800">{{ formatRupiah(selectedHistory.totalRevenue) }}</p>
              </div>
              <div class="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p class="text-xs text-blue-700 font-medium mb-1">Item Terjual</p>
                <p class="text-xl font-bold text-blue-800">{{ selectedHistory.totalItemsSold }} Pcs</p>
              </div>
            </div>

            <!-- Best Sellers List -->
            <div>
              <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <CheckCheck class="w-4 h-4 text-green-500" />
                Rincian Produk Terjual
              </h4>
              <div class="space-y-3">
                <div v-for="(item, index) in selectedHistory.itemSummary" :key="index" 
                     class="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {{ Number(index) + 1 }}
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
        <div class="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button @click="showHistoryDialog = false" class="py-2.5 px-6 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}
</style>
