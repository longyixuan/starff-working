<style lang="less" scoped>
@import "./work-time.less";
</style>
<template>
  <Card>
    <Date-picker
      @on-change="handelChange"
      style="width: 100%;"
      type="daterange"
      class="margin-bottom20"
      confirm
      placeholder="选择日期"
    ></Date-picker>
    <Select clearable multiple placeholder="选择员工" v-model="people" class="margin-bottom20">
      <Option v-for="item in peopleList" :value="item.userId" :key="item.userId">{{ item.nickName }}</Option>
    </Select>
    <Select clearable multiple placeholder="选择系统" v-model="system" class="margin-bottom20">
      <Option v-for="item in systemList" :value="item.id" :key="item.id">{{ item.title }}</Option>
    </Select>
    <Button type="success" @click="editSystems" class="margin-bottom20">快速选择系统</Button>
    <Button type="primary" @click="seach" class="margin-bottom20" style="margin-left: 10px;">查询</Button>
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
          <div style="width:100%;height:200px;" id="visite_volume_con"></div>
          <div style="width:100%;height:100%;" id="data_source_con"></div>
        </Tab-pane>
      </Tabs>
    </div>
    <div style="margin-top: 20px;">
      <Button type="primary" @click="exportData()">导出数据</Button>
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
        :load-data="loadData"
        @on-toggle-expand="expandCheckSys"
        on-check-change
        show-checkbox
        multiple
      ></Tree>
      <Spin size="large" v-if="treeLoading"></Spin>
      <div slot="footer">
        <Button type="text" @click="cancelsystemEdit">取消</Button>
        <Button type="primary" @click="submitsystemEdit">确定</Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
import {
  getCountTime,
  getMapTime,
  getSystemList,
  initSystem,
  loadSystem,
  getAllUserData
} from "@/api/index";
import { getAll } from "@/libs/timeHelp";
import echarts from "echarts";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      startTime: "",
      endTime: "",
      people: [],
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
            radius: "66%",
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
    editSystems() {
      this.treeLoading = true;
      initSystem().then(res => {
        this.treeLoading = false;
        if (res.code === 1) {
          res.data.forEach(function(e) {
            e.checked = false;
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status === -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          this.systemData = res.data;
          // 判断子节点
          this.checkSysTree(this.systemData, this.system);
          this.systemModalVisible = true;
        }
      });
    },
    expandCheckSys(v) {
      // 判断展开子节点
      this.checkSysTree(v.children, this.system);
    },
    // 判断子节点
    checkSysTree(systemData, systems) {
      let that = this;
      systemData.forEach(function(p) {
        if (that.hasSysPerm(p, systems)) {
          p.checked = true;
        } else {
          p.checked = false;
        }
      });
    },
    // 判断节点勾选
    hasSysPerm(p, systems) {
      let flag = false;
      for (let i = 0; i < systems.length; i++) {
        if (p.id === systems[i]) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return true;
      }
      return false;
    },
    loadData(item, callback) {
      loadSystem(item.id, { openDataFilter: false }).then(res => {
        if (res.code === 1) {
          res.data.forEach(function(e) {
            e.selected = false;
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status === -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          callback(res.data);
        }
      });
    },
    cancelsystemEdit() {
      this.systemModalVisible = false;
    },
    submitsystemEdit() {
      let systemIds = [];
      let selectedNodes = this.$refs.sysTree.getCheckedNodes();
      selectedNodes.forEach(function(e) {
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
          this.option.xAxis.data = [];
          this.option.series[0].data = [];
          this.option1.series[0].data = [];
          for (let i = 0; i < res.system.length; i++) {
            this.option.xAxis.data.push(res.system[i].title);
          }
          for (let j = 0; j < res.data.length; j++) {
            this.option.series[0].data.push({
              name: res.data[j]._id.systemName,
              value: res.data[j].time,
              itemStyle: { normal: { color: this.option.color[j] } }
            });
            this.option1.series[0].data.push({
              name: res.data[j]._id.systemName,
              value: res.data[j].time
            });
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
