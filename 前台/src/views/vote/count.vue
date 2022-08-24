<style lang="less">
@import './vote.less';
</style>
<template>
    <Card :title="`${surveyName}(${date})投票结果`">
        <div slot="extra">
            <Button type="primary" to="/vote/survey">返回</Button>
        </div>
        <div style="margin-bottom: 40px;">
            <Select clearable multiple placeholder="选择员工" v-model="people" style="margin-bottom: 10px;">
                <Option v-for="item in peopleList" :value="item.nickName" :key="item.userId">{{ item.nickName }}</Option>
            </Select>
            <Button type="primary" ghost @click="people=['卫杰','马艳雄','尹晓龙','王利英','贾晓东','韩文明','郭晓琼','王振','王天乐','刘国威','孙玲','崔永辉','畅雪琦','高爽','颜情']" class="margin-bottom20">设计组+前端组</Button>
            <Button type="primary" ghost @click="people=['卫杰','马艳雄','尹晓龙','王利英','贾晓东','韩文明','郭晓琼','王振','王天乐','刘国威']" style="margin-left: 10px;">前端组</Button>
            <Button type="primary" ghost @click="people=['孙玲','崔永辉','畅雪琦','高爽','颜情']" style="margin-left: 10px;">设计组</Button>
            <Button type="primary" ghost @click="people=[]" style="margin-left: 10px;">清空选择</Button>
            <Button type="primary" style="margin-left: 10px;" @click="count">查询</Button>
        </div>
        <div class="map" id="map"></div>
        <Table border :data="list" :columns="columns"></Table>
    </Card>
</template>
<script>
import { getAllUserData, countSurvey, detailSurvey } from '@/api/index';
import echarts from 'echarts';
export default {
    name: 'vote-count',
    data() {
        return {
            id: this.$route.params.id,
            data: [],
            surveyName: '',
            date: '',
            list: [],
            people: [],
            peopleList: [],
            columns: [],
        };
    },
    methods: {
        getUserList() {
            getAllUserData().then((res) => {
                if (res.code === 1) {
                    this.peopleList = res.data;
                    this.peopleAll();
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
            countSurvey({ id: this.id, people: this.people }).then((res) => {
                if (res.code === 1) {
                    this.list = [];
                    this.data = this.orderList(res.data);
                    this.columns = [
                        {
                            title: '排名',
                            key: 'ranking',
                            align: 'center',
                            sortable: true,
                            width: 80,
                        },
                        {
                            title: '姓名',
                            key: 'userName',
                        },
                        {
                            title: '总分',
                            key: 'total',
                            align: 'right',
                            width: 100,
                        }
                    ];
                    let data2 = res.data2;
                    data2.forEach((item) => {
                        item.content = this.orderList(item.content);
                        let temp = [];
                        temp.push({
                            title: '分数',
                            key: item.option,
                            align: 'right',
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
                        this.list.push(obj);
                    });
                    this.createMap(res.data3);
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
                }
            });
        },
        createMap(data3) {
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
            this.data.forEach((element) => {
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
                color: ['#87cefa', '#ff7f50', '#da70d6', '#32cd32', '#6495ed', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0', '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700', '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'],
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
    },
    mounted() {
        this.getUserList();
        this.getSurvey();
    },
};
</script>
