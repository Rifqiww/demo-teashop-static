<script setup lang="ts">
import { ref } from 'vue'
import { useMenuStore } from '~/stores/menu'
import { Plus, Edit2, Trash2, LayoutGrid, Tags, X, AlertCircle } from 'lucide-vue-next'

const menuStore = useMenuStore()

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number)
}

// Menu Management State
const showMenuDialog = ref(false)
const isEditing = ref(false)
const editMenuId = ref('')
const formMenu = ref({
  name: '',
  price: 0,
  category: ''
})

const openAddMenu = () => {
  isEditing.value = false
  formMenu.value = { name: '', price: 0, category: menuStore.categories[0] || '' }
  showMenuDialog.value = true
}

const openEditMenu = (menu: any) => {
  isEditing.value = true
  editMenuId.value = menu.id
  formMenu.value = { ...menu }
  showMenuDialog.value = true
}

const saveMenu = () => {
  if (isEditing.value) {
    menuStore.updateMenu(editMenuId.value, { ...formMenu.value })
  } else {
    menuStore.addMenu({ ...formMenu.value })
  }
  showMenuDialog.value = false
}

const showDeleteDialog = ref(false)
const deleteType = ref<'menu' | 'category'>('menu')
const deleteTargetId = ref('')
const deleteTargetName = ref('')

const openDeleteConfirm = (id: string, name: string, type: 'menu' | 'category') => {
  deleteTargetId.value = id
  deleteTargetName.value = name
  deleteType.value = type
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  if (deleteType.value === 'menu') {
    menuStore.deleteMenu(deleteTargetId.value)
  } else {
    menuStore.deleteCategory(deleteTargetId.value)
  }
  showDeleteDialog.value = false
}

// Category Management State
const showCategoryDialog = ref(false)
const newCategoryName = ref('')

const openAddCategory = () => {
  newCategoryName.value = ''
  showCategoryDialog.value = true
}

const saveCategory = () => {
  if (newCategoryName.value.trim()) {
    menuStore.addCategory(newCategoryName.value.trim())
    showCategoryDialog.value = false
  }
}

const deleteCategory = (category: string) => {
  openDeleteConfirm(category, category, 'category')
}
</script>

<template>
  <div class="h-full flex flex-col gap-8 custom-scrollbar overflow-y-auto pr-2 pb-20 md:pb-0">
    <div>
      <h2 class="text-3xl font-bold text-gray-800">Manajemen Menu & Kategori</h2>
      <p class="text-gray-500 mt-1">Atur daftar menu dan kategori produk Anda</p>
    </div>

    <!-- Category Management Section -->
    <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-orange-50 p-2 rounded-lg text-orange-600">
            <Tags class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">Kategori Menu</h3>
            <p class="text-sm text-gray-500">Kelola kategori untuk mengelompokkan menu</p>
          </div>
        </div>
        <button @click="openAddCategory" class="bg-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <Plus class="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>

      <div class="flex flex-wrap gap-3">
        <div 
          v-for="cat in menuStore.categories" 
          :key="cat"
          class="bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-1 py-1.5 flex items-center gap-3 group hover:border-orange-200 hover:bg-orange-50 transition-colors"
        >
          <span class="font-medium text-gray-700 text-sm group-hover:text-orange-700">{{ cat }}</span>
          <button @click="deleteCategory(cat)" class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-md transition-all opacity-50 group-hover:opacity-100">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
        <div v-if="menuStore.categories.length === 0" class="text-sm text-gray-500 italic">Belum ada kategori.</div>
      </div>
    </div>

    <!-- Menu Management Section -->
    <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex-1">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-green-50 p-2 rounded-lg text-green-600">
            <LayoutGrid class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">Daftar Menu</h3>
            <p class="text-sm text-gray-500">Kelola menu yang tersedia untuk dijual</p>
          </div>
        </div>
        <button @click="openAddMenu" class="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <Plus class="w-4 h-4" />
          Tambah Menu
        </button>
      </div>

      <div v-if="menuStore.items.length === 0" class="text-center py-10 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
        Belum ada menu. Silakan tambah menu baru.
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div v-for="item in menuStore.items" :key="item.id" class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-green-200 transition-all h-40">
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start gap-2 mb-2">
              <h4 class="font-bold text-gray-800 line-clamp-2 text-lg">{{ item.name }}</h4>
              <span class="bg-gray-100 text-gray-500 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-lg whitespace-nowrap">{{ item.category }}</span>
            </div>
            <span class="text-green-600 font-bold">{{ formatRupiah(item.price) }}</span>
          </div>
          
          <div class="flex gap-2 mt-4 pt-3 border-t border-gray-50">
            <button @click="openEditMenu(item)" class="flex-1 flex items-center justify-center py-2 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm">
              <Edit2 class="w-4.5 h-4.5" />
            </button>
            <button @click="openDeleteConfirm(item.id, item.name, 'menu')" class="flex-1 flex items-center justify-center py-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm">
              <Trash2 class="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Dialog -->
    <div v-if="showCategoryDialog" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-sm shadow-xl relative overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 class="text-lg font-bold text-gray-800">Tambah Kategori</h3>
          <button @click="showCategoryDialog = false" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="saveCategory" class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
            <input v-model="newCategoryName" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" placeholder="Contoh: Kopi Series">
          </div>
          <button type="submit" class="w-full py-2.5 px-4 rounded-xl font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm">
            Simpan Kategori
          </button>
        </form>
      </div>
    </div>

    <!-- Menu Dialog (Add/Edit) -->
    <div v-if="showMenuDialog" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-xl relative overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Menu' : 'Tambah Menu Baru' }}</h3>
          <button @click="showMenuDialog = false" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="saveMenu" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
            <input v-model="formMenu.name" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Contoh: Matcha Latte">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
            <input v-model="formMenu.price" type="number" required min="0" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select v-model="formMenu.category" required class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white">
              <option disabled value="">Pilih kategori...</option>
              <option v-for="cat in menuStore.categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          
          <div class="pt-4 flex gap-3">
            <button type="button" @click="showMenuDialog = false" class="flex-1 py-2.5 px-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              Batal
            </button>
            <button type="submit" class="flex-1 py-2.5 px-4 rounded-xl font-medium text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDeleteDialog" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteDialog = false"></div>
          
          <div class="bg-white w-full max-w-sm rounded-3xl shadow-xl relative flex flex-col z-10 p-6 text-center">
            <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Hapus {{ deleteType === 'menu' ? 'Menu' : 'Kategori' }}?</h3>
            <p class="text-gray-500 text-sm mb-6 leading-relaxed">
              Anda yakin ingin menghapus <span class="font-semibold text-gray-700">"{{ deleteTargetName }}"</span>? 
              {{ deleteType === 'category' ? 'Pastikan tidak ada menu yang menggunakan kategori ini.' : 'Tindakan ini tidak dapat dibatalkan.' }}
            </p>
            
            <div class="flex gap-3">
              <button @click="showDeleteDialog = false" class="flex-1 py-3 px-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                Batal
              </button>
              <button @click="confirmDelete" class="flex-1 py-3 px-4 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-sm transition-colors">
                Hapus
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
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
