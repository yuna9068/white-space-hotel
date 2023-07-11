<script setup>
import {
  apiGetRoomDetail,
  apiPostReserveRoom,
  apiDeleteAllReservations,
} from '@/api/index';
import DatePicker from '@/components/DatePicker.vue';
import LightboxItem from '@/components/LightboxItem.vue';
import BookingItem from '@/components/BookingItem.vue';
import LoadingItem from '@/components/LoadingItem.vue';
import {
  computed,
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
} from 'vue';

const modal = inject('modal');
const refDatePicker = ref(null);
const roomId = ref(''); // 房型編號
const room = reactive({}); // 房型資訊
let bookedInfo = reactive([]); // 已預訂資料
let bookedDates = reactive({}); // 已預訂日期
const totalDates = reactive([]); // 使用者選擇的所有日期
const lightboxInfo = reactive({ // 照片大圖顯示資訊
  name: '',
  photo: [],
  photoIndex: 0,
  display: false,
});
const bookingInfo = reactive({ // 預定時段彈窗顯示資訊
  display: false,
  weekday: 0,
  holiday: 0,
  weekdayPrice: 0,
  holidayPrice: 0,
  startDate: '',
  endDate: '',
});
const loadingDisplay = ref(false);
const dots = reactive({
  display: false,
  nowUrl: '',
  nowIndex: 0,
});

// 主要照片
const primaryPhoto = computed(() => {
  if (dots.display) {
    if (!dots.nowUrl) {
      [dots.nowUrl] = room.imageUrl;
    }
    return dots.nowUrl;
  }
  return room.imageUrl[0];
});

// 床型文字轉換
const bedType = computed(() => {
  const bed = room.descriptionShort.Bed || [];
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
});

// 顯示/隱藏 Loading
function showLoading(show) {
  loadingDisplay.value = show;
}

// 顯示/隱藏 Booking
function showBooking(show) {
  bookingInfo.display = show;
}

// 取得房型詳細資訊
function fetchRoomDetail() {
  apiGetRoomDetail(roomId.value).then(async (response) => {
    showLoading(false);
    if (response.data.success) {
      Object.assign(room, response.data.room[0]);
      bookedInfo = response.data.booking;
      bookedDates = {};
      const today = new Date().toISOString().substring(0, 10).replaceAll('-', '');
      bookedInfo.forEach((booking) => {
        if (booking.date.replaceAll('-', '') >= today) {
          bookedDates[booking.date] = '';
        }
      });
    }

    await nextTick();

    refDatePicker.value.initDatePicker();
  }).catch((error) => {
    modal.openError(error.response?.data?.message);
  });
}

// 取得使用者選擇的預約日期
function getSelectedDate({ weekday, holiday, dates }) {
  bookingInfo.weekday = weekday;
  bookingInfo.holiday = holiday;
  bookingInfo.weekdayPrice = room.normalDayPrice;
  bookingInfo.holidayPrice = room.holidayPrice;
  [bookingInfo.startDate] = dates;
  bookingInfo.endDate = dates[dates.length - 1];
  totalDates.push(...dates);
}

// 確認使用者已選擇預約日期
async function checkSelectedDate() {
  await refDatePicker.value.getSelectedDate();

  if (totalDates.length > 0) {
    showBooking(true);
  } else {
    modal.open({
      title: '提示訊息',
      msg: '請選擇預約起迄日期',
      btnText: '關閉',
    });
  }
}

// 預約房間
function fetchReserveRoom({ name, tel }) {
  showBooking(false);
  showLoading(true);

  apiPostReserveRoom(roomId.value, {
    name,
    tel,
    date: totalDates,
  }).then((response) => {
    if (response.data.success) {
      fetchRoomDetail();
      modal.open({
        title: '預約成功',
        msg: '',
        btnText: '回頁面',
      });
    }
  }).catch((error) => {
    fetchRoomDetail();
    modal.openError(error.response?.data?.message);
  });
}

// 取消所有預約
function fetchCancelAllReservations() {
  apiDeleteAllReservations().finally(() => fetchRoomDetail());
}

// 顯示/隱藏 Lightbox
function showLightbox(show, i = 0) {
  lightboxInfo.name = room.name;
  lightboxInfo.photo = room.imageUrl;
  if (dots.display) {
    lightboxInfo.photoIndex = dots.nowIndex;
  } else {
    lightboxInfo.photoIndex = i;
  }
  lightboxInfo.display = show;
}

// 監聽視窗寬度
function layoutWidth() {
  if (window.innerWidth <= 768) {
    dots.display = true;
  } else {
    dots.display = false;
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      dots.display = true;
    } else {
      dots.display = false;
    }
  });
}

// 點圓點切換顯示照片
function changeImage(url, i) {
  if (dots.display) {
    dots.nowUrl = url;
    dots.nowIndex = i;
  }
}

