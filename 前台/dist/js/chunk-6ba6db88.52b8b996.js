(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6ba6db88"],{"2d75":function(t,e,s){"use strict";s("7213")},5450:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("Card",{attrs:{title:"工作总结"}},[s("h1",{staticClass:"summary-view-h1",attrs:{slot:"title"},slot:"title"},[t._v("\n        "+t._s(t.title)+"\n        "),s("div",{staticClass:"summary-view-time"},[s("Icon",{attrs:{type:"md-calendar",size:"26"}})],1)]),s("div",{staticStyle:{padding:"0 20px"}},[s("div",{staticClass:"summary-view-warp"},[t._l(t.submitList,(function(e,a){return[s("h2",{staticClass:"summary-view-h2"},[t._v(t._s(t.toChinesNum(a+1))+"、"+t._s(e.systemName))]),s("div",{staticClass:"summary-view-content"},[s("table",{staticClass:"summary-table"},[s("thead",[s("tr",[s("th",{attrs:{width:"180"}},[t._v("模块")]),s("th",[t._v("工作内容")])])]),s("tbody",t._l(e.content,(function(e,a){return s("tr",[s("td",[t._v(t._s(t.filterTitle(e.contentTitle)))]),s("td",[s("div",{staticStyle:{"white-space":"pre-line","word-break":"break-all"}},[t._v(t._s(e.contentDescription))])])])})),0)])])]})),s("h2",{staticClass:"summary-view-h2"},[t._v("工作计划")]),s("div",{staticClass:"summary-view-content"},[s("table",{staticClass:"summary-table"},[s("thead",[s("tr",[s("th",{attrs:{width:"180"}},[t._v("系统")]),s("th",[t._v("工作计划内容")])])]),s("tbody",t._l(t.gzjhList,(function(e){return s("tr",[s("td",[t._v("\n                                "+t._s(e.systemName)+"\n                            ")]),s("td",[s("div",{staticStyle:{"white-space":"pre-line","word-break":"break-all"}},[t._v(t._s(e.gzjh))])])])})),0)])]),t.hf.length>0?[s("h2",{staticClass:"summary-view-h2"},[t._v("回复")]),s("div",{staticClass:"summary-view-content"},[s("table",{staticClass:"summary-table"},[s("thead",[s("tr",[s("th",[t._v("内容")]),s("th",{attrs:{width:"160"}},[t._v("时间")])])]),s("tbody",t._l(t.hf,(function(e){return s("tr",[s("td",[t._v("\n                                "+t._s(e.replayDes)+"\n                            ")]),s("td",[t._v("\n                                "+t._s(e.replayTime)+"\n                            ")])])})),0)])])]:t._e(),""!=t.reason?[s("h2",{staticClass:"summary-view-h2"},[t._v("退回修改")]),s("div",{staticClass:"summary-view-content"},[s("div",{staticStyle:{"white-space":"pre-line","word-break":"break-all","font-size":"14px",border:"1px solid #ffb08f",padding:"12px",background:"#ffefe6"},domProps:{innerHTML:t._s(t.reason)}})])]:t._e()],2)])])},i=[],n=s("365c"),r=(s("caaf"),{data:function(){return{templateId:this.$route.query.id,title:"",time:"",userId:"",commentId:"",reason:"",submitList:[],modelList:[],gzjhList:[],hf:[]}},methods:{filterTitle:function(t){return _.find(this.modelList,["modelId",t]).modelName},init:function(){var t=this;Object(n["v"])(this.$route.query.type,{id:this.$route.query.id}).then((function(e){if(1==e.code){if(e.data.length>0){t.title=e.data[0].content[0].documentName,t.userId=e.data[0].content[0].userId,"day"==t.$route.query.type&&(t.time=e.data[0].content[0].documentName),t.submitList=[];for(var s=0;s<e.data.length;s++)t.submitList.push({systemId:e.data[s]._id.systemId,systemName:e.data[s]._id.systemName,content:e.data[s].content})}t.gzjhList=e.gzjh,t.hf=e.hf,e.thyy&&(t.reason=e.thyy.reason)}}))},toChinesNum:function(t){var e=["零","一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","二十一","二十二","二十三","二十四","二十五","二十六","二十七","二十八","二十九","三十","三十一","三十二","三十三","三十四","三十五","三十六","三十七","三十八","三十九","四十","四十一","四十二","四十三","四十四","四十五","四十六","四十七","四十八","四十九","五十","五十一","五十二","五十三","五十四","五十五","五十六","五十七","五十八","五十九","六十","六十一","六十二","六十三","六十四","六十五","六十六","六十七","六十八","六十九","七十","七十一","七十二","七十三","七十四","七十五","七十六","七十七","七十八","七十九","八十"];return e[t]},callBackFn:function(){var t=this;Object(n["h"])({documentId:this.$route.query.id,userId:this.commentId,commentId:this.commentId,reason:this.reason,type:this.$route.query.type}).then((function(e){1===e.code?t.$Message.success("退回成功"):t.$Message.error("退回失败")}))}},mounted:function(){var t=this;Object(n["Y"])().then((function(e){t.modelList=e.data,t.init()})),this.commentId=JSON.parse(localStorage.getItem("userInfo")).userId}}),d=r,o=(s("2d75"),s("cba8")),c=Object(o["a"])(d,a,i,!1,null,null,null);e["default"]=c.exports},7213:function(t,e,s){}}]);