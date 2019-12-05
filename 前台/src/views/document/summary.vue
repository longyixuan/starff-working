<style lang="less" scoped>
@import "./summary.less";
</style>
<template>
    <Card title="工作总结">
        <Tabs value="tab1"  @on-click="changeTab">
            <TabPane label="我的工作总结" name="tab1"></TabPane>
            <TabPane label="总结汇总查询" name="tab2" @on-click="$router.push('summary-seach')"></TabPane>
            <Button size="small" type="primary" slot="extra" @click="add">新增</Button>
        </Tabs>
        <Table border :columns="columns" :data="list">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.documentName }}</strong>
            </template>
            <template slot-scope="{ row }" slot="time">
                <strong>{{row.year + '-' + row.month}}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="show(row.documentId)">查看</Button>
                <Button type="warning" size="small" :disabled="row.status" style="margin-right: 5px" @click="edit(row.documentId)">修改</Button>
                <Button type="success" size="small" :disabled="row.status" style="margin-right: 5px" @click="commit(index,row.documentId,row.userId)">上报</Button>
                <Button type="error" size="small" :disabled="row.status" @click="del(index,row.documentId)">删除</Button>
            </template>
        </Table>
    </Card>
</template>
<script>
    import {
        getDocumentList,
        commitDocument,
        delDocument
    } from "@/api/index";
    export default {
        data() {
            return {
                list: [],
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        slot: 'name'
                    },
                    {
                        title: '时间',
                        width: 90,
                        align: 'center',
                        slot: 'time'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 230,
                        align: 'center'
                    }
                ]
            }
        },
        methods: {
            changeTab(name) {
                if (name=='tab2') {
                    this.$router.push({name:'summary-seach'})
                }
            },
            initList() {
                getDocumentList({userId: JSON.parse(localStorage.getItem('userInfo')).userId}).then(res => {
                    if (res.code==1) {
                        this.list = res.data;
                    }
                })
            },
            commit(indx,documentId,userId) {
                commitDocument({documentId: documentId, userId: userId}).then(res => {
                    if (res.code==1) {
                        this.list[indx].status = true;
                        this.$Message.success('上报成功');
                    }
                })
            },
            show(id) {
                this.$router.push({ name: 'summary-show', params: { id: id }})
            },
            edit(id) {
                this.$router.push({ name: 'summary-edit', params: { id: id }})
            },
            add() {
                this.$router.push({ name: 'summary-edit', params: { id: '' }})
            },
            del(idnx,id) {
                delDocument(id).then(res => {
                    if(res.code==1) {
                        this.list.splice(idnx,1);
                        this.$Message.success('删除成功');
                    }
                })
            }
        },
        mounted() {
            this.initList();
        }
    }
</script>