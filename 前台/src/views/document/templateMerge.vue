<style lang="less">
    @import "./summary.less";
</style>
<template>
    <Card title="工作总结">
        <div style="padding: 0 20px;">
            <div class="summary-view-label">{{title}}</div>
            <div class="summary-view-warp">
                <template v-for="(item,num) in submitList">
                    <h2 class="summary-view-h2">{{toChinesNum(num+1)}}、{{item.systemName}}</h2>
                    <table class="summary-table">
                        <thead>
                            <tr>
                                <th width="140">模块</th>
                                <th>工作内容</th>
                                <th width="120">日期</th>
                                <th width="120" v-if="$route.query.admin">姓名</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item2,index) in item.content">
                                <td>{{item2.contentTitle}}</td>
                                <td>
                                    <div style=" white-space: pre-line;">{{item2.contentDescription}}</div>
                                </td>
                                <td>{{`${item2.year}-${item2.month}-${item2.day}`}}</td>
                                <td v-if="$route.query.admin">{{item2.nickName}}</td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </div>
            <div class="summary-view-line"></div>
            <div style="text-align: center;"><Button type="primary" @click="$Message.warning('正在开发中...')">下载</Button></div>
        </div>
    </Card>
</template>
<script>
import {
    detailsDocumentday,
    mergeDocumentday
} from "@/api/index";
export default {
    data() {
        return {
            templateId: this.$route.query.id,
            title: '',
            time: '',
            type: 0,
            submitList: []
        }
    },
    methods: {
        init() {
            mergeDocumentday(this.$route.query.type,{mergeList:this.$route.query.mergeList}).then(res => {
                if (res.code == 1) {
                    if (res.data.length>0) {
                        if (this.$route.query.admin) {
                            this.title = '工作总结汇总';
                        } else {
                            this.title = `${this.$route.query.month}月工作总结，包含：${this.$route.query.day.join('、')}日`;
                        }
                        this.submitList = [];
                        for (let i =0;i<res.data.length;i++) {
                            this.submitList.push({
                                systemId: res.data[i]._id.systemId,
                                systemName: res.data[i]._id.systemName,
                                content: res.data[i].details
                            })
                        }
                    }
                }
            })
        },
        toChinesNum(num){
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
        }
    },
    mounted() {
        this.init();
        this.type = JSON.parse(localStorage.getItem('userInfo')).type;
    }
}
</script>