import {
    removeStore
} from '@/libs/storage'

import {
    getRole
  } from "@/api/index";

const user = {
    state: {
        qd: [],
        userListQd: [],
        sj: [],
        userListSj: []
    },
    mutations: {
        logout (state, vm) {
            removeStore('userInfo');
            localStorage.clear();
        },
        setRole(states, data) {
            console.log(states);
            let qd = [];
            let sj = [];
            let userListQd = [];
            let userListSj = [];
            data.forEach(element => {
                if (element.role == 'qd') {
                    element.list.forEach(ele => {
                        qd.push(ele.nickName);
                        userListQd.push(ele.userName);
                    });
                }
                if (element.role == 'sj') {
                    element.list.forEach(ele => {
                        sj.push(ele.nickName);
                        userListSj.push(ele.userName);
                    });
                }
            });
            states.qd = qd;
            states.sj = sj;
            states.userListQd = userListQd;
            states.userListSj = userListSj;
        }
    },
    actions: {
        getRole: ({ commit }) => {
            return getRole().then( ({data}) => {
                commit('setRole', data);
            }).catch(err => {})
        },
    }
};

export default user;
