import axios from 'axios';
import {
    getMenuList
} from '@/api/index';
import lazyLoading from './lazyLoading.js';
import router from '@/router/index';
import Cookies from "js-cookie";

let util = {

};

util.title = function (title) {
    title = title || '工时系统';
    window.document.title = title;
};

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [{
            title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
            path: '',
            name: 'home_index'
        }];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [{
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [{
                title: '首页',
                path: '',
                name: 'home_index'
            }];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [{
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [{
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
};

util.initRouter = function (vm) {
    const constRoutes = [];
    const otherRoutes = [];

    // 404路由需要和动态路由一起注入
    const otherRouter = [{
        path: '/*',
        name: 'error-404',
        meta: {
            title: '404-页面不存在'
        },
        component: 'error-page/404'
    }];

    // 判断用户是否登录
    let userInfo = Cookies.get('userInfo')
    console.log(userInfo)
    if (userInfo === null || userInfo === "" || userInfo === undefined) {
        // 未登录
        return;
    }
    let accessToken = window.localStorage.getItem('accessToken')
    // 加载菜单
    axios.get('http://172.16.10.185:3000'+getMenuList, {
        headers: {
            'accessToken': accessToken
        }
    }).then(res => {
        let menuData = res.data;
        if (menuData === null || menuData === "" || menuData === undefined) {
            return;
        }
        // menuData = [{
        //     "id": "5129710648430592",
        //     "createBy": null,
        //     "createTime": null,
        //     "updateBy": null,
        //     "updateTime": null,
        //     "delFlag": 0,
        //     "name": "sys",
        //     "level": 1,
        //     "type": 0,
        //     "title": "系统管理",
        //     "path": "/sys",
        //     "component": "Main",
        //     "icon": "ios-settings",
        //     "buttonType": "",
        //     "parentId": "",
        //     "description": "",
        //     "sortOrder": 1.00,
        //     "status": 0,
        //     "url": "",
        //     "children": [{
        //         "id": "5129710648430593",
        //         "createBy": null,
        //         "createTime": null,
        //         "updateBy": null,
        //         "updateTime": null,
        //         "delFlag": 0,
        //         "name": "user-manage",
        //         "level": 2,
        //         "type": 0,
        //         "title": "用户管理",
        //         "path": "user-manage",
        //         "component": "sys/user-manage/userManage",
        //         "icon": "md-person",
        //         "buttonType": "",
        //         "parentId": "5129710648430592",
        //         "description": "",
        //         "sortOrder": 1.10,
        //         "status": 0,
        //         "url": "",
        //         "children": null,
        //         "permTypes": [],
        //         "expand": true,
        //         "checked": false,
        //         "selected": false
        //     }, {
        //         "id": "40238597734928384",
        //         "createBy": null,
        //         "createTime": null,
        //         "updateBy": null,
        //         "updateTime": null,
        //         "delFlag": 0,
        //         "name": "department-manage",
        //         "level": 2,
        //         "type": 0,
        //         "title": "部门管理",
        //         "path": "department-manage",
        //         "component": "sys/department-manage/departmentManage",
        //         "icon": "md-git-branch",
        //         "buttonType": "",
        //         "parentId": "5129710648430592",
        //         "description": null,
        //         "sortOrder": 1.20,
        //         "status": 0,
        //         "url": null,
        //         "children": null,
        //         "permTypes": [],
        //         "expand": true,
        //         "checked": false,
        //         "selected": false
        //     }, {
        //         "id": "5129710648430595",
        //         "createBy": null,
        //         "createTime": null,
        //         "updateBy": null,
        //         "updateTime": null,
        //         "delFlag": 0,
        //         "name": "menu-manage",
        //         "level": 2,
        //         "type": 0,
        //         "title": "菜单权限管理",
        //         "path": "menu-manage",
        //         "component": "sys/menu-manage/menuManage",
        //         "icon": "md-menu",
        //         "buttonType": "",
        //         "parentId": "5129710648430592",
        //         "description": "",
        //         "sortOrder": 1.70,
        //         "status": 0,
        //         "url": "",
        //         "children": null,
        //         "permTypes": [],
        //         "expand": true,
        //         "checked": false,
        //         "selected": false
        //     }, 
        //     {
        //         "id": "5129710648430594",
        //         "createBy": null,
        //         "createTime": null,
        //         "updateBy": null,
        //         "updateTime": null,
        //         "delFlag": 0,
        //         "name": "role-manage",
        //         "level": 2,
        //         "type": 0,
        //         "title": "角色权限管理",
        //         "path": "role-manage",
        //         "component": "sys/role-manage/roleManage",
        //         "icon": "md-contacts",
        //         "buttonType": "",
        //         "parentId": "5129710648430592",
        //         "description": "",
        //         "sortOrder": 1.60,
        //         "status": 0,
        //         "url": "",
        //         "children": null,
        //         "permTypes": [],
        //         "expand": true,
        //         "checked": false,
        //         "selected": false
        //     },
        //     {
        //         "id": "39915540965232640",
        //         "createBy": null,
        //         "createTime": null,
        //         "updateBy": null,
        //         "updateTime": null,
        //         "delFlag": 0,
        //         "name": "monitor",
        //         "level": 1,
        //         "type": 0,
        //         "title": "系统监控",
        //         "path": "/monitor",
        //         "component": "Main",
        //         "icon": "ios-analytics",
        //         "buttonType": "",
        //         "parentId": "",
        //         "description": "",
        //         "sortOrder": 3.00,
        //         "status": 0,
        //         "url": "",
        //         "children": [{
        //             "id": "41370251991977984",
        //             "createBy": null,
        //             "createTime": null,
        //             "updateBy": null,
        //             "updateTime": null,
        //             "delFlag": 0,
        //             "name": "quartz-job",
        //             "level": 2,
        //             "type": 0,
        //             "title": "定时任务",
        //             "path": "quartz-job",
        //             "component": "sys/quartz-manage/quartzManage",
        //             "icon": "md-time",
        //             "buttonType": "",
        //             "parentId": "39915540965232640",
        //             "description": null,
        //             "sortOrder": 2.10,
        //             "status": 0,
        //             "url": null,
        //             "children": null,
        //             "permTypes": [],
        //             "expand": true,
        //             "checked": false,
        //             "selected": false
        //         }, {
        //             "id": "41363147411427328",
        //             "createBy": null,
        //             "createTime": null,
        //             "updateBy": null,
        //             "updateTime": null,
        //             "delFlag": 0,
        //             "name": "log-manage",
        //             "level": 2,
        //             "type": 0,
        //             "title": "操作日志管理",
        //             "path": "log-manage",
        //             "component": "sys/log-manage/logManage",
        //             "icon": "md-list-box",
        //             "buttonType": "",
        //             "parentId": "39915540965232640",
        //             "description": "",
        //             "sortOrder": 2.20,
        //             "status": 0,
        //             "url": "",
        //             "children": null,
        //             "permTypes": [],
        //             "expand": true,
        //             "checked": false,
        //             "selected": false
        //         }]
        //     }]
        // }]
        util.initRouterNode(constRoutes, menuData);
        util.initRouterNode(otherRoutes, otherRouter);
        // 添加主界面路由
        vm.$store.commit('updateAppRouter', constRoutes.filter(item => item.children.length > 0));
        // 添加全局路由
        vm.$store.commit('updateDefaultRouter', otherRoutes);
        // 刷新界面菜单
        vm.$store.commit('updateMenulist', constRoutes.filter(item => item.children.length > 0));

        let tagsList = [];
        vm.$store.state.app.routers.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        vm.$store.commit('setTagsList', tagsList);
    });
};

// 生成路由节点
util.initRouterNode = function (routers, data) {
    for (var item of data) {
        let menu = Object.assign({}, item);
        // menu.component = import(`@/views/${menu.component}.vue`);
        menu.component = lazyLoading(menu.component);

        if (item.children && item.children.length > 0) {
            menu.children = [];
            util.initRouterNode(menu.children, item.children);
        }

        let meta = {};
        // 给页面添加权限、标题、第三方网页链接
        meta.permTypes = menu.permTypes ? menu.permTypes : null;
        meta.title = menu.title ? menu.title + " - 员工工时管理系统 By: Yinxl" : null;
        meta.url = menu.url ? menu.url : null;
        menu.meta = meta;

        routers.push(menu);
    }
};

export default util;