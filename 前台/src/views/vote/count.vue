<style lang="less">
@import './vote.less';
</style>
<template>
    <Card dis-hover :title="`${surveyName}(${date})投票结果`">
        <div slot="extra">
            <Button type="primary" to="/vote/survey">返回</Button>
        </div>
        <div style="margin-bottom: 40px;">
            <Select clearable multiple placeholder="选择员工" v-model="people" style="margin-bottom: 10px;">
                <Option v-for="item in peopleList" :value="item.nickName" :key="item.userId">{{ item.nickName }}</Option>
            </Select>
            <Button type="primary" ghost @click="quickChange([...qd,...sj], 'bm')" class="margin-bottom20">全部门</Button>
            <Button type="primary" ghost @click="quickChange(qd, 'qd')" style="margin-left: 10px;">前端组</Button>
            <Button type="primary" ghost @click="quickChange(sj, 'sj')" style="margin-left: 10px;">设计组</Button>
            <Button type="primary" ghost @click="people=[]" style="margin-left: 10px;">清空选择</Button>
            <Button type="primary" style="margin-left: 10px;" @click="count">查询</Button>
        </div>
        <div class="map" id="map" v-if="people.length>1"></div>
        <Row :gutter="20" v-if="people.length==1">
            <Col span="12">
                <Card dis-hover dis-hover icon="ios-ribbon">
                    <p slot="title">
                        <Icon type="ios-ribbon" size="20" color="#ff9900"/>部门排名：<strong>{{ranking.length>0?ranking[0].ranking:''}}</strong>
                    </p>
                    <Alert v-if="ranking.length>0" style="margin-bottom: 10px;">
                        <template v-for="item in ranking">
                            <span v-if="item.name !='总分'" style="margin-right: 20px;">
                                {{item.name}}：<strong>{{item.ranking}}</strong>
                            </span>
                        </template>
                    </Alert>
                    <div class="map" id="map2"></div>
                </Card>
            </Col>
            <Col span="12">
                <Card dis-hover dis-hover icon="ios-ribbon">
                    <p slot="title">
                        <Icon type="ios-ribbon" size="20" color="#ff9900"/>{{getGroupName}}排名：<strong>{{ranking2.length>0?ranking2[0].ranking:''}}</strong>
                    </p>
                    <Alert v-if="ranking2.length>0" style="margin-bottom: 10px;">
                        <template v-for="item in ranking">
                            <span v-if="item.name !='总分'" style="margin-right: 20px;">
                                {{item.name}}：<strong>{{getRanking(item.name)}}</strong>
                            </span>
                        </template>
                    </Alert>
                    <div class="map" id="map3"></div>
                </Card>
            </Col>
        </Row>
        <Tabs type="card" v-model="tabName" style="margin-top: 20px;">
            <TabPane label="全部门排名" name="bm">
                <Table border stripe :data="list" :columns="columns"></Table>
            </TabPane>
            <TabPane label="前端组排名" name="qd">
                <Table border stripe :data="listQd" :columns="columns"></Table>
            </TabPane>
            <TabPane label="设计组排名" name="sj">
                <Table border stripe :data="listSj" :columns="columns"></Table>
            </TabPane>
        </Tabs>
    </Card>
