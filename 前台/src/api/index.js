// 统一请求路径前缀在libs/axios.js中修改
import {
    getRequest,
    postRequest,
    deleteRequest,
    uploadFileRequest
} from '@/libs/axios';

// 文件上传接口
export const uploadFile = "/upload/file"

export const uploadImage = "/upload/image"

export const imageAdd = (params) => {
    return uploadFileRequest(`/upload/image`,params)
}

export const imageList = (params) => {
    return postRequest(`/upload/imagelist`,params)
}

// 登陆
export const login = (params) => {
    return postRequest('/login', params)
}
// 获取用户登录信息
export const userInfo = (params) => {
    return getRequest('/user/info', params)
}
// 注册
export const regist = (params) => {
    return postRequest('/regist', params)
}
// 个人中心编辑
export const userInfoEdit = (params) => {
    return postRequest('/user/edit', params)
}

//-----------------------部门管理--------------------------------//
// 获取一级部门
export const initDepartment = (params) => {
    return getRequest('/department/getByParentId/0', params)
}
// 加载部门子级数据
export const loadDepartment = (id, params) => {
    return getRequest(`/department/getByParentId/${id}`, params)
}
// 通过部门获取全部用户数据
export const getUserByDepartmentId = (id, params) => {
    return getRequest(`/user/getByDepartmentId/${id}`, params)
}
// 添加部门
export const addDepartment = (params) => {
    return postRequest('/department/add', params)
}
// 编辑部门
export const editDepartment = (params) => {
    return postRequest('/department/edit', params)
}
// 删除部门
export const deleteDepartment = (ids, params) => {
    return deleteRequest(`/department/delByIds/${ids}`, params)
}
// 搜索部门
export const searchDepartment = (params) => {
    return getRequest('/department/search', params)
}
//-----------------------部门管理--------------------------------//

//-----------------------用户管理--------------------------------//
// 获取用户数据 多条件
export const getUserListData = (params) => {
    return getRequest('/user/getByCondition', params)
}
// 获取全部用户数据
export const getAllUserData = (params) => {
    return getRequest('/user/getAllUser', params)
}
// 添加用户
export const addUser = (params) => {
    return postRequest('/user/admin/add', params)
}
// 编辑用户
export const editUser = (params) => {
    return postRequest('/user/admin/edit', params)
}
// 启用用户
export const enableUser = (id, params) => {
    return postRequest(`/user/admin/enable/${id}`, params)
}
// 禁用用户
export const disableUser = (id, params) => {
    return postRequest(`/user/admin/disable/${id}`, params)
}
// 删除用户
export const deleteUser = (ids, params) => {
    return deleteRequest(`/user/delByIds/${ids}`, params)
}
//重置用户密码
export const resetPassword = (params) => {
    return postRequest('/user/admin/resetPassword', params)
}

// 修改密码

export const editPassword = (params) => {
    return postRequest('/user/editPassword', params)
}

//-----------------------用户管理--------------------------------//

//-----------------------系统管理--------------------------------//
export const initSystem = (params) => {
    return getRequest('/system/getByParentId/0', params)
}
export const loadSystem = (id, params) => {
    return getRequest(`/system/getByParentId/${id}`, params)
}
export const getUserBySystemId = (id, params) => {
    return getRequest(`/user/getBySystemId/${id}`, params)
}
export const addSystem = (params) => {
    return postRequest('/system/add', params)
}
export const editSystem = (params) => {
    return postRequest('/system/edit', params)
}
export const deleteSystem = (ids, params) => {
    return deleteRequest(`/system/delByIds/${ids}`, params)
}
export const searchSystem = (params) => {
    return getRequest('/system/search', params)
}
export const getSystemList = (params) => {
    return getRequest('/system/getAllList', params)
}
export const getSystemCount = (params) => {
    return postRequest('/user/userSystem', params)
}
export const getSystemTree = (params) => {
    return getRequest('/system/systemTree', params)
}
//-----------------------系统管理--------------------------------//

//-----------------------角色管理--------------------------------//
// export const addRole = (params) => {
//     return postRequest('/role/add', params)
// }
//-----------------------角色管理--------------------------------//

