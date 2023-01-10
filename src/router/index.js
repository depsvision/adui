import {createRouter, createWebHashHistory}  from 'vue-router'


import HomePage from '@/views/Home/homePage.vue'
/* Router Modules */

/**
 *
 * hidden: true                   if set true, item will not show in the asidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    role: ['console']             the role decide page show or hide
    title: 'title'                the name show in asidebar
    icon: 'svg-name'/'el-icon-x'  the icon show in the asidebar
    level: 1                      directions level
    root: true                    has root page or not
    isInside: false               is or not header or aside route
    activeMenu: '/example/list'   if set path, the asidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all role can be accessed
 */
export const constantRoutes = [
    {
        path: '/third',
        name: 'Third',
        meta: { title: '第三方' },
        component: () => import('@/views/Third/index.vue'),
        redirect: '/third/login',
        hidden: true,
        children: [
            {
                path: 'login',
                component: () => import('@/views/Third/Login/index.vue'),
                name: 'ThirdLogin',
                meta: { title: '授权登录' }
            }
        ]
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: () => import('@/views/Login/loginPage.vue'),
        meta: { title: '登录' },
        hidden: true
    },
    {
        path: '/',
        name: 'FirstRoute',
        hidden: true
    }
]

export const resultRoutes = [
    {
        path: '/403',
        component: HomePage,
        children: [
            {
                path: '',
                component: () => import('@/views/Redirect/403/index.vue'),
                name: 'NotAuthority',
                meta: { root: true, role: [] }
            }
        ],
        hidden: true
    },
    {
        path: '/404',
        component: HomePage,
        children: [
            {
                path: '',
                component: () => import('@/views/Redirect/404/index.vue'),
                name: 'NotFound',
                meta: { root: true, role: [] }
            }
        ],
        hidden: true
    }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user role
 */
export const asyncRoutes = [
    {
        path: '/console',
        component: HomePage,
        meta: { role: ['console'], title: '控制台' },
        children: [
            {
                path: '',
                component: () => import('/src/components/NavMenuPage/Console/Console'),
                name: 'Console',
                meta: { root: true, role: ['console'], title: '控制台' }
            }
        ]
    },
    {
        path: '/basic-services',
        component: HomePage,
        meta: { role: ['node', 'camera', 'record', 'user', 'role', 'license'], title: '基础服务' },
        redirect: '/basic-services/device-service/calculate-node',
        children: [
            {
                path: 'device-service',
                // component: () => import('/src/components/Transition/RouteTransition/'),
                name: 'DeviceService',
                meta: { role: ['node', 'camera', 'record'], title: '设备与服务', svgIcon: 'device-service' },
                children: [
                    {
                        path: 'calculate-node',
                        component: () => import('/src/components/NavMenuPage/BasicServices/CalculateNode'),
                        name: 'CalculateNode',
                        meta: { role: ['node'], title: '智能计算节点' }
                    },
                    {
                        path: 'monitor-point',
                        component: () => import('@/components/NavMenuPage/BasicServices/MonitorPoint/index'),
                        name: 'MonitorPoint',
                        meta: { role: ['camera'], title: '监控输入设备' }
                    },
                    {
                        path: 'video-recording',
                        component: () => import('@/components/NavMenuPage/BasicServices/VideoRecording/index.vue'),
                        name: 'VideoRecording',
                        meta: { role: ['record'], title: '视频录制' }
                    }
                ]
            },
            {
                path: 'operating-environment',
                component: () => import('@/components/Transition/RouteTransition/index.vue'),
                name: 'OperatingEnvironment',
                meta: { role: ['license'], title: '运行环境', svgIcon: 'operating-environment' },
                children: [
                    {
                        path: 'cloud-collaboration',
                        component: () => import('@/components/NavMenuPage/BasicServices/CloudCollaboration/index.vue'),
                        name: 'CloudCollaboration',
                        meta: { role: [], title: '云边协同' }
                    }
                    // {
                    //   path: 'license-manage',
                    //   component: () => import('@/components/NavMenuPage/BasicServices/LicenseManage/index'),
                    //   name: 'LicenseManage',
                    //   meta: { role: ['license'], title: 'License 管理' }
                    // }
                ]
            },
            {
                path: 'user-authority',
                component: () => import('@/components/Transition/RouteTransition/index'),
                name: 'UserAuthority',
                meta: { role: ['user', 'role'], title: '用户及权限', svgIcon: 'user-authority' },
                children: [
                    {
                        path: 'user-manage',
                        component: () => import('@/components/NavMenuPage/BasicServices/UserManage/index.vue'),
                        name: 'UserManage',
                        meta: { role: ['user'], title: '用户管理' }
                    },
                    {
                        path: 'role-manage',
                        component: () => import('@/components/NavMenuPage/BasicServices/RoleManage/index.vue'),
                        name: 'RoleManage',
                        meta: { role: ['role'], title: '角色管理' }
                    }
                ]
            }
        ]
    },
    {
        path: '/algorithm-dispatch',
        component: HomePage,
        meta: { role: ['task', 'imageTask', 'linkage', 'material', 'log', 'alert'], title: '算法调度' },
        redirect: '/algorithm-dispatch/schedule-tasks/video-stream-analysis',
        children: [
            {
                path: 'pre-scheduling',
                component: () => import('@/components/Transition/RouteTransition/index.vue'),
                name: 'PreScheduling',
                meta: { role: ['material'], title: '调度前处理', svgIcon: 'pre-scheduling' },
                children: [
                    {
                        path: 'algorithm-enhancement',
                        // component: () => import('@/components/NavMenuPage/AlgorithmDispatch/AlgorithmEnhancement/index.vue'),
                        name: 'AlgorithmEnhancement',
                        meta: { role: ['material'], title: '算法增强' }
                    }
                ]
            },
            {
                path: 'schedule-tasks',
                component: () => import('@/components/Transition/RouteTransition/index.vue'),
                name: 'ScheduleTasks',
                meta: { role: ['task', 'imageTask', 'linkage'], title: '调度任务', svgIcon: 'schedule-tasks' },
                children: [
                    {
                        path: 'video-stream-analysis',
                        component: () => import('@/components/NavMenuPage/AlgorithmDispatch/VideoStreamAnalysis/index.vue'),
                        meta: { role: ['task'], title: '视频流分析' },
                        children: [
                            {
                                path: '',
                                component: () => import('@/components/NavMenuPage/AlgorithmDispatch/VideoStreamAnalysis/default/index.vue'),
                                name: 'VideoStreamAnalysis',
                                meta: { root: true, role: ['task'], title: '视频流分析' }
                            },
                            {
                                path: 'detail',
                                // TODO: 暂时没这个页面s
                                // component: () => import('@/components/NavMenuPage/AlgorithmDispatch/VideoStreamAnalysis/detail/index.vue'),
                                name: 'VideoStreamAnalysisDetail',
                                meta: { role: ['task'], title: '视频流分析详情', isInside: true },
                                notMenu: true
                            }
                        ]
                    },
                    {
                        path: 'picture-analysis',
                        component: () => import('@/components/NavMenuPage/AlgorithmDispatch/PictureAnalysis/index.vue'),
                        meta: { role: ['imageTask'], title: '图片分析' },
                        children: [
                            {
                                path: '',
                                component: () => import('@/components/NavMenuPage/AlgorithmDispatch/PictureAnalysis/default/index.vue'),
                                name: 'PictureAnalysis',
                                meta: { root: true, role: ['imageTask'], title: '图片分析' }
                            },
                            {
                                path: 'detail',
                                // TODO: 暂时忽略这个页面
                                // component: () => import('@/components/NavMenuPage/AlgorithmDispatch/PictureAnalysis/detail/index.vue'),
                                name: 'PictureAnalysisDetail',
                                meta: { role: ['imageTask'], title: '图片分析详情', isInside: true },
                                notMenu: true
                            }
                        ]
                    },
                    {
                        path: 'algorithm-linkage',
                        component: () => import('@/components/NavMenuPage/AlgorithmDispatch/AlgorithmLinkage/index.vue'),
                        meta: { role: ['linkage'], title: '算法联动' },
                        children: [
                            {
                                path: '',
                                component: () => import('@/components/NavMenuPage/AlgorithmDispatch/AlgorithmLinkage/default/index.vue'),
                                name: 'AlgorithmLinkage',
                                meta: { root: true, role: ['linkage'], title: '算法联动' }
                            },
                            {
                                path: 'detail',
                                component: () => import('@/components/NavMenuPage/AlgorithmDispatch/AlgorithmLinkage/detail/index.vue'),
                                name: 'AlgorithmLinkageDetail',
                                meta: { role: ['linkage'], title: '算法联动详情', isInside: true },
                                notMenu: true
                            }
                        ]
                    }
                ]
            },
            {
                path: 'output-result',
                component: () => import('@/components/Transition/RouteTransition/index.vue'),
                name: 'OutputResult',
                meta: { role: ['log', 'alert'], title: '输出结果', svgIcon: 'output-result' },
                children: [
                    {
                        path: 'algorithm-log',
                        component: () => import('@/components/NavMenuPage/AlgorithmDispatch/AlgorithmLog/index.vue'),
                        name: 'AlgorithmLog',
                        meta: { role: ['log'], title: '算法日志' }
                    },
                    {
                        path: 'alarm-voice',
                        component: () => import('@/components/NavMenuPage/AlgorithmDispatch/AlarmVoice/index.vue'),
                        name: 'AlarmVoice',
                        meta: { role: ['alert'], title: '报警语音' }
                    }
                ]
            }
            // {
            //   path: 'file-analysis',
            //   component: () => import('@/components/NavMenuPage/HomeMainPage/index'),
            //   name: 'FileAnalysis',
            //   meta: { role: ['FileAnalysis'], title: '本地文件分析', svgIcon: 'file-analysis' }
            // },
        ]
    },
    {
        path: '/open-ability',
        component: HomePage,
        meta: { role: ['callback', 'callbackLog', 'app', 'oss'], title: '开放能力' },
        redirect: '/open-ability/alarm-push/callback-output',
        children: [
            {

                path: 'alarm-push',
                component: () => import('@/components/Transition/RouteTransition/index.vue'),
                name: 'AlarmPush',
                meta: { role: ['callback', 'callbackLog'], title: '报警推送', svgIcon: 'alarm-push' },
                children: [
                    {
                        path: 'callback-output',
                        // component: () => import('@/components/NavMenuPage/OpenAbility/CallbackOutput/index.vue'),
                        name: 'CallbackOutput',
                        meta: { role: ['callback'], title: 'callback输出' }
                    },
                    {
                        path: 'mail-service',
                        component: () => import('@/components/NavMenuPage/OpenAbility/MailService/index.vue'),
                        name: 'MailService',
                        meta: { role: [], title: '邮件服务' }
                    },
                    {
                        path: 'push-log',
                        // component: () => import('@/components/NavMenuPage/OpenAbility/PushLog/index.vue'),
                        name: 'PushLog',
                        meta: { role: ['callbackLog'], title: '推送日志' }
                    }
                ]
            },
            {
                path: 'external-service',
                component: () => import('@/components/Transition/RouteTransition/index.vue'),
                name: 'ExternalService',
                meta: { role: ['app', 'oss'], title: '外部服务', svgIcon: 'external-service' },
                children: [
                    {
                        path: 'object-storage',
                        component: () => import('@/components/NavMenuPage/OpenAbility/ObjectStorage/index.vue'),
                        name: 'ObjectStorage',
                        meta: { role: ['oss'], title: '对象存储' }
                    },
                    {
                        path: 'app-id',
                        component: () => import('@/components/NavMenuPage/OpenAbility/AppId/index.vue'),
                        name: 'AppId',
                        meta: { role: ['app'], title: '扩展应用' }
                    }
                ]
            }
            // {
            //   path: 'move-map',
            //   component: () => import('@/components/NavMenuPage/OpenAbility/MoveMap/index'),
            //   name: 'MoveMap',
            //   meta: { role: ['app'], title: '移动地图', svgIcon: 'map-fill' }
            // },
            // {
            //   path: 'heat-map',
            //   component: () => import('@/components/NavMenuPage/OpenAbility/HeatMap/index'),
            //   name: 'HeatMap',
            //   meta: { role: ['app'], title: '热力地图', svgIcon: 'map-fill' }
            // }
        ]
    },
    {
        path: '/system-manage',
        component: HomePage,
        meta: { role: ['setting'], title: '系统管理', level: 1 },
        redirect: '/system-manage/user-manage',
        hidden: true,
        children: [
            {
                path: 'system-setting',
                component: () => import('@/components/NavMenuPage/SystemManage/SystemSetting/index.vue'),
                name: 'SystemSetting',
                meta: { role: ['setting'], title: '系统设置', svgIcon: 'system-setting' }
            }
            // {
            //   path: 'system-command',
            //   component: () => import('@/components/NavMenuPage/SystemManage/SystemCommand/index'),
            //   name: 'SystemCommand',
            //   meta: { role: ['systemCommand'], title: '系统指令', svgIcon: 'system-command' }
            // }
        ]
    }

    // 404 page must be placed at the end !!!
    // { path: '*', name: 'NotFount', redirect: '/404', hidden: true }
]


const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior: () => ({ y: 0 }),
    // base: process.env.BASE_URL,
    routes: constantRoutes
})

export function resetRouter() {
    const newRouter = createRouter()
    // reset router
    router.matcher = newRouter.matcher
}

export default router
