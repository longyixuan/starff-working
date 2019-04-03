/*
 * @Author: kuangxj 
 * @Email: frankxjkuang@gmail.com 
 * @Date: 2018-04-19 12:02:14 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-02 16:37:46
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mine from './modules/mine'
import publish from './modules/publish'

import about from './modules/about'
import home from './modules/home'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        about,
        home,
        mine,
        publish,
    },
    strict: process.env.NODE_ENV !== 'production'
})