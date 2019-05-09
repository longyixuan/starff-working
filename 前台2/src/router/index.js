import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import { routers } from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    window.document.title = '员工工时管理系统';
    iView.LoadingBar.start();
    if (!Cookies.get('userInfo') && to.name !== 'login' && to.name !== 'regist' && to.name !== 'regist-result' && to.name !== 'relate') { // 判断是否已经登录且前往的页面不是登录页
        next({
            name: 'login'
        });
    } else if (Cookies.get('userInfo') && to.name === 'login') {
        // 判断是否已经登录且前往的是登录页
        next({
            name: 'home_index'
        });
    } else {
        next();
    }
});

router.afterEach((to) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
