<style lang="less">
@import './vote.less';
</style>
<template>
    <div :style="{ padding: '24px' }">
        <Card title="设计部投票">
            <template v-if="isSubmit">
                <div class="vote">
                    <div class="vote-img"></div>
                    <div class="vote-text">{{text}}</div>
                </div>
            </template>
            <template v-else>
                <Table border stripe :data="tableDate" :columns="tableColumns">
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
            text: '问卷已提交',
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
                if (res.code === 1) {
                    this.tableDate = [];
                    this.option = res.data.option;
                    this.surveyName = res.data.surveyName;
                    this.tableColumns = [
                        {
                            type: 'index',
                            width: 60,
                            align: 'center'
                        },
                        {
                            title: '姓名',
                            key: 'userName',
                            width: 100,
                        },
                    ];
                    res.data.option.forEach((element) => {
                        let _this = this;
                        this.tableColumns.push({
                            title: _.find(this.voteList, ['id', element]).voteName,
                            key: element,
                            slot: element,
                            renderHeader(h, params) {
                                return h('div', [
                                    h('span', _.find(_this.voteList, ['id', element]).voteName),
                                    h('tooltip', {
                                        props: {
                                            transfer: true,
                                            placement: 'top',
                                            'max-width':"240",
                                            content: _.find(_this.voteList, ['id', element]).voteDes
                                        }
                                    },[
                                        h('Icon', {
                                            props: {
                                                type: 'ios-help-circle',
                                                size: '16',
                                                color: '#666'
                                            },
                                            style: {
                                                marginLeft: '5px'
                                            }
                                        })
                                    ])
                                ])
                            }
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
                } else {
                    this.isSubmit = true;
                    this.text = res.msg;
                }
            });
        },
        submit() {
            let data = [];
            let _this = this;
            let flag = false;
            let flag2 = true;
            this.tableDate.forEach((element) => {
                _.forOwn(element, function (value, key) {
                    if (key != 'userName') {
                        if (value === 0) {
                            flag = true;
                        }
                        if (value != 10) {
                            flag2= false;
                        }
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
            if (flag2) {
                this.$Message.error('请不要全部投满分');
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
        if (this.getStore('vote')==this.id) {
            this.isSubmit = true;
        }
    },
};
</script>
