<style lang="less" scoped>
@import "./summary.less";
</style>
<template>
    <Card title="日总结">
        <Tabs value="my" :animated="false">
            <TabPane label="我的工时" name="my">
                <div style="margin-bottom: 20px;">
                    <DatePicker v-model="time" format="yyyy年MM月" type="month" placeholder="工作总结时间"></DatePicker>
                    <Button type="primary" @click="initList" style="margin-left: 10px;">查询</Button>
                    <Button type="primary" @click="addTemplate" style="margin-left: 10px">新增</Button>
                </div>
                <Table border :columns="columns" :data="list" style="margin-bottom:20px" @on-selection-change="selectionChange">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row._id.documentName }}</strong>
                    </template>
                    <template slot-scope="{ row }" slot="time">
                        <strong>{{row.details[0].year + '-' + row.details[0].month + '-' + row.details[0].day}}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row._id.documentId)">查看</Button>
                        <Button type="primary" :disabled="row.details[0].status" size="small" style="margin-right: 5px" @click="edit(row._id.documentId)">修改</Button>
                        <Button type="error" :disabled="row.details[0].status" size="small" style="margin-right: 5px" @click="del(index,row._id.documentId)">删除</Button>
                        <Button type="warning" :disabled="row.details[0].status" size="small" style="margin-right: 5px" @click="commit(index,row._id.documentId,true)">上报</Button>
                        <!-- <Button type="info" size="small" @click="download(row.documentName)">下载</Button> -->
                    </template>
                </Table>
                <Button type="warning" @click="merge">归档</Button>
            </TabPane>
            <TabPane label="部门工时" name="part" v-if="type==1">
                <Row :gutter="20" style="margin-bottom: 10px;">
                    <Col span="16">
                        <Date-picker
                        :value="showdate"
                        @on-change="handelChange"
                        style="width: 100%;"
                        type="daterange"
                        class="margin-bottom20"
                        confirm
                        placeholder="选择日期"
                        ></Date-picker>
                    </Col>
                    <Col span="8">
                        <Button type="primary" @click="quickTime('week')" ghost class="margin-bottom20">本周</Button>
                        <Button
                        type="primary"
                        @click="quickTime('month')"
                        ghost
                        class="margin-bottom20"
                        style="margin-left: 10px;"
                        >本月</Button>
                        <Button
                        type="primary"
                        @click="quickTime('preMonth')"
                        ghost
                        class="margin-bottom20"
                        style="margin-left: 10px;"
                        >上月</Button>
                    </Col>
                </Row>
                <Row :gutter="20" style="margin-bottom: 10px;">
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
                    </Col>
                </Row>
                <Button type="primary" @click="seach" style="margin-bottom: 20px;">查询</Button>
                <Table border :columns="columnPart" :data="listPart" style="margin-bottom:20px" @on-selection-change="selectionChangePart">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row._id.documentName }}</strong>
                    </template>
                    <template slot-scope="{ row }" slot="time">
                        <strong>{{row.details[0].year + '-' + row.details[0].month + '-' + row.details[0].day}}</strong>
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
        </Tabs>
        
    </Card>
</template>
<script>
    import {
        getAllUserData,
        listDocumentday,
        seachDocumentday,
        delteDocumentday,
        commitDocument
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
                        title: '时间',
                        width: 120,
                        align: 'center',
                        slot: 'time'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'center'
                    }
                ],
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
                        title: '时间',
                        width: 120,
                        align: 'center',
                        slot: 'time'
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
                    commitDocument({'documentId': documentId,'status': status}).then(res => {
                        if (res.code==1) {
                            if (status) {
                                this.list[indx].details[0].status = status;
                                this.$Message.success('上报成功');
                            } else {
                                this.listPart.splice(indx, 1);
                                this.$Message.success('退回成功');
                            }
                            
                        }
                    })
                })
            },
            quickTime(type) {
                if (type == "week") {
                    //周
                    this.startTime = getWeekStartDate();
                    this.endTime = getWeekEndDate();
                    this.showdate = [];
                    this.showdate.push(this.startTime);
                    this.showdate.push(this.endTime);
                } else if (type == "month") {
                    //月
                    this.startTime = getMonthStartDate();
                    this.endTime = getMonthEndDate();
                    this.showdate = [];
                    this.showdate.push(this.startTime);
                    this.showdate.push(this.endTime);
                } else {
                    //上月
                    this.startTime = getLastMonthStartDate();
                    this.endTime = getLastMonthEndDate();
                    this.showdate = [];
                    this.showdate.push(this.startTime);
                    this.showdate.push(this.endTime);
                }
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
                this.$router.push({ 'name': 'summary-merge', 'query': { mergeList: mergeList, type: 'day', month: moment(this.time).format('MM'),day: day}})
            },
            mergePart() {
                var mergeList = [];
                if (this.selectionListPart.length==0) {
                    this.$Message.error('请选择要合并的总结');
                    return;
                }
                for (let i = 0; i<this.selectionListPart.length; i++) {
                    mergeList.push(
                        this.selectionListPart[i]._id.documentId
                    );
                }
                let routeData = this.$router.resolve({
                    name: 'summary-merge',
                    query: { mergeList: mergeList, type: 'day', admin: true }
                });
                window.open(routeData.href, '_blank');
            },
            download(fileName) {
                window.location.href = 'http://' + window.location.hostname + ':3333/download/markdown?fileName='+fileName;
            },
            initList() {
                listDocumentday('day',{
                    userId: JSON.parse(localStorage.getItem('userInfo')).userId,
                    year: moment(this.time).format('YYYY'),
                    month: moment(this.time).format('MM')
                }).then(res => {
                    if (res.code==1) {
                        this.list = res.data;
                        this.$Message.success('查询成功');
                    }
                })
            },
            seach() {
                let postData = {
                    startTime: this.startTime,
                    endTime: this.endTime,
                    people: this.people,
                    system: this.system
                };
                if (this.startTime==''||this.endTime==''||this.people.length==0) {
                    this.$Message.info('查询条件必填')
                    return;
                }
                seachDocumentday(postData).then((res)=>{
                    this.listPart = res.data;
                    this.$Message.success('查询成功');
                })
            },
            show(id) {
                this.$router.push({ 'name': 'summary-details', 'query': { id: id, type: 'day' }})
            },
            edit(id) {
                this.$router.push({ 'name': 'summary-edit', 'query': { id: id ,type: 'day'}})
            },
            del(idnx,id) {
                this.confirm('确定要删除？',() => {
                    delteDocumentday('day', {documentId: id}).then(res => {
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
                this.$router.push({ 'name': 'summary-edit', 'query': { id: '' ,type: 'day'}})
            }
        },
        mounted() {
            this.initList();
            this.getUserList();
            this.type = JSON.parse(localStorage.getItem('userInfo')).type;
        }
    }
</script>