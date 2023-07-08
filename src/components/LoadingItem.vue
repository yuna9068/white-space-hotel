<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  display: {
    type: Boolean,
    default: false,
  },
});
const { display } = toRefs(props);
</script>

<template lang="pug">
.semi-transparent(:class="{'hide': !display}")
  ul.circle
    li
    li
    li
    li
    li
</template>

<style lang="sass" scoped>
#app
  .semi-transparent
    background: rgba(#ffffff, 0.5)
ul
  @include flex(center, cneter)
  li
    width: 20px
    height: 20px
    margin-right: 20px
    border-radius: 50%
    background: #ADE8C6
    @for $i from 1 through 5
      &:nth-child(#{$i})
        animation: circle 1s #{$i * 0.2}s infinite alternate both

@keyframes circle
  0%
    transform: scale(0, 0)
  100%
    transform: scale(1, 1)
</style>
