<style lang="less">
@import './tasklist.less';
</style>

<template>
    <Card dis-hover title="任务清单管理">
        <div style="margin-bottom: 16px; text-align: right">
            <Button type="primary" to="/tasklist/add">新增</Button>
        </div>
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row, index }" slot="action">
                <a class="action-btn" :href="'/tasklist/show?id='+ row.id">查看</a>
                <a class="action-btn" :href="'/tasklist/add?id='+ row.id">编辑</a>
                <span class="action-btn" @click="removeTask(row.id, index)">删除</span>
            </template>
        </Table>
    </Card>
</template>
<script>
import { getTaskList, removeTask } from '@/api/index';
export default {
    name: 'taskZt',
    data() {
        return {
            modal: false,
            data: [],
            name: '',
            id: '',
            order: 0,
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '名称',
                    key: 'name',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 130,
                    align: 'center'
                },
            ],
        };
    },
    methods: {
        init() {
            getTaskList().then((res) => {
                this.data = res.data;
            });
        },
        removeTask(id, index) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除吗？',
                onOk: () => {
                    removeTask({
                        id: id
                    }).then((res) => {
                        if (res.code === 1) {
                            this.data.splice(index, 1);
                            this.$Message.success('删除成功');
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                },
            });
        }
    },
    mounted() {
        this.init();
    },
};
</script>