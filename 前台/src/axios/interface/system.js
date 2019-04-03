/*
 * @Author: yinxl 
 * @Date: 2019-03-26 14:18:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-28 13:54:27
 */

import axios from './../api'

const getSystemList = data => {
  return axios({
    url: '/systemList',
    method: 'post',
    data
  })
}
const setSystem = data => {
    return axios({
        url: '/system',
        method: 'post',
        data
    })
}
export default {
    getSystemList,
    setSystem
}