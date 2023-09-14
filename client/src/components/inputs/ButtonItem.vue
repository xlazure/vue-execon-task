<template>
  <button :draggable="isDraggable" @dragstart="onDragStart" :class="{selected: isSelected}">
    {{ inputProps.name }}
  </button>
</template>

<script lang="ts" setup>
const { inputProps, isDraggable, columnName,isSelected } = defineProps([
  'inputProps',
  'isDraggable',
  'columnName',
  'isSelected'
])

function onDragStart(event: DragEvent) {
  const data = {
    source: columnName,
    inputProps
  }
  event.dataTransfer?.setData('application/json', JSON.stringify(data))
}
</script>

<style lang="scss" scoped>
button {
  user-select: none;
  overflow: hidden;
  border: none;
  float: left;
  margin: 0.1rem;
  background-color: #ffffff;
  color: #000000;
  font-weight: 700;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.9rem;

  &:active {
    opacity: 0.6;
  }
}
</style>
