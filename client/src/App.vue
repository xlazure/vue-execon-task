<script setup lang="ts">
import ColumnComponent from './components/ColumnComponent.vue'
import useColumnStore from './store/columnStore'

const { actions, mutations } = useColumnStore()
</script>

<template>
  <ColumnComponent columnName="A">
    <template #objects>
      <button @click="actions.fetchDataToFirstColumn">Download data</button>
      <button @click="mutations.resetStore">Reset</button>
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
