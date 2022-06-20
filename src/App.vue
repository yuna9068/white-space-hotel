<template>
  <router-view v-slot="{ Component }">
    <transition
      :name="transitionName"
      :mode="transitionMode"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      transitionName: '',
      transitionMode: '',
    };
  },
  watch: {
    // eslint-disable-next-line
    '$route'(to) {
      const isSafari = (window.navigator.userAgent.toLowerCase().indexOf('safari') > -1
        && window.navigator.userAgent.toLowerCase().indexOf('chrome') < 0);
      if (!isSafari) {
        const toName = to.name;
        this.transitionName = toName === 'RoomDetail' ? 'viewTransition' : 'viewTransitionBack';
        this.transitionMode = toName === 'RoomDetail' ? 'in-out' : '';
      }
    },
  },
};
</script>

<style lang="sass">
$viewTransition: transform 1s ease-in-out

@mixin viewTranslateX($val: 0%)
  z-index: 99
  transform: translateX($val)

#app
  width: 100vw
  height: 100vh
  background: #ffffff

.viewTransition, .viewTransitionBack
  &-enter-active, &-leave-active
    position: fixed
    width: 100%
    min-height: 100vh
    top: 0

// viewTransition - 進入頁面的開始
.viewTransition-enter-active
  transition: $viewTransition
  @include viewTranslateX(100%)

// viewTransition - 進入頁面的結束
.viewTransition-enter-to
  @include viewTranslateX(0%)

// viewTransition - 離開頁面的開始 & 結束
.viewTransition-leave-active,
.viewTransition-leave-to
  z-index: -1

// viewTransitionBack - 離開頁面的開始
.viewTransitionBack-leave-active
  transition: $viewTransition
  @include viewTranslateX(0%)

// viewTransitionBack - 離開頁面的結束
.viewTransitionBack-leave-to
  @include viewTranslateX(100%)
</style>
