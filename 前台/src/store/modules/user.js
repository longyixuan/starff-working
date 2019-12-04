import {
    removeStore
} from '@/libs/storage'

const user = {
    state: {},
    mutations: {
        logout (state, vm) {
            removeStore('userInfo');
            localStorage.clear();
        }
    }
};

export default user;
