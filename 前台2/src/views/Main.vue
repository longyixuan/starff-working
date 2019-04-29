<style lang="less">
@import "./main.less";
</style>

<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">员工工时管理系统</div>
          <div class="layout-right">
              {{username}}
              <span @click="logout">退出</span>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="0" theme="light" width="auto">
            <MenuItem name="0" @click.native="toRoute('home')"><Icon type="ios-navigate"></Icon>首页</MenuItem>
            <Submenu name="1" v-if="type===1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>系统设置
              </template>
              <MenuItem name="1-1" @click.native="$router.push('department-manage')">部门管理</MenuItem>
              <MenuItem name="1-2" @click.native="toRoute('user-manage')">用户管理</MenuItem>
              <MenuItem name="1-3" @click.native="$router.push('system-manage')">系统管理</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>我的工时
              </template>
              <MenuItem name="2-1" @click.native="$router.push('work-time')">录入</MenuItem>
              <MenuItem v-if="type===1" name="2-2" @click.native="$router.push('work-time-seach')">统计</MenuItem>
            </Submenu>
            <MenuItem name="3" @click.native="toRoute('own-space')"><Icon type="ios-navigate"></Icon>个人信息</MenuItem>
          </Menu>
        </Sider>
        <Layout :style="{padding: '24px'}">
          <Content :style="{minHeight: '280px'}">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </Content>
        </Layout>
      </Layout>
    </Layout>
    <Back-top :right="10"></Back-top>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  data() {
    return {
      username: '',
      userId: '',
      type: ''
    };
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    menuTheme() {
      return this.$store.state.app.menuTheme;
    }
  },
  methods: {
    toRoute(name) {
      this.$router.push(name)
    },
    logout() {
        this.$store.commit("logout", this);
        // 强制刷新页面 重新加载router
        location.reload();
    }
  },
  mounted() {
    this.username = JSON.parse(Cookies.get("userInfo")).userName;
    this.type = JSON.parse(Cookies.get("userInfo")).type;
  }
};
</script>
