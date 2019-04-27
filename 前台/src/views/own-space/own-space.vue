<style lang="less">
@import "./own-space.less";
</style>

<template>
  <div class="own-space">
    <Card>
      <Tabs :animated="false">
        <TabPane label="基本信息" name="info">
          <Form ref="userForm" :model="userForm" :label-width="100" label-position="right">
            <FormItem label="用户头像：">
              <div class="upload-list" v-for="item in uploadList" :key="item.url">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :on-error="handleError"
                :format="['jpg','jpeg','png','gif']"
                :max-size="5120"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                type="drag"
                :action="uploadFileUrl"
                :headers="accessToken"
                style="display: inline-block;width:58px;"
              >
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="md-camera" size="20"></Icon>
                </div>
              </Upload>
            </FormItem>
            <FormItem label="用户账号：">
              <span>{{userForm.userName}}</span>
            </FormItem>
            <FormItem label="用户姓名：">
              <Input v-model="userForm.nickName" style="width: 200px;"></Input>
            </FormItem>
            <FormItem label="邮箱：">
              <Input v-model="userForm.email" style="width: 200px;"></Input>
            </FormItem>
            <FormItem label="负责的系统：">
              <template v-for="item in SystemList">
                <Tag type="border" :key="item.id" color="default" v-if="userForm.systems.indexOf(item.id)!=-1">{{item.title}}</Tag>
              </template>
              <Button type="primary" size="small" @click="editSystems">编辑</Button>
            </FormItem>
            <FormItem label="所属部门：">
              <span>{{ userForm.departmentTitle }}</span>
            </FormItem>
            <FormItem label="用户类型：">
              <span>{{ userForm.roleTxt }}</span>
            </FormItem>
            <FormItem label="创建时间：">
              <span>{{ userForm.createdAt }}</span>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                style="width: 100px;margin-right:5px"
                :loading="saveLoading"
                @click="saveEdit"
              >保存</Button>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
    <Modal title="图片预览" v-model="viewImage" draggable>
      <img :src="imgUrl" style="width: 80%;margin: 0 auto;display: block;">
      <div slot="footer">
        <Button @click="viewImage=false">关闭</Button>
      </div>
    </Modal>
    <!-- 系统列表 -->
    <Modal title="选择负责的系统" v-model="systemModalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}" class="systemModal">
      <Tree
        ref="sysTree"
        empty-text="请联系管理员录入系统列表"
        :data="systemData"
        :load-data="loadData" 
        @on-toggle-expand="expandCheckSys"
        show-checkbox
        multiple>
      </Tree>
      <Spin size="large" v-if="treeLoading"></Spin>
      <div slot="footer">
        <Button type="text" @click="cancelsystemEdit">取消</Button>
        <Button type="primary" @click="submitsystemEdit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  userInfoEdit,
  uploadFile,
  initSystem,
  loadSystem,
  getSystemList
} from "@/api/index";
import Cookies from "js-cookie";
export default {
  name: "ownspace_index",
  data() {
    return {
      accessToken: {},
      uploadFileUrl: 'http://localhost:3000'+uploadFile,
      userForm: {
        userId: "",
        avatar: "",
        userName: "",
        nickName: "",
        email: "",
        status: "",
        departmentTitle: "",
        role: "",
        createdAt: "",
        systems: [], //负责的系统
        roleTxt: ""
      },
      defaultList: [
        {
          url: ""
        }
      ],
      SystemList: [],
      uploadList: [],
      viewImage: false,
      imgUrl: "",
      saveLoading: false,
      systemModalVisible: false,
      treeLoading: false,
      systemData: [],
      editSystem: [],
      selectAllFlag: false
    };
  },
  methods: {
    init() {
      this.accessToken = {
        accessToken: this.getStore("accessToken")
      };
      let v = JSON.parse(Cookies.get("userInfo"));
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null && (arr.constructor != Array)) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let userInfo = JSON.parse(str);
      this.userForm = userInfo;
      this.defaultList[0].url = userInfo.avatar;
      if (this.userForm.role === 'surperAdmin') {
        this.userForm.roleTxt = '超级管理员';
      } else if (this.userForm.role === 'admin') {
        this.userForm.roleTxt = '管理员';
      } else {
        this.userForm.roleTxt = '普通用户';
      }
      this.getSystemList();
    },
    getSystemList() {
      getSystemList().then(res => {
        if (res.code===1) {
          this.SystemList = res.data
        }
      })
    },
    handleView(imgUrl) {
      this.imgUrl = imgUrl;
      this.viewImage = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      if (res.success === true) {
        file.url = res.result;
        this.userForm.avatar = res.result;
        this.defaultList[0].url = res.result;
        this.$refs.upload.fileList.splice(0, 1);
      } else {
        this.$Message.error(res.message);
      }
    },
    handleError(error, file, fileList) {
      this.$Message.error(error.toString());
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "不支持的文件格式",
        desc:
          "所选文件‘ " +
          file.name +
          " ’格式不正确, 请选择 .jpg .jpeg .png .gif格式文件"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小过大",
        desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 2;
      if (!check) {
        this.$Notice.warning({
          title: "最多只能上传 1 张图片"
        });
      }
      return check;
    },
    saveEdit() {
      this.saveLoading = true;
      let params = this.userForm;
      userInfoEdit(params).then(res => {
        this.saveLoading = false;
        if (res.code === 1) {
          this.$Message.success("保存成功");
          // 更新用户信息
          Cookies.set("userInfo", this.userForm);
          // 更新头像
          this.$store.commit("setAvatarPath", this.userForm.avatar);
        } else {
          this.$Message.error("保存失败");
        }
      });
    },
    editSystems() {
      this.treeLoading = true;
      initSystem().then(res => {
        this.treeLoading = false;
        if (res.code === 1) {
          res.data.forEach(function(e) {
            e.checked = false;
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status === -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          this.systemData = res.data;
          // 判断子节点
          this.checkSysTree(this.systemData, this.userForm.systems);
          this.systemModalVisible=true
        }
      })
    },
    expandCheckSys(v) {
      // 判断展开子节点
      this.checkSysTree(v.children, this.userForm.systems);
    },
    // 判断子节点
    checkSysTree(systemData, systems) {
      let that = this;
      systemData.forEach(function(p) {
        if (that.hasSysPerm(p, systems)) {
          p.checked = true;
        } else {
          p.checked = false;
        }
      });
    },
    // 判断节点勾选
    hasSysPerm(p, systems) {
      let flag = false;
      for (let i = 0; i < systems.length; i++) {
        if (p.id === systems[i]) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return true;
      }
      return false;
    },
    loadData(item, callback) {
      loadSystem(item.id, { openDataFilter: false }).then(res => {
        if (res.code === 1) {
          res.data.forEach(function(e) {
            e.selected = false;
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status === -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          callback(res.data);
        }
      });
    },
    cancelsystemEdit() {
      this.systemModalVisible=false;
    },
    // 全选反选
    // selectTreeAll() {
    //   this.selectAllFlag = !this.selectAllFlag;
    //   let checked = this.selectAllFlag;
    //   this.selectedTreeAll(this.systemData, checked);
    // },
    // // 递归全选节点
    // selectedTreeAll(systemData, checked) {
    //   let that = this;
    //   systemData.forEach(function(e) {
    //     e.checked = checked;
    //     if (e.children && e.children.length > 0) {
    //       that.selectedTreeAll(e.children, checked);
    //     }
    //   });
    // },
    submitsystemEdit() {
      let systemIds = [];
      let selectedNodes = this.$refs.sysTree.getCheckedNodes();
      selectedNodes.forEach(function(e) {
        systemIds.push(e.id);
      });
      this.userForm.systems = systemIds;
      this.systemModalVisible = false;
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
    this.init();
  }
};
</script>
