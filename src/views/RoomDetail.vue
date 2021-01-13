<template lang="pug">
router-link(to="/")
  h1.logo White Space Hotel
.photo(v-if="room.imageUrl")
  img.photo__primary(
    :src="room.imageUrl[0]"
    :alt="`${room.name} Photo`"
    @click="showLightbox(true, 0)"
  )
  .photo__secondary-block
    img.photo__secondary(
      :src="room.imageUrl[1]"
      :alt="`${room.name} Photo`"
      @click="showLightbox(true, 1)"
    )
    img.photo__secondary(
      :src="room.imageUrl[2]"
      :alt="`${room.name} Photo`"
      @click="showLightbox(true, 2)"
    )
.detail(v-if="room.name")
  .room
    .room-info
      .room-info__title {{ room.name }}
      ul.room-info__list
        li 房客人數限制： {{ room.descriptionShort.GuestMin }}~{{ room.descriptionShort.GuestMax }} 人
        li 床型：{{ bedType }}
        li 衛浴數量： {{ room.descriptionShort['Private-Bath'] }} 間
        li 房間大小： {{ room.descriptionShort.Footage }} 平方公尺
      .room-info__desc {{ room.description }}
    ul.room-price
      li NT.{{ room.normalDayPrice }}
      li 平日(一~四)
      li NT.{{ room.holidayPrice }}
      li 假日(五~日)
    .room-time
      div
        p Check In
        p {{ room.checkInAndOut.checkInEarly }} - {{ room.checkInAndOut.checkInLate }}
      div
        p Check Out
        p {{ room.checkInAndOut.checkOut }}
    ul.room-amenities
      li.wifi(:class="{'not-provide': !room.amenities['Wi-Fi']}") Wi-Fi
      li.television(:class="{'not-provide': !room.amenities.Television}") 電視
      li.view(:class="{'not-provide': !room.amenities['Great-View']}") 漂亮的視野
      li.breakfast(:class="{'not-provide': !room.amenities.Breakfast}") 早餐
      li.airConditioner(:class="{'not-provide': !room.amenities['Air-Conditioner']}") 空調
      li.smoke(:class="{'not-provide': !room.amenities['Smoke-Free']}") 禁止吸煙
      li.bar(:class="{'not-provide': !room.amenities['Mini-Bar']}") Mini Bar
      li.refrigerator(:class="{'not-provide': !room.amenities.Refrigerator}") 冰箱
      li.child(:class="{'not-provide': !room.amenities['Child-Friendly']}") 適合兒童
      li.roomService(:class="{'not-provide': !room.amenities['Room-Service']}") Room Service
      li.sofa(:class="{'not-provide': !room.amenities.Sofa}") 沙發
      li.dog(:class="{'not-provide': !room.amenities['Pet-Friendly']}") 寵物攜帶
  .reservation
    .reservation__date-picker
      DatePicker(
        :markDates="bookedDates"
        @get-selected-date="getSelectedDate"
        ref="DatePicker"
      )
    button.reservation__button(@click="checkSelectedDate()") 預約時段

Lightbox(
  :info="lightboxInfo"
  @close="showLightbox(false)"
)

Booking(
  :info="bookingInfo"
  @close="showBooking(false)"
  @reservation-room="reservationRoom"
)
</template>

<script>
import DatePicker from '@/components/DatePicker.vue';
import Lightbox from '@/components/Lightbox.vue';
import Booking from '@/components/Booking.vue';

