<style lang="less">
@import './main.less';
</style>

<template>
    <div class="layout">
        <Layout>
            <Header>
                <div class="header">
                    <div class="layout-logo" :class="{'expand': isCollapsed}">设计部工作管理系统</div>
                    <div class="menu-other">
                        <span class="menu-expand" :class="{'expand': isCollapsed}" @click="collapsedSider" v-show="$route.name != 'survey-detail'"></span>
                    </div>
                    <div class="layout-right">
                        <span class="user-icon"></span>
                        {{ username }}
                        <!-- <span><a href='/msg' style="color: #fff">消息中心</a></span> -->
                        <span @click="modal = true">修改密码</span>
                        <span @click="logout">退出</span>
                    </div>
                </div>
            </Header>
            <!-- <Layout v-if="msgList.length>0">
                <Alert style="margin-bottom: 0;" type="warning">
                <div style="display: flex;line-height: 24px;align-items: center;color: #fa795e" v-for="item in msgList" :key="item.id">
                    你有未读消息（发送时间：{{item.replayTime}}，发送人：{{item.fsr}}），<a :href="'/summary/admindetails?id='+item.documentId+'&type='+item.type" @click="readMsg(item.id)">查看</a>。
                </div>
                </Alert>
            </Layout> -->
            <Layout>
                <div v-show="$route.name != 'survey-detail'">
                    <Sider hide-trigger :style="{ background: '#fff' }" width="248" ref="side" collapsible :collapsed-width="1" v-model="isCollapsed">
                        <Menu active-name="0" theme="light" width="auto" class="yggs-menu">
                            <MenuItem name="0" to="/home"><Icon type="md-home" />首页</MenuItem>
                            <Submenu name="1" v-if="type === 1">
                                <template slot="title"> <Icon type="md-settings" />系统设置 </template>
                                <MenuItem name="1-1" to="/department-manage">部门管理</MenuItem>
                                <MenuItem name="1-2" to="/user-manage">用户管理</MenuItem>
                                <MenuItem name="1-3" to="/system-manage">系统管理</MenuItem>
                                <!-- <MenuItem name="1-4" to="/role-manage">角色管理</MenuItem> -->
                            </Submenu>
                            <Submenu name="2">
                                <template slot="title"> <Icon type="md-calendar" />我的工时 </template>
                                <MenuItem name="2-1" to="/work-time">录入</MenuItem>
                            </Submenu>
                            <Submenu name="3">
                                <template slot="title"> <Icon type="md-document" />工作总结 </template>
                                <!-- <MenuItem name="3-1" to="/summary-day">日总结</MenuItem> -->
                                <!-- <MenuItem name="3-2" to="/summary-week">周总结</MenuItem> -->
                                <!-- <MenuItem name="3-3" to="/summary-month">月总结</MenuItem> -->
                                <MenuItem name="3-3" to="/summary/list">月总结</MenuItem>
                            </Submenu>
                            <Submenu name="12" v-if="type === 1">
                                <template slot="title"> <Icon type="md-pie" />jira完成情况 </template>
                                <MenuItem name="12-1" to="/jira-list">录入</MenuItem>
                                <MenuItem name="12-2" to="/jira-count">查看</MenuItem>
                            </Submenu>
                            <Submenu name="9" v-if="type === 1 || defaultRole == 'sj'">
                                <template slot="title"> <Icon type="md-flag" />视觉作品数量记录 </template>
                                <MenuItem name="9-1" to="/design/tag" v-if="type === 1">选项设置</MenuItem>
                                <MenuItem name="9-2" to="/design">录入</MenuItem>
                                <MenuItem name="9-3" to="/design/show" v-if="type === 1">查看</MenuItem>
                            </Submenu>
                            <MenuItem name="4" to="/sys-modal" v-if="type === 1"><Icon type="ios-folder-open" />系统模块管理</MenuItem>
                            <MenuItem name="5" to="/time-line"><Icon type="md-options" />系统时间线</MenuItem>
                            <!-- <MenuItem name="10" to="/aws/list"><Icon type="md-clipboard" />aws发布时间线</MenuItem> -->
                            <!-- <MenuItem name="8" to="/sys-time-line"><Icon type="ios-git-pull-request" />系统同步记录</MenuItem> -->
                            <MenuItem name="6" to="/time-line/tag" v-if="type === 1"><Icon type="md-bookmark" />标签管理</MenuItem>
                            <Submenu name="13" v-if="type === 1">
                                <template slot="title"> <Icon type="md-planet" />系统列表及负责人</template>
                                <MenuItem name="13-1" to="/fzxt/tag">所属平台设置</MenuItem>
                                <MenuItem name="13-2" to="/fzxt/list">查看</MenuItem>
                            </Submenu>
                            <MenuItem name="13" to="/fzxt/list" v-else><Icon type="md-planet" />系统列表及负责人</MenuItem>
                            <Submenu name="19" v-if="type === 1">
                                <template slot="title"> <Icon type="md-desktop" />监控平台列表及负责人</template>
                                <MenuItem name="19-1" to="/jkpt/tag">楼层设置</MenuItem>
                                <MenuItem name="19-2" to="/jkpt/list">查看</MenuItem>
                            </Submenu>
                            <MenuItem name="19" to="/jkpt/list" v-else><Icon type="md-desktop" />监控平台列表及负责人</MenuItem>
                            <Submenu name="11" v-if="type === 1">
                                <template slot="title"> <Icon type="md-happy" />投票管理 </template>
                                <MenuItem name="11-1" to="/vote">选项设置</MenuItem>
                                <MenuItem name="11-2" to="/vote/survey">投票历史</MenuItem>
                                <!-- <MenuItem name="11-3" to="/vote/mysurvey">我的投票</MenuItem> -->
                            </Submenu>
                            <MenuItem name="11" to="/vote/mysurvey" v-else><Icon type="md-happy" />投票查看</MenuItem>
                             <MenuItem name="17" to="/tasklist/list"><Icon type="md-clipboard" />任务清单管理</MenuItem>
                            <Submenu name="14" v-if="type === 1">
                                <template slot="title"><Icon type="ios-paper-plane" />任务进度管理</template>
                                <MenuItem name="14-1" to="/task/zt">状态管理</MenuItem>
                                <MenuItem name="14-2" to="/task/add">查看任务</MenuItem>
                                <MenuItem name="14-3" to="/task/guidang">查看归档</MenuItem>
                            </Submenu>
                            <MenuItem name="14" to="/task/add" v-else><Icon type="ios-paper-plane" />任务进度管理</MenuItem>
                            <Submenu name="15">
                                <template slot="title"><Icon type="md-book" />设计资料库</template>
                                <MenuItem name="15-1" to="/zlk/sjml">目录管理</MenuItem>
                                <MenuItem name="15-2" to="/zlk/sjlist">资料管理</MenuItem>
                            </Submenu>
                            <Submenu name="16">
                                <template slot="title"><Icon type="md-book" />前端资料库</template>
                                <MenuItem name="16-1" to="/zlk/qdml">目录管理</MenuItem>
                                <MenuItem name="16-2" to="/zlk/qdlist">资料管理</MenuItem>
                            </Submenu>
                            <MenuItem name="18" to="/icon/list"><Icon type="ios-paper-plane" />图标库</MenuItem>
                            <!-- <Submenu name="18">
                                <template slot="title"><Icon type="md-cube" />图标库管理</template>
                                <MenuItem name="18-1" to="/icon/tag">分类</MenuItem>
                                <MenuItem name="18-2" to="/icon/list">图标库</MenuItem>
                            </Submenu> -->
                            <MenuItem name="7" to="/own-space"><Icon type="md-person" />个人信息</MenuItem>
                        </Menu>
                    </Sider>
                </div>
                <Layout :style="{ padding: '24px', position: 'relative' }">
                    <Content :style="{ minHeight: '280px' }">
                        <router-view></router-view>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
        <Back-top :right="10"></Back-top>
        <Modal v-model="modal" title="修改密码">
            <Alert type="warning" show-icon style="margin-bottom: 10px">输入6位以上密码</Alert>
            <Input v-model="value" placeholder="输入新密码" />
            <div slot="footer">
                <Button @click="modal = false">取消</Button>
                <Button type="primary" @click="editPassword" :disabled="value.length < 6">确认修改</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { editPassword} from '@/api/index';
