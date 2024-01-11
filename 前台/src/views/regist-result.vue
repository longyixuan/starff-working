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
                    <Row class="success">
                        <Icon type="md-checkmark-circle" color="#00A862" size="64"></Icon>
                        <p class="success-words">恭喜你，你的账户：{{ userName }} 注册成功</p>
                        <Row class="buttons">
                            <router-link to="/login">
                                <Button type="primary" size="large" style="margin-right:10px;">立即登录</Button>
                            </router-link>
                            <router-link to="/regist">
                                <Button size="large">返回注册</Button>
                            </router-link>
                        </Row>
                    </Row>
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
export default {
    data() {
        return {
            userName: "yinxl",
            year: moment().format('YYYY')
        };
    },
    methods: {},
    mounted() {
        this.userName = this.$route.query.userName;
    }
};
</script>

<style lang="less">
@import "./regist-result.less";
</style>
