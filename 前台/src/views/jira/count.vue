<style lang="less">
@import "./list.less";
</style>

<template>
    <div>
        <Card style="min-height: 400px">
            <template slot="title">
                <DatePicker @on-change="yearChange" :value="year" style="width: 80px;margin-right:10px;" type="year"></DatePicker>
                jira完成情况
            </template>
            <Tabs type="card" value="name1">
                <TabPane label="按月查看" name="name1">
                    <div style="margin-bottom: 20px;" class="clearfix">
                        <Select filterable v-model="searchData.month" style="width: 160px;margin-right:10px;" placeholder="请选择月份">
                            <Option value="全年">全年</Option>
                            <Option :value="item" :key="item" v-for="item in monthList">{{parseInt(item)}}月</Option>
                        </Select>
                        <Button type="primary" style="margin-right: 10px;" @click="searchM">查询</Button>
                    </div>
                    <Divider>已完成</Divider>
                    <div class="map" id="map-finshed-m"></div>
                    <Divider>未完成</Divider>
                    <div class="map" id="map-unfinsed-m"></div>
                </TabPane>
                <TabPane label="按人查看" name="name2">
                    <div style="margin-bottom: 20px;" class="clearfix">
                        <Select filterable clearable v-model="searchData.userName" style="width: 160px;margin-right:10px;" placeholder="请选择姓名">
                            <Option :value="item.userName" :key="item.userName" v-for="item in userList">{{item.nickName}}</Option>
                        </Select>
                        <Button type="primary" style="margin-right: 10px;" @click="searchP">查询</Button>
                    </div>
                    <Divider>已完成</Divider>
                    <div class="map" id="map-finshed"></div>
                    <Divider>未完成</Divider>
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
                        this.monthList.forEach(element => {
                            let temp = _.find(res.data,function(o) {
                                return o.month == element;
                            });
                            result.total.push(temp?temp.total:0);
                            result.bug.push(temp?temp.bug:0);
                            result.total1.push(temp?temp.total1:0);
                            result.bug1.push(temp?temp.bug1:0);
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
                    year: this.year
                };
                this.option.series[0].data = [];
                this.option.series[1].data  = [];
                getJiraDetail('month', searchData).then(res => {
                    if (res.code === 1) {
                        this.$Message.success('操作成功');
                        let mapFinshed = echarts.init(document.getElementById("map-finshed-m"));
                        let mapUnFinshed = echarts.init(document.getElementById("map-unfinsed-m"));
                        this.option.xAxis[0].data = ['前端', '设计'];
                        this.option.series[0].data = [res.data.qd?res.data.qd.total:0,res.data.sj?res.data.sj.total:0];
                        this.option.series[1].data = [res.data.qd?res.data.qd.bug:0,res.data.sj?res.data.sj.bug:0];
                        mapFinshed.setOption(this.option);
                        this.option.series[0].data = [res.data.qd?res.data.qd.total1:0,res.data.sj?res.data.sj.total1:0];
                        this.option.series[1].data = [res.data.qd?res.data.qd.bug1:0,res.data.sj?res.data.sj.bug1:0];
                        mapUnFinshed.setOption(this.option);

                    }
                });
            },
            getUserList() {
                getAllUserData().then(res => {
                    if (res.code === 1) {
                        this.userList = res.data;
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