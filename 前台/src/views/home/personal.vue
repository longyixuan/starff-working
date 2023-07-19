<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
.summary-table {
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    td,th {
        border: 1px solid #e8eaec;
        text-align: left;
        line-height:1.5;
        padding: 8px 12px;
    }
    th {
        background: #f8f8f9;
    }
}
</style>
<template>
    <div>
        <Row :gutter="20" :style="{marginBottom: '20px'}">
            <Col span="6">
                <infor-card
                id-name="transfer_count"
                :end-val="personalData.sysNum"
                iconType="type-1"
                color="#2d8cf0"
                intro-text="负责系统总数"
                ></infor-card>
            </Col>
            <Col span="6">
                <infor-card
                id-name="user_created_count"
                :end-val="personalData.weekSysNum"
                iconType="type-2"
                color="#64d572"
                intro-text="本周参与系统数"
                ></infor-card>
            </Col>
            <Col span="6">
                <infor-card
                id-name="visit_count"
                :end-val="personalData.timeNum"
                iconType="type-3"
                color="#ffd572"
                intro-text="本周累计工时"
                ></infor-card>
            </Col>
            <Col span="6">
                <infor-card
                id-name="collection_count"
                :end-val="personalData.docNum"
                iconType="type-4"
                color="#f25e43"
                intro-text="本周上报总结数"
                ></infor-card>
            </Col>
            </Row>
            <Row>
              <Col span="24">
                  <Card dis-hover title="工时录入情况">
                    <cal-panel></cal-panel>
                  </Card>
              </Col>
          </Row>
    </div>
</template>
<script>
import {
  personalCount
} from "@/api/index";
import {
  getWeekStartDate,
  getWeekEndDate,
  getPreWeekStartDate,
  getPreWeekEndDate,
} from "@/libs/timeHelp";
import moment from "moment";
import echarts from "echarts";
import inforCard from "./components/inforCard.vue";
import calPanel from "./components/cal-panel.vue";
export default {
  name: "home",
  data() {
    return {
      personalData: {
        weekSysNum: 0,
        timeNum: 0,
        docNum: 0,
        sysNum: 0,
        plan: ''
      }
    };
  },
  components: {
    inforCard,
    calPanel
  },
  methods: {
    renderPerson1(list) {
      var legendData = [];
      for (let i = 0; i < list.length; i++) {
        legendData.push(list[i].name)
      }
      var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            left: 'center',
            data: legendData
        },
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        series: [
            {
                name: '工时占比',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: list,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      };
      this.personalMap1.setOption(option);
    },
    renderPerson2(list) {
      var legendData = [];
      for (let i = 0; i < list.length; i++) {
        legendData.push(list[i].name)
      }
      var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            left: 'center',
            data: legendData
        },
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        series: [
            {
                name: '工时占比',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: list,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      };
      this.personalMap2.setOption(option);
    }
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('userInfo')).type!==1) {
        personalCount(
            {
            userId: JSON.parse(localStorage.getItem('userInfo')).userId,
            startTime: getWeekStartDate(),
            endTime: getWeekEndDate(),
            startTime2: getPreWeekStartDate(),
            endTime2: getPreWeekEndDate(),
            yestday: moment().add(-1, 'days').format('YYYY-MM-DD')
            }
        ).then(res => {
            this.personalData.sysNum = res.data.sysNum;
            this.personalData.docNum = res.data.docNum;
            this.personalData.timeNum = res.data.timeNum;
            this.personalData.weekSysNum = res.data.weekSysNum;
            this.personalData.plan = res.data.plan;
        });
        }
    }
};
</script>