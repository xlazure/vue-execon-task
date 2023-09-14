<script lang="ts" setup>
import type { ColumnPropsType } from './types'
import ColumnInputPicker from './ColumnInputPicker.vue'
import useColumnStore from '@/store/columnStore'
import { computed, inject, ref, type Ref } from 'vue'

const { columnName }: ColumnPropsType = defineProps(['columnName'])
const { mutations } = useColumnStore()

const focusedColumnName = inject('columnFocus') as Ref<string | undefined>;
const currentColumn: Ref<string | undefined> = ref('')
  
  const isAnimated = computed(() => columnName === currentColumn.value)


function onDrop(event: DragEvent) {
  const target = event.target as HTMLElement
  const direction = target.id
  const data: string | undefined = event.dataTransfer?.getData('application/json')

  if (!data) return

  const { source, inputProps } = JSON.parse(data)
  if (source === 'A' && direction === 'B') {
    if (inputProps.isChecked) {
      mutations.updateItem(source, {
        name: inputProps.name,
        isChecked: inputProps.isChecked,
        uuid: inputProps.uuid
      })
      mutations.createItem(direction, {
        name: inputProps.name,
        isActive: false,
        uuid: inputProps.uuid
      })
    }
  }
  if (source === 'C' && direction === 'A') {
    mutations.deleteItem('B', inputProps)
    mutations.deleteItem('C', inputProps)
    mutations.updateItem(direction, {
      name: inputProps.name,
      isChecked: false,
      uuid: inputProps.uuid
    })
  }

  currentColumn.value = ''
}

function handleDragEnter(e: any) {
  const currentColumnName = e.currentTarget.id
  if (currentColumnName === columnName) {
    currentColumn.value = columnName
  }
}

function handleDragLeave(e: any) {
  const currentColumnName = e.currentTarget.id
  if (currentColumnName === columnName) {
    currentColumn.value = ''
  }
}


function setFocusColumn() {
  if (!focusedColumnName && columnName === undefined) return;
  focusedColumnName.value = columnName
}
</script>

<template>
  <section @drop="onDrop" @dragover.prevent @click="setFocusColumn">
    <h1>{{ columnName }}</h1>
    <div class="wrapper">
      <div v-if="$slots.objects" class="block">
        <slot name="objects" />
      </div>
      <div
        class="block"
        :id="columnName"
        :class="{ animate: isAnimated }"
        @dragenter.prevent="handleDragEnter"
        @dragleave.prevent="handleDragLeave"
      >
        <ColumnInputPicker :columnName="columnName" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  width: 100%;
  height: 100%;
  background-color: #6c72aa;
  overflow-y: hidden;

  &:nth-child(odd) {
    background-color: #5e6495;
  }

  h1 {
    color: #fff;
    text-align: center;
    font-weight: 900;
    border-bottom: 2px solid black;
    border-right: 2px solid black;
  }

  .wrapper {
    height: 100%;
    display: flex;

    .block {
      overflow-y: auto;
      height: 100%;
      display: block;
      width: 100%;
      border-right: 2px solid black;
    }
  }
}
.animate {
  position: relative;
  animation: drop 2s infinite;

  &::after {
    position: relative;
    z-index: 100;
    display: block;
    width: 100%;
    height: 100%;
    background: transparent;
    content: '';
  }

  @keyframes drop {
    0% {
      background-color: rgba(0, 0, 255, 0.226);
    }
    50% {
      background-color: rgba(0, 0, 255, 0.526);
    }
    100% {
      background-color: rgba(0, 0, 255, 0.226);
    }
  }
}
</style>
