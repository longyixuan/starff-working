(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5986f314"],{"22ce":function(t,e,n){},"29fc":function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"search"},[n("Card",[n("Row",{staticClass:"operation"},[n("Button",{attrs:{type:"primary",icon:"md-add"},on:{click:t.add}},[t._v("添加子部门")]),n("Button",{attrs:{icon:"md-add"},on:{click:t.addRoot}},[t._v("添加一级部门")]),n("Button",{attrs:{icon:"md-trash"},on:{click:t.delAll}},[t._v("批量删除")]),n("Button",{attrs:{icon:"md-refresh"},on:{click:t.getParentList}},[t._v("刷新")]),n("i-switch",{staticStyle:{"margin-left":"5px"},attrs:{size:"large"},model:{value:t.strict,callback:function(e){t.strict=e},expression:"strict"}},[n("span",{attrs:{slot:"open"},slot:"open"},[t._v("级联")]),n("span",{attrs:{slot:"close"},slot:"close"},[t._v("单选")])])],1),n("Row",{staticClass:"code-row-bg",attrs:{type:"flex",justify:"start"}},[n("Col",{attrs:{span:"6"}},[n("Alert",{attrs:{"show-icon":""}},[t._v("\n          当前选择编辑：\n          "),n("span",{staticClass:"select-title"},[t._v(t._s(t.editTitle))]),t.form.id?n("a",{staticClass:"select-clear",on:{click:t.cancelEdit}},[t._v("取消选择")]):t._e()]),n("Input",{attrs:{suffix:"ios-search",placeholder:"输入部门名搜索",clearable:""},on:{"on-change":t.search},model:{value:t.searchKey,callback:function(e){t.searchKey=e},expression:"searchKey"}}),n("div",{staticClass:"tree-bar",style:{maxHeight:t.maxHeight}},[n("Tree",{ref:"tree",attrs:{data:t.data,"load-data":t.loadData,"show-checkbox":"","check-strictly":!t.strict},on:{"on-check-change":t.changeSelect,"on-select-change":t.selectTree}})],1),t.loading?n("Spin",{attrs:{size:"large",fix:""}}):t._e()],1),n("Col",{attrs:{span:"9"}},[n("Form",{ref:"form",attrs:{model:t.form,"label-width":85,rules:t.formValidate}},[n("FormItem",{attrs:{label:"上级部门",prop:"parentTitle"}},[n("Poptip",{attrs:{trigger:"click",placement:"right-start",title:"选择上级部门",width:"250"}},[n("Input",{staticStyle:{width:"400px"},attrs:{readonly:""},model:{value:t.form.parentTitle,callback:function(e){t.$set(t.form,"parentTitle",e)},expression:"form.parentTitle"}}),n("div",{staticStyle:{position:"relative","min-height":"5vh"},attrs:{slot:"content"},slot:"content"},[n("Tree",{attrs:{data:t.dataEdit,"load-data":t.loadData},on:{"on-select-change":t.selectTreeEdit}}),t.loadingEdit?n("Spin",{attrs:{size:"large",fix:""}}):t._e()],1)],1)],1),n("FormItem",{attrs:{label:"部门名称",prop:"title"}},[n("Input",{staticStyle:{width:"400px"},model:{value:t.form.title,callback:function(e){t.$set(t.form,"title",e)},expression:"form.title"}})],1),n("FormItem",{attrs:{label:"部门负责人",prop:"mainHeader"}},[n("Select",{staticStyle:{width:"400px"},attrs:{loading:t.userLoading,"not-found-text":"该部门暂无用户数据",multiple:""},model:{value:t.form.mainHeader,callback:function(e){t.$set(t.form,"mainHeader",e)},expression:"form.mainHeader"}},t._l(t.users,function(e){return n("Option",{key:e.userId,attrs:{value:e.userId}},[t._v(t._s(e.userName))])}),1)],1),n("FormItem",{attrs:{label:"副负责人",prop:"viceHeader"}},[n("Select",{staticStyle:{width:"400px"},attrs:{loading:t.userLoading,"not-found-text":"该部门暂无用户数据",multiple:""},model:{value:t.form.viceHeader,callback:function(e){t.$set(t.form,"viceHeader",e)},expression:"form.viceHeader"}},t._l(t.users,function(e){return n("Option",{key:e.userId,attrs:{value:e.userId}},[t._v(t._s(e.userName))])}),1)],1),n("FormItem",{attrs:{label:"排序值",prop:"sortOrder"}},[n("InputNumber",{attrs:{max:1e3,min:0},model:{value:t.form.sortOrder,callback:function(e){t.$set(t.form,"sortOrder",e)},expression:"form.sortOrder"}}),n("span",{staticStyle:{"margin-left":"5px"}},[t._v("值越小越靠前，支持小数")])],1),n("FormItem",{attrs:{label:"是否启用",prop:"status"}},[n("i-switch",{attrs:{size:"large","true-value":0,"false-value":-1},model:{value:t.form.status,callback:function(e){t.$set(t.form,"status",e)},expression:"form.status"}},[n("span",{attrs:{slot:"open"},slot:"open"},[t._v("启用")]),n("span",{attrs:{slot:"close"},slot:"close"},[t._v("禁用")])])],1),n("FormItem",{attrs:{label:"是否为父节点"}},[n("i-switch",{model:{value:t.form.isParent,callback:function(e){t.$set(t.form,"isParent",e)},expression:"form.isParent"}},[n("span",{attrs:{slot:"open"},slot:"open"},[t._v("是")]),n("span",{attrs:{slot:"close"},slot:"close"},[t._v("否")])])],1),n("Form-item",[n("Button",{staticStyle:{"margin-right":"5px"},attrs:{loading:t.submitLoading,type:"primary",icon:"ios-create-outline"},on:{click:t.submitEdit}},[t._v("修改并保存")]),n("Button",{on:{click:t.handleReset}},[t._v("重置")])],1)],1)],1)],1)],1),n("Modal",{attrs:{title:t.modalTitle,"mask-closable":!1,width:500},model:{value:t.modalVisible,callback:function(e){t.modalVisible=e},expression:"modalVisible"}},[n("Form",{ref:"formAdd",attrs:{model:t.formAdd,"label-width":85,rules:t.formValidate}},[t.showParent?n("div",[n("FormItem",{attrs:{label:"上级部门："}},[t._v(t._s(t.form.title))])],1):t._e(),n("FormItem",{attrs:{label:"部门名称",prop:"title"}},[n("Input",{model:{value:t.formAdd.title,callback:function(e){t.$set(t.formAdd,"title",e)},expression:"formAdd.title"}})],1),n("FormItem",{attrs:{label:"排序值",prop:"sortOrder"}},[n("InputNumber",{attrs:{max:1e3,min:0},model:{value:t.formAdd.sortOrder,callback:function(e){t.$set(t.formAdd,"sortOrder",e)},expression:"formAdd.sortOrder"}}),n("span",{staticStyle:{"margin-left":"5px"}},[t._v("值越小越靠前，支持小数")])],1),n("FormItem",{attrs:{label:"是否启用",prop:"status"}},[n("i-switch",{attrs:{size:"large","true-value":0,"false-value":-1},model:{value:t.formAdd.status,callback:function(e){t.$set(t.formAdd,"status",e)},expression:"formAdd.status"}},[n("span",{attrs:{slot:"open"},slot:"open"},[t._v("启用")]),n("span",{attrs:{slot:"close"},slot:"close"},[t._v("禁用")])])],1)],1),n("div",{attrs:{slot:"footer"},slot:"footer"},[n("Button",{attrs:{type:"text"},on:{click:t.cancelAdd}},[t._v("取消")]),n("Button",{attrs:{type:"primary",loading:t.submitLoading},on:{click:t.submitAdd}},[t._v("提交")])],1)],1)],1)},i=[],s=n("365c"),a={name:"department-manage",data:function(){return{loading:!0,maxHeight:"500px",strict:!0,userLoading:!1,loadingEdit:!0,modalVisible:!1,selectList:[],selectCount:0,showParent:!1,modalTitle:"",editTitle:"",searchKey:"",form:{id:"",title:"",parentId:"",parentTitle:"",sortOrder:0,status:0},formAdd:{},formValidate:{title:[{required:!0,message:"名称不能为空",trigger:"blur"}]},submitLoading:!1,data:[],dataEdit:[],users:[]}},methods:{init:function(){this.getParentList(),this.getParentListEdit()},getParentList:function(){var t=this;this.loading=!0,Object(s["s"])().then(function(e){t.loading=!1,1===e.code&&(e.data.forEach(function(t){t.isParent&&(t.loading=!1,t.children=[])}),t.data=e.data)})},getParentListEdit:function(){var t=this;this.loadingEdit=!0,Object(s["s"])().then(function(e){if(t.loadingEdit=!1,1===e.code){e.data.forEach(function(t){t.isParent&&(t.loading=!1,t.children=[])});var n={id:"0",title:"一级部门"};e.data.unshift(n),t.dataEdit=e.data}})},loadData:function(t,e){Object(s["u"])(t.id).then(function(t){1===t.code&&(t.data.forEach(function(t){t.isParent&&(t.loading=!1,t.children=[])}),e(t.data))})},search:function(){var t=this;this.searchKey?(this.loading=!0,Object(s["z"])({title:this.searchKey}).then(function(e){t.loading=!1,1===e.code&&(t.data=e.data)})):this.getParentList()},selectTree:function(t){var e=this;if(t.length>0){for(var n in t[0])null===t[0][n]&&(t[0][n]="");var r=JSON.stringify(t[0]),i=JSON.parse(r);this.editTitle=i.title,this.userLoading=!0,Object(s["q"])(i.id).then(function(t){e.userLoading=!1,1===t.code&&(e.users=t.data)}),this.form=i}else this.cancelEdit()},cancelEdit:function(){var t=this.$refs.tree.getSelectedNodes()[0];t&&(t.selected=!1),this.$refs.form.resetFields(),delete this.form.id,this.editTitle=""},selectTreeEdit:function(t){if(t.length>0){for(var e in t[0])null===t[0][e]&&(t[0][e]="");var n=JSON.stringify(t[0]),r=JSON.parse(n);this.form.parentId=r.id,this.form.parentTitle=r.title}},cancelAdd:function(){this.modalVisible=!1},handleReset:function(){this.$refs.form.resetFields(),this.form.status=0},submitEdit:function(){var t=this;this.$refs.form.validate(function(e){if(e){if(!t.form.id)return void t.$Message.warning("请先点击选择要修改的部门");console.log(t.form),t.submitLoading=!0,Object(s["g"])(t.form).then(function(e){t.submitLoading=!1,1===e.code&&(t.$Message.success("编辑成功"),t.init(),t.modalVisible=!1)})}})},submitAdd:function(){var t=this;this.$refs.formAdd.validate(function(e){e&&(t.submitLoading=!0,Object(s["a"])(t.formAdd).then(function(e){t.submitLoading=!1,1===e.code&&(t.$Message.success("添加成功"),t.init(),t.modalVisible=!1)}))})},add:function(){""!=this.form.id&&null!=this.form.id?(this.modalTitle="添加子部门",this.showParent=!0,this.formAdd={parentId:this.form.id,sortOrder:0,status:0},this.modalVisible=!0):this.$Message.warning("请先点击选择一个部门")},addRoot:function(){this.modalTitle="添加一级部门",this.showParent=!1,this.formAdd={parentId:0,sortOrder:0,status:0},this.modalVisible=!0},changeSelect:function(t){this.selectCount=t.length,this.selectList=t},delAll:function(){var t=this;this.selectCount<=0?this.$Message.warning("您还未勾选要删除的数据"):this.$Modal.confirm({title:"确认删除",content:"您确认要删除所选的 "+this.selectCount+" 条数据?",onOk:function(){var e="";t.selectList.forEach(function(t){e+=t.id+","}),e=e.substring(0,e.length-1),Object(s["c"])(e).then(function(e){1===e.code&&(t.$Message.success("删除成功"),t.selectList=[],t.selectCount=0,t.cancelEdit(),t.init())})}})}},mounted:function(){var t=document.documentElement.clientHeight;this.maxHeight=Number(t-287)+"px",this.init()}},o=a,c=(n("83ea"),n("17cc")),l=Object(c["a"])(o,r,i,!1,null,null,null);e["default"]=l.exports},"365c":function(t,e,n){"use strict";n.d(e,"B",function(){return i}),n.d(e,"w",function(){return s}),n.d(e,"C",function(){return a}),n.d(e,"y",function(){return o}),n.d(e,"D",function(){return c}),n.d(e,"s",function(){return l}),n.d(e,"u",function(){return d}),n.d(e,"q",function(){return u}),n.d(e,"a",function(){return f}),n.d(e,"g",function(){return m}),n.d(e,"c",function(){return h}),n.d(e,"z",function(){return p}),n.d(e,"r",function(){return b}),n.d(e,"k",function(){return g}),n.d(e,"i",function(){return v}),n.d(e,"j",function(){return O}),n.d(e,"f",function(){return y}),n.d(e,"e",function(){return j}),n.d(e,"t",function(){return x}),n.d(e,"v",function(){return _}),n.d(e,"b",function(){return k}),n.d(e,"h",function(){return I}),n.d(e,"d",function(){return w}),n.d(e,"A",function(){return A}),n.d(e,"o",function(){return L}),n.d(e,"n",function(){return T}),n.d(e,"p",function(){return E}),n.d(e,"x",function(){return $}),n.d(e,"l",function(){return S}),n.d(e,"m",function(){return P});var r=n("7f80"),i="/upload/file",s=function(t){return Object(r["c"])("/login",t)},a=function(t){return Object(r["b"])("/user/info",t)},o=function(t){return Object(r["c"])("/regist",t)},c=function(t){return Object(r["c"])("/user/edit",t)},l=function(t){return Object(r["b"])("/department/getByParentId/0",t)},d=function(t,e){return Object(r["b"])("/department/getByParentId/".concat(t),e)},u=function(t,e){return Object(r["b"])("/user/getByDepartmentId/".concat(t),e)},f=function(t){return Object(r["c"])("/department/add",t)},m=function(t){return Object(r["c"])("/department/edit",t)},h=function(t,e){return Object(r["a"])("/department/delByIds/".concat(t),e)},p=function(t){return Object(r["b"])("/department/search",t)},b=function(t){return Object(r["b"])("/user/getByCondition",t)},g=function(t){return Object(r["b"])("/user/getAllUser",t)},v=function(t){return Object(r["c"])("/user/admin/edit",t)},O=function(t,e){return Object(r["c"])("/user/admin/enable/".concat(t),e)},y=function(t,e){return Object(r["c"])("/user/admin/disable/".concat(t),e)},j=function(t,e){return Object(r["a"])("/user/delByIds/".concat(t),e)},x=function(t){return Object(r["b"])("/system/getByParentId/0",t)},_=function(t,e){return Object(r["b"])("/system/getByParentId/".concat(t),e)},k=function(t){return Object(r["c"])("/system/add",t)},I=function(t){return Object(r["c"])("/system/edit",t)},w=function(t,e){return Object(r["a"])("/system/delByIds/".concat(t),e)},A=function(t){return Object(r["b"])("/system/search",t)},L=function(t){return Object(r["b"])("/system/getAllList",t)},T=function(t){return Object(r["b"])("/user/userSystem",t)},E=function(t){return Object(r["c"])("/time/getTimeList",t)},$=function(t){return Object(r["c"])("/time/postTime",t)},S=function(t){return Object(r["c"])("/time/workTimeSeach",t)},P=function(t){return Object(r["c"])("/time/getMapTime",t)}},"83ea":function(t,e,n){"use strict";var r=n("22ce"),i=n.n(r);i.a}}]);