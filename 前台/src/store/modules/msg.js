import {
    replayList,
    replayUpdate
  } from "@/api/index";
const app = {
    state: {
        ydxx: [],
        wdxx: []
    },
    mutations: {
        setMsgList (states, data) {
            states.ydxx = data.ydxx;
            states.wdxx = data.wdxx;
        },
    },
    actions: {
        getMsgList: ({ commit }) => {
            return replayList({sjrId: JSON.parse(localStorage.getItem('userInfo')).userId}).then( ({data}) => {
                commit('setMsgList', data);
            }).catch(err => {})
        },
        replayUpdateMsg: ({dispatch},{id}) => {
            replayUpdate({id}).then( res =>{
                dispatch('getMsgList');
            });
        }
    }
};

export default app;