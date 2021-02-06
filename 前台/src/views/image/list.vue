<style lang="less">
@import "./image.less";
</style>
<template>
  <Card title="图片管理">
    <div style="margin-bottom: 20px;">
    <Select clearable filterable style="width: 200px;margin-right:10px;" v-model="uploadData.systemId" placeholder="请选择系统">
        <Option :value="item.id" :key="item.id" v-for="item in sysList">{{item.title}}</Option>
    </Select>
    <DatePicker v-model="uploadData.year" format="yyyy年" style="width: 100px;margin-right:10px;" type="year" placeholder="请选择年份"></DatePicker>
    <Button type="primary" @click="seach" style="margin-right:10px;">查询</Button>
    <Button type="warning" to="/image">上传</Button>
    </div>
    <div>
        <Row :gutter="20">
            <Col style="margin-bottom: 20px;" span="8" :key="item.imageId" v-for="item in imageList">
                <Card @click.native="showImage(item)">
                    <img width="100%" :src="item | imageFilter" alt="">
                </Card>
            </Col>
        </Row>
    </div>
    <Modal footer-hide v-model="modal" fullscreen title="查看图片">
        <img style="display: block;margin: 0 auto;" :src="src" alt="">
    </Modal>
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
      modal: false,
      src: '',
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
    showImage(value) {
      this.src = 'http://'+window.location.hostname+':3333/'+value.imageId+'.'+value.ext;
      this.modal = true;
    },
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