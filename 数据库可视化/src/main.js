// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
//省市县
import iviewArea from 'iview-area'
import App from './App'
import { router } from './router/index'
import store from './store'
import 'iview/dist/styles/iview.css'
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
import util from '@/libs/util'
import hasPermission from '@/libs/hasPermission'
import hasRole from '@/libs/hasRole'
import VueLazyload from 'vue-lazyload'
import TreeTable from 'tree-table-vue'
import '@babel/polyfill'

Vue.config.productionTip = false
Vue.use(VueLazyload, {
    error: require('./assets/img-error.png'),
    loading: require('./assets/loading2.gif')
})
Vue.use(iView);
Vue.use(iviewArea);
Vue.use(TreeTable);
Vue.use(hasPermission);
Vue.use(hasRole);
// 挂载全局使用的方法
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.uploadFileRequest = uploadFileRequest;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted() {
        // 初始化菜单
        util.initRouter(this);
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
    }
})
