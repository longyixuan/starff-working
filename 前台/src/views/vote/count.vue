<style lang="less">
@import './vote.less';
</style>
<template>
    <Card :title="`${surveyName}(${date})投票结果`">
        <div class="map" id="map"></div>
    </Card>
</template>
<script>
import {
    countSurvey,
    detailSurvey
} from '@/api/index';
import echarts from 'echarts';
export default {
    name: 'timeline',
    data() {
        return {
            id: this.$route.params.id,
            data: [],
            surveyName: '',
            date: ''
        };
    },
    methods: {
        count() {
            countSurvey({ id: this.id }).then((res) => {
                if (res.code === 1) {
                    this.data = res.data;
                    let arr = [];
                    Object.keys(_.groupBy(this.data[0].content, 'option')).forEach( key => {
                        console.log(_.sumBy(_.groupBy(this.data[0].content, 'option')[key], 'grade'))
                    })
                    this.createMap();
                }
            });
        },
        getSurvey() {
            detailSurvey(this.id).then(res => {
                if (res.code === 1) {
                    this.surveyName = res.data.surveyName;
                    this.date = res.data.date;
                }
            })
        },
        createMap() {
            let map = echarts.init(document.getElementById('map'));
            let xAxis = [];
            let series = [];
            this.data.forEach(element => {
                xAxis.push(element.userName);
                series.push(element.total);
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
                    top: "10%",
                    left: "2%",
                    right: "4%",
                    bottom: "10%",
                    containLabel: true
                },
                color: ['#87cefa', '#ff7f50', '#da70d6', '#32cd32', '#6495ed', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0', '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700', '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'],
                xAxis: {
                    type: 'category',
                    data: xAxis,
                    nameTextStyle: {
                        fontSize: '16px',
                        color: "#c3c3c3"
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: series,
                        type: 'bar',
                        barWidth : 30
                    }
                ]
            }
            map.setOption(option);
        },
    },
    mounted() {
        this.count();
        this.getSurvey();
    },
};
</script>
