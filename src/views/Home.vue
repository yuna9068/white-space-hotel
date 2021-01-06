<template lang="pug">
.Home(:style="bgImage")
  h1.logo White Space Hotel
  Menu.menu(:menuList="menuList" @change-room="changeRoom" @room-detail="getRoomDetail")
  .type
    .type__index {{ selectedRoomIndex }}
    .type__name {{ selectedRoom.name }}
  .info
    ul.icon
      li
        a.icon__facebook(href="https://www.facebook.com" target="_blank" title="Facebook")
      li
        a.icon__instagram(href="https://www.instagram.com" target="_blank" title="Instagram")
    ul.contact
      li.contact__phone 02-17264937
      li.contact__mail whitespace@whitespace.com.tw
      li.contact__address 台北市羅斯福路十段30號
</template>

<script>
import Menu from '@/components/Menu.vue';

export default {
  name: 'Home',
  components: {
    Menu,
  },
  data() {
    return {
      rooms: [], // 所有房型
      menuList: [], // 選單清單
      selectedRoomIndex: '01', // 目前選中的房型 index
      selectedRoom: {}, // 目前選中的房型資訊
    };
  },
  created() {
    this.getRoomsInfo();
  },
  methods: {
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
        } else {
          console.log(response.data);
        }
      });
    },
    getRoomDetail(id) {
      this.$axios({
        method: 'get',
        url: `room/${id}`,
      }).then((response) => {
        if (response.data.success) {
          const room = JSON.stringify(response.data.room);
          const booking = JSON.stringify(response.data.booking);
          this.$router.push({ name: 'RoomDetail', params: { room, booking } });
        } else {
          console.log(response.data);
        }
      });
    },
    changeRoom(id) {
      const index = this.rooms.findIndex((item) => item.id === id);
      this.selectedRoomIndex = `0${index + 1}`;
      this.selectedRoom = this.rooms[index];
    },
  },
  computed: {
    bgImage() {
      return {
        backgroundImage: `url(${this.selectedRoom.imageUrl})`,
      };
    },
  },
};
</script>

<style lang="sass" scoped>
.Home
  width: 100%
  height: 100%
  position: relative
  background: center bottom/100% 100% no-repeat
  transition: background 0.4s linear

.logo
  position: absolute
  top: 47px
  left: 54px
  width: 162px
  height: 163px
  background: url('~@/assets/images/home/logo_white.svg') no-repeat

.menu
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
  position: absolute
  right: 30px
  bottom: 58px

  .icon
    @include flex()
    margin-bottom: 49px
    a
      margin-right: 10px
      display: block
      width: 20px
      height: 20px
    &__facebook
      background: url('~@/assets/images/home/facebook-square-brands.svg') no-repeat
    &__instagram
      background: url('~@/assets/images/home/instagram-brands.svg') no-repeat

  .contact
    li
      padding-left: 30px
      margin-bottom: 16px
      color: $primary-color
      font-weight: 400
    &__phone
      background: left center/19px 19px url('~@/assets/images/home/phone-alt-solid.svg') no-repeat
    &__mail
      background: left center/19px 19px url('~@/assets/images/home/envelope-solid.svg') no-repeat
    &__address
      background: left center/19px 19px url('~@/assets/images/home/home-solid.svg') no-repeat
</style>
