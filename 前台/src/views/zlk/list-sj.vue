<style lang="less">
@import './zlk.less';
</style>
<template>
    <Card dis-hover title="资料管理">
        <div style="margin-bottom: 20px;">
            <Button type="primary" to="/zlk/sjadd">新建</Button>
            <Button target="_blank" to="http://localhost:3333/md/download?type=sj" style="margin-left: 8px;" v-if="userName == 'admin'">导出所有</Button>
        </div>
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row }" slot="titleDes">
                <a class="link" :href="'/doc/sj?id='+row.title" target="_blank">{{row.titlePid ? row.titlePidDes + '-' : ''}}{{row.titleDes}}</a>
            </template>
            <template slot-scope="{ row }" slot="updated_at">
                {{row.updateTime}}
            </template>
            <template slot-scope="{ row }" slot="action">
                <a class="action-btn" target="_blank" :href="'/doc/sj?id='+row.title">预览</a>
                <a class="action-btn" :href="'/zlk/sjadd?id='+row.id">编辑</a>
                <a class="action-btn" @click="getMdLog(row.id)">更新日志</a>
            </template>
        </Table>
        <Modal
            v-model="modal"
            title="更新日志"
            width="1000">
            <Table border :data="logList" :columns="columnsLog"></Table>
            <div slot="footer" style="text-align: right;">
                <Button type="primary" @click="modal=false">关闭</Button>
            </div>
        </Modal>
    </Card>
</template>
<script>
import moment from 'moment';
import { mdList, mdLog, mdDownload } from '@/api/index';
export default {
    name: 'taskZt',
    data() {
        return {
            data: [],
            modal: false,
            userName: '',
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '名称',
                    slot: 'titleDes',
                },
                {
                    title: '最新更新人',
                    key: 'userName',
                    width: 120
                },
                {
                    title: '更新时间',
                    key: 'updated_at',
                    width: 170,
                    slot: 'updated_at',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                },
            ],
            logList: [],
            columnsLog: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '最新更新人',
                    key: 'userName',
                    width: 100
                },
                {
                    title: '更新时间',
                    key: 'updateTime',
                    width: 170
                },
                {
                    title: '备注',
                    key: 'bz'
                }
            ],
        };
    },
    methods: {
        init() {
            mdList({type: 'sj'}).then((res) => {
                this.data = res.data;
            });
        },
        getMdLog(id) {
            mdLog({id: id}).then((res) => {
                this.logList = res.data;
                this.modal = true;
            });
        },
        download(type) {
            mdDownload({type: type}).then((res) => {
                console.log(res.data)
            });
        }
    },
    mounted() {
        this.init();
        this.userName = JSON.parse(localStorage.getItem('userInfo')).userName;
    }
};
</script>