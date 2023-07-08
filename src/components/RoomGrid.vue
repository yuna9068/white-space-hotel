<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  rooms: {
    type: Array,
    default: () => [],
  },
});
const { rooms } = toRefs(props);
const emits = defineEmits(['room-detail']);

function showDetail(id) {
  emits('room-detail', id);
}

function bgImage(imageUrl) {
  return {
    backgroundImage: `url(${imageUrl})`,
  };
}

function roomNameChi(name) {
  switch (name) {
    case 'Single Room':
      return '單人房';
    case 'Deluxe Single Room':
      return '豪華單人房';
    case 'Double Room':
      return '雙人房';
    case 'Deluxe Double Room':
      return '豪華雙人房';
    case 'Twin Room':
      return '雙床雙人房';
    case 'Deluxe Twin Room':
      return '豪華雙床雙人房';
    default:
      return '房';
  }
}
</script>

<template lang="pug">
.roomGrid
  .room(
    v-for="room in rooms"
    :key="room.id"
    @click="showDetail(room.id)"
    @keyup="showDetail(room.id)"
  )
    .room-img(:style="bgImage(room.imageUrl)")
    ul.room-info
      li.room-info__name-eng {{ room.name }}
      li.room-info__name-chi {{ roomNameChi(room.name) }}
      li.room-info__price NT.{{ room.normalDayPrice }}&nbsp;
        span.price-weekday 平日
        span.price-holiday NT.{{ room.holidayPrice }} 假日
</template>

<style lang="sass" scoped>
.roomGrid
  width: 85vw
  margin: auto
  transform: translateY(-10vw)
  @include flex(space-between)
  flex-wrap: wrap
  .room
    width: 40vw
    height: 45vw
    margin-bottom: 58px
    background: #F7F7F7
    box-shadow: 2px 2px 9px 0 rgba(0, 0, 0, 0.18)
    cursor: pointer
    overflow: hidden
    flex-direction: column
    @include flex(flex-start, center)
    @include phone()
      width: 85vw
      height: 100vw
    &-img
      width: 100%
      height: 70%
      background: center bottom / cover no-repeat
    &-info
      width: 100%
      padding: 5% 6%
      &__name-eng
        letter-spacing: 1.5px
      &__name-chi, .price-weekday, .price-holiday
        font-size: $font-size-small
        line-height: 18px
        letter-spacing: 1.3px
      &__name-chi
        color: $dark-grey
      &__price
        margin-top: 5%
        font-size: 16px
        line-height: 30px
        letter-spacing: 1.5px
        &::after
          content: ""
          display: block
          height: 0 // 避免可能會有繼承字體大小或多了空白或其他問題
          clear: both
        .price-holiday
          color: $dark-grey
          float: right
          line-height: 30px
</style>