//-----------------------工时管理--------------------------------//
//工时记录
export const getTimeList = (params) => {
    return postRequest('/time/getTimeList', params)
}
export const postTime = (params) => {
    return postRequest('/time/postTime', params)
}
export const workTimeCount = (params) => {
    return getRequest('/time/workTimeCount', params)
}
export const getCountTime = (params) => {
    return postRequest('/time/workTimeSeach', params)
}
export const getMapTime = (params) => {
    return postRequest('/time/getMapTime', params)
}
export const resetTime = (params) => {
    return getRequest('/time/resetTime', params)
}
export const exportTime = (params) => {
    return getRequest('/exportTime', params)
}
export const installTime = (params) => {
    return getRequest('/installTime', params)
}

export const checkTime = (params) => {
    return postRequest('/time/check', params)
}

export const checkWeekTime = (params) => {
    return postRequest('/time/weekcheck', params)
}

//-----------------------工时管理--------------------------------//
//-----------------------工作总结--------------------------------//
export const addDocument = (params) => {
    return postRequest('/document/add', params)
}
export const getDocumentList = (params) => {
    return getRequest('/document/list', params)
}
export const getDocumentListall = (params) => {
    return getRequest('/document/listALL',params)
}
// export const commitDocument = (params) => {
//     return postRequest('/document/commit', params)
// }
export const getDocumentDetails = (ids,params) => {
    return getRequest(`/document/details/${ids}`, params)
}
export const delDocument = (ids, params) => {
    return deleteRequest(`/document/del/${ids}`, params)
}
export const resetDocument = (ids, params) => {
    return getRequest(`/document/reset/${ids}`, params)
}
//--------------------模板--------------------------//
export const addTemplate = (params) => {
    return postRequest('/template/add', params)
}
export const getTemplateList = (params) => {
    return getRequest('/template/list', params)
}
export const getTemplateDetails = (ids,params) => {
    return getRequest(`/template/details/${ids}`, params)
}
export const delTemplate = (ids, params) => {
    return deleteRequest(`/template/del/${ids}`, params)
}
export const commitTemplate = (params) => {
    return postRequest('/template/commit', params)
}
export const mergeTemplate = (params) => {
    return postRequest('/template/merge', params)
}
export const getTemplateListall = (params) => {
    return getRequest('/template/listALL',params)
}
export const resetTemplate = (ids, params) => {
    return getRequest(`/template/reset/${ids}`, params)
}

//-------------------日总结--------------------------//
export const addDocumentday = (type,params) => {
    return postRequest(`/document/${type}/add`, params)
}
export const editDocumentday = (type,params) => {
    return postRequest(`/document/${type}/edit`, params)
}
export const delteDocumentday = (type,params) => {
    return postRequest(`/document/${type}/del`,params)
}
export const detailsDocumentday = (type,params) => {
    return getRequest(`/document/${type}/details`, params)
}
export const listDocumentday = (type,params) => {
    return getRequest(`/document/${type}/list`,params)
}
export const mergeDocumentday = (type,params) => {
    return postRequest(`/document/${type}/merge`,params)
}
export const seachDocumentday = (params) => {
    return postRequest(`/document/seach`,params)
}
export const commitDocument = (params) => {
    return postRequest(`/document/commit`,params)
}
export const seachModal = (params) => {
    return getRequest(`/modal/seach`,params)
}
export const addModal = (params) => {
    return postRequest(`/modal/add`,params)
}
//------------------周总结-------------------------------//
export const toDocumentweek = (params) => {
    return postRequest(`/document/day/toweek`, params)
}
export const commitDocumentWeek = (params) => {
    return postRequest(`/document/week/commit`,params)
}
export const seachDocumentweek = (params) => {
    return postRequest(`/document/week/seach`,params)
}
export const downDocument = (params) => {
    return postRequest(`/download/document`,params)
}
//--------------------月总结---------------------//
export const toDocumentmonth = (params) => {
    return postRequest(`/document/week/tomonth`, params)
}
export const commitDocumentMonth = (params) => {
    return postRequest(`/document/month/commit`,params)
}
export const seachDocumentmonth = (params) => {
    return postRequest(`/document/month/seach`,params)
}

//--------------------月总结md---------------------//

export const mdMonthList = (params) => {
    return postRequest(`/document/mdmonth/list`, params)
}
export const mdMonthEdit = (params) => {
    return postRequest(`/document/mdmonth/edit`,params)
}
export const mdMonthAdd = (params) => {
    return postRequest(`/document/mdmonth/add`,params)
}
export const mdMonthDetails = (params) => {
    return postRequest(`/document/mdmonth/details`, params)
}
export const mdMonthCommit = (params) => {
    return postRequest(`/document/mdmonth/commit`,params)
}
export const mdMonthDel = (params) => {
    return postRequest(`/document/mdmonth/del`,params)
}
export const mdMonthCallback = (params) => {
    return postRequest(`/document/mdmonth/callback`,params)
}

