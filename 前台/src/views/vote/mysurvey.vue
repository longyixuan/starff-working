<style lang="less">
@import './vote.less';
</style>
<template>
    <Card title="我的投票">
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" :to="'/vote/mycount/' + row.surveyId">查看结果</Button>
            </template>
        </Table>
    </Card>
</template>
<script>
import { getSurveyListMy } from '@/api/index';
export default {
    name: 'timeline',
    data() {
        return {
            data: [],
            columns: [
                {
                    title: '名称',
                    key: 'surveyName',
                },
                {
                    title: '创建日期',
                    width: 140,
                    align: 'center',
                    key: 'date',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 100,
                    align: 'center',
                },
            ],
        };
    },
    methods: {
        getSurveyList() {
            getSurveyListMy().then((res) => {
                this.data = res.data;
            });
        }
    },
    mounted() {
        this.getSurveyList();
    },
};
</script>
