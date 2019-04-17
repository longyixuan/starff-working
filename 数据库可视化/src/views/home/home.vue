<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>

<template>
  <div class="home-main">
    <Row :gutter="10" :style="{marginBottom: '15px'}">
      <Col span="6">
        <infor-card
          id-name="user_created_count"
          :end-val="454"
          iconType="md-shuffle"
          color="#2d8cf0"
          intro-text="本周累计工时"
        ></infor-card>
      </Col>
      <Col span="6">
        <infor-card
          id-name="visit_count"
          :end-val="454"
          iconType="ios-eye"
          color="#64d572"
          intro-text="本月累计工时"
        ></infor-card>
      </Col>
      <Col span="6">
        <infor-card
          id-name="collection_count"
          :end-val="400"
          iconType="ios-time"
          color="#ffd572"
          intro-text="本年累计工时"
        ></infor-card>
      </Col>
      <Col span="6">
        <infor-card
          id-name="transfer_count"
          :end-val="systemCount"
          iconType="md-desktop"
          color="#f25e43"
          intro-text="负责系统个数"
        ></infor-card>
      </Col>
    </Row>
    <Row :gutter="10" :style="{marginBottom: '10px'}">
      <Col span="16">
        <Card>
          <p slot="title" class="card-title">
            <Icon type="md-map"></Icon>系统工时统计
          </p>
          <div class="data-source-row">
            <visite-volume></visite-volume>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card>
          <p slot="title" class="card-title">
            <Icon type="md-map"></Icon>系统工时占比分析
          </p>
          <div class="data-source-row">
            <data-source-pie ref="pie"></data-source-pie>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getSystemCount } from "@/api/index";
import Cookies from "js-cookie";
import inforCard from "./components/inforCard.vue";
import visiteVolume from "./components/visiteVolume.vue";
import dataSourcePie from "./components/dataSourcePie.vue";
export default {
  name: "home",
  data() {
    return {
      systemCount: 0
    };
  },
  components: {
    inforCard,
    visiteVolume,
    dataSourcePie
  },
  computed: {
    avatarPath() {
      return localStorage.avatorImgPath;
    }
  },
  methods: {
    init() {
      let userInfo = JSON.parse(Cookies.get("userInfo"));
      getSystemCount({ userId: userInfo.userId }).then(res => {
        if (res.code===1) {
          this.systemCount = res.data;
        }
      })
    }
  },
  mounted() {
    this.init();
  }
};
</script>
