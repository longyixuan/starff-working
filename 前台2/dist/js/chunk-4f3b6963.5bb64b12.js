(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4f3b6963"],{"12f4":function(t,e,n){},"365c":function(t,e,n){"use strict";n.d(e,"B",function(){return i}),n.d(e,"w",function(){return u}),n.d(e,"C",function(){return s}),n.d(e,"y",function(){return c}),n.d(e,"D",function(){return o}),n.d(e,"s",function(){return a}),n.d(e,"u",function(){return d}),n.d(e,"q",function(){return f}),n.d(e,"a",function(){return h}),n.d(e,"g",function(){return l}),n.d(e,"c",function(){return m}),n.d(e,"z",function(){return b}),n.d(e,"r",function(){return p}),n.d(e,"k",function(){return y}),n.d(e,"i",function(){return g}),n.d(e,"j",function(){return O}),n.d(e,"f",function(){return I}),n.d(e,"e",function(){return j}),n.d(e,"t",function(){return v}),n.d(e,"v",function(){return w}),n.d(e,"b",function(){return x}),n.d(e,"h",function(){return k}),n.d(e,"d",function(){return N}),n.d(e,"A",function(){return M}),n.d(e,"o",function(){return D}),n.d(e,"n",function(){return L}),n.d(e,"p",function(){return S}),n.d(e,"x",function(){return Y}),n.d(e,"l",function(){return B}),n.d(e,"m",function(){return T});var r=n("7f80"),i="/upload/file",u=function(t){return Object(r["c"])("/login",t)},s=function(t){return Object(r["b"])("/user/info",t)},c=function(t){return Object(r["c"])("/regist",t)},o=function(t){return Object(r["c"])("/user/edit",t)},a=function(t){return Object(r["b"])("/department/getByParentId/0",t)},d=function(t,e){return Object(r["b"])("/department/getByParentId/".concat(t),e)},f=function(t,e){return Object(r["b"])("/user/getByDepartmentId/".concat(t),e)},h=function(t){return Object(r["c"])("/department/add",t)},l=function(t){return Object(r["c"])("/department/edit",t)},m=function(t,e){return Object(r["a"])("/department/delByIds/".concat(t),e)},b=function(t){return Object(r["b"])("/department/search",t)},p=function(t){return Object(r["b"])("/user/getByCondition",t)},y=function(t){return Object(r["b"])("/user/getAllUser",t)},g=function(t){return Object(r["c"])("/user/admin/edit",t)},O=function(t,e){return Object(r["c"])("/user/admin/enable/".concat(t),e)},I=function(t,e){return Object(r["c"])("/user/admin/disable/".concat(t),e)},j=function(t,e){return Object(r["a"])("/user/delByIds/".concat(t),e)},v=function(t){return Object(r["b"])("/system/getByParentId/0",t)},w=function(t,e){return Object(r["b"])("/system/getByParentId/".concat(t),e)},x=function(t){return Object(r["c"])("/system/add",t)},k=function(t){return Object(r["c"])("/system/edit",t)},N=function(t,e){return Object(r["a"])("/system/delByIds/".concat(t),e)},M=function(t){return Object(r["b"])("/system/search",t)},D=function(t){return Object(r["b"])("/system/getAllList",t)},L=function(t){return Object(r["b"])("/user/userSystem",t)},S=function(t){return Object(r["c"])("/time/getTimeList",t)},Y=function(t){return Object(r["c"])("/time/postTime",t)},B=function(t){return Object(r["c"])("/time/workTimeSeach",t)},T=function(t){return Object(r["c"])("/time/getMapTime",t)}},"4b77":function(t,e,n){"use strict";var r=n("12f4"),i=n.n(r);i.a},6575:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("Card",[n("DatePicker",{staticStyle:{width:"140px","margin-bottom":"15px"},attrs:{value:t.curYear,format:"yyyy年",type:"year",placeholder:"年份"},on:{"on-change":t.changeYear}}),n("Tabs",{attrs:{type:"card",value:t.curMonth},on:{"on-click":t.changeMonth}},[t._l(12,function(t){return[n("TabPane",{key:t,attrs:{label:t+"月",name:t.toString()}})]})],2),n("Table",{ref:"table",attrs:{border:"",columns:t.columns,data:t.tempList,stripe:""},scopedSlots:t._u([{key:"systemName",fn:function(e){var r=e.row;return[n("strong",[t._v(t._s(r.systemName))])]}},t._l(t.curMonthDays,function(e){return{key:e,fn:function(r){var i=r.row,u=r.index;return[t.editIndex===u?n("Input",{key:"day-"+e,attrs:{type:"text",number:""},model:{value:i[e],callback:function(n){t.$set(i,e,n)},expression:"row[day]"}}):n("span",{key:"day2-"+e},[t._v(t._s(i[e]?i[e]:"-"))])]}}}),{key:"action",fn:function(e){var r=e.row,i=e.index;return[t.editIndex===i?n("div",[n("Button",{attrs:{type:"primary",ghost:"",size:"small"},on:{click:function(e){return t.handleSave(r,i)}}},[t._v("保存")])],1):n("div",[n("Button",{attrs:{type:"primary",size:"small"},on:{click:function(e){return t.handleEdit(r,i)}}},[t._v("编辑")])],1)]}}],null,!0)}),n("div",{staticStyle:{"margin-top":"20px"}},[n("Button",{attrs:{type:"primary"},on:{click:function(e){return t.exportData(1)}}},[t._v("导出数据")])],1)],1)},i=[],u=n("365c"),s=n("8c92"),c=n.n(s);n("fed1");function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var a={data:function(){return{curYear:(new Date).getFullYear()+"",columns:[],exportColumns:[],editIndex:-1,workList:[],curMonth:((new Date).getMonth()+1).toString(),curMonthDays:0}},computed:{tempList:function(){for(var t=[],e=0;e<this.workList.length;e++){for(var n={systemName:this.workList[e].systemName,systemId:this.workList[e].systemId},r=0;r<this.workList[e].timeList.length;r++)n=Object.assign(n,o({},this.workList[e].timeList[r].day,this.workList[e].timeList[r].duration));t.push(n)}return console.log(t),t}},methods:{handleEdit:function(t,e){this.editIndex=e},handleSave:function(t,e){for(var n=this,r=[],i=1;i<=this.curMonthDays;i++)t[i]&&r.push({systemId:t.systemId,systemName:t.systemName,userId:JSON.parse(c.a.get("userInfo")).userId,userName:JSON.parse(c.a.get("userInfo")).userName,year:parseInt(this.curYear),month:parseInt(this.curMonth),day:i,time:t[i]});this.editIndex=-1,console.log(r),Object(u["x"])({systemId:t.systemId,systemName:t.systemName,userId:JSON.parse(c.a.get("userInfo")).userId,userName:JSON.parse(c.a.get("userInfo")).userName,year:parseInt(this.curYear),month:parseInt(this.curMonth),data:JSON.stringify(r)}).then(function(t){1===t.code?n.$Message.success("保存成功"):n.$Message.err("保存失败")})},exportData:function(t){1===t?this.$refs.exportTable.exportCsv({filename:this.curYear+"年"+this.curMonth+"月工时统计（"+JSON.parse(c.a.get("userInfo")).nickName+"）"}):this.$refs.exportTable.exportCsv({filename:this.curYear+"年"+this.curMonth+"月工时统计（"+JSON.parse(c.a.get("userInfo")).nickName+"）",original:!1})},remove:function(t){this.data.splice(t,1)},changeMonth:function(t){this.curMonth=t,this.changeDate(),this.initList()},changeYear:function(t,e){this.curYear=t,this.changeDate(),this.initList()},readerTable:function(t){this.curMonthDays=t,this.columns=[],this.exportColumns=[],this.columns.push({title:"系统/时间(h)",width:150,fixed:"left",slot:"systemName"}),this.exportColumns.push({title:"系统/时间(h)",width:150,fixed:"left",slot:"systemName"});for(var e=1;e<=t;e++)this.columns.push({title:e,slot:e,width:70,sortable:!0,align:"center"}),this.exportColumns.push({title:e,slot:e,width:70,sortable:!0,align:"center"});this.columns.push({title:"操作",width:80,align:"center",fixed:"right",slot:"action"})},changeDate:function(){var t=new Date(this.curYear+"-"+this.curMonth),e=t.getFullYear(),n=t.getMonth()+1,r=new Date(e,n,0),i=r.getDate();this.readerTable(i)},mGetDate:function(){var t=new Date,e=t.getFullYear(),n=t.getMonth()+1,r=new Date(e,n,0),i=r.getDate();this.readerTable(i)},initList:function(){var t=this,e={year:parseInt(this.curYear),month:parseInt(this.curMonth),userId:JSON.parse(c.a.get("userInfo")).userId};Object(u["p"])(e).then(function(e){1===e.code?(t.workList=e.data,t.$Message.success("查询成功")):t.$Message.error("查询失败")})},edit:function(t){}},mounted:function(){this.mGetDate(),this.initList()}},d=a,f=(n("4b77"),n("17cc")),h=Object(f["a"])(d,r,i,!1,null,"8a4dd570",null);e["default"]=h.exports}}]);