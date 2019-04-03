/*
 * @Author: yinxl 
 * @Date: 2019-04-02 16:35:22 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-02 18:06:07
 */

import { setToken, getToken } from '@/libs/util'

const state = {
  userName: '',
  userId: '',
  token: getToken(),
  access: [],
  hasGetInfo: false
}

// getters
const getters = {
  user: state => state.user
}

// actions
const actions = {
  setUserInfo({ commit }, flag) {
    commit.commit('SET_USER', flag);
  }
}

// mutations
const mutations = {
  // 设置用户信息
  SET_USER: (state, flag) => {
    state.userId = flag.userId;
    state.userName = flag.userName;
    state.access = flag.access;
  },
  // 设置用户信息
  SET_TOKEN: (state, flag) => {
    state.token = flag;
    setToken(flag)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}