// 统一请求路径前缀在libs/axios.js中修改
import {
    getRequest,
    postRequest,
    deleteRequest
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
    return getRequest('/user/userSystem', params)
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
//-----------------------工时管理--------------------------------//