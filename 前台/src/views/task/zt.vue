<style lang="less">
@import './task.less';
</style>

<template>
    <Card dis-hover title="任务管理 - 状态管理">
        <div style="margin-bottom: 16px; text-align: right">
            <Button type="primary" @click="addTag">添加</Button>
        </div>
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row, index }" slot="action">
                <span class="action-btn" @click="updateTag(row, index)">编辑</span>
                <span class="action-btn" @click="deleteTag(row.id, index)">删除</span>
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
import { addTaskTag, editTaskTag, getTaskTagList, delTaskTag } from '@/api/index';
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
                    width: 100,
                    align: 'center',
                },
            ],
        };
    },
    methods: {
        add() {
            if (this.id) {
                editTaskTag({
                    id: this.id,
                    name: this.tag,
                    order: this.order
                }).then((res) => {
                    this.$Message.success('修改成功');
                    this.init();
                });
            } else {
                addTaskTag({
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
                    delTaskTag({
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
            getTaskTagList().then((res) => {
                this.data = res.data;
            });
        },
    },
    mounted() {
        this.init();
    },
};
</script>