<template>
  <span>
    <input :id="'c' + index" type="checkbox" :checked="inputProps.isChecked" :name="inputProps.name"
      @change="handleChange" />
    <label :for="'c' + index" :draggable="isDraggable" @dragstart="onDragStart">
      <span class="custom-button">
        {{ inputProps.name }}
      </span>
    </label>
  </span>
</template>

<script lang="ts" setup>
import useColumnStore from '@/store/columnStore';
import type { ColumnItem } from '@/store/columnStoreTypes';

const { inputProps, isDraggable, index, columnName } = defineProps(['inputProps', 'isDraggable', 'index', 'columnName'])
const { mutations } = useColumnStore()

function onDragStart(event: DragEvent) {
  const data = {
    source: columnName,
    inputProps: {
      name: inputProps.name,
      isChecked: !inputProps.isChecked,
      uuid: inputProps.uuid
    },
  };
  event.dataTransfer?.setData("application/json", JSON.stringify(data));
}

function handleChange(event: Event) {
  console.log(inputProps)
  const target = event.target as HTMLInputElement
  const { name, uuid } = inputProps;
  mutations.updateItem(columnName, { name, isChecked: target.checked, uuid })

  if (target.checked) {
    
    const newItem: ColumnItem = {
      name,
      isActive: false,
      uuid
    }

    mutations.createItem('B', newItem)
  } else {
    mutations.deleteItem('B', inputProps)
    mutations.deleteItem('C', inputProps)
  }

}


</script>

<style lang="scss" scoped>
label {
  user-select: none;
  overflow: hidden;
  float: left;
  margin: 0.1rem;
  background-color: #ffffff;
  color: #000000;
  font-weight: 700;
  border-radius: 4px;

  &:focus,
  &:active {
    opacity: 0.6;
  }

  .custom-button {
    font-weight: 700;
    font-size: 0.9rem;
  }
}

input {
  display: none;
}

input:checked+label {
  background-color: #1bdc1b;
}
</style>