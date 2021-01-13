<template lang="pug">
.semi-transparent(:class="{'hide': !info.display}")
  .booking
    .booking__title 預約時段
    form.booking-form
      .booking-form__row
        label 姓名
        input(type="text" v-model="name")
      .booking-form__row
        label 電話
        input(type="phone" v-model="phone")
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
        input(type="submit" value="確定預約" :disabled="checkUserInfo()" @click.prevent="reservation()")
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
    };
  },
  methods: {
    formatDate(date) {
      if (date) {
        return date.replace(/-0?/g, '/');
      }
      return '';
    },
    // 檢查使用者輸入資料
    checkUserInfo() {
      const phoneReg = /(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}|09\d{2}(\d{6}|-\d{3}-?\d{3})/g;
      const phoneMatch = this.phone.match(phoneReg) || [];
      if (this.name.length > 0 && phoneMatch.length > 0) {
        return false;
      }
      return true;
    },
    // 確定預約
    reservation() {
      if (this.checkUserInfo()) {
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
  background: $primary-color
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5)
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
    @include flex(space-between, center)
    label, input
      letter-spacing: 1.5px
    label
      width: 62px
      margin-right: 32px
    input
      flex: auto
      padding: 7px 11px
      border: 1px solid #C9C9C9
      border-radius: 5px
  &__period
    flex: auto
    @include flex(space-between, center)
    input
      width: 100px
      flex-grow: 0
      font-size: 12px
      letter-spacing: 1.3px
  &__nights
    background: #EDEDED
    width: 423px
    margin-left: -42px
    padding: 15px 43px 18px 42px
    .booking-form__row
      margin-bottom: 0
      span
        font-size: 12px
        line-height: 18px
        letter-spacing: 1.3px
        color: #6D7278
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
        color: #6D7278
      &[type="submit"]
        background: #484848
        color: $primary-color
        &[disabled]
          cursor: not-allowed
          background: lighten(#484848, 65%)
</style>
