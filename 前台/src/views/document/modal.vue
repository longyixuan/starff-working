<style lang="less">
@import "./summary.less";
</style>
<template>
    <Card title="各系统模块管理">
        <div style="text-align:right;margin-bottom: 20px;">
            <Button type="warning" @click="refresh">更新工作总结旧数据</Button>
        </div>
        <Table border :columns="columns" :data="sysList">
            <template slot-scope="{ row }" slot="modal">
                <Tag style="cursor: pointer;" closable :name="item.modelId" v-for="item in filterModal(row.id)" @click.native="editModal(row.id,item)" @on-close="deleteModal">{{item.modelName}}</Tag>
                <Button icon="ios-add" type="dashed" size="small" @click="updateModal(row.id)">添加</Button>
            </template>
        </Table>
        <Modal v-model="modal" @on-ok="add" title="编辑模块">
            <Form :label-width="80">
                <FormItem label="系统名称">
                    <Select placeholder="选择系统" disabled v-model="systemId" filterable>
                        <Option v-for="item in sysList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="模块名称">
                    <Input v-model="model" placeholder="填写模块名称"></Input>
                </FormItem>
            </Form>
        </Modal>
    </Card>
</template>
<script>
import {
    addModel,
    updateModel,
    getSystemList,
    deleteModel,
    refreshModel,
    listModel
} from "@/api/index";
export default {
    data() {
        return{
            modal: false,
            sysList: [],
            systemId: '',
            model: '',
            modelId: '',
            modelList: [],
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '系统名称',
                    key: 'title',
                    width: 300
                },
                {
                    title: '模块',
                    slot: 'modal'
                }
            ]
        }
    },
    methods: {
        refresh() {
            refreshModel().then(res=>{
                if (res.code === 1) {
                    this.$Message.success('数据更新成功');
                }
            });
        },
        filterModal(id) {
            return _.filter(this.modelList,['systemId', id]);
        },
        updateModal(id) {
            this.systemId = id;
            this.modal = true;
        },
        editModal(id,obj) {
            this.systemId = id;
            this.modelId = obj.modelId;
            this.model = obj.modelName;
            this.modal = true;
        },
        deleteModal(event,name) {
            deleteModel({id: name}).then( res=> {
                this.$Message.success('删除成功');
                this.init();
            })
        },
        add() {
            if (this.modelId) {
                this.edit();
            } else {
                addModel({systemId: this.systemId, modelName: this.model}).then(res=>{
                    this.modal = false;
                    this.$Message.success('添加成功');
                    this.init();
                })
            }
        },
        init() {
            listModel().then(res => {
                this.modelList = res.data;
            })
        },
        edit() {
            updateModel({systemId: this.systemId, modelName: this.model,id: this.modelId}).then(res=>{
                this.modal = false;
                this.$Message.success('修改成功');
            })
        }
    },
    mounted() {
        listModel().then(res => {
            this.modelList = res.data;
            getSystemList().then(res => {
                this.sysList = res.data;
            })
        })
    }
}
</script>