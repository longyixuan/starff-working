<style lang="less">
@import './main.less';
</style>

<template>
    <div class="layout">
        <Layout>
            <Header class="zlk-header">
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo">设计部资料库</div>
                    <div class="layout-right layout-right-md">
                        <a href="/doc/sj" target="_blank">设计资料库</a>
                        <a href="/doc/qd" target="_blank">前端资料库</a>
                        <a href="http://172.16.2.131:8085/#/guide/install" target="_blank">大屏监控平台组件库</a>
                    </div>
                </Menu>
            </Header>
            <router-view></router-view>
        </Layout>
        <Back-top :right="10"></Back-top>
    </div>
</template>