</template>
<script>
import { getAllUserData, countSurvey, detailSurvey, countSurveyOne } from '@/api/index';
import echarts from 'echarts';
export default {
    name: 'vote-count',
    data() {
        return {
            id: this.$route.params.id,
            data: [],
            tabName: 'bm',
            surveyName: '',
            date: '',
            list: [],
            listQd: [],
            listSj: [],
            people: [],
            peopleList: [],
            columns: [],
            qd: ['卫杰','马艳雄','尹晓龙','王利英','贾晓东','韩文明','郭晓琼','王振','王天乐','刘国威'],
            sj: ['孙玲','崔永辉','畅雪琦','高爽','颜情', '何晨曦'],
            ranking: [],
            ranking2: []
        };
    },
    computed: {
        getGroupName() {
            return _.includes(this.qd, this.people[0])?'前端':'设计';
        }
    },
    methods: {
        quickChange(data, type) {
            this.people = data;
            this.tabName = type;
            this.count();
        },
        getUserList() {
            getAllUserData().then((res) => {
                if (res.code === 1) {
                    this.peopleList = _.filter(res.data, function(o) { return o.type!==1; });
                    this.peopleAll();
                    this.initCount([...this.qd, ...this.sj], this.list);
                    this.initCount(this.qd, this.listQd);
                    this.initCount(this.sj, this.listSj);
                    this.count();
                }
            });
        },
        peopleAll() {
            this.people = [];
            for (let i = 0; i < this.peopleList.length; i++) {
                let element = this.peopleList[i];
                if (element.userName!='lvf'&&element.userName!='lugp') {
                    this.people.push(element.nickName);
                }
            }
        },
        count() {
            if (this.people.length===1) {
                countSurveyOne({
                    id: this.id,
                    userName: this.people[0],
                    people: [...this.qd, ...this.sj]
                }).then((res) => {
                    if (res.code === 1) {
                        if (res.code === 1) {
                            this.ranking = res.ranking;
                            this.createMap2('map2', res.data, res.ranking, res.num);
                            countSurveyOne({
                                id: this.id,
                                userName: this.people[0],
                                people: _.includes(this.qd, this.people[0])?this.qd:this.sj
                            }).then(res => {
                                if (res.code === 1) {
                                    this.ranking2 = res.ranking;
                                    this.createMap2('map3', res.data, res.ranking, res.num);
                                }
                            })
                        }
                    }
                });
            } else {
                countSurvey({ id: this.id, people: this.people }).then((res) => {
                    if (res.code === 1) {
                        this.createMap(this.orderList(res.data), res.data3);
                    }
                });
            }
        },
        initCount(people, list) {
            countSurvey({ id: this.id, people: people }).then((res) => {
                if (res.code === 1) {
                    this.data = this.orderList(res.data);
                    let data2 = res.data2;
                    this.columns = [
                        {
                            title: '排名',
                            key: 'ranking',
                            align: 'center',
                            sortable: true,
                            width: 90,
                        },
                        {
                            title: '姓名',
                            key: 'userName'
                        },
                        {
                            title: '总分',
                            key: 'total',
                            align: 'right',
                            sortable: true,
                            width: 100,
                        }
                    ];
                    data2.forEach((item) => {
                        item.content = this.orderList(item.content);
                        let temp = [];
                        temp.push({
                            title: '分数',
                            key: item.option,
                            align: 'right',
                            sortable: true,
                            width: 100,
                        });
                        temp.push({
                            title: '排名',
                            key: item.option + 'ranking',
                            align: 'right',
                            width: 100,
                            sortable: true,
                        });
                        this.columns.push({
                            title: item.option,
                            align: 'center',
                            children: temp
                        });
                    });
                    this.data.forEach((element) => {
                        let obj = {
                            userName: element.userName,
                            total: element.total,
                            ranking: element.ranking,
                        };
                        element.content.forEach((item) => {
                            obj[item.option] = item.total;
                            let obj2 = _.find(data2, ['option', item.option]).content;
                            obj[item.option + 'ranking'] = _.find(obj2, ['userName', element.userName]).ranking;
                        });
                        list.push(obj);
                    });
                }
            });
        },
        orderList(list) {
            let prescore = 0; //预定义分数
            let ranking = 0; //排名
            let same = 0; //是否相同
            list.forEach((item, index) => {
                if (item.total == prescore) {
                    item.ranking = ranking;
                    same++;
                } else {
                    ranking = ranking + same;
                    ranking++;
                    prescore = item.total;
                    same = 0;
                    item.ranking = ranking;
                }
            });
            return list;
        },
        getSurvey() {
            detailSurvey(this.id).then((res) => {
                if (res.code === 1) {
                    this.surveyName = res.data.surveyName;
                    this.date = res.data.date;
                } else {
                    this.surveyName = res.data.surveyName;
                    this.date = res.data.date;
                }
            });
        },
        createMap(data, data3) {
            let map = echarts.init(document.getElementById('map'));
            let xAxis = [];
            let series = [
                {
                    data: [],
                    type: 'bar',
                    name: '总分',
                    label: {
                        show: true,
                        position: 'top',
                        color: '#666',
                        fontSize: '16px',
                    },
                    barWidth: 30,
                },
            ];
            let legend = ['总分'];
            data.forEach((element) => {
                xAxis.push(element.userName);
                series[0].data.push(element.total);
            });
            data3.forEach((element) => {
                let temp = [];
                legend.push(element.option);
                xAxis.forEach((ele) => {
                    temp.push(_.find(element.content, ['userName', ele]).total);
                });
                series.push({
                    data: temp,
                    type: 'line',
                    name: element.option,
                    label: {
                        show: true,
                        position: 'top',
                        color: '#666',
                        fontSize: '16px',
                    },
                    barWidth: 30,
                });
            });
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999',
                        },
                    },
                },
                grid: {
                    top: '10%',
                    left: '2%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true,
                },
                legend: {
                    data: legend,
                },
                color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
                xAxis: {
                    type: 'category',
                    data: xAxis,
                    nameTextStyle: {
                        fontSize: '16px',
                        color: '#c3c3c3',
                    },
                },
                yAxis: {
                    type: 'value',
                },
                series: series,
            };
            map.setOption(option);
        },
        getRanking(name) {
            if (this.ranking2.length===0) {
                return '';
            }
            return  _.find(this.ranking2, ['name', name]).ranking;
        },
        createMap2(id, data, ranking, num) {
            let map = echarts.init(document.getElementById(id));
            let indicator = [];
            let series = [];
            let series2 = [];
            this.ranking.forEach(element => {
                if (element.name != '总分') {
                    indicator.push({name: element.name, max: num*10, min: 0});
                    series.push(_.find(data, ['option', element.name]).grade);
                    series2.push(_.find(ranking, ['name', element.name]).max);
                }
            });
            let option = {
                radar: {
                    indicator: indicator,
                    radius: '70%',
                    splitNumber: 5, // 雷达图圈数设置
                },
                legend: {
                    top: 0,
                    data: ['我的分数', '最高分']
                },
                tooltip: {
                    trigger: 'item'
                },
                color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
                series: [
                    {
                        type: 'radar',
                        data: [
                            {
                                value: series,
                                name: '我的分数',
                                label: {
                                    normal: {
                                        show: true,
                                        formatter:function(params) {
                                            return params.value;
                                        }
                                    }
                                }
                            },
                            {
                                value: series2,
                                name: '最高分',
                                label: {
                                    normal: {
                                        show: true,
                                        formatter:function(params) {
                                            return params.value;
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            };
            map.setOption(option);
        }
    },
    mounted() {
        this.getUserList();
        this.getSurvey();
    },
};
</script>
