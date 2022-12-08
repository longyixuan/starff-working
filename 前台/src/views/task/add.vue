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
                            <div class="rwgl-table-col" style="width: 200px">任务名称</div>
                            <div class="rwgl-table-col" style="width: 200px">所属系统</div>
                            <div class="rwgl-table-col" style="width: 100px">状态</div>
                            <!-- <div class="rwgl-table-col" style="width: 120px">经办人</div> -->
                            <!-- <div class="rwgl-table-col" style="width: 120px">开始时间</div> -->
                            <!-- <div class="rwgl-table-col" style="width: 120px">结束时间</div> -->
                            <!-- <div class="rwgl-table-col" style="width: 100px">任务类型</div> -->
                        </div>
                    </div>
                    <div class="rwgl-table-body">
                        <div class="rwgl-table-row" :key="item.id" @click="showDetail(item)" v-for="item in list">
                            <div class="rwgl-table-col" style="width: 200px">
                                <Icon type="md-arrow-dropright" size="18" v-if="!item.frwId"/>
                                {{ item.rwmc }}
                                <Tooltip placement="top" transfer content="添加子任务" v-if="!item.frwId">
                                    <Icon type="md-add-circle" class="add-task-c" @click.native.stop="addTaskC(item)"/>
                                </Tooltip>
                            </div>
                            <div class="rwgl-table-col" style="width: 200px">{{ xtFn(item.xtId) }}</div>
                            <div class="rwgl-table-col" style="width: 100px">
                                <span :class="rwzt(item.rwzt)">{{ item.rwzt }}</span>
                            </div>
                            <!-- <div class="rwgl-table-col" style="width: 120px">{{ jbrFn(item.jbrId) }}</div> -->
                            <!-- <div class="rwgl-table-col" style="width: 120px">{{ moment(item.kssj) }}</div> -->
                            <!-- <div class="rwgl-table-col" style="width: 120px">{{ moment(item.jssj) }}</div> -->
                            <!-- <div class="rwgl-table-col" style="width: 100px">
                                <span class="rwlx-tag-warp" v-if="item.rwlx == '任务'">
                                    <span class="rwlx-tag rwlx-tag-rw"><Icon type="md-mail" color="#fff" /></span>
                                    {{ item.rwlx }}
                                </span>
                                <span class="rwlx-tag-warp" v-if="item.rwlx == 'bug'">
                                    <span class="rwlx-tag rwlx-tag-bug"><Icon type="md-bug" color="#fff" /></span>
                                    {{ item.rwlx }}
                                </span>
                            </div> -->
                        </div>
                    </div>
                </div>
                <div class="rwgl-task">
                    <div class="rwgl-task-table" id="rwgl-task-table" ref="rwgl-task-table" :style="{ width: 210 * weekDate.length + 'px' }">
                        <div class="rwgl-task-header rwgl-table-header">
                            <div class="rwgl-table-row">
                                <div v-for="item in weekDate" class="rwgl-table-col" style="width: 210px">
                                    <div class="rwgl-table-row-month">{{ item.range.month }}</div>
                                    <div class="rwgl-table-row-day">
                                        <span class="rwgl-table-row-day-item"
                                            :class="{ 'zm': itemIndex > 4, cur: isCurDay(item, itemIndex) }"
                                            v-for="(itemValue, itemIndex) in getWeekArr(item.range.start)">
                                            {{ itemValue }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rwgl-task-body">
                            <div class="rwgl-task-body-bar" :key="item.id + '-task'" v-for="item in list">
                                <div class="rwgl-task-body-col" v-for="item in weekDate"></div>
                                <div class="rwgl-task-body-barbg" :style="getStyle(item)"
                                    @click="showDetail(item)">
                                    <div v-for="(progress, progressIndex) in getNum(item).num" class="task-progress" :class="{'do': !getNum(item).log.includes(progressIndex), 'jh': getNum(item).numJh == progressIndex && getNum(item).num > getNum(item).numJh}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
        <Modal v-model="modal" width="1000" title="创建任务" :mask-closable="false">
            <Form :label-width="100">
                <FormItem label="父任务名称" v-if="form.frwId">
                    {{frwmc}}
                </FormItem>
                <FormItem label="任务名称" class="ivu-form-item-required">
                    <Input placeholder="请输入" v-model="form.rwmc"></Input>
                </FormItem>
                <FormItem label="jira地址">
                    <Input placeholder="请输入" v-model="form.jira"></Input>
                </FormItem>
                <FormItem label="所属系统" class="ivu-form-item-required">
                    <Select placeholder="请选择" v-model="form.xtId" filterable>
                        <Option :value="item.id" :key="item.id" v-for="item in sysList">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="经办人" class="ivu-form-item-required">
                    <Select placeholder="请选择" v-model="form.jbrId" filterable>
                        <Option :value="item.userName" :key="item.userId" v-for="item in userList">{{ item.nickName ?
                                item.nickName : item.userName
                        }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="任务类型" class="ivu-form-item-required">
                    <Select placeholder="请选择" v-model="form.rwlx">
                        <Option :value="item" :key="item" v-for="item in rwLx">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="任务期限" class="ivu-form-item-required">
                    <DatePicker type="date" placeholder="请选择" v-model="form.kssj" style="width: 200px"></DatePicker>
                    至
                    <DatePicker type="date" placeholder="请选择" v-model="form.jssj" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="当前状态" class="ivu-form-item-required">
                    <Select placeholder="请选择" v-model="form.rwzt" style="width: 200px">
                        <Option :value="item" :key="item" v-for="item in ztList">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注">
                    <Input type="textarea" placeholder="请输入" v-model="form.bz" :rows="4"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="ok">确定</Button>
                <Button type="error" @click="del">删除</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {
    getYearWeek,
    getWeekNum,
    getAllWeekRange,
    getWeekRange
} from "@/libs/dateHelp";
import {
    getSystemList,
    getAllUserData,
    addTask,
    listTask,
    updateTask,
    delTask
} from '@/api/index';
import moment from 'moment';
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
                id: '',
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
            frwmc: '',
            weekDate: []
        };
    },
    components: {
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
            if (!this.form.id) {
                this.addTask();
            } else {
                this.updateTask();
            }
        },
        cancel() {
            this.modal = false;
        },
        del(id) {
            delTask({id: this.form.id }).then(res => {
                this.$Message.success(res.msg);
                this.modal = false;
            })
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
            addTask({
                rwmc: this.form.rwmc,
                xtId: this.form.xtId,
                frwId: this.form.frwId,
                rwlx: this.form.rwlx,
                rwzt: this.form.rwzt,
                jbrId: this.form.jbrId,
                jira: this.form.jira,
                kssj: moment(this.form.kssj).format('YYYY-MM-DD'),
                jssj: moment(this.form.jssj).format('YYYY-MM-DD'),
                yxj: this.form.yxj,
                bz: this.form.bz,
            }).then( res => {
                this.$Message.success(res.msg);
                this.modal = false;
            });
        },
        updateTask() {
            updateTask({
                updateTime: moment().format('YYYY-MM-DD'),
                id: this.form.id,
                rwmc: this.form.rwmc,
                xtId: this.form.xtId,
                frwId: this.form.frwId,
                rwlx: this.form.rwlx,
                rwzt: this.form.rwzt,
                jbrId: this.form.jbrId,
                jira: this.form.jira,
                kssj: moment(this.form.kssj).format('YYYY-MM-DD'),
                jssj: moment(this.form.jssj).format('YYYY-MM-DD'),
                yxj: this.form.yxj,
                bz: this.form.bz,
            }).then( res => {
                this.$Message.success(res.msg);
                this.modal = false;
            });
        },
        listTask() {
            listTask().then((res) => {
                this.list = res.data;
            });
        },
        dragControllerLR() {
            let resize = document.getElementsById('resize');
            resize.onmousedown = (e) => {
                console.log(e)
            }
        },
        mapWeeksOfyear() {
            const startDay = moment().startOf('year').format('YYYY-MM-DD');
            const lastDay = moment().endOf('year').format('YYYY-MM-DD');
            const startWeek = moment().startOf('week').format('YYYY-MM-DD');
            const endWeek = moment().endOf('week').format('YYYY-MM-DD');
            console.log(startDay, lastDay, startWeek, endWeek);
        },
        getWeekArr(startDay) {
            let arr = [];
            arr.push(moment(startDay).format('DD'));
            arr.push(moment(startDay).add(1, 'days').format('DD'));
            arr.push(moment(startDay).add(2, 'days').format('DD'));
            arr.push(moment(startDay).add(3, 'days').format('DD'));
            arr.push(moment(startDay).add(4, 'days').format('DD'));
            arr.push(moment(startDay).add(5, 'days').format('DD'));
            arr.push(moment(startDay).add(6, 'days').format('DD'));
            return arr;
        },
        getStyle({ kssj, jssj, taskLog }) {
            let temp = _.uniqBy(taskLog, 'updateTime');
            let log = [];
            let days = 0;
            temp.forEach(element => {
                if (moment(element.updateTime).diff(moment(jssj), "days")>0) { //超时完成
                    days = moment(element.updateTime).diff(moment(jssj), "days");
                }
                log.push(moment(element.updateTime).diff(moment(kssj), "days"))
            });
            let num = getYearWeek(moment(kssj).format('YYYY-MM-DD')); //第几周
            let dayNum = moment(jssj).diff(moment(kssj), "days");
            let num2 = moment(kssj).diff(moment(this.weekDate[num].range.start), "days")
            return {
                width: days > 0 ? (days+1) * 30 + 'px' : (dayNum+1) * 30 + 'px',
                left: num * 210 + num2 * 30 + 'px',
                borderColor: days > 0 ? '#fa8888' : '#6698ff'
            };
        },
        getNum({ kssj,jssj,taskLog }) {
            let temp = _.uniqBy(taskLog, 'updateTime');
            let log = [];
            let days = 0;
            temp.forEach(element => {
                if (moment(element.updateTime).diff(moment(jssj), "days")>0) { //超时完成
                    days = moment(element.updateTime).diff(moment(jssj), "days");
                }
                log.push(moment(element.updateTime).diff(moment(kssj), "days"))
            });
            return {
                log: log,
                numJh: moment(jssj).diff(moment(kssj), "days"),
                num: days > 0 ? (days+1) : (moment(jssj).diff(moment(kssj), "days")+1)
            };
        },
        isCurDay(obj, dayIndex) {
            let date1 = moment(obj.range.start).add(dayIndex, 'days').format('YYYY-MM-DD');
            return moment().format('YYYY-MM-DD') === date1;
        },
        showDetail(item) {
            this.form.id = item.id;
            this.form.rwmc = item.rwmc;
            this.form.xtId = item.xtId;
            this.form.frwId = item.frwId;
            this.form.rwlx = item.rwlx;
            this.form.rwzt = item.rwzt;
            this.form.jbrId = item.jbrId;
            this.form.jira = item.jira;
            this.form.kssj = item.kssj;
            this.form.jssj = item.jssj;
            this.form.yxj = item.yxj;
            this.form.bz = item.bz;
            this.modal = true;
        },
        addTaskC(task) {
            this.frwmc = task.rwmc;
            this.form.frwId = task.id;
            this.form.xtId = task.xtId;
            this.form.jbrId = task.jbrId;
            this.form.jssj = task.jssj;
            this.modal = true;
        },
    },
    mounted() {
        this.getSystemList();
        this.getUserList();
        this.listTask();
        this.$nextTick(() => {
            this.$refs['rwgl-task-table'].scrollTo({
                left: 200,
                behavior: 'smooth'
            });
        });
    },
    created() {
        this.weekDate = getAllWeekRange(new Date().getFullYear());
    }
};
</script>
