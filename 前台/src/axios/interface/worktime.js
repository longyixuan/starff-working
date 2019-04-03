/*
 * @Author: yinxl 
 * @Date: 2019-03-26 14:18:39 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-28 14:08:48
 */

import axios from './../api'

const getWorktime = data => {
  return axios({
    url: '/getTimeList',
    method: 'post',
    data
  })
}
const setWorktime = data => {
    return axios({
        url: '/postTime',
        method: 'post',
        data
    })
}
export default {
    getWorktime,
    setWorktime
}