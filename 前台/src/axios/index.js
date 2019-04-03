/*
 * @Author: kuangxj 
 * @Email: frankxjkuang@gmail.com 
 * @Date: 2018-04-23 09:24:07 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-03-26 16:18:12
 * @Description: 将 axios 封装成 Vue 的插件使用 
 */

import apiExample from './interface/example'
import apiLogin from './interface/login'
import apiRegister from './interface/register'
import apiPublish from './interface/publish'
import apiSubstitute from './interface/substitute'
import apiMine from './interface/mine'
import apiWorktime from './interface/worktime'
import apiSystem from './interface/system'

const install = Vue => {
    if (install.installed)
        return;
    install.installed = true;

    Object.defineProperties(Vue.prototype, {
        $http: {
            get() {
                // PS: 这里没有区分命名空间
                return Object.assign(
                    {},
                    apiExample,
                    apiRegister, 
                    apiLogin, 
                    apiPublish, 
                    apiSubstitute,
                    apiMine,
                    apiWorktime,
                    apiSystem
                )
                // 如果需要区分命令空间的话可以参考以下写法
                // {
                //     apiLogin,
                //     apiRegister,
                //     apiPublish
                // }
            }
        }
    })
}

export default install