import Cookies from 'js-cookie'

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
    Cookies.set(TOKEN_KEY, token, { expires: 1 })
}

export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY)
    if (token) return token
    else return false
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
    const routePermissionJudge = (list) => {
      return list.some(item => {
        if (item.children && item.children.length) {
          return routePermissionJudge(item.children)
        } else if (item.name === name) {
          return hasAccess(access, item)
        }
      })
    }
  
    return routePermissionJudge(routes)
  }