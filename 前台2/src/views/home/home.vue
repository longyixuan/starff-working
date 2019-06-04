<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>

<template>
  <div class="home-main">
    <template v-if="type===1">
      <Row :gutter="10" :style="{marginBottom: '15px'}">
        <Col span="6">
          <infor-card
            id-name="user_created_count"
            :end-val="weekCount"
            iconType="md-shuffle"
            color="#2d8cf0"
            intro-text="上月累计工时"
          ></infor-card>
        </Col>
        <Col span="6">
          <infor-card
            id-name="visit_count"
            :end-val="monthCount"
            iconType="ios-eye"
            color="#64d572"
            intro-text="本月累计工时"
          ></infor-card>
        </Col>
        <Col span="6">
          <infor-card
            id-name="collection_count"
            :end-val="yearCount"
            iconType="ios-time"
            color="#ffd572"
            intro-text="本年累计工时"
          ></infor-card>
        </Col>
        <Col span="6">
          <infor-card
            id-name="transfer_count"
            :end-val="systemCount"
            iconType="md-desktop"
            color="#f25e43"
            intro-text="系统总数"
          ></infor-card>
        </Col>
      </Row>
      <Row :style="{marginBottom: '15px'}">
        <Col span="24">
          <Card>
            <p slot="title">查询条件</p>
            <Row :gutter="20">
              <Col span="16">
                <Date-picker
                  :value="showdate"
                  @on-change="handelChange"
                  style="width: 100%;"
                  type="daterange"
                  class="margin-bottom20"
                  confirm
                  placeholder="选择日期"
                ></Date-picker>
              </Col>
              <Col span="8">
                <Button type="primary" @click="quickTime('week')" ghost class="margin-bottom20">本周</Button>
                <Button
                  type="primary"
                  @click="quickTime('month')"
                  ghost
                  class="margin-bottom20"
                  style="margin-left: 10px;"
                >本月</Button>
                <Button
                  type="primary"
                  @click="quickTime('preMonth')"
                  ghost
                  class="margin-bottom20"
                  style="margin-left: 10px;"
                >上月</Button>
              </Col>
            </Row>
            <Row :gutter="20">
              <Col span="16">
                <Select clearable multiple placeholder="选择员工" @on-change="peopleChange" v-model="people" class="margin-bottom20">
                  <Option
                    v-for="item in peopleList"
                    :value="item.userId"
                    :key="item.userId"
                  >{{ !!item.nickName? item.nickName: item.userName}}</Option>
                </Select>
              </Col>
              <Col span="8">
                <Button type="primary" ghost @click="people=[]" class="margin-bottom20">清空选择</Button>
                <Button
                  type="primary"
                  ghost
                  @click="peopleAll"
                  class="margin-bottom20"
                  style="margin-left: 10px;"
                >选择全部</Button>
              </Col>
            </Row>
            <Row :gutter="20">
              <Col span="16">
                <Select clearable multiple placeholder="选择系统" v-model="system" class="margin-bottom20">
                  <Option v-for="item in systemList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
              </Col>
              <Col span="8">
                <Button type="primary" ghost @click="clearallSystems" class="margin-bottom20">清空选择</Button>
                <Button
                  type="primary"
                  ghost
                  @click="editallSystems"
                  class="margin-bottom20"
                  style="margin-left: 10px;"
                >选择全部</Button>
                <Button
                  type="primary"
                  ghost
                  @click="editSystems"
                  class="margin-bottom20"
                  style="margin-left: 10px;"
                >快速选择</Button>
              </Col>
            </Row>
            <Button type="primary" @click="seach" class="margin-bottom20">查询</Button>
            <Button type="primary" v-if="isReset === 'admin'" @click="resetTime" class="margin-bottom20" style="margin-left: 10px;">重置工时</Button>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Card>
            <p slot="title">查询结果</p>
            <Button type="primary" @click="exportData()" slot="extra">导出数据</Button>
            <div class="demo-tabs-style2">
              <Tabs type="card">
                <Tab-pane label="表格">
                  <Table
                    v-if="columns.length>0"
                    border
                    :columns="columns"
                    :data="workList"
                    stripe
                    ref="table"
                  >
                    <template slot-scope="{ row }" slot="systemName">
                      <strong>{{ row.systemName }}</strong>
                    </template>
                  </Table>
                </Tab-pane>
                <Tab-pane label="图表">
                  <Row :style="{marginBottom: '20px'}">
                    <Col span="24">
                      <Card>
                        <p slot="title" class="card-title">
                          <Icon type="md-map"></Icon>系统工时统计（共计{{total}}小时）
                        </p>
                        <div class="data-source-row">
                          <div style="width:100%;height:300px;" id="visite_volume_con"></div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                  <Row :style="{marginBottom: '10px'}">
                    <Col span="24">
                      <Card>
                        <p slot="title" class="card-title">
                          <Icon type="md-map"></Icon>系统工时占比分析（共计{{total}}小时）
                        </p>
                        <div class="data-source-row" style="width:100%;height:500px;">
                          <div style="width:100%;height:100%;" id="data_source_con"></div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Tab-pane>
              </Tabs>
            </div>
            <!-- 系统列表 -->
            <Modal
              title="请选择系统"
              v-model="systemModalVisible"
              :mask-closable="false"
              :width="500"
              :styles="{top: '30px'}"
              class="systemModal"
            >
              <Tree
                ref="sysTree"
                empty-text="请联系管理员录入系统列表"
                :data="systemData"
                show-checkbox
                check-directly
                multiple
              ></Tree>
              <Spin size="large" v-if="treeLoading"></Spin>
              <div slot="footer">
                <Button type="text" @click="cancelsystemEdit">取消</Button>
                <Button type="primary" @click="submitsystemEdit">确定</Button>
              </div>
            </Modal>
          </Card>
        </Col>
      </Row>
    </template>
    <template v-else>
      <Alert show-icon>欢迎使用工时系统</Alert>
    </template>
  </div>
