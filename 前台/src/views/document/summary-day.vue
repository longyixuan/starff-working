<style lang="less" scoped>
@import "./summary.less";
.ivu-tabs-tabpane {
    min-height: 300px; 
}
</style>
<template>
    <Card title="日总结">
        <Tabs value="my" :animated="false">
            <TabPane label="我的总结" name="my">
                <div style="margin-bottom: 20px;">
                    <DatePicker v-model="time" format="yyyy年MM月" type="month" placeholder="工作总结时间"></DatePicker>
                    <Checkbox v-model="bhsy" style="margin-left: 10px;">含上月数据</Checkbox>
                    <Button type="primary" @click="initList" style="margin-left: 10px;">查询</Button>
                    <Button type="primary" @click="addTemplate" style="margin-left: 10px">新增</Button>
                </div>
                <Table border :columns="columns" :data="list" style="margin-bottom:20px" @on-selection-change="selectionChange">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row._id.documentName }}</strong>
                        <template v-if="row._id.status_info.length>0">
                            <Tag color="red" v-if="row._id.status_info[0].status=='0'">已退回</Tag>
                            <Tag color="green" v-if="row._id.status_info[0].status=='1'">已修正</Tag>
                        </template>
                    </template>
                    <template slot-scope="{ row }" slot="time">
                        <strong>{{row.details[0].year + '-' + row.details[0].month + '-' + row.details[0].day}}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row._id.documentId)">查看</Button>
                        <Button type="primary" :disabled="row.details[0].status" size="small" style="margin-right: 5px" @click="edit(row._id.documentId)">修改</Button>
                        <Button type="error" :disabled="row.details[0].status" size="small" style="margin-right: 5px" @click="del(index,row._id.documentId)">删除</Button>
                        <Button type="warning" :disabled="row.details[0].status" size="small" style="margin-right: 5px" @click="getTodayTime(index,row._id.documentId,true)">上报</Button>
                        <!-- <Button type="info" size="small" @click="download(row.documentName)">下载</Button> -->
                    </template>
                </Table>
                <Button type="primary" @click="merge">合并查看</Button>
                <Button type="warning" @click="setWeek" style="margin-left: 10px;">合并生成周总结</Button>
            </TabPane>
            <TabPane label="部门总结" name="part">
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
                        <Button type="primary" @click="quickTime('yestday')" ghost class="margin-bottom20">昨天</Button>
                        <Button type="primary" @click="quickTime('day')" ghost style="margin-left: 10px;" class="margin-bottom20">今天</Button>
                        <Button type="primary" @click="quickTime('week')" ghost style="margin-left: 10px;" class="margin-bottom20">本周</Button>
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
                        <template v-if="row._id.status_info.length>0">
                            <Tag color="red" v-if="row._id.status_info[0].status=='0'">已退回</Tag>
                            <Tag color="green" v-if="row._id.status_info[0].status=='1'">已修正</Tag>
                        </template>
                    </template>
                    <template slot-scope="{ row }" slot="time">
                        <strong>{{row.details[0].year + '-' + row.details[0].month + '-' + row.details[0].day}}</strong>
                    </template>
                    <template slot-scope="{ row }" slot="people">
                        <strong>{{row.details[0].nickName}}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="adminshow(row._id.documentId)">查看</Button>
                        <Button type="warning" :disabled="!row.details[0].status" size="small" style="margin-right: 5px" @click="commit(index,row._id.documentId,false)">退回</Button>
                    </template>
                </Table>
                <Button type="primary" @click="mergePart">合并查看</Button>
            </TabPane>
        </Tabs>
        <Modal v-model="modal" title="合并生成周总结">
            <Input type="text" placeholder="请输出周总结名称" v-model="weekTitle"/>
            <template slot="footer">
                <Button @click="modal=false">取消</Button>
                <Button type="primary" @click="mergeWeek" style="margin-left: 10px;">确定</Button>
            </template>
        </Modal>
    </Card>
