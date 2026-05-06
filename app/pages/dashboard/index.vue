<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStore } from '~/stores/order'
import { useMenuStore } from '~/stores/menu'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { TrendingUp, Package, History as HistoryIcon } from 'lucide-vue-next'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const orderStore = useOrderStore()
const menuStore = useMenuStore()

// Chart Data (Last 7 Days)
const chartData = computed(() => {
  let historyData = [...orderStore.salesHistory].slice(-7)
  
  if (historyData.length === 0) {
    return {
      labels: ['Belum Ada Data'],
      datasets: [{
        label: 'Pendapatan Harian',
        backgroundColor: '#22c55e',
        data: [0]
      }]
    }
  }

  return {
    labels: historyData.map(h => h.date.split(',')[0]),
    datasets: [
      {
        label: 'Pendapatan (Rp)',
        backgroundColor: '#22c55e',
        borderRadius: 4,
        data: historyData.map(h => h.totalRevenue)
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
</script>

<template>
  <div class="h-full flex flex-col gap-6 custom-scrollbar overflow-y-auto pr-2 pb-20 md:pb-0">
    <div class="mb-4">
      <h2 class="text-3xl font-bold text-gray-800 tracking-tight">Overview Dashboard</h2>
      <p class="text-gray-500 mt-1">Ringkasan performa penjualan dan statistik terkini Anda</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-6 text-black border border-gray-100 shadow-sm flex flex-col justify-between h-36">
        <div class="flex items-center gap-3 opacity-90">
          <TrendingUp class="w-5 h-5" />
          <h3 class="font-medium">Pendapatan (Hari Ini)</h3>
        </div>
        <p class="text-3xl font-bold tracking-tight">
          {{ orderStore.todaySummary ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(orderStore.todaySummary.totalRevenue) : 'Rp 0' }}
        </p>
      </div>

      <div class="bg-white rounded-2xl p-6 text-black border border-gray-100 shadow-sm flex flex-col justify-between h-36">
        <div class="flex items-center gap-3 opacity-90">
          <Package class="w-5 h-5" />
          <h3 class="font-medium">Item Terjual (Hari Ini)</h3>
        </div>
        <p class="text-3xl font-bold tracking-tight">
          {{ orderStore.todaySummary ? orderStore.todaySummary.totalItemsSold : 0 }} <span class="text-lg font-normal opacity-80">Pcs</span>
        </p>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-36">
        <div class="flex items-center gap-3 text-gray-500">
          <div class="bg-indigo-50 p-2 rounded-lg text-indigo-600">
            <HistoryIcon class="w-4 h-4" />
          </div>
          <h3 class="font-medium">Total Hari Terekap</h3>
        </div>
        <p class="text-3xl font-bold text-gray-800 tracking-tight">
          {{ orderStore.salesHistory.length }} <span class="text-lg font-normal text-gray-400">Hari</span>
        </p>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-36">
        <div class="flex items-center gap-3 text-gray-500">
          <div class="bg-orange-50 p-2 rounded-lg text-orange-600">
            <Package class="w-4 h-4" />
          </div>
          <h3 class="font-medium">Total Menu</h3>
        </div>
        <p class="text-3xl font-bold text-gray-800 tracking-tight">
          {{ menuStore.items.length }} <span class="text-lg font-normal text-gray-400">Menu</span>
        </p>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex-1 flex flex-col min-h-[350px]">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-xl font-bold text-gray-800">Grafik Pertumbuhan Penjualan</h3>
          <p class="text-sm text-gray-500 mt-1">Pergerakan pendapatan selama 7 hari terakhir</p>
        </div>
      </div>
      <div class="flex-1 min-h-0 relative">
        <Bar :data="chartData" :options="chartOptions" />
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
