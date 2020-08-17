<template>
    <div id="main" class="app-main">
        
        <router-view v-wechat-title="$route.meta.title"></router-view>
    </div>
</template>
<script>
(function (f) {
    var e = f.sessionStorage;
    if (e) {
      e.CUSTOMER_WEB_MONITOR_ID = "webfunny_269";
      var d = document.createElement("script");
      d.async = 1;
      d.src = "//t4.chei.com.cn/common/fed/monitor.min.js";
      var g = document.getElementsByTagName("script")[0];
      g.parentNode.insertBefore(d, g)
    }
  })(window);
export default {
  data() {
    return {
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  /* overflow: hidden; */
}

.app-main {
  width: 100%;
  height: 100%;
}

.br button {
  margin-right: 5px;
}

.operation button {
  margin-right: 5px;
}

.ivu-btn-text:focus {
  box-shadow: none !important;
}
</style>
