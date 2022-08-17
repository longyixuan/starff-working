<style lang="less">
@import "./vote.less";
</style>
<template>
    <Card title="投票">
        <Alert>
            每个选项为1-10。
        </Alert>
        <Table border :data="tableDate" :columns="tableColumns">
            <template slot-scope="{ row, index }" :slot="opt" v-for="opt in option">
                <Input :key="'opt-'+row[opt]" type="text" v-model="tableDate[index][opt]"/>
            </template>
        </Table>
        <div style="margin-top: 20px;text-align: center;">
            <Button type="primary" @click="submit">提交</Button>
        </div>
    </Card>
</template>
<script>
import {
    getVoteList,
    getAllUserData,
    submitSurvey,
    detailSurvey
} from "@/api/index";
export default {
  name: "timeline",
  data() {
      return {
        voteList: [],
        userList: [],
        tableDate: [],
        tableColumns: [],
        option: [],
        id: this.$route.params.id
      }
  },
  methods: {
        getUserList() {
            getAllUserData().then(res => {
                if (res.code === 1) {
                    this.userList = res.data;
                    this.getVoteList();
                }
            });
        },
        getVoteList() {
            getVoteList().then(res => {
                this.voteList = res.data;
                this.getSurvey();
            })
        },
        getSurvey() {
            detailSurvey(this.id).then(res => {
                this.tableDate = [];
                this.option = res.data.option;
                this.tableColumns = [
                    {
                        title: '姓名',
                        key: 'userName',
                        width: 100
                    }
                ];
                res.data.option.forEach(element => {
                    this.tableColumns.push(
                        {
                            title: _.find(this.voteList, ['id', element]).voteName,
                            key: element,
                            slot: element
                        }
                    );
                })
                res.data.user.forEach(element => {
                    let item = {
                        userName: _.find(this.userList, ['userId', element]).nickName
                    };
                    res.data.option.forEach(element2 => {
                        item[element2] = '';
                    });
                    this.tableDate.push(item);
                });
            });
        },
        submit() {
            let data = [];
            var _this = this;
            var flag = false;
            this.tableDate.forEach(element => {
                _.forOwn( element, function(value, key) {
                    if (value == '') {
                        flag = true;
                    }
                    if (key != 'userName') {
                        data.push({
                            surveyId: _this.id,
                            submitUser: JSON.parse(localStorage.getItem('userInfo')).userName,
                            option: key,
                            grade: value == '' ? 0 : parseInt(value),
                            userName: element.userName
                        })
                    }
                });
            });
            if (flag) {
                this.$Message.error('存在空值，请填写完全');
                return;
            }
            submitSurvey({
                submitUser: JSON.parse(localStorage.getItem('userInfo')).userName,
                surveyId: this.id,
                data: JSON.stringify(data)
            }).then(res => {
                if (res.code === 1) {
                    this.$Message.success(res.msg);
                } else {
                    this.$Message.error(res.msg);
                }
            });
        }
  },
  mounted() {
      this.getUserList();
  }
}
</script>