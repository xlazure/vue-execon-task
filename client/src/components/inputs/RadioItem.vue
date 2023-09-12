<template>
  <div>Radio</div>
  {{ inputProps.name }}
</template>

<script lang="ts" setup>
const { inputProps, isDraggable } = defineProps(['inputProps', 'isDraggable'])
</script>

<style scoped></style>
