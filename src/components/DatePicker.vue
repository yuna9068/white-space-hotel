<template lang="pug">
#datepicker__block
  #datepicker
  p.datepicker__desc
    span &nbsp;
    | 代表已被預訂，請選擇別的日期
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    markDates: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      laydate: window.laydate,
      laydateStart: '',
      laydateEnd: '',
      nowSelected: '',
    };
  },
  methods: {
    // 初始化日曆
    initDatePicker() {
      // 因只能渲染一次，故先移除元素，再新增回去，然後重新渲染
      document.querySelector('#datepicker').remove();
      const child = document.createElement('div');
      child.id = 'datepicker';
      document.querySelector('#datepicker__block').prepend(child);

      const vueThis = this;
      this.laydate.render({
        elem: '#datepicker',
        isInitValue: false,
        min: this.minDate(),
        max: this.maxDate(),
        showBottom: false,
        theme: 'datepicker-default',
        mark: this.markDates,
        range: true,
        position: 'static',
        ready() {
          vueThis.changeTitle(new Date().getFullYear(), new Date().getMonth() + 1);
          vueThis.changeMonth();
          vueThis.tdClick();
        },
        change(value, date, range) {
          vueThis.changeDate(date);
          vueThis.laydateStart = `${date.year}-${date.month}-${date.date}`;
          vueThis.laydateEnd = `${range.year}-${range.month}-${range.date}`;
        },
      });
    },
    // 最小可預約日期，不包含今天
    minDate() {
      const minDate = new Date().setDate(new Date().getDate() + 1);
      const minDateString = new Date(minDate).toISOString().substr(0, 10);
      return minDateString;
    },
    // 只能預約 90 天內的時段，不包含今天
    maxDate() {
      const maxDate = new Date().setDate(new Date().getDate() + 90);
      const maxDateString = new Date(maxDate).toISOString().substr(0, 10);
      return maxDateString;
    },
    changeDate(date) {
      this.changeTitle(date.year, date.month);
    },
    // 日曆標題顯示格式，由"yyyy年 m月"改成"yyyy / m"
    changeTitle(year, month) {
      const title = document.querySelector('#datepicker .laydate-set-ym');
      title.children[0].textContent = `${year} / `;
      title.children[1].textContent = month;
    },
    // 切換月份時更新日曆標題
    changeMonth() {
      document.querySelectorAll('.laydate-prev-m').forEach((item) => {
        item.addEventListener('click', () => {
          const titleChild = document.querySelector('#datepicker .laydate-set-ym').children;
          const year = titleChild[0].textContent.substr(0, 4);
          const month = titleChild[1].textContent.substr(0, titleChild[1].textContent.length - 1);
          this.changeTitle(year, month);
        });
      });

      document.querySelectorAll('.laydate-next-m').forEach((item) => {
        item.addEventListener('click', () => {
          const titleChild = document.querySelector('#datepicker .laydate-set-ym').children;
          const year = titleChild[0].textContent.substr(0, 4);
          const month = titleChild[1].textContent.substr(0, titleChild[1].textContent.length - 1);
          this.changeTitle(year, month);
        });
      });
    },
    // 取得日曆上選擇的日期
    getSelectedDate() {
      if (!this.laydateStart) {
        this.laydateStart = this.nowSelected;
      }
      if (!this.laydateEnd) {
        this.laydateEnd = this.nowSelected;
      }

      if (!(this.nowSelected === this.laydateStart) && !(this.nowSelected === this.laydateEnd)) {
        this.laydateStart = this.nowSelected;
        this.laydateEnd = this.nowSelected;
      }

      const datePickerResult = this.computerDays(this.laydateStart, this.laydateEnd);

      this.$emit('get-selected-date', datePickerResult);
    },
    // 計算平日天數、假日天數、總日期
    computerDays(start, end) {
      const startMs = new Date(start).getTime();
      const endMs = new Date(end).getTime();
      const dayMs = 24 * 60 * 60 * 1000;

      let weekday = 0;
      let holiday = 0;
      let totalDates = new Set();

      for (let i = startMs; i <= endMs; i += dayMs) {
        const newDay = new Date(i);
        totalDates.add(this.formatDate(newDay));
        if (newDay.getDay() === 0 || newDay.getDay() === 6) {
          holiday += 1;
        } else {
          weekday += 1;
        }
      }

      totalDates = Array.from(totalDates);
      return { weekday, holiday, totalDates };
    },
    // 格式化日期
    formatDate(day) {
      const year = day.getFullYear();
      const month = (day.getMonth() + 1) > 9 ? day.getMonth() + 1 : `0${day.getMonth() + 1}`;
      const date = day.getDate() > 9 ? day.getDate() : `0${day.getDate()}`;
      return `${year}-${month}-${date}`;
    },
    // 監聽 td click 事件
    tdClick() {
      const tds = document.querySelectorAll('.reservation__date-picker td');
      tds.forEach((td) => {
        td.addEventListener('click', () => {
          this.nowSelected = td.getAttribute('lay-ymd');
        });
      });
    },
  },
};
</script>

<style lang="sass">
$datepicker-font-color: $dark-grey !important
$datepicker-disabled-font-color: #C9CCD0 !important

.laydate-theme-datepicker-default
  width: 100%
  padding: 20px 10px 10px
  background: #F7F7F7
  color: $datepicker-font-color
  *
    font-weight: 400
  .layui-laydate-main
    width: 100%
    &.laydate-main-list-1
      display: none

    // 年月及 < > 按鈕
  .layui-laydate-header
    border-bottom: none
    padding-left: 60px
    padding-right: 60px
    @include flex(space-between, center)
    .laydate-set-ym span
      font-size: 18px
      letter-spacing: 1.9px
      line-height: 27px
      font-weight: 500
      user-select: none
      pointer-events: none
      cursor: default
      &:hover
        color: inherit
    i
      top: calc(50% + 3px)
      transform: translateY(-50%)
      user-select: none
      &:hover
        color: inherit
      // 切換年份按鈕
      &.laydate-prev-y, &.laydate-next-y
        display: none
      // 切換月份按鈕
      &.laydate-prev-m
        left: 15px
      &.laydate-next-m
        right: 15px
        display: block

  // 日期區塊
  .layui-laydate-content
    table
      width: 100%
      th, td
        padding-top: 10px
        padding-bottom: 10px
      // 日期
      td
        color: $datepicker-font-color
        letter-spacing: 1.5px
        &:hover
          background: transparent
        // 日期 - 不可選
        &.laydate-disabled
          color: $datepicker-disabled-font-color
        &.layui-this, &.laydate-selected
          background: transparent !important
          &::before
            content: ''
            position: absolute
            top: 15%
            left: 0%
            width: 100%
            height: 70%
            background: rgba(#ADE8C6, 0.5)
        // 日期 - 標記
        .laydate-day-mark
          font-size: inherit
          color: inherit
          line-height: 40px
          &::before
            content: ''
            position: absolute
            top: 15%
            left: 15%
            width: 70%
            height: 70%
            border-radius: unset
            @include zebra-black()
          &::after
            content: none

#datepicker__block
  #datepicker
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15)
  .datepicker__desc
    margin-top: 10px
    text-align: center
    span
      display: inline-block
      width: 30px
      margin-right: 10px
      @include zebra-black()
</style>
