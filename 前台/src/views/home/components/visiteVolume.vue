<template>
  <div class="visit">
    <div class="date">
      <Select v-model="date" style="width:120px" @on-change="changweek">
        <Option :value="0">本周</Option>
        <Option :value="-1">上周</Option>
      </Select>
      <DatePicker
        @on-change="selectDate"
        format="yyyy-MM-dd"
        v-model="mydate"
        type="daterange"
        placeholder="选择日期范围"
        style="width: 180px"
      ></DatePicker>
    </div>
    <div style="width:100%;height:200px;" id="visite_volume_con"></div>
  </div>
</template>

<script>
import { workTimeCount } from "@/api/index";
import { getWeekStartAndEnd } from "@/libs/timeHelp";
import Cookies from "js-cookie";
import echarts from "echarts";
export default {
  name: "visiteVolume",
  data() {
    return {
      date: 0,
      visiteVolume: null,
      mydate: [],
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        color: [
          "#ff7f50",
          "#87cefa",
          "#da70d6",
          "#32cd32",
          "#6495ed",
          "#ff69b4",
          "#ba55d3",
          "#cd5c5c",
          "#ffa500",
          "#40e0d0",
          "#1e90ff",
          "#ff6347",
          "#7b68ee",
          "#00fa9a",
          "#ffd700",
          "#6699FF",
          "#ff6666",
          "#3cb371",
          "#b8860b",
          "#30e0e0"
        ],
        grid: {
          top: "2%",
          left: "2%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            interval: 0
          },
          nameTextStyle: {
            color: "#c3c3c3"
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "工作小时数",
            type: "bar",
            data: []
          }
        ]
      }
    };
  },
  methods: {
    selectDate(date, type) {
      this.workTimeCount(date[0], date[1]);
    },
    changweek(value) {
        this.workTimeCount(getWeekStartAndEnd(value)[0],getWeekStartAndEnd(value)[1])
    },
    workTimeCount(beginTime, endTime) {
      workTimeCount({
        userId: JSON.parse(Cookies.get("userInfo")).userId,
        beginTime: beginTime,
        endTime: endTime
      }).then(res => {
        if (res.code === 1) {
          this.option.xAxis.data = res.data.title;
          this.option.series[0].data = res.data.content;
          this.visiteVolume.setOption(this.option);
        }
      });
    }
  },
  mounted() {
    
    this.$nextTick(() => {
      var _this = this;
      this.visiteVolume = echarts.init(
        document.getElementById("visite_volume_con")
      );
      this.workTimeCount(getWeekStartAndEnd(0)[0],getWeekStartAndEnd(0)[1])
    });
  }
};
</script>
<style lang="less">
.date {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
</style>
