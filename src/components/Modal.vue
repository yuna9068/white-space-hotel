<template lang="pug">
Teleport(to="body")
  .semi-transparent(:class="{'hide': !display}")
    .modal
      .modal__title {{ title }}
      .modal__body(:class="{ imgTick: !msg }") {{ msg }}
      .modal__footer
        button(@click="hide()") {{ btnText }}
</template>

<script>
export default {
  name: 'Modal',
  data() {
    return {
      display: false,
      title: '',
      msg: '',
      btnText: '',
    };
  },
  methods: {
    open({ title, msg, btnText }) {
      this.title = title;
      this.msg = msg;
      this.btnText = btnText;
      this.display = true;
    },
    hide() {
      this.display = false;
      this.title = '';
      this.msg = '';
      this.btnText = '';
    },
  },
};
</script>

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
