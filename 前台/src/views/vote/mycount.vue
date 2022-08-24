<style lang="less">
@import './vote.less';
</style>
<template>
    <Card :title="`${surveyName}(${date})投票结果`">
        <div slot="extra">
            <Button type="primary" to="/vote/mysurvey">返回</Button>
        </div>
        <Alert type="warning">
            <div style="margin-bottom: 10px;">
                <Icon type="ios-ribbon" color="#ff9900"/>部门排名<Icon type="md-arrow-forward" />
                <template v-for="item in ranking">
                    {{item.name}}排名：<strong>{{item.ranking}}</strong>；
                </template>
            </div>
            <div>
                <Icon type="ios-ribbon" color="#ff9900"/>小组排名<Icon type="md-arrow-forward" />
                <template v-for="item in ranking">
                    {{item.name}}排名：<strong>{{getRanking(item.name)}}</strong>；
                </template>
            </div>
        </Alert>
        <div class="map" id="map"></div>
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
            ranking2: []
        };
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
                people: ['卫杰','马艳雄','尹晓龙','王利英','贾晓东','韩文明','郭晓琼','王振','王天乐','刘国威','孙玲','崔永辉','畅雪琦','高爽','颜情']
            }).then(res => {
                if (res.code === 1) {
                    this.surveyName = res.surveyName;
                    this.date = res.date;
                    this.ranking = res.ranking;
                    this.createMap(res.data);
                }
            })
            countSurveyMy({
                id: this.id,
                people: _.includes(['卫杰','马艳雄','尹晓龙','王利英','贾晓东','韩文明','郭晓琼','王振','王天乐','刘国威'], JSON.parse(localStorage.getItem('userInfo')).nickName)?['卫杰','马艳雄','尹晓龙','王利英','贾晓东','韩文明','郭晓琼','王振','王天乐','刘国威']:['孙玲','崔永辉','畅雪琦','高爽','颜情']
            }).then(res => {
                if (res.code === 1) {
                    this.ranking2 = res.ranking;
                }
            })
        },
        createMap(data) {
            let map = echarts.init(document.getElementById('map'));
            let indicator = [];
            let series = [];
            data.forEach(element => {
                indicator.push({name: element.option});
                series.push(element.grade);
            });
            let option = {
                radar: {
                    indicator: indicator
                },
                tooltip: {
                    confine: true,
                },
                color: ['#87cefa', '#ff7f50', '#da70d6', '#32cd32', '#6495ed', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0', '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700', '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'],
                series: [
                    {
                        name: '评分详情',
                        type: 'radar',
                        data: [
                            {
                                value: series
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
