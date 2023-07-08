<script setup>
import { ref } from 'vue';

const thanksDisplay = ref(false);
</script>

<template lang="pug">
button.btn-thanks(@click="thanksDisplay = true") 特別感謝
.semi-transparent(v-show="thanksDisplay")
  .thanks
    .thanks__title 特別感謝以下人士提供的各項資源，我才能完成這個網站
    ul.thanks__list
      li
        a(
          href="https://challenge.thef2e.com/user/1600?schedule=3851#works-3851"
          target="_blank"
          rel="noreferrer noopener"
        ) UI 設計師 edith.hsu 的 UI 稿，並提供相關 icon 圖檔
      li
        a(
          href="https://challenge.thef2e.com/news/17"
          target="_blank"
          rel="noreferrer noopener"
        ) 六角學院提供旅館 API 服務
      li
        a(
          href="https://www.flaticon.com/free-icon/sofa_494967"
          target="_blank"
          rel="noreferrer noopener"
        ) Flaticon 網站上由 Pixel perfect 製作的 sofa.svg
      li
        a(
          href="https://www.flaticon.com/free-icon/television_637274"
          target="_blank"
          rel="noreferrer noopener"
        ) Flaticon 網站上由 Pixel perfect 製作的 Television.svg
    .thanks__close(
      @click.self="thanksDisplay = false"
      @keyup="thanksDisplay = false"
    ) &times;
</template>

<style lang="sass" scoped>
.btn-thanks
  position: absolute
  right: 10px
  bottom: 10px
  padding: 10px
  border-radius: 50%
  background: transparent
  color: $primary-color
  letter-spacing: 1.5px
  text-shadow: 1px 1px 4px $dark-grey
  overflow: hidden
  @include tablet()
    top: 10px
    bottom: initial
  &::before
    content: ''
    position: absolute
    top: 50%
    left: 50%
    width: 80px
    height: 80px
    border-radius: 50%
    background: $primary-color
    transform: translate(-50%, -50%) scale(0)
  &::before
    animation: aniCircle 5s ease-in-out infinite
@keyframes aniCircle
  0%
    transform: translate(-50%, -50%) scale(0.1)
    opacity: 0.1
  50%
    opacity: 0.4
  100%
    transform: translate(-50%, -50%) scale(1.2)
    opacity: 0

.thanks
  position: relative
  max-width: 90vw
  padding: 20px 30px
  border-radius: 5px
  background: $primary-color
  &__title
    text-align: center
    font-size: 20px
    font-weight: 500
    line-height: 1.5
    margin-bottom: 20px
  &__list
    li
      padding-left: 23px
      text-indent: -23px
      &::before
        content: '➤'
        color: darken(#87cefa, 30%)
        margin-right: 10px
      &:not(:last-child)
        margin-bottom: 10px
      a
        font-size: 14px
        font-weight: 400
        color: darken(#87cefa, 30%)
        &:hover
          color: #87cefa
  &__close
    position: absolute
    top: 5px
    right: 10px
    font-size: 18px
    cursor: pointer
    user-select: none
    color: $dark-grey
    text-shadow: 1px 1px 2px lighten($dark-grey, 40%)
</style>
