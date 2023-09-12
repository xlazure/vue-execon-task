<script setup lang="ts">
import { inject, onBeforeMount, watch } from 'vue';
import ColumnComponent from './components/ColumnComponent.vue'
import useColumnStore from './store/columnStore'
import { addDataToLocalStorage, loadDataFromLocalStorage } from './localStorage'
// import type { Item } from './components/types'

const { actions, mutations,getters } = useColumnStore()
const fetchMethod: any = inject('fetchMethod')

function handleChange(e: any) {
  mutations.setFetching(fetchMethod.value)
  addDataToLocalStorage(e.target.name, fetchMethod.value)
}

function localFetch() {
  console.log('local storage')
  const counterData: any = loadDataFromLocalStorage('counter')
  const columnsData: any = loadDataFromLocalStorage('columns')

  const counter = JSON.parse(counterData)
  const columns = JSON.parse(columnsData)

  if(counter) {
    mutations.setCounter(counter)
  }

  if(!columns) {
    mutations.setError('Cannot fetch data from local storage');
    return
  };
  
  const columnsKeys: string[] = Object.keys(columns)

  columnsKeys.map((key:string) => {
    mutations.addMultipleData(key,columns[key])
  })

}

function restApiFetch() {
  console.log('rest api')
}

function getFetchMode() {
  const isFetching: string | null = loadDataFromLocalStorage('fetchMethod')
  if(!isFetching) return
  const isLocalFetching = JSON.parse(isFetching) 
  return fetchMethod.value = isLocalFetching
}

function hardReset() {

  addDataToLocalStorage('columns',{A:[],B:[],C:[]})
  addDataToLocalStorage('counter',0)
  mutations.reset()
}

onBeforeMount(() => {
  getFetchMode()
  if(fetchMethod.value) localFetch()
  else restApiFetch()
})
watch(fetchMethod, () => {
  mutations.reset()
  if (fetchMethod.value) localFetch();
  else restApiFetch();
});

watch(getters.getError,()=>{
  console.log(getters.getError())
})

</script>

<template>
  <ColumnComponent columnName="A">
    <template #objects>
      <button @click="actions.fetchDataToFirstColumn">Download data</button>
      <button @click="hardReset">Reset</button>
      <br />
      <input type="checkbox" id="changeFetchMethod" :checked="fetchMethod" v-model="fetchMethod" name="fetchMethod"
        @change="handleChange" />
      <label for="changeFetchMethod">{{ fetchMethod ? "Local host" : "Rest API" }}</label>
    </template>
  </ColumnComponent>
  <ColumnComponent columnName="B" />
  <ColumnComponent columnName="C" />
</template>

<style lang="scss">
#app {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100vh;
}
</style>
