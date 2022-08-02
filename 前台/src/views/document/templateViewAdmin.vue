<style lang="less">
    @import "./summary.less";
</style>
<template>
    <Card title="工作总结">
        <h1 class="summary-view-h1" slot="title">
            {{title}}
            <div class="summary-view-time"><Icon type="md-calendar" size="26"/></div>
        </h1>
        <div style="padding: 0 20px;">
            <div class="summary-view-warp">
                <template v-for="(item,num) in submitList">
                    <h2 class="summary-view-h2">{{toChinesNum(num+1)}}、{{item.systemName}}</h2>
                    <div class="summary-view-content">
                        <table class="summary-table">
                            <thead>
                                <tr>
                                    <th width="180">模块</th>
                                    <th>工作内容</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item2,index) in item.content">
                                    <td>{{filterTitle(item2.contentTitle)}}</td>
                                    <td>
                                        <div style=" white-space: pre-line;word-break: break-all;">{{item2.contentDescription}}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
                <h2 class="summary-view-h2">工作计划</h2>
                <div class="summary-view-content">
                    <table class="summary-table">
                        <thead>
                            <tr>
                                <th width="180">系统</th>
                                <th>工作计划内容</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in gzjhList">
                                <td>
                                    {{item.systemName}}
                                </td>
                                <td>
                                    <div style=" white-space: pre-line;word-break: break-all;">{{item.gzjh}}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h2 class="summary-view-h2" v-if="type===1">退回修改</h2>
                <div class="summary-view-content" v-if="type===1">
                    <Input :disabled="disabled" v-model="reason" class="marginB-20" type="textarea" :rows="6" placeholder="请填写退回原因"></Input>
                    <Button :disabled="disabled" type="warning" @click="callBackFn">退回</Button>
                </div>
            </div>
        </div>
    </Card>
</template>
<script>
import {
    detailsDocumentday,
    listModel,
    callbackDocument
} from "@/api/index";
import moment from "moment";
export default {
    data() {
        return {
            templateId: this.$route.query.id,
            disabled: false,
            title: '',
            type: 0,
            time: '',
            userId: '',
            commentId: '',
            reason: '',
            submitList: [],
            modelList: [],
            gzjhList: []
        }
    },
    methods: {
        filterTitle: function(value) {
            return _.find(this.modelList,['modelId', value]).modelName;
        },
        init() {
            detailsDocumentday(this.$route.query.type,{id:this.$route.query.id}).then(res => {
                if (res.code == 1) {
                    if (res.data.length>0) {
                        this.title = res.data[0].content[0].documentName;
                        this.userId = res.data[0].content[0].userId;
                        if (this.$route.query.type=='day') {
                            this.time = res.data[0].content[0].documentName;
                        }
                        if (res.data[0]._id.status_info.length>0&&res.data[0]._id.status_info[0].status=='0') {
                            this.disabled = true;
                        }
                        this.submitList = [];
                        for (let i =0;i<res.data.length;i++) {
                            this.submitList.push({
                                systemId: res.data[i]._id.systemId,
                                systemName: res.data[i]._id.systemName,
                                content: res.data[i].content
                            })
                        }
                    }
                    this.gzjhList = res.gzjh;
                    if (res.thyy) {
                        this.reason = res.thyy.reason
                    }
                }
            })
        },
        toChinesNum(num){
            let cNum = ['零','一', '二', '三', '四', '五', '六', '七', '八', '九','十',
            '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九','二十',
            '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九','三十',
            '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九','四十',
            '四十一', '四十二', '四十三', '四十四', '四十五', '四十六', '四十七', '四十八', '四十九','五十',
            '五十一', '五十二', '五十三', '五十四', '五十五', '五十六', '五十七', '五十八', '五十九','六十',
            '六十一', '六十二', '六十三', '六十四', '六十五', '六十六', '六十七', '六十八', '六十九','七十',
            '七十一', '七十二', '七十三', '七十四', '七十五', '七十六', '七十七', '七十八', '七十九','八十'];
            return cNum[num];
            let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
            let unit = ["", "十", "百", "千", "万"];
            num = parseInt(num);
            let getWan = (temp) => {
                let strArr = temp.toString().split("").reverse();
                let newNum = "";
                for (var i = 0; i < strArr.length; i++) {
                    newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
                }
                return newNum;
            }
            let overWan = Math.floor(num / 10000);
            let noWan = num % 10000;
            if (noWan.toString().length < 4) noWan = "0" + noWan;
            return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
        },
        confirm(tip,callback) {
            this.$Modal.confirm({
                title: "提示",
                content: tip,
                onOk: () => {
                    callback();
                }
            });
        },
        callBackFn() {
            let title = '确定要退回吗？';
            this.confirm(title,() => {
                callbackDocument({
                    documentId: this.$route.query.id,
                    userId: this.commentId,
                    commentId: this.commentId,
                    reason: this.reason,
                    type: this.$route.query.type
                }).then(res=>{
                    if (res.code===1) {
                        this.$Message.success('退回成功');
                        this.disabled = true;
                    } else {
                        this.$Message.error('退回失败');
                    }
                })
            })
        }
    },
    mounted() {
        listModel().then(res => {
            this.modelList = res.data;
            this.init();
        })
        this.type = JSON.parse(localStorage.getItem('userInfo')).type;
        this.commentId = JSON.parse(localStorage.getItem('userInfo')).userId;
    }
}
</script>