<style lang="less">
@import './index.less';
</style>
<template>
    <Card dis-hover title="所属平台">
        <div style="margin-bottom: 20px;">
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
import { addTagFzxt, editTagFzxt, getTagListFzxt, delTagFzxt } from '@/api/index';
export default {
    name: 'timeline',
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
                    title: '所属平台',
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
            if (this.tag === '') {
                this.$Message.error('所属平台不可为空');
                return;
            }
            if (this.id) {
                editTagFzxt({
                    id: this.id,
                    name: this.tag,
                    order: this.order
                }).then((res) => {
                    this.$Message.success('修改成功');
                    this.init();
                });
            } else {
                addTagFzxt({
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
                    delTagFzxt({
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
            getTagListFzxt().then((res) => {
                this.data = res.data;
            });
        },
    },
    mounted() {
        this.init();
    },
};
</script>
