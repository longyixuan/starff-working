<style lang="less" scoped>
@import "./index.less";
</style>
<template>
    <Card title="月总结">
        <Tabs value="my" :animated="false">
            <TabPane label="我的总结" name="my">
                <div style="margin-bottom: 20px;">
                    <DatePicker :editable="false" v-model="time" format="yyyy年" type="year" placeholder="工作总结时间"></DatePicker>
                    <Button type="primary" @click="initList" style="margin-left: 10px;">查询</Button>
                    <Button type="primary" to="/summary/add" style="margin-left: 10px">新增</Button>
                </div>
                <Table border :columns="columns" :data="list" style="margin-bottom:20px">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.documentName }}</strong>
                    </template>
                    <template slot-scope="{ row }" slot="time">
                        <strong>{{row.year}}-{{row.month}}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row.documentId)">查看</Button>
                        <Button type="primary" :disabled="row.status!='WTJ'" size="small" style="margin-right: 5px" @click="edit(row.documentId)">修改</Button>
                        <Button type="error" :disabled="row.status!='WTJ'" size="small" style="margin-right: 5px" @click="del(index,row.documentId)">删除</Button>
                        <Button type="warning" :disabled="row.status!='WTJ'" size="small" style="margin-right: 5px" @click="commit(index,row.documentId)">上报</Button>
                    </template>
                </Table>
            </TabPane>
            <TabPane label="部门总结" name="part">
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
                        <Button type="primary" ghost @click="quickPeople(item.id)" :key="item.id" style="margin-left: 10px;" class="margin-bottom20" v-for="item in departmentList">{{item.title}}</Button>
                        <Button
                        type="primary"
                        ghost
                        @click="peopleAll"
                        class="margin-bottom20"
                        style="margin-left: 10px;"
                        >选择全部</Button>
                        <Button type="primary" ghost @click="people=[]" class="margin-bottom20" style="margin-left: 10px;">清空选择</Button>
                    </Col>
                </Row>
                <Button type="primary" @click="seach" style="margin-bottom: 20px;">查询</Button>
                <Alert type="warning" style="line-height: 1.6">
                    未提交总结人员：
                    <template v-if="checkList!=''">
                        <br>{{checkList}}
                    </template>
                    <template v-if="checkList1!=''">
                        <br>{{checkList1}}
                    </template>
                </Alert>
                <Table border :columns="columnPart" :data="listPart" style="margin-bottom:20px">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.documentName }}</strong>
                    </template>
                    <template slot-scope="{ row }" slot="time">
                        <strong>{{row.year}}-{{row.month}}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row.documentId)">查看</Button>
                        <Button type="warning" :disabled="row.status != 'YTJ'" size="small" style="margin-right: 5px" @click="callbackCommit(index,row.documentId)">退回</Button>
                    </template>
                </Table>
            </TabPane>
        </Tabs>
    </Card>
</template>
<script>
    import {
        getAllUserData,
        initDepartment,
        mdMonthList,
        mdMonthCommit,
        mdMonthCallback,
        mdMonthDel,
        mdMonthSearch
    } from "@/api/index";
    import moment from "moment";
    export default {
        data() {
            return {
                checkList: '',
                checkList1: '',
                list: [],
                listPart: [],
                month: new Date(),
                type: 0,
                isReq: false,
                time: new Date(),
                peopleList: [],
                people: [],
                departmentList: [],
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
                        title: '名称',
                        slot: 'name'
                    },
                    {
                        title: '人员',
                        width: 100,
                        align: 'center',
                        key: 'nickName'
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
            getDepartment() {
                initDepartment().then(res => {
                    if (res.code === 1) {
                        this.departmentList = res.data;
                    }
                });
            },
            peopleAll() {
                this.people = [];
                for (let i = 0; i < this.peopleList.length; i++) {
                    let element = this.peopleList[i];
                    this.people.push(element.userId);
                }
            },
            quickPeople(id) {
                this.people = [];
                for (let i = 0; i < this.peopleList.length; i++) {
                    let element = this.peopleList[i];
                    if (id === element.departmentId) {
                        this.people.push(element.userId);
                    }
                }
            },
            commit(indx,documentId) {
                let title = '上报之后不可修改和删除，是否要上报？'
                this.confirm(title,() => {
                    mdMonthCommit({'documentId': documentId}).then(res => {
                        if (res.code==1) {
                            this.$set(this.list[indx],'status', true);
                            this.$Message.success('上报成功');
                        }
                    })
                })
            },
            callbackCommit(indx, documentId) {
                let title = '确定要退回吗？'
                this.confirm(title,() => {
                    mdMonthCallback({'documentId': documentId}).then(res => {
                        if (res.code == 1) {
                            this.$set(this.listPart[indx],'status', false);
                            this.$Message.success('退回成功');
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
            initList() {
                mdMonthList({
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
                if (this.people.length==0) {
                    this.$Message.info('查询条件必填')
                    return;
                }
                let postData = {
                    year: moment(this.month).format('YYYY'),
                    month: moment(this.month).format('MM'),
                    people: this.people
                };
                this.checkList = '';
                this.checkList1 = '';
                mdMonthSearch(postData).then(res => {
                    if (res.code==1) {
                        this.listPart = res.data;
                        if (res.temp.length!=0) {
                            this.checkList +='设计一部：' + res.temp.join('、');
                        }
                        if (res.temp1.length!=0) {
                            this.checkList1 +='设计二部：' + res.temp1.join('、');
                        }
                        this.$Message.success('查询成功');
                    }
                });
            },
            show(id) {
                let routeData = this.$router.resolve({
                    name: 'summary-show',
                    query: { id: id}
                });
                window.open(routeData.href, '_blank');
            },
            edit(id) {
                this.$router.push({ 'name': 'summary-add', 'query': { id: id }});
            },
            del(idnx,id) {
                this.confirm('确定要删除？', () => {
                    mdMonthDel({documentId: id}).then(res => {
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
            quickTime(type) {
                if (type == 'pre') {
                    this.month = new Date(moment().add(-1, 'month').format('YYYY-MM-DD'));
                } else {
                    this.month = new Date();
                }
            }
        },
        mounted() {
            this.getDepartment();
            this.initList();
            this.getUserList();
            this.type = JSON.parse(localStorage.getItem('userInfo')).type;
            this.peopleAll();
        }
    }
</script>