onMounted(() => {
  layoutWidth();
  showLoading(true);
  roomId.value = sessionStorage.getItem('roomId');
  fetchRoomDetail();
});
</script>

<template lang="pug">
.roomDetail
  router-link(to="/")
    h1.logo White Space Hotel
  .photo(v-if="room.imageUrl")
    .photo__img.photo__primary(
      :style="{'background-image': `url(${primaryPhoto})`}"
      @click="showLightbox(true, 0)"
      @keyup="showLightbox(true, 0)"
    )
    ul.photo__dots(v-if="dots.display")
      li(
        v-for="(url, i) in room.imageUrl"
        :key="`img${i}`"
        :class="{'photo__dots--selected': url === dots.nowUrl}"
        @click="changeImage(url, i)"
        @keyup="changeImage(url, i)"
      )
    .photo__secondary-block(v-else)
      .photo__img.photo__secondary(
        :style="{'background-image': `url(${room.imageUrl[1]})`}"
        @click="showLightbox(true, 1)"
        @keyup="showLightbox(true, 1)"
      )
      .photo__img.photo__secondary(
        :style="{'background-image': `url(${room.imageUrl[2]})`}"
        @click="showLightbox(true, 2)"
        @keyup="showLightbox(true, 2)"
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
          ref="refDatePicker"
          :mark-dates="bookedDates"
          @get-selected-date="getSelectedDate"
        )
      .reservation__buttons
        button.reservation__check(@click="checkSelectedDate") 預約時段
        button.reservation__delete(@click="fetchCancelAllReservations") 取消所有預約

  LightboxItem(
    :info="lightboxInfo"
    @close="showLightbox(false)"
  )

  BookingItem(
    :info="bookingInfo"
    @close="showBooking(false)"
    @reservation-room="fetchReserveRoom"
  )

  LoadingItem(:display="loadingDisplay")
</template>

<style lang="sass" scoped>
.roomDetail
  width: 100%
  height: 100%
  background: #ffffff
  overflow: scroll

.logo
  position: absolute
  top: 32px
  left: 49px
  width: 164px
  height: 53px
  background: url('~@/assets/images/roomDetail/logo_block.svg') no-repeat
  z-index: 10

.photo
  height: 596px
  box-shadow: 0 5px 10px 0px rgba(#cccccc, 30%)
  position: relative
  @include flex()
  @include phone()
    height: 60vh
  > *
    height: 100%
  .photo__img
    // background: center / cover no-repeat
    background: center / 100% 100% no-repeat
    transition: background 0.4s linear
    &:hover
      cursor: pointer
      filter: brightness(90%)
      transition: all 0.3s ease-in
  &__dots
    width: 150px
    height: fit-content
    position: absolute
    bottom: 30px
    left: 50%
    transform: translateX(-50%)
    @include flex(space-between)
    li
      width: 20px
      height: 20px
      border-radius: 50%
      background: $primary-color
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5)
      cursor: pointer
      &.photo__dots--selected
        background: #ADE8C6
  &__primary
    width: 70%
    height: 100%
    @include tablet()
      width: 100%
  &__secondary-block
    width: 30%
    flex-direction: column
    @include flex()
    .photo__secondary
      height: 50%
      width: 100%

.detail
  padding: 47px 62px 69px 72px
  flex-wrap: wrap
  @include flex(space-between)
  @include tablet()
    padding: 47px 10% 69px 10%
  .room
    width: 60%
    @include tablet()
      width: 100%
  .reservation
    width: 35%
    @media (max-width: 900px)
      width: 40%
    @include tablet()
      width: 100%
      margin-top: 30px

.room
  @include flex()
  flex-wrap: wrap
  .room-info
    width: 80%
    @include tablet()
      width: 100%
  .room-price
    width: 20%
    @media (max-width: 900px)
      width: 80%
    @include tablet()
      width: 100%
  .room-time
    width: 80%
    @include tablet()
      width: 100%
  .room-amenities
    width: 80%
    @include tablet()
      width: 100%

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
      color: $dark-grey
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
    @include phone-small()
      margin-right: 10%
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
    @include phone()
      width: 50%
      background-position: top left
  .not-provide
    opacity: 0.3
  .wifi
    background-image: url('~@/assets/images/roomDetail/wifi.svg')
  .television
    background-image: url('~@/assets/images/roomDetail/television.svg')
  .view
    background-image: url('~@/assets/images/roomDetail/mountain-range.svg')
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
  position: relative
  &__date-picker
    margin-bottom: 26px
  &__buttons
    @include flex(space-between, flex-end)
  &__check
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
  &__delete
    padding: 10px
    border-radius: 5px
    background: #F0F0F0
    color: #ffffff
    font-weight: 500
    display: none
</style>
