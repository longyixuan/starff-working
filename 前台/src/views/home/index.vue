<template>
  <div class="layout">
        <Layout>
            <Header>
                <div class="layout-logo">人员工时统计系统</div>
                <div class="layout-nav">
                    <DatePicker :clearable="false" :editable="false" v-model="curYear" type="year" placeholder="工作年份" style="width: 120px;"></DatePicker>
                    <a>{{$store.state.mine.user.userName}}</a>
                    <a>退出</a>
                </div>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu active-name="1" theme="light" width="auto" :open-names="['1']">
                        <MenuItem name="1">
                            <Icon type="md-person" /> 个人资料
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="md-cube" /> 系统列表管理
                        </MenuItem>
                        <MenuItem name="3">
                            <Icon type="md-calendar" /> 我的工作时间
                        </MenuItem>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                        <router-view/>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>

<script>

export default {
    data () {
        return {
            curYear: (new Date).getFullYear()+''
        }
    }
};
</script>

<style lang="scss" scoped>
.ivu-layout-header {
  background: #2d8cf0;
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
}
.layout-logo{
    height: 64px;
    float: left;
    color: #f5f7f9;
    font-size: 30px;
    border-radius: 3px;
    font-weight: 400;
    background: url(../../assets/logo2.png) no-repeat left center;
    background-size: 40px 40px;
    padding-left: 50px;
}
.layout-nav{
    width: 400px;
    float: right;
    a {
      color: #fff;
      margin-left: 40px;
      font-size: 16px;
      &:hover {
          color: #fff;
      }
    }
}
.ivu-menu-horizontal {
    height: 64px;
    line-height: 64px;
    .ivu-input-wrapper {
        vertical-align: baseline;
    }
}
</style>

