import { inject, reactive, watch } from 'vue'
import type { MyStoreState, ColumnItem } from './columnStoreTypes'
import { getAllCountries } from '@/services/countriesApi/controller'
import { addDataToLocalStorage } from '@/localStorage'
import {addMultipleDataToColumn,addDataToColumn, replaceOrAddToColumnC} from '../services/databaseApi/controller'

const initialData: MyStoreState = {
  columns: {
    A: [],
    B: [],
    C: []
  },
  loading: false,
  error: null,
  counter: 0,
  fetching: true
}

export const state = reactive<MyStoreState>({ ...initialData })

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

}

export const mutations = {
  setFetching: (value:boolean)=>{
    state.fetching = value
  },
  createItem: (columnName: string, newItem: ColumnItem) => {
    if (columnName in state.columns) {
      const column = state.columns[columnName];
      console.log(newItem)
      // Check if an item with the same name already exists
      const existingItem = column.find((item) => item.name === newItem.name);
      
      if (!existingItem) {
        column.push(newItem);
        addDataToColumn(columnName,newItem)
      }
    } else {
      mutations.setError(`Column with name "${columnName}" doesn't exist in store`);
    }
  },
  

  addMultipleData: (columnName: string, items: ColumnItem[]) => {
    if (state.columns[columnName]) {
      state.columns[columnName].push(...items)
    } else {
      console.error(`Column '${columnName}' does not exist in state.columns.`)
    }
  },

  updateItem: (columnName: string, updatedItem: ColumnItem) => {
    if (columnName in state.columns) {
      const column = state.columns[columnName]
      const index = column.findIndex((item) => item.name === updatedItem.name)

      if (index !== -1) {
        column.splice(index, 1, updatedItem)
      } else {
        mutations.setError(`Item with name "${updatedItem.name}" not found in column "${columnName}"`)
      }
    } else {
      mutations.setError(`Column with name "${columnName}" doesn't exist in store`)
    }
  },

  deleteItem: (columnName: string, deletedItem: ColumnItem) => {
    if (columnName in state.columns) {
      const column = state.columns[columnName];
      const updatedColumn = column.filter((item) => item.uuid !== deletedItem.uuid);
  
      if (updatedColumn.length === column.length) {
        mutations.setError(`Item with uuid "${deletedItem.uuid}" not found in column "${columnName}"`);
      } else {
        state.columns[columnName] = updatedColumn;
      }
    } else {
      mutations.setError(`Column with name "${columnName}" doesn't exist in store`);
    }
  },

  // deleteItem: (columnName: string, deletedItem: ColumnItem) => {
  //   if (columnName in state.columns) {
  //     const column = state.columns[columnName]
  //     const index = column.findIndex((item) => item.uuid === deletedItem.uuid)

  //     if (index !== -1) {
  //       column.splice(index, 1)
  //     } else {
  //       mutations.setError(`Item with name "${deletedItem.name}" not found in column "${columnName}"`)
  //     }
  //   } else {
  //     mutations.setError(`Column with name "${columnName}" doesn't exist in store`)
  //   }
  // },

  setColumn: async (columnName: string, item: ColumnItem) => {
    if (columnName in state.columns) {
      state.columns[columnName] = [item]
      // replaceOrAddToColumnC
      await replaceOrAddToColumnC([item])
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

  setCounter: (counter: number) => {
    state.counter = counter
  },

  reset: () => {
    state.columns = { A:[],B:[],C:[] };
    state.counter = 0;
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
      await addMultipleDataToColumn("A", dataToBeAdded);

      mutations.incrementCounter()
      mutations.setLoading(false)

      if(state.fetching) {
        addDataToLocalStorage('counter',state.counter)
      }

    } catch (error) {
      mutations.setError('Error fetching countries:' + error)
    }
  },

  selectActiveItemFormColumn: (columnName: string, item: ColumnItem) => {
    const column = state.columns[columnName]
    const index = column.findIndex((item2) => item2.uuid === item.uuid)

    if (index !== -1) {
      column[index].isActive = true
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
  state
})

watch(
  () => state.columns,
  (newColumns,oldColumns) => {
    if (!state.fetching) return;
    addDataToLocalStorage('columns', oldColumns)
  },
  { deep: true }
)

export default useColumnStore
