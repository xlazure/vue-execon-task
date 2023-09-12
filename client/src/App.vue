<script setup lang="ts">
import ColumnComponent from './components/ColumnComponent.vue'
import { onMounted, ref } from 'vue'

const store = ref<any>(null) // Replace 'any' with your store type if available

const fetchDataToFirstColumn = () => {
  if (store.value) {
    store.value.actions.fetchDataToFirstColumn()
  }
}

const resetStore = () => {
  if (store.value) {
    store.value.mutations.resetStore()
  }
}

// Assuming you have access to the store instance from the setup context
onMounted(() => {
  store.value = this.$store
})
</script>

<template>
  <ColumnComponent columnName="A">
    <template #objects>
      <button @click="actions.fetchDataToFirstColumn">Download data</button>
      <button @click="resetStore">Reset</button>
    </template>
  </ColumnComponent>
  <ColumnComponent columnName="B" />
  <ColumnComponent columnName="C" />
</template>

<style>
#app {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100vh;
}
</style>
