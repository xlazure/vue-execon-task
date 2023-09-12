<template>
  <span>
    <input
      :id="'r' + index"
      type="radio"
      name="radio"
      @click="handleClick"
      :checked="inputProps.isActive"
    />
    <label :for="'r' + index" :draggable="isDraggable" >
      <span class="custom-button">
        {{ inputProps.name }}
      </span>
    </label>
  </span>
</template>

<script lang="ts" setup>
import useColumnStore from '@/store/columnStore';

const { inputProps, isDraggable,index } = defineProps(['inputProps', 'isDraggable','index'])
const { actions, mutations } = useColumnStore()

function handleClick() {
  actions.selectActiveItemFormColumn('B',inputProps)
  mutations.setColumn('C',inputProps)
}
</script>

<style lang="scss" scoped>
label {
  user-select: none;
  overflow: hidden;
  float: left;
  margin: 0.1rem;
  background-color: #000;
  color: #fff;
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

input:checked + label {
  background-color: rgb(242, 255, 0);
  color: #000;
}
</style>
