(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ba2f5356"],{"365c":function(t,e,n){"use strict";n.d(e,"B",function(){return s}),n.d(e,"w",function(){return i}),n.d(e,"C",function(){return c}),n.d(e,"y",function(){return o}),n.d(e,"D",function(){return a}),n.d(e,"s",function(){return u}),n.d(e,"u",function(){return d}),n.d(e,"q",function(){return l}),n.d(e,"a",function(){return m}),n.d(e,"g",function(){return f}),n.d(e,"c",function(){return b}),n.d(e,"z",function(){return y}),n.d(e,"r",function(){return h}),n.d(e,"k",function(){return p}),n.d(e,"i",function(){return g}),n.d(e,"j",function(){return v}),n.d(e,"f",function(){return F}),n.d(e,"e",function(){return O}),n.d(e,"t",function(){return k}),n.d(e,"v",function(){return j}),n.d(e,"b",function(){return I}),n.d(e,"h",function(){return S}),n.d(e,"d",function(){return x}),n.d(e,"A",function(){return w}),n.d(e,"o",function(){return T}),n.d(e,"n",function(){return _}),n.d(e,"p",function(){return L}),n.d(e,"x",function(){return B}),n.d(e,"l",function(){return M}),n.d(e,"m",function(){return E});var r=n("7f80"),s="/upload/file",i=function(t){return Object(r["c"])("/login",t)},c=function(t){return Object(r["b"])("/user/info",t)},o=function(t){return Object(r["c"])("/regist",t)},a=function(t){return Object(r["c"])("/user/edit",t)},u=function(t){return Object(r["b"])("/department/getByParentId/0",t)},d=function(t,e){return Object(r["b"])("/department/getByParentId/".concat(t),e)},l=function(t,e){return Object(r["b"])("/user/getByDepartmentId/".concat(t),e)},m=function(t){return Object(r["c"])("/department/add",t)},f=function(t){return Object(r["c"])("/department/edit",t)},b=function(t,e){return Object(r["a"])("/department/delByIds/".concat(t),e)},y=function(t){return Object(r["b"])("/department/search",t)},h=function(t){return Object(r["b"])("/user/getByCondition",t)},p=function(t){return Object(r["b"])("/user/getAllUser",t)},g=function(t){return Object(r["c"])("/user/admin/edit",t)},v=function(t,e){return Object(r["c"])("/user/admin/enable/".concat(t),e)},F=function(t,e){return Object(r["c"])("/user/admin/disable/".concat(t),e)},O=function(t,e){return Object(r["a"])("/user/delByIds/".concat(t),e)},k=function(t){return Object(r["b"])("/system/getByParentId/0",t)},j=function(t,e){return Object(r["b"])("/system/getByParentId/".concat(t),e)},I=function(t){return Object(r["c"])("/system/add",t)},S=function(t){return Object(r["c"])("/system/edit",t)},x=function(t,e){return Object(r["a"])("/system/delByIds/".concat(t),e)},w=function(t){return Object(r["b"])("/system/search",t)},T=function(t){return Object(r["b"])("/system/getAllList",t)},_=function(t){return Object(r["b"])("/user/userSystem",t)},L=function(t){return Object(r["c"])("/time/getTimeList",t)},B=function(t){return Object(r["c"])("/time/postTime",t)},M=function(t){return Object(r["c"])("/time/workTimeSeach",t)},E=function(t){return Object(r["c"])("/time/getMapTime",t)}},4265:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"own-space"},[n("Card",[n("Form",{ref:"userForm",attrs:{model:t.userForm,"label-width":100,"label-position":"right"}},[n("FormItem",{attrs:{label:"用户账号："}},[n("span",[t._v(t._s(t.userForm.userName))])]),n("FormItem",{attrs:{label:"用户姓名："}},[n("Input",{staticStyle:{width:"200px"},model:{value:t.userForm.nickName,callback:function(e){t.$set(t.userForm,"nickName",e)},expression:"userForm.nickName"}})],1),n("FormItem",{attrs:{label:"邮箱："}},[n("Input",{staticStyle:{width:"200px"},model:{value:t.userForm.email,callback:function(e){t.$set(t.userForm,"email",e)},expression:"userForm.email"}})],1),n("FormItem",{attrs:{label:"负责的系统："}},[t._l(t.SystemList,function(e){return[t.userForm.systems.includes(e.id)?n("Tag",{key:e.id,attrs:{type:"border",color:"default"}},[t._v(t._s(e.title))]):t._e()]}),n("Button",{attrs:{type:"primary",size:"small"},on:{click:t.editSystems}},[t._v("编辑")])],2),n("FormItem",{attrs:{label:"所属部门："}},[n("span",[t._v(t._s(t.userForm.departmentTitle))])]),n("FormItem",{attrs:{label:"用户类型："}},[n("span",[t._v(t._s(t.userForm.roleTxt))])]),n("FormItem",{attrs:{label:"创建时间："}},[n("span",[t._v(t._s(t.userForm.createdAt))])]),n("FormItem",[n("Button",{staticStyle:{width:"100px","margin-right":"5px"},attrs:{type:"primary",loading:t.saveLoading},on:{click:t.saveEdit}},[t._v("保存")])],1)],1)],1),n("Modal",{attrs:{title:"图片预览",draggable:""},model:{value:t.viewImage,callback:function(e){t.viewImage=e},expression:"viewImage"}},[n("img",{staticStyle:{width:"80%",margin:"0 auto",display:"block"},attrs:{src:t.imgUrl}}),n("div",{attrs:{slot:"footer"},slot:"footer"},[n("Button",{on:{click:function(e){t.viewImage=!1}}},[t._v("关闭")])],1)]),n("Modal",{staticClass:"systemModal",attrs:{title:"选择负责的系统","mask-closable":!1,width:500,styles:{top:"30px"}},model:{value:t.systemModalVisible,callback:function(e){t.systemModalVisible=e},expression:"systemModalVisible"}},[n("Tree",{ref:"sysTree",attrs:{"empty-text":"请联系管理员录入系统列表",data:t.systemData,"load-data":t.loadData,"show-checkbox":"",multiple:""},on:{"on-toggle-expand":t.expandCheckSys}}),t.treeLoading?n("Spin",{attrs:{size:"large"}}):t._e(),n("div",{attrs:{slot:"footer"},slot:"footer"},[n("Button",{attrs:{type:"text"},on:{click:t.cancelsystemEdit}},[t._v("取消")]),n("Button",{attrs:{type:"primary"},on:{click:t.submitsystemEdit}},[t._v("确定")])],1)],1)],1)},s=[],i=n("365c"),c=n("8c92"),o=n.n(c),a={name:"ownspace_index",data:function(){return{accessToken:{},uploadFileUrl:"http://localhost:3000"+i["B"],userForm:{userId:"",userName:"",nickName:"",email:"",status:"",departmentTitle:"",role:"",createdAt:"",systems:[],roleTxt:""},defaultList:[{url:""}],SystemList:[],uploadList:[],viewImage:!1,imgUrl:"",saveLoading:!1,systemModalVisible:!1,treeLoading:!1,systemData:[],editSystem:[],selectAllFlag:!1}},methods:{init:function(){this.accessToken={accessToken:this.getStore("accessToken")};var t=JSON.parse(o.a.get("userInfo"));for(var e in t)null===t[e]&&arr.constructor!=Array&&(t[e]="");var n=JSON.stringify(t),r=JSON.parse(n);this.userForm=r,this.defaultList[0].url=r.avatar,"surperAdmin"===this.userForm.role?this.userForm.roleTxt="超级管理员":"admin"===this.userForm.role?this.userForm.roleTxt="管理员":this.userForm.roleTxt="普通用户",this.getSystemList()},getSystemList:function(){var t=this;Object(i["o"])().then(function(e){1===e.code&&(t.SystemList=e.data)})},saveEdit:function(){var t=this;this.saveLoading=!0;var e=this.userForm;Object(i["D"])(e).then(function(e){t.saveLoading=!1,1===e.code?(t.$Message.success("保存成功"),o.a.set("userInfo",t.userForm),t.$store.commit("setAvatarPath",t.userForm.avatar)):t.$Message.error("保存失败")})},editSystems:function(){var t=this;this.treeLoading=!0,Object(i["t"])().then(function(e){t.treeLoading=!1,1===e.code&&(e.data.forEach(function(t){t.checked=!1,t.isParent&&(t.loading=!1,t.children=[]),-1===t.status&&(t.title="[已禁用] "+t.title,t.disabled=!0)}),t.systemData=e.data,t.checkSysTree(t.systemData,t.userForm.systems),t.systemModalVisible=!0)})},expandCheckSys:function(t){this.checkSysTree(t.children,this.userForm.systems)},checkSysTree:function(t,e){var n=this;t.forEach(function(t){n.hasSysPerm(t,e)?t.checked=!0:t.checked=!1})},hasSysPerm:function(t,e){for(var n=!1,r=0;r<e.length;r++)if(t.id===e[r]){n=!0;break}return!!n},loadData:function(t,e){Object(i["v"])(t.id,{openDataFilter:!1}).then(function(t){1===t.code&&(t.data.forEach(function(t){t.selected=!1,t.isParent&&(t.loading=!1,t.children=[]),-1===t.status&&(t.title="[已禁用] "+t.title,t.disabled=!0)}),e(t.data))})},cancelsystemEdit:function(){this.systemModalVisible=!1},submitsystemEdit:function(){var t=[],e=this.$refs.sysTree.getCheckedNodes();e.forEach(function(e){t.push(e.id)}),this.userForm.systems=t,this.systemModalVisible=!1}},mounted:function(){this.init()}},u=a,d=(n("9c99"),n("17cc")),l=Object(d["a"])(u,r,s,!1,null,null,null);e["default"]=l.exports},"9c99":function(t,e,n){"use strict";var r=n("b906"),s=n.n(r);s.a},b906:function(t,e,n){}}]);