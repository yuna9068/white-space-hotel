<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      display: false,
      title: '',
      msg: '',
      btnText: '',
    }),
  },
});
const emits = defineEmits(['close']);

function close() {
  emits('close');
}
</script>

<template lang="pug">
Teleport(to="body")
  .semi-transparent(:class="{'hide': !props.data.display}")
    .modal
      .modal__title {{ props.data.title }}
      .modal__body(:class="{ imgTick: !props.data.msg }") {{ props.data.msg }}
      .modal__footer
        button(@click="close") {{ props.data.btnText }}
</template>

<style lang="sass" scoped>
.modal
  width: 423px
  max-width: 90vw
  padding: 32px 42px
  background: $primary-color
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5)
  *
    font-weight: 500
  .modal__title
    font-size: 24px
    line-height: 36px
    letter-spacing: 2.5px
    margin-bottom: 31px
    position: relative
    &::before
      content: ''
      position: absolute
      bottom: -15px
      left: 0
      @include zebra-three-slashes
  .modal__body
    margin-bottom: 30px
    &.imgTick
      height: 60px
      background: top center / 60px url('~@/assets/images/modal/tick-inside-circle.svg') no-repeat
  .modal__footer
    @include flex(flex-end)
    button
      padding: 8px 24px
      background: #484848
      color: $primary-color
</style>
