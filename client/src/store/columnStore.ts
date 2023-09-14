import { reactive, watch } from 'vue'
import type { MyStoreState, ColumnItem } from './columnStoreTypes'
import { getAllCountries } from '@/services/countriesApi/controller'
import { addDataToLocalStorage } from '@/fetchingMethods'
import {
  addMultipleDataToColumn,
  addDataToColumn,
  replaceOrAddToColumnC,
  updateDataFormColumnById,
  setActiveItemFromTableById,
  removeDataFromColumnById,
  setCounterToTable
} from '../services/databaseApi/controller'

export const initialData: MyStoreState = {
  columns: {
    A: [],
    B: [],
    C: []
  },
  loading: false,
  error: [],
  counter: 0,
  fetching: true
}

const state = reactive<MyStoreState>({ ...initialData })

export const getters = {
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
  },

  getIsFetching: () => {
    return state.fetching
  }
}

export const mutations = {
  setFetching: (value: boolean) => {
    state.fetching = value
  },
  createItem: async (columnName: string, newItem: ColumnItem) => {
    if (columnName in state.columns) {
      const column = state.columns[columnName]
      const existingItem = column.find((item) => item.name === newItem.name)

      if (!existingItem) {
        column.push(newItem)

        if (!state.fetching) {
          await addDataToColumn(columnName, newItem)
        }
      }
    } else {
      mutations.setError(`Column with name "${columnName}" doesn't exist in store`)
    }
  },

  addMultipleData: (columnName: string, items: ColumnItem[]) => {
    if (state.columns[columnName]) {
      state.columns[columnName].push(...items)
    } else {
      console.error(`Column '${columnName}' does not exist in state.columns.`)
    }
  },

  updateItem: async (columnName: string, updatedItem: ColumnItem) => {
    if (columnName in state.columns) {
      const column = state.columns[columnName]
      const index = column.findIndex((item) => item.name === updatedItem.name)

      if (index !== -1) {
        column.splice(index, 1, updatedItem)

        if (!state.fetching) {
          await updateDataFormColumnById(columnName, updatedItem)
        }
      } else {
        mutations.setError(
          `Item with name "${updatedItem.name}" not found in column "${columnName}"`
        )
      }
    } else {
      mutations.setError(`Column with name "${columnName}" doesn't exist in store`)
    }
  },

  deleteItem: async (columnName: string, deletedItem: ColumnItem) => {
    if (columnName in state.columns) {
      const column = state.columns[columnName]

      const itemIndex = column.findIndex((item:ColumnItem) => item.uuid === deletedItem.uuid)

      if (itemIndex !== -1) {
        column.splice(itemIndex, 1)

        if (!state.fetching) {
          await removeDataFromColumnById(columnName, deletedItem.uuid)
        }
      }
    } else {
      mutations.setError(`Column with name "${columnName}" doesn't exist in store`)
    }
  },

  setColumn: async (columnName: string, item: ColumnItem) => {
    if (columnName in state.columns) {
      state.columns[columnName] = [item]
      if (!state.fetching) {
        await replaceOrAddToColumnC([item])
      }
    } else {
      mutations.setError(`Column with name "${columnName}" doesn't exist in store`)
    }
  },

  setError: (error: any) => {
    state.error.push({ msg: error.error ? error.error : error, code: error.code ? error.code : '' })
  },

  deleteError: (errorToDelete: any) => {
    const index = state.error.indexOf(errorToDelete)

    if (index !== -1) {
      state.error.splice(index, 1)
    }
  },

  clearError: () => {
    state.error = []
  },

  incrementCounter: async () => {
    state.counter++
  },

  setLoading: (loading: boolean) => {
    state.loading = loading
  },

  setCounter: (counter: number) => {
    state.counter = counter
  },

  reset: () => {
    state.columns = { A: [], B: [], C: [] }
    state.counter = 0
  }
}
export const actions = {
  fetchDataToFirstColumn: async () => {
    const limit: number = 20

    try {
      mutations.setLoading(true)

      const countries: any = await getAllCountries()

      const processedData = countries.map((item: ColumnItem) => ({
        name: item.name,
        isChecked: false,
        uuid: Math.random().toString(36).slice(2, 9)
      }))
      const dataToBeAdded = processedData.slice(state.counter * limit, (state.counter + 1) * limit)

      mutations.addMultipleData('A', dataToBeAdded)

      mutations.incrementCounter()
      mutations.setLoading(false)
      if (!state.fetching) {
        await addMultipleDataToColumn('A', dataToBeAdded)
        await setCounterToTable(state.counter)
      } else {
        addDataToLocalStorage('counter', state.counter)
      }
    } catch (err) {
      mutations.setError('Error fetching countries')
    }
  },

  selectActiveItemFormColumn: async (columnName: string, item: ColumnItem) => {
    const column = state.columns[columnName]
    const index = column.findIndex((item2) => item2.uuid === item.uuid)

    if (index !== -1) {
      column[index].isActive = true

      if (!state.fetching) {
        await setActiveItemFromTableById(columnName, column[index].uuid)
      }

      column.forEach((item2) => {
        if (item2.uuid !== item.uuid) {
          item2.isActive = false
        }
      })
    }
  }
}

const useColumnStore = () => ({
  getters,
  mutations,
  actions,
  initialData
})

watch(
  () => state.columns,
  (newColumns, oldColumns) => {
    if (!state.fetching) return
    addDataToLocalStorage('columns', newColumns)
  },
  { deep: true }
)

export default useColumnStore
