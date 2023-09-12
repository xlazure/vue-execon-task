<script lang="ts" setup>
import { onMounted } from 'vue'
import type { ColumnPropsType } from './types'
import ColumnInputPicker from './ColumnInputPicker.vue'

const { columnName }: ColumnPropsType = defineProps(['columnName'])

function onDrop(event: DragEvent) {
  //   const target = event.target as HTMLElement
  //   const direction = target.id
  //   const data: string | undefined = event.dataTransfer?.getData('application/json')
  //   if (!data) return
  //   const { source, itemProps } = JSON.parse(data)
  //   if (source === 'A' && direction === 'B') {
  //     if (itemProps.isChecked) {
  //       countryStore.mutations.changeItemCheckState('A', itemProps.name, itemProps.isChecked)
  //     }
  //     countryStore.mutations.addItemToColumn('B', itemProps)
  //   }
  //   if (source === 'C' && direction === 'A') {
  //     countryStore.mutations.changeItemCheckState('A', itemProps.name, !itemProps.isChecked)
  //     countryStore.mutations.removeItemFromColumn('B', itemProps)
  //     countryStore.mutations.removeItemFromColumn('C', itemProps)
  //   }
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
