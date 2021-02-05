<style lang="less">
@import "./image.less";
</style>
<template>
  <Card title="图片管理">
    <div style="margin-bottom: 20px;">
    <Select clearable filterable style="width: 400px;margin-right:10px;" v-model="uploadData.systemId" placeholder="请选择系统">
        <Option :value="item.id" :key="item.id" v-for="item in sysList">{{item.title}}</Option>
    </Select>
    <DatePicker v-model="uploadData.year" format="yyyy年" style="width: 400px;margin-right:10px;" type="year" placeholder="请选择年份"></DatePicker>
    <Button type="primary" @click="seach">查询</Button>
    </div>
    <div>
        <Row :gutter="20">
            <Col span="8" :key="item.imageId" v-for="item in imageList">
                <Card>
                    <img width="100%" :src="item | imageFilter" alt="">
                </Card>
            </Col>
        </Row>
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