</template>

<script>
import {
  workTimeCount,
  getCountTime,
  getMapTime,
  getSystemList,
  initSystem,
  getSystemTree,
  getSystemCount,
  getAllUserData,
  resetTime
} from "@/api/index";
import {
  getAll,
  getWeekStartDate,
  getWeekEndDate,
  getMonthStartDate,
  getMonthEndDate,
  getLastMonthStartDate,
  getLastMonthEndDate
} from "@/libs/timeHelp";
import echarts from "echarts";
import Cookies from "js-cookie";
import inforCard from "./components/inforCard.vue";
export default {
  name: "home",
  data() {
    return {
      isReset: JSON.parse(Cookies.get('userInfo')).userName,
      type: '',
      systemCount: 0,
      weekCount: 0,
      monthCount: 0,
      yearCount: 0,
      total: 0,
      startTime: "",
      endTime: "",
      people: [],
      showdate: [],
      peopleList: [],
      system: [],
      systemList: [],
      workList: [],
      systemData: [],
      systemModalVisible: false,
      treeLoading: false,
      systemData: [],
      editSystem: [],
      selectAllFlag: false,
      visiteVolume: null,
      dataSourcePie: null,
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
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
        grid: {
          top: "10%",
          left: "2%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            interval: 0,
            rotate: 30
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
      },
      option1: {
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
            radius: "50%",
            center: ["50%", "60%"],
            data: [],
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
  components: {
    inforCard
  },
  computed: {
    columns() {
      if (this.startTime !== "" && this.endTime !== "") {
        let column = [];
        let dataList = getAll(this.startTime, this.endTime);
        column.push({
          title: "系统/时间(h)",
          minWidth: 150,
          fixed: "left",
          key: "systemName",
          sortable: true,
          slot: "systemName"
        });
        for (let i = 0; i < dataList.length; i++) {
          column.push({
            title: dataList[i],
            key: dataList[i],
            width: 116,
            sortable: true,
            align: "center"
          });
        }
        return column;
      } else {
        return [];
      }
    }
  },
  methods: {
    resetTime() {
      resetTime().then(res => {
        if (res.code===1) {
          this.$Message.success('重置成功')
        } else {
          this.$Message.error('重置失败')
        }
      })
    },
    peopleChange(arr) {
      if (arr.length === 0 ) {
        this.system = [];
        return;
      }
      let postData =  {
        userlist: arr
      }
      getSystemCount(postData).then(res=> {
        if (res.code === 1) {
          this.system = res.data;
        }
      })
    },
    init() {
      let userInfo = JSON.parse(Cookies.get("userInfo"));
      workTimeCount({ userId: userInfo.userId }).then(res => {
        if (res.code===1) {
          this.systemCount = res.data.systemCount;
          this.weekCount = res.data.weekCount;
          this.monthCount = res.data.monthCount;
          this.yearCount = res.data.yearCount;
        }
      })
    },
    quickTime(type) {
      if (type == "week") {
        //周
        this.startTime = getWeekStartDate();
        this.endTime = getWeekEndDate();
        this.showdate = [];
        this.showdate.push(this.startTime);
        this.showdate.push(this.endTime);
      } else if (type == "month") {
        //月
        this.startTime = getMonthStartDate();
        this.endTime = getMonthEndDate();
        this.showdate = [];
        this.showdate.push(this.startTime);
        this.showdate.push(this.endTime);
      } else {
        //上月
        this.startTime = getLastMonthStartDate();
        this.endTime = getLastMonthEndDate();
        this.showdate = [];
        this.showdate.push(this.startTime);
        this.showdate.push(this.endTime);
      }
    },
    clearallSystems() {
      this.system = [];
    },
    peopleAll() {
      this.people = [];
      for (let i = 0; i < this.peopleList.length; i++) {
        let element = this.peopleList[i];
        this.people.push(element.userId);
      }
    },
    editallSystems() {
      this.system = [];
      for (let i = 0; i < this.systemList.length; i++) {
        let element = this.systemList[i];
        this.system.push(element.id);
      }
    },
   editSystems() {
      this.treeLoading = true;
      getSystemTree().then(res => {
        this.treeLoading = false;
        if (res.code === 1) {
          this.systemData = res.data;
          // 判断子节点
          this.checkSysTree(this.systemData, this.system);
          this.systemModalVisible=true
        }
      })
    },
    // 判断子节点
    checkSysTree(systemData, systems) {
      let that = this;
      systemData.forEach(function(p) {
        that.hasSysPerm(p, systems)
      });
    },
    // 判断节点勾选
    hasSysPerm(p, systems) {
      for (let i = 0; i < p.children.length; i++) {
        if (systems.includes(p.children[i].id)) {
          p.children[i].checked = true;
        } else {
          p.children[i].checked = false;
        }
      }
    },
    cancelsystemEdit() {
      this.systemModalVisible=false;
    },
    submitsystemEdit() {
      let systemIds = [];
      let checkedNodes = this.$refs.sysTree.getCheckedNodes();
      checkedNodes.forEach(function(e) {
        systemIds.push(e.id);
      });
      this.system = systemIds;
      this.systemModalVisible = false;
    },
    exportData() {
      this.$refs.table.exportCsv({
        filename: "工时统计"
      });
    },
    handelChange(date) {
      this.startTime = date[0];
      this.endTime = date[1];
    },
    seach() {
      let postData = {
        startTime: this.startTime,
        endTime: this.endTime,
        people: this.people,
        system: this.system
      };
      if (this.startTime==''||this.endTime==''||this.people.length==0||this.system.length==0) {
        this.$Message.info('查询条件必填')
        return;
      }
      this.getTimeList(postData);
    },
    getTimeList(data) {
      getCountTime(data).then(res => {
        if (res.code === 1) {
          this.workList = res.data;
        }
      });
      getMapTime(data).then(res => {
        if (res.code === 1) {
          this.$Message.success('查询成功')
          this.option.xAxis.data = [];
          this.option.series[0].data = [];
          this.option1.series[0].data = [];
          this.total = 0;
          for (let i = 0; i < res.data.length; i++) {
            this.option.xAxis.data.push(res.data[i]._id.systemName);
          }
          for (let j = 0; j < res.data.length; j++) {
            this.option.series[0].data.push({
              name: res.data[j]._id.systemName,
              value: res.data[j].time
            });
            this.option1.series[0].data.push({
              name: res.data[j]._id.systemName,
              value: res.data[j].time
            });
            this.total+= res.data[j].time;
          }
          this.dataSourcePie.setOption(this.option1);
          this.visiteVolume.setOption(this.option);
        }
      });
    },
    getUserList() {
      getAllUserData().then(res => {
        if (res.code === 1) {
          this.peopleList = res.data;
        }
      });
    },
    getSystemList() {
      getSystemList().then(res => {
        if (res.code === 1) {
          this.systemList = res.data;
        }
      });
    }
  },
  mounted() {
    this.type = JSON.parse(Cookies.get("userInfo")).type;
    if (this.type!==1) {
      return;
    }
    this.init();
    this.getUserList();
    this.getSystemList();
    this.$nextTick(() => {
      this.visiteVolume = echarts.init(
        document.getElementById("visite_volume_con")
      );
      this.dataSourcePie = echarts.init(
        document.getElementById("data_source_con")
      );
    });
  }
};
</script>
