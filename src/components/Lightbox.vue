<template lang="pug">
.lightbox.semi-transparent(:class="{'hide': !info.lightboxDisplay}" @click.self="$emit('close')")
  .lightbox__arrow-left(
    :class="{'lightbox__arrow--disabled': nowIndex === 0}"
    @click.stop="changePhoto(nowIndex - 1)"
  ) &lt;
  .lightbox__photo
    .photo__display
     img(:src="info.photo[nowIndex]" :alt="`${info.name} Photo`")
    .photo__desc
      .photo__desc-name {{ info.name }}
      .photo__desc-qty {{ nowIndex + 1 }}/{{ info.photo.length }}
  .lightbox__arrow-right(
    :class="{'lightbox__arrow--disabled': nowIndex === info.photo.length - 1}"
    @click.stop="changePhoto(nowIndex + 1)"
  ) &gt;
</template>

<script>
export default {
  name: 'Lightbox',
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      nowIndex: 0,
    };
  },
  created() {
    this.nowIndex = this.info.photoIndex;
  },
  methods: {
    changePhoto(index) {
      if (index > -1 && index < this.info.photo.length) {
        this.nowIndex = index;
      }
    },
  },
  watch: {
    // eslint-disable-next-line
    'info.photoIndex': function (newValue) {
      this.nowIndex = newValue;
    },
  },
};
</script>

<style lang="sass" scoped>
.lightbox
  padding: 8% 10%
  @include flex(center, center)
  &__arrow-left, &__arrow-right
    color: $primary-color
    font-size: 38px
    transform: scaleY(3)
    cursor: pointer
    user-select: none
  &__arrow--disabled
    opacity: 0.5
    cursor: not-allowed
  &__photo
    margin: 0 80px

.photo
  &__display
    box-shadow: 0 2px 9px 0 rgba(0,0,0,0.50)
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
</style>
