<style lang="less">
@import './tasklist.less';
</style>

<template>
    <Card :title="'任务清单管理 - ' + name">
        <Table :columns="columns" :data="list" border :disabled-hover="true" :span-method="spanMethod" style="margin-bottom: 20px">
            <template slot-scope="{ row }" slot="dsj">
                <template v-if="row.zt == 'dsj'">
                    <Tooltip content="待设计">
                        <Icon type="md-flag" color="#808695" size="16"/>
                    </Tooltip>
                </template>
            </template>
            <template slot-scope="{ row }" slot="sjz">
                <template v-if="row.zt == 'sjz'">
                    <Tooltip content="设计中">
                        <Icon type="md-flag" color="#808695" size="16"/>
                    </Tooltip>
                </template>
            </template>
            <template slot-scope="{ row }" slot="dkf">
                <template v-if="row.zt == 'dkf'">
                    <Tooltip content="待开发">
                        <Icon type="md-flag" color="#808695" size="16"/>
                    </Tooltip>
                </template>
            </template>
            <template slot-scope="{ row }" slot="kfz">
                <template v-if="row.zt == 'kfz'">
                    <Tooltip content="开发中">
                        <Icon type="md-flag" color="#808695" size="16"/>
                    </Tooltip>
                </template>
            </template>
            <template slot-scope="{ row }" slot="dcs">
                <template v-if="row.zt == 'dcs'">
                    <Tooltip content="待测试">
                        <Icon type="md-flag" color="#808695" size="16"/>
                    </Tooltip>
                </template>
            </template>
            <template slot-scope="{ row }" slot="csz">
                <template v-if="row.zt == 'csz'">
                    <Tooltip content="测试中">
                        <Icon type="md-flag" color="#808695" size="16"/>
                    </Tooltip>
                </template>
            </template>
            <template slot-scope="{ row }" slot="dfb">
                <template v-if="row.zt == 'dfb'">
                    <Tooltip content="待发布">
                        <Icon type="md-flag" color="#808695" size="16"/>
                    </Tooltip>
                </template>
            </template>
            <template slot-scope="{ row }" slot="yfb">
                <template v-if="row.zt == 'yfb'">
                    <Icon type="md-checkmark" color="#19be6b" size="20"/>
                </template>
            </template>
        </Table>
        <Button type="primary" :to="'/tasklist/add?id='+ id">编辑</Button>
        <Button type="default" to="/tasklist/list" style="margin-left: 10px;">返回</Button>
    </Card>
</template>
<script>
import { getTaskDetail, getTaskConfigList } from '@/api/index';
export default {
    name: 'taskZt',
    data() {
        return {
            name: '',
            id: '',
            columns: [
                {
                    key: 'index',
                    title: '序号',
                    width: 80,
                    align: 'center',
                },
                {
                    title: '栏目',
                    key: 'lmmc',
                },
                {
                    title: '页面/说明',
                    key: 'ymsm',
                },
                {
                    title: '客户端',
                    key: 'khd',
                    width: 80,
                },
                {
                    title: '待设计',
                    slot: 'dsj',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '预计设计时间',
                    key: 'sjsj',
                },
                {
                    title: '设计中',
                    slot: 'sjz',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '待开发',
                    slot: 'dkf',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '预计开发时间',
                    key: 'kfsj',
                },
                {
                    title: '开发中',
                    slot: 'kfz',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '待测试',
                    slot: 'dcs',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '测试中',
                    slot: 'csz',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '待发布',
                    slot: 'dfb',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '已发布',
                    slot: 'yfb',
                    align: 'center',
                    width: 80,
                }
            ],
            list: []
        };
    },
    computed: {},
    methods: {
        sortList() {
            this.list =  _.sortBy(this.list, ['index', 'khd'], ['asc', 'desc']);
        },
        spanMethod({ row, column, rowIndex }) {
            if (column.key == 'lmmc' || column.key == 'ymsm' || column.key == 'index') { // 前3列需要合并单元格
                if (rowIndex != (this.list.length-1) && row.lmmc == this.list[rowIndex+1].lmmc) { // 第一行
                    return { rowspan: 2, colspan: 1 }
                }
                if (rowIndex !== 0 && row.lmmc == this.list[rowIndex-1].lmmc) {
                    return { rowspan: 0, colspan: 0 }
                }
            }
        },
        init() {
            getTaskConfigList().then((res) => {
                this.ztList = res.data;
            });
            if (this.id !='') {
                getTaskDetail({ id: this.id }).then((res) => {
                    if (res.code === 1) {
                        this.name = res.data.name;
                        this.list = res.data.list;
                        this.id = res.data.id;
                        this.sortList();
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            }
        },
    },
    mounted() {
        if (this.$route.query.id) {
            this.id = this.$route.query.id;
        }
        this.init();
    },
};
</script>
