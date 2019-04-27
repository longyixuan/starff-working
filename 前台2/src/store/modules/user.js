import Cookies from 'js-cookie';

const user = {
    state: {},
    mutations: {
        logout (state, vm) {
            Cookies.remove('userInfo');
            localStorage.clear();
        }
    }
};

export default user;
