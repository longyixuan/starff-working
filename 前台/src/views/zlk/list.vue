<style lang="less">
@import './zlk.less';
</style>
<template>
    <Card title="资料管理">
        <div style="margin-bottom: 10px; text-align: right">
            <Button type="primary" to="/zlk/add">新建</Button>
        </div>
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" target="_blank" ta :to="'/zlk/index?id='+row.id">预览</Button>
                <Button type="primary" size="small" :to="'/zlk/add?id='+row.id">编辑</Button>
            </template>
        </Table>
    </Card>
</template>
<script>
import { mdList } from '@/api/index';
export default {
    name: 'taskZt',
    data() {
        return {
            data: [],
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '名称',
                    key: 'titleDes',
                },
                {
                    title: '最新更新人',
                    key: 'userName',
                    width: 120
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 140,
                    align: 'center',
                },
            ],
        };
    },
    methods: {
        init() {
            mdList().then((res) => {
                this.data = res.data;
            });
        },
    },
    mounted() {
        this.init();
    },
};
</script>