export default {
    data() {
        return {
            username: '',
            userId: '',
            defaultRole: '',
            type: '',
            value: '',
            modal: false,
            isCollapsed: false
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
        },
        // msgList() {
        //   return this.$store.state.msg.wdxx;
        // }
    },
    methods: {
        collapsedSider () {
            this.$refs.side.toggleCollapse();
        },
        toRoute(name) {
            this.$router.push(name);
        },
        logout() {
            this.$store.commit('logout', this);
            // 强制刷新页面 重新加载router
            location.reload();
        },
        editPassword() {
            editPassword({ userId: JSON.parse(localStorage.getItem('userInfo')).userId, password: this.value }).then((res) => {
                if (res.code === 1) {
                    this.modal = false;
                    this.$Message.success('密码修改成功');
                } else {
                    this.$Message.success(res.msg);
                }
            });
        },
        readMsg: function (id) {
            this.$store.dispatch('replayUpdateMsg', { id });
        },
    },
    mounted() {
        this.username = JSON.parse(localStorage.getItem('userInfo')).userName;
        this.type = JSON.parse(localStorage.getItem('userInfo')).type;
        this.defaultRole = JSON.parse(localStorage.getItem('userInfo')).defaultRole;
        // this.$store.dispatch('getMsgList');
        this.$store.dispatch('getRole');
    }
};
</script>