</template>
<script>
    import {
        getAllUserData,
        listDocumentday,
        seachDocumentday,
        delteDocumentday,
        commitDocument,
        todayTime,
        toDocumentweek
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
                bhsy: false,
                list: [],
                listPart: [],
                showdate: [],
                type: 0,
                weekTitle: '设计部2020年05月25日-29日工作总结（姓名）',
                startTime: '',
                endTime: '',
                modal: false,
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
                        width: 220,
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
                        title: '日期',
                        width: 120,
                        align: 'center',
                        slot: 'time'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 260,
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
                        width: 160,
                        align: 'center'
                    }
                ]
            }
        },
        methods: {
            getTodayTime(indx,documentId,status) {
                return todayTime({
                    userId: JSON.parse(localStorage.getItem('userInfo')).userId,
                    date: this.list[indx].details[0].year+'-'+this.list[indx].details[0].month+'-'+this.list[indx].details[0].day
                }).then(res => {
                    if (res.data!=0) {
                        this.commit(indx,documentId,status);
                    } else {
                        this.$Message.error('本日工时未添加，请添加后上报')
                    }
                })
            },
            setWeek() {
                this.modal = true;
                let list = _.sortBy(this.selectionList, function(item) {
                    return (new Date(item._id.year+'-'+item._id.month+'-'+item._id.day)).getTime();
                });
                this.weekTitle = `设计部${list[0]._id.year}年${list[0]._id.month}月${list[0]._id.day}日-${list[list.length-1]._id.month}月${list[list.length-1]._id.day}日工作总结（${JSON.parse(localStorage.getItem('userInfo')).nickName}）`;
            },
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
                let title = status?'上报之后不可修改和删除，是否要上报？':'确定要退回吗？'
                this.confirm(title,() => {
                    commitDocument({'documentId': documentId,'status': status}).then(res => {
                        if (res.code==1) {
                            if (status) {
                                this.$set(this.list[indx].details[0],'status',status);
                                this.$Message.success('上报成功');
                            } else {
                                // this.listPart.splice(indx, 1);
                                this.$set(this.listPart[indx].details[0],'status',status);
                                this.$Message.success('退回成功');
                            }
                            
                        }
                    })
                })
            },
            quickTime(type) {
                if (type == "yestday") {
                    this.startTime = moment().add(-1, 'days').format('YYYY-MM-DD');
                    this.endTime = moment().add(-1, 'days').format('YYYY-MM-DD');
                    this.showdate = [];
                    this.showdate.push(this.startTime);
                    this.showdate.push(this.endTime);
                } else if(type == "day") {
                    this.startTime = moment().format('YYYY-MM-DD');
                    this.endTime = moment().format('YYYY-MM-DD');
                    this.showdate = [];
                    this.showdate.push(this.startTime);
                    this.showdate.push(this.endTime);
                } else if (type == "week") {
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
                        this.peopleAll();
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
                if (this.selectionListPart.length<2) {
                    this.$Message.error('请至少选择2行内容进行合并查看');
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
                    month: moment(this.time).format('MM'),
                    premonth: this.bhsy?moment(this.time).add(-1, 'month').format('MM'):'',
                }).then(res => {
                    if (res.code==1) {
                        var list = _.sortBy(res.prelist, function(item) {
                            return parseInt(item._id.day);
                        });
                        this.list = _.sortBy(res.data, function(item) {
                            return parseInt(item._id.day);
                        });
                        this.list = [...list,...this.list].reverse();
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
                    this.listPart = res.data.filter(function(item){
                        return (item._id.status_info.length>0 || item.details[0].status);
                    });
                    this.$Message.success('查询成功');
                })
            },
            adminshow(id) {
                let routeData = this.$router.resolve({
                    name: 'summary-admindetails',
                    query: { id: id, type: 'day' }
                });
                window.open(routeData.href, '_blank');
            },
            show(id) {
                let routeData = this.$router.resolve({
                    name: 'summary-details',
                    query: { id: id, type: 'day' }
                });
                window.open(routeData.href, '_blank');
            },
            edit(id) {
                this.$router.push({ 'name': 'summary-edit', 'query': { id: id ,type: 'day'}});
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
            mergeWeek() {
                var mergeList = [];
                let list = _.sortBy(this.selectionList, (item) => {
                    mergeList.push(
                        item._id.documentId
                    );
                    return (new Date(item._id.year+'-'+item._id.month+'-'+item._id.day)).getTime();
                });
                var postData = {
                    documentName: this.weekTitle,
                    userId: JSON.parse(localStorage.getItem('userInfo')).userId,
                    userName: JSON.parse(localStorage.getItem('userInfo')).userName,
                    nickName: JSON.parse(localStorage.getItem('userInfo')).nickName,
                    year: `${list[0]._id.year}`,
                    startDay: `${list[0]._id.year}-${list[0]._id.month}-${list[0]._id.day}`,
                    endDay: `${list[list.length-1]._id.year}-${list[list.length-1]._id.month}-${list[list.length-1]._id.day}`,
                    list: mergeList
                };
                toDocumentweek(postData).then(res => {
                    if (res.code === 1) {
                        this.modal = false;
                        this.$Message.success('生成成功，请至周总结中查看')
                    }
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
        }
    }
</script>