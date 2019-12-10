<style lang="less">
    @import "./summary.less";
</style>
<template>
    <Card title="工作总结">
        <h1 class="summary-view-h1" slot="title">{{title}}<span class="summary-view-edit"><Icon type="md-create" size="24"/></span><div class="summary-view-time"><Icon type="md-calendar" size="26"/> {{time}}</div></h1>
        <div style="padding: 0 20px;">
            <div class="summary-view-label">本月工作总结</div>
            <div class="summary-view-warp">
                <template v-for="(item,num) in submitList">
                    <h2 class="summary-view-h2">{{toChinesNum(num+1)}}、{{item.systemName}}</h2>
                    <div v-for="(item2,index) in item.content" class="summary-view-content">
                        <p class="summary-view-p">
                            <strong>{{index+1}}、{{item2.contentTitle}}：</strong>
                            <span>{{item2.contentDescription}}</span>
                            <Tag color="warning" class="summary-view-tag">尹晓龙</Tag>
                        </p>
                    </div>
                </template>
            </div>
            <div class="summary-view-line"></div>
            <div class="summary-view-label">下月工作计划</div>
            <div class="summary-view-warp">
                <template v-for="(item,num) in submitList2">
                    <h2 class="summary-view-h2">{{toChinesNum(num+1)}}、{{item.systemName}}</h2>
                    <div v-for="(item2,index) in item.content" class="summary-view-content">
                        <p class="summary-view-p" v-if="item2.contentTitle!=''">
                            <strong>{{index+1}}、{{item2.contentTitle}}：</strong>
                            <span>{{item2.contentDescription}}</span>
                        </p>
                        <p class="summary-view-p" v-else>
                            <strong>{{item2.contentDescription}}</strong>
                        </p>
                    </div>
                </template>
            </div>
            <div class="summary-view-line"></div>
            <div style="text-align: center;"><Button type="primary">返回</Button></div>
        </div>
    </Card>
</template>
<script>
import {
    getTemplateDetails
} from "@/api/index";
export default {
    data() {
        return {
            templateId: this.$route.params.id,
            title: '',
            time: '',
            submitList: [],
            submitList2: []
        }
    },
    methods: {
        init() {
            getTemplateDetails(this.templateId).then(res => {
                if (res.code == 1) {
                    this.title = res.data.templateName;
                    this.time = res.data.year+' - '+res.data.month;
                    this.submitList = res.data.templateList;
                    this.submitList2 = res.data.templateList2;
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
    }
}
</script>