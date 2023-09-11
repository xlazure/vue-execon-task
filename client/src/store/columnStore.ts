import { reactive } from 'vue'
import type { MyStoreState, ColumnItem } from './columnStoreTypes'

const initialData: MyStoreState = {
  columns: {
    A: [],
    B: [],
    C: []
  },
  loading: false,
  error: null,
  counter: 0
}

const state = reactive<MyStoreState>({ ...initialData })

const getters = {
  getColumnData: (columnName: string) => {
    if (columnName in state.columns) {
      return state.columns[columnName]
    } else {
      mutations.setError(`Column with name "${columnName}" doesn't exist in store`)
      return []
    }
  },

  getCounter: () => {
    return state.counter
  },

  getError: () => {
    return state.error
  },

  isLoading: () => {
    return state.loading
  }
}

const mutations = {
  createItem: (columnName: string, newItem: ColumnItem) => {
    if (columnName in state.columns) {
      state.columns[columnName].push(newItem)
    } else {
      mutations.setError(`Column with name "${columnName}" doesn't exist in store`)
    }
  },

  updateItem: (columnName: string, itemId: number, updatedItem: ColumnItem) => {
    if (columnName in state.columns) {
      const column = state.columns[columnName]
      const index = column.findIndex((item) => item.id === itemId)

      if (index !== -1) {
        column.splice(index, 1, updatedItem)
      } else {
        mutations.setError(`Item with ID "${itemId}" not found in column "${columnName}"`)
      }
    } else {
      mutations.setError(`Column with name "${columnName}" doesn't exist in store`)
    }
  },

  deleteItem: (columnName: string, itemId: number) => {
    if (columnName in state.columns) {
      const column = state.columns[columnName]
      const index = column.findIndex((item) => item.id === itemId)

      if (index !== -1) {
        column.splice(index, 1)
      } else {
        mutations.setError(`Item with ID "${itemId}" not found in column "${columnName}"`)
      }
    } else {
      mutations.setError(`Column with name "${columnName}" doesn't exist in store`)
    }
  },
  setError: (error: string | null) => {
    state.error = error
  },

  clearError: () => {
    state.error = null
  },

  incrementCounter: () => {
    state.counter++
  },

  setLoading: (loading: boolean) => {
    state.loading = loading
  },

  resetStore: () => {
    Object.assign(state, { ...initialData })
  }
}
const actions = {
  fetchDataToFirstColumn: async () => {
    const limit: number = 20

    try {
      mutations.setLoading(true)

      // fetch

      mutations.incrementCounter()
      mutations.setLoading(false)
    } catch (error) {
      mutations.setError('Error fetching countries:' + error)
    }
  }
}

const useColumnStore = () => ({
  getters,
  mutations,
  actions
})

export default useColumnStore
