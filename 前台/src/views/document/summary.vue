<style lang="less" scoped>
@import "./summary.less";
</style>
<template>
    <Card dis-hover title="工作总结">
        <template slot="extra">
            <!-- <Button type="primary"  @click="add">MarkDown新增</Button> -->
            <Button type="primary" @click="addTemplate" style="margin-left: 10px">新增</Button>
        </template>
        <Table border :columns="columns" :data="list" style="margin-bottom:20px" @on-selection-change="selectionChange">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.templateName }}</strong>
            </template>
            <template slot-scope="{ row }" slot="time">
                <strong>{{row.year + '-' + row.month}}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="show(row.templateId)">查看</Button>
                <Button type="warning" size="small" :disabled="row.status" style="margin-right: 5px" @click="edit(row.templateId)">修改</Button>
                <Button type="success" size="small" :disabled="row.status" style="margin-right: 5px" @click="commit(index,row.templateId,row.userId)">上报</Button>
                <Button type="error" size="small" :disabled="row.status" style="margin-right: 5px" @click="del(index,row.templateId)">删除</Button>
                <Button type="info" size="small" @click="download(row.templateName)">下载</Button>
            </template>
        </Table>
        <Button type="primary" @click="merge">自动合并生成年终总结</Button>
    </Card>
</template>
<script>
    import {
        getDocumentList,
        getTemplateList,
        commitDocument,
        delDocument,
        mergeTemplate,
        delTemplate,
        commitTemplate
    } from "@/api/index";
    export default {
        data() {
            return {
                list: [],
                selectionList: [],
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'selection',
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
            selectionChange(checkedList) {
                this.selectionList = checkedList;
            },
            merge() {
                this.$Message.warning('正在开发中')
                // mergeTemplate({mergeList: this.selectionList}).then((res) =>{

                // })
            },
            download(fileName) {
                window.location.href = 'http://' + window.location.hostname + ':3333/download/markdown?fileName='+fileName;
            },
            initList() {
                getTemplateList({'userId': JSON.parse(localStorage.getItem('userInfo')).userId}).then(res => {
                    if (res.code==1) {
                        this.list = res.data;
                    }
                })
            },
            commit(indx,templateId,userId) {
                this.confirm('上报之后不可修改和删除，是否要上报？',() => {
                    commitTemplate({'templateId': templateId, 'userId': userId}).then(res => {
                        if (res.code==1) {
                            this.list[indx].status = true;
                            this.$Message.success('上报成功');
                        }
                    })
                })
            },
            show(id) {
                // this.$router.push({ 'name': 'summary-show', 'params': { id: id }})
                this.$router.push({ 'name': 'template-view', 'params': { id: id }})
            },
            edit(id) {
                this.$router.push({ 'name': 'template-edit', 'params': { id: id }})
                // this.$router.push({ 'name': 'summary-edit', 'params': { id: id }})
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