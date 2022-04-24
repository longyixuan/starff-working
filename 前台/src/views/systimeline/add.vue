<style lang="less">
@import "./time-line.less";
</style>

<template>
  <div>
    <Card title="系统同步申请单">
        <Form :label-width="100">
            <FormItem label="系统：">
                <Select filterable clearable style="width: 300px" v-model="system" @on-change="model=[]" :disabled="applyStatus">
                  <Option :value="item.id" :key="item.id" v-for="item in sysList">{{item.title}}</Option>
                </Select>
            </FormItem>
            <FormItem label="jira：">
                <Input v-model="jira" :disabled="applyStatus"></Input>
            </FormItem>
            <FormItem label="备注：">
                <Input v-model="bz" type="textarea" :rows="6" :disabled="applyStatus"></Input>
            </FormItem>
            <FormItem label="同步时间：" v-if="applyStatus">
                <DatePicker transfer v-model="publishTime" type="date" placeholder="选择时间" style="width: 300px"></DatePicker>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="add">确定</Button>
              <Button type="default" :to="'/sys-time-line?tabname='+ tabName" style="margin-left: 20px">返回</Button>
            </FormItem>
        </Form>
    </Card>
  </div>
</template>

<script>
import {
    getSystemList,
    addSysTimeline,
    editSysTimeline,
    getSysTimelineDetail,
} from "@/api/index";
import moment from "moment";
export default {
  name: "timeline",
  data() {
    return {
        publishTime: '',
        system: '',
        sysList: [],
        jira: '',
        bz: '',
        id: '',
        tabName: '',
        userName: JSON.parse(localStorage.getItem('userInfo')).nickName,
        applyStatus: false
    };
  },
  methods: {
      add() { //添加
        const postData = {
          id: this.id,
          userName: this.userName,
          systemId: this.system,
          systemName: _.find(this.sysList,['id',this.system]).title,
          jira: this.jira,
          bz: this.bz,
          sqsj: moment().format('YYYY-MM-DD'),
          publishTime: this.publishTime?moment(this.publishTime).format('YYYY-MM-DD'):''
        }
        if (this.id) {
          editSysTimeline(postData).then((res) =>{
            this.$router.push({ 'name': 'sys-time-line'});
          })
        } else {
          addSysTimeline(postData).then((res) =>{
            this.$router.push({ 'name': 'sys-time-line'});
          })
        }
      },
      init() {
          getSystemList().then(res => {
              this.sysList = res.data;
              if (this.$route.query.id) {
                this.id = this.$route.query.id;
                this.tabName = this.$route.query.tabname;
                getSysTimelineDetail({'id': this.$route.query.id}).then(res => {
                  this.publishTime = res.data.publishTime;
                  this.system = res.data.systemId;
                  this.bz = res.data.bz;
                  this.jira = res.data.jira;
                  this.userName = res.data.userName;
                  this.applyStatus = res.data.applyStatus;
                });
              }
          })
      }
  },
  mounted() {
      this.init();
  },
};
</script>
