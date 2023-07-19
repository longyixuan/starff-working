<style lang="less">
@import './task.less';
</style>

<template>
    <div>
        <Card dis-hover title="任务进度管理 - 查看归档">
            <div class="task-search" style="margin-bottom: 20px">
                <Select placeholder="所属系统" multiple v-model="search.xtId" filterable clearable style="width: 160px;margin-right:10px;">
                    <Option :value="item.id" :key="item.id" v-for="item in sysList">{{ item.title }}</Option>
                </Select>
                <Select placeholder="经办人" multiple v-model="search.jbrId" filterable clearable style="width: 140px;margin-right:10px;">
                    <Option :value="item.userName" :key="item.userId" v-for="item in userList">{{ item.nickName ?
                            item.nickName : item.userName
                    }}</Option>
                </Select>
                <Select placeholder="状态" multiple clearable v-model="search.rwzt" style="width: 100px;margin-right:10px;">
                    <Option :value="item.id" :key="item.id" v-for="item in ztList">{{ item.name }}</Option>
                </Select>
                <DatePicker type="date" placeholder="开始时间" v-model="search.kssj" style="width: 120px;margin-right:10px;"></DatePicker>
                <DatePicker type="date" placeholder="结束时间" v-model="search.jssj" style="width: 120px;margin-right:10px;"></DatePicker>
                <Input v-model="search.rwmc" style="width: 200px;margin-right:10px;" clearable placeholder="任务名称" autocomplete="off"/>
                <Button type="primary" style="margin-right:10px;" @click="searchFn">查询</Button>
            </div>
            <div class="chsi-gantt" style="border-right: 0;">
                <div class="rwgl-table" style="width: 100%;box-shadow: none">
                    <div class="rwgl-table-header">
                        <div class="rwgl-table-row">
                            <div class="rwgl-table-col" style="width: 50px">序号</div>
                            <div class="rwgl-table-col" style="width: 160px">所属系统</div>
                            <div class="rwgl-table-col flex1">任务名称</div>
                            <div class="rwgl-table-col" style="width: 50px">Jira</div>
                            <div class="rwgl-table-col" style="width: 100px">状态</div>
                            <div class="rwgl-table-col" style="width: 100px">经办人</div>
                            <div class="rwgl-table-col" style="width: 100px">开始时间</div>
                            <div class="rwgl-table-col" style="width: 100px">结束时间</div>
                            <div class="rwgl-table-col" style="width: 80px">操作</div>
                        </div>
                    </div>
                    <div class="rwgl-table-body">
                        <div class="rwgl-table-flex" :key="'fz-'+ fzIndex" v-for="fz,fzIndex in list">
                            <div class="rwgl-table-xt" style="width: 50px;">
                                <span style="text-align: center;flex: 1">{{fzIndex+1}}</span>
                            </div>
                            <div class="rwgl-table-xt" style="width: 160px;">
                                <Tooltip placement="top" transfer :content="fz.xtmc">
                                    <span class="task-text" style="width: 132px;">{{fz.xtmc}}</span>
                                </Tooltip>
                            </div>
                            <div class="rwgl-table-rw rw-flex1">
                                <template v-for="item,itemIndex in fz.rwList">
                                    <div class="rwgl-table-row" :key="'tasklist-'+itemIndex" @click="getLog(item.id)">
                                        <div class="rwgl-table-col flex1">
                                            <span class="task-text" style="color: #2d8cf0;cursor: pointer;" :title="item.rwmc">{{ item.rwmc }}</span>
                                        </div>
                                        <div class="rwgl-table-col" style="width: 50px;text-align: center;">
                                            <a :href="item.jira" v-if="item.jira" target="_blank">查看</a>
                                            <span v-else>-</span>
                                        </div>
                                        <div class="rwgl-table-col" style="width: 100px">
                                            <span>{{ getrRwzt(item.rwzt) }}</span>
                                        </div>
                                        <div class="rwgl-table-col" style="width: 100px">{{ jbrFn(item.jbrId) }}</div>
                                        <div class="rwgl-table-col" style="width: 100px;text-align: center;" >{{ moment(item.kssj) }}</div>
                                        <div class="rwgl-table-col" style="width: 100px;text-align: center;">{{ item.jssj ? moment(item.jssj) : '-' }}</div>
                                        <div class="rwgl-table-col" style="width: 80px">
                                            <span class="action-btn" @click.stop="hisTask(item.id)" size="small">撤销归档</span>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
        <Modal v-model="modalC" title="详情" width="1000">
            <Table border :columns="columns" :data="listC" >
                <template slot-scope="{ row, index }" slot="updateTime">
                    {{moment(row.updateTime)}}
                </template>
                <template slot-scope="{ row, index }" slot="bz">
                    <div style="white-space: pre-line;" v-html="row.bz"></div>
                </template>
            </Table>
            <div slot="footer">
                <Button type="primary" @click="modalC = false;">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {
    getSystemList,
    getAllUserData,
    listTask,
    logTask,
    hisTask,
    getTaskTagList
} from '@/api/index';
import moment from 'moment';
export default {
    name: 'task',
    data() {
        return {
            modal: false,
            sysList: [],
            ztList: [],
            userList: [],
            list: [],
            form: {
                id: '',
                rwmc: '',
                xtId: '',
                rwzt: '',
                jbrId: JSON.parse(localStorage.getItem('userInfo')).userId,
                jira: '',
                kssj: '',
                jssj: '',
                bz: '',
            },
            frwmc: '',
            search: {
                xtId: [],
                rwmc: '',
                rwzt: [],
                jbrId: [],
                kssj: '',
                jssj: ''
            },
            weekDate: [],
            modalC: false,
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '更新时间',
                    width: 140,
                    slot: 'updateTime'
                },
                {
                    title: '备注',
                    slot: 'bz'
                }
            ],
            listC: []
        };
    },
    components: {
    },
    methods: {
        getrRwzt(rwzt) {
            if (this.ztList.length===0) {
                return '';
            }
            return _.find(this.ztList, ['id', rwzt]).name;
        },
        jbrFn(userName) {
            if (_.find(this.userList, ['userName', userName])) {
                return _.find(this.userList, ['userName', userName]).nickName;
            }
            return '';
        },
        xtFn(sysemId) {
            if (_.find(this.sysList, ['id', sysemId])) {
                return _.find(this.sysList, ['id', sysemId]).title;
            }
            return '';
        },
        getSystemList() {
            getSystemList().then((res) => {
                this.sysList = res.data;
            });
        },
        getUserList() {
            getAllUserData().then((res) => {
                if (res.code === 1) {
                    this.userList = res.data;
                }
            });
        },
        listTask() {
            listTask({ isHistory: true }).then((res) => {
                this.list = res.data;
            });
        },
        searchFn() {
            listTask({
                isHistory: true,
                xtId: this.search.xtId,
                rwmc: this.search.rwmc,
                rwzt: this.search.rwzt,
                jbrId: this.search.jbrId,
                kssj: this.search.kssj ? moment(this.search.kssj).format('YYYY-MM-DD') : '',
                jssj: this.search.jssj ? moment(this.search.jssj).format('YYYY-MM-DD') : ''
            }).then((res) => {
                this.list = res.data;
            });
        },
        getLog(id) {
            logTask({id: id}).then(res => {
                this.modalC = true;
                this.listC = res.data;
            });
        },
        moment(date) {
            return moment(date).format('YYYY-MM-DD');
        },
        hisTask(id) {
            hisTask({
                id: id,
                isHistory: false
            }).then(res => {
                this.$Message.success(res.msg);
                this.listTask();
            });
        },
        getTaskTagList() {
            getTaskTagList().then( res => {
                this.ztList = res.data;
            });
        }
    },
    mounted() {
        this.getTaskTagList();
        this.getSystemList();
        this.getUserList();
        this.listTask();
        if (JSON.parse(localStorage.getItem('userInfo')).userName!=='admin' && JSON.parse(localStorage.getItem('userInfo')).userName!=='lvf') {
            this.search.jbrId.push(JSON.parse(localStorage.getItem('userInfo')).userName);
        }
    }
};
</script>
