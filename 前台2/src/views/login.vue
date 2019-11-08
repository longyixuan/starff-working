<template>
  <Row
    type="flex"
    justify="center"
    align="middle"
    class="login"
    @keydown.enter.native="submitLogin"
  >
    <Col :xs="{span:22}" style="width: 368px;">
      <Row class="header">
        <img src="../assets/xboot.png" width="360px;">
      </Row>

      <Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>

      <Row class="login-form">
        <Form ref="userNameLoginForm" :model="form" :rules="rules" class="form">
          <FormItem prop="userName">
            <Input
              v-model="form.userName"
              prefix="ios-contact"
              size="large"
              clearable
              placeholder="请输入用户名"
              autocomplete="off"
            />
          </FormItem>
          <FormItem prop="password">
            <Input
              type="password"
              v-model="form.password"
              prefix="ios-lock"
              size="large"
              clearable
              placeholder="请输入密码"
              autocomplete="off"
            />
          </FormItem>
        </Form>
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Dropdown>
            <router-link to="/regist">
              <a class="forget-pass">注册账户</a>
            </router-link>
          </Dropdown>
        </Row>
        <Row>
          <Button
            class="login-btn"
            type="primary"
            size="large"
            :loading="loading"
            @click="submitLogin"
            long
          >
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </Button>
        </Row>
      </Row>
    </Col>
  </Row>
</template>

<script>
import Cookies from "js-cookie";
import { login, userInfo, getJWT } from "@/api/index";
export default {
  data() {
    return {
      error: false,
      errorMsg: "",
      saveLogin: true,
      loading: false,
      form: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    showErrorMsg(msg) {
      this.error = true;
      this.errorMsg = msg;
    },
    submitLogin() {
      this.$refs.userNameLoginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          login({
            userName: this.form.userName,
            password: this.form.password,
            saveLogin: this.saveLogin
          }).then(res => {
            if (res.code === 1) {
              this.setStore("accessToken", res.token);
              // 获取用户信息
              userInfo().then(res => {
                if (res.code === 1) {
                  if (this.saveLogin) {
                    // 保存7天
                    Cookies.set("userInfo", JSON.stringify(res.data), {
                      expires: 7
                    });
                  } else {
                    Cookies.set("userInfo", JSON.stringify(res.data));
                  }
                  console.log(JSON.stringify(res.data).length)
                  this.setStore("userInfo", res.data);
                  this.$router.push({
                    name: "home_index"
                  });
                } else {
                  this.loading = false;
                }
              });
            } else {
              this.loading = false;
              this.error = true;
              this.errorMsg = res.msg;
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "./login.less";
</style>
