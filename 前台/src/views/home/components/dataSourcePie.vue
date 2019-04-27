<template>
  <div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
import { workTimeCount } from "@/api/index";
import Cookies from "js-cookie";
import echarts from "echarts";
export default {
  name: "dataSourcePie",
  data() {
    return {
      dataSourcePie: null,
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
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
        series: [
          {
            name: "工时占比",
            type: "pie",
            radius: "66%",
            center: ["50%", "60%"],
            data: [
              { value: 2103456, name: "高考" },
              { value: 1305923, name: "研招" },
              { value: 543250, name: "学信网" },
              { value: 798403, name: "学信网" },
              { value: 302340, name: "新职业" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    setPie() {
      workTimeCount({
        userId: JSON.parse(Cookies.get("userInfo")).userId,
        beginTime: "2019-04-01",
        endTime: "2019-04-30"
      }).then(res => {
        if (res.code === 1) {
          this.option.series[0].data = res.data.content;
          this.dataSourcePie.setOption(this.option);
        }
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.dataSourcePie = echarts.init(
        document.getElementById("data_source_con")
      );
      this.setPie();
    });
  }
};
</script>
