(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-25ecacd8"],{"3ccc":function(t,e,a){var s,i;!function(n,o){s=o,i="function"===typeof s?s.call(e,a,e,t):s,void 0===i||(t.exports=i)}(0,function(t,e,a){var s=function(t,e,a,s,i,n){for(var o=0,r=["webkit","moz","ms","o"],l=0;l<r.length&&!window.requestAnimationFrame;++l)window.requestAnimationFrame=window[r[l]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[r[l]+"CancelAnimationFrame"]||window[r[l]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t,e){var a=(new Date).getTime(),s=Math.max(0,16-(a-o)),i=window.setTimeout(function(){t(a+s)},s);return o=a+s,i}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)});var c=this;for(var u in c.options={useEasing:!0,useGrouping:!0,separator:",",decimal:".",easingFn:null,formattingFn:null},n)n.hasOwnProperty(u)&&(c.options[u]=n[u]);""===c.options.separator&&(c.options.useGrouping=!1),c.options.prefix||(c.options.prefix=""),c.options.suffix||(c.options.suffix=""),c.d="string"==typeof t?document.getElementById(t):t,c.startVal=Number(e),c.endVal=Number(a),c.countDown=c.startVal>c.endVal,c.frameVal=c.startVal,c.decimals=Math.max(0,s||0),c.dec=Math.pow(10,c.decimals),c.duration=1e3*Number(i)||2e3,c.formatNumber=function(t){var e,a,s,i;if(t=t.toFixed(c.decimals),t+="",e=t.split("."),a=e[0],s=e.length>1?c.options.decimal+e[1]:"",i=/(\d+)(\d{3})/,c.options.useGrouping)for(;i.test(a);)a=a.replace(i,"$1"+c.options.separator+"$2");return c.options.prefix+a+s+c.options.suffix},c.easeOutExpo=function(t,e,a,s){return a*(1-Math.pow(2,-10*t/s))*1024/1023+e},c.easingFn=c.options.easingFn?c.options.easingFn:c.easeOutExpo,c.formattingFn=c.options.formattingFn?c.options.formattingFn:c.formatNumber,c.version=function(){return"1.7.1"},c.printValue=function(t){var e=c.formattingFn(t);"INPUT"===c.d.tagName?this.d.value=e:"text"===c.d.tagName||"tspan"===c.d.tagName?this.d.textContent=e:this.d.innerHTML=e},c.count=function(t){c.startTime||(c.startTime=t),c.timestamp=t;var e=t-c.startTime;c.remaining=c.duration-e,c.options.useEasing?c.countDown?c.frameVal=c.startVal-c.easingFn(e,0,c.startVal-c.endVal,c.duration):c.frameVal=c.easingFn(e,c.startVal,c.endVal-c.startVal,c.duration):c.countDown?c.frameVal=c.startVal-(c.startVal-c.endVal)*(e/c.duration):c.frameVal=c.startVal+(c.endVal-c.startVal)*(e/c.duration),c.countDown?c.frameVal=c.frameVal<c.endVal?c.endVal:c.frameVal:c.frameVal=c.frameVal>c.endVal?c.endVal:c.frameVal,c.frameVal=Math.round(c.frameVal*c.dec)/c.dec,c.printValue(c.frameVal),e<c.duration?c.rAF=requestAnimationFrame(c.count):c.callback&&c.callback()},c.start=function(t){return c.callback=t,c.rAF=requestAnimationFrame(c.count),!1},c.pauseResume=function(){c.paused?(c.paused=!1,delete c.startTime,c.duration=c.remaining,c.startVal=c.frameVal,requestAnimationFrame(c.count)):(c.paused=!0,cancelAnimationFrame(c.rAF))},c.reset=function(){c.paused=!1,delete c.startTime,c.startVal=e,cancelAnimationFrame(c.rAF),c.printValue(c.startVal)},c.update=function(t){cancelAnimationFrame(c.rAF),c.paused=!1,delete c.startTime,c.startVal=c.frameVal,c.endVal=Number(t),c.countDown=c.startVal>c.endVal,c.rAF=requestAnimationFrame(c.count)},c.printValue(c.startVal)};return s})},"6ac2":function(t,e,a){},"77b80":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"home-main"},[1===t.type?[a("Row",{style:{marginBottom:"15px"},attrs:{gutter:10}},[a("Col",{attrs:{span:"6"}},[a("infor-card",{attrs:{"id-name":"user_created_count","end-val":t.weekCount,iconType:"md-shuffle",color:"#2d8cf0","intro-text":"上月累计工时"}})],1),a("Col",{attrs:{span:"6"}},[a("infor-card",{attrs:{"id-name":"visit_count","end-val":t.monthCount,iconType:"ios-eye",color:"#64d572","intro-text":"本月累计工时"}})],1),a("Col",{attrs:{span:"6"}},[a("infor-card",{attrs:{"id-name":"collection_count","end-val":t.yearCount,iconType:"ios-time",color:"#ffd572","intro-text":"本年累计工时"}})],1),a("Col",{attrs:{span:"6"}},[a("infor-card",{attrs:{"id-name":"transfer_count","end-val":t.systemCount,iconType:"md-desktop",color:"#f25e43","intro-text":"负责系统个数"}})],1)],1),a("Row",{style:{marginBottom:"15px"}},[a("Col",{attrs:{span:"24"}},[a("Card",[a("p",{attrs:{slot:"title"},slot:"title"},[t._v("查询条件")]),a("Row",{attrs:{gutter:20}},[a("Col",{attrs:{span:"16"}},[a("Date-picker",{staticClass:"margin-bottom20",staticStyle:{width:"100%"},attrs:{value:t.showdate,type:"daterange",confirm:"",placeholder:"选择日期"},on:{"on-change":t.handelChange}})],1),a("Col",{attrs:{span:"8"}},[a("Button",{staticClass:"margin-bottom20",attrs:{type:"primary",ghost:""},on:{click:function(e){return t.quickTime("week")}}},[t._v("本周")]),a("Button",{staticClass:"margin-bottom20",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",ghost:""},on:{click:function(e){return t.quickTime("month")}}},[t._v("本月")]),a("Button",{staticClass:"margin-bottom20",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",ghost:""},on:{click:function(e){return t.quickTime("preMonth")}}},[t._v("上月")])],1)],1),a("Row",{attrs:{gutter:20}},[a("Col",{attrs:{span:"16"}},[a("Select",{staticClass:"margin-bottom20",attrs:{clearable:"",multiple:"",placeholder:"选择员工"},model:{value:t.people,callback:function(e){t.people=e},expression:"people"}},t._l(t.peopleList,function(e){return a("Option",{key:e.userId,attrs:{value:e.userId}},[t._v(t._s(e.nickName))])}),1)],1),a("Col",{attrs:{span:"8"}},[a("Button",{staticClass:"margin-bottom20",attrs:{type:"primary",ghost:""},on:{click:function(e){t.people=[]}}},[t._v("清空选择")]),a("Button",{staticClass:"margin-bottom20",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",ghost:""},on:{click:t.peopleAll}},[t._v("选择全部")])],1)],1),a("Row",{attrs:{gutter:20}},[a("Col",{attrs:{span:"16"}},[a("Select",{staticClass:"margin-bottom20",attrs:{clearable:"",multiple:"",placeholder:"选择系统"},model:{value:t.system,callback:function(e){t.system=e},expression:"system"}},t._l(t.systemList,function(e){return a("Option",{key:e.id,attrs:{value:e.id}},[t._v(t._s(e.title))])}),1)],1),a("Col",{attrs:{span:"8"}},[a("Button",{staticClass:"margin-bottom20",attrs:{type:"primary",ghost:""},on:{click:t.clearallSystems}},[t._v("清空选择")]),a("Button",{staticClass:"margin-bottom20",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",ghost:""},on:{click:t.editallSystems}},[t._v("选择全部")]),a("Button",{staticClass:"margin-bottom20",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",ghost:""},on:{click:t.editSystems}},[t._v("快速选择")])],1)],1),a("Button",{staticClass:"margin-bottom20",attrs:{type:"primary"},on:{click:t.seach}},[t._v("查询")])],1)],1)],1),a("Row",[a("Col",{attrs:{span:"24"}},[a("Card",[a("p",{attrs:{slot:"title"},slot:"title"},[t._v("查询结果")]),a("Button",{attrs:{slot:"extra",type:"primary"},on:{click:function(e){return t.exportData()}},slot:"extra"},[t._v("导出数据")]),a("div",{staticClass:"demo-tabs-style2"},[a("Tabs",{attrs:{type:"card"}},[a("Tab-pane",{attrs:{label:"表格"}},[t.columns.length>0?a("Table",{ref:"table",attrs:{border:"",columns:t.columns,data:t.workList,stripe:""},scopedSlots:t._u([{key:"systemName",fn:function(e){var s=e.row;return[a("strong",[t._v(t._s(s.systemName))])]}}],null,!1,820694384)}):t._e()],1),a("Tab-pane",{attrs:{label:"图表"}},[a("Row",{style:{marginBottom:"10px"},attrs:{gutter:10}},[a("Col",{attrs:{span:"16"}},[a("Card",[a("p",{staticClass:"card-title",attrs:{slot:"title"},slot:"title"},[a("Icon",{attrs:{type:"md-map"}}),t._v("系统工时统计（共计"+t._s(t.total)+"小时）\n                      ")],1),a("div",{staticClass:"data-source-row"},[a("div",{staticStyle:{width:"100%",height:"300px"},attrs:{id:"visite_volume_con"}})])])],1),a("Col",{attrs:{span:"8"}},[a("Card",[a("p",{staticClass:"card-title",attrs:{slot:"title"},slot:"title"},[a("Icon",{attrs:{type:"md-map"}}),t._v("系统工时占比分析（共计"+t._s(t.total)+"小时）\n                      ")],1),a("div",{staticClass:"data-source-row"},[a("div",{staticStyle:{width:"100%",height:"300px"},attrs:{id:"data_source_con"}})])])],1)],1)],1)],1)],1),a("Modal",{staticClass:"systemModal",attrs:{title:"请选择系统","mask-closable":!1,width:500,styles:{top:"30px"}},model:{value:t.systemModalVisible,callback:function(e){t.systemModalVisible=e},expression:"systemModalVisible"}},[a("Tree",{ref:"sysTree",attrs:{"empty-text":"请联系管理员录入系统列表",data:t.systemData,"load-data":t.loadData,"on-check-change":"","show-checkbox":"",multiple:""},on:{"on-toggle-expand":t.expandCheckSys}}),t.treeLoading?a("Spin",{attrs:{size:"large"}}):t._e(),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"text"},on:{click:t.cancelsystemEdit}},[t._v("取消")]),a("Button",{attrs:{type:"primary"},on:{click:t.submitsystemEdit}},[t._v("确定")])],1)],1)],1)],1)],1)]:[a("Alert",{attrs:{"show-icon":""}},[t._v("欢迎使用工时系统")])]],2)},i=[],n=a("365c"),o=a("663f"),r=a("24ce"),l=a.n(r),c=a("8c92"),u=a.n(c),m=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("Card",{attrs:{padding:0}},[a("div",{staticClass:"infor-card-con"},[a("Col",{staticClass:"infor-card-icon-con",style:{backgroundColor:t.color,color:"white"},attrs:{span:"8"}},[a("Row",{staticClass:"height-100",attrs:{type:"flex",align:"middle",justify:"center"}},[a("Icon",{attrs:{type:t.iconType,size:t.iconSize}})],1)],1),a("Col",{staticClass:"height-100",attrs:{span:"16"}},[a("Row",{staticClass:"height-100",attrs:{type:"flex",align:"middle",justify:"center"}},[a("count-up",{staticClass:"infor-card-count user-created-count",attrs:{"id-name":t.idName,"end-val":t.endVal,color:t.color,countSize:t.countSize,countWeight:t.countWeight}},[a("p",{staticClass:"infor-intro-text",attrs:{slot:"intro"},slot:"intro"},[t._v(t._s(t.introText))])])],1)],1)],1)])},d=[],p=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("p",{class:t.className,style:{textAlign:"center",color:t.color,fontSize:t.countSize,fontWeight:t.countWeight}},[a("span",{attrs:{id:t.idName}},[t._v(t._s(t.startVal))]),a("span",[t._v(t._s(t.unit))])]),t._t("intro")],2)},f=[],h=a("3ccc"),y=a.n(h);function g(t){var e=0,a="";return t<1e3?e=t:t>=1e3&&t<1e6?(e=parseInt(t/1e3),a="K+"):t>=1e6&&t<1e10?(e=parseInt(t/1e6),a="M+"):(e=parseInt(t/1e9),a="B+"),{val:e,unit:a}}var b={data:function(){return{unit:"",demo:{}}},name:"countUp",props:{idName:String,className:String,startVal:{type:Number,default:0},endVal:{type:Number,required:!0},decimals:{type:Number,default:0},duration:{type:Number,default:2},delay:{type:Number,default:500},options:{type:Object,default:function(){return{useEasing:!0,useGrouping:!0,separator:",",decimal:"."}}},color:String,countSize:{type:String,default:"30px"},countWeight:{type:Number,default:700},introText:[String,Number]},mounted:function(){var t=this;this.$nextTick(function(){setTimeout(function(){var e=g(t.endVal),a=e.val;t.unit=e.unit;var s={};t.demo=s=new y.a(t.idName,t.startVal,a,t.decimals,t.duration,t.options),s.error||s.start()},t.delay)})}},v=b,w=a("17cc"),C=Object(w["a"])(v,p,f,!1,null,null,null),x=C.exports,V={name:"inforCard",components:{countUp:x},props:{idName:String,endVal:Number,color:String,iconType:String,introText:String,countSize:{type:String,default:"30px"},countWeight:{type:Number,default:700},iconSize:{type:Number,default:40}}},T=V,k=(a("ca84"),Object(w["a"])(T,m,d,!1,null,null,null)),_=k.exports;function S(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var F={name:"home",data:function(){var t;return t={type:"",systemCount:0,weekCount:0,monthCount:0,yearCount:0,total:0,startTime:"",endTime:"",people:[],showdate:[],peopleList:[],system:[],systemList:[],workList:[],systemData:[],systemModalVisible:!1,treeLoading:!1},S(t,"systemData",[]),S(t,"editSystem",[]),S(t,"selectAllFlag",!1),S(t,"visiteVolume",null),S(t,"dataSourcePie",null),S(t,"option",{tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},color:["#ff7f50","#87cefa","#da70d6","#32cd32","#6495ed","#ff69b4","#ba55d3","#cd5c5c","#ffa500","#40e0d0","#1e90ff","#ff6347","#7b68ee","#00fa9a","#ffd700","#6699FF","#ff6666","#3cb371","#b8860b","#30e0e0"],grid:{top:"10%",left:"2%",right:"4%",bottom:"10%",containLabel:!0},xAxis:{type:"category",data:[],axisLabel:{interval:0},nameTextStyle:{color:"#c3c3c3"}},yAxis:{type:"value"},series:[{name:"工作小时数",type:"bar",data:[]}]}),S(t,"option1",{tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},color:["#ff7f50","#87cefa","#da70d6","#32cd32","#6495ed","#ff69b4","#ba55d3","#cd5c5c","#ffa500","#40e0d0","#1e90ff","#ff6347","#7b68ee","#00fa9a","#ffd700","#6699FF","#ff6666","#3cb371","#b8860b","#30e0e0"],series:[{name:"工时占比",type:"pie",radius:"50%",center:["50%","60%"],data:[],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}),t},components:{inforCard:_},computed:{columns:function(){if(""!==this.startTime&&""!==this.endTime){var t=[],e=Object(o["a"])(this.startTime,this.endTime);t.push({title:"系统/时间(h)",minWidth:150,fixed:"left",key:"systemName",sortable:!0,slot:"systemName"});for(var a=0;a<e.length;a++)t.push({title:e[a],key:e[a],width:116,sortable:!0,align:"center"});return t}return[]}},methods:{init:function(){var t=this,e=JSON.parse(u.a.get("userInfo"));Object(n["D"])({userId:e.userId}).then(function(e){1===e.code&&(t.systemCount=e.data.systemCount,t.weekCount=e.data.weekCount,t.monthCount=e.data.monthCount,t.yearCount=e.data.yearCount)})},quickTime:function(t){"week"==t?(this.startTime=Object(o["g"])(),this.endTime=Object(o["f"])(),this.showdate=[],this.showdate.push(this.startTime),this.showdate.push(this.endTime)):"month"==t?(this.startTime=Object(o["e"])(),this.endTime=Object(o["d"])(),this.showdate=[],this.showdate.push(this.startTime),this.showdate.push(this.endTime)):(this.startTime=Object(o["c"])(),this.endTime=Object(o["b"])(),this.showdate=[],this.showdate.push(this.startTime),this.showdate.push(this.endTime))},clearallSystems:function(){this.system=[]},peopleAll:function(){this.people=[];for(var t=0;t<this.peopleList.length;t++){var e=this.peopleList[t];this.people.push(e.userId)}},editallSystems:function(){this.system=[];for(var t=0;t<this.systemList.length;t++){var e=this.systemList[t];this.system.push(e.id)}},editSystems:function(){var t=this;this.treeLoading=!0,Object(n["s"])().then(function(e){t.treeLoading=!1,1===e.code&&(e.data.forEach(function(t){t.checked=!1,t.isParent&&(t.loading=!1,t.children=[]),-1===t.status&&(t.title="[已禁用] "+t.title,t.disabled=!0)}),t.systemData=e.data,t.checkSysTree(t.systemData,t.system),t.systemModalVisible=!0)})},expandCheckSys:function(t){this.checkSysTree(t.children,this.system)},checkSysTree:function(t,e){var a=this;t.forEach(function(t){a.hasSysPerm(t,e)?t.checked=!0:t.checked=!1})},hasSysPerm:function(t,e){for(var a=!1,s=0;s<e.length;s++)if(t.id===e[s]){a=!0;break}return!!a},loadData:function(t,e){Object(n["u"])(t.id,{openDataFilter:!1}).then(function(t){1===t.code&&(t.data.forEach(function(t){t.selected=!1,t.isParent&&(t.loading=!1,t.children=[]),-1===t.status&&(t.title="[已禁用] "+t.title,t.disabled=!0)}),e(t.data))})},cancelsystemEdit:function(){this.systemModalVisible=!1},submitsystemEdit:function(){var t=[],e=this.$refs.sysTree.getCheckedNodes();e.forEach(function(e){t.push(e.id)}),this.system=t,this.systemModalVisible=!1},exportData:function(){this.$refs.table.exportCsv({filename:"工时统计"})},handelChange:function(t){this.startTime=t[0],this.endTime=t[1]},seach:function(){var t={startTime:this.startTime,endTime:this.endTime,people:this.people,system:this.system};this.getTimeList(t)},getTimeList:function(t){var e=this;Object(n["l"])(t).then(function(t){1===t.code&&(e.workList=t.data)}),Object(n["m"])(t).then(function(t){if(1===t.code){e.option.xAxis.data=[],e.option.series[0].data=[],e.option1.series[0].data=[],e.total=0;for(var a=0;a<t.system.length;a++)e.option.xAxis.data.push(t.system[a].title);for(var s=0;s<t.data.length;s++)e.option.series[0].data.push({name:t.data[s]._id.systemName,value:t.data[s].time,itemStyle:{normal:{color:e.option.color[s]}}}),e.option1.series[0].data.push({name:t.data[s]._id.systemName,value:t.data[s].time}),e.total+=t.data[s].time;e.dataSourcePie.setOption(e.option1),e.visiteVolume.setOption(e.option)}})},getUserList:function(){var t=this;Object(n["k"])().then(function(e){1===e.code&&(t.peopleList=e.data)})},getSystemList:function(){var t=this;Object(n["n"])().then(function(e){1===e.code&&(t.systemList=e.data)})}},mounted:function(){var t=this;this.type=JSON.parse(u.a.get("userInfo")).type,this.init(),this.getUserList(),this.getSystemList(),this.$nextTick(function(){t.visiteVolume=l.a.init(document.getElementById("visite_volume_con")),t.dataSourcePie=l.a.init(document.getElementById("data_source_con"))})}},N=F,A=(a("e897"),Object(w["a"])(N,s,i,!1,null,null,null));e["default"]=A.exports},ca84:function(t,e,a){"use strict";var s=a("cebd"),i=a.n(s);i.a},cebd:function(t,e,a){},e897:function(t,e,a){"use strict";var s=a("6ac2"),i=a.n(s);i.a}}]);