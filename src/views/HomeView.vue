<script setup>
import {
  computed,
  inject,
  onMounted,
  reactive,
  ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { apiGetRooms } from '@/api/index';
import useEventListener from '@/composables/useEventListener';
import MenuItem from '@/components/MenuItem.vue';
import RoomGrid from '@/components/RoomGrid.vue';
import ThanksItem from '@/components/ThanksItem.vue';

const router = useRouter();
const modal = inject('modal');
const rooms = reactive([]); // 所有房型
const menuList = reactive([]); // 選單清單
const selectedRoomIndex = ref('01'); // 目前選中的房型 index
const selectedRoom = reactive({}); // 目前選中的房型資訊
const roomGridDisplay = ref(false); // 格狀房型資訊顯示狀態

const bgImage = computed(() => {
  if (roomGridDisplay.value) {
    const imgUrl = 'https://images.unsplash.com/photo-1519974719765-e6559eac2575?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80';
    return {
      backgroundImage: `url(${imgUrl})`,
    };
  }

  return {
    backgroundImage: selectedRoom.imageUrl ? `url(${selectedRoom.imageUrl})` : null,
  };
});

// 取得所有房型基本資訊
function fetchRoomsInfo() {
  apiGetRooms().then((response) => {
    if (response.data.success) {
      rooms.push(...JSON.parse(JSON.stringify(response.data.items)));
      menuList.push(...rooms.map((room) => ({ id: room.id, name: room.name })));
      selectedRoomIndex.value = '01';
      Object.assign(selectedRoom, rooms[0]);
    }
  }).catch((error) => {
    modal.openError(error.response?.data?.message);
  });
}

// 前往房型詳細資訊頁
function goRoomDetail(id) {
  sessionStorage.setItem('roomId', id);
  router.push({ name: 'RoomDetail' });
}

// 切換顯示房型照片及名稱
function changeRoom(id) {
  const index = rooms.findIndex((item) => item.id === id);
  selectedRoomIndex.value = `0${index + 1}`;
  Object.assign(selectedRoom, rooms[index]);
}

// 監聽視窗寬度
function layoutWidth() {
  if (window.innerWidth <= 768) {
    roomGridDisplay.value = true;
  } else {
    roomGridDisplay.value = false;
  }

  useEventListener(window, 'resize', () => {
    if (window.innerWidth <= 768) {
      roomGridDisplay.value = true;
    } else {
      roomGridDisplay.value = false;
    }
  });
}

layoutWidth();

onMounted(() => {
  fetchRoomsInfo();
});
</script>

<template lang="pug">
.home
  .main(:style="bgImage")
    h1.logo White Space Hotel
    MenuItem.menu(
      :menu-list="menuList"
      @change-room="changeRoom"
      @room-detail="goRoomDetail"
    )
    .type
      .type__index {{ selectedRoomIndex }}
      .type__name {{ selectedRoom.name }}
    .info
      ul.icon
        li
          a.icon__facebook(
            href="https://www.facebook.com"
            target="_blank"
            rel="noreferrer noopener"
            title="Facebook"
            aria-label="Facebook"
          )
        li
          a.icon__instagram(
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer noopener"
            title="Instagram"
            aria-label="Instagram"
          )
      ul.contact
        li.contact__phone 02-17264937
        li.contact__mail whitespace@whitespace.com.tw
        li.contact__address 台北市羅斯福路十段30號
  RoomGrid(
    v-if="roomGridDisplay"
    :rooms="rooms"
    @room-detail="goRoomDetail"
  )
  ThanksItem
</template>

<style lang="sass" scoped>
.home
  width: 100%
  height: 100%
  background: #ffffff
  overflow: scroll

.main
  width: 100%
  height: 100%
  position: relative
  background: center bottom / cover no-repeat
  transition: background 0.4s linear
  @include tablet()
    height: 60%
    flex-direction: column
    @include flex(center, center)

.logo
  position: absolute
  top: 47px
  left: 54px
  width: 162px
  height: 163px
  background: center / 100% url('~@/assets/images/home/logo_white.svg') no-repeat
  @include tablet()
    position: initial
    width: 120px
    height: 120px
    margin-bottom: 50px

.menu
  @include tablet()
    display: none
  &::before
    content: ''
    position: absolute
    bottom: -20px
    left: 24px
    width: calc(100% - 24px)
    height: 20px
    @include zebra-white

.type
  position: absolute
  bottom: 71px
  left: 68px
  @include tablet()
    display: none
  *
    color: $primary-color
    font-weight: 400
  &__index
    font-size: 66px
    line-height: 98px
    position: relative
    &::before
      content: ''
      position: absolute
      bottom: 10px
      left: -4px
      width: 86px
      height: 19px
      @include zebra-white
  &__name
    font-size: 24px
    line-height: 36px
    letter-spacing: 2.5px

.info
  width: fit-content
  position: absolute
  right: 30px
  bottom: 74px
  @media (max-height: 710px)
    right: 20%
  @include tablet()
    position: initial
    @include flex(center, center)
  .icon
    @include flex()
    margin-bottom: 49px
    @media (max-height: 710px)
      margin-bottom: 15px
    @include tablet()
      margin: 0
    li
      &:not(:last-child)
        margin-right: 10px
      a
        display: block
        width: 20px
        height: 20px
    &__facebook
      background: url('~@/assets/images/home/facebook-square-brands.svg') no-repeat
    &__instagram
      background: url('~@/assets/images/home/instagram-brands.svg') no-repeat

  .contact
    @include tablet()
      margin-left: 30px
      position: relative
      &::after
        content: ''
        position: absolute
        top: 5%
        left: -16px
        width: 1px
        height: 90%
        background: $primary-color
    li
      padding-left: 30px
      color: $primary-color
      font-weight: 400
      text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5)
      &:not(:last-child)
        margin-bottom: 16px
    &__phone
      background: left center/19px 19px url('~@/assets/images/home/phone-alt-solid.svg') no-repeat
    &__mail
      background: left center/19px 19px url('~@/assets/images/home/envelope-solid.svg') no-repeat
    &__address
      background: left center/19px 19px url('~@/assets/images/home/home-solid.svg') no-repeat
</style>
