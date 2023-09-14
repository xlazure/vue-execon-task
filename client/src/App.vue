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
  if (fetchMethod) changeFetchMethod(e.target.name, fetchMethod.value)
  switchMode()
}

function changeFetchMethod(name: string, value: boolean, isRestApi = false) {
  mutations.setFetching(value)
  addDataToLocalStorage(name, value)
  if (isRestApi) {
    if (fetchMethod) fetchMethod.value = value
    switchMode(isRestApi)
  }
}

async function hardReset() {
  if (fetchMethod?.value) {
    addDataToLocalStorage('columns', initialData.columns)
    addDataToLocalStorage('counter', initialData.counter)
  } else {
    await removeAllDataFormColumns()
  }
  mutations.reset()
}

function switchMode(isServerOff: boolean = false) {
  if (isServerOff) mutations.setError('Switched to browser mode')
  mutations.reset()
  if (fetchMethod?.value) localFetch()
  else restApiFetch(() => changeFetchMethod('fetchMethod', true, true))
}

onBeforeMount(async () => {
  getFetchMode(fetchMethod, (value: boolean) => changeFetchMethod('fetchMethod', value))
  if (fetchMethod?.value) localFetch()
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
        <br />
        <div class="switch">
          <input
            class="switch-input"
            type="checkbox"
            id="changeFetchMethod"
            :checked="fetchMethod"
            v-model="fetchMethod"
            name="fetchMethod"
            @change="handleChange"
          />
          <label for="changeFetchMethod" class="switch-label">{{}}</label>
          <p>[SAVING]: {{ fetchMethod ? 'browser' : 'database' }}</p>
        </div>
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

  .switch {
    margin: 0 auto;

    p {
      font-weight: 700;
      font-size: 18px;
    }

    &-input {
      display: none;
    }
    &-label {
      transition: all 0.4s ease-in-out;
      border: 1px solid black;
      background-color: rgb(254, 254, 254);
      padding: 2px;
      border-radius: 12px;
      overflow: hidden;
      display: block;
      position: relative;
      height: 25px;
      width: 50px;
      padding: 0;
      margin: 0;

      &::after {
        transition: all 0.4s ease-in-out;
        top: 0;
        position: absolute;
        display: block;
        content: '';
        background-color: blue;
        width: 25px;
        height: 100%;
        border-radius: 12px;
      }
    }

    input:checked + label::after {
      transform: translateX(92%);
      background-color: rgb(255, 0, 0);
    }
    input:checked + label {
      background-color: rgb(183, 183, 183);
    }
  }
}
</style>
