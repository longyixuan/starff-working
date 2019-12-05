<style lang="less" scoped>
@import "./summary.less";
</style>
<template>
    <Card title="工作总结">
        <Tabs value="tab2" @on-click="changeTab">
            <TabPane label="我的工作总结" name="tab1"></TabPane>
            <TabPane label="总结汇总查询" name="tab2"></TabPane>
        </Tabs>
        <div>
            <Form ref="formInline" inline>
                <FormItem>
                    <DatePicker :value="time" @on-change="change" format="yyyy-MM" type="month" placeholder="请选择年月" style="width: 160px"></DatePicker>
                </FormItem>  
                <FormItem>
                    <Button type="primary" @click="seach">查询</Button>
                </FormItem>
            </Form>
        </div>
        <Table border :columns="columns" :data="list">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.documentName }}</strong>
            </template>
            <template slot-scope="{ row }" slot="time">
                <strong>{{row.year + '-' + row.month}}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="show(row.documentId)">查看</Button>
                <Button type="success" size="small" style="margin-right: 5px" :disabled="!row.status" @click="reset(index,row.documentId)">置为补充状态</Button>
                <Button type="info" size="small" :disabled="row.status" @click="download(row.documentName)">下载</Button>
            </template>
        </Table>
        <div></div>
    </Card>
</template>
<script>
import {
    resetDocument,
    getDocumentListall
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
                        width: 240,
                        align: 'center'
                    }
                ]
            }
        },
        methods: {
            init() {
                getDocumentListall({time: this.time}).then(res => {
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
            changeTab(name) {
                if (name=='tab1') {
                    this.$router.push({name: 'summary'})
                }
            },
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.checkAllGroup = ['尹晓龙', '王利英', '马艳雄','崔永辉','贾晓东'];
                } else {
                    this.checkAllGroup = [];
                }
            },
            checkAllGroupChange (data) {
                if (data.length === 3) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
            show(id) {
                this.$router.push({ name: 'summary-show', params: { id: id }})
            },
            reset(indx,id) {
                resetDocument(id).then(res => {
                    if (res.code == 1) {
                        this.list.splice(indx,1);
                        this.$Message.success('操作成功')
                    }
                })
            },
            change(value) {
                this.time = value;
            }
        },
        mounted() {
            this.init();
        }
    }
</script>