<style lang="less">
@import './task.less';
</style>

<template>
    <div>
        <Card title="任务进度管理 - 统计">
            <calendar-heatmap
                :values="values"
                :end-date="endDate"
                no-data-text="无数据"
                tooltip-unit="条任务"
                :locale="locale"
                @day-click="dayClick"
                :max="30"/>
        </Card>
    </div>
</template>

<script>
import moment from 'moment';
import {
    tongji
} from '@/api/index';
import { CalendarHeatmap } from 'vue-calendar-heatmap';
export default {
    name: 'task-tongji',
    data() {
        return {
            values: [],
            endDate: moment(),
            locale: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                on: '更新于',
                less: '少',
                more: '多'
            }
        };
    },
    components: {
        CalendarHeatmap
    },
    methods: {
        dayClick(day) {
            console.log(day)
        }
    },
    mounted() {
        tongji({
            startDate: moment().startOf('year').format("YYYY-MM-DD"),
            endDate: moment().endOf('year').format("YYYY-MM-DD")
        }).then(res => {
            this.values = res.data;
        });
    }
};
</script>
