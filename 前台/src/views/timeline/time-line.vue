<style lang="less">
@import './time-line.less';
</style>

<template>
    <div>
        <Card title="系统时间线">
            <div style="margin-bottom: 20px" class="clearfix">
                <DatePicker v-model="year" style="width: 120px; margin-right: 10px" type="year" placeholder="请选择年份"></DatePicker>
                <Select clearable filterable style="width: 200px; margin-right: 10px" multiple v-model="system" placeholder="请选择系统">
                    <Option :value="item.id" :key="item.id" v-for="item in sysList">{{ item.title }}</Option>
                </Select>
                <Select filterable clearable multiple style="width: 200px; margin-right: 10px" v-model="model" placeholder="请选择模块">
                    <Option :value="item.modelId" :key="item.modelId" v-for="item in filterModal(system)">{{item.modelName}}</Option>
                </Select>
                <Select clearable style="width: 200px; margin-right: 10px" v-model="tag" placeholder="请选择标签">
                    <Option v-for="item in tags" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Input v-model="keyword" style="width: 200px; margin-right: 10px" clearable placeholder="请输入关键字" autocomplete="off" />
                <Button type="primary" style="margin-right: 10px" @click="seach">查询</Button>
                <div style="float: right">
                    <Button type="primary" style="margin-right: 10px" @click="exportExcel">导出Excel</Button>
                    <Button type="primary" to="/time-line/add">新增时间线</Button>
                </div>
            </div>
            <!-- <Tabs v-model="tabName" type="card">
            <TabPane label="表格显示" name="name1"> -->
            <div style="overflow-x: auto">
                <Table border :columns="columns" :data="data" ref="table" style="min-width: 1400px">
                    <template slot-scope="{ row }" slot="model">
                        <template v-if="modelList.length > 0">
                            <Tag v-for="item in row.model" :key="item">{{ item | modelFilter(modelList) }}</Tag>
                        </template>
                    </template>
                    <template slot-scope="{ row }" slot="tag">
                        <Tag type="border" color="warning">{{ row.tag | tagFilter(tags) }}</Tag>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="updateTimeline(row.timelineId, index)">编辑</Button>
                        <Button type="error" size="small" @click="deleteTimeline(row.timelineId, index)">删除</Button>
                    </template>
                </Table>
            </div>
        </Card>
    </div>
</template>

<script>
import { getSystemList, getTimelineList, delTimeline, getTagList, listModel } from '@/api/index';
import moment from 'moment';
export default {
    name: 'timeline',
    data() {
        return {
            modal: true,
            year: new Date(),
            system: [],
            sysList: [],
            tag: '',
            keyword: '',
            tabName: 'name1',
            modelList: [],
            tags: [],
            data: [],
            lineDate: [],
            exportData: [],
            model: [],
            listModel: [],
            columns: [
                {
                    title: '时间',
                    key: 'time',
                    width: 120,
                    align: 'center',
                },
                {
                    title: '系统',
                    key: 'systemName',
                    width: 200,
                },
                {
                    title: '模块',
                    key: 'model',
                    slot: 'model',
                    width: 200,
                },
                {
                    title: '备注',
                    key: 'description',
                    render(h, params) {
                        return h(
                            'div',
                            {
                                class: 'pre-div',
                            },
                            params.row.description
                        );
                    },
                },
                {
                    title: '标签',
                    slot: 'tag',
                    width: 120,
                },
                {
                    title: '最后更新人',
                    width: 120,
                    render(h, params) {
                        return h(
                            'span',
                            {},
                            params.row.updateUser?params.row.updateUser:params.row.userName
                        );
                    },
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 140,
                    align: 'center',
                },
            ],
        };
    },
    created() {
        getTagList().then((res) => {
            this.tags = res.data;
        });
    },
    filters: {
        tagFilter: function (value, data) {
            return _.find(data, ['id', value]).name;
        },
        modelFilter: function (value, data) {
            if (_.find(data, ['modelId', value])) {
                return _.find(data, ['modelId', value]).modelName;
            } else {
                return '';
            }
        },
    },
    methods: {
        filterModal(system) {
            if (system.length===1) {
                return _.filter(this.modelList,['systemId', system[0]]);
            }
            return [];
        },
        updateTimeline(id, index) {
            //修改
            this.$router.push({ name: 'time-line-edit', query: { id: id } });
        },
        deleteTimeline(id, index) {
            //删除
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除吗？',
                onOk: () => {
                    delTimeline({ id: id }).then((res) => {
                        this.data.splice(index, 1);
                        this.$Message.success('删除成功');
                    });
                },
            });
        },
        seach() {
            this.getlist();
        },
        getlist() {
            //获取列表
            let params = {
                year: moment(this.year).format('YYYY'),
                tag: this.tag,
                system: this.system,
                keyword: this.keyword
            };
            getTimelineList(params).then((res) => {
                if (res.code === 1) {
                    var _this =this;
                    if (this.model.length>0) {
                        var  data = _.filter(res.data, function(o) {
                            return _.intersection(o.model, _this.model).length > 0;
                        });
                        this.data = _.sortBy(data, function (item) {
                            return new Date(item.time).getTime();
                        }).reverse();
                    } else {
                        this.data = _.sortBy(res.data, function (item) {
                            return new Date(item.time).getTime();
                        }).reverse();
                    }
                }
            });
        },
        init() {
            getSystemList().then((res) => {
                this.sysList = res.data;
            });
        },
        modelStr: function (list) {
            var str = [];
            for (var i = 0; i < list.length; i++) {
                str.push(_.find(this.modelList, ['modelId', list[i]]).modelName);
            }
            return str.join('、');
        },
        exportExcel() {
            //导出
            for (var i = 0; i < this.data.length; i++) {
                this.exportData.push({
                    description: this.data[i].description.replaceAll('\n', ''),
                    model: this.modelStr(this.data[i].model),
                    systemName: this.data[i].systemName,
                    tag: _.find(this.tags, ['id', this.data[i].tag]).name,
                    time: this.data[i].time,
                    timelineId: this.data[i].timelineId,
                });
            }
            this.$refs.table.exportCsv({
                filename: '系统时间线',
                columns: [
                    {
                        title: '时间',
                        key: 'time',
                        width: 120,
                        align: 'center',
                    },
                    {
                        title: '系统',
                        key: 'systemName',
                        width: 200,
                    },
                    {
                        title: '模块',
                        key: 'model',
                        width: 300,
                    },
                    {
                        title: '备注',
                        key: 'description',
                    },
                    {
                        title: '标签',
                        key: 'tag',
                        width: 120,
                    },
                ],
                data: this.exportData,
            });
        },
    },
    mounted() {
        this.getlist();
        this.init();
        listModel().then((res) => {
            this.modelList = res.data;
        });
    },
};
</script>
