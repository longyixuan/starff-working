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
        <Card style="min-height: 400px">
            <template slot="title">
                <DatePicker @on-change="yearChange" :value="year" style="width: 80px;margin-right:10px;" type="year"></DatePicker>
                jira完成情况
            </template>
            <Tabs type="card" value="name1" :animated="false">
                <TabPane label="按月查看" name="name1">
                    <div style="margin-bottom: 20px;" class="clearfix">
                        <Select filterable v-model="searchData.month" style="width: 160px;margin-right:10px;" placeholder="请选择月份">
                            <Option value="全年">全年</Option>
                            <Option :value="item" :key="item" v-for="item in monthList">{{parseInt(item)}}月</Option>
                        </Select>
                        <Button type="primary" style="margin-right: 10px;" @click="searchM">查询</Button>
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
                monthList: ['01', '02', '03', '04', '05','06', '07', '08', '09', '10', '11', '12'],
                userListSj: ['yanq', 'gaos', 'changxq', 'sunl', 'cuiyh'], //设计
                userListSjName: ['崔永辉', '孙玲', '畅雪琦', '高爽', '颜情'], //设计
                userListQd: ['wangtl', 'wangzhen', 'guoxq', 'weij', 'mayx', 'jiaxd', 'hanwm', 'yinxl', 'wangly', 'liugw'], // 前端
                userListQdName: ['卫杰', '马艳雄', '尹晓龙', '王利英', '贾晓东', '韩文明', '郭晓琼', '王振', '王天乐', '刘国威'],
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
                    isFinshed: true
                },
                bugNumP: 0,
                bug1NumP: 0,
                totalNumP: 0,
                total1NumP: 0,
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
                    color: [
                        "#87cefa",
                        "#ff7f50",
                        "#da70d6",
                        "#32cd32",
                        "#6495ed",
                        "#ff69b4",
                        "#ba55d3",
                        "#cd5c5c",
                        "#ffa500",
                        "#40e0d0",
                        "#1e90ff",
                        "#ff6347",
                        "#7b68ee",
                        "#00fa9a",
                        "#ffd700",
                        "#6699FF",
                        "#ff6666",
                        "#3cb371",
                        "#b8860b",
                        "#30e0e0"
                    ],
                    // toolbox: {
                    //     feature: {
                    //     dataView: { show: true, readOnly: false },
                    //     magicType: { show: true, type: ['line', 'bar'] },
                    //     restore: { show: true },
                    //     saveAsImage: { show: true }
                    //     }
                    // },
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
                            name: 'jira数',
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
                            name: 'jira数',
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
                        this.option.xAxis[0].data = this.userListSjName;
                        this.userListSjName.forEach(element => {
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
                        this.option.xAxis[0].data = this.userListQdName;
                        this.userListQdName.forEach(element => {
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
                        console.log(this.option)
                        mapUnFinshed1.setOption(this.option);

                    }
                });
            },
            getUserList() {
                getAllUserData().then(res => {
                    if (res.code === 1) {
                        this.userList = _.filter(res.data, function(o) {
                            return o.type===0;
                        });
                    }
                });
            }
        },
        mounted() {
            if (this.getStore('year')) {
                this.year = getStore('year');
            } else {
                this.year = moment().format('YYYY');
                setStore('year', moment().format('YYYY'));
            }
            this.getUserList();
            this.searchM();
        }
    }
</script>