(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2bcb77b8"],{"82c64":function(t,e,s){},"9fcf":function(t,e,s){"use strict";var a=s("82c64"),i=s.n(a);i.a},b569:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"search"},[s("Card",[s("Row",{staticClass:"operation"},[s("Button",{attrs:{type:"primary",icon:"md-add"},on:{click:t.add}},[t._v("添加子系统")]),s("Button",{attrs:{icon:"md-add"},on:{click:t.addRoot}},[t._v("添加一级系统")]),s("Button",{attrs:{icon:"md-trash"},on:{click:t.delAll}},[t._v("批量删除")]),s("Button",{attrs:{icon:"md-refresh"},on:{click:t.getParentList}},[t._v("刷新")]),s("i-switch",{staticStyle:{"margin-left":"5px"},attrs:{size:"large"},model:{value:t.strict,callback:function(e){t.strict=e},expression:"strict"}},[s("span",{attrs:{slot:"open"},slot:"open"},[t._v("级联")]),s("span",{attrs:{slot:"close"},slot:"close"},[t._v("单选")])])],1),s("Row",{staticClass:"code-row-bg",attrs:{type:"flex",justify:"start"}},[s("Col",{attrs:{span:"6"}},[s("Alert",{attrs:{"show-icon":""}},[t._v("\n          当前选择编辑：\n          "),s("span",{staticClass:"select-title"},[t._v(t._s(t.editTitle))]),t.form.id?s("a",{staticClass:"select-clear",on:{click:t.cancelEdit}},[t._v("取消选择")]):t._e()]),s("Input",{attrs:{suffix:"ios-search",placeholder:"输入系统名搜索",clearable:""},on:{"on-change":t.search},model:{value:t.searchKey,callback:function(e){t.searchKey=e},expression:"searchKey"}}),s("div",{staticClass:"tree-bar",style:{maxHeight:t.maxHeight}},[s("Tree",{ref:"tree",attrs:{data:t.data,"load-data":t.loadData,"show-checkbox":"","check-strictly":!t.strict},on:{"on-check-change":t.changeSelect,"on-select-change":t.selectTree}})],1),t.loading?s("Spin",{attrs:{size:"large",fix:""}}):t._e()],1),s("Col",{attrs:{span:"9"}},[s("Form",{ref:"form",attrs:{model:t.form,"label-width":85,rules:t.formValidate}},[s("FormItem",{attrs:{label:"上级系统",prop:"parentTitle"}},[s("Poptip",{attrs:{trigger:"click",placement:"right-start",title:"选择上级系统",width:"250"}},[s("Input",{staticStyle:{width:"400px"},attrs:{readonly:""},model:{value:t.form.parentTitle,callback:function(e){t.$set(t.form,"parentTitle",e)},expression:"form.parentTitle"}}),s("div",{staticStyle:{position:"relative","min-height":"5vh"},attrs:{slot:"content"},slot:"content"},[s("Tree",{attrs:{data:t.dataEdit,"load-data":t.loadData},on:{"on-select-change":t.selectTreeEdit}}),t.loadingEdit?s("Spin",{attrs:{size:"large",fix:""}}):t._e()],1)],1)],1),s("FormItem",{attrs:{label:"系统名称",prop:"title"}},[s("Input",{staticStyle:{width:"400px"},model:{value:t.form.title,callback:function(e){t.$set(t.form,"title",e)},expression:"form.title"}})],1),s("FormItem",{attrs:{label:"系统负责人",prop:"mainHeader"}},[s("Select",{staticStyle:{width:"400px"},attrs:{loading:t.userLoading,"not-found-text":"该系统暂无用户数据",multiple:""},model:{value:t.form.mainHeader,callback:function(e){t.$set(t.form,"mainHeader",e)},expression:"form.mainHeader"}},t._l(t.users,(function(e){return s("Option",{key:e.userId,attrs:{value:e.userId}},[t._v(t._s(e.userName))])})),1)],1),s("FormItem",{attrs:{label:"排序值",prop:"sortOrder"}},[s("InputNumber",{attrs:{max:1e3,min:0},model:{value:t.form.sortOrder,callback:function(e){t.$set(t.form,"sortOrder",e)},expression:"form.sortOrder"}}),s("span",{staticStyle:{"margin-left":"5px"}},[t._v("值越小越靠前，支持小数")])],1),s("FormItem",{attrs:{label:"是否启用",prop:"status"}},[s("i-switch",{attrs:{size:"large","true-value":0,"false-value":-1},model:{value:t.form.status,callback:function(e){t.$set(t.form,"status",e)},expression:"form.status"}},[s("span",{attrs:{slot:"open"},slot:"open"},[t._v("启用")]),s("span",{attrs:{slot:"close"},slot:"close"},[t._v("禁用")])])],1),s("FormItem",{attrs:{label:"是否为父节点"}},[s("i-switch",{model:{value:t.form.isParent,callback:function(e){t.$set(t.form,"isParent",e)},expression:"form.isParent"}},[s("span",{attrs:{slot:"open"},slot:"open"},[t._v("是")]),s("span",{attrs:{slot:"close"},slot:"close"},[t._v("否")])])],1),s("Form-item",[s("Button",{staticStyle:{"margin-right":"5px"},attrs:{loading:t.submitLoading,type:"primary",icon:"ios-create-outline"},on:{click:t.submitEdit}},[t._v("修改并保存")]),s("Button",{on:{click:t.handleReset}},[t._v("重置")])],1)],1)],1)],1)],1),s("Modal",{attrs:{title:t.modalTitle,"mask-closable":!1,width:500},model:{value:t.modalVisible,callback:function(e){t.modalVisible=e},expression:"modalVisible"}},[s("Form",{ref:"formAdd",attrs:{model:t.formAdd,"label-width":85,rules:t.formValidate}},[t.showParent?s("div",[s("FormItem",{attrs:{label:"上级系统："}},[t._v(t._s(t.form.title))])],1):t._e(),s("FormItem",{attrs:{label:"系统名称",prop:"title"}},[s("Input",{model:{value:t.formAdd.title,callback:function(e){t.$set(t.formAdd,"title",e)},expression:"formAdd.title"}})],1),s("FormItem",{attrs:{label:"排序值",prop:"sortOrder"}},[s("InputNumber",{attrs:{max:1e3,min:0},model:{value:t.formAdd.sortOrder,callback:function(e){t.$set(t.formAdd,"sortOrder",e)},expression:"formAdd.sortOrder"}}),s("span",{staticStyle:{"margin-left":"5px"}},[t._v("值越小越靠前，支持小数")])],1),s("FormItem",{attrs:{label:"是否启用",prop:"status"}},[s("i-switch",{attrs:{size:"large","true-value":0,"false-value":-1},model:{value:t.formAdd.status,callback:function(e){t.$set(t.formAdd,"status",e)},expression:"formAdd.status"}},[s("span",{attrs:{slot:"open"},slot:"open"},[t._v("启用")]),s("span",{attrs:{slot:"close"},slot:"close"},[t._v("禁用")])])],1)],1),s("div",{attrs:{slot:"footer"},slot:"footer"},[s("Button",{attrs:{type:"text"},on:{click:t.cancelAdd}},[t._v("取消")]),s("Button",{attrs:{type:"primary",loading:t.submitLoading},on:{click:t.submitAdd}},[t._v("提交")])],1)],1)],1)},i=[],o=s("365c"),r={name:"department-manage",data:function(){return{loading:!0,maxHeight:"500px",strict:!0,userLoading:!1,loadingEdit:!0,modalVisible:!1,selectList:[],selectCount:0,showParent:!1,modalTitle:"",editTitle:"",searchKey:"",form:{id:"",title:"",parentId:"",parentTitle:"",sortOrder:0,status:0},formAdd:{},formValidate:{title:[{required:!0,message:"名称不能为空",trigger:"blur"}]},submitLoading:!1,data:[],dataEdit:[],users:[]}},methods:{init:function(){this.getParentList(),this.getParentListEdit()},getParentList:function(){var t=this;this.loading=!0,Object(o["w"])().then((function(e){t.loading=!1,1===e.code&&(e.data.forEach((function(t){t.isParent&&(t.loading=!1,t.children=[])})),t.data=e.data)}))},getParentListEdit:function(){var t=this;this.loadingEdit=!0,Object(o["w"])().then((function(e){if(t.loadingEdit=!1,1===e.code){e.data.forEach((function(t){t.isParent&&(t.loading=!1,t.children=[])}));var s={id:"0",title:"一级系统"};e.data.unshift(s),t.dataEdit=e.data}}))},loadData:function(t,e){Object(o["z"])(t.id).then((function(t){1===t.code&&(t.data.forEach((function(t){t.isParent&&(t.loading=!1,t.children=[])})),e(t.data))}))},search:function(){var t=this;this.searchKey?(this.loading=!0,Object(o["G"])({title:this.searchKey}).then((function(e){t.loading=!1,1===e.code&&(t.data=e.data)}))):this.getParentList()},selectTree:function(t){var e=this;if(t.length>0){for(var s in t[0])null===t[0][s]&&(t[0][s]="");var a=JSON.stringify(t[0]),i=JSON.parse(a);this.editTitle=i.title,this.userLoading=!0,Object(o["m"])().then((function(t){e.userLoading=!1,1===t.code&&(e.users=t.data)})),this.form=i}else this.cancelEdit()},cancelEdit:function(){var t=this.$refs.tree.getSelectedNodes()[0];t&&(t.selected=!1),this.$refs.form.resetFields(),delete this.form.id,this.editTitle=""},selectTreeEdit:function(t){if(t.length>0){for(var e in t[0])null===t[0][e]&&(t[0][e]="");var s=JSON.stringify(t[0]),a=JSON.parse(s);this.form.parentId=a.id,this.form.parentTitle=a.title}},cancelAdd:function(){this.modalVisible=!1},handleReset:function(){this.$refs.form.resetFields(),this.form.status=0},submitEdit:function(){var t=this;this.$refs.form.validate((function(e){if(e){if(!t.form.id)return void t.$Message.warning("请先点击选择要修改的系统");t.submitLoading=!0,Object(o["i"])(t.form).then((function(e){t.submitLoading=!1,1===e.code&&(t.$Message.success("编辑成功"),t.init(),t.modalVisible=!1)}))}}))},submitAdd:function(){var t=this;this.$refs.formAdd.validate((function(e){e&&(t.submitLoading=!0,Object(o["b"])(t.formAdd).then((function(e){t.submitLoading=!1,1===e.code&&(t.$Message.success("添加成功"),t.init(),t.modalVisible=!1)})))}))},add:function(){""!=this.form.id&&null!=this.form.id?(this.modalTitle="添加子系统",this.showParent=!0,this.formAdd={parentId:this.form.id,sortOrder:0,status:0},this.modalVisible=!0):this.$Message.warning("请先点击选择一个系统")},addRoot:function(){this.modalTitle="添加一级系统",this.showParent=!1,this.formAdd={parentId:0,sortOrder:0,status:0},this.modalVisible=!0},changeSelect:function(t){this.selectCount=t.length,this.selectList=t},delAll:function(){var t=this;this.selectCount<=0?this.$Message.warning("您还未勾选要删除的数据"):this.$Modal.confirm({title:"确认删除",content:"您确认要删除所选的 "+this.selectCount+" 条数据?",onOk:function(){var e="";t.selectList.forEach((function(t){e+=t.id+","})),e=e.substring(0,e.length-1),Object(o["d"])(e).then((function(e){1===e.code?(t.$Message.success("删除成功"),t.selectList=[],t.selectCount=0,t.cancelEdit(),t.init()):t.$Message.error(e.msg)}))}})}},mounted:function(){var t=document.documentElement.clientHeight;this.maxHeight=Number(t-287)+"px",this.init()}},n=r,l=(s("9fcf"),s("4e82")),c=Object(l["a"])(n,a,i,!1,null,null,null);e["default"]=c.exports}}]);