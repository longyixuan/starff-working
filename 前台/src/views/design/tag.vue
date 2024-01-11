<style lang="less">
@import './design.less';
</style>
<template>
    <Card dis-hover title="选项设置">
        <div style="margin-bottom: 16px; text-align: right">
            <Button type="primary" @click="addXx">添加选项</Button>
        </div>
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row, index }" slot="action">
                <span class="action-btn" @click="updateTag(row, index)">编辑</span>
                <span class="action-btn" @click="deleteTag(row.id, index)">删除</span>
            </template>
            <template slot-scope="{ row, index }" slot="children">
                <Tag style="cursor: pointer;" v-for="item in row.child" :key="item.id" type="border" size="medium" closable @click.native="onEdit(row.id, item)" @on-close="onClose" :name="item.id">{{item.name}}{{item.hasDes?'【展示备注】':''}}</Tag>
                <Button type="dashed" size="small" @click="onAdd(row, index)">添加</Button>
            </template>
            <template slot-scope="{ row }" slot="hasDes">
                {{row.hasDes?'是':'否'}}
            </template>
        </Table>
        <Modal title="设置选项" width="800" v-model="modal" @on-ok="add">
            <Form :label-width="120">
                <FormItem label="名称：">
                    <Input v-model="tag"></Input>
                </FormItem>
                <FormItem label="单位名称：">
                    <Input v-model="unit"></Input>
                </FormItem>
                <FormItem label="展示备注：">
                    <Checkbox v-model="hasDes"></Checkbox>
                </FormItem>
            </Form>
        </Modal>
        <Modal title="设置子选项" width="800" v-model="modal2" @on-ok="add2">
            <Form :label-width="120">
                <FormItem label="父选项：">
                    {{mc}}
                </FormItem>
                <FormItem label="名称：">
                    <Input v-model="tag2"></Input>
                </FormItem>
                <FormItem label="展示备注：">
                    <Checkbox v-model="hasDes2"></Checkbox>
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
            modal2: false,
            data: [],
            tag: '',
            unit: '个数',
            hasDes: true,
            tag2: '',
            hasDes2: true,
            id: '',
            id2: '',
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
                    title: '单位名称',
                    key: 'unit',
                    width: 100
                },
                {
                    title: '是否展示备注',
                    width: 130,
                    key: 'hasDes',
                    align: 'center',
                    slot: 'hasDes'
                },
                {
                    title: '子项',
                    key: 'children',
                    slot: 'children'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 100
                }
            ],
        };
    },
    computed: {
        mc() {
            if (this.id) {
                return _.find(this.data, ['id', this.id]).name;
            } else {
                return ''
            }
        }
    },
    methods: {
        onClose(event, name) {
            this.deleteTag(name,0);
        },
        onAdd(row, index) {
            this.modal2 = true;
            this.id = row.id;
            this.id2 = '';
        },
        addXx () {
            this.modal = true;
            this.tag = '';
            this.hasDes = true;
            this.id = '';
        },
        onEdit(id, row) {
            this.id = id;
            this.id2 = row.id;
            this.tag2 = row.name;
            this.hasDes2 = row.hasDes;
            this.modal2 = true;
        },
        add() {
            if (this.id) {
                editDesignTag({
                    parentId: 'root',
                    id: this.id,
                    name: this.tag,
                    unit: this.unit,
                    hasDes: this.hasDes
                }).then(res=> {
                    this.$Message.success('修改成功');
                    this.getList();
                })
            } else {
                addDesignTag({
                    parentId: 'root',
                    name: this.tag,
                    unit: this.unit,
                    hasDes: this.hasDes
                }).then(res => {
                    this.$Message.success('添加成功');
                    this.getList();
                });
            }
        },
        add2() {
            if (this.id2) {
                editDesignTag({
                    parentId: this.id,
                    id: this.id2,
                    name: this.tag2,
                    unit: this.unit,
                    hasDes: this.hasDes2
                }).then(res=> {
                    this.$Message.success('修改成功');
                    this.getList();
                })
            } else {
                addDesignTag({
                    parentId: this.id,
                    name: this.tag2,
                    unit: this.unit,
                    hasDes: this.hasDes2
                }).then(res => {
                    this.$Message.success('添加成功');
                    this.getList();
                });
            }
        },
        updateTag(row) {
            this.id = row.id;
            this.tag = row.name;
            this.hasDes = row.hasDes;
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
                            this.getList();
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
