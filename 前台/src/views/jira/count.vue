<style lang="less">
@import "./list.less";
.jira .title {
    text-align: center;
    margin-bottom: 10px;
    font-weight: 700;
}
</style>

<template>
    <div class="jira">
        <Card dis-hover style="min-height: 400px">
            <template slot="title">
                <DatePicker @on-change="yearChange" :value="year" style="width: 80px;margin-right:10px;" type="year"></DatePicker>
                jira完成情况
            </template>
            <Tabs type="card" value="name1" :animated="false" @on-click="tabClick">
                <TabPane label="按月查看" name="name1">
                    <div style="margin-bottom: 20px;" class="clearfix">
                        <Select filterable v-model="searchData.month" style="width: 160px;margin-right:10px;" placeholder="月份">
                            <Option value="全年">全年</Option>
                            <Option :value="item" :key="item" v-for="item in monthList">{{parseInt(item)}}月</Option>
                        </Select>
                        <Select clearable v-model="searchData.departmentId" style="width: 160px;margin-right:10px;" placeholder="部门">
                            <Option :value="item.id" :key="item.id" v-for="item in partList">{{item.title}}</Option>
                        </Select>
                        <Button type="primary" @click="searchM">查询</Button>
                    </div>
                    <Divider style="font-weight: 700">已完成（jira总数：{{totalNumM+totalNumM1+bugNumM+bugNumM1}}，任务数：{{totalNumM+totalNumM1}}，bug数：{{bugNumM+bugNumM1}}）</Divider>
                        <Row>
                            <Col span="12">
                                <div class="title">jira总数：{{totalNumM+bugNumM}}，任务数：{{totalNumM}}，bug数：{{bugNumM}}</div>
                                <div class="map" id="map-finshed-m"></div>
                            </Col>
                            <Col span="12">
                                <div class="title">jira总数：{{totalNumM1+bugNumM1}}，任务数：{{totalNumM1}}，bug数：{{bugNumM1}}</div>
                                <div class="map" id="map-finshed-m1"></div>
                            </Col>
                        </Row>
                    <Divider style="font-weight: 700">未完成（jira总数：{{total1NumM+total1NumM1+bug1NumM+bug1NumM1}}，任务数：{{total1NumM+total1NumM1}}，bug数：{{bug1NumM+bug1NumM1}}）</Divider>
                        <Row>
                            <Col span="12">
                                <div class="title">jira总数：{{total1NumM+bug1NumM}}，任务数：{{total1NumM}}，bug数：{{bug1NumM}}</div>
                                <div class="map" id="map-unfinsed-m"></div>
                            </Col>
                            <Col span="12">
                                <div class="title">jira总数：{{total1NumM1+bug1NumM1}}，任务数：{{total1NumM1}}，bug数：{{bug1NumM1}}</div>
                                <div class="map" id="map-unfinsed-m1"></div>
                            </Col>
                        </Row>
                </TabPane>
                <TabPane label="按年查看" name="name3">
                    <Select clearable v-model="searchData.departmentId" style="width: 160px;margin-right:10px;" placeholder="部门">
                        <Option :value="item.id" :key="item.id" v-for="item in partList">{{item.title}}</Option>
                    </Select>
                    <Button type="primary" @click="searchY">查询</Button>
                    <Divider style="font-weight: 700">已完成（jira总数：{{totalNumY+bugNumY}}，任务数：{{totalNumY}}，bug数：{{bugNumY}}）</Divider>
                    <div class="map" id="map-finshed-y"></div>
                    <Divider style="font-weight: 700">未完成（jira总数：{{total1NumY+bug1NumY}}，任务数：{{total1NumY}}，bug数：{{bug1NumY}}）</Divider>
                    <div class="map" id="map-unfinsed-y"></div>
                </TabPane>
                <TabPane label="按人查看" name="name2">
                    <div style="margin-bottom: 20px;" class="clearfix">
                        <Select filterable clearable v-model="searchData.userName" style="width: 160px;margin-right:10px;" placeholder="请选择姓名">
                            <Option :value="item.userName" :key="item.userName" v-for="item in userList">{{item.nickName}}</Option>
                        </Select>
                        <Button type="primary" style="margin-right: 10px;" @click="searchP">查询</Button>
                    </div>
                    <Divider style="font-weight: 700">已完成（jira总数：{{totalNumP+bugNumP}}，任务数：{{totalNumP}}，bug数：{{bugNumP}}）</Divider>
                    <div class="map" id="map-finshed"></div>
                    <Divider style="font-weight: 700">未完成（jira总数：{{total1NumP+bug1NumP}}，任务数：{{total1NumP}}，bug数：{{bug1NumP}}）</Divider>
                    <div class="map" id="map-unfinsed"></div>
                </TabPane>
            </Tabs>
        </Card>
    </div>
