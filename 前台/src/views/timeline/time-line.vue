<style lang="less">
@import "./time-line.less";
</style>

<template>
  <div>
    <Card title="系统时间线">
        <div style="margin-bottom: 20px;">
            <DatePicker v-model="timeDate" style="width: 200px;margin-right:10px;" type="daterange" placeholder="请选择时间"></DatePicker>
            <Select clearable filterable style="width: 400px;margin-right:10px;" multiple v-model="system" placeholder="请选择系统">
                <Option :value="item.id" :key="item.id" v-for="item in sysList">{{item.title}}</Option>
            </Select>
            <!-- <Select style="width: 200px;margin-right:10px;" multiple v-model="model" placeholder="请选择系统">
                <Option :value="item" v-for="item in modelList">{{item}}</Option>
            </Select> -->
            <Select clearable style="width: 200px;margin-right:10px;" v-model="tag" placeholder="请选择标签">
                <Option v-for="item in tags" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Button type="primary" style="margin-right: 10px;" @click="seach">查询</Button>
            <div style="float: right;">
                <Button type="primary" style="margin-right: 10px;" @click="exportExcel">导出Excel</Button>
                <Button type="primary" to="/time-line/add">新增时间线</Button>
            </div>
        </div>
        <Tabs value="name1" type="card">
            <TabPane label="表格显示" name="name1">
                
                <Table border :columns="columns" :data="data" ref="table">
                    <template slot-scope="{ row }" slot="model">
                        <template v-if="modelList.length > 0">
                            <Tag v-for="item in row.model" :key="item">{{item | modelFilter(modelList)}}</Tag>
                        </template>
                    </template>
                    <template slot-scope="{ row }" slot="tag">
                        <Tag type="border" color="warning" >{{row.tag | tagFilter(tags)}}</Tag>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click=updateTimeline(row.timelineId,index)>编辑</Button>
                        <Button type="error" size="small" @click=deleteTimeline(row.timelineId,index)>删除</Button>
                    </template>
                </Table>
            </TabPane>
            <TabPane label="时间线显示" name="name2">
                <ul class="timeline">
                    <li class="timeline-item" v-for="item in lineDate">
                        <div class="timeline-time">
                            <span>{{item._id.time}}</span>
                        </div>
                        <div class="timeline-icon"></div>
                        <div class="timeline-label">
                            <div style="margin-bottom: 20px;" v-for="item2 in item.details">
                                <h2>{{item2.systemName}}<Tag color="warning" style="margin-left: 10px;">{{item2.tag | tagFilter(tags)}}</Tag></h2>
                                <div style="margin-bottom: 10px;">
                                    <Tag style="font-weight: bold" type="dot" color="primary" v-for="item3 in item2.model" :key="item3">{{item3 | modelFilter(modelList)}}</Tag>
                                </div>
                                <div v-html="item2.description" style="white-space: pre-line;font-size: 14px;line-height: 1.5;"></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </TabPane>
        </Tabs>
    </Card>
  </div>
</template>

<script>
import {
    getSystemList,
    getTimelineList,
    delTimeline,
    getTagList,
    listModel
} from "@/api/index";
import moment from "moment";
export default {
  name: "timeline",
  data() {
    return {
        modal: true,
        timeDate: [],
        system: [],
        sysList: [],
        tag: '',
        model: [],
        modelList: [],
        tags: [],
        data: [],
        lineDate: [],
        exportData: [],
        columns: [
            {
                title: '时间',
                key: 'time',
                width: 120,
                align: 'center'
            },
            {
                title: '系统',
                key: 'systemName',
                width: 200
            },
            {
                title: '模块',
                key: 'model',
                slot: 'model',
                width: 300
            },
            {
                title: '备注',
                key: 'description',
                render(h,params) {
                    return h('div',{
                        'class': 'pre-div'
                    },params.row.description)
                }
            },
            {
                title: '标签',
                slot: 'tag',
                width: 120
            },
            {
                title: '最后更新人',
                key: 'userName',
                width: 120,
            },
            {
                title: '操作',
                slot: 'action',
                width: 140,
                align: 'center'
            }
        ]
    };
  },
  created() {
    getTagList().then(res => {
        this.tags = res.data;
    })
  },
  filters: {
      tagFilter: function(value,data) {
          return _.find(data,['id',value]).name;
      },
      modelFilter: function(value,data) {
          if (_.find(data,['modelId',value])) {
              return _.find(data,['modelId',value]).modelName;
          } else {
              return '';
          }
      }
  },
  methods: {
      updateTimeline(id,index) { //修改
         this.$router.push({ 'name': 'time-line-edit', 'query': { id: id}});
      },
      deleteTimeline(id,index) { //删除
        this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
                delTimeline({id: id}).then(res=> {
                    this.data.splice(index,1);
                    this.$Message.success('删除成功');
                });
            }
        });
      },
      seach() {
          this.getlist();
      },
      getlist() { //获取列表
        let params = {
            startTime: this.timeDate[0]>0?moment(this.timeDate[0]).format('YYYY-MM-DD'):'',
            endTime: this.timeDate[1]>0?moment(this.timeDate[1]).format('YYYY-MM-DD'):'',
            tag: this.tag,
            system: this.system
        }
        getTimelineList(params).then(res => {
            if (res.code === 1) {
                this.data = _.sortBy(res.data, function(item) {
                    return (new Date(item.time)).getTime();
                });
                this.lineDate = _.sortBy(res.timeSys, function(item) {
                    return (new Date(item._id.time)).getTime();
                });;
            }
        })
      },
      init() {
          getSystemList().then(res => {
              this.sysList = res.data;
          })
      },
      modelStr: function(list) {
          var str = [];
          for (var i = 0; i < list.length; i++) {
            str.push(_.find(this.modelList,['modelId',list[i]]).modelName);
          }
          return str.join('、');
      },
      exportExcel() { //导出
        for (var i = 0; i < this.data.length; i++) {
            this.exportData.push({
                description: this.data[i].description.replaceAll('\n',''),
                model: this.modelStr(this.data[i].model),
                systemName: this.data[i].systemName,
                tag: _.find(this.tags,['id',this.data[i].tag]).name,
                time: this.data[i].time,
                timelineId: this.data[i].timelineId
            })
        }
        this.$refs.table.exportCsv({
            filename: '系统时间线',
            columns: [
                {
                    title: '时间',
                    key: 'time',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '系统',
                    key: 'systemName',
                    width: 200
                },
                {
                    title: '模块',
                    key: 'model',
                    width: 300
                },
                {
                    title: '备注',
                    key: 'description'
                },
                {
                    title: '标签',
                    key: 'tag',
                    width: 120
                }
            ],
            data: this.exportData
        });
      }
  },
  mounted() {
      this.getlist();
      this.init();
      listModel().then(res => {
          this.modelList = res.data;
      })
  },
};
</script>
