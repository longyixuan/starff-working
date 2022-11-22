<style lang="less">
@import './task.less';
</style>

<template>
    <div>
        <Card title="任务管理">
            <Button type="primary" @click="modal = true" style="margin-bottom: 20px">添加</Button>
            <div class="chsi-gantt">
                <div class="rwgl-table">
                    <div class="rwgl-table-header">
                        <div class="rwgl-table-row">
                            <div class="rwgl-table-col flex1">任务名称</div>
                            <div class="rwgl-table-col" style="width: 200px">所属系统</div>
                            <div class="rwgl-table-col" style="width: 100px">状态</div>
                            <div class="rwgl-table-col" style="width: 120px">经办人</div>
                            <div class="rwgl-table-col" style="width: 120px">开始时间</div>
                            <div class="rwgl-table-col" style="width: 120px">结束时间</div>
                            <div class="rwgl-table-col" style="width: 100px">任务类型</div>
                        </div>
                    </div>
                    <div class="rwgl-table-body">
                        <div class="rwgl-table-row" :key="item.id" v-for="item in list">
                            <div class="rwgl-table-col flex1">{{ item.rwmc }}</div>
                            <div class="rwgl-table-col" style="width: 200px">{{ xtFn(item.xtId) }}</div>
                            <div class="rwgl-table-col" style="width: 100px">
                                <span :class="rwzt(item.rwzt)">{{ item.rwzt }}</span>
                            </div>
                            <div class="rwgl-table-col" style="width: 120px">{{ jbrFn(item.jbrId) }}</div>
                            <div class="rwgl-table-col" style="width: 120px">{{ moment(item.kssj) }}</div>
                            <div class="rwgl-table-col" style="width: 120px">{{ moment(item.jssj) }}</div>
                            <div class="rwgl-table-col" style="width: 100px">
                                <span class="rwlx-tag-warp" v-if="item.rwlx == '任务'">
                                    <span class="rwlx-tag rwlx-tag-rw"><Icon type="md-mail" color="#fff" /></span>
                                    {{ item.rwlx }}
                                </span>
                                <span class="rwlx-tag-warp" v-if="item.rwlx == 'bug'">
                                    <span class="rwlx-tag rwlx-tag-bug"><Icon type="md-bug" color="#fff" /></span>
                                    {{ item.rwlx }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
        <Modal v-model="modal" width="1000" title="创建任务" :mask-closable="false">
            <Form :label-width="80">
                <FormItem label="任务名称" class="ivu-form-item-required">
                    <Input placeholder="请输入" v-model="form.rwmc"></Input>
                </FormItem>
                <FormItem label="jira地址">
                    <Input placeholder="请输入" v-model="form.jira"></Input>
                </FormItem>
                <FormItem label="备注">
                    <Input type="textarea" placeholder="请输入" v-model="form.bz" :rows="4"></Input>
                </FormItem>
                <FormItem label="所属系统" class="ivu-form-item-required">
                    <Select placeholder="请选择" v-model="form.xtId" filterable>
                        <Option :value="item.id" :key="item.id" v-for="item in sysList">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="经办人" class="ivu-form-item-required">
                    <Select placeholder="请选择" v-model="form.jbrId" filterable>
                        <Option :value="item.userName" :key="item.userId" v-for="item in userList">{{ item.nickName ? item.nickName : item.userName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="任务类型" class="ivu-form-item-required">
                    <Select placeholder="请选择" v-model="form.rwlx">
                        <Option :value="item" :key="item" v-for="item in rwLx">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始时间" class="ivu-form-item-required">
                    <DatePicker type="date" placeholder="请选择" v-model="form.kssj" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="结束时间" class="ivu-form-item-required">
                    <DatePicker type="date" placeholder="请选择" v-model="form.jssj" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="当前状态" class="ivu-form-item-required">
                    <Select placeholder="请选择" v-model="form.rwzt" style="width: 200px">
                        <Option :value="item" :key="item" v-for="item in ztList">{{ item }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="ok">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getSystemList, getAllUserData, addTask, listTask } from '@/api/index';
import moment from 'moment';
// import gantt from './Gantt.vue';
export default {
    name: 'task',
    data() {
        return {
            modal: false,
            sysList: [],
            ztList: ['未开始', '进行中', '已完成'],
            rwLx: ['任务', 'bug'],
            userList: [],
            list: [],
            form: {
                rwmc: '',
                xtId: '',
                frwId: '',
                rwlx: '任务',
                rwzt: '未开始',
                jbrId: JSON.parse(localStorage.getItem('userInfo')).userId,
                jira: '',
                kssj: '',
                jssj: '',
                yxj: 0,
                bz: '',
            },
            tableData2: [
                { id: 10000, parentId: null, name: 'Test1', type: 'mp3', size: 1024, date: '2020-08-01' },
                { id: 10050, parentId: null, name: 'Test2', type: 'mp4', size: null, date: '2021-04-01' },
                { id: 24300, parentId: 10050, name: 'Test3', type: 'avi', size: 1024, date: '2020-03-01' },
                { id: 20045, parentId: 24300, name: 'Test4', type: 'html', size: 600, date: '2021-04-01' },
                { id: 10053, parentId: 24300, name: 'Test5', type: 'avi', size: null, date: '2021-04-01' },
                { id: 24330, parentId: 10053, name: 'Test6', type: 'txt', size: 25, date: '2021-10-01' },
                { id: 21011, parentId: 10053, name: 'Test7', type: 'pdf', size: 512, date: '2020-01-01' },
                { id: 22200, parentId: 10053, name: 'Test8', type: 'js', size: 1024, date: '2021-06-01' },
                { id: 23666, parentId: null, name: 'Test9', type: 'xlsx', size: 2048, date: '2020-11-01' },
                { id: 23677, parentId: 23666, name: 'Test10', type: 'js', size: 1024, date: '2021-06-01' },
                { id: 23671, parentId: 23677, name: 'Test11', type: 'js', size: 1024, date: '2021-06-01' },
                { id: 23672, parentId: 23677, name: 'Test12', type: 'js', size: 1024, date: '2021-06-01' },
                { id: 23688, parentId: 23666, name: 'Test13', type: 'js', size: 1024, date: '2021-06-01' },
                { id: 23681, parentId: 23688, name: 'Test14', type: 'js', size: 1024, date: '2021-06-01' },
                { id: 23682, parentId: 23688, name: 'Test15', type: 'js', size: 1024, date: '2021-06-01' },
                { id: 24555, parentId: null, name: 'Test16', type: 'avi', size: 224, date: '2020-10-01' },
                { id: 24566, parentId: 24555, name: 'Test17', type: 'js', size: 1024, date: '2021-06-01' },
                { id: 24577, parentId: 24555, name: 'Test18', type: 'js', size: 1024, date: '2021-06-01' }
            ],
            defaultExpandKeys: [10050]
        };
    },
    components: {
        // gantt,
    },
    methods: {
        rwzt(rwzt) {
            if (rwzt === '未开始') {
                return 'rwzt-tag wks';
            }
            if (rwzt === '进行中') {
                return 'rwzt-tag jxz';
            }
            if (rwzt === '已完成') {
                return 'rwzt-tag ywc';
            }
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
        moment(data) {
            return moment(data).format('YYYY-MM-DD');
        },
        ok() {
            this.addTask();
        },
        cancel() {
            this.modal = false;
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
        addTask() {
            addTask(this.form).then((res) => {});
        },
        listTask() {
            listTask().then((res) => {
                this.list = res.data;
            });
        },
        dragControllerLR() {
            let resize = document.getElementsById('resize');
            resize.onmousedown = (e)=>{
                console.log(e)
            }
        }
    },
    mounted() {
        this.getSystemList();
        this.getUserList();
        this.listTask();
    },
};
</script>
