import Main from '@/views/Main.vue';
import Mainzlk from '@/views/Mainzlk.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录 - 工时系统 '
    },
    component: () => import('@/views/login.vue')
};

export const registRouter = {
    path: '/regist',
    name: 'regist',
    meta: {
        title: '注册 - 工时系统'
    },
    component: () => import('@/views/regist.vue')
};

export const registResult = {
    path: '/regist-result',
    name: 'regist-result',
    meta: {
        title: '注册结果 - 工时系统'
    },
    component: () => import('@/views/regist-result.vue')
};
export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};
export const doc = {
    path: '/doc/',
    name: 'doc',
    component: Mainzlk,
    children: [
        {
            path: 'qd',
            meta: {
                title: '设计部资料库'
            },
            name: 'zlk-qd-index',
            component: () => import('@/views/zlk/index-qd.vue')
        },
        {
            path: 'sj',
            meta: {
                title: '设计部资料库'
            },
            name: 'zlk-qd-index',
            component: () => import('@/views/zlk/index-sj.vue')
        }
    ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = {
    path: '/',
    name: 'appRouter',
    redirect: '/home',
    component: Main,
    children: [
        { 
            path: 'home',
            meta: {
                title: '首页'
            }, 
            name: 'home_index', 
            component: () => import('@/views/home/home.vue')
        },
        /*
        { 
            path: 'msg',
            meta: {
                title: '消息中心'
            }, 
            name: 'msg', 
            component: () => import('@/views/msg/msg-list.vue')
        },
        */
        {
            path: 'department-manage',
            meta: {
                title: '部门管理'
            }, 
            name: 'department-manage',
            component: () => import('@/views/sys/department-manage/departmentManage.vue')
        },
        {
            path: 'user-manage',
            meta: {
                title: '用户管理'
            }, 
            name: 'user-manage',
            component: () => import('@/views/sys/user-manage/userManage.vue')
        },
        {
            path: 'system-manage',
            meta: {
                title: '系统管理'
            },
            name: 'system-manage',
            component: () => import('@/views/sys/system-manage/systemManage.vue')
        },
        // {
        //     path: 'role-manage',
        //     meta: {
        //         title: '角色管理'
        //     },
        //     name: 'role-manage',
        //     component: () => import('@/views/sys/role/index.vue')
        // },
        {
            path: 'work-time',
            meta: {
                title: '我的工时-录入'
            }, 
            name: 'work-time',
            component: () => import('@/views/work-time/work-time.vue')
        }, 
        {
            path: 'work-time-seach',
            meta: {
                title: '我的工时-统计'
            }, 
            name: 'work-time-seach',
            component: () => import('@/views/work-time/work-time-seach.vue')
        },
        {
            path: 'own-space',
            meta: {
                title: '个人信息'
            },
            name: 'own-space',
            component: () => import('@/views/own-space/own-space.vue')
        },
        {
            path: 'summary-day',
            meta: {
                title: '工作总结-日总结'
            },
            name: 'summary-day',
            component: () => import('@/views/document/summary-day.vue')
        },
        {
            path: 'summary-week',
            meta: {
                title: '工作总结-周总结'
            },
            name: 'summary-week',
            component: () => import('@/views/document/summary-week.vue')
        },
        {
            path: 'summary-month',
            meta: {
                title: '工作总结-月总结'
            },
            name: 'summary-month',
            component: () => import('@/views/document/summary-month.vue')
        },
        {
            path: 'summary/seach',
            meta: {
                title: '工作总结'
            },
            name: 'summary-seach',
            component: () => import('@/views/document/seach.vue')
        },
        {
            path: 'summary/edit',
            meta: {
                title: '工作总结-编辑'
            },
            name: 'summary-edit',
            component: () => import('@/views/document/template.vue')
        },
        {
            path: 'summary/editweek',
            meta: {
                title: '工作总结-编辑'
            },
            name: 'summary-editweek',
            component: () => import('@/views/document/template-week.vue')
        },
        {
            path: 'summary/editmonth',
            meta: {
                title: '工作总结-编辑'
            },
            name: 'summary-editmonth',
            component: () => import('@/views/document/template-month.vue')
        },
        {
            path: 'summary/details',
            meta: {
                title: '工作总结-查看'
            },
            name: 'summary-details',
            component: () => import('@/views/document/templateView.vue')
        },
        {
            path: 'summary/admindetails',
            meta: {
                title: '工作总结-查看'
            },
            name: 'summary-admindetails',
            component: () => import('@/views/document/templateViewAdmin.vue')
        },
        {
            path: 'summary/merge',
            meta: {
                title: '工作总结-归档'
            },
            name: 'summary-merge',
            component: () => import('@/views/document/templateMerge.vue')
        },
        {
            path: 'sys-modal',
            meta: {
                title: '系统模块管理'
            },
            name: 'summary-manage',
            component: () => import('@/views/document/modal.vue')
        },
        {
            path: 'sys-modal-merge',
            meta: {
                title: '系统模块管理-合并'
            },
            name: 'summary-manage-merge',
            component: () => import('@/views/document/mergemodal.vue')
        },
        {
            path: 'summary/template',
            meta: {
                title: '工作总结'
            },
            name: 'summary-template',
            component: () => import('@/views/document/template.vue')
        },
        {
            path: 'summary/edit/:id',
            meta: {
                title: '工作总结'
            },
            name: 'template-edit',
            component: () => import('@/views/document/template.vue')
        },
        {
            path: 'summary/template/details/:id',
            meta: {
                title: '工作总结'
            },
            name: 'template-view',
            component: () => import('@/views/document/templateView.vue')
        },
        {
          path: 'time-line',
            meta: {
                title: '系统时间线'
            },
            name: 'time-line',
            component: () => import('@/views/timeline/time-line.vue')
        },
        {
            path: 'time-line/add',
            meta: {
                title: '系统时间线'
            },
            name: 'time-line-add',
            component: () => import('@/views/timeline/add.vue')
        },
        {
            path: 'time-line/edit',
            meta: {
                title: '系统时间线'
            },
            name: 'time-line-edit',
            component: () => import('@/views/timeline/add.vue')
        },
        {
            path: 'sys-time-line',
            meta: {
                title: '系统同步记录'
            },
            name: 'sys-time-line',
            component: () => import('@/views/systimeline/time-line.vue')
        },
        {
            path: 'sys-time-line/add',
            meta: {
                title: '系统同步记录'
            },
            name: 'sys-time-line-add',
            component: () => import('@/views/systimeline/add.vue')
        },
        {
            path: 'sys-time-line/edit',
            meta: {
                title: '系统同步记录'
            },
            name: 'sys-time-line-edit',
            component: () => import('@/views/systimeline/add.vue')
        },
        {
            path: 'jira-list',
            meta: {
                title: 'jira完成情况'
            },
            name: 'jira',
            component: () => import('@/views/jira/list.vue')
        },
        {
            path: 'jira-count',
            meta: {
                title: 'jira完成情况'
            },
            name: 'jira',
            component: () => import('@/views/jira/count.vue')
        },
        {
            path: 'time-line/tag',
            meta: {
                title: '标签管理'
            },
            name: 'tag',
            component: () => import('@/views/timeline/tag.vue')
        },
        {
            path: 'fzxt/tag',
            meta: {
                title: '系统列表及负责人'
            },
            name: 'tagfzxt',
            component: () => import('@/views/fzxt/tag.vue')
        },
        {
            path: 'fzxt/list',
            meta: {
                title: '系统列表及负责人'
            },
            name: 'listfzxt',
            component: () => import('@/views/fzxt/list.vue')
        },
        {
            path: 'work-time-count',
            meta: {
                title: ''
            },
            name: 'work-time-count',
            component: () => import('@/views/home/personal.vue')
        },
        {
            path: 'aws/list',
            meta: {
                title: 'aws发布时间线'
            },
            name: 'aws',
            component: () => import('@/views/aws/list.vue')
        },
        {
            path: 'vote',
            meta: {
                title: '投票'
            },
            name: 'vote',
            component: () => import('@/views/vote/vote.vue')
        },
        {
            path: 'vote/survey',
            meta: {
                title: '投票'
            },
            name: 'survey',
            component: () => import('@/views/vote/survey.vue')
        },
        // {
        //     path: 'vote/detail/:id',
        //     meta: {
        //         title: '投票'
        //     },
        //     name: 'survey-detail',
        //     component: () => import('@/views/vote/detail.vue')
        // },
        {
            path: 'vote/count/:id',
            meta: {
                title: '投票'
            },
            name: 'survey-count',
            component: () => import('@/views/vote/count.vue')
        },
        {
            path: 'vote/mysurvey',
            meta: {
                title: '投票'
            },
            name: 'survey',
            component: () => import('@/views/vote/mysurvey.vue')
        },
        {
            path: 'vote/mycount/:id',
            meta: {
                title: '投票'
            },
            name: 'survey-count',
            component: () => import('@/views/vote/mycount.vue')
        },
        {
            path: '/vote/detail/:id',
            meta: {
                title: '投票'
            },
            name: 'survey-detail',
            component: () => import('@/views/vote/detail.vue')
        },
        {
            path: 'design',
            meta: {
                title: '视觉作品数量记录'
            },
            name: 'design',
            component: () => import('@/views/design/design.vue')
        },
        {
            path: 'design/tag',
            meta: {
                title: '视觉作品数量记录'
            },
            name: 'design-tag',
            component: () => import('@/views/design/tag.vue')
        },
        {
            path: 'design/show',
            meta: {
                title: '视觉作品数量记录'
            },
            name: 'design-show',
            component: () => import('@/views/design/show.vue')
        },
        {
            path: 'task/add',
            meta: {
                title: '任务管理'
            },
            name: 'task-add',
            component: () => import('@/views/task/add.vue')
        },
        {
            path: 'task/zt',
            meta: {
                title: '任务管理'
            },
            name: 'task-zt',
            component: () => import('@/views/task/zt.vue')
        },
        {
            path: 'task/guidang',
            meta: {
                title: '任务管理'
            },
            name: 'task-guidang',
            component: () => import('@/views/task/guidang.vue')
        },
        // {
        //     path: 'task/tongji',
        //     meta: {
        //         title: '任务管理'
        //     },
        //     name: 'task-tongji',
        //     component: () => import('@/views/task/tongji.vue')
        // },
        {
            path: 'tasklist/config',
            meta: {
                title: '任务清单管理'
            },
            name: 'tasklist-config',
            component: () => import('@/views/tasklist/config.vue')
        },
        {
            path: 'tasklist/list',
            meta: {
                title: '任务清单管理'
            },
            name: 'tasklist-list',
            component: () => import('@/views/tasklist/list.vue')
        },
        {
            path: 'tasklist/add',
            meta: {
                title: '任务清单管理'
            },
            name: 'tasklist-add',
            component: () => import('@/views/tasklist/add.vue')
        },
        {
            path: 'tasklist/show',
            meta: {
                title: '任务清单管理'
            },
            name: 'tasklist-show',
            component: () => import('@/views/tasklist/show.vue')
        },
        {
            path: 'zlk/sjml',
            meta: {
                title: '资料库'
            },
            name: 'zlk-sjml',
            component: () => import('@/views/zlk/menu-sj.vue')
        },
        {
            path: 'zlk/qdml',
            meta: {
                title: '资料库'
            },
            name: 'zlk-qdml',
            component: () => import('@/views/zlk/menu-qd.vue')
        },
        {
            path: 'zlk/sjlist',
            meta: {
                title: '资料库'
            },
            name: 'zlk-sjlist',
            component: () => import('@/views/zlk/list-sj.vue')
        },
        {
            path: 'zlk/qdlist',
            meta: {
                title: '资料库'
            },
            name: 'zlk-qdlist',
            component: () => import('@/views/zlk/list-qd.vue')
        },
        {
            path: 'zlk/qdadd',
            meta: {
                title: '资料库'
            },
            name: 'zlk-qd-add',
            component: () => import('@/views/zlk/add-qd.vue')
        },
        {
            path: 'zlk/sjadd',
            meta: {
                title: '资料库'
            },
            name: 'zlk-sj-add',
            component: () => import('@/views/zlk/add-sj.vue')
        },
        {
            path: 'summary/add',
            meta: {
                title: '月总结'
            },
            name: 'summary-add',
            component: () => import('@/views/month/add.vue')
        },
        {
            path: 'summary/list',
            meta: {
                title: '月总结'
            },
            name: 'summary-list',
            component: () => import('@/views/month/list.vue')
        },
        {
            path: 'summary/show',
            meta: {
                title: '月总结'
            },
            name: 'summary-show',
            component: () => import('@/views/month/show.vue')
        },
        // {
        //     path: 'image/add',
        //     meta: {
        //         title: '图片'
        //     },
        //     name: 'image-add',
        //     component: () => import('@/views/image/add.vue')
        // },
        // {
        //     path: 'image/list',
        //     meta: {
        //         title: '图片'
        //     },
        //     name: 'image-list',
        //     component: () => import('@/views/image/list.vue')
        // }
    ]
};

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    registRouter,
    registResult,
    appRouter,
    page500,
    page403,
    doc
];
