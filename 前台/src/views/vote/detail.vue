<style lang="less">
@import './vote.less';
</style>
<template>
    <div :style="{ padding: '24px' }">
        <Card title="投票">
            <template v-if="isSubmit">
                <div class="vote">
                    <div class="vote-img"></div>
                    <div class="vote-text">问卷已提交</div>
                </div>
            </template>
            <template v-else>
                <Table border :data="tableDate" :columns="tableColumns">
                    <template slot-scope="{ row, index }" :slot="opt" v-for="opt in option">
                        <Rate class="vote-star" show-text :count="10" icon="md-star" v-model="tableDate[index][opt]">
                            <span style="color: #f5a623">{{ tableDate[index][opt] }}</span>
                        </Rate>
                    </template>
                </Table>
                <div style="margin-top: 20px; text-align: center">
                    <Button type="primary" @click="submit">提交</Button>
                </div>
            </template>
        </Card>
    </div>
</template>
<script>
import { getVoteList, getAllUserData, submitSurvey, detailSurvey } from '@/api/index';
import { setStore, getStore } from '@/libs/storage';
export default {
    name: 'timeline',
    data() {
        return {
            voteList: [],
            userList: [],
            tableDate: [],
            tableColumns: [],
            option: [],
            isSubmit: false,
            surveyName: '',
            id: this.$route.params.id,
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
                this.getSurvey();
            });
        },
        getSurvey() {
            detailSurvey(this.id).then((res) => {
                this.tableDate = [];
                this.option = res.data.option;
                this.surveyName = res.data.surveyName;
                this.tableColumns = [
                    {
                        title: '姓名',
                        key: 'userName',
                        width: 100,
                    },
                ];
                res.data.option.forEach((element) => {
                    this.tableColumns.push({
                        title: _.find(this.voteList, ['id', element]).voteName,
                        key: element,
                        slot: element,
                    });
                });
                res.data.user.forEach((element) => {
                    let item = {
                        userName: _.find(this.userList, ['userId', element]).nickName,
                    };
                    res.data.option.forEach((element2) => {
                        item[element2] = 0;
                    });
                    this.tableDate.push(item);
                });
            });
        },
        submit() {
            let data = [];
            var _this = this;
            var flag = false;
            this.tableDate.forEach((element) => {
                _.forOwn(element, function (value, key) {
                    if (value === 0) {
                        flag = true;
                    }
                    if (key != 'userName') {
                        data.push({
                            surveyId: _this.id,
                            option: key,
                            grade: value,
                            userName: element.userName,
                        });
                    }
                });
            });
            if (flag) {
                this.$Message.error('存在空值，请填写完全');
                return;
            }
            this.$Modal.confirm({
                title: '提示',
                content: '确定要提交吗？',
                onOk: () => {
                    submitSurvey({
                        surveyId: this.id,
                        data: JSON.stringify(data),
                    }).then((res) => {
                        if (res.code === 1) {
                            this.$Message.success(res.msg);
                            this.setStore('vote', this.id);
                            this.isSubmit = true;
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
        if (this.getStore('vote')) {
            this.isSubmit = true;
        }
    },
};
</script>
