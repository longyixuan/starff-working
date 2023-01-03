<style lang="less">
@import './task.less';
</style>

<template>
    <div>
        <Card title="任务管理">
            <div class="task-search" style="margin-bottom: 20px">
                <Select placeholder="所属系统" multiple v-model="search.xtId" filterable clearable style="width: 160px;margin-right:10px;">
                    <Option :value="item.id" :key="item.id" v-for="item in sysList">{{ item.title }}</Option>
                </Select>
                <Select placeholder="经办人" multiple v-model="search.jbrId" filterable clearable style="width: 100px;margin-right:10px;">
                    <Option :value="item.userName" :key="item.userId" v-for="item in userList">{{ item.nickName ?
                            item.nickName : item.userName
                    }}</Option>
                </Select>
                <Select placeholder="状态" multiple clearable v-model="search.rwzt" style="width: 100px;margin-right:10px;">
                    <Option :value="item" :key="item" v-for="item in ztList">{{ item }}</Option>
                </Select>
                <DatePicker type="date" placeholder="开始时间" v-model="search.kssj" style="width: 120px;margin-right:10px;"></DatePicker>
                <DatePicker type="date" placeholder="结束时间" v-model="search.jssj" style="width: 120px;margin-right:10px;"></DatePicker>
                <Input v-model="search.rwmc" style="width: 200px;margin-right:10px;" clearable placeholder="任务名称" autocomplete="off"/>
                <Button type="primary" style="margin-right:10px;" @click="searchFn">查询</Button>
                <Button type="primary" @click="addModal">添加</Button>
            </div>
            <div style="margin-bottom: 20px;display:flex;">
                <Checkbox-Group v-model="tj" style="flex:1;">
                    显示列：
                    <Checkbox label="状态">状态</Checkbox>
                    <Checkbox label="经办人">经办人</Checkbox>
                    <Checkbox label="开始时间">开始时间</Checkbox>
                    <Checkbox label="结束时间">结束时间</Checkbox>
                    <Checkbox label="任务类型">任务类型</Checkbox>
                </Checkbox-Group>
                <Radio-Group v-model="st" type="button" size="small">
                    视图：
                    <Radio label="day">日</Radio>
                    <Radio label="month">月</Radio>
                </Radio-Group>
            </div>
            <div class="chsi-gantt">
                <div class="rwgl-table">
                    <div class="rwgl-table-header">
                        <div class="rwgl-table-row">
                            <div class="rwgl-table-col" style="width: 50px">序号</div>
                            <div class="rwgl-table-col" style="width: 160px">所属系统</div>
                            <div class="rwgl-table-col" style="width: 200px">任务名称</div>
                            <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('状态')">状态</div>
                            <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('经办人')">经办人</div>
                            <div class="rwgl-table-col" style="width: 120px" v-if="tj.includes('开始时间')">开始时间</div>
                            <div class="rwgl-table-col" style="width: 120px" v-if="tj.includes('结束时间')">结束时间</div>
                            <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('任务类型')">任务类型</div>
                        </div>
                    </div>
                    <div class="rwgl-table-body">
                        <div class="rwgl-table-flex" v-for="fz,fzIndex in list">
                            <div class="rwgl-table-xt" style="width: 50px;">
                                <span style="text-align: center;flex: 1">{{fzIndex+1}}</span>
                            </div>
                            <div class="rwgl-table-xt" style="width: 160px;">
                                <Tooltip placement="top" transfer :content="fz.xtmc">
                                    <span class="task-text">{{fz.xtmc}}</span>
                                </Tooltip>
                            </div>
                            <div class="rwgl-table-rw rw-flex1">
                                <template v-for="item,itemIndex in fz.rwList">
                                    <div class="rwgl-table-row" @click="showDetail(item)">
                                        <div class="rwgl-table-col flex-block" style="width: 200px">
                                            <template v-if="!item.frwId">
                                                <Icon type="md-arrow-dropright" size="18" @click.native.stop="getTaskC(fzIndex,itemIndex,item)" v-if="!item.expand"/>
                                                <Icon type="md-arrow-dropdown" size="18" @click.native.stop="getTaskC2(fzIndex,itemIndex,item)" v-else/>
                                                <Tooltip placement="top" transfer :content="item.rwmc">
                                                    <span class="task-text">{{ item.rwmc }}</span>
                                                </Tooltip>
                                                <Tooltip placement="top" transfer content="添加子任务">
                                                    <Icon type="md-add-circle" class="add-task-c" @click.native.stop="addTaskC(item)"/>
                                                </Tooltip>
                                            </template>
                                            <template v-else>
                                                <Tooltip placement="top" transfer :content="item.rwmc">
                                                    <span class="task-text">{{ item.rwmc }}</span>
                                                </Tooltip>
                                            </template>
                                        </div>
                                        <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('状态')">
                                            <span :class="rwzt(item.rwzt)">{{ item.rwzt }}</span>
                                        </div>
                                        <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('经办人')">{{ jbrFn(item.jbrId) }}</div>
                                        <div class="rwgl-table-col" style="width: 120px" v-if="tj.includes('开始时间')">{{ moment(item.kssj) }}</div>
                                        <div class="rwgl-table-col" style="width: 120px" v-if="tj.includes('结束时间')">{{ moment(item.jssj) }}</div>
                                        <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('任务类型')">
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
                                    <template v-if="item.expand">
                                        <template v-for="item2 in item.child">
                                            <div class="rwgl-table-row" @click="showDetail(item2,item.rwmc)">
                                                <div class="rwgl-table-col flex-block" style="width: 200px">
                                                    <Tooltip placement="top" transfer :content="item2.rwmc">
                                                        <span style="margin-left: 22px;" class="task-text">{{ item2.rwmc }}</span>
                                                    </Tooltip>
                                                </div>
                                                <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('状态')">
                                                    <span :class="rwzt(item2.rwzt)">{{ item2.rwzt }}</span>
                                                </div>
                                                <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('经办人')">{{ jbrFn(item2.jbrId) }}</div>
                                                <div class="rwgl-table-col" style="width: 120px" v-if="tj.includes('开始时间')">{{ moment(item2.kssj) }}</div>
                                                <div class="rwgl-table-col" style="width: 120px" v-if="tj.includes('结束时间')">{{ moment(item2.jssj) }}</div>
                                                <div class="rwgl-table-col" style="width: 100px" v-if="tj.includes('任务类型')">
                                                    <span class="rwlx-tag-warp" v-if="item2.rwlx == '任务'">
                                                        <span class="rwlx-tag rwlx-tag-rw"><Icon type="md-mail" color="#fff" /></span>
                                                        {{ item2.rwlx }}
                                                    </span>
                                                    <span class="rwlx-tag-warp" v-if="item2.rwlx == 'bug'">
                                                        <span class="rwlx-tag rwlx-tag-bug"><Icon type="md-bug" color="#fff" /></span>
                                                        {{ item2.rwlx }}
                                                    </span>
                                                </div>
                                            </div>
                                        </template>
                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rwgl-task" ref="rwgl-task" v-if="st=='day'">
                    <div class="rwgl-task-table" :style="{ width: 210 * weekDate.length + 'px' }">
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
                            <template v-for="xt in list">
                                <template v-for="item in xt.rwList">
                                    <div class="rwgl-task-body-bar">
                                        <div class="rwgl-task-body-col" v-for="item in weekDate"></div>
                                        <div class="rwgl-task-body-barbg" :style="getStyle(item)"
                                            @click="getLog(item.id)">
                                            <div v-for="(progress, progressIndex) in getNum(item).num" class="task-progress" :class="{'do': !getNum(item).log.includes(progressIndex), 'jh': (getNum(item).numJh == progressIndex && getNum(item).isTimeout)}"></div>
                                        </div>
                                    </div>
                                    <template v-if="item.expand">
                                        <template v-for="item2 in item.child">
                                            <div class="rwgl-task-body-bar">
                                                <div class="rwgl-task-body-col" v-for="item2 in weekDate"></div>
                                                <div class="rwgl-task-body-barbg" :style="getStyle(item2)"
                                                    @click="getLog(item2.id)">
                                                    <div v-for="(progress, progressIndex) in getNum(item2).num" class="task-progress" :class="{'do': !getNum(item2).log.includes(progressIndex), 'jh': (getNum(item2).numJh == progressIndex && getNum(item2).isTimeout)}"></div>
                                                </div>
                                            </div>
                                        </template>
                                    </template>
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
                                <span v-for="i in 12" class="month-body-span" :class="{'month-view': monthView(item,i)}"></span>
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
                <FormItem label="父任务名称" v-if="form.frwId">
                    {{frwmc}}
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
                <FormItem label="任务进展">
                    <Input type="textarea" placeholder="请输入" v-model="form.rwjz" :rows="4"></Input>
                </FormItem>
                <FormItem label="备注">
                    <Input type="textarea" placeholder="请输入" v-model="form.bz" :rows="4"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="ok">确定</Button>
                <Button type="error" @click="del" v-if="form.id">删除</Button>
                <Button type="error" @click="hisTask" v-if="form.id">归档</Button>
            </div>
        </Modal>
        <Modal v-model="modalC" title="详情" width="1000">
            <Table border :columns="columns" :data="listC" >
                <template slot-scope="{ row, index }" slot="updateTime">
                    {{moment(row.updateTime)}}
                </template>
                <template slot-scope="{ row, index }" slot="bz">
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
    listTaskC,
    updateTask,
    delTask,
    logTask,
    hisTask
} from '@/api/index';
import moment from 'moment';
export default {
    name: 'task',
    data() {
        return {
            st: 'day',
            modal: false,
            sysList: [],
            tj: ['任务名称', '所属系统', '状态'],
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
                bz: '',
                rwjz: ''
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
            listC: []
        };
    },
    components: {
    },
    methods: {
        monthView(item,month) {
            if (moment(item.kssj).format('M') == month || moment(item.jssj).format('M') == month) {
                return true;
            }
            return false;
        },
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
                bz: this.form.bz,
            }).then( res => {
                this.$Message.success(res.msg);
                this.listTask();
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
                bz: this.form.bz,
            }).then( res => {
                this.$Message.success(res.msg);
                this.listTask();
                this.modal = false;
            });
        },
        listTask() {
            listTask({frwId: ''}).then((res) => {
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
            let temp = _.uniqBy(taskLog, 'updateTime');
            let log = [];
            let days = 0;
            let days2 = 0;
            temp.forEach(element => {
                if (moment(element.updateTime).diff(moment(jssj), "days")>0) { //超时完成
                    days = moment(element.updateTime).diff(moment(jssj), "days");
                    days2 = moment(element.updateTime).diff(moment(kssj), "days");
                }
                log.push(moment(element.updateTime).diff(moment(kssj), "days"))
            });
            let num = getYearWeek(moment(kssj).format('YYYY-MM-DD')); //第几周
            let dayNum = moment(jssj).diff(moment(kssj), "days");
            let num2 = moment(kssj).diff(moment(this.weekDate[num].range.start), "days")
            return {
                width: days > 0 ? (days2+1) * 30 + 'px' : (dayNum+1) * 30 + 'px',
                left: num * 210 + num2 * 30 + 'px',
                borderColor: days > 0 ? '#fa8888' : '#6698ff'
            };
        },
        getNum({ rwmc, kssj,jssj,taskLog }) {
            let temp = _.uniqBy(taskLog, 'updateTime');
            let log = [];
            let days = 0;
            let days2 = 0;
            temp.forEach(element => {
                if (moment(element.updateTime).diff(moment(jssj), "days")>0) { //超时完成
                    days = moment(element.updateTime).diff(moment(jssj), "days");
                    days2 = moment(element.updateTime).diff(moment(kssj), "days");
                }
                log.push(moment(element.updateTime).diff(moment(kssj), "days"))
            });
            return {
                log: log,
                numJh: moment(jssj).diff(moment(kssj), "days"),
                isTimeout: days > 0,
                num: days > 0 ? (days2+1) : (moment(jssj).diff(moment(kssj), "days")+1)
            };
        },
        isCurDay(obj, dayIndex) {
            let date1 = moment(obj.range.start).add(dayIndex, 'days').format('YYYY-MM-DD');
            return moment().format('YYYY-MM-DD') === date1;
        },
        showDetail(item, frwmc) {
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
            this.form.bz = item.bz;
            if (frwmc) {
                this.frwmc = frwmc;
            }
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
        getTaskC(fzIndex, index, item) {
            this.$set(this.list[fzIndex].rwList[index], 'expand', true);
            listTaskC({ frwId: item.id }).then((res) => {
                this.$set(this.list[fzIndex].rwList[index], 'child', res.data);
            });
        },
        getTaskC2(fzIndex, index, item) {
            this.$set(this.list[fzIndex].rwList[index], 'expand', false);
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
        getLog(id) {
            logTask({id: id}).then(res => {
                this.modalC = true;
                this.listC = res.data;
            });
        },
        addModal() {
            this.form.id = '';
            this.form.rwmc = '';
            this.form.xtId = '';
            this.form.frwId = '';
            this.form.rwlx = '';
            this.form.rwzt = '';
            this.form.jbrId = '';
            this.form.jira = '';
            this.form.kssj = '';
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
            });
        }
    },
    mounted() {
        this.getSystemList();
        this.getUserList();
        this.listTask();
        this.$nextTick(() => {
            this.$refs['rwgl-task'].scrollTo({
                left: (getYearWeek(moment().format('YYYY-MM-DD'))+2)*200
            });
        });
    },
    created() {
        this.weekDate = getAllWeekRange(new Date().getFullYear());
    }
};
</script>
