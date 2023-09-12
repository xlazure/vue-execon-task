<template>
  <button :draggable="isDraggable">{{ inputProps.name }}</button>
</template>

<script lang="ts" setup>
const { inputProps, isDraggable } = defineProps(['inputProps', 'isDraggable'])
</script>

<style scoped></style>
