(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-14e59956"],{"75a1":function(t,e,a){},8519:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("Card",{attrs:{title:"消息中心"}},[a("Tabs",{attrs:{type:"card",value:"name1"}},[a("TabPane",{attrs:{label:"未读",name:"name1"}},[a("Table",{attrs:{border:"",columns:t.columns,data:t.msgList},scopedSlots:t._u([{key:"action",fn:function(e){var n=e.row;return[a("a",{attrs:{href:"/summary/admindetails?id="+n.documentId+"&type="+n.type},on:{click:function(e){return t.readMsg(n.id)}}},[t._v("查看")])]}}])})],1),a("TabPane",{attrs:{label:"已读",name:"name2"}},[a("Table",{attrs:{border:"",columns:t.columns,data:t.msgHistoryList},scopedSlots:t._u([{key:"action",fn:function(e){var n=e.row;return[a("a",{attrs:{href:"/summary/admindetails?id="+n.documentId+"&type="+n.type}},[t._v("查看")])]}}])})],1)],1)],1)},s=[],r=(a("365c"),a("caaf"),{name:"msg",data:function(){return{columns:[{title:"发送人",key:"fsr",width:120},{title:"内容",key:"replayDes"},{title:"发送时间",key:"replayTime",width:200,align:"center"},{title:"操作",width:80,align:"center",slot:"action"}],data:[]}},computed:{msgList:function(){return this.$store.state.msg.wdxx},msgHistoryList:function(){return this.$store.state.msg.ydxx}},methods:{readMsg:function(t){this.$store.dispatch("replayUpdateMsg",{id:t})}},mounted:function(){this.$store.dispatch("getMsgList")}}),i=r,o=(a("fcfe"),a("cba8")),c=Object(o["a"])(i,n,s,!1,null,null,null);e["default"]=c.exports},fcfe:function(t,e,a){"use strict";a("75a1")}}]);