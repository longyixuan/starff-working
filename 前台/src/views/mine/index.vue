<template>
  <div class="info-container">
      <h2 class="info-title">个人资料</h2>
      <Divider />
      <Form :model="formItem" :label-width="80" class="info-form">
          <FormItem label="姓名">
              <Input v-model="formItem.userName" placeholder="请输入姓名" :disabled="isShowEdit"></Input>
          </FormItem>
          <FormItem label="邮箱">
          <Input v-model="formItem.email" placeholder="请输入邮箱" :disabled="isShowEdit"></Input>
          </FormItem>
          <FormItem label="负责的系统">
              <CheckboxGroup v-model="formItem.systems">
                  <Checkbox :disabled="isShowEdit" :label="item.id" :key="item.id" v-for="item in systemsList">{{item.name}}</Checkbox>
              </CheckboxGroup>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="saveInfo" v-show="!isShowEdit">
                  保存
              </Button>
              <Button type="primary" @click="isShowEdit=false" v-show="isShowEdit">
                  修改
              </Button>
              <Button type="default" @click="isShowEdit=true" v-show="!isShowEdit" style="margin-left: 15px;">
                  返回
              </Button>
          </FormItem>
      </Form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      isShowEdit: true,
      formItem: {
          userName: '',
          userId: '',
          email: '',
          systems: []
      },
      systemsList: []
    };
  },
  methods: {
    saveInfo () {
      this.$http.updateUser(this.formItem).then((res)=>{
         this.isShowEdit = true;
      }).catch();
    }
  },
  computed: {
    ...mapState({
      user: state => state.mine.user
    })
  },
  mounted () {
    this.formItem.userName = this.user.userName
    this.formItem.userId = this.user.userId
    this.formItem.email = this.user.email
    this.$http.getSystemList().then((res)=>{
        this.systemsList = res.data;
    }).catch();
  }
};
</script>

<style lang="scss" scoped>
.info-container {
  font-size: 16px;
}
.info-title {
  font-size: 20px;
  .ivu-icon {
    vertical-align: baseline;
  }
}
.ivu-divider-horizontal {
  margin: 18px 0;
}
</style>

