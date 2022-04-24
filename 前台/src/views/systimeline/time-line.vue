<style lang="less">
@import "./time-line.less";
</style>

<template>
  <div>
    <Card title="系统同步记录" style="min-height: 400px">
        <Tabs v-model="tabName" type="card">
            <TabPane label="待批准" name="name1">
                <div style="margin-bottom: 20px;text-align: right;" v-if="!(loginName == 'lvf'|| loginName=='admin')">
                    <Button type="primary" to="/sys-time-line/add">申请</Button>
                </div>
                <Table border :columns="columnsSh" :data="dataDsh" ref="table">
                    <template slot-scope="{ row }" slot="jira">
                        <a :href="row.jira" target="_blank" rel="noopener noreferrer">{{row.jira}}</a>
                    </template>
                    <template slot-scope="{ row }" slot="bz">
                        <div v-html="row.bz" style="white-space: pre-line;word-break: break-all;font-size: 14px;line-height: 1.5;"></div>
                    </template>
                    <template slot-scope="{ row }" slot="commitStatus">
                        <Icon type="md-checkmark" color="#19be6b" v-if="row.commitStatus"/>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button v-if="!(loginName == 'lvf'|| loginName=='admin')" type="primary" size="small" style="margin-right: 5px" :disabled="!(!row.commitStatus&&loginNickName==row.userName)" @click="updateTimeline(row.timelineId,index)">编辑</Button>
                        <Button v-if="(loginName == 'admin' || loginName == 'lvf' || loginName == 'lugp')&&!row.commitStatus" type="primary" size="small" style="margin-right: 5px" @click="commitTimeline(row.timelineId,index)">上报</Button>
                        <Button v-if="(loginName == 'admin' || loginName == 'lvf' || loginName == 'lugp')&&row.commitStatus" type="primary" size="small" style="margin-right: 5px" @click="applyTimeline(row.timelineId,index)">批准同步</Button>
                        <Button v-if="!(loginName == 'lvf'|| loginName=='admin')" type="error" size="small" :disabled="!(!row.commitStatus&&loginNickName==row.userName)" @click="deleteTimeline(row.timelineId,index)">删除</Button>
                    </template>
                </Table>
            </TabPane>
            <TabPane label="已批准同步" name="name2">
                <div style="margin-bottom: 20px;">
                    <DatePicker v-model="time" style="width: 200px;margin-right:10px;" type="date" placeholder="请选择同步时间"></DatePicker>
                    <Select clearable filterable style="width: 200px;margin-right:10px;" multiple v-model="system" placeholder="请选择系统">
                        <Option :value="item.id" :key="item.id" v-for="item in sysList">{{item.title}}</Option>
                    </Select>
                    <Input v-model="jira" style="width: 400px;margin-right:10px;" clearable placeholder="请输入jira" autocomplete="off"/>
                    <Button type="primary" style="margin-right: 10px;" @click="seach">查询</Button>
                </div>
                <Table style="margin-bottom: 20px;" border :columns="columns" :data="dataDbc" ref="table" v-if="dataDbc.length>0">
                    <template slot-scope="{ row }" slot="jira">
                        <a :href="row.jira" target="_blank" rel="noopener noreferrer">{{row.jira}}</a>
                    </template>
                    <template slot-scope="{ row }" slot="bz">
                        <div v-html="row.bz" style="white-space: pre-line;word-break: break-all;font-size: 14px;line-height: 1.5;"></div>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="updateTimeline(row.timelineId,index)">编辑</Button>
                    </template>
                </Table>
                <Table border :columns="columns" :data="data" ref="table">
                    <template slot-scope="{ row }" slot="jira">
                        <a :href="row.jira" target="_blank" rel="noopener noreferrer">{{row.jira}}</a>
                    </template>
                    <template slot-scope="{ row }" slot="bz">
                        <div v-html="row.bz" style="white-space: pre-line;word-break: break-all;font-size: 14px;line-height: 1.5;"></div>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button :disabled="row.publishTime!=''" type="primary" size="small" style="margin-right: 5px" @click="updateTimeline(row.timelineId,index)">编辑</Button>
                    </template>
                </Table>
                <Row type="flex" justify="end" class="page" style="margin-top: 10px;">
                    <Page
                    :current="current"
                    :total="total"
                    :page-size="20"
                    @on-change="changePage"
                    ></Page>
                </Row>
            </TabPane>
        </Tabs>
    </Card>
  </div>
</template>

