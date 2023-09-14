<template>
  <div>
    <span v-for="(item, index) in columnData" :key="item.uuid" @keydown.left="moveRight(index)"
      @keydown.down="moveLeft(index)">
      <component :is="DynamicComponent" :inputProps="item" :isDraggable="isDraggable" :index="index"
        :columnName="columnName" :columnFocus="columnFocus" :currentIndex="currentIndex"
        :isSelected="index === currentIndex && columnName === columnFocus"></component>
    </span>
  </div>
  <p v-if="isLoading && columnName === 'A'">Loading...</p>
</template>

<script lang="ts" setup>
import inputConfig from './input.config'
import useColumnStore, { actions } from '@/store/columnStore'
import { computed, defineAsyncComponent, onMounted, inject, ref, type Ref } from 'vue'


const columnFocus= inject<Ref<string> | undefined>('columnFocus')
const { columnName }: any = defineProps(['columnName'])

const currentIndex = ref<number | null>(0)

const { getters, mutations } = useColumnStore()

const columnConfig = inputConfig.columns[columnName]

const isDraggable = columnConfig.isDraggable || false
const isLoading = computed(() => getters.isLoading())
const columnData = computed(() => getters.getColumnData(columnName))

function moveRight(index: number) {
  if (index >= columnData.value.length - 1) {
    currentIndex.value = 0
  } else {
    currentIndex.value = index + 1;
  }
}
function moveLeft(index: number) {
  if (index > 0) {
    currentIndex.value = index - 1;
  } else {
    currentIndex.value = columnData.value.length - 1
  }


}

onMounted(() => {
  document.addEventListener('keydown', handleKeyboardNavigation);
});

const handleKeyboardNavigation = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowRight':
      if (currentIndex.value !== null) {
        moveRight(currentIndex.value);
        event.preventDefault();
      }
      break;
    case 'ArrowLeft':
      if (currentIndex.value !== null) {
        moveLeft(currentIndex.value);
        event.preventDefault();
      }
      break;
    case 'Enter':
      if (currentIndex.value !== null) {
        toggleCheckbox(currentIndex.value);
        event.preventDefault();
      }
      break;
    default:
      break;
  }
};

const toggleCheckbox = (index: number) => {
  
  if (columnFocus?.value === 'A' && columnName === 'A') {
    if (currentIndex.value !== null) {
      const item = columnData.value[index]
      item.isChecked = !item.isChecked;

      if (item.isChecked) {
        mutations.createItem('B', { name: item.name, isActive: false, uuid: item.uuid })
      } else {
        mutations.deleteItem('B', item)
        mutations.deleteItem('C', item)
      }
    }
  }
  else if (columnFocus?.value === 'B' && columnName === 'B') {
    if (currentIndex.value !== null) {
      const item = columnData.value[index]
      item.isActive = !item.isActive;

      if (item.isActive) {
        actions.selectActiveItemFormColumn('B', item)
        mutations.setColumn('C', { name: item.name, uuid: item.uuid })
      }
    }
  }
  else if (columnFocus?.value === 'C' && columnName === 'C') {
    if (currentIndex.value !== null) {
      const item = columnData.value[index]
      mutations.deleteItem('B', item)
      mutations.deleteItem('C', item)
      mutations.updateItem('A', {
        name: item.name,
        isChecked: false,
        uuid: item.uuid
      })
    }

  }

};

const DynamicComponent = defineAsyncComponent(() => {
  return import(`./inputs/${columnConfig.type}Item.vue`)
})


</script>

<style lang="scss">
.selected {
  border-radius: 4px;
  outline: 2px solid red;
}
</style>
