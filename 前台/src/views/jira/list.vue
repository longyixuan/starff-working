<style lang="less">
@import "./list.less";
.error {
    color: #ed4014;
}
</style>

<template>
    <div>
        <Card title="" style="min-height: 400px;margin-bottom: 20px;">
            <template slot="title">
                <DatePicker @on-change="yearChange" :value="year" style="width: 80px;margin-right:10px;" type="year"></DatePicker>
                jira完成情况
            </template>
            <div style="margin-bottom: 20px;" class="clearfix">
                <Select filterable v-model="searchData.month" style="width: 120px;margin-right:10px;" placeholder="请选择月份" @on-change="seach">
                    <Option :value="item" :key="item" v-for="item in monthList">{{parseInt(item)}}月</Option>
                </Select>
                <Button type="primary" @click="submit" style="float: right;" v-if="editStatus">保存</Button>
                <Button type="primary" @click="editStatus = !editStatus" style="float: right;" v-else>编辑</Button>
                <!-- <Button type="primary" @click="add" style="float: right;">新增</Button> -->
            </div>
            <Table style="margin-bottom: 20px;" border :columns="columns" :data="data" ref="table">
                <template slot-scope="{ row }" slot="userName">
                    {{getNickName(row.userName)}}
                </template>
                <template slot-scope="{ row }" slot="date">
                    {{row.year}}-{{row.month}}
                </template>
                <template slot-scope="{ row, index }" slot="total">
                    <Input placeholder="jira总数(已完成)" type="text" number v-model="data[index].total" v-if="editStatus"/>
                    <span v-else>{{row.total}}</span>
                </template>
                <template slot-scope="{ row, index }" slot="bug">
                    <Input placeholder="bug数(已完成)" type="text" number v-model="data[index].bug" v-if="editStatus"/>
                    <span v-else :class="{'error': row.bug>row.total}">{{row.bug}}</span>
                </template>
                <template slot-scope="{ row, index }" slot="total1">
                    <Input placeholder="jira总数(未完成)" type="text" number v-model="data[index].total1" v-if="editStatus"/>
                    <span v-else :class="{'error': row.bug1>row.total1}">{{row.total1}}</span>
                </template>
                <template slot-scope="{ row, index }" slot="bug1">
                    <Input placeholder="bug数(未完成)" type="text" number v-model="data[index].bug1" v-if="editStatus"/>
                    <span v-else>{{row.bug1}}</span>
                </template>
                <!-- <template slot-scope="{ row, index }" slot="action">
                    <Button size="small" type="primary" @click="edit(row,index)">修改</Button>
                    <Button size="small" type="error" @click="del(row.jiraId,index)" style="margin-left: 5px;">删除</Button>
                </template> -->
            </Table>
        </Card>
        <!-- <Modal title="录入" v-model="modal" width="500">
            <Form :label-width="100">
                <FormItem label="日期：">
                    <DatePicker type="month" v-model="date" style="width: 100%"></DatePicker>
                </FormItem>
                <FormItem label="姓名：">
                    <Select filterable clearable v-model="userName">
                        <Option :value="item.userName" :key="item.userName" v-for="item in userList">{{item.nickName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="jira总数：">
                    <Input type="number" v-model="total" @on-change="changeNum"></Input>
                </FormItem>
                <FormItem label="bug数：">
                    <Input type="number" v-model="bug" @on-change="changeNum"></Input>
                </FormItem>
                <FormItem label="是否完成：">
                    <Checkbox v-model="isFinshed"></Checkbox>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="modal=false">取消</Button>
                <Button type="primary" @click="submit">确定</Button>
            </div>
        </Modal> -->
    </div>
</template>
<script>
    import {
        getAllUserData,
        addJira,
        editJira,
        getJiraList,
        delJira
    } from "@/api/index";
    import moment from "moment";
    import {
        setStore,
        getStore
    } from '@/libs/storage'
    export default {
        name: "jira",
        data() {
            return {
                editStatus: false,
                year: '',
                modal: false,
                jiraId: '',
                userList: [],
                monthList: ['01', '02', '03', '04', '05','06', '07', '08', '09', '10', '11', '12'],
                userName: '',
                date: new Date(),
                total: 0,
                bug: 0,
                task: 0,
                isFinshed: true,
                editIndex: -1,
                searchData: {
                    userName: [],
                    month: moment().format('MM'),
                    isFinshed: '1'
                },
                columns: [
                    {
                        title: '姓名',
                        slot: 'userName'
                    },
                    {
                        title: 'jira总数(已完成)',
                        align: 'right',
                        width: 160,
                        slot: 'total'
                    },
                    {
                        title: 'bug数(已完成)',
                        width: 160,
                        align: 'right',
                        slot: 'bug'
                    },
                    {
                        title: 'jira总数(未完成)',
                        align: 'right',
                        width: 160,
                        slot: 'total1'
                    },
                    {
                        title: 'bug数(未完成)',
                        width: 160,
                        align: 'right',
                        slot: 'bug1'
                    }
                ],
                data: []
            }
        },
        methods: {
            yearChange(year) {
                this.year = year;
                setStore('year', year);
            },
            changeNum: function() {
                this.task = this.total - this.bug;
            },
            getNickName(userName) {
                return this.userList.length===0?'':_.find(this.userList, ['userName', userName]).nickName;
            },
            valid() {
                let flag = false;
                for (let i = 0; i< this.data.length;i++) {
                    if (this.data[i].bug>this.data[i].total || this.data[i].bug1>this.data[i].total1) {
                        flag = true;
                        break;
                    }
                }
                return flag;
            },
            submit() {
                if (this.valid()) {
                    this.$Message.error('数据中存在bug数大于jira总数');
                    return;
                }
                addJira({
                    year: moment(this.date).format('YYYY'),
                    month: this.searchData.month,
                    list: this.data
                }).then(res => {
                    if (res.code === 1) {
                        this.$Message.success('保存成功');
                        this.editStatus = false;
                    }
                });
            },
            getUserList() {
                var _this =this;
                getAllUserData().then(res => {
                    if (res.code === 1) {
                        this.userList = _.filter(res.data, function(o) {
                            return o.type===0;
                        });
                        this.userList.forEach(element => {
                            _this.searchData.userName.push(element.userName);
                        });
                        this.seach();
                    }
                });
            },
            add() {
                this.editIndex = -1;
                this.userName = '';
                this.jiraId = '';
                this.date = new Date();
                this.total = 0;
                this.bug = 0;
                this.task = 0;
                this.isFinshed = false;
                this.modal = true;
            },
            edit(row, index) {
                this.editIndex = index;
                this.jiraId = row.jiraId;
                this.userName = row.userName;
                this.date = row.year + '-' + row.month;
                this.total = row.total;
                this.bug =row.bug;
                this.task = row.task;
                this.isFinshed = row.isFinshed;
                this.modal = true;
            },
            del(id,index) {
                delJira({jiraId: id }).then(res => {
                    if (res.code === 1) {
                        this.$Message.success('操作成功');
                    }
                });
            },
            seach() {
                let searchData = {
                    // userName: this.searchData.userName,
                    year: this.year==='' ? '' : moment(this.year).format('YYYY'),
                    month: this.searchData.month
                };
                getJiraList(searchData).then(res => {
                    if (res.code === 1) {
                        var data = [];
                        for (let i = 0; i< this.userList.length;i++) {
                            if (_.find(res.data, ['userName', this.userList[i].userName])) {
                                data.push(
                                    {
                                        userName: this.userList[i].userName,
                                        total: _.find(res.data, ['userName', this.userList[i].userName]).total,
                                        bug: _.find(res.data, ['userName', this.userList[i].userName]).bug,
                                        total1: _.find(res.data, ['userName', this.userList[i].userName]).total1,
                                        bug1: _.find(res.data, ['userName', this.userList[i].userName]).bug1,
                                    }
                                )
                            } else {
                                data.push(
                                    {
                                        userName: this.userList[i].userName,
                                        total: 0,
                                        bug: 0,
                                        total1: 0,
                                        bug1: 0,
                                    }
                                )
                            }
                        }
                        this.data = data;
                        this.$Message.success('查询成功')
                    }
                });
            }
        },
        mounted() {
            if (this.getStore('year')) {
                this.year = getStore('year');
            } else {
                this.year = moment().format('YYYY');
                setStore('year', moment().format('YYYY'));
            }
            this.getUserList();
        }
    }
</script>