</template>
<script>
    import {
        getAllUserData,
        getJiraDetail,
        initDepartment
    } from "@/api/index";
    import echarts from "echarts";
    import {
        setStore,
        getStore
    } from '@/libs/storage'
    import moment from "moment";
    export default {
        name: "jira",
        data() {
            return {
                year: '',
                modal: false,
                jiraId: '',
                userList: [],
                partList: [],  //部门列表
                monthList: ['01', '02', '03', '04', '05','06', '07', '08', '09', '10', '11', '12'],
                userName: '',
                date: new Date(),
                total: 0,
                bug: 0,
                task: 0,
                isFinshed: true,
                editIndex: -1,
                searchData: {
                    userName: '',
                    month: '全年',
                    departmentId: '', // 选中部门
                    isFinshed: true
                },
                bugNumP: 0,
                bug1NumP: 0,
                totalNumP: 0,
                total1NumP: 0,
                bugNumY: 0,
                bug1NumY: 0,
                totalNumY: 0,
                total1NumY: 0,
                bugNumM: 0,
                bug1NumM: 0,
                totalNumM: 0,
                total1NumM: 0,
                bugNumM1: 0,
                bug1NumM1: 0,
                totalNumM1: 0,
                total1NumM1: 0,
                columns: [
                    {
                        title: '姓名',
                        slot: 'userName'
                    },
                    {
                        title: '日期',
                        width: 140,
                        align: 'center',
                        slot: 'date'
                    },
                    {
                        title: 'jira总数',
                        align: 'right',
                        width: 140,
                        key: 'total'
                    },
                    {
                        title: '任务数',
                        width: 140,
                        align: 'right',
                        key: 'task'
                    },
                    {
                        title: 'bug数',
                        width: 140,
                        align: 'right',
                        key: 'bug'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        align: 'center',
                        width: 130
                    }
                ],
                data: [],
                option: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                        }
                    },
                    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
                    legend: {
                        data: ['jira数', 'bug数']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: [],
                            axisLabel: {
                                formatter: '{value}'
                            },
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '任务数',
                            min: 0,
                            axisLabel: {
                                formatter: '{value} 个'
                            }
                        },
                        {
                            type: 'value',
                            name: 'bug数',
                            min: 0,
                            axisLabel: {
                                formatter: '{value} 个'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '任务数',
                            type: 'bar',
                            barWidth : 30,//柱图宽度
                            tooltip: {
                                valueFormatter: function (value) {
                                return value + ' 个';
                                }
                            },
                            data: []
                        },
                        {
                            name: 'bug数',
                            type: 'line',
                            tooltip: {
                                valueFormatter: function (value) {
                                return value + ' 个';
                                }
                            },
                            data: []
                        }
                    ]
                }
            }
        },
        methods: {
            tabClick(name) {
                if (name == 'name3') {
                    this.searchY();
                }
            },
            yearChange(year) {
                this.year = year;
                setStore('year', year);
            },
            searchP() {
                if (this.searchData.userName==='') {
                    this.$Message.error('请选择姓名');
                    return;
                }
                let searchData = {
                    userName: this.searchData.userName,
                    year: this.year
                };
                getJiraDetail('user', searchData).then(res => {
                    if (res.code === 1) {
                        this.$Message.success('操作成功');
                        let mapFinshed = echarts.init(document.getElementById("map-finshed"));
                        let mapUnFinshed = echarts.init(document.getElementById("map-unfinsed"));
                        let result = {bug: [], total: [], bug1: [], total1: []};
                        this.option.xAxis[0].data = this.monthList;
                        var _this = this;
                        _this.bugNumP = 0;
                        _this.bug1NumP = 0;
                        _this.totalNumP = 0;
                        _this.total1NumP = 0;
                        this.monthList.forEach(element => {
                            let temp = _.find(res.data,function(o) {
                                return o.month == element;
                            });
                            result.total.push(temp?temp.total:0);
                            result.bug.push(temp?temp.bug:0);
                            result.total1.push(temp?temp.total1:0);
                            result.bug1.push(temp?temp.bug1:0);
                            _this.bugNumP+=(temp?temp.bug:0);
                            _this.bug1NumP+=(temp?temp.bug1:0);
                            _this.totalNumP+=(temp?temp.total:0);
                            _this.total1NumP+=(temp?temp.total1:0);
                        });
                        this.option.series[0].data = result.total;
                        this.option.series[1].data = result.bug;
                        mapFinshed.setOption(this.option);
                        this.option.series[0].data = result.total1;
                        this.option.series[1].data = result.bug1;
                        mapUnFinshed.setOption(this.option);

                    }
                });
            },
            searchM() {
                let searchData = {
                    month: this.searchData.month==='全年'?'':this.searchData.month,
                    year: this.year,
                    departmentId: this.searchData.departmentId,
                    userListSj: this.userListSj, //设计
                    userListQd: this.userListQd
                };
                this.option.series[0].data = [];
                this.option.series[1].data  = [];
                var _this = this;
                _this.bugNumM = 0;
                _this.bug1NumM = 0;
                _this.totalNumM = 0;
                _this.total1NumM = 0;
                _this.bugNumM1 = 0;
                _this.bug1NumM1 = 0;
                _this.totalNumM1 = 0;
                _this.total1NumM1 = 0;
                getJiraDetail('month', searchData).then(res => {
                    if (res.code === 1) {
                        this.$Message.success('操作成功');
                        let mapFinshed = echarts.init(document.getElementById("map-finshed-m"));
                        let mapUnFinshed = echarts.init(document.getElementById("map-unfinsed-m"));
                        let mapFinshed1 = echarts.init(document.getElementById("map-finshed-m1"));
                        let mapUnFinshed1 = echarts.init(document.getElementById("map-unfinsed-m1"));
                        let result = {bug: [], total: [], bug1: [], total1: []};
                        this.option.xAxis[0].data = res.data.sjList;
                        if (res.data.sj.length>0) {
                            this.option.xAxis[0].data = [];
                            for(let i = 0; i<res.data.sj.length;i++) {
                                this.option.xAxis[0].data.push(res.data.sj[i].nickName);
                            };
                        }
                        this.option.xAxis[0].data.forEach(element => {
                            let temp = _.find(res.data.sj,function(o) {
                                return o.nickName == element;
                            });
                            result.total.push(temp?temp.total:0);
                            result.bug.push(temp?temp.bug:0);
                            result.total1.push(temp?temp.total1:0);
                            result.bug1.push(temp?temp.bug1:0);
                            _this.bugNumM+=(temp?temp.bug:0);
                            _this.bug1NumM+=(temp?temp.bug1:0);
                            _this.totalNumM+=(temp?temp.total:0);
                            _this.total1NumM+=(temp?temp.total1:0);
                        });
                        this.option.series[0].data = result.total;
                        this.option.series[1].data = result.bug;
                        mapFinshed.setOption(this.option);
                        this.option.series[0].data = result.total1;
                        this.option.series[1].data = result.bug1;
                        mapUnFinshed.setOption(this.option);
                        this.option.xAxis[0].data = [];
                        let result1 = {bug: [], total: [], bug1: [], total1: []};
                        this.option.xAxis[0].data = res.data.QdList;
                        if (res.data.qd.length>0) {
                            this.option.xAxis[0].data = [];
                            for(let i = 0; i<res.data.qd.length;i++) {
                                this.option.xAxis[0].data.push(res.data.qd[i].nickName);
                            };
                        }
                        this.option.xAxis[0].data.forEach(element => {
                            let temp = _.find(res.data.qd,function(o) {
                                return o.nickName == element;
                            });
                            result1.total.push(temp?temp.total:0);
                            result1.bug.push(temp?temp.bug:0);
                            result1.total1.push(temp?temp.total1:0);
                            result1.bug1.push(temp?temp.bug1:0);
                            _this.bugNumM1+=(temp?temp.bug:0);
                            _this.bug1NumM1+=(temp?temp.bug1:0);
                            _this.totalNumM1+=(temp?temp.total:0);
                            _this.total1NumM1+=(temp?temp.total1:0);
                        });
                        this.option.series[0].data = result1.total;
                        this.option.series[1].data = result1.bug;
                        mapFinshed1.setOption(this.option);
                        this.option.series[0].data = result1.total1;
                        this.option.series[1].data = result1.bug1;
                        mapUnFinshed1.setOption(this.option);

                    }
                });
            },
            searchY() {
                var searchData = {
                    year: this.year,
                    departmentId: this.searchData.departmentId
                };
                getJiraDetail('year', searchData).then(res => {
                    if (res.code === 1) {
                        this.$Message.success('操作成功');
                        let result = {bug: [], total: [], bug1: [], total1: []};
                        this.option.xAxis[0].data = this.monthList;
                        var _this = this;
                        _this.bugNumY = 0;
                        _this.bug1NumY = 0;
                        _this.totalNumY = 0;
                        _this.total1NumY = 0;
                        this.monthList.forEach(element => {
                            let temp = _.find(res.data,function(o) {
                                return o.month == element;
                            });
                            result.total.push(temp?temp.total:0);
                            result.bug.push(temp?temp.bug:0);
                            result.total1.push(temp?temp.total1:0);
                            result.bug1.push(temp?temp.bug1:0);
                            _this.bugNumY+=(temp?temp.bug:0);
                            _this.bug1NumY+=(temp?temp.bug1:0);
                            _this.totalNumY+=(temp?temp.total:0);
                            _this.total1NumY+=(temp?temp.total1:0);
                        });
                        let mapFinshed = echarts.init(document.getElementById("map-finshed-y"));
                        let mapUnFinshed = echarts.init(document.getElementById("map-unfinsed-y"));
                        this.option.series[0].data = result.total;
                        this.option.series[1].data = result.bug;
                        mapFinshed.setOption(this.option);
                        this.option.series[0].data = result.total1;
                        this.option.series[1].data = result.bug1;
                        mapUnFinshed.setOption(this.option);

                    }
                })
            },
            getUserList() {
                getAllUserData().then(res => {
                    if (res.code === 1) {
                        this.userList = _.filter(res.data, function(o) {
                            return o.type===0;
                        });
                    }
                });
            },
            initDepartment() { //获取部门
                initDepartment().then(res => {
                    this.partList = res.data;
                });
            }
        },
        mounted() {
            this.searchData.departmentId = JSON.parse(localStorage.getItem('userInfo')).departmentId;
            if (this.getStore('year')) {
                this.year = getStore('year');
            } else {
                this.year = moment().format('YYYY');
                setStore('year', moment().format('YYYY'));
            }
            this.initDepartment();
            this.getUserList();
            this.searchM();
        }
    }
</script>