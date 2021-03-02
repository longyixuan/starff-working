<style lang="less">
@import "./summary.less";
</style>
<template>
    <Card title="各系统模块管理">
        <Table border :columns="columns" :data="sysList">
            <template slot="input">
                <Input v-model="title" placeholder="合并后模块名称"></Input>
            </template>
            <template slot-scope="{ row }" slot="modal">
                <Tag :checked="false" style="cursor: pointer;" color="primary" checkable :key="item.modelId" :name="item.modelId" v-for="item in filterModal(row.id)" @on-change="onChange">{{item.modelName}}</Tag>
            </template>
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" @click="merge(row)">合并</Button>
            </template>
        </Table>
    </Card>
</template>
<script>
import {
    getSystemList,
    mergeModel,
    listModel
} from "@/api/index";
export default {
    data() {
        return{
            modal: false,
            title: '',
            sysList: [],
            modelList: [],
            mergeList: [],
            columns: [
                {
                    type: 'index',
                    width: 80,
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
                },
                {
                    title: '更新后模块名称',
                    width: 200,
                    slot: 'input'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 100,
                    align: 'center'
                }
            ]
        }
    },
    methods: {
        onChange(checked, name) {
            if (checked) {
                this.mergeList.push(name);
            } else {
                this.mergeList.splice(this.mergeList.findIndex(item => item === name), 1)
            }
            console.log(this.mergeList)
        },
        merge(row) {
            mergeModel({
                title: this.title,
                system: row.id,
                mergeList: this.mergeList
            }).then(res => {
                this.$Message.success('操作成功');
            })
        },
        filterModal(id) {
            return _.filter(this.modelList,['systemId', id]);
        },
        init() {
            listModel().then(res => {
                this.modelList = res.data;
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