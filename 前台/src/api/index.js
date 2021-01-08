// 统一请求路径前缀在libs/axios.js中修改
import {
    getRequest,
    postRequest,
    deleteRequest,
    uploadFileRequest
} from '@/libs/axios';

// 文件上传接口
export const uploadFile = "/upload/file"

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
    console.log(params)
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

//-----------------------系统时间线--------------------------------//