export const mdMonthSearch = (params) => {
    return postRequest(`/document/mdmonth/search`,params)
}




//--------------------回复---------------------//
export const replayAdd = (params) => {
    return postRequest(`/replay/add`,params)
}
export const replayUpdate = (params) => {
    return postRequest(`/replay/update`,params)
}
export const replayList = (params) => {
    return postRequest(`/replay/getList`,params)
}


//--------------------退回---------------------//
export const callbackDocument = (params) => {
    return postRequest(`/document/callback`,params)
}
export const returnDocument = (params) => {
    return postRequest(`/return/add`,params)
}
//-----------------------工作总结--------------------------------//

//-----------------------系统时间线--------------------------------//
export const addTimeline = (params) => {
    return postRequest(`/timeline/add`,params)
}

export const editTimeline = (params) => {
    return postRequest(`/timeline/update`,params)
}

export const getTimelineList = (params) => {
    return postRequest(`/timeline/list`,params)
}

export const getTimelineDetail = (params) => {
    return postRequest(`/timeline/detail`,params)
}

export const delTimeline = (params) => {
    return postRequest(`/timeline/delete`,params)
}

export const lockTimeline = (params) => {
    return postRequest(`/timeline/lock`,params)
}

//-----------------------系统时间线--------------------------------//

//-----------------------系统同步时间线--------------------------------//
export const addSysTimeline = (params) => {
    return postRequest(`/systimeline/add`,params)
}

export const editSysTimeline = (params) => {
    return postRequest(`/systimeline/update`,params)
}

export const getSysTimelineList = (params) => {
    return postRequest(`/systimeline/list`,params)
}

export const getSysTimelineDetail = (params) => {
    return postRequest(`/systimeline/detail`,params)
}

export const delSysTimeline = (params) => {
    return postRequest(`/systimeline/delete`,params)
}

export const backSysTimeline = (params) => { //退回
    return postRequest(`/systimeline/back`,params)
}

export const commitSysTimeline = (params) => { //提交
    return postRequest(`/systimeline/commit`,params)
}

export const applySysTimeline = (params) => { //同意
    return postRequest(`/systimeline/apply`,params)
}


//-----------------------系统同步时间线--------------------------------//

//-----------------------jira完成情况--------------------------------//
export const addJira = (params) => {
    return postRequest(`/jira/add`,params)
}

export const editJira = (params) => {
    return postRequest(`/jira/update`,params)
}

export const getJiraList = (params) => {
    return postRequest(`/jira/list`,params)
}

export const getJiraDetail = (type,params) => {
    return postRequest(`/jira/detail/${type}`,params)
}


export const delJira = (params) => {
    return postRequest(`/jira/delete`,params)
}

//-----------------------jira完成情况--------------------------------//

//-----------------------标签--------------------------------//
export const addTag = (params) => {
    return postRequest(`/tag/add`,params)
}

export const editTag = (params) => {
    return postRequest(`/tag/update`,params)
}

export const getTagList = (params) => {
    return postRequest(`/tag/list`,params)
}

export const delTag = (params) => {
    return postRequest(`/tag/delete`,params)
}
//-----------------------标签--------------------------------//


//-----------------------模块--------------------------------//
export const addModel = (params) => {
    return postRequest(`/sysmodel/add`,params)
}
export const updateModel = (params) => {
    return postRequest(`/sysmodel/update`,params)
}
export const deleteModel = (params) => {
    return postRequest(`/sysmodel/delete`,params)
}

export const listModel = (params) => {
    return postRequest(`/sysmodel/list`,params)
}

export const refreshModel = (params) => {
    return postRequest(`/sysmodel/refresh`,params)
}

export const mergeModel = (params) => {
    return postRequest(`/sysmodel/merge`,params)
}

//-----------------------模块--------------------------------//

