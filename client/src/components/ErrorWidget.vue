<template>
  <div class="error-wrapper">
    <div class="error-item" v-for="err in errors" :key="err.msg">
      <p>{{ err.msg }}</p>
      <button @click="mutations.deleteError(err)">X</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useColumnStore from '@/store/columnStore'
import { computed, watch } from 'vue'

const { getters, mutations } = useColumnStore()

const errors = computed(() => getters.getError())

watch(errors.value, (item) => {
  const length: number = errors.value.length

  if (length > 3) mutations.deleteError(item[length - 1])
})
</script>

<style lang="scss" scoped>
.error-wrapper {
  color: #000;
  position: absolute;
  bottom: 0.5em;
  right: 1em;
  width: 220px;
}

.error-item {
  background: #fc842e;
  padding: 4px;
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;

  p {
    font-weight: 700;
  }

  button {
    background-color: transparent;
    outline: none;
    border: none;
  }
}
</style>
