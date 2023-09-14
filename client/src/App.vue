<script setup lang="ts">
import useColumnStore from './store/columnStore'
import { inject, onBeforeMount, type Ref } from 'vue'
import ColumnComponent from './components/ColumnComponent.vue'
import ErrorWidget from './components/ErrorWidget.vue'
import { addDataToLocalStorage, localFetch, restApiFetch, getFetchMode } from './fetchingMethods'
import { removeAllDataFormColumns } from './services/databaseApi/controller'

const { actions, mutations, initialData } = useColumnStore()
const fetchMethod = inject<Ref<boolean> | undefined>('fetchMethod')

function handleChange(e: any) {
  changeFetchMethod(e.target.name, fetchMethod.value)
  switchMode()
}

function changeFetchMethod(name: string, value: boolean, isRestApi = false) {
  mutations.setFetching(value)
  addDataToLocalStorage(name, value)
  if (isRestApi) {
    fetchMethod.value = value
    switchMode(isRestApi)
  }
}

async function hardReset() {
  if (fetchMethod.value) {
    addDataToLocalStorage('columns', initialData.columns)
    addDataToLocalStorage('counter', initialData.counter)
  } else {
    await removeAllDataFormColumns()
  }
  mutations.reset()
}

function switchMode(isServerOff: boolean = false) {
  if (isServerOff) mutations.setError('Switched to localStorage mode')
  mutations.reset()
  if (fetchMethod.value) localFetch()
  else restApiFetch(() => changeFetchMethod('fetchMethod', true, true))
}

onBeforeMount(async () => {
  getFetchMode(fetchMethod, (value: boolean) => changeFetchMethod('fetchMethod', value))
  if (fetchMethod.value) localFetch()
  else restApiFetch(() => changeFetchMethod('fetchMethod', true, true))
})
</script>

<template>
  <ErrorWidget />
  <div class="container">
    <ColumnComponent columnName="A">
      <template #objects>
        <button @click="actions.fetchDataToFirstColumn">Download data</button>
        <button @click="hardReset">Reset</button>
        <br />
        <input
          type="checkbox"
          id="changeFetchMethod"
          :checked="fetchMethod"
          v-model="fetchMethod"
          name="fetchMethod"
          @change="handleChange"
        />
        <label for="changeFetchMethod">{{ fetchMethod ? 'Local host' : 'Rest API' }}</label>
      </template>
    </ColumnComponent>
    <ColumnComponent columnName="B" />
    <ColumnComponent columnName="C" />
  </div>
</template>

<style lang="scss">
#app {
  position: relative;
}
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100vh;
}
</style>