//-----------------------系统同步记录--------------------------------//
export const addAws = (params) => {
    return postRequest(`/aws/add`,params)
}
export const listAws = (params) => {
    return postRequest(`/aws/list`,params)
}
export const updateAws = (params) => {
    return postRequest(`/aws/update`,params)
}
export const deleteAws = (params) => {
    return postRequest(`/aws/delete`,params)
}
export const detailAws= (params) => {
    return postRequest(`/aws/detail`,params)
}
//-----------------------系统同步记录--------------------------------//

//-----------------------个人工时控制台--------------------------------//

export const personalCount = (params) => {
    return postRequest(`/personal/console`,params)
}

export const workingCheck = (params) => {
    return postRequest(`/working/check`,params)
}

export const todayTime = (params) => {
    return postRequest(`/time/today`,params)
}

//-----------------------个人工时控制台--------------------------------//


//-----------------------投票--------------------------------//
export const addVote = (params) => {
    return postRequest(`/vote/add`,params)
}
export const editVote = (params) => {
    return postRequest(`/vote/update`,params)
}
export const delVote = (params) => {
    return postRequest(`/vote/delete`,params)
}

export const getVoteList = (params) => {
    return postRequest(`/vote/list`,params)
}

export const addSurvey = (params) => {
    return postRequest(`/survey/add`,params)
}

export const editSurvey = (params) => {
    return postRequest(`/survey/update`,params)
}

export const delSurvey = (params) => {
    return postRequest(`/survey/delete`,params)
}

export const detailSurvey = (id) => {
    return postRequest(`/survey/detail/${id}`)
}

export const getSurveyList = (params) => {
    return postRequest(`/survey/list`,params)
}

export const submitSurvey = (params) => {
    return postRequest(`/survey/submit`,params)
}

export const countSurvey = (params) => {
    return postRequest(`/survey/count`,params)
}

export const countSurveyOne = (params) => {
    return postRequest(`/survey/countone`,params)
}

export const getSurveyListMy = (params) => {
    return postRequest(`/survey/mylist`,params)
}

export const countSurveyMy = (params) => {
    return postRequest(`/survey/mycount`,params)
}

//-----------------------投票--------------------------------//

//-----------------------视觉作品数量记录--------------------------------//
export const addDesignTag = (params) => {
    return postRequest(`/design/tag/add`,params)
}

export const editDesignTag = (params) => {
    return postRequest(`/design/update`,params)
}
export const delDesignTag = (params) => {
    return postRequest(`/design/delete`,params)
}

export const listDesignTag = (params) => {
    return postRequest(`/design/tag/list`,params)
}

export const addDesign = (params) => {
    return postRequest(`/design/add`,params)
}

export const detailDesign = (params) => {
    return postRequest(`/design/detail`,params)
}

export const allDesign = (params) => {
    return postRequest(`/design/all`,params)
}

//-----------------------视觉作品数量记录--------------------------------//


//-----------------------系统及维护人--------------------------------//
export const addTagFzxt = (params) => {
    return postRequest(`/fzxt/tag/add`,params)
}

export const editTagFzxt = (params) => {
    return postRequest(`/fzxt/tag/update`,params)
}

export const getTagListFzxt = (params) => {
    return postRequest(`/fzxt/tag/list`,params)
}

export const delTagFzxt = (params) => {
    return postRequest(`/fzxt/tag/delete`,params)
}
export const addFzxt = (params) => {
    return postRequest(`/fzxt/add`,params)
}
export const editFzxt = (params) => {
    return postRequest(`/fzxt/update`,params)
}
export const delFzxt = (params) => {
    return postRequest(`/fzxt/del`,params)
}
export const listFzxt = (params) => {
    return postRequest(`/fzxt/list`,params)
}

//-----------------------系统及维护人--------------------------------//


//-----------------------任务管理--------------------------------//

export const addTaskTag = (params) => {
    return postRequest(`/task/zt/add`,params)
}

export const editTaskTag = (params) => {
    return postRequest(`/task/zt/edit`,params)
}

export const getTaskTagList = (params) => {
    return postRequest(`/task/zt/list`,params)
}

export const delTaskTag = (params) => {
    return postRequest(`/task/zt/del`,params)
}

export const addTask = (params) => {
    return postRequest(`/task/add`,params)
}

export const updateTask = (params) => {
    return postRequest(`/task/edit`,params)
}

export const delTask = (params) => {
    return postRequest(`/task/remove`,params)
}

export const listTask = (params) => {
    return postRequest(`/task/list`,params)
}

export const listTaskC = (params) => {
    return postRequest(`/task/listc`,params)
}

