<style lang="less" scoped>
@import "./summary.less";
</style>
<template>
    <Card title="工作总结">
        <template slot="extra">
            <Button type="primary"  @click="add">MarkDown新增</Button>
            <Button type="primary" @click="addTemplate" style="margin-left: 10px">模板新增</Button>
        </template>
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
                <Button type="error" size="small" :disabled="row.status" style="margin-right: 5px" @click="del(index,row.documentId)">删除</Button>
                <Button type="info" size="small" @click="download(row.documentName)">下载</Button>
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
                        width: 290,
                        align: 'center'
                    }
                ]
            }
        },
        methods: {
            download(fileName) {
                window.location.href = 'http://' + window.location.hostname + ':3333/download/markdown?fileName='+fileName;
            },
            initList() {
                getDocumentList({'userId': JSON.parse(localStorage.getItem('userInfo')).userId}).then(res => {
                    if (res.code==1) {
                        this.list = res.data;
                    }
                })
            },
            commit(indx,documentId,userId) {
                this.confirm('上报之后不可修改和删除，是否要上报？',() => {
                    commitDocument({'documentId': documentId, 'userId': userId}).then(res => {
                        if (res.code==1) {
                            this.list[indx].status = true;
                            this.$Message.success('上报成功');
                        }
                    })
                })
            },
            show(id) {
                this.$router.push({ 'name': 'summary-show', 'params': { id: id }})
            },
            edit(id) {
                this.$router.push({ 'name': 'summary-edit', 'params': { id: id }})
            },
            add() {
                this.$router.push({ 'name': 'summary-edit', 'params': { id: '' }})
            },
            del(idnx,id) {
                this.confirm('确定要删除？',() => {
                    delDocument(id).then(res => {
                        if(res.code==1) {
                            this.list.splice(idnx,1);
                            this.$Message.success('删除成功');
                        }
                    })
                });
            },
            confirm(tip,callback) {
                this.$Modal.confirm({
                    title: "提示",
                    content: tip,
                    onOk: () => {
                        callback();
                    }
                });
            },
            addTemplate() {
                this.$router.push({ 'name': 'summary-template'})
            }
        },
        mounted() {
            this.initList();
        }
    }
</script>