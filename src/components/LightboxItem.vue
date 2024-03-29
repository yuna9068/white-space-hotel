<script setup>
import {
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue';

const props = defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
});
const { info } = toRefs(props);
const emits = defineEmits(['close']);
const nowIndex = ref(0);

function close() {
  emits('close');
}

function changePhoto(index) {
  if (index > -1 && index < info.value.photo.length) {
    nowIndex.value = index;
  }
}

watch(() => info.value.photoIndex, (newValue) => {
  nowIndex.value = newValue;
});

onMounted(() => {
  nowIndex.value = info.value.photoIndex;
});
</script>

<template lang="pug">
.semi-transparent(:class="{'hide': !info.display}")
  .lightbox
    .lightbox__arrow-left(
      :class="{'lightbox__arrow--disabled': nowIndex === 0}"
      @click.stop="changePhoto(nowIndex - 1)"
      @keyup="changePhoto(nowIndex - 1)"
    ) &LeftAngleBracket;
    .lightbox__photo
      .photo__display
        img(
          :src="info.photo[nowIndex]"
          :alt="`${info.name} Photo`"
        )
      .photo__desc
        .photo__desc-name {{ info.name }}
        .photo__desc-qty {{ nowIndex + 1 }}/{{ info.photo.length }}
      .photo__close(
        @click.self="close"
        @keyup="close"
      ) &times;
    .lightbox__arrow-right(
      :class="{'lightbox__arrow--disabled': nowIndex === info.photo.length - 1}"
      @click.stop="changePhoto(nowIndex + 1)"
      @keyup="changePhoto(nowIndex + 1)"
    ) &RightAngleBracket;
</template>

<style lang="sass" scoped>
$text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5)

.lightbox
  padding: 8% 10%
  position: relative
  @include flex(center, center)
  @include tablet()
    padding: 5%
  &__arrow-left, &__arrow-right
    color: $primary-color
    font-size: 38px
    transform: scale(2, 1.2)
    cursor: pointer
    user-select: none
    text-shadow: $text-shadow
    @include tablet()
      position: absolute
      top: calc(50% - 20px)
  &__arrow-left
    @include tablet()
      left: 7%
      z-index: 1
  &__arrow-right
    @include tablet()
      right: 7%
  &__arrow--disabled
    opacity: 0.5
    cursor: not-allowed
  &__photo
    margin: 0 80px
    position: relative
    @include tablet()
      margin: 0

.photo
  &__display
    box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.5)
    margin-bottom: 19px
    @include flex(center, center)
    img
      max-height: 80vh
  &__desc
    @include flex(space-between)
    &-name, &-qty
      font-weight: 500
      color: $primary-color
      letter-spacing: 1.7px
      text-shadow: $text-shadow
  &__close
    position: absolute
    top: 15px
    right: 15px
    font-size: 28px
    font-weight: 500
    color: $primary-color
    user-select: none
    cursor: pointer
    text-shadow: $text-shadow
</style>
