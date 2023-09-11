<script setup lang="ts">
import useColumnStore from './store/columnStore'

const { getters, actions, mutations } = useColumnStore()
</script>

<template>
  <h1>State:</h1>
  <button @click="actions.fetchDataToFirstColumn">Download data</button>
  <button @click="mutations.resetStore">Reset</button>
  <p>{{ getters.getColumnData('A') }}</p>
</template>

<style scoped></style>
