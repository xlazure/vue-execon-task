<script setup lang="ts">
import useColumnStore from './store/columnStore'

const { getters } = useColumnStore()

console.log(getters.getColumnData('A'))
</script>

<template>
  <h1>Hi</h1>
</template>

<style scoped></style>
