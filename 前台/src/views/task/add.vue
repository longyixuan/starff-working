<style lang="less">
@import './task.less';
</style>

<template>
    <div>
        <Card title="任务进度管理 - 查看任务">
            <div class="task-search">
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
                <Input v-model="search.rwmc" style="width: 200px;margin-right:10px;" clearable placeholder="任务名称" autocomplete="off"/>
                <Date-Picker type="date" placeholder="开始时间" v-model="search.kssj" style="width: 120px;margin-right:10px;margin-bottom: 10px;"></Date-Picker>
                <Date-Picker type="date" placeholder="结束时间" v-model="search.jssj" style="width: 120px;margin-right:10px;margin-bottom: 10px;"></Date-Picker>
                <Button type="primary" @click="quickTime('yestday')" ghost>昨天</Button>
                <Button type="primary" @click="quickTime('day')" ghost style="margin-left: 10px;">今天</Button>
                <Button type="primary" @click="quickTime('week')" ghost style="margin-left: 10px;">本周</Button>
                <Button
                type="primary"
                @click="quickTime('month')"
                ghost
                style="margin-left: 10px;"
                >本月</Button>
                <Button
                type="primary"
                @click="quickTime('preMonth')"
                ghost
                style="margin-left: 10px;"
                >上月</Button>
                <Button type="primary" style="margin-left:10px;" @click="searchFn">查询</Button>
                <Button type="primary" style="margin-left:10px;" @click="addModal">新增任务</Button>
            </div>
            <div style="margin-bottom: 10px;display:flex;align-items: center;">
                <Checkbox-Group v-model="tj" style="flex:1;">
                    显示列：
                    <Checkbox label="状态">状态</Checkbox>
                    <Checkbox label="经办人">经办人</Checkbox>
                    <Checkbox label="开始时间">开始时间</Checkbox>
                    <Checkbox label="结束时间">结束时间</Checkbox>
                </Checkbox-Group>
                <Radio-Group v-model="st" type="button" size="small">
                    视图：
                    <Radio label="day">日</Radio>
                    <Radio label="month">月</Radio>
                </Radio-Group>
            </div>
            <div class="chsi-gantt">
                <div class="rwgl-table">
                    <Affix>
                    <div class="rwgl-table-header">
                        <div class="rwgl-table-row">
                            <div class="rwgl-table-col" style="width: 50px">序号</div>
                            <div class="rwgl-table-col" style="width: 140px">所属系统</div>
                            <div class="rwgl-table-col" style="width: 300px">任务名称</div>
                            <div class="rwgl-table-col" style="width: 50px">Jira</div>
                            <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('状态')">状态</div>
                            <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('经办人')">经办人</div>
                            <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('开始时间')">开始时间</div>
                            <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('结束时间')">结束时间</div>
                        </div>
                    </div>
                    </Affix>
                    <div class="rwgl-table-body">
                        <div class="rwgl-table-flex" v-for="fz,fzIndex in list">
                            <div class="rwgl-table-xt" style="width: 50px;">
                                <span style="text-align: center;flex: 1">{{fzIndex+1}}</span>
                            </div>
                            <div class="rwgl-table-xt" style="width: 140px;">
                                <Tooltip max-width="120" placement="top" transfer :content="fz.xtmc">
                                    <span class="task-text" style="width: 132px;">{{fz.xtmc}}</span>
                                </Tooltip>
                            </div>
                            <div class="rwgl-table-rw rw-flex1">
                                <template v-for="item,itemIndex in fz.rwList">
                                    <div class="rwgl-table-row" :key="'tasklist-'+itemIndex">
                                        <div class="rwgl-table-col flex-block" style="width: 300px;cursor: pointer;" @click="showDetail(item)">
                                            <Tooltip max-width="240" placement="top" transfer :content="item.rwmc">
                                                <span class="task-text" style="color: #2d8cf0;">{{ item.rwmc }}</span>
                                            </Tooltip>
                                        </div>
                                        <div class="rwgl-table-col" style="width: 50px;text-align: center;">
                                            <a :href="item.jira" v-if="item.jira" target="_blank">查看</a>
                                            <span v-else>-</span>
                                        </div>
                                        <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('状态')">
                                            <span>{{ getrRwzt(item.rwzt) }}</span>
                                        </div>
                                        <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('经办人')">{{ jbrFn(item.jbrId) }}</div>
                                        <div class="rwgl-table-col" style="width: 100px;text-align: center;" v-if="tj.includes('开始时间')">{{ moment(item.kssj) }}</div>
                                        <div class="rwgl-table-col" style="width: 100px;text-align: center;" v-if="tj.includes('结束时间')">{{ item.jssj ? moment(item.jssj) : '-' }}</div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rwgl-task" ref="rwgl-task" v-if="st=='day'">
                    <div class="rwgl-task-table" :style="{ width: 210 * weekDate.length + 'px' }">
                        <Affix>
                        <div class="rwgl-task-header rwgl-table-header">
                            <div class="rwgl-table-row">
                                <div v-for="item,lineIndex in weekDate" :key="'line-'+lineIndex" class="rwgl-table-col" style="width: 210px">
                                    <div class="rwgl-table-row-month">{{ item.range.month }}</div>
                                    <div class="rwgl-table-row-day">
                                        <span class="rwgl-table-row-day-item"
                                            :class="{ 'zm': itemIndex > 4, cur: isCurDay(item, itemIndex) }"
                                            :key="'lineday-'+itemIndex"
                                            v-for="(itemValue, itemIndex) in getWeekArr(item.range.start)">
                                            {{ itemValue }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </Affix>
                        <div class="rwgl-task-body">
                            <template v-for="xt in list">
                                <template v-for="item in xt.rwList">
                                    <div class="rwgl-task-body-bar">
                                        <div class="rwgl-task-body-col" :key="'linebar2-'+item.range.start" v-for="item in weekDate"></div>
                                        <div class="rwgl-task-body-barbg" :style="getStyle(item)"
                                            @click="getLog(item.id, item.rwmc)">
                                            <div v-for="(progress, progressIndex) in getNum(item).num" class="task-progress" :class="{'do': !getNum(item).log.includes(progressIndex), 'jh': (getNum(item).numJh == progressIndex && getNum(item).isTimeout)}"></div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="task-type-month" v-if="st=='month'">
                    <div class="task-type-month-header">
                        <span v-for="i in 12" class="month-header-span">{{i}}月</span>
                    </div>
                    <div class="task-type-month-body">
                        <template v-for="xt in list">
                            <div v-for="item in xt.rwList" class="month-body-row">
                                <span v-for="i in 12" @click="getLog(item.id, item.rwmc)" class="month-body-span" :class="{'month-view': monthView(item,i)}"></span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </Card>
        <Modal v-model="modal" width="1000" title="创建任务" :mask-closable="false">
            <Form :label-width="100">
                <FormItem label="所属系统" class="ivu-form-item-required">
                    <Select placeholder="请选择" v-model="form.xtId" filterable>
                        <Option :value="item.id" :key="item.id" v-for="item in sysList">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="任务名称" class="ivu-form-item-required">
                    <Input placeholder="请输入" v-model="form.rwmc"></Input>
                </FormItem>
                <FormItem label="jira地址">
                    <Input placeholder="请输入" v-model="form.jira"></Input>
                </FormItem>
                <FormItem label="经办人" class="ivu-form-item-required">
                    <Select placeholder="请选择" v-model="form.jbrId" filterable>
                        <Option :value="item.userName" :key="item.userId" v-for="item in userList">{{ item.nickName ?
                                item.nickName : item.userName
                        }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="任务期限" class="ivu-form-item-required">
                    <template v-if="form.id">
                        {{moment(form.kssj)}}
                    </template>
                    <template v-else>
                        <DatePicker type="date" placeholder="请选择" v-model="form.kssj" style="width: 200px"></DatePicker>
                    </template>
                    至
                    <template v-if="form.id && isEditer">
                        {{moment(form.jssj)}}
                    </template>
                    <template v-else>
                        <DatePicker type="date" placeholder="请选择" v-model="form.jssj" style="width: 200px"></DatePicker>
                    </template>
                </FormItem>
                <FormItem label="当前状态" class="ivu-form-item-required">
                    <RadioGroup v-model="form.rwzt">
                        <Radio :label="item.id" :key="item.id" v-for="item in ztList">{{ item.name }}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="当天工作内容">
                    <DatePicker @on-change="updateTimeChange" format="yyyy-MM-dd" type="date" placeholder="日期" v-model="form.updateTime" style="width: 200px;margin-bottom: 10px;"></DatePicker>
                    <Input type="textarea" placeholder="当天工作内容" v-model="form.bz" :rows="4"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="ok">确定</Button>
                <Button type="error" @click="del" v-if="form.id">删除</Button>
                <Button type="warning" @click="hisTask" v-if="form.id">归档</Button>
            </div>
        </Modal>
        <Modal v-model="modalC" :title="title" width="1000">
            <Table border :columns="columns" :data="listC" >
                <template slot-scope="{ row }" slot="updateTime">
                    {{moment(row.updateTime)}}
                </template>
                <template slot-scope="{ row }" slot="bz">
                    <div style="white-space: pre-line;" v-html="row.bz"></div>
                </template>
            </Table>
            <div slot="footer" style="text-align: center;">
                <Button type="primary" @click="modalC = false;">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {
    getYearWeek,
    getAllWeekRange,
} from "@/libs/dateHelp";
import {
    getSystemList,
    getAllUserData,
    addTask,
    listTask,
    updateTask,
    delTask,
    logTask,
    daylogTask,
    hisTask,
    getTaskTagList
} from '@/api/index';
import {
        getWeekStartDate,
        getWeekEndDate,
        getMonthStartDate,
        getMonthEndDate,
        getLastMonthStartDate,
        getLastMonthEndDate
    } from "@/libs/timeHelp";
import moment from 'moment';
export default {
    name: 'task',
    data() {
        return {
            st: 'day',
            modal: false,
            sysList: [],
            tj: [],
            ztList: [],
            userList: [],
            list: [],
            title: '详情',
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
                updateTime: new Date()
            },
            frwmc: '',
            search: {
                xtId: [],
                rwmc: '',
                rwzt: [],
                jbrId: [],
                kssj: moment().startOf("month").format("YYYY-MM-DD"),
                jssj: moment().endOf("month").format("YYYY-MM-DD")
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
            listC: [],
            isEditer: true
        };
    },
    components: {
    },
    methods: {
        monthView(item,month) {
            if ((moment(item.kssj).format('M') == month && moment(item.kssj).format('YYYY') == moment().format('YYYY')) || (moment(item.jssj).format('M') == month && moment(item.jssj).format('YYYY') == moment().format('YYYY'))) {
                return true;
            }
            return false;
        },
        getTaskTagList() {
            getTaskTagList().then( res => {
                this.ztList = res.data;
            });
        },
        getrRwzt(rwzt) {
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
        ok() {
            if (this.validForm()) {
                if (!this.form.id) {
                    this.addTask();
                } else {
                    this.updateTask();
                }
            }
        },
        cancel() {
            this.modal = false;
        },
        del() {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除吗？',
                onOk: () => {
                    delTask({id: this.form.id }).then(res => {
                        if (res.code === 1) {
                            this.$Message.success(res.msg);
                            this.listTask();
                            this.modal = false;
                        } else {
                            this.$Message.error(res.msg);
                        }
                    })
                },
            });
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
        validForm() {
            if (!this.form.xtId) {
                this.$Message.error('请选择所属系统');
                return false;
            }
            if (!this.form.rwmc) {
                this.$Message.error('请填写任务名称');
                return false;
            }
            if (!this.form.jbrId) {
                this.$Message.error('请选择经办人');
                return false;
            }
            if (!this.form.kssj) {
                this.$Message.error('请选择开始时间');
                return false;
            }
            if ( moment(this.form.jssj).diff(this.form.kssj, 'day') < 0) {
                this.$Message.error('结束时间不能早于开始时间');
                return false;
            }
            if (!this.form.rwzt) {
                this.$Message.error('请选择任务状态');
                return false;
            }
            return true;
        },
        addTask() {
            addTask({
                rwmc: this.form.rwmc,
                xtId: this.form.xtId,
                rwzt: this.form.rwzt,
                jbrId: this.form.jbrId,
                jira: this.form.jira,
                kssj: moment(this.form.kssj).format('YYYY-MM-DD'),
                jssj: !this.form.jssj ? '' : moment(this.form.jssj).format('YYYY-MM-DD'),
                bz: this.form.bz,
                updateTime: moment(this.form.updateTime).format('YYYY-MM-DD'),
            }).then( res => {
                this.$Message.success(res.msg);
                this.listTask();
                this.modal = false;
            });
        },
        updateTask() {
            updateTask({
                id: this.form.id,
                rwmc: this.form.rwmc,
                xtId: this.form.xtId,
                rwzt: this.form.rwzt,
                jbrId: this.form.jbrId,
                jira: this.form.jira,
                kssj: moment(this.form.kssj).format('YYYY-MM-DD'),
                jssj: !this.form.jssj ? '' : moment(this.form.jssj).format('YYYY-MM-DD'),
                bz: this.form.bz,
                updateTime: moment(this.form.updateTime).format('YYYY-MM-DD')
            }).then( res => {
                this.$Message.success(res.msg);
                this.listTask();
                this.modal = false;
            });
        },
        listTask() {
            listTask().then((res) => {
                this.list = res.data;
            });
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
            let temp = _.orderBy(taskLog, (item) => {
                return moment(item.updateTime).format('YYYY-MM-DD');
            }, ['desc']);  // 更新日志排序
            let isTimeout = false; //结束时间的差
            let days = 0; //开始时间的差,用于计算bar的宽度
            if (jssj) { // 写了结束时间
                days = moment(jssj).diff(moment(kssj), "days");
                if (temp.length>0) {  // 判断是否超时
                    isTimeout = moment(jssj).diff(moment(temp[0].updateTime), "days") < 0;
                    if (isTimeout) { // 超时
                        days = moment(temp[0].updateTime).diff(moment(kssj), "days");
                    }
                }
            } else { //未写结束时间
                if (temp.length>0) {  // 判断是否超时
                    days = moment(temp[0].updateTime).diff(moment(kssj), "days");
                }
            }
            let num = getYearWeek(moment(kssj).format('YYYY-MM-DD')); //第几周
            let num2 = moment(kssj).diff(moment(this.weekDate[num].range.start), "days"); //本周开始时间的第几天
            return {
                width: (!jssj && temp.length===0) ?  '0' : (days+1) * 30 + 'px',
                left: num * 210 + num2 * 30 + 'px',
                borderColor: isTimeout ? '#fa8888' : '#6698ff'
            };
        },
        getNum({ rwmc, kssj,jssj,taskLog }) {
            let temp = _.orderBy(taskLog, (item) => {
                return moment(item.updateTime).format('YYYY-MM-DD');
            }, ['desc']);  // 更新日志排序
            let log = [];
            let isTimeout = false; //结束时间的差
            let days = 0; //开始时间的差,用于计算bar的宽度
            temp.forEach(element => {
                log.push(moment(element.updateTime).diff(moment(kssj), "days"))
            });
            if (jssj) { // 写了结束时间
                days = moment(jssj).diff(moment(kssj), "days");
                if (temp.length>0) {  // 判断是否超时
                    isTimeout = moment(jssj).diff(moment(temp[0].updateTime), "days") < 0;
                    if (isTimeout) { // 超时
                        days = moment(temp[0].updateTime).diff(moment(kssj), "days");
                    }
                }
            } else { //未写结束时间
                if (temp.length>0) {  // 判断是否超时
                    days = moment(temp[0].updateTime).diff(moment(kssj), "days");
                }
            }
            return {
                log: log,
                numJh: jssj ? moment(jssj).diff(moment(kssj), "days") : -1,
                isTimeout: isTimeout,
                num: (!jssj && temp.length===0) ? 0 : (days+1)
            };
        },
        isCurDay(obj, dayIndex) {
            let date1 = moment(obj.range.start).add(dayIndex, 'days').format('YYYY-MM-DD');
            return moment().format('YYYY-MM-DD') === date1;
        },
        showDetail(item) {
            let temp = Object.assign({},item);
            this.form.id = temp.id;
            this.form.rwmc = temp.rwmc;
            this.form.xtId = temp.xtId;
            this.form.rwzt = temp.rwzt;
            this.form.jbrId = temp.jbrId;
            this.form.jira = temp.jira;
            this.form.kssj = temp.kssj;
            this.form.jssj = temp.jssj;
            this.form.bz = '';
            this.daylogTask(temp.id, moment(this.form.updateTime).format('YYYY-MM-DD'));
            this.modal = true;
            if (temp.jssj) {
                this.isEditer = true;
            } else {
                this.isEditer = false;
            }
        },
        addTaskC(task) {
            this.frwmc = task.rwmc;
            this.form.frwId = task.id;
            this.form.xtId = task.xtId;
            this.form.jbrId = task.jbrId;
            this.form.jssj = task.jssj;
            this.modal = true;
        },
        searchFn() {
            listTask({
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
        getLog(id,title) {
            this.title = title;
            logTask({id: id}).then(res => {
                this.modalC = true;
                this.listC = res.data;
            });
        },
        updateTimeChange(date) {
            if (this.form.id != '') {
                this.daylogTask(this.form.id, date);
            }
        },
        daylogTask(id, updateTime) {
            daylogTask({id: id, updateTime: updateTime }).then(res => {
                this.form.bz = res.data;
            });
        },
        addModal() {
            this.form.id = '';
            this.form.rwmc = '';
            this.form.xtId = '';
            this.form.rwzt = this.ztList[0].id;
            this.form.jbrId = JSON.parse(localStorage.getItem('userInfo')).userName;
            this.form.jira = '';
            this.form.kssj = moment().format('YYYY-MM-DD');
            this.form.jssj = '';
            this.form.bz = '';
            this.modal = true;
        },
        moment(date) {
            return moment(date).format('YYYY-MM-DD');
        },
        hisTask() {
            hisTask({
                id: this.form.id,
                isHistory: true
            }).then(res => {
                this.$Message.success(res.msg);
                this.listTask();
                this.modal = false;
            });
        },
        quickTime(type) {
            if (type == "yestday") {
                this.search.kssj = moment().add(-1, 'days').format('YYYY-MM-DD');
                this.search.jssj = moment().add(-1, 'days').format('YYYY-MM-DD');
            } else if(type == "day") {
                this.search.kssj = moment().format('YYYY-MM-DD');
                this.search.jssj = moment().format('YYYY-MM-DD');
            } else if (type == "week") {
                //周
                this.search.kssj = getWeekStartDate();
                this.search.jssj = getWeekEndDate();
            } else if (type == "month") {
                //月
                this.search.kssj = getMonthStartDate();
                this.search.jssj = getMonthEndDate();
            } else {
                //上月
                this.search.kssj = getLastMonthStartDate();
                this.search.jssj = getLastMonthEndDate();
            }
        },
    },
    mounted() {
        this.getSystemList();
        this.getUserList();
        this.searchFn();
        this.$nextTick(() => {
            this.$refs['rwgl-task'].scrollTo({
                left: getYearWeek(moment().format('YYYY-MM-DD'))*200
            });
        });
    },
    created() {
        this.getTaskTagList();
        this.weekDate = getAllWeekRange(new Date().getFullYear());
        if (JSON.parse(localStorage.getItem('userInfo')).userName!=='admin' && JSON.parse(localStorage.getItem('userInfo')).userName!=='lvf') {
            this.search.jbrId.push(JSON.parse(localStorage.getItem('userInfo')).userName);
        }
    }
};
</script>
