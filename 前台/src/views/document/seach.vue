<style lang="less" scoped>
@import "./summary.less";
</style>
<template>
    <Card dis-hover title="工作总结">
        <Form ref="formInline" inline>
            <FormItem>
                <DatePicker :value="time" @on-change="change" format="yyyy-MM" type="month" placeholder="请选择年月" style="width: 160px"></DatePicker>
            </FormItem>  
            <FormItem>
                <Button type="primary" @click="seach">查询</Button>
            </FormItem>
        </Form>
        <Table border @on-select="tableSelected" :columns="columns" :data="list" style="margin-bottom:20px">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.templateName }}</strong>
            </template>
            <template slot-scope="{ row }" slot="time">
                <strong>{{row.year + '-' + row.month}}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="show(row.templateId)">查看</Button>
                <Button type="warning" size="small" style="margin-right: 5px" :disabled="!row.status" @click="reset(index,row.templateId)">置为补充状态</Button>
                <Button type="info" size="small" @click="download(row.templateName)">下载</Button>
            </template>
        </Table>
        <Button type="primary" @click="merage">合并勾选并生成部门总结</Button>
    </Card>
</template>
<script>
import {
    resetDocument,
    getDocumentListall,
    getTemplateListall,
    resetTemplate,
    mergeTemplate
} from "@/api/index";
export default {
        data () {
            return {
                time: '',
                single: false,
                indeterminate: true,
                checkAll: false,
                list: [],
                checkAllGroup: [],
                selectionData: [],
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
                        title: '用户名',
                        width: 120,
                        align: 'center',
                        key: 'userName'
                    },
                    {
                        title: '姓名',
                        width: 120,
                        align: 'center',
                        key: 'nickName'
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
                        width: 240,
                        align: 'center'
                    }
                ]
            }
        },
        methods: {
            tableSelected(selection) {
                this.selectionData = selection;
            },
            init() {
                getTemplateListall({time: this.time}).then(res => {
                    if (res.code == 1) {
                        this.list = res.data;
                    }
                })
            },
            download(fileName) {
                window.location.href = 'http://' + window.location.hostname + ':3333/download/markdown?fileName='+fileName;
            },
            seach() {
                this.init();
            },
            show(id) {
                this.$router.push({ 'name': 'template-view', 'params': { id: id }})
                // this.$router.push({ name: 'summary-show', params: { id: id }})
            },
            reset(indx,id) {
                this.confirm('置为可修改状态？',() =>{
                    resetTemplate(id).then(res => {
                        if (res.code == 1) {
                            this.list.splice(indx,1);
                            this.$Message.success('操作成功')
                        }
                    })
                })
            },
            change(value) {
                this.time = value;
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
            merage() {
                mergeTemplate({mergeList: this.selectionData}).then(res => {
                    console.log(res);
                })
            }
        },
        mounted() {
            this.init();
        }
    }
</script>