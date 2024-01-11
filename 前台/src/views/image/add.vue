<style lang="less">
@import "./image.less";
</style>
<template>
  <Card dis-hover title="图片管理">
    <Form :label-width="100">
      <FormItem label="系统：">
        <Select clearable filterable style="width: 400px;margin-right:10px;" v-model="uploadData.systemId" placeholder="请选择系统">
          <Option :value="item.id" :key="item.id" v-for="item in sysList">{{item.title}}</Option>
      </Select>
      </FormItem>
      <FormItem label="年份：">
        <DatePicker v-model="uploadData.year" format="yyyy年" style="width: 400px;margin-right:10px;" type="year" placeholder="请选择年份"></DatePicker>
      </FormItem>
      <FormItem label="截图：">
        <Upload
          multiple
          type="drag"
          :data="uploadData"
          :action="action"
          style="width: 400px;">
          <div style="padding: 20px 0;">
              <Icon type="ios-cloud-upload" size="52" style="color: #00A862"></Icon>
              <p>点击或拖拽文件上传</p>
          </div>
        </Upload>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="seach">查询</Button>
      </FormItem>
    </Form>
    <div>
      <img :src="item | imageFilter" alt="" :key="item.imageId" v-for="item in imageList">
    </div>
  </Card>
</template>
<script>
import {
  uploadImage,
  imageList,
  getSystemList
} from "@/api/index";
export default {
  name: "image",
  data() {
    return {
      action: '',
      sysList: [],
      imageList: [],
      uploadData: {
        systemId: '',
        year: new Date()
      }
    };
  },
  filters: {
    imageFilter(value) {
      return 'http://'+window.location.hostname+':3333/'+value.imageId+'.'+value.ext;
    }
  },
  methods: {
    init() {
        getSystemList().then(res => {
            this.sysList = res.data;
        })
    },
    seach() {
      imageList({
        systemId: this.uploadData.systemId
      }).then(res => {
        this.imageList = res.data;
      })
    }
  },
  mounted() {
    this.action = 'http://'+window.location.hostname+':3333'+uploadImage;
    this.init();
    this.seach();
  }
};
</script>