export default {
  name: 'RoomDetail',
  components: {
    DatePicker,
    Lightbox,
    Booking,
  },
  data() {
    return {
      roomId: '', // 房型編號
      room: {}, // 房型資訊
      bookedInfo: [], // 已預訂資料
      bookedDates: [], // 已預訂日期
      totalDates: [], // 使用者選擇的所有日期
      lightboxInfo: { // 照片大圖顯示資訊
        name: '',
        photo: [],
        photoIndex: 0,
        display: false,
      },
      bookingInfo: { // 預定時段彈窗顯示資訊
        display: false,
        weekday: 0,
        holiday: 0,
        weekdayPrice: 0,
        holidayPrice: 0,
        startDate: '',
        endDate: '',
      },
    };
  },
  created() {
    this.roomId = this.$route.params.roomId;
    this.getRoomDetail();
  },
  methods: {
    // 取得房型詳細資訊
    getRoomDetail() {
      this.$axios({
        method: 'get',
        url: `room/${this.roomId}`,
      }).then((response) => {
        if (response.data.success) {
          [this.room] = response.data.room;
          this.bookedInfo = response.data.booking;
          this.bookedInfo.forEach((booking) => {
            this.bookedDates[booking.date] = '';
          });
        } else {
          console.log(response.data);
        }
      });
    },
    // 取得使用者選擇的預約日期
    getSelectedDate({ weekday, holiday, totalDates }) {
      this.bookingInfo.weekday = weekday;
      this.bookingInfo.holiday = holiday;
      this.bookingInfo.weekdayPrice = this.room.normalDayPrice;
      this.bookingInfo.holidayPrice = this.room.holidayPrice;
      [this.bookingInfo.startDate] = totalDates;
      this.bookingInfo.endDate = totalDates[totalDates.length - 1];
      this.totalDates = totalDates;
    },
    // 確認使用者已選擇預約日期
    checkSelectedDate() {
      this.$refs.DatePicker.getSelectedDate();
      if (this.totalDates.length > 0) {
        this.showBooking(true);
      } else {
        this.$modal.open({
          title: '提示訊息',
          msg: '請選擇預約起迄日期',
          btnText: '關閉',
        });
      }
    },
    reservationRoom({ name, tel }) {
      console.log('name', name);
      console.log('tel', tel);
      this.showBooking(false);

      // this.$axios({
      //   method: 'post',
      //   url: `room/${this.roomId}`,
      //   params: {
      //     name,
      //     tel,
      //     totalDates,
      //   },
      // }).then((response) => {
      //   if (response.data.success) {
      //     this.$modal.open({
      //       title: '預約成功',
      //       msg: '',
      //       btnText: '回頁面',
      //     });
      //   } else {
      //     this.$modal.open({
      //       title: '預約失敗',
      //       msg: response.data,
      //       btnText: '返回',
      //     });
      //   }
      // });
    },
    // 顯示/隱藏 Lightbox
    showLightbox(show, i = 0) {
      this.lightboxInfo.name = this.room.name;
      this.lightboxInfo.photo = this.room.imageUrl;
      this.lightboxInfo.photoIndex = i;
      this.lightboxInfo.display = show;
    },
    // 顯示/隱藏 Booking
    showBooking(show) {
      this.bookingInfo.display = show;
    },
  },
  computed: {
    // 床型文字轉換
    bedType() {
      const bed = this.room.descriptionShort.Bed || [];
      let bedQty = '1 張';
      if (bed.length > 1) {
        bedQty = `${bed.length} 張`;
      }
      switch (bed[0]) {
        case 'Single':
          return `${bedQty}單人床`;

        case 'Small Double':
          return `${bedQty}小型雙人床`;

        case 'Double':
          return `${bedQty}雙人床`;

        case 'Queen':
          return `${bedQty}加大雙人床`;

        default:
          return `${bedQty}床`;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.logo
  position: absolute
  top: 32px
  left: 49px
  width: 164px
  height: 53px
  background: url('~@/assets/images/roomDetail/logo_block.svg') no-repeat
  z-index: 99

.photo
  height: 596px
  box-shadow: 0 5px 10px 0px rgba(#cccccc, 30%)
  @include flex()
  > *
    height: 100%
  img
    object-fit: cover
    &:hover
      cursor: pointer
      filter: brightness(90%)
      transition: all .3s ease-in
  &__primary
    height: 100%
    width: 70%
  &__secondary-block
    width: 30%
    @include flex()
    flex-direction: column
    .photo__secondary
      height: 50%
      width: 100%

.detail
  padding: 47px 62px 69px 72px
  @include flex(space-between)
  .room
    width: 60%
  .reservation
    width: 35%

.room
  @include flex()
  flex-wrap: wrap
  .room-info
    width: 80%
  .room-price
    width: 20%
  .room-time
    width: 80%
  .room-amenities
    width: 80%

.room-info
  &__title
    font-size: 36px
    font-weight: 500
    line-height: 54px
    letter-spacing: 3.76px
    margin-bottom: 31px
  &__list
    margin-bottom: 15px
    li
      line-height: 31px
      letter-spacing: 1.5px
  &__desc
    font-size: $font-size-small
    letter-spacing: 1.3px

.room-price
  padding-top: 18px
  li
    text-align: right
    line-height: 27px
    &:nth-child(1)
      font-size: 30px
      letter-spacing: 3.1px
    &:nth-child(3)
      font-size: 16px
      letter-spacing: 1.7px
    &:nth-child(even)
      color: #6D7278
      letter-spacing: 1.5px
      margin-top: 5px
      margin-bottom: 14px

.room-time
  @include flex()
  position: relative
  margin-top: 65px
  margin-bottom: 40px
  &::before
    content: ''
    position: absolute
    top: -37px
    left: 0
    @include zebra-three-slashes
  div:first-child
    margin-right: 20%
  p
    &:first-child
      letter-spacing: 1.5px
    &:last-child
      letter-spacing: 2.2px
      font-size: 21px
      line-height: 31px

.room-amenities
  padding: 21px 26px 3px
  background: #F0F0F0
  @include flex()
  flex-wrap: wrap
  li
    width: 33%
    margin-bottom: 30px
    padding-left: 38px
    background: left center/20px 20px no-repeat
  .not-provide
    opacity: 0.3
  .wifi
    background-image: url('~@/assets/images/roomDetail/wifi.svg')
  .television
    background-image: url('~@/assets/images/roomDetail/television.svg')
  .view
    background-image: url('~@/assets/images/roomDetail/wifi.svg')
  .breakfast
    background-image: url('~@/assets/images/roomDetail/breakfast.svg')
  .airConditioner
    background-image: url('~@/assets/images/roomDetail/breeze.svg')
  .smoke
    background-image: url('~@/assets/images/roomDetail/no-smoke-symbol.svg')
  .bar
    background-image: url('~@/assets/images/roomDetail/bar.svg')
  .refrigerator
    background-image: url('~@/assets/images/roomDetail/refIcon.svg')
  .child
    background-image: url('~@/assets/images/roomDetail/crawling-baby-silhouette.svg')
  .roomService
    background-image: url('~@/assets/images/roomDetail/room_service.svg')
  .sofa
    background-image: url('~@/assets/images/roomDetail/sofa.svg')
  .dog
    background-image: url('~@/assets/images/roomDetail/dog.svg')

.reservation
  &__date-picker
    margin-bottom: 26px
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15)
  &__button
    width: 118px
    height: 53px
    font-weight: 400
    font-size: 16px
    line-height: 53px
    letter-spacing: 1.7px
    text-align: center
    color: $primary-color
    background: #575757
    position: relative
    &::before
      content: ""
      width: 118px
      height: 56px
      position: absolute
      top: 5px
      left: 6px
      z-index: -1
      @include zebra-black
</style>
