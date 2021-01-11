<style lang="less">
@import "./time-line.less";
</style>

<template>
  <div>
    <Card>
        <Tabs value="name1">
            <TabPane label="表格显示" name="name1">
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
                <Table border :columns="columns" :data="data" ref="table">
                    <template slot-scope="{ row }" slot="model">
                        <Tag v-for="item in row.model" :key="item">{{item}}</Tag>
                    </template>
                    <template slot-scope="{ row }" slot="tag">
                        {{row.tag | tagFilter(tags)}}
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click=updateTimeline(row.timelineId,index)>编辑</Button>
                        <Button type="error" size="small" @click=deleteTimeline(row.timelineId,index)>删除</Button>
                    </template>
                </Table>
            </TabPane>
            <TabPane label="时间线显示" name="name2">
                <ul class="timeline">
                    <li class="timeline-item">
                    <div class="timeline-time">
                        <span>2020年05月14日</span>
                    </div>
                    <div class="timeline-icon"></div>
                    <div class="timeline-label">
                        <div style="margin-bottom: 20px;">
                            <h2>强基计划</h2>
                            <p>
                                1、学生端上线 <br>
                                2、管理后台上线
                            </p>
                        </div>
                        <div>
                            <h2>学职平台</h2>
                            <p>
                                1、综合报告上线<br>
                                2、移动端测评报告上线<br>
                                3、测评后台上线
                            </p>
                        </div>
                    </div>
                    </li>
                    <li class="timeline-item">
                    <div class="timeline-time">
                        <span>2020年05月14日</span>
                    </div>
                    <div class="timeline-icon"></div>
                    <div class="timeline-label">
                        <div style="margin-bottom: 20px;">
                            <h2>强基计划</h2>
                            <p>
                                1、学生端上线 <br>
                                2、管理后台上线
                            </p>
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
    getTagList
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
      }
  },
  methods: {
      updateTimeline(id,index) { //修改
         this.$router.push({ 'name': 'time-line-edit', 'query': { id: id}});
      },
      deleteTimeline(id,index) { //删除
        delTimeline({id: id}).then(res=> {
            this.data.splice(index,1);
            this.$Message.success('删除成功');
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
                this.data = res.data;
            }
        })
      },
      init() {
          getSystemList().then(res => {
              this.sysList = res.data;
          })
      },
      exportExcel() { //导出
        for (var i = 0; i < this.data.length; i++) {
            this.exportData.push({
                description: this.data[i].description,
                model: this.data[i].model.join('、'),
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
  },
};
</script>
