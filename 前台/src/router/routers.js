export default [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index') 
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index'),
        children: [
        {
            path: '/home',
            redirect: '/home/mine'
        },
        {
            path: '/home/worktime',
            name: 'worktime',
            component: () => import('@/views/worktime/index'),
        },
        {
            path: '/home/system',
            name: 'system',
            component: () => import('@/views/system/index'),
        },
        {
            path: '/home/substitute',
            name: 'substitute',
            component: () => import('@/views/substitute/index'),
        },
        {
            path: '/home/publish',
            name: 'publish',
            component: () => import('@/views/publish/index'),
        },
        {
            path: '/home/course',
            name: 'course',
            component: () => import('@/views/course/index'),
        },
        {
            path: '/home/mine',
            name: 'mine',
            component: () => import('@/views/mine/index'),
        }
        ]
    } 
]