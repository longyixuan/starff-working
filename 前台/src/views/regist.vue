<style lang="less">
@import './login.less';
</style>
<template>
    <div class="login-layout">
        <div class="login">
            <div class="login-logo">
                <img src="../assets/logo-w.svg" alt="" class="logo-img" />
                <h1 class="logo-text">设计部工作管理系统</h1>
            </div>
            <div class="login-content">
                <div class="login-left"></div>
                <div class="login-right">
                    <div class="login-title">注册</div>
                    <div class="login-form">
                        <Alert type="error" show-icon v-if="error">{{ errorMsg }}</Alert>
                        <Form ref="registForm" :model="form" :rules="rules" class="form" @keydown.enter.native="submitRegist">
                            <FormItem prop="userName">
                                <Input v-model="form.userName" prefix="ios-contact" size="large" clearable placeholder="请输入用户名" autocomplete="off" />
                            </FormItem>
                            <FormItem prop="password">
                                 <Poptip trigger="focus" placement="right" width="250" transfer>
                                    <Input type="password" :maxlength="20" v-model="form.password" prefix="ios-lock"
                                        @on-change="strengthChange" size="large" clearable
                                        placeholder="请输入密码，长度为6-20个字符" autocomplete="off" style="width: 400px"/>
                                    <div v-bind:class="tipStyle" slot="content">
                                        <span class="words">强度 : {{ strength }}</span>
                                        <Slider v-model="strengthValue" :step="33" style="width:95%"></Slider>请至少输入 6
                                        个字符。请不要使
                                        <br>用容易被猜到的密码。
                                    </div>
                                </Poptip>
                            </FormItem>
                            <FormItem prop="confirmPass">
                                <Input type="password" v-model="form.confirmPass" prefix="ios-lock" size="large" clearable placeholder="请再次输入确认密码" autocomplete="off" />
                            </FormItem>
                        </Form>
                        <Button class="login-btn" type="primary" size="large" :loading="loading"
                            @click="submitRegist" long>
                            <span v-if="!loading">注册</span>
                            <span v-else>注册中...</span>
                        </Button>
                        <div class="login-other">
                            <router-link to="/login">使用已有账号登录</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="login-footer">
                Copyright © 2003-{{year}} <a href="https://www.chsi.com.cn/" target="_blank" rel="noopener noreferrer">学信网</a> All Rights Reserved
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
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
            year: moment().format('YYYY'),
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
