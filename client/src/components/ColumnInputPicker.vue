<template>
  <div>
    <span v-for="(item, index) in columnData" :key="index">
      <!-- Use the dynamically loaded component -->
      <component :is="DynamicComponent" :inputProps="item" :isDraggable="isDraggable"></component>
    </span>
  </div>
  <p v-if="isLoading && columnName === 'A'">Loading...</p>
</template>

<script lang="ts" setup>
import inputConfig from './input.config'
import useColumnStore from '@/store/columnStore'
import { computed, defineAsyncComponent } from 'vue' // Import defineAsyncComponent

const { columnName }: any = defineProps(['columnName'])
const columnConfig = inputConfig.columns[columnName]
const { getters } = useColumnStore()
const isDraggable = columnConfig.isDraggable || false
const isLoading = computed(() => getters.isLoading())
const columnData = computed(() => getters.getColumnData(columnName))

const DynamicComponent = defineAsyncComponent(() => {
  return import(`./inputs/${columnConfig.type}Item.vue`)
})
</script>
