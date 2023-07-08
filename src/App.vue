<script setup>
import {
  provide,
  reactive,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import ModalItem from '@/components/ModalItem.vue';

const route = useRoute();
const transitionName = ref('');
const transitionMode = ref('');
const modalData = reactive({
  display: false,
  title: '',
  msg: '',
  btnText: '',
});

function open({ title, msg, btnText }) {
  modalData.display = true;
  modalData.title = title;
  modalData.msg = msg;
  modalData.btnText = btnText;
}

function close() {
  modalData.display = false;
  modalData.title = '';
  modalData.msg = '';
  modalData.btnText = '';
}

watch(() => route, (to) => {
  const isSafari = (window.navigator.userAgent.toLowerCase().indexOf('safari') > -1
  && window.navigator.userAgent.toLowerCase().indexOf('chrome') < 0);
  if (!isSafari) {
    const toName = to.name;
    transitionName.value = toName === 'RoomDetail' ? 'viewTransition' : 'viewTransitionBack';
    transitionMode.value = toName === 'RoomDetail' ? 'in-out' : '';
  }
}, { deep: true });

provide('modal', {
  open,
  close,
});
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition
      :name="transitionName"
      :mode="transitionMode"
    >
      <component :is="Component" />
    </transition>
  </router-view>
  <ModalItem
    :data="modalData"
    @close="close"
  />
</template>

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
