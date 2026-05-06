import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [
      // Tea Series
      { id: uuidv4(), name: 'Lemon Tea', price: 5000, category: 'Tea Series' },
      { id: uuidv4(), name: 'Markisa Tea', price: 5000, category: 'Tea Series' },
      { id: uuidv4(), name: 'Mango Tea', price: 5000, category: 'Tea Series' },
      { id: uuidv4(), name: 'Blackcurrent Tea', price: 5000, category: 'Tea Series' },
      { id: uuidv4(), name: 'Milk Tea', price: 8000, category: 'Tea Series' },
      { id: uuidv4(), name: 'Strawberry Tea', price: 5000, category: 'Tea Series' },
      { id: uuidv4(), name: 'Apple Tea', price: 5000, category: 'Tea Series' },
      { id: uuidv4(), name: 'Lychee Tea', price: 5000, category: 'Tea Series' },
      { id: uuidv4(), name: 'Jasmine Tea', price: 4000, category: 'Tea Series' },
      
      // Milky Series
      { id: uuidv4(), name: 'Dark Choco', price: 12000, category: 'Milky Series' },
      { id: uuidv4(), name: 'Taro', price: 10000, category: 'Milky Series' },
      { id: uuidv4(), name: 'Choco Oreo', price: 12000, category: 'Milky Series' },
      { id: uuidv4(), name: 'Red Velvet', price: 10000, category: 'Milky Series' },
      { id: uuidv4(), name: 'Bubble Gum', price: 10000, category: 'Milky Series' },
      { id: uuidv4(), name: 'Avocado', price: 10000, category: 'Milky Series' },
      { id: uuidv4(), name: 'Matcha', price: 10000, category: 'Milky Series' },
      
      // Squash Series
      { id: uuidv4(), name: 'Strawberry Squash', price: 10000, category: 'Squash Series' },
      { id: uuidv4(), name: 'Lychee Squash', price: 10000, category: 'Squash Series' },
      { id: uuidv4(), name: 'Mango Squash', price: 10000, category: 'Squash Series' },
      { id: uuidv4(), name: 'Orange Squash', price: 10000, category: 'Squash Series' },
      { id: uuidv4(), name: 'Melon Squash', price: 10000, category: 'Squash Series' },
      
      // Yakult Series
      { id: uuidv4(), name: 'Mango Yakult', price: 8000, category: 'Yakult Series' },
      { id: uuidv4(), name: 'Orange Yakult', price: 8000, category: 'Yakult Series' },
      { id: uuidv4(), name: 'Strawberry Yakult', price: 8000, category: 'Yakult Series' },
      { id: uuidv4(), name: 'Melon Yakult', price: 8000, category: 'Yakult Series' },
      { id: uuidv4(), name: 'Lychee Yakult', price: 8000, category: 'Yakult Series' },
    ] as MenuItem[],
    categories: ['Tea Series', 'Milky Series', 'Squash Series', 'Yakult Series'] as string[]
  }),
  actions: {
    addMenu(menu: Omit<MenuItem, 'id'>) {
      this.items.push({
        id: uuidv4(),
        ...menu
      })
    },
    updateMenu(id: string, updatedMenu: Omit<MenuItem, 'id'>) {
      const index = this.items.findIndex(item => item.id === id)
      if (index !== -1) {
        this.items[index] = { id, ...updatedMenu }
      }
    },
    deleteMenu(id: string) {
      this.items = this.items.filter(item => item.id !== id)
    },
    addCategory(category: string) {
      if (!this.categories.includes(category)) {
        this.categories.push(category)
      }
    },
    deleteCategory(category: string) {
      this.categories = this.categories.filter(c => c !== category)
      // Optional: Update or delete items with this category? We'll just keep the items for now, or maybe the user has to re-categorize them.
    }
  },
  persist: true
})
