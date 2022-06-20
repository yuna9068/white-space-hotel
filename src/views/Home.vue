<template lang="pug">
.home
  .main(:style="bgImage")
    h1.logo White Space Hotel
    Menu.menu(:menuList="menuList" @change-room="changeRoom" @room-detail="goRoomDetail")
    .type
      .type__index {{ selectedRoomIndex }}
      .type__name {{ selectedRoom.name }}
    .info
      ul.icon
        li
          a.icon__facebook(href="https://www.facebook.com" target="_blank" rel="noreferrer noopener" title="Facebook")
        li
          a.icon__instagram(href="https://www.instagram.com" target="_blank" rel="noreferrer noopener" title="Instagram")
      ul.contact
        li.contact__phone 02-17264937
        li.contact__mail whitespace@whitespace.com.tw
        li.contact__address 台北市羅斯福路十段30號
  RoomGrid(v-if="roomGridDisplay" :rooms="rooms" @room-detail="goRoomDetail")
  Thanks
</template>

<script>
import Menu from '@/components/Menu.vue';
import RoomGrid from '@/components/RoomGrid.vue';
import Thanks from '@/components/Thanks.vue';

export default {
  name: 'Home',
  components: {
    Menu,
    RoomGrid,
    Thanks,
  },
  data() {
    return {
      rooms: [], // 所有房型
      menuList: [], // 選單清單
      selectedRoomIndex: '01', // 目前選中的房型 index
      selectedRoom: {}, // 目前選中的房型資訊
      roomGridDisplay: false, // 格狀房型資訊顯示狀態
    };
  },
  created() {
    this.getRoomsInfo();
    this.layoutWidth();
  },
  methods: {
    // 取得所有房型基本資訊
    getRoomsInfo() {
      this.$axios({
        method: 'get',
        url: 'rooms',
      }).then((response) => {
        if (response.data.success) {
          this.rooms = JSON.parse(JSON.stringify(response.data.items));
          this.menuList = this.rooms.map((room) => ({ id: room.id, name: room.name }));
          this.selectedRoomIndex = '01';
          [this.selectedRoom] = [...this.rooms];
        }
      }).catch((error) => {
        let errorMsg = '系統異常，請重新整理頁面後再試';
        if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
        this.$modal.open({
          title: '系統異常',
          msg: errorMsg,
          btnText: '關閉',
        });
      });
    },
    // 前往房型詳細資訊頁
    goRoomDetail(id) {
      sessionStorage.setItem('roomId', id);
      this.$router.push({ name: 'RoomDetail' });
    },
    // 切換顯示房型照片及名稱
    changeRoom(id) {
      const index = this.rooms.findIndex((item) => item.id === id);
      this.selectedRoomIndex = `0${index + 1}`;
      this.selectedRoom = this.rooms[index];
    },
    // 監聽視窗寬度
    layoutWidth() {
      if (window.innerWidth <= 768) {
        this.roomGridDisplay = true;
      } else {
        this.roomGridDisplay = false;
      }
      window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
          this.roomGridDisplay = true;
        } else {
          this.roomGridDisplay = false;
        }
      });
    },
  },
  computed: {
    bgImage() {
      if (this.roomGridDisplay) {
        const imgUrl = 'https://images.unsplash.com/photo-1519974719765-e6559eac2575?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80';
        return {
          backgroundImage: `url(${imgUrl})`,
        };
      }
      return {
        backgroundImage: `url(${this.selectedRoom.imageUrl})`,
      };
    },
  },
};
</script>

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
