<style lang="less">
@import "./time-line.less";
</style>

<template>
  <div>
    <Card>
        <Tabs value="name1">
            <TabPane label="表格显示" name="name1">
                <div style="text-align: right;margin-bottom: 20px;">
                    <Button type="primary">新增时间线</Button>
                </div>
                <div style="margin-bottom: 20px;border: 1px solid #dcdee2;padding: 20px 0;">
                    <Form :label-width="80">
                        <FormItem label="时间：" style="margin-bottom: 10px;">
                            <DatePicker style="width: 400px" type="datetimerange" placeholder="请选择时间"></DatePicker>
                        </FormItem>
                        <FormItem label="系统：" style="margin-bottom: 10px;">
                            <Select style="width: 400px" multiple v-model="system" placeholder="请选择系统">
                                <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="标签：" style="margin-bottom: 10px;">
                            <Select style="width: 400px" multiple v-model="system" placeholder="请选择系统">
                                <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem style="margin-bottom: 0;">
                            <Button type="primary" style="margin-right: 10px;">查询</Button>
                        </FormItem>
                    </Form>
                </div>
                <Table border :columns="columns" :data="data">
                    <template slot-scope="{ row, index }" slot="tags">
                        <div v-for="(item,itemIndex) in row.tags" :key="'tags-'+itemIndex">
                            <Tag type="dot" color="warning">{{item}}</Tag>
                        </div>
                    </template>
                    <template slot-scope="{ row, index }" slot="updateContent">
                        <div v-for="(item,itemIndex) in row.updateContent" :key="'data-'+itemIndex">
                            {{itemIndex+1}}、{{item}}
                        </div>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px">编辑</Button>
                        <Button type="error" size="small">删除</Button>
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
    <Modal v-model="modal" title="添加时间线">
        <Form :label-width="80">
            <FormItem label="时间：" style="margin-bottom: 10px;">
                <DatePicker style="width: 400px" type="datetimerange" placeholder="请选择时间"></DatePicker>
            </FormItem>
            <FormItem label="系统：" style="margin-bottom: 10px;">
                <Select style="width: 400px;" v-model="system" placeholder="请选择系统">
                    <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="模块：" style="margin-bottom: 10px;">
                <Select style="width: 400px;" multiple v-model="system" placeholder="请选择模块">
                    <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="标签：" style="margin-bottom: 10px;">
                <Select style="width: 400px" multiple v-model="system" placeholder="请选择标签">
                    <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="备注：" style="margin-bottom: 10px;">
                <Input type="textarea" :rows="5"/>
            </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "timeline",
  data() {
    return {
        modal: true,
        timeDate: [],
        system: [],
        systemList: [],
        data: [
            {
                time: '2020-02-20',
                system: '强基计划',
                updateContent: [
                    '上线',
                    '上线',
                    '上线'
                ],
                tags: [
                    '上线',
                    '更新'
                ]
            }
        ],
        columns: [
            {
                title: '时间',
                key: 'time',
                width: 120,
                align: 'center'
            },
            {
                title: '系统',
                key: 'system',
                width: 200
            },
            {
                title: '标签',
                slot: 'tags',
                width: 200
            },
            {
                title: '备注',
                slot: 'updateContent'
            },
            {
                title: '操作',
                slot: 'action',
                width: 160,
                align: 'center'
            }
        ]
    };
  },
  methods: {
      addTimeline() { //添加

      },
      updateTimeline() { //修改

      },
      deleteTimeline() { //删除

      },
      getlist() { //获取列表

      },
      exportExcel() { //导出

      }
  },
  mounted() {
      this.getlist();
  },
};
</script>
