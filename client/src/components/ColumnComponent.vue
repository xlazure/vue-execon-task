<script lang="ts" setup>
import { onMounted } from 'vue'
import type { ColumnPropsType } from './types'
import ColumnInputPicker from './ColumnInputPicker.vue'
import useColumnStore from '@/store/columnStore';

const { columnName }: ColumnPropsType = defineProps(['columnName'])
const { mutations } = useColumnStore()

function onDrop(event: DragEvent) {
  const target = event.target as HTMLElement;
  const direction = target.id;
  const data: string | undefined =
    event.dataTransfer?.getData("application/json");

  if (!data) return;

  const { source, inputProps } = JSON.parse(data);
  if (source === "A" && direction === "B") {
    console.log('drag-add:',inputProps)
    if (inputProps.isChecked) {
      mutations.updateItem(
        source,
        {
          name: inputProps.name,
          isChecked: inputProps.isChecked,
          uuid: inputProps.uuid
        }
      );
      mutations.createItem(direction, inputProps);
    }
  }
  if (source === "C" && direction === "A") {
    console.log('drag-remove:',inputProps)
    mutations.deleteItem("B", inputProps);
    mutations.deleteItem("C", inputProps);
    mutations.updateItem(
      direction,
      {
        name: inputProps.name,
        isChecked: false,
        uuid: inputProps.uuid
      }
    );

  }
}
</script>

<template>
  <section @drop="onDrop" @dragover.prevent>
    <div v-if="$slots.objects" class="block">
      <slot name="objects" />
    </div>
    <div class="block" :id="columnName">
      <ColumnInputPicker :columnName="columnName" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #6c72aa;

  &:nth-child(odd) {
    background-color: #5e6495;
  }

  .block {
    display: block;
    width: 100%;
    border-right: 2px solid black;
  }
}
</style>
