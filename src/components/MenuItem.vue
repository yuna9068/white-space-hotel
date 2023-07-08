<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  menuList: {
    type: Array,
    default: () => [],
  },
});
const { menuList } = toRefs(props);
const emits = defineEmits(['change-room', 'room-detail']);

function changeRoom(id) {
  emits('change-room', id);
}

function roomDetail(id) {
  emits('room-detail', id);
}
</script>

<template lang="pug">
ul
  li(
    v-for="room in menuList"
    :key="room.id"
    @mouseover="changeRoom(room.id)"
    @focus="changeRoom(room.id)"
    @click="roomDetail(room.id)"
    @keyup="roomDetail(room.id)"
  ) {{ room.name }}
</template>

<style scoped lang="sass">
ul
  position: absolute
  top: 49px
  right: 0
  width: 25%
  padding: 37px 34px 25px
  background: $primary-color
  li
    letter-spacing: 1.5px
    margin-bottom: 37px
    cursor: pointer
    position: relative
    &:hover
      &::before
        content: ''
        position: absolute
        top: 50%
        left: -34px
        transform: translateY(-50%)
        width: 23px
        height: 1px
        background: $secondary-color
</style>
