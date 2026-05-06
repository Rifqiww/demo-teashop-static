<script setup lang="ts">
import { ref, computed } from "vue";
import { useMenuStore } from "~/stores/menu";
import { useOrderStore } from "~/stores/order";
import {
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  CheckCircle2,
} from "lucide-vue-next";

const menuStore = useMenuStore();
const orderStore = useOrderStore();

const categories = computed(() => {
  const cats = new Set(menuStore.items.map((i) => i.category));
  return Array.from(cats);
});

const getItemsByCategory = (cat: string) => {
  return menuStore.items.filter((i) => i.category === cat);
};

// Modal/Dialog state for qty input
const selectedMenu = ref<any>(null);
const tempQuantity = ref(1);
const showDialog = ref(false);

const openQuantityDialog = (menu: any) => {
  selectedMenu.value = menu;
  tempQuantity.value = 1;
  showDialog.value = true;
};

const confirmAdd = () => {
  if (selectedMenu.value && tempQuantity.value > 0) {
    orderStore.addToBatch({
      id: "", // Will be ignored or set uniquely if needed, we match by menuId
      menuId: selectedMenu.value.id,
      name: selectedMenu.value.name,
      price: selectedMenu.value.price,
      quantity: tempQuantity.value,
    });
  }
  showDialog.value = false;
  selectedMenu.value = null;
};

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const currentBatchTotal = computed(() => {
  return orderStore.currentBatch.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
});
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-6 h-full">
    <!-- Menu Section -->
    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-24 lg:pb-0">
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-gray-800">Menu Kasir</h2>
        <p class="text-gray-500 mt-1">Pilih menu pesanan pelanggan</p>
      </div>

      <div v-for="category in categories" :key="category" class="mb-8">
        <h3
          class="text-xl font-semibold text-green-700 mb-4 border-b border-green-100 pb-2"
        >
          {{ category }}
        </h3>
        <div class="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          <div
            v-for="item in getItemsByCategory(category)"
            :key="item.id"
            @click="openQuantityDialog(item)"
            class="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-green-300 transition-all active:scale-95 flex flex-col justify-between h-24 sm:h-32 relative overflow-hidden group"
          >
            <div
              class="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <div class="relative z-10">
              <h4 class="font-medium text-sm sm:text-base text-gray-800 line-clamp-2">
                {{ item.name }}
              </h4>
            </div>
            <div class="relative z-10 flex justify-between items-end mt-2">
              <span class="text-green-600 font-bold text-sm sm:text-base">{{
                formatRupiah(item.price)
              }}</span>
              <div
                class="bg-green-100 text-green-700 p-1.5 rounded-full group-hover:bg-green-500 group-hover:text-white transition-colors"
              >
                <Plus class="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Batch / Cart Section -->
    <div
      class="w-full lg:w-[380px] bg-white rounded-2xl shadow-md flex flex-col h-[calc(100vh-6rem)] lg:h-auto fixed lg:relative bottom-16 lg:bottom-0 left-0 right-0 lg:z-0 z-40 translate-y-[calc(100%-4rem)] lg:translate-y-0 transition-transform duration-300 group hover:translate-y-0"
      :class="
        orderStore.currentBatch.length > 0
          ? 'translate-y-[calc(100%-4.5rem)]'
          : ''
      "
    >
      <!-- Cart Header (Handle for mobile) -->
      <div
        class="p-4 bg-green-600 text-white rounded-t-2xl lg:rounded-none flex justify-between items-center cursor-pointer lg:cursor-default"
      >
        <div class="flex items-center gap-2">
          <ShoppingCart class="w-5 h-5" />
          <h3 class="font-semibold text-lg">Pesanan Saat Ini</h3>
        </div>
        <div class="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
          {{ orderStore.currentBatch.length }} item
        </div>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/50">
        <div
          v-if="orderStore.currentBatch.length === 0"
          class="h-full flex flex-col items-center justify-center text-gray-400"
        >
          <ShoppingCart class="w-12 h-12 mb-3 opacity-20" />
          <p>Belum ada pesanan</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="item in orderStore.currentBatch"
            :key="item.menuId"
            class="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center"
          >
            <div class="flex-1">
              <p class="font-medium text-gray-800 text-sm">{{ item.name }}</p>
              <p class="text-green-600 font-semibold text-xs mt-1">
                {{ formatRupiah(item.price * item.quantity) }}
              </p>
            </div>

            <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
              <button
                @click="
                  orderStore.updateQuantity(item.menuId, item.quantity - 1)
                "
                class="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <Minus class="w-4 h-4" />
              </button>
              <span class="font-medium text-sm w-4 text-center">{{
                item.quantity
              }}</span>
              <button
                @click="
                  orderStore.updateQuantity(item.menuId, item.quantity + 1)
                "
                class="p-1 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-md transition-colors"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Footer -->
      <div class="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-500 font-medium">Total</span>
          <span class="text-2xl font-bold text-gray-800">{{
            formatRupiah(currentBatchTotal)
          }}</span>
        </div>
        <button
          @click="orderStore.completeBatch()"
          :disabled="orderStore.currentBatch.length === 0"
          class="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-sm"
          :class="
            orderStore.currentBatch.length === 0
              ? 'bg-gray-300 shadow-none cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 active:scale-[0.98]'
          "
        >
          <CheckCircle2 class="w-5 h-5" />
          Selesai & Konfirmasi
        </button>
      </div>
    </div>

    <!-- Quantity Dialog -->
    <div
      v-if="showDialog"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-sm shadow-xl transform transition-transform scale-100 relative overflow-hidden"
      >
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-1">
            {{ selectedMenu?.name }}
          </h3>
          <p class="text-green-600 font-medium mb-6">
            {{ formatRupiah(selectedMenu?.price || 0) }}
          </p>

          <div class="flex flex-col items-center mb-8">
            <label class="text-sm text-gray-500 font-medium mb-3"
              >Jumlah Pesanan</label
            >
            <div class="flex items-center gap-6">
              <button
                @click="tempQuantity > 1 && tempQuantity--"
                class="w-12 h-12 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              >
                <Minus class="w-6 h-6" />
              </button>

              <input
                type="number"
                v-model="tempQuantity"
                class="w-20 text-center text-3xl font-bold bg-transparent border-none outline-none text-gray-800"
                min="1"
              />

              <button
                @click="tempQuantity++"
                class="w-12 h-12 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              >
                <Plus class="w-6 h-6" />
              </button>
            </div>
          </div>

          <div class="flex gap-3 mt-4">
            <button
              @click="showDialog = false"
              class="flex-1 py-3 px-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              @click="confirmAdd"
              class="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 shadow-sm transition-colors"
            >
              Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </div>
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
</style>