export const logTask = (params) => {
    return postRequest(`/task/log`,params)
}

export const daylogTask = (params) => {
    return postRequest(`/task/daylog`,params)
}

export const hisTask = (params) => {
    return postRequest(`/task/history`,params)
}

export const checkTask = (params) => {
    return postRequest(`/task/check`,params)
}

export const tongji = (params) => {
    return postRequest(`/task/tongji`,params)
}

//-----------------------任务管理--------------------------------//


//-----------------------任务清单管理--------------------------------//

export const addTaskConfig = (params) => {
    return postRequest(`/tasklist/config/add`,params)
}

export const editTaskConfig = (params) => {
    return postRequest(`/tasklist/config/edit`,params)
}

export const getTaskConfigList = (params) => {
    return postRequest(`/tasklist/config/list`,params)
}

export const delTaskConfig = (params) => {
    return postRequest(`/tasklist/config/del`,params)
}

export const addTasklist = (params) => {
    return postRequest(`/tasklist/add`,params)
}

export const editTasklist = (params) => {
    return postRequest(`/tasklist/edit`,params)
}

export const getTaskDetail = (params) => {
    return postRequest(`/tasklist/detail`,params)
}

export const getTaskList = (params) => {
    return postRequest(`/tasklist/list`,params)
}

export const removeTask = (params) => {
    return postRequest(`/tasklist/del`,params)
}

//-----------------------任务清单管理--------------------------------//
//-----------------------资料库--------------------------------//
export const addZlkType = (params) => {
    return postRequest(`/mdtype/add`,params)
}

export const editZlkType = (params) => {
    return postRequest(`/mdtype/update`,params)
}

export const listZlkType = (params) => {
    return postRequest(`/mdtype/list`,params)
}

export const delZlkType = (params) => {
    return postRequest(`/mdtype/del`,params)
}

export const mdAdd = (params) => {
    return postRequest(`/md/add`,params)
}

export const mdUpdata = (params) => {
    return postRequest(`/md/update`,params)
}

export const mdList = (params) => {
    return postRequest(`/md/list`,params)
}

export const mdDetail = (params) => {
    return postRequest(`/md/detail`,params)
}

export const mdShow = (params) => {
    return postRequest(`/md/show`,params)
}

export const mdLog = (params) => {
    return postRequest(`/md/log`,params)
}

export const mdDownload = (params) => {
    return postRequest(`/md/download`,params)
}
//-----------------------资料库--------------------------------//


//-----------------------图标库--------------------------------//

export const uploadIcon = (params) => {
    return uploadFileRequest(`/icon/upload`,params)
}

export const iconAdd = (params) => {
    return postRequest(`/icon/add`,params)
}

export const iconEdit = (params) => {
    return postRequest(`/icon/edit`,params)
}

export const iconSearch = (params) => {
    return postRequest(`/icon/search`,params)
}

export const iconDel = (params) => {
    return postRequest(`/icon/del`,params)
}

export const iconList = (params) => {
    return postRequest(`/icon/list`,params)
}


export const addIconTag = (params) => {
    return postRequest(`/icon/tag/add`,params)
}

export const editIconTag = (params) => {
    return postRequest(`/icon/tag/edit`,params)
}

export const getIconTagList = (params) => {
    return postRequest(`/icon/tag/list`,params)
}

export const delIconTag = (params) => {
    return postRequest(`/icon/tag/del`,params)
}

//-----------------------图标库--------------------------------//

export const getRole = (params) => {
    return getRequest(`/user/getRole`,params)
}

//-----------------------监控平台维护人--------------------------------//
export const addTagJkpt = (params) => {
    return postRequest(`/jkpt/tag/add`,params)
}

export const editTagJkpt = (params) => {
    return postRequest(`/jkpt/tag/update`,params)
}

export const getTagListJkpt = (params) => {
    return postRequest(`/jkpt/tag/list`,params)
}

export const delTagJkpt = (params) => {
    return postRequest(`/jkpt/tag/delete`,params)
}
export const addJkpt = (params) => {
    return postRequest(`/jkpt/add`,params)
}
export const editJkpt = (params) => {
    return postRequest(`/jkpt/update`,params)
}
export const delJkpt = (params) => {
    return postRequest(`/jkpt/del`,params)
}
export const listJkpt = (params) => {
    return postRequest(`/jkpt/list`,params)
}

//-----------------------监控平台维护人--------------------------------//