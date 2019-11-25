<template>
  <Row
    type="flex"
    justify="center"
    align="middle"
    class="regist"
    @keydown.enter.native="submitRegist"
  >
    <Col :xs="{span:22}" style="width: 368px;">
      <Row class="header">
        <img src="../assets/xboot.png" width="360px">
      </Row>

      <Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>

      <Row class="regist-form">
        <Form ref="registForm" :model="form" :rules="rules" class="form">
          <span class="regist-title">注册</span>
          <FormItem prop="userName">
            <Input
              v-model="form.userName"
              :maxlength="30"
              size="large"
              clearable
              placeholder="请输入用户名"
            />
          </FormItem>
          <FormItem prop="password">
            <Poptip trigger="focus" placement="right" width="250">
              <Input
                type="password"
                :maxlength="20"
                v-model="form.password"
                @on-change="strengthChange"
                size="large"
                clearable
                placeholder="请输入密码，长度为6-20个字符"
              />
              <div v-bind:class="tipStyle" slot="content">
                <span class="words">强度 : {{strength}}</span>
                <Slider v-model="strengthValue" :step="33" style="width:95%"></Slider>请至少输入 6 个字符。请不要使
                <br>用容易被猜到的密码。
              </div>
            </Poptip>
          </FormItem>
          <FormItem prop="confirmPass">
            <Input
              type="password"
              :maxlength="20"
              v-model="form.confirmPass"
              size="large"
              clearable
              placeholder="请再次输入确认密码"
            />
          </FormItem>
        </Form>

        <Row type="flex" justify="space-between" class="code-row-bg">
          <Button
            class="regist-btn"
            type="primary"
            size="large"
            :loading="loading"
            @click="submitRegist"
          >
            <span v-if="!loading">注册</span>
            <span v-else>注册中...</span>
          </Button>
          <router-link to="/login">
            <a class="to-login">使用已有账号登录</a>
          </router-link>
        </Row>
      </Row>
    </Col>
  </Row>
</template>

<script>
import { regist } from "@/api/index";
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度不得小于6位"));
      } else {
        callback();
      }
    };
    const validateConfirmPass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度不得小于6位"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      error: false,
      errorMsg: "",
      loading: false,
      tipStyle: "password-tip-none",
      strength: "无",
      strengthValue: 0,
      errorCode: "",
      form: {
        userName: "",
        password: "",
        confirmPass: ""
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
          },
          {
            validator: validatePassword,
            trigger: "blur"
          }
        ],
        confirmPass: [
          {
            required: true,
            message: "确认密码不能为空",
            trigger: "blur"
          },
          {
            validator: validateConfirmPass,
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
    checkStrengthValue(v) {
      // 评级制判断密码强度 最高5
      let grade = 0;
      if (/\d/.test(v)) {
        grade++; //数字
      }
      if (/[a-z]/.test(v)) {
        grade++; //小写
      }
      if (/[A-Z]/.test(v)) {
        grade++; //大写
      }
      if (/\W/.test(v)) {
        grade++; //特殊字符
      }
      if (v.length >= 10) {
        grade++;
      }
      return grade;
    },
    strengthChange() {
      if (!this.form.password) {
        this.tipStyle = "password-tip-none";
        this.strength = "无";
        this.strengthValue = 0;
        return;
      }
      let grade = this.checkStrengthValue(this.form.password);
      if (grade <= 1) {
        this.tipStyle = "password-tip-weak";
        this.strength = "弱";
        this.strengthValue = 33;
      } else if (grade >= 2 && grade <= 4) {
        this.tipStyle = "password-tip-middle";
        this.strength = "中";
        this.strengthValue = 66;
      } else {
        this.tipStyle = "password-tip-strong";
        this.strength = "强";
        this.strengthValue = 100;
      }
    },
    submitRegist() {
      this.$refs.registForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.form.passStrength = this.strength;
          regist(this.form).then(res => {
            this.loading = false;
            if (res.code === 1) {
              let query = {
                userName: this.form.userName
              };
              this.$router.push({
                name: "regist-result",
                query: query
              });
            } else {
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
@import "./regist.less";
</style>