<script>
import {
    getSystemList,
    getAllUserData,
    getSysTimelineList,
    delSysTimeline,
    commitSysTimeline,
    applySysTimeline
} from "@/api/index";
import moment from "moment";
export default {
  name: "timeline",
  data() {
    return {
        loginName: '',
        loginNickName: '',
        tabName: 'name1',
        modal: true,
        time: '',
        system: [],
        sysList: [],
        jira: '',
        data: [],
        lineDate: [],
        peopleList: [],
        people: '',
        current: 1,
        total: 0,
        columnsSh: [
            {
                title: '系统',
                key: 'systemName',
                width: 200
            },
            {
                title: 'jira',
                slot: 'jira',
                width: 320
            },
            {
                title: '备注',
                slot: 'bz'
            },
            {
                title: '申请人',
                key: 'userName',
                width: 80,
                align: 'center'
            },
            {
                title: '申请时间',
                key: 'sqsj',
                width: 150,
                align: 'center'
            },
            {
                title: '已上报',
                slot: 'commitStatus',
                width: 80,
                align: 'center'
            },
            {
                title: '上报时间',
                key: 'commitTime',
                width: 150,
                align: 'center'
            },
            {
                title: '操作',
                slot: 'action',
                width: 140,
            }
        ],
        dataDsh: [],
        columns: [
            {
                title: '系统',
                key: 'systemName',
                width: 200
            },
            {
                title: 'jira',
                slot: 'jira',
                width: 320
            },
            {
                title: '备注',
                slot: 'bz'
            },
            {
                title: '申请人',
                key: 'userName',
                width: 80,
            },
            {
                title: '上报时间',
                key: 'commitTime',
                width: 140,
                align: 'center'
            },
            {
                title: '同步时间',
                key: 'publishTime',
                width: 140,
                align: 'center'
            },
            {
                title: '操作',
                slot: 'action',
                width: 80,
                align: 'center'
            }
        ],
        dataDbc: []
    };
  },
  methods: {
      changePage(num) {
        this.current = num;
        this.getlist();
    },
      updateTimeline(id,index) { //修改
         this.$router.push({ 'name': 'sys-time-line-edit', 'query': { id: id, tabname: this.tabName}});
      },
      deleteTimeline(id,index) { //删除
        this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
                delSysTimeline({id: id}).then(res=> {
                    this.data.splice(index,1);
                    this.$Message.success('操作成功');
                });
            }
        });
      },
      seach() {
          this.current = 1;
          this.getlist();
      },
      getlist() { //获取列表
        let params = {
            time: this.time?moment(this.time).format('YYYY-MM-DD'):'',
            system: this.system,
            jira: this.jira,
            userType: JSON.parse(localStorage.getItem('userInfo')).type,
            userName: JSON.parse(localStorage.getItem('userInfo')).nickName,
            current: this.current
        }

        getSysTimelineList(params).then(res => {
            if (res.code === 1) {
                this.data = res.data;
                this.total = res.total;
                this.dataDbc = res.dbc;
                this.dataDsh = _.sortBy(res.dsh, function(o) { return o.commitStatus; });
            }
        })
      },
      init() {
          getSystemList().then(res => {
              this.sysList = res.data;
          })
      },
      getUserList() {
        getAllUserData().then(res => {
            if (res.code === 1) {
                this.peopleList = res.data;
            }
        });
      },
        commitTimeline(id,index) {
             this.$Modal.confirm({
                title: '提示',
                content: '确定要上报吗？',
                onOk: () => {
                     commitSysTimeline({id: id, commitTime: moment().format('YYYY-MM-DD')}).then(res => {
                        this.$Message.success('操作成功');
                        this.seach();
                    })
                }
            });
        },
        applyTimeline(id,index) {
             this.$Modal.confirm({
                title: '提示',
                content: '确定要批准同步吗？',
                onOk: () => {
                     applySysTimeline({id: id, applyTime: moment().format('YYYY-MM-DD')}).then(res => {
                        this.$Message.success('操作成功');
                        this.seach();
                    })
                }
            });
        }
  },
  mounted() {
      this.getlist();
      this.init();
      this.getUserList();
      this.loginName = JSON.parse(localStorage.getItem('userInfo')).userName;
      this.loginNickName = JSON.parse(localStorage.getItem('userInfo')).nickName;
      if (this.loginName=='lvf' || this.loginName=='admin') {
          this.columnsSh[6].width = 100;
      }
      if (this.loginName=='lugp') {
            this.columnsSh[6].width = 220;
      }
      if (this.$route.query.tabname) {
          this.tabName = this.$route.query.tabname;
      }
  },
};
</script>
