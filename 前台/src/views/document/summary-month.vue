<style lang="less" scoped>
@import "./summary.less";
</style>
<template>
    <Card title="月总结">
        <Tabs value="my" :animated="false">
            <TabPane label="部门总结" name="part" v-if="type==1">
                <Row :gutter="20" style="margin-bottom: 10px;">
                    <Col span="16">
                        <Date-picker
                        v-model="month"
                        style="width: 100%;"
                        type="month"
                        class="margin-bottom20"
                        confirm
                        placeholder="选择日期"
                        ></Date-picker>
                    </Col>
                    <Col span="8">
                        <Button type="primary" @click="quickTime('cur')" ghost style="margin-left: 10px;" class="margin-bottom20">本月</Button>
                        <Button type="primary" @click="quickTime('pre')" ghost style="margin-left: 10px;" class="margin-bottom20">上月</Button>
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
                    <template slot-scope="{ row }" slot="people">
                        <strong>{{row.details[0].nickName}}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="adminshow(row._id.documentId)">查看</Button>
                        <Button type="warning" :disabled="!row.details[0].status" size="small" style="margin-right: 5px" @click="commit(index,row._id.documentId,false)">退回</Button>
                        <!-- <Button type="info" size="small" @click="download(row.documentName)">下载</Button> -->
                    </template>
                </Table>
                <Button type="primary" @click="mergePart">合并查看</Button>
            </TabPane>
            <TabPane label="我的总结" name="my">
                <div style="margin-bottom: 20px;">
                    <DatePicker v-model="time" format="yyyy年" type="year" placeholder="工作总结时间"></DatePicker>
                    <Button type="primary" @click="initList" style="margin-left: 10px;">查询</Button>
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
                month: new Date(),
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
                                // this.listPart.splice(indx, 1);
                                this.$set(this.listPart[indx].details[0],'status',status);
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
                this.$router.push({ 'name': 'summary-merge', 'query': { mergeList: mergeList, type: 'month'}})
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
                        this.list =  _.sortBy(res.data,'_id',function(o){
                            return parseInt(o._id.month);
                        }).reverse();
                        this.$Message.success('查询成功');
                    }
                })
            },
            seach() {
                let postData = {
                    year: moment(this.month).format('YYYY'),
                    month: moment(this.month).format('MM'),
                    people: this.people,
                    system: this.system
                };
                if (this.people.length==0) {
                    this.$Message.info('查询条件必填')
                    return;
                }
                seachDocumentmonth(postData).then((res)=>{
                    this.listPart = res.data.filter(function(item){
                        return (item._id.status_info.length>0 || item.details[0].status);
                    });
                    this.$Message.success('查询成功');
                })
            },
            adminshow(id) {
                let routeData = this.$router.resolve({
                    name: 'summary-admindetails',
                    query: { id: id, type: 'month' }
                });
                window.open(routeData.href, '_blank');
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
            addTemplate() {
                this.$router.push({ 'name': 'summary-edit', 'query': { id: '' ,type: 'day'}})
            },
            quickTime(type) {
                if (type == 'pre') {
                    this.month = new Date(moment().add(-1, 'month').format('YYYY-MM-DD'));
                } else {
                    this.month = new Date();
                }
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