<template>
  <div id="parent">
    <div class="header">
      <div class="left">
        {{headerContent}}
      </div>
      <!-- <div class="right">
        <ButtonGroup>
            <Button type="default" @click="prev">
                上月
            </Button>
            <Button type="default" @click="next">
                下月
            </Button>
        </ButtonGroup>
      </div> -->
    </div>
    <div class="body">
      <table class="month-table"  cellspacing="0" cellpadding="0" v-show="showMonth">
        <thead>
          <th>周一</th>
          <th>周二</th>
          <th>周三</th>
          <th>周四</th>
          <th>周五</th>
          <th>周六</th>
          <th>周日</th>
        </thead>
        <tbody>
          <!-- 双重for循环生成 6 * 7 = 42 个日期格子 -->
          <tr v-for="(week, weekIndex) in dates" v-bind:key="weekIndex">
            <td v-for="(date, dateIndex) in dates[weekIndex]"
              v-bind:key="dateIndex"
              @mouseenter="dateMouseEnter(weekIndex, dateIndex)"
              @mouseleave="dateMouseLeave(weekIndex, dateIndex)">
              <div
              class="date"
              :class="[date.class, date.isAlive]">
                <span>{{date.day}}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
 
<script>
import moment from 'moment'
import {
  workingCheck
} from "@/api/index";
import {
  getMonthStartDate,
  getMonthEndDate,
} from "@/libs/timeHelp";
export default {
  data () {
    return {
      today: moment().format('YYYY-MM-DD'),
      currentYearMonth: moment().format('YYYY-MM'),
      weekTableHeader: [],
      dates: [],
      workDate: [],
      showMonth: true,
      weekList: [],
      headerContent: moment().format('YYYY-MM'),
      currentWeekday: ''
    }
  },
  methods: {
    // 点击上个月 通过改变currentYearMonth来获取上个月的 YYYY-MM 格式
    prev () {
      if (this.showMonth) {
        this.currentYearMonth = moment(this.currentYearMonth).subtract(1, 'months').format('YYYY-MM')
        this.headerContent = this.currentYearMonth
        this.createCalendar()
      } else {
        this.currentWeekday = moment(this.currentWeekday).subtract(7, 'days')
        this.weekHeaderContent()
        this.createWeekList()
      }
    },
    next () {
      if (this.showMonth) {
        this.currentYearMonth = moment(this.currentYearMonth).add(1, 'months').format('YYYY-MM')
        this.headerContent = this.currentYearMonth
        this.createCalendar()
      } else {
        this.currentWeekday = moment(this.currentWeekday).add(7, 'days')
        this.weekHeaderContent()
        this.createWeekList()
      }
    },
    dateMouseEnter (weekIndex, dateIndex) {
      this.dates[weekIndex][dateIndex].isAlive = 'date-alive'
    },
    dateMouseLeave (weekIndex, dateIndex) {
      this.dates[weekIndex][dateIndex].isAlive = ''
    },
    checkWoring(item) {
        var flag = false;
        for (let i = 0; i < this.workDate.length; i++) {
            if (item.isSame(this.workDate[i], 'days')) {
                flag = true;
                break;
            }
        }
        return flag;
    },
    createCalendar () {
      this.dates = []
      // 获取当月的一号是星期几 以便来生成上月的日期 填补够42个格子
      const monthFirstDay = moment(this.currentYearMonth + '-01', 'YYYY-MM-DD')
      // 获得一号与第一个格子内应该有的天数距离 这里需要注意的是 weekday 是从周日 为 0 开始的
      let firstDayWeekday = moment(monthFirstDay).weekday()
      if (firstDayWeekday === 0) {
        firstDayWeekday = 7
      }
      let daysDistance = 1 - firstDayWeekday
      for (let weeks = 0; weeks < 6; weeks++) {
        this.dates.push([])
        for (let weekday = 0; weekday < 7; weekday++) {
          // 该对象有两个属性 一个是class属性 还有一个就是日期
          let date = {}
          date.day = moment(monthFirstDay).add(daysDistance, 'days')
          date.isAlive = ''
          const dayMonth = moment(date.day).month()
          // 是这个月的日期
          if (dayMonth === moment(monthFirstDay).month()) {
            date.class = 'current-month '
            // 日期是今天的高亮
            if (moment(date.day).isSame(this.today, 'days')) {
              date.class += 'today '
            }
            if (this.checkWoring(date.day)) {
                date.class += 'working '
            }
          } else {
            date.class = 'not-current-month '
          }
          date.day = moment(date.day).format('DD')
          this.dates[weeks].push(date)
          daysDistance++
        }
      }
    },
    createWeekList () {
      this.weekTableHeader = ['Mon ', 'Tue ', 'Wed ', 'Thu ', 'Fri ', 'Sat ', 'Sun ']
      this.weekList = []
      for (let index = 0; index < 7; index++) {
        let item = {}
        item.date = moment(this.currentWeekday).add(index, 'days')
        if (item.date.isSame(this.today, 'days')) {
            item.class = 'today'
        }
        item.date = this.weekTableHeader[index] + item.date.format('MM/DD')
        this.weekTableHeader[index] = item
      }
      for (let days = 0; days < 7; days++) {
        this.weekList.push([])
        let item = ''
        for (let hours = 0; hours < 48; hours++) {
          if (hours % 2 === 0) {
            item = hours / 2 + '点'
          } else {
            item = ''
          }
          this.weekList[days].push(item)
        }
      }
    },
    weekHeaderContent () {
      this.headerContent = moment(this.currentWeekday).format('MM/DD') + '~' + moment(this.currentWeekday).add(6, 'days').format('MM/DD')
    }
  },
  created () {
    workingCheck({
        userId: JSON.parse(localStorage.getItem('userInfo')).userId,
        startTime: getMonthStartDate(),
        endTime: getMonthEndDate()
    }).then((res) =>{
        for (let i = 0; i<res.data.length; i++) {
            this.workDate.push(res.data[i]._id);
        }
        // v-show是在创建后 保留dom 只是做切换的 不会v-if那样 销毁dom 所以只需要创建一次
        this.createCalendar()
        let weekday = moment().weekday() === 0 ? 7 : moment().weekday()
        let daysDistance = 1 - weekday
        this.currentWeekday = moment().add(daysDistance, 'days')
        this.createWeekList()
    })
  }
}
</script>
 
<style lang="less" scoped>
#parent {
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ebeef5;
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  font-size: 18px;
  border-bottom: 1px solid #ebeef5;
}
.body {
  padding: 12px 20px 35px;
}
table {
  table-layout: fixed;
  width: 100%;
}
table thead th {
  padding: 10px 0;
  font-weight: 400;
}
tbody tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
.month-table tbody td {
  vertical-align: inherit;
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
.month-table tbody tr:first-child td {
  border-top: 1px solid #ebeef5;
}
.month-table tr td:first-child {
  border-left: 1px solid #ebeef5;
}
.date {
  box-sizing: border-box;
  padding: 8px;
  height: 84px;
}
.not-current-month {
  color: #909399;
}
.current-month {
  color: #000000;
}
.working {
  color: #000000;
  background-color: rgba(135,206,250,0.4);
}
.today {
  color: #F44E50;
  background-color:rgba(255,127,80,0.3);
}
.date-alive {
  background-color: rgb(252, 212, 215);
}
.week-table tbody tr td {
  border: 1px solid #ebeef5;
}
.hours{
  text-align: center;
  height: 24px;
}
</style>
