<style lang="less">
@import './tasklist.less';
</style>

<template>
    <Card dis-hover title="任务清单管理 - 状态管理">
        <div style="margin-bottom: 16px; text-align: right">
            <Button type="primary" @click="addTag">添加</Button>
        </div>
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="updateTag(row, index)">编辑</Button>
                <Button type="error" size="small" @click="deleteTag(row.id, index)">删除</Button>
            </template>
        </Table>
        <Modal title="编辑" v-model="modal" @on-ok="add">
            <Form :label-width="60">
                <FormItem label="名称">
                    <Input placeholder="输入名称" v-model="tag"></Input>
                </FormItem>
                <FormItem label="排序">
                    <InputNumber :min="0" v-model="order"></InputNumber>
                </FormItem>
            </Form>
        </Modal>
    </Card>
</template>
<script>
import { addTaskConfig, editTaskConfig, getTaskConfigList, delTaskConfig } from '@/api/index';
export default {
    name: 'taskZt',
    data() {
        return {
            modal: false,
            data: [],
            tag: '',
            id: '',
            order: 0,
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '任务状态',
                    key: 'name',
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
    methods: {
        add() {
            if (this.id) {
                editTaskConfig({
                    id: this.id,
                    name: this.tag,
                    order: this.order
                }).then((res) => {
                    this.$Message.success('修改成功');
                    this.init();
                });
            } else {
                addTaskConfig({
                    id: this.id,
                    name: this.tag,
                    order: this.order
                }).then((res) => {
                    if (res.code === 1) {
                        this.$Message.success('添加成功');
                    } else {
                        this.$Message.error(res.msg);
                    }
                    this.init();
                });
            }
        },
        updateTag(row) {
            this.id = row.id;
            this.tag = row.name;
            this.order = row.order;
            this.modal = true;
        },
        addTag() {
            this.id = '';
            this.tag = '';
            this.order = 0;
            this.modal = true;
        },
        deleteTag(id, index) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除吗？',
                onOk: () => {
                    delTaskConfig({
                        id: id,
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
        },
        init() {
            getTaskConfigList().then((res) => {
                this.data = res.data;
            });
        },
    },
    mounted() {
        this.init();
    },
};
</script>