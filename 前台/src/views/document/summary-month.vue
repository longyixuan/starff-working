<style lang="less" scoped>
@import "./summary.less";
</style>
<template>
    <Card title="月总结">
        <Tabs value="my" :animated="false">
            <TabPane label="部门总结" name="part" v-if="type==1">
                <Row :gutter="20" style="margin-bottom: 20px;">
                    <Col span="16">
                        <Select clearable multiple placeholder="选择员工" v-model="people" class="margin-bottom20">
                        <Option
                            v-for="item in peopleList"
                            :value="item.userId"
                            :key="item.userId"
                        >{{ !!item.nickName? item.nickName: item.userName}}</Option>
                        </Select>
                    </Col>
                    <Col span="8">
                        <Button type="primary" ghost @click="people=[]" class="margin-bottom20">清空选择</Button>
                        <Button
                        type="primary"
                        ghost
                        @click="peopleAll"
                        class="margin-bottom20"
                        style="margin-left: 10px;"
                        >选择全部</Button>
                        <Button type="primary" class="margin-bottom20" @click="seach" style="margin-left: 10px;">查询</Button>
                    </Col>
                </Row>
                
                <Table border :columns="columnPart" :data="listPart" style="margin-bottom:20px" @on-selection-change="selectionChangePart">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row._id.documentName }}</strong>
                    </template>
                    <template slot-scope="{ row }" slot="people">
                        <strong>{{row.details[0].nickName}}</strong>
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row._id.documentId)">查看</Button>
                        <Button type="warning" size="small" style="margin-right: 5px" @click="commit(index,row._id.documentId,false)">退回</Button>
                        <!-- <Button type="info" size="small" @click="download(row.documentName)">下载</Button> -->
                    </template>
                </Table>
                <Button type="warning" @click="mergePart">归档</Button>
            </TabPane>
            <TabPane label="我的总结" name="my">
                <Table border :columns="columns" :data="list" style="margin-bottom:20px" @on-selection-change="selectionChange">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row._id.documentName }}</strong>
                    </template>
                    <template slot-scope="{ row }" slot="time">
                        <strong>{{row._id.year}}-{{row._id.month}}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row._id.documentId)">查看</Button>
                        <Button type="primary" :disabled="row.details[0].status" size="small" style="margin-right: 5px" @click="edit(row._id.documentId)">修改</Button>
                        <Button type="error" :disabled="row.details[0].status" size="small" style="margin-right: 5px" @click="del(index,row._id.documentId)">删除</Button>
                        <Button type="warning" :disabled="row.details[0].status" size="small" style="margin-right: 5px" @click="commit(index,row._id.documentId,true)">上报</Button>
                        <!-- <Button type="info" size="small" @click="download(row.documentName)">下载</Button> -->
                    </template>
                </Table>
                <Button type="primary" @click="merge">合并查看</Button>
            </TabPane>
        </Tabs>
    </Card>
