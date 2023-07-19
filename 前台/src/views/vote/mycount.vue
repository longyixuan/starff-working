<style lang="less">
@import './vote.less';
</style>
<template>
    <Card dis-hover :title="`${surveyName}(${date})投票结果`">
        <div slot="extra">
            <Button type="primary" to="/vote/mysurvey">返回</Button>
        </div>
        <Row :gutter="20">
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
                    <div class="map" id="map"></div>
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
                    <div class="map" id="map2"></div>
                </Card>
            </Col>
        </Row>
    </Card>
</template>
<script>
import {
    countSurveyMy
} from '@/api/index';
import echarts from 'echarts';
export default {
    name: 'vote-count',
    data() {
        return {
            id: this.$route.params.id,
            surveyName: '',
            date: '',
            ranking: [],
            ranking2: [],
            qd: ['卫杰','马艳雄','尹晓龙','王利英','贾晓东','韩文明','郭晓琼','王振','王天乐','刘国威'],
            sj: ['孙玲','崔永辉','畅雪琦','高爽','颜情', '何晨曦']
        };
    },
    computed: {
        getGroupName() {
            return _.includes(this.qd ,JSON.parse(localStorage.getItem('userInfo')).nickName)?'前端':'设计';
        }
    },
    methods: {
        getRanking(name) {
            if (this.ranking2.length===0) {
                return '';
            }
            return  _.find(this.ranking2, ['name', name]).ranking;
        },
        count() {
            countSurveyMy({
                id: this.id,
                people: [...this.qd, ...this.sj]
            }).then(res => {
                if (res.code === 1) {
                    this.surveyName = res.surveyName;
                    this.date = res.date;
                    this.ranking = res.ranking;
                    this.createMap('map', res.data, res.ranking, res.num);
                    countSurveyMy({
                        id: this.id,
                        people: _.includes(this.qd, JSON.parse(localStorage.getItem('userInfo')).nickName)?this.qd:this.sj
                    }).then(res => {
                        if (res.code === 1) {
                            this.ranking2 = res.ranking;
                            this.createMap('map2', res.data, res.ranking, res.num);
                        }
                    })
                }
            })
        },
        createMap(id, data, ranking, num) {
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
                    data: ['我的', '最高分']
                },
                tooltip: {
                    confine: true,
                },
                color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
                series: [
                    {
                        type: 'radar',
                        data: [
                            {
                                value: series,
                                name: '我的分数'
                            },
                            {
                                value: series2,
                                name: '最高分'
                            }
                        ]
                    }
                ]
            };
            map.setOption(option);
        }
    },
    mounted() {
        this.count();
    },
};
</script>
