<template lang="pug">
.semi-transparent(:class="{'hide': !info.display}")
  .booking
    .booking__title 預約時段
    form.booking-form
      .booking-form__row
        label 姓名
        input(type="text" v-model="name")
        p {{ errorMsg.name }}
      .booking-form__row
        label 電話
        input(type="phone" v-model="phone")
        p {{ errorMsg.phone }}
      .booking-form__row
        label 預約起迄
        .booking-form__period
          input(disabled :value="formatDate(info.startDate)")
          span ~
          input(disabled :value="formatDate(info.endDate)")
      .booking-form__nights
        .booking-form__row
          span 平日時段
          span {{ info.weekday }}夜
        .booking-form__row
          span 假日時段
          span {{ info.holiday }}夜
      .booking-form__price =&nbsp;&nbsp;&nbsp;&nbsp;NT.{{ totalPrice }}
      .booking-form__buttons
        input(type="button" value="取消" @click="$emit('close')")
        input(
          type="submit"
          value="確定預約"
          :disabled="!checkUserInfo()"
          @click.prevent="reservation()"
        )
</template>

<script>
import DatePicker from '@/components/DatePicker.vue';

export default {
  nema: 'Booking',
  components: {
    DatePicker,
  },
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      name: '',
      phone: '',
      errorMsg: {
        name: '',
        phone: '',
      },
    };
  },
  created() {
    this.checkUserInfo();
  },
  methods: {
    // 轉換日期格式
    formatDate(date) {
      if (date) {
        return date.replace(/-0?/g, '/');
      }
      return '';
    },
    // 檢查使用者輸入資料
    checkUserInfo() {
      const checkName = this.checkUserName();
      const checkPhone = this.checkUserPhone();
      return checkName && checkPhone;
    },
    // 檢查姓名，只能輸入繁體中文、簡體中文或英文姓名
    checkUserName() {
      if (!this.name) {
        this.errorMsg.name = '請輸入中文或英文姓名';
        return false;
      }
      const nameReg = /^[\u4e00-\u9fa5a-zA-Z]+$/g;
      const nameMatch = this.name.match(nameReg);
      if (nameMatch.length > 0) {
        this.errorMsg.name = '';
      } else {
        this.errorMsg.name = '請輸入中文或英文姓名';
      }
      return nameMatch.length > 0;
    },
    // 檢查電話，
    // 市話格式： 區碼2~3碼，後面3碼加4碼 或 4碼加4碼，- 可加可不加
    // 手機格式： 共10碼，- 可加可不加
    checkUserPhone() {
      if (!this.phone) {
        this.errorMsg.phone = '請輸入手機或市話';
        return false;
      }
      const phoneReg = /(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}|09\d{2}(\d{6}|-\d{3}-?\d{3})/g;
      const phoneMatch = this.phone.match(phoneReg) || [];
      if (phoneMatch.length > 0) {
        this.errorMsg.phone = '';
      } else {
        this.errorMsg.phone = '手機或市話格式錯誤';
      }
      return phoneMatch.length > 0;
    },
    // 確定預約
    reservation() {
      if (!this.checkUserInfo()) {
        return;
      }

      this.$emit('reservation-room', { name: this.name, tel: this.phone });
    },
  },
  computed: {
    // 計算總費用
    totalPrice() {
      const totalWeekdayPrice = this.info.weekday * this.info.weekdayPrice;
      const totalHolidayPrice = this.info.holiday * this.info.holidayPrice;
      return totalWeekdayPrice + totalHolidayPrice;
    },
  },
};
</script>

<style lang="sass" scoped>
.booking
  margin: auto
  padding: 27px 43px 34px 42px
  width: 423px
  max-width: 90vw
  background: $primary-color
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5)
  overflow: hidden
  @include tablet()
    padding: 5%
  *
    font-weight: 500
  &__title
    font-size: 24px
    line-height: 36px
    letter-spacing: 2.5px
    margin-bottom: 50px
    position: relative
    &::before
      content: ''
      position: absolute
      bottom: -15px
      left: 0
      @include zebra-three-slashes

.booking-form
  &__row
    margin-bottom: 15px
    flex-wrap: wrap
    @include flex(space-between, center)
    label, input
      letter-spacing: 1.5px
    label
      width: 62px
      margin-right: 32px
      @media (max-width: 340px)
        margin-right: 17px
    input
      flex: auto
      padding: 7px 11px
      border: 1px solid #C9C9C9
      border-radius: 5px
    p
      height: 20px
      flex: 0 0 100%
      text-align: right
      font-size: $font-size-small
      color: #ff0000
  &__period
    flex: auto
    @include flex(space-between, center)
    input
      width: 100px
      flex-grow: 0
      font-size: $font-size-small
      letter-spacing: 1.3px
  &__nights
    background: #EDEDED
    padding: 15px 0
    position: relative
    &::before, &::after
      content: ''
      position: absolute
      width: 100px
      height: 100%
      background: inherit
      top: 0
    &::before
      left: 0
      transform: translateX(-100%)
    &::after
      right: 0
      transform: translateX(100%)
    .booking-form__row
      margin-bottom: 0
      span
        font-size: $font-size-small
        line-height: 18px
        letter-spacing: 1.3px
        color: $dark-grey
  &__price
    font-size: 26px
    color: #FF5C5C
    letter-spacing: 2.7px
    line-height: 38px
    text-align: right
    margin-top: 8px
    margin-bottom: 29px
  &__buttons
    @include flex(space-between, center)
    input
      padding: 8px 24px
      cursor: pointer
      &[type="button"]
        background: #D8D8D8
        color: $dark-grey
      &[type="submit"]
        background: #484848
        color: $primary-color
        &[disabled]
          cursor: not-allowed
          background: lighten(#484848, 65%)
</style>
