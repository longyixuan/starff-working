// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ViewUI from 'view-design';
import './styles/my-theme.less';
import VueWechatTitle from 'vue-wechat-title'
import App from './App'
import { router } from './router/index'
import store from './store'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import VueClipboard from 'vue-clipboard2';

import {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    uploadFileRequest
} from '@/libs/axios'
import {
    setStore,
    getStore,
    removeStore
} from '@/libs/storage'
import '@babel/polyfill'
Vue.config.productionTip = false
Vue.use(ViewUI);
Vue.use(VueWechatTitle);
Vue.use(mavonEditor);


Vue.use(VueClipboard);

// 挂载全局使用的方法
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.uploadFileRequest = uploadFileRequest;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;

const _ = require('lodash');
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    mounted() {
        var link = document.createElement("link");
        link.type = "image/x-icon";
        link.rel = 'icon';
        link.href = '/favicon.ico'
        document.head.appendChild(link);
    }
})
