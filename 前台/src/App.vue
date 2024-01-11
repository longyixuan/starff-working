<template>
  <div id="main" class="app-main">
    <router-view v-wechat-title="$route.meta.title"></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  beforeDestroy() {},
  methods: {},
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #F7F9F8;
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
