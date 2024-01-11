<style lang="less">
@import './task.less';
</style>

<template>
    <div>
        <Card dis-hover title="任务进度管理 - 查看任务">
            <div class="task-search">
                <Select class="marin-b10" placeholder="所属系统" multiple v-model="search.xtId" filterable clearable style="width: 160px;margin-right:8px;">
                    <Option :value="item.id" :key="item.id" v-for="item in sysList">{{ item.title }}</Option>
                </Select>
                <Select class="marin-b10" placeholder="设计部门" v-model="search.sjbm" filterable clearable style="width: 160px;margin-right:8px;">
                    <Option :value="item.id" :key="item.id" v-for="item in departmentList">{{ item.title }}</Option>
                </Select>
                <Select class="marin-b10" placeholder="经办人" multiple v-model="search.jbrId" filterable clearable style="width: 140px;margin-right:8px;">
                    <template v-for="item in userList">
                        <Option :value="item.userName" :key="item.userId">{{ item.nickName ?
                            item.nickName : item.userName
                        }}</Option>
                    </template>
                </Select>
                <Select class="marin-b10" placeholder="状态" multiple clearable v-model="search.rwzt" style="width: 100px;margin-right:8px;">
                    <Option :value="item.id" :key="item.id" v-for="item in ztList">{{ item.name }}</Option>
                </Select>
                <Input class="marin-b10" v-model="search.rwmc" style="width: 180px;margin-right:8px;" clearable placeholder="任务名称" autocomplete="off"/>
                <Date-Picker class="marin-b10" type="date" placeholder="开始时间" v-model="search.kssj" style="width: 120px;margin-right:8px;"></Date-Picker>
                <Date-Picker class="marin-b10" type="date" placeholder="结束时间" v-model="search.jssj" style="width: 120px;margin-right:8px;"></Date-Picker>
                <Button class="marin-b10 kj-btn" @click="quickTime('yestday')" style="margin-right: 8px;">昨天</Button>
                <Button class="marin-b10 kj-btn" @click="quickTime('day')" style="margin-right: 8px;">今天</Button>
                <Button class="marin-b10 kj-btn" @click="quickTime('week')" style="margin-right: 8px;">本周</Button>
                <Button
                class="marin-b10 kj-btn"
                @click="quickTime('month')"
                style="margin-right: 8px;"
                >本月</Button>
                <Button
                class="kj-btn"
                @click="quickTime('preMonth')"
                style="margin-right: 8px;"
                >上月</Button>
                <Tooltip transfer content="按照任务备注的开始时间和结束时间进行查询" max-width="200">
                    <Button class="marin-b10" type="primary" style="margin-right:8px;" @click="searchFnRz">查询日志</Button>
                </Tooltip>
                <Tooltip transfer content="按照任务的开始时间和结束时间进行查询" max-width="200">
                    <Button class="marin-b10" style="margin-right:8px;" @click="searchFn">查询任务</Button>
                </Tooltip>
            </div>
            <div class="task-tabs">
                <RadioGroup v-model="taskTab" type="button" button-style="solid" @on-change="onTabClick">
                    <Radio label="tab1">列表</Radio>
                    <Radio label="tab2">进度</Radio>
                </RadioGroup>
                <div class="task-tabs-btn">
                    <Button type="primary" @click="addModal">新增任务</Button>
                </div>
            </div>
            <Table border stripe :columns="columnsList" :data="dataList" v-if="taskTab == 'tab1'">
                <template slot-scope="{ row }" slot="rwztDes">
                    <span class="task-rwzt" :class="{'wks': row.rwztDes === '未开始', 'jxz': row.rwztDes === '进行中', 'yfb': row.rwztDes === '已发布'}">{{row.rwztDes}}</span>
                </template>
                <template slot-scope="{ row }" slot="jira">
                    <a :href="row.jira" target="_blank" v-if="row.jira">查看</a>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <span class="action-btn" @click="getLog(row.id, row.rwmc)">日志</span>
                    <span class="action-btn" @click="showDetail(row)">编辑</span>
                    <span class="action-btn" @click="hisTask(row.id)" v-if="type === 1">归档</span>
                    <span class="action-btn" @click="del(row.id)" v-if="type === 1">删除</span>
                </template>
            </Table>
            <template v-if="taskTab == 'tab2'">
                <div style="margin-bottom: 16px;display:flex;align-items: center;">
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
                <div class="chsi-gantt" v-show="list.length>0">
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
                                        <div class="rwgl-table-row">
                                            <div class="rwgl-table-col flex-block" style="width: 300px;cursor: pointer;" @click="showDetail(item)">
                                                <Tooltip max-width="240" placement="top" transfer :content="item.rwmc">
                                                    <span class="task-text" style="color: #00A862;">{{ item.rwmc }}</span>
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
                                                :class="{ 'zm': itemIndex > 4, 'cur': (item.range.month + itemValue + '日') === myDate }"
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
                                                <div v-for="progress in getNum(item).num" class="task-progress" :class="{'do': getNum(item).log.includes(progress-1) , 'jh': getNum(item).isTimeout && getNum(item).numJh == progress}"></div>
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
                <div class="no-result" v-show="list.length==0">
                    <div class="no-result-img"></div>
                    <div class="no-result-text">无查询结果</div>
                </div>
            </template>
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
                        <DatePicker :clearable="false" type="date" placeholder="请选择" v-model="form.kssj" style="width: 200px"></DatePicker>
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
                    <DatePicker :clearable="false" @on-change="updateTimeChange" format="yyyy-MM-dd" type="date" placeholder="日期" v-model="form.updateTime" style="width: 200px;margin-bottom: 16px;"></DatePicker>
                    <Input type="textarea" placeholder="当天工作内容" v-model="form.bz" :rows="4"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="ok">确定</Button>
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
            <div slot="footer">
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
    getTaskTagList,
    initDepartment,
    checkTask
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
            myDate: moment().format('YYYY年MM月DD日'),
            st: 'day',
            modal: false,
            sysList: [],
            tj: [],
            ztList: [],
            userList: [],
            list: [],
            title: '详情',
            dataList: [],
            departmentList: [],
            type: 0,
            taskTab: 'tab1',
            columnsList: [
                {
                    title: '任务名称',
                    key: 'rwmc'
                },
                {
                    title: '所属系统',
                    key: 'xtmc',
                    width: 200,
                    sortable: true
                },
                {
                    title: 'jira',
                    slot: 'jira',
                    width: 70,
                    align: 'center'
                },
                {
                    title: '状态',
                    slot: 'rwztDes',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '经办人',
                    key: 'jbrName',
                    width: 100,
                    sortable: true
                },
                {
                    title: '开始时间',
                    key: 'kssj',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '结束时间',
                    key: 'jssj',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 100,
                    align: 'center'
                },
            ],
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
                sjbm: '',
                rwzt: [],
                jbrId: [],
                kssj: moment().startOf("month").format("YYYY-MM-DD"),
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
            listC: [],
            isEditer: true,
            checkList: [],
            checkList1: []
        };
    },
    methods: {
        getDepartment() {
            initDepartment().then(res => {
                if (res.code === 1) {
                    this.departmentList = res.data;
                }
            });
        },
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
        del(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除吗？',
                onOk: () => {
                    delTask({id: id }).then(res => {
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
                    this.userList = _.filter(res.data, (o) => {
                        return o.type === 0;
                    });
                    if (this.type === 1) {
                        this.searchFnRz();
                        this.checkTask();
                    } else {
                        this.searchFn();
                    }
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
            if (this.form.bz && moment(this.form.updateTime).diff(this.form.kssj, 'day') < 0) {
                 this.$Message.error('当天工作时间不能早于任务开始时间，若想修改开始时间请联系yinxl');
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
                this.searchFn();
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
                this.searchFn();
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
        getStyle({ duration,duration2, duration3, kssj }) {
            let num = getYearWeek(moment(kssj).format('YYYY-MM-DD')); //第几周
            let num2 = moment(kssj).diff(moment(this.weekDate[num].range.start), "days"); //本周开始时间的第几天
            let days = 0;
            let isTimeout = false; //结束时间的差
            if (duration3 && duration3>0) {
                isTimeout = true;
            }
            if (duration && duration2) {
                days = duration2 > duration ? duration2 + 1: duration + 1;
            } else if (duration && !duration2){
                days = duration + 1;
            } else {
                days = duration2 + 1;
            }
            return {
                width: days * 30 + 'px',
                left: num * 210 + num2 * 30 + 'px',
                borderColor: isTimeout ? '#fa8888' : '#00A862'
            };
        },
        getNum({ duration,taskLog,duration2, duration3 }) {
            let log = [];
            let isTimeout = false; //结束时间的差
            let days = 0;
            taskLog.forEach(element => {
                log.push(element.duration);
            });
            if (duration3 && duration3>0) {
                isTimeout = true;
            }
            if (duration && duration2) {
                days = duration2 > duration ? duration2 + 1: duration + 1;
            } else if (duration && !duration2){
                days = duration + 1;
            } else {
                days = duration2 + 1;
            }
            return {
                log: log,
                numJh: duration !==null ? duration + 1 : 0,
                isTimeout: isTimeout,
                num: days
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
                jbrId: (this.search.sjbm && this.search.jbrId.length===0) ? this.getBmUser(this.search.sjbm) : this.search.jbrId,
                kssj: this.search.kssj ? moment(this.search.kssj).format('YYYY-MM-DD') : '',
                jssj: this.search.jssj ? moment(this.search.jssj).format('YYYY-MM-DD') : '',
                type: 'rw'
            }).then((res) => {
                this.list = res.data;
                this.dataList = res.list;
                this.$Message.success('查询成功');
            });
        },
        searchFnRz() {
            listTask({
                xtId: this.search.xtId,
                rwmc: this.search.rwmc,
                rwzt: this.search.rwzt,
                jbrId: (this.search.sjbm && this.search.jbrId.length===0) ? this.getBmUser(this.search.sjbm) : this.search.jbrId,
                kssj: this.search.kssj ? moment(this.search.kssj).format('YYYY-MM-DD') : '',
                jssj: this.search.jssj ? moment(this.search.jssj).format('YYYY-MM-DD') : '',
                type: 'rz'
            }).then((res) => {
            console.log(this.search.sjbm)
                this.list = res.data;
                this.dataList = res.list;
                this.$Message.success('查询成功');
            });
        },
        getBmUser(departmentId) {
            let arr = [];
            for (let i = 0; i < this.userList.length; i++) {
                if (this.userList[i].departmentId == departmentId) {
                    arr.push(this.userList[i].userName);
                }
            }
            return arr;
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
        hisTask(id) {
            hisTask({
                id: id,
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
        scrollToFn() {
            this.$nextTick(() => {
                this.$refs['rwgl-task'].scrollTo({
                    left: getYearWeek(moment().format('YYYY-MM-DD'))*200
                });
            });
        },
        onTabClick(name) {
            if (name === 'tab2') {
                this.scrollToFn();
            }
        },
        checkTask() {
            checkTask({ updateTime: moment().add(-1, 'days').format('YYYY-MM-DD') }).then(res => {
                this.checkList = res.data;
                this.checkList1 = res.data1;
                var des = '';
                if (this.checkList.length!=0) {
                    des +='设计一部：' + this.checkList.join('、');
                }
                if (this.checkList1.length!=0) {
                    if (this.checkList.length!=0) {
                        des += '<br>';
                    }
                    des +='设计二部：' + this.checkList1.join('、');
                }
                if (this.type===1 && des!='') {
                    this.$Notice.warning({
                        title: '昨日未添加任务进度人员',
                        duration: 0,
                        desc: des
                    });
                }
            });
        }
    },
    mounted() {
        this.getSystemList();
        this.getDepartment();
        this.getUserList();
    },
    created() {
        this.type = JSON.parse(localStorage.getItem('userInfo')).type;
        if (this.type === 1) {
            this.columnsList[this.columnsList.length-1].width = 180;
        }
        this.getTaskTagList();
        this.weekDate = getAllWeekRange(new Date().getFullYear());
        if ( this.type!== 1) {  // 普通用户查询
            this.search.sjbm = JSON.parse(localStorage.getItem('userInfo')).departmentId;
            this.search.jbrId.push(JSON.parse(localStorage.getItem('userInfo')).userName);
        } else { // 管理员查询
            this.search.sjbm = JSON.parse(localStorage.getItem('userInfo')).departmentId;
            this.quickTime('week');
        }
    }
};
</script>
