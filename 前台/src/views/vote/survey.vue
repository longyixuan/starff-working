<style lang="less">
@import './vote.less';
</style>
<template>
    <Card title="投票历史">
        <div style="margin-bottom: 10px; text-align: right">
            <Button type="primary" @click="modal = true">新增</Button>
        </div>
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" :to="'/vote/count/' + row.id">查看结果</Button>
                <Button type="primary" size="small" style="margin-right: 5px" :to="'/vote/detail/' + row.id" target="_blank">投票</Button>
                <Button type="primary" size="small" style="margin-right: 5px" @click="setTime(row.id)">设置截至时间</Button>
                <Button type="warning" size="small" style="margin-right: 5px" @click="deleteTag(row.id, index, true)">重投</Button>
                <Button type="error" size="small" @click="deleteTag(row.id, index, false)">删除</Button>
            </template>
        </Table>
        <Modal title="生成投票" width="800" v-model="modal" @on-ok="add">
            <Form :label-width="80">
                <FormItem label="名称：">
                    <Input v-model="formItem.surveyName"></Input>
                </FormItem>
                <FormItem label="投票项：">
                    <Checkbox-Group v-model="formItem.option">
                        <Checkbox :label="item.id" v-for="item in voteList" :key="item.id">{{ item.voteName }}</Checkbox>
                    </Checkbox-Group>
                </FormItem>
                <FormItem label="人员：">
                    <div style="border-bottom: 1px solid #e9e9e9; padding-bottom: 6px; margin-bottom: 6px">
                        <Checkbox :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                    </div>
                    <Checkbox-Group v-model="formItem.user" @on-change="checkAllGroupChange">
                        <Checkbox :label="item.userId" v-for="item in userList" :key="item.userId">{{ item.nickName }}</Checkbox>
                    </Checkbox-Group>
                </FormItem>
            </Form>
        </Modal>
        <Modal title="截至时间设置" v-model="tableModal">
            <DatePicker v-model="endDate" type="datetime" placeholder="选则投票截至时间"></DatePicker>
            <div slot="footer">
                <Button @click="tableModal = false">取消</Button>
                <Button type="primary" @click="edit">确定</Button>
            </div>
        </Modal>
    </Card>
</template>
<script>
import { getVoteList, getAllUserData, addSurvey, editSurvey, getSurveyList, delSurvey } from '@/api/index';
import moment from 'moment';
export default {
    name: 'timeline',
    data() {
        return {
            modal: false,
            tableModal: false,
            checkAll: false,
            voteList: [],
            userList: [],
            tableDate: [],
            tableColumns: [],
            formItem: {
                option: [],
                user: [],
                surveyName: '',
            },
            id: '',
            data: [],
            endDate: moment().add(1, 'hour').format(),
            columns: [
                {
                    title: '名称',
                    key: 'surveyName',
                },
                {
                    title: '创建日期',
                    width: 140,
                    align: 'center',
                    key: 'date',
                },
                {
                    title: '投票截至时间',
                    width: 160,
                    align: 'center',
                    key: 'endDate',
                    render: function(h,parmars){
                        if (_.has(parmars.row, 'endDate')) {
                            return h('span', moment(parmars.row.endDate).format('YYYY-MM-DD HH:mm:ss'))
                        } else {
                            return h('span', '-')
                        }
                    }
                },
                {
                    title: '已投票人次',
                    width: 100,
                    align: 'center',
                    key: 'num',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 360,
                    align: 'center',
                },
            ],
        };
    },
    methods: {
        getUserList() {
            getAllUserData().then((res) => {
                if (res.code === 1) {
                    this.userList = res.data;
                    this.getVoteList();
                }
            });
        },
        getVoteList() {
            getVoteList().then((res) => {
                this.voteList = res.data;
                this.getSurveyList();
            });
        },
        getSurveyList() {
            getSurveyList().then((res) => {
                this.data = res.data;
            });
        },
        handleCheckAll() {
            this.checkAll = !this.checkAll;
            if (this.checkAll) {
                this.formItem.user = [];
                this.userList.forEach((element) => {
                    this.formItem.user.push(element.userId);
                });
            } else {
                this.formItem.user = [];
            }
        },
        checkAllGroupChange(data) {
            if (data.length === this.userList.length) {
                this.checkAll = true;
            } else if (data.length > 0) {
                this.checkAll = false;
            } else {
                this.checkAll = false;
            }
        },
        add() {
            addSurvey({
                surveyName: this.formItem.surveyName,
                option: this.formItem.option,
                user: this.formItem.user,
                endDate: this.endDate,
                date: moment().format('YYYY-MM-DD'),
            }).then((res) => {
                this.$Message.success('添加成功');
                this.getVoteList();
            });
        },
        edit() {
            if (this.endDate == '') {
                this.$Message.error('请选择时间')
                return;
            }
            editSurvey({
                id: this.id,
                endDate: this.endDate,
            }).then((res) => {
                this.getVoteList();
                this.tableModal= false;
            });
        },
        setTime: function(id) {
            this.id = id;
            this.tableModal=true;
        },
        deleteTag(id, index, reset) {
            this.$Modal.confirm({
                title: '提示',
                content: reset?'即将清空投票结果，确定要重投吗？':'确定要删除吗？',
                onOk: () => {
                    delSurvey({
                        id: id,
                        reset: reset
                    }).then((res) => {
                        if (res.code === 1) {
                            this.getUserList();
                            this.$Message.success('删除成功');
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                },
            });
        },
    },
    mounted() {
        this.getUserList();
    },
};
</script>
