(function(e){function t(t){for(var r,c,o=t[0],i=t[1],s=t[2],f=0,d=[];f<o.length;f++)c=o[f],Object.prototype.hasOwnProperty.call(a,c)&&a[c]&&d.push(a[c][0]),a[c]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);l&&l(t);while(d.length)d.shift()();return u.push.apply(u,s||[]),n()}function n(){for(var e,t=0;t<u.length;t++){for(var n=u[t],r=!0,c=1;c<n.length;c++){var o=n[c];0!==a[o]&&(r=!1)}r&&(u.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},c={app:0},a={app:0},u=[];function o(e){return i.p+"js/"+({}[e]||e)+"."+{"chunk-02eb925a":"aaef3144","chunk-110e78aa":"eeb7d576","chunk-1a652a0a":"af795d03","chunk-26aa6fb0":"3be481a8","chunk-114ff224":"322bbcf3","chunk-44b8a9e4":"190121d8","chunk-2bcb77b8":"ca7fd335","chunk-3f690218":"7103b4f6","chunk-13017fa8":"08bd9bb4","chunk-e276cbc0":"bf9dbbbc","chunk-87664c06":"791ab4d8","chunk-ad899418":"cc9d97e9","chunk-b48f5be0":"62a5a1d3","chunk-c7828978":"4196fcab","chunk-c792a1b0":"35bfc799"}[e]+".js"}function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(e){var t=[],n={"chunk-02eb925a":1,"chunk-110e78aa":1,"chunk-1a652a0a":1,"chunk-114ff224":1,"chunk-44b8a9e4":1,"chunk-2bcb77b8":1,"chunk-13017fa8":1,"chunk-e276cbc0":1,"chunk-87664c06":1,"chunk-ad899418":1,"chunk-b48f5be0":1,"chunk-c7828978":1,"chunk-c792a1b0":1};c[e]?t.push(c[e]):0!==c[e]&&n[e]&&t.push(c[e]=new Promise((function(t,n){for(var r="css/"+({}[e]||e)+"."+{"chunk-02eb925a":"dfb0f1b0","chunk-110e78aa":"21043b4f","chunk-1a652a0a":"7c7b0f57","chunk-26aa6fb0":"31d6cfe0","chunk-114ff224":"152584b1","chunk-44b8a9e4":"a1a0bb9d","chunk-2bcb77b8":"13aa984f","chunk-3f690218":"31d6cfe0","chunk-13017fa8":"40e2d17e","chunk-e276cbc0":"a8f93ab5","chunk-87664c06":"25122e0d","chunk-ad899418":"3fa5f5a3","chunk-b48f5be0":"21bb924c","chunk-c7828978":"49fc3261","chunk-c792a1b0":"13aa984f"}[e]+".css",a=i.p+r,u=document.getElementsByTagName("link"),o=0;o<u.length;o++){var s=u[o],f=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(f===r||f===a))return t()}var d=document.getElementsByTagName("style");for(o=0;o<d.length;o++){s=d[o],f=s.getAttribute("data-href");if(f===r||f===a)return t()}var l=document.createElement("link");l.rel="stylesheet",l.type="text/css",l.onload=t,l.onerror=function(t){var r=t&&t.target&&t.target.src||a,u=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");u.code="CSS_CHUNK_LOAD_FAILED",u.request=r,delete c[e],l.parentNode.removeChild(l),n(u)},l.href=a;var m=document.getElementsByTagName("head")[0];m.appendChild(l)})).then((function(){c[e]=0})));var r=a[e];if(0!==r)if(r)t.push(r[2]);else{var u=new Promise((function(t,n){r=a[e]=[t,n]}));t.push(r[2]=u);var s,f=document.createElement("script");f.charset="utf-8",f.timeout=120,i.nc&&f.setAttribute("nonce",i.nc),f.src=o(e);var d=new Error;s=function(t){f.onerror=f.onload=null,clearTimeout(l);var n=a[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),c=t&&t.target&&t.target.src;d.message="Loading chunk "+e+" failed.\n("+r+": "+c+")",d.name="ChunkLoadError",d.type=r,d.request=c,n[1](d)}a[e]=void 0}};var l=setTimeout((function(){s({type:"timeout",target:f})}),12e4);f.onerror=f.onload=s,document.head.appendChild(f)}return Promise.all(t)},i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/",i.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],f=s.push.bind(s);s.push=t,s=s.slice();for(var d=0;d<s.length;d++)t(s[d]);var l=f;u.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var r=n("f3e7"),c=n.n(r);c.a},2096:function(e,t,n){},"365c":function(e,t,n){"use strict";n.d(t,"H",(function(){return c})),n.d(t,"A",(function(){return a})),n.d(t,"I",(function(){return u})),n.d(t,"C",(function(){return o})),n.d(t,"J",(function(){return i})),n.d(t,"v",(function(){return s})),n.d(t,"y",(function(){return f})),n.d(t,"t",(function(){return d})),n.d(t,"a",(function(){return l})),n.d(t,"g",(function(){return m})),n.d(t,"c",(function(){return b})),n.d(t,"F",(function(){return h})),n.d(t,"u",(function(){return p})),n.d(t,"m",(function(){return g})),n.d(t,"j",(function(){return k})),n.d(t,"k",(function(){return v})),n.d(t,"f",(function(){return y})),n.d(t,"e",(function(){return O})),n.d(t,"D",(function(){return j})),n.d(t,"h",(function(){return w})),n.d(t,"w",(function(){return I})),n.d(t,"z",(function(){return S})),n.d(t,"b",(function(){return T})),n.d(t,"i",(function(){return _})),n.d(t,"d",(function(){return P})),n.d(t,"G",(function(){return M})),n.d(t,"q",(function(){return C})),n.d(t,"p",(function(){return x})),n.d(t,"r",(function(){return B})),n.d(t,"s",(function(){return E})),n.d(t,"B",(function(){return L})),n.d(t,"K",(function(){return R})),n.d(t,"n",(function(){return N})),n.d(t,"o",(function(){return $})),n.d(t,"E",(function(){return q})),n.d(t,"l",(function(){return A})),n.d(t,"x",(function(){return J}));var r=n("7f80"),c="/upload/file",a=function(e){return Object(r["c"])("/login",e)},u=function(e){return Object(r["b"])("/user/info",e)},o=function(e){return Object(r["c"])("/regist",e)},i=function(e){return Object(r["c"])("/user/edit",e)},s=function(e){return Object(r["b"])("/department/getByParentId/0",e)},f=function(e,t){return Object(r["b"])("/department/getByParentId/".concat(e),t)},d=function(e,t){return Object(r["b"])("/user/getByDepartmentId/".concat(e),t)},l=function(e){return Object(r["c"])("/department/add",e)},m=function(e){return Object(r["c"])("/department/edit",e)},b=function(e,t){return Object(r["a"])("/department/delByIds/".concat(e),t)},h=function(e){return Object(r["b"])("/department/search",e)},p=function(e){return Object(r["b"])("/user/getByCondition",e)},g=function(e){return Object(r["b"])("/user/getAllUser",e)},k=function(e){return Object(r["c"])("/user/admin/edit",e)},v=function(e,t){return Object(r["c"])("/user/admin/enable/".concat(e),t)},y=function(e,t){return Object(r["c"])("/user/admin/disable/".concat(e),t)},O=function(e,t){return Object(r["a"])("/user/delByIds/".concat(e),t)},j=function(e){return Object(r["c"])("/user/admin/resetPassword",e)},w=function(e){return Object(r["c"])("/user/editPassword",e)},I=function(e){return Object(r["b"])("/system/getByParentId/0",e)},S=function(e,t){return Object(r["b"])("/system/getByParentId/".concat(e),t)},T=function(e){return Object(r["c"])("/system/add",e)},_=function(e){return Object(r["c"])("/system/edit",e)},P=function(e,t){return Object(r["a"])("/system/delByIds/".concat(e),t)},M=function(e){return Object(r["b"])("/system/search",e)},C=function(e){return Object(r["b"])("/system/getAllList",e)},x=function(e){return Object(r["c"])("/user/userSystem",e)},B=function(e){return Object(r["b"])("/system/systemTree",e)},E=function(e){return Object(r["c"])("/time/getTimeList",e)},L=function(e){return Object(r["c"])("/time/postTime",e)},R=function(e){return Object(r["b"])("/time/workTimeCount",e)},N=function(e){return Object(r["c"])("/time/workTimeSeach",e)},$=function(e){return Object(r["c"])("/time/getMapTime",e)},q=function(e){return Object(r["b"])("/time/resetTime",e)},A=function(e){return Object(r["b"])("/exportTime",e)},J=function(e){return Object(r["b"])("/installTime",e)}},"56d7":function(e,t,n){"use strict";n.r(t);n("d602"),n("ccea"),n("2fa0"),n("a553"),n("bada"),n("0b34"),n("ea6e"),n("a9b1"),n("40c5"),n("3c03"),n("8f22"),n("96dd"),n("21fe"),n("2229"),n("9583"),n("bb1d"),n("22299"),n("6fa6"),n("de90"),n("21e8"),n("dd2a"),n("ec87"),n("e0b4"),n("f38e"),n("5098"),n("5009"),n("7834"),n("7cfd"),n("68e0"),n("6fb6"),n("ea79"),n("e9a4"),n("efce"),n("a7e3"),n("1eeb"),n("96e1"),n("0373"),n("3876"),n("c417"),n("c0e9"),n("ac62"),n("5b02"),n("9957"),n("794b"),n("ecab"),n("383f"),n("8f42"),n("8c2e"),n("7781"),n("c11a"),n("87b8"),n("fedd"),n("520f"),n("0e1e"),n("147e"),n("d8e3"),n("e783"),n("f50e"),n("8184"),n("2a67"),n("cf05"),n("5d6f"),n("3d8b"),n("16d9"),n("7ca3"),n("efce0"),n("0bb4"),n("780e"),n("af5b"),n("c87f"),n("3130"),n("8f5b"),n("9425"),n("9ac8"),n("8673"),n("ed8b"),n("9479"),n("4c0b"),n("ccc4"),n("a60a"),n("8b1f"),n("3d31"),n("8a3a"),n("38f2"),n("955a"),n("4445"),n("d807"),n("2b37"),n("a462"),n("dab6"),n("12f4"),n("76ea"),n("317a"),n("e74c"),n("d479"),n("9f7e"),n("ebec"),n("c041"),n("e6d1"),n("db3e"),n("cc1d"),n("8062"),n("6c28"),n("4b5e"),n("e41d"),n("dee1"),n("f807"),n("e419"),n("5484"),n("cb89"),n("fddb"),n("6d85"),n("5879"),n("9c5b"),n("23cc"),n("6c1a"),n("fafd"),n("eb2e"),n("4390"),n("8f07"),n("56d9"),n("6c8d"),n("afb4"),n("02b0"),n("a22b"),n("db63"),n("187a"),n("cb47"),n("ea2a"),n("ba81"),n("08d1"),n("55e8"),n("a9b6"),n("3da4"),n("b105"),n("71cb"),n("0b65"),n("9e94"),n("9ed4"),n("b65a"),n("cd59"),n("b7d5"),n("3e36"),n("4634"),n("63ff");var r=n("6e6d"),c=n("61b5"),a=n.n(c),u=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-main",attrs:{id:"main"}},[n("router-view")],1)},o=[],i={data:function(){return{}},mounted:function(){},beforeDestroy:function(){},methods:{}},s=i,f=(n("034f"),n("4e82")),d=Object(f["a"])(s,u,o,!1,null,null,null),l=d.exports,m=n("a18c"),b=n("08c1"),h=n("e04f"),p=n.n(h),g={state:{menuTheme:"dark",themeColor:""}},k=g,v={state:{},mutations:{logout:function(e,t){p.a.remove("userInfo"),localStorage.clear()}}},y=v;r["default"].use(b["a"]);var O=new b["a"].Store({state:{},mutations:{},actions:{},modules:{app:k,user:y}}),j=O,w=(n("6799"),n("7f80")),I=n("d3ff");r["default"].config.productionTip=!1,r["default"].use(a.a),r["default"].prototype.getRequest=w["b"],r["default"].prototype.postRequest=w["c"],r["default"].prototype.putRequest=w["d"],r["default"].prototype.deleteRequest=w["a"],r["default"].prototype.uploadFileRequest=w["e"],r["default"].prototype.setStore=I["c"],r["default"].prototype.getStore=I["a"],r["default"].prototype.removeStore=I["b"],new r["default"]({el:"#app",router:m["a"],store:j,render:function(e){return e(l)}})},"7f80":function(e,t,n){"use strict";n.d(t,"b",(function(){return d})),n.d(t,"c",(function(){return l})),n.d(t,"d",(function(){return m})),n.d(t,"a",(function(){return b})),n.d(t,"e",(function(){return h}));var r=n("f753"),c=n.n(r),a=n("82c6"),u=n.n(a),o=n("d3ff"),i=n("a18c"),s=n("61b5"),f="http://localhost:3333";c.a.defaults.timeout=15e3,c.a.interceptors.request.use((function(e){return e}),(function(e){return s["Message"].error("请求超时"),Promise.resolve(e)})),c.a.interceptors.response.use((function(e){var t=e.data;switch(t.code){case 401:Object(o["c"])("userInfo",""),Object(o["c"])("accessToken",""),i["a"].push("/login");break;case 403:null!==t.message?s["Message"].error(t.message):s["Message"].error("未知错误");break;case 500:null!==t.message?s["Message"].error(t.message):s["Message"].error("未知错误");break;default:return t}return t}),(function(e){return s["Message"].error(e.toString()),Promise.resolve(e)}));var d=function(e,t){var n=Object(o["a"])("accessToken");return c()({method:"get",url:"".concat(f).concat(e),params:t,headers:{accessToken:n}})},l=function(e,t){var n=Object(o["a"])("accessToken");return c()({method:"post",url:"".concat(f).concat(e),data:t,transformRequest:[function(e){return u.a.stringify(e,{allowDots:!0})}],headers:{"Content-Type":"application/x-www-form-urlencoded",accessToken:n}})},m=function(e,t){var n=Object(o["a"])("accessToken");return c()({method:"put",url:"".concat(f).concat(e),data:t,transformRequest:[function(e){var t="";for(var n in e)t+=encodeURIComponent(n)+"="+encodeURIComponent(e[n])+"&";return t}],headers:{"Content-Type":"application/x-www-form-urlencoded",accessToken:n}})},b=function(e,t){var n=Object(o["a"])("accessToken");return c()({method:"delete",url:"".concat(f).concat(e),params:t,headers:{accessToken:n}})},h=function(e,t){var n=Object(o["a"])("accessToken");return c()({method:"post",url:"".concat(f).concat(e),params:t,headers:{accessToken:n}})}},a18c:function(e,t,n){"use strict";var r=n("6e6d"),c=n("6327"),a=n.n(c),u=n("c478"),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"layout"},[n("Layout",[n("Header",[n("Menu",{attrs:{mode:"horizontal",theme:"dark","active-name":"1"}},[n("div",{staticClass:"layout-logo"},[e._v("员工工时管理系统")]),n("div",{staticClass:"layout-right"},[e._v("\n            "+e._s(e.username)+"\n            "),n("span",{on:{click:function(t){e.modal=!0}}},[e._v("修改密码")]),n("span",{on:{click:e.logout}},[e._v("退出")])])])],1),n("Layout",[n("Sider",{style:{background:"#fff"},attrs:{"hide-trigger":""}},[n("Menu",{attrs:{"active-name":"0",theme:"light",width:"auto"}},[n("MenuItem",{attrs:{name:"0"},nativeOn:{click:function(t){return e.toRoute("home")}}},[n("Icon",{attrs:{type:"md-home"}}),e._v("首页")],1),1===e.type?n("Submenu",{attrs:{name:"1"}},[n("template",{slot:"title"},[n("Icon",{attrs:{type:"md-settings"}}),e._v("系统设置\n            ")],1),n("MenuItem",{attrs:{name:"1-1"},nativeOn:{click:function(t){return e.$router.push("department-manage")}}},[e._v("部门管理")]),n("MenuItem",{attrs:{name:"1-2"},nativeOn:{click:function(t){return e.toRoute("user-manage")}}},[e._v("用户管理")]),n("MenuItem",{attrs:{name:"1-3"},nativeOn:{click:function(t){return e.$router.push("system-manage")}}},[e._v("系统管理")])],2):e._e(),n("Submenu",{attrs:{name:"2"}},[n("template",{slot:"title"},[n("Icon",{attrs:{type:"md-calendar"}}),e._v("我的工时\n            ")],1),n("MenuItem",{attrs:{name:"2-1"},nativeOn:{click:function(t){return e.$router.push("work-time")}}},[e._v("录入")])],2),n("MenuItem",{attrs:{name:"3"},nativeOn:{click:function(t){return e.toRoute("own-space")}}},[n("Icon",{attrs:{type:"md-person"}}),e._v("个人信息")],1)],1)],1),n("Layout",{style:{padding:"24px"}},[n("Content",{style:{minHeight:"280px"}},[n("keep-alive",[n("router-view")],1)],1)],1)],1)],1),n("Back-top",{attrs:{right:10}}),n("Modal",{attrs:{title:"修改密码"},on:{"on-ok":e.editPassword},model:{value:e.modal,callback:function(t){e.modal=t},expression:"modal"}},[n("Input",{attrs:{placeholder:"输入新密码"},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1)],1)},i=[],s=n("365c"),f={data:function(){return{username:"",userId:"",type:"",value:"",modal:!1}},computed:{menuList:function(){return this.$store.state.app.menuList},currentPath:function(){return this.$store.state.app.currentPath},menuTheme:function(){return this.$store.state.app.menuTheme}},methods:{toRoute:function(e){this.$router.push(e)},logout:function(){this.$store.commit("logout",this),location.reload()},editPassword:function(){var e=this;Object(s["h"])({userId:JSON.parse(localStorage.getItem("userInfo")).userId,password:this.value}).then((function(t){1===t.code?e.$Message.success("密码修改成功"):e.$Message.success(t.msg)}))}},mounted:function(){this.username=JSON.parse(localStorage.getItem("userInfo")).userName,this.type=JSON.parse(localStorage.getItem("userInfo")).type}},d=f,l=(n("c0f7"),n("4e82")),m=Object(l["a"])(d,o,i,!1,null,null,null),b=m.exports,h={path:"/login",name:"login",meta:{title:"登录 - 工时系统 "},component:function(){return n.e("chunk-c7828978").then(n.bind(null,"dd7b"))}},p={path:"/regist",name:"regist",meta:{title:"注册 - 工时系统"},component:function(){return n.e("chunk-1a652a0a").then(n.bind(null,"47cd"))}},g={path:"/regist-result",name:"regist-result",meta:{title:"注册结果 - 工时系统"},component:function(){return n.e("chunk-b48f5be0").then(n.bind(null,"6e4c"))}},k={path:"/403",meta:{title:"403-权限不足"},name:"error-403",component:function(){return n.e("chunk-ad899418").then(n.bind(null,"5140"))}},v={path:"/500",meta:{title:"500-服务端错误"},name:"error-500",component:function(){return n.e("chunk-110e78aa").then(n.bind(null,"721c"))}},y={path:"/",name:"appRouter",redirect:"/home",component:b,children:[{path:"home",title:"首页",name:"home_index",component:function(){return Promise.all([n.e("chunk-3f690218"),n.e("chunk-e276cbc0")]).then(n.bind(null,"77b8"))}},{path:"department-manage",title:"部门管理",name:"department-manage",component:function(){return n.e("chunk-c792a1b0").then(n.bind(null,"29fc"))}},{path:"user-manage",title:"用户管理",name:"user-manage",component:function(){return Promise.all([n.e("chunk-26aa6fb0"),n.e("chunk-44b8a9e4")]).then(n.bind(null,"4320"))}},{path:"system-manage",title:"系统管理",name:"system-manage",component:function(){return n.e("chunk-2bcb77b8").then(n.bind(null,"b569"))}},{path:"work-time",title:"我的工时-录入",name:"work-time",component:function(){return n.e("chunk-02eb925a").then(n.bind(null,"6575"))}},{path:"work-time-seach",title:"我的工时-统计",name:"work-time-seach",component:function(){return Promise.all([n.e("chunk-3f690218"),n.e("chunk-13017fa8")]).then(n.bind(null,"05f0"))}},{path:"own-space",title:"个人信息",name:"own-space",component:function(){return Promise.all([n.e("chunk-26aa6fb0"),n.e("chunk-114ff224")]).then(n.bind(null,"4265"))}}]},O=[h,p,g,y,v,k];n.d(t,"a",(function(){return w})),r["default"].use(u["a"]);var j={mode:"history",routes:O},w=new u["a"](j);window.document.title="员工工时管理系统",w.beforeEach((function(e,t,n){a.a.LoadingBar.start(),JSON.parse(localStorage.getItem("userInfo"))||"login"===e.name||"regist"===e.name||"regist-result"===e.name||"relate"===e.name?JSON.parse(localStorage.getItem("userInfo"))&&"login"===e.name?n({name:"home_index"}):n():n({name:"login"})})),w.afterEach((function(e){a.a.LoadingBar.finish(),window.scrollTo(0,0)}))},c0f7:function(e,t,n){"use strict";var r=n("2096"),c=n.n(r);c.a},d3ff:function(e,t,n){"use strict";n.d(t,"c",(function(){return r})),n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return a}));var r=function(e,t){e&&("string"!==typeof t&&(t=JSON.stringify(t)),window.localStorage.setItem(e,t))},c=function(e){if(e)return window.localStorage.getItem(e)},a=function(e){e&&window.localStorage.removeItem(e)}},f3e7:function(e,t,n){}});