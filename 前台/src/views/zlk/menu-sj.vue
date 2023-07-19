<style lang="less">
@import './zlk.less';
</style>

<template>
    <Card dis-hover title="目录管理">
        <div style="margin-bottom: 10px; text-align: right">
            <Button type="primary" @click="addTag">添加一级目录</Button>
        </div>
        <Table row-key="id" border :data="data" :columns="columns" update-show-children>
            <template slot-scope="{ row, index }" slot="action">
                <span class="action-btn" @click="updateTag(row, index)">编辑</span>
                <span class="action-btn" @click="deleteTag(row.id, index)" style="margin-right: 5px">删除</span>
                <span v-if="!row.pid"  class="action-btn" @click="addTagC(row, index)">添加子目录</span>
            </template>
        </Table>
        <Modal title="编辑" v-model="modal" @on-ok="add">
            <Form :label-width="90">
                <FormItem label="上级目录" v-if="pid">
                    {{pidDes}}
                </FormItem>
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
import { addZlkType, editZlkType, listZlkType, delZlkType } from '@/api/index';
export default {
    name: 'taskZt',
    data() {
        return {
            modal: false,
            data: [],
            tag: '',
            id: '',
            order: 0,
            pid: '',
            pidDes: '',
            type: 'sj',
            columns: [
                {
                    title: '名称',
                    key: 'name',
                    tree: true
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 160
                },
            ],
        };
    },
    methods: {
        add() {
            if (this.id) {
                editZlkType({
                    id: this.id,
                    name: this.tag,
                    order: this.order,
                    pid: this.pid,
                    pidDes: this.pidDes,
                    type: this.type
                }).then((res) => {
                    this.$Message.success('修改成功');
                    this.init();
                });
            } else {
                addZlkType({
                    id: this.id,
                    name: this.tag,
                    order: this.order,
                    pid: this.pid,
                    pidDes: this.pidDes,
                    type: this.type
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
            this.pid = row.pid;
            this.pidDes = row.pidDes;
            this.order = row.order;
            this.modal = true;
        },
        addTag() {
            this.id = '';
            this.tag = '';
            this.pid = '';
            this.pidDes = '';
            this.order = 0;
            this.modal = true;
        },
        addTagC(row,index) {
            this.id = '';
            this.pid = row.id;
            this.pidDes = row.name;
            this.tag = '';
            this.order = 0;
            this.modal = true;
        },
        deleteTag(id, index) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除吗？',
                onOk: () => {
                    delZlkType({
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
            listZlkType({type: this.type}).then((res) => {
                this.data = res.data;
            });
        },
    },
    mounted() {
        this.init();
    },
};
</script>