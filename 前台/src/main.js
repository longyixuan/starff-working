/*
 * @Author: yinxl 
 * @Date: 2019-04-02 09:55:51 
 * @Last Modified by:   yinxl 
 * @Last Modified time: 2019-04-02 09:55:51 
 */

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from '@/axios/index'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import '../static/clear-default.css'

Vue.config.productionTip = false

Vue.use(api)
Vue.use(iView)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
