<style lang="less">
@import './time-line.less';
</style>

<template>
    <div>
        <Card dis-hover title="系统时间线">
            <div style="margin-bottom: 20px" class="clearfix">
                <DatePicker v-model="year" style="width: 120px; margin-right: 10px" type="year" placeholder="请选择年份"></DatePicker>
                <Select clearable filterable style="width: 160px; margin-right: 10px" v-model="pt" placeholder="请选择平台" @on-change="ptChange">
                    <Option :value="item.id" :key="item.id" v-for="item in ptList">{{ item.title }}</Option>
                </Select>
                <Select clearable filterable style="width: 160px; margin-right: 10px" multiple v-model="system" placeholder="请选择系统">
                    <Option :value="item.id" :key="item.id" v-for="item in sysList">{{ item.title }}</Option>
                </Select>
                <Select filterable clearable multiple style="width: 160px; margin-right: 10px" v-model="model" placeholder="请选择模块">
                    <Option :value="item.modelId" :key="item.modelId" v-for="item in filterModal(system)">{{item.modelName}}</Option>
                </Select>
                <Select clearable style="width: 160px; margin-right: 10px" v-model="tag" placeholder="请选择标签">
                    <Option v-for="item in tags" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select clearable v-if="type===1" v-model="departmentId" placeholder="请选择部门" style="width:160px;margin-right: 10px;">
                    <Option v-for="item in departmentList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
                <Input v-model="keyword" style="width: 160px; margin-right: 10px" clearable placeholder="请输入关键字" autocomplete="off" />
                <Button type="primary" style="margin-right: 10px" @click="seach">查询</Button>
                <div style="float: right">
                    <Button type="primary" style="margin-right: 10px" @click="exportExcel">导出Excel</Button>
                    <Button type="primary" to="/time-line/add">新增时间线</Button>
                </div>
            </div>
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
                        <span class="action-btn" @click="updateTimeline(row.timelineId, index)">编辑</span>
                        <span v-if="type===1" class="action-btn" @click="deleteTimeline(row.timelineId, index)">删除</span>
                    </template>
                </Table>
            </div>
        </Card>
    </div>
</template>

<script>
import { getSystemList, getTimelineList, delTimeline, getTagList, listModel, initDepartment, initSystem, loadSystem } from '@/api/index';
import moment from 'moment';
export default {
    name: 'timeline',
    data() {
        return {
            type: 0,
            modal: true,
            year: new Date(),
            system: [],
            sysList: [],
            tag: '',
            keyword: '',
            tabName: 'name1',
            modelList: [],
            tags: [],
            departmentId: '',
            data: [],
            lineDate: [],
            exportData: [],
            model: [],
            listModel: [],
            departmentList: [],
            pt: '',
            ptList: [],
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
                    width: 60,
                    align: 'center',
                },
            ],
        };
    },
    created() {
        this.getParentList();
        getTagList().then((res) => {
            this.tags = res.data;
        });
        initSystem().then(res => {
            this.ptList = res.data;
        })
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
        ptChange(value) {
            this.system = [];
            if (value) {
                loadSystem(value).then((res) => {
                    this.sysList = res.data;
                });
            } else {
                getSystemList().then((res) => {
                    this.sysList = res.data;
                });
            }
        },
        getParentList() {
            initDepartment().then(res => {
                if (res.code === 1) {
                    this.departmentList = res.data;
                }
            });
        },
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
                pt: this.pt,
                system: this.system,
                keyword: this.keyword,
                userName: JSON.parse(localStorage.getItem('userInfo')).nickName,
                type: JSON.parse(localStorage.getItem('userInfo')).type,
                departmentId: this.departmentId
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
        this.type = JSON.parse(localStorage.getItem('userInfo')).type;
        if (this.type === 1) {
            this.columns[this.columns.length-1].width = 100;
        }
        listModel().then((res) => {
            this.modelList = res.data;
        });
    },
};
</script>
