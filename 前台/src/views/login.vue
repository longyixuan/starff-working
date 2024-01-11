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
                    <div class="login-title">登录</div>
                    <div class="login-form">
                        <Alert type="error" show-icon v-if="error">{{ errorMsg }}</Alert>
                        <Form ref="userNameLoginForm" :model="form" :rules="rules" class="form" @keydown.enter.native="submitLogin">
                            <FormItem prop="userName">
                                <Input v-model="form.userName" prefix="ios-contact" size="large" clearable placeholder="请输入用户名" autocomplete="off" />
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" v-model="form.password" prefix="ios-lock" size="large" clearable placeholder="请输入密码" autocomplete="off" />
                            </FormItem>
                        </Form>
                        <Button class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
                            <span v-if="!loading">登录</span>
                            <span v-else>登录中...</span>
                        </Button>
                        <div class="login-other">
                            <router-link to="/regist">注册账号</router-link>
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
import { login, userInfo, getJWT } from '@/api/index';
export default {
    data() {
        return {
            error: false,
            errorMsg: '',
            saveLogin: true,
            loading: false,
            form: {
                userName: '',
                password: '',
            },
            rules: {
                userName: [
                    {
                        required: true,
                        message: '账号不能为空',
                        trigger: 'blur',
                    },
                ],
                password: [
                    {
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur',
                    },
                ],
            },
            year: moment().format('YYYY')
        };
    },
    components: {},
    methods: {
        showErrorMsg(msg) {
            this.error = true;
            this.errorMsg = msg;
        },
        submitLogin() {
            this.$refs.userNameLoginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    login({
                        userName: this.form.userName,
                        password: this.form.password,
                        saveLogin: this.saveLogin,
                    }).then((res) => {
                        if (res.code === 1) {
                            this.setStore('accessToken', res.token);
                            // 获取用户信息
                            userInfo().then((res1) => {
                                if (res1.code === 1) {
                                    this.setStore('userInfo', res.data);
                                    this.$router.push({
                                        name: 'home_index',
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
        },
    },
};
</script>
