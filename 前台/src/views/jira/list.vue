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
                <Button type="primary" style="float: right;" @click="editStatus = !editStatus" v-if="!editStatus">编辑</Button>
                <div v-else style="float: right;">
                    <Button ghost type="primary" @click="add" style="margin-right: 10px">批量填充</Button>
                    <Button type="primary" @click="submit">保存</Button>
                </div>
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
        <Modal title="录入" v-model="modal" width="1000">
            <Row :gutter="20">
                <Col span="12"><Input type="textarea" v-model="textarea" :rows="20"></Input></Col>
                <Col span="12"><Input type="textarea" v-model="textarea1" :rows="20"></Input></Col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="modal=false">取消</Button>
                <Button type="primary" @click="save">确定</Button>
            </div>
        </Modal>
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
                textarea: '',
                textarea1: '',
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
            save() {
                if (this.textarea) {
                    let arr = this.textarea.split('\n');
                    let head = arr[0].split('\t');
                    let bug = -1;
                    let total = -1;
                    for(let i = 0;i<head.length;i++) {
                        if (head[i].indexOf('缺陷')!==-1) {
                            bug = i;
                        }
                        if (head[i].indexOf('合计')!==-1) {
                            total = i
                        }
                    }
                    for (let j = 1; j < arr.length; j++) {
                        let row = arr[j].split('\t');
                        for (let k = 0; k < row.length; k++) {
                            if (_.find(this.userList, ['nickName', row[0]])) {
                                this.data[_.findIndex(this.data, ['userName', _.find(this.userList, ['nickName', row[0]]).userName])].total = parseInt(row[total]);
                                if (bug !== -1) {
                                    this.data[_.findIndex(this.data, ['userName', _.find(this.userList, ['nickName', row[0]]).userName])].bug =  parseInt(row[bug]);
                                }
                            }
                        }
                    }
                }
                if (this.textarea1) {
                    this.save1();
                }
                this.modal=false;
            },
            save1() {
                let arr = this.textarea1.split('\n');
                let head = arr[0].split('\t');
                let bug = -1;
                let total = -1;
                for(let i = 0;i<head.length;i++) {
                    if (head[i].indexOf('缺陷')!==-1) {
                        bug = i;
                    }
                    if (head[i].indexOf('合计')!==-1) {
                        total = i
                    }
                }
                for (let j = 1; j < arr.length; j++) {
                    let row = arr[j].split('\t');
                    for (let k = 0; k < row.length; k++) {
                        if (_.find(this.userList, ['nickName', row[0]])) {
                            this.data[_.findIndex(this.data, ['userName', _.find(this.userList, ['nickName', row[0]]).userName])].total1 = parseInt(row[total]);
                            if (bug !== -1) {
                                this.data[_.findIndex(this.data, ['userName', _.find(this.userList, ['nickName', row[0]]).userName])].bug1 = parseInt(row[bug]);
                            }
                        }
                    }
                }
            },
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
                console.log(this.data)
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