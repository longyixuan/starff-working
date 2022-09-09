<style lang="less">
@import './design.less';
</style>
<template>
    <Card title="选项设置">
        <div style="margin-bottom: 10px; text-align: right">
            <Button type="primary" @click="modal = true">添加选项</Button>
        </div>
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="updateTag(row, index)">编辑</Button>
                <Button type="error" size="small" @click="deleteTag(row.id, index)">删除</Button>
            </template>
            <template slot-scope="{ row, index }" slot="children">
                <Tag type="border" size="medium" closable @on-close="onClose" name="展板设计">展板设计</Tag>
                <Button type="dashed" size="small" @click="onAdd(row, index)">添加</Button>
            </template>
        </Table>
        <Modal title="设置选项" width="800" v-model="modal" @on-ok="add">
            <Form :label-width="80">
                <FormItem label="名称：">
                    <Input v-model="tag"></Input>
                </FormItem>
            </Form>
        </Modal>
    </Card>
</template>
<script>
import {
    addDesignTag,
    listDesignTag,
    editDesignTag,
    delDesignTag
} from '@/api/index';
export default {
    name: 'design',
    data() {
        return {
            modal: false,
            data: [],
            tag: '',
            tag: '',
            id: '',
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '名称',
                    key: 'name',
                    width: 200,
                },
                {
                    title: '子项',
                    key: 'children',
                    slot: 'children'
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
        onClose(event, name) {
            alert(name)
        },
        onAdd(row, index) {
            alert(index)
        },
        add() {
            if (this.id) {
                editDesignTag({
                    id: this.id,
                    name: this.tag
                }).then(res=> {
                    this.$Message.success('修改成功');
                    this.getList();
                })
            } else {
                addDesignTag({name: this.tag}).then(res => {
                    this.$Message.success('添加成功');
                    this.getList();
                });
            }
        },
        updateTag(row) {
            this.id = row.id;
            this.tag = row.name;
            this.modal = true;
        },
        deleteTag(id,index) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除吗？',
                onOk: () => {
                    delDesignTag({
                        id: id
                    }).then(res=> {
                        if (res.code === 1) {
                            this.data.splice(index,1);
                            this.$Message.success('删除成功');
                        } else {
                            this.$Message.success(res.msg);
                        }
                    })
                }
            });
        },
        getList() {
            listDesignTag().then( res => {
                this.data = res.data;
            });
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
