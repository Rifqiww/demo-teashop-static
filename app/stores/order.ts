import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export interface OrderItem {
  id: string
  menuId: string
  name: string
  price: number
  quantity: number
}

export interface OrderBatch {
  id: string
  items: OrderItem[]
  timestamp: string // HH:mm
  date: string // e.g. Senin, 01 Mei 2026
  totalAmount: number
  totalItems: number
}

export interface DailyRecap {
  id: string
  date: string
  totalRevenue: number
  totalItemsSold: number
  itemSummary: { name: string; quantity: number; revenue: number }[]
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    currentBatch: [] as OrderItem[],
    todayBatches: [] as OrderBatch[],
    salesHistory: [] as DailyRecap[]
  }),
  getters: {
    todaySummary(state) {
      if (state.todayBatches.length === 0) return null;
      
      const totalRevenue = state.todayBatches.reduce((sum, batch) => sum + batch.totalAmount, 0)
      const totalItemsSold = state.todayBatches.reduce((sum, batch) => sum + batch.totalItems, 0)
      
      const summaryMap = new Map<string, { name: string; quantity: number; revenue: number }>()
      
      state.todayBatches.forEach(batch => {
        batch.items.forEach(item => {
          if (summaryMap.has(item.name)) {
            const current = summaryMap.get(item.name)!
            current.quantity += item.quantity
            current.revenue += (item.price * item.quantity)
          } else {
            summaryMap.set(item.name, {
              name: item.name,
              quantity: item.quantity,
              revenue: item.price * item.quantity
            })
          }
        })
      })

      // Sort by quantity sold descending
      const itemSummary = Array.from(summaryMap.values()).sort((a, b) => b.quantity - a.quantity)

      return {
        totalRevenue,
        totalItemsSold,
        itemSummary
      }
    }
  },
  actions: {
    // Current Batch Actions
    addToBatch(item: OrderItem) {
      const existingItem = this.currentBatch.find(i => i.menuId === item.menuId)
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        this.currentBatch.push(item)
      }
    },
    updateQuantity(menuId: string, quantity: number) {
      const existingItem = this.currentBatch.find(i => i.menuId === menuId)
      if (existingItem) {
        if (quantity <= 0) {
          this.removeFromBatch(menuId)
        } else {
          existingItem.quantity = quantity
        }
      }
    },
    removeFromBatch(menuId: string) {
      this.currentBatch = this.currentBatch.filter(i => i.menuId !== menuId)
    },
    
    // Finalize Batch
    completeBatch() {
      if (this.currentBatch.length === 0) return

      const now = new Date()
      const timestamp = format(now, 'HH:mm')
      const dateStr = format(now, 'EEEE, dd MMMM yyyy', { locale: id })

      const totalAmount = this.currentBatch.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const totalItems = this.currentBatch.reduce((sum, item) => sum + item.quantity, 0)

      const newBatch: OrderBatch = {
        id: uuidv4(),
        items: [...this.currentBatch],
        timestamp,
        date: dateStr,
        totalAmount,
        totalItems
      }

      this.todayBatches.push(newBatch)
      this.currentBatch = [] // Clear current batch
    },

    // Finalize Today's Recap -> Move to History
    summarizeAndCloseDay() {
      if (this.todayBatches.length === 0 || !this.todaySummary) return

      // We group by date from todayBatches, assuming all are from "today".
      // Just take the date from the first batch
      const dateStr = this.todayBatches[0].date

      const existingRecapIndex = this.salesHistory.findIndex(h => h.date === dateStr)

      if (existingRecapIndex !== -1) {
        // Gabungkan data jika hari sudah ada di history
        const existingRecap = this.salesHistory[existingRecapIndex]
        existingRecap.totalRevenue += this.todaySummary.totalRevenue
        existingRecap.totalItemsSold += this.todaySummary.totalItemsSold
        
        for (const item of this.todaySummary.itemSummary) {
          const existingItem = existingRecap.itemSummary.find(i => i.name === item.name)
          if (existingItem) {
            existingItem.quantity += item.quantity
            existingItem.revenue += item.revenue
          } else {
            existingRecap.itemSummary.push({ ...item })
          }
        }
        
        existingRecap.itemSummary.sort((a, b) => b.quantity - a.quantity)
      } else {
        // Buat entry baru jika belum ada
        const dailyRecap: DailyRecap = {
          id: uuidv4(),
          date: dateStr,
          totalRevenue: this.todaySummary.totalRevenue,
          totalItemsSold: this.todaySummary.totalItemsSold,
          itemSummary: [...this.todaySummary.itemSummary]
        }
        this.salesHistory.push(dailyRecap)
      }

      this.todayBatches = [] // Reset for next day
    }
  },
  persist: true
})
