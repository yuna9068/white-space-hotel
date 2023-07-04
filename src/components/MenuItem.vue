<template lang="pug">
ul
  li(
    v-for="room in menuList"
    :key="room.id"
    @mouseover="$emit('change-room', room.id)"
    @click="$emit('room-detail', room.id)"
  ) {{ room.name }}
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    menuList: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

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
