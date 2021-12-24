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
                iconType="md-desktop"
                color="#2d8cf0"
                intro-text="负责系统总数"
                ></infor-card>
            </Col>
            <Col span="6">
                <infor-card
                id-name="user_created_count"
                :end-val="personalData.weekSysNum"
                iconType="md-shuffle"
                color="#64d572"
                intro-text="本周参与系统数"
                ></infor-card>
            </Col>
            <Col span="6">
                <infor-card
                id-name="visit_count"
                :end-val="personalData.timeNum"
                iconType="ios-eye"
                color="#ffd572"
                intro-text="本周累计工时"
                ></infor-card>
            </Col>
            <Col span="6">
                <infor-card
                id-name="collection_count"
                :end-val="personalData.docNum"
                iconType="ios-time"
                color="#f25e43"
                intro-text="本周上报总结数"
                ></infor-card>
            </Col>
            </Row>
            <Row :gutter="20">
              <Col>
                <Card title="本周工作计划" style="margin-bottom: 20px;">
                    <table class="summary-table" v-if="personalData.plan.length>0">
                        <thead>
                            <tr>
                                <th width="180">系统</th>
                                <th>工作计划内容</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in personalData.plan">
                                <td>
                                    {{item.systemName}}
                                </td>
                                <td>
                                    <div style=" white-space: pre-line;word-break: break-all;">{{item.gzjh}}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else style="color: #c30;font-weight: bold">
                        未添加本周计划，请在上周工作总结中补充。
                    </div>
                </Card>
              </Col>
            </Row>
            <Row :gutter="20">
              <Col span="12">
                  <Card title="工时录入情况">
                    <cal-panel></cal-panel>
                  </Card>
              </Col>
              <Col span="12">
                <Row :gutter="20">
                  <Card title="昨日工时分布" style="margin-bottom: 20px;">
                    <div class="data-source-row" style="width:100%;height:289px;">
                        <div style="width:100%;height:100%;" id="data_source_person1"></div>
                    </div>
                  </Card>
                  <Card  title="本周工时分布">
                    <div class="data-source-row" style="width:100%;height:289px;">
                        <div style="width:100%;height:100%;" id="data_source_person2"></div>
                    </div>
                  </Card>
                </Row>
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
        color: [
          "#87cefa",
          "#ff7f50",
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
        color: [
          "#87cefa",
          "#ff7f50",
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
            this.renderPerson2(res.data.timeMap);
            this.renderPerson1(res.data.timeMap2);
        });
        this.$nextTick(() => {
            this.personalMap1 = echarts.init(
                document.getElementById("data_source_person1")
            );
            this.personalMap2 = echarts.init(
                document.getElementById("data_source_person2")
            );
        })
        }
    }
};
</script>