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
            iconType="type-1"
            color="#2d8cf0"
            intro-text="上月累计工时"
          ></infor-card>
        </Col>
        <Col span="6">
          <infor-card
            id-name="visit_count"
            :end-val="monthCount"
            iconType="type-2"
            color="#64d572"
            intro-text="本月累计工时"
          ></infor-card>
        </Col>
        <Col span="6">
          <infor-card
            id-name="collection_count"
            :end-val="yearCount"
            iconType="type-3"
            color="#ffd572"
            intro-text="本年累计工时"
          ></infor-card>
        </Col>
        <Col span="6">
          <infor-card
            id-name="transfer_count"
            :end-val="systemCount"
            iconType="type-4"
            color="#f25e43"
            intro-text="系统总数"
          ></infor-card>
        </Col>
      </Row>
      <Row :style="{marginBottom: '15px'}">
        <Col span="24">
          <Card dis-hover>
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
            <Button type="primary" @click="seach">查询</Button>
            <!-- <ButtonGroup style="margin-left: 10px">
              <Button type="info" ghost v-if="isReset === 'admin'" @click="resetTime" >重置工时</Button>
              <Button type="success" ghost v-if="isReset === 'admin'" @click="exportTime(false)">生成备份</Button>
              <Button type="warning" ghost v-if="isReset === 'admin'" @click="inportTime">上传备份</Button>
              <Button type="error" ghost v-if="isReset === 'admin'" @click="installTime">恢复备份</Button>
              <Button type="error" ghost v-if="isReset === 'admin'" @click="checkTimeFn">查漏</Button>
            </ButtonGroup> -->
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Card dis-hover>
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
                      <Card dis-hover>
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
                      <Card dis-hover>
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
      <personal></personal>
    </template>
    <Modal v-model="show" title="上传文件（工时备份）">
      <Upload
          multiple
          type="drag"
          :action="action">
          <div style="padding: 40px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>Click or drag files here to upload</p>
          </div>
      </Upload>
      <div slot="footer">
        <Button type="primary" @click="show=false">关闭</Button>
      </div>
    </Modal>
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
  resetTime,
  exportTime,
  uploadFile,
  installTime,
  checkTime
} from "@/api/index";
import moment from "moment";
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
import inforCard from "./components/inforCard.vue";
import personal from "./personal.vue";

export default {
  name: "home",
  data() {
    return {
      show: false,
      action: '',
      isReset: JSON.parse(localStorage.getItem('userInfo')).userName,
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
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
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
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
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
    inforCard,
    personal
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
            width: 100,
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
    checkTimeFn() {
      var userList = [];
      this.people.forEach(item => {
        userList.push(_.find(this.peopleList,['userId',item]).userName);
      })
      checkTime({
        userList: userList,
        startTime: this.startTime,
        endTime: this.endTime,
      }).then(res=> {
        var list = [];
         for (let i = 0;i< res.data.length; i++) {
           if (res.data[i].details.length < 10 && res.data[i].details.length > 7) {
             for (let k = 0; k < userList.length; k++) {
               if (!_.find(res.data[i].details,['userName',userList[k]])) {
                 list.push(`时间：${moment(res.data[i]._id.timeDate).format('YYYY-MM-DD')}；工时：<span style="color: #c30">未录</span>；员工：${_.find(this.peopleList,['userName',userList[k]]).nickName}`)
               }
             }
           } else {
             for (let j = 0; j < res.data[i].details.length;j++) {
               if (res.data[i].details[j].timeCount<7) {
                 list.push(`时间：${moment(res.data[i]._id.timeDate).format('YYYY-MM-DD')}；工时：${res.data[i].details[j].timeCount}；员工：${_.find(this.peopleList,['userName',res.data[i].details[j].userName]).nickName}`)
               }
             }
           }
         }
         this.$Modal.info({
           title: '遗漏工时',
           content: list.join('<br>')
         })
         console.log(JSON.stringify(list))
      });
    },
    installTime () {
      this.$Modal.confirm({
        title: "提示",
        content: "数据恢复将会导致原有数据清空，确定执行此操作？",
        onOk: () => {
          installTime().then( res => {
            if (res.code===1) {
              this.$Message.success('导入成功');
            }
          })
        }
      });
    },
    inportTime () {
      this.show = true;
    },
    exportTime (sendMail) { //导出json数据
      exportTime({ sendMail: sendMail }).then( res => {
        if (res.code===1) {
          if (sendMail) {
            this.$Message.success('文件已经通过邮件形式发送');
          } else {
            window.location.href = 'http://172.16.2.131:3333/download/all';
          }
        }
      })
    },
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
      let userInfo = JSON.parse(localStorage.getItem('userInfo'));
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
          //回显
          for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < res.data[i].children.length; j++) {
              if (this.system.includes(res.data[i].children[j].id)) {
                this.$set(res.data[i].children[j], 'checked', true)
              } else {
                this.$set(res.data[i].children[j], 'checked', false)
              }
            }
          }
          this.systemData = res.data;
          this.systemModalVisible = true;
        }
      })
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
    this.action = 'http://'+window.location.hostname+':3333'+uploadFile;
    this.type = JSON.parse(localStorage.getItem('userInfo')).type;
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