</template>
<script>
    import {
        getAllUserData,
        listDocumentday,
        seachDocumentmonth,
        delteDocumentday,
        commitDocument,
        addDocumentday,
        toDocumentweek,
        commitDocumentMonth
    } from "@/api/index";
    import {
        getAll,
        getWeekStartDate,
        getWeekEndDate,
        getMonthStartDate,
        getMonthEndDate,
        getLastMonthStartDate,
        getLastMonthEndDate
    } from "@/libs/timeHelp";
    import moment from "moment";
    export default {
        data() {
            return {
                list: [],
                listPart: [],
                showdate: [],
                type: 0,
                startTime: '',
                endTime: '',
                selectionList: [],
                selectionListPart: [],
                time: new Date(),
                peopleList: [],
                people: [],
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
                        title: '日期',
                        width: 120,
                        align: 'center',
                        slot: 'time'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 240,
                        align: 'center'
                    }
                ],
                columnPart: [
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
                        title: '人员',
                        width: 100,
                        align: 'center',
                        slot: 'people'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 140,
                        align: 'center'
                    }
                ]
            }
        },
        filters: {
            timeFilter(value) {
                return moment(value).format('YYYY年MM月DD日');
            }
        },
        methods: {
            handelChange(date) {
                this.startTime = date[0];
                this.endTime = date[1];
            },
            selectionChange(checkedList) {
                this.selectionList = checkedList;
            },
            selectionChangePart(checkedList) {
                this.selectionListPart = checkedList;
            },
            peopleAll() {
                this.people = [];
                for (let i = 0; i < this.peopleList.length; i++) {
                    let element = this.peopleList[i];
                    this.people.push(element.userId);
                }
            },
            commit(indx,documentId,status) {
                let title = status?'上报之后不可修改和删除，是否要上报？':'退回之后不可查看，是否要退回？'
                this.confirm(title,() => {
                    commitDocumentMonth({'documentId': documentId,'status': status}).then(res => {
                        if (res.code==1) {
                            if (status) {
                                this.$set(this.list[indx].details[0],'status',status);
                                this.$Message.success('上报成功');
                            } else {
                                this.listPart.splice(indx, 1);
                                this.$Message.success('退回成功');
                            }
                            
                        }
                    })
                })
            },
            getUserList() {
                getAllUserData().then(res => {
                    if (res.code === 1) {
                        this.peopleList = res.data;
                    }
                });
            },
            merge() {
                var mergeList = [];
                var day = [];
                if (this.selectionList.length==0) {
                    this.$Message.error('请选择要合并的总结');
                    return;
                }
                for (let i = 0; i<this.selectionList.length; i++) {
                    mergeList.push(
                        this.selectionList[i]._id.documentId
                    );
                    day.push(this.selectionList[i].details[0].day)
                }
                this.$router.push({ 'name': 'summary-merge', 'query': { mergeList: mergeList, type: 'month'}})
            },
            mergePart() {
                var mergeList = [];
                if (this.selectionListPart.length==0) {
                    this.$Message.error('请选择要合并的总结');
                    return;
                }
                if (this.selectionListPart.length<2) {
                    this.$Message.error('请至少选择2行内容进行合并归档');
                    return;
                }
                for (let i = 0; i<this.selectionListPart.length; i++) {
                    mergeList.push(
                        this.selectionListPart[i]._id.documentId
                    );
                }
                let routeData = this.$router.resolve({
                    name: 'summary-merge',
                    query: { mergeList: mergeList, type: 'month', admin: true }
                });
                window.open(routeData.href, '_blank');
            },
            download(fileName) {
                window.location.href = 'http://' + window.location.hostname + ':3333/download/markdown?fileName='+fileName;
            },
            initList() {
                listDocumentday('month',{
                    userId: JSON.parse(localStorage.getItem('userInfo')).userId,
                    year: moment(this.time).format('YYYY')
                }).then(res => {
                    if (res.code==1) {
                        this.list = res.data;
                        this.$Message.success('查询成功');
                    }
                })
            },
            seach() {
                let postData = {
                    people: this.people,
                    system: this.system
                };
                if (this.people.length==0) {
                    this.$Message.info('查询条件必填')
                    return;
                }
                seachDocumentmonth(postData).then((res)=>{
                    this.listPart = res.data;
                    this.$Message.success('查询成功');
                })
            },
            show(id) {
                let routeData = this.$router.resolve({
                    name: 'summary-details',
                    query: { id: id, type: 'month' }
                });
                window.open(routeData.href, '_blank');
            },
            edit(id) {
                this.$router.push({ 'name': 'summary-editmonth', 'query': { id: id ,type: 'month'}});
            },
            del(idnx,id) {
                this.confirm('确定要删除？',() => {
                    delteDocumentday('month', {documentId: id}).then(res => {
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
            mergeWeek() {
                var mergeList = [];
                for (let i = 0; i<this.selectionList.length; i++) {
                    mergeList.push(
                        this.selectionList[i]._id.documentId
                    );
                }
                var postData = {
                    documentName: '设计部2020年05月25日-29日工作总结（姓名）',
                    userId: JSON.parse(localStorage.getItem('userInfo')).userId,
                    userName: JSON.parse(localStorage.getItem('userInfo')).userName,
                    nickName: JSON.parse(localStorage.getItem('userInfo')).nickName,
                    year: '2020',
                    startDay: '2020-05-25',
                    endDay: '2020-05-29',
                    list: mergeList
                };
                toDocumentweek(postData).then(res => {
                    
                })
            },
            addTemplate() {
                this.$router.push({ 'name': 'summary-edit', 'query': { id: '' ,type: 'day'}})
            }
        },
        mounted() {
            this.initList();
            this.getUserList();
            this.type = JSON.parse(localStorage.getItem('userInfo')).type;
            this.peopleAll();
        }
    }
</script>