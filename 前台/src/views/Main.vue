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
              <span @click="modal=true">修改密码</span>
              <span @click="logout">退出</span>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="0" theme="light" width="auto">
            <MenuItem name="0" @click.native="toRoute('home')"><Icon type="md-home" />首页</MenuItem>
            <Submenu name="1" v-if="type===1">
              <template slot="title">
                <Icon type="md-settings" />系统设置
              </template>
              <MenuItem name="1-1" @click.native="$router.push('department-manage')">部门管理</MenuItem>
              <MenuItem name="1-2" @click.native="toRoute('user-manage')">用户管理</MenuItem>
              <MenuItem name="1-3" @click.native="$router.push('system-manage')">系统管理</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="md-calendar"/>我的工时
              </template>
              <MenuItem name="2-1" @click.native="$router.push('work-time')">录入</MenuItem>
              <!-- <MenuItem v-if="type===1" name="2-2" @click.native="$router.push('work-time-seach')">统计</MenuItem> -->
            </Submenu>
            <MenuItem name="3" @click.native="toRoute('own-space')"><Icon type="md-person" />个人信息</MenuItem>
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
    <Modal v-model="modal" @on-ok="editPassword" title="修改密码">
      <Input v-model="value" placeholder="输入新密码"/>
    </Modal>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { editPassword } from "@/api/index";
export default {
  data() {
    return {
      username: '',
      userId: '',
      type: '',
      value: '',
      modal: false
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
    },
    editPassword() {
      editPassword({ userId: JSON.parse(Cookies.get("userInfo")).userId, password: this.value}).then(res =>{
        if (res.code === 1) {
          this.$Message.success("密码修改成功");
        } else {
          this.$Message.success(res.msg);
        }
      })
    }
  },
  mounted() {
    this.username = JSON.parse(Cookies.get("userInfo")).userName;
    this.type = JSON.parse(Cookies.get("userInfo")).type;
  }
};
</script>
