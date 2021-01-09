<style lang="less">
@import "./time-line.less";
</style>

<template>
  <div>
    <Card title="添加时间线">
        <Form :label-width="100">
            <FormItem label="时间：">
                <DatePicker v-model="time" type="date" placeholder="选择时间" style="width: 300px"></DatePicker>
            </FormItem>
            <FormItem label="系统：">
                <Select filterable clearable style="width: 300px" v-model="system" @on-change="selectModel">
                  <Option :value="item.id" :key="item.id" v-for="item in sysList">{{item.title}}</Option>
                </Select>
            </FormItem>
            <FormItem label="模块：">
              <CheckboxGroup v-model="model">
                <Checkbox style="margin-bottom: 10px;" :label="item" v-for="item in modelList"></Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem label="备注：">
                <Input type="textarea" :rows="4" v-model="description"></Input>
            </FormItem>
            <FormItem label="标签：">
                <RadioGroup v-model="tag">
                  <Radio :label="tag.id" :key="tag.id" v-for="tag in tags">{{tag.name}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="add">确定</Button>
            </FormItem>
        </Form>
    </Card>
  </div>
</template>

<script>
import {
    getSystemList,
    addTimeline,
    getTimelineList,
    editTimeline,
    getTimelineDetail,
    getTagList
} from "@/api/index";
import moment from "moment";
export default {
  name: "timeline",
  data() {
    return {
        model: [],
        time: '',
        system: '',
        sysList: [],
        modelList: [],
        description: '',
        id: '',
        tags: [],
        tag: ''
    };
  },
  methods: {
      add() { //添加
        const postData = {
          id: this.id,
          userName: JSON.parse(localStorage.getItem('userInfo')).nickName,
          systemId: this.system,
          systemName: _.find(this.sysList,['id',this.system]).title,
          description: this.description,
          tag: this.tag,
          time: moment(this.time).format('YYYY-MM-DD'),
          model: this.model
        }
        if (this.id) {
          editTimeline(postData).then((res) =>{
            this.$router.push({ 'name': 'time-line'});
          })
        } else {
          addTimeline(postData).then((res) =>{
            this.$router.push({ 'name': 'time-line'});
          })
        }
      },
      updateTimeline() { //修改

      },
      deleteTimeline() { //删除

      },
      getlist() { //获取列表
          getTimelineList().then(res => {

          })
      },
      exportExcel() { //导出

      },
      addModal() {
        this.model.push(
          {
            id: '',
            value: ''
          }
        )
      },
      delModal(index) {
        this.model.splice(this.model,1)
      },
      init() {
          getSystemList().then(res => {
              this.sysList = res.data;
              this.id = this.$route.query.id;
              if (this.$route.query.id) {
                getTimelineDetail({'id': this.$route.query.id}).then(res => {
                  this.model = res.data.model;
                  this.time = res.data.time;
                  this.system = res.data.systemId;
                  this.description = res.data.description;
                  this.tag = res.data.tag;
                  this.modelList = _.find(this.sysList,['id',res.data.systemId]).modal;
                });
              }
          })
      },
      selectModel(id) {
        this.modelList = _.find(this.sysList,['id',id]).modal;
        this.model = [];
      }
  },
  mounted() {
      this.init();
      getTagList().then(res => {
        this.tags = res.data;
        this.getlist();
      })
  },
};
</script>
