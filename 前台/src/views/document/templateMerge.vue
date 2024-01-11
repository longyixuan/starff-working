<style lang="less">
    @import "./summary.less";
</style>
<template>
    <Card dis-hover title="工作总结">
        <div style="padding: 0 20px;">
            <div class="summary-view-label">
                {{title}}
                <Input style="width: 200px;margin-left: 10px" type="text" v-model="keyword" placeholder="输入关键字筛选"></Input>
                <Button type="primary" style="margin-left: 10px" @click="init">筛选</Button>
            </div>
            <div class="summary-view-warp">
                <template v-for="(item,num) in submitList">
                    <h2 class="summary-view-h2">{{toChinesNum(num+1)}}、{{item.systemName}}</h2>
                    <table class="summary-table">
                        <thead>
                            <tr>
                                <th width="180">模块</th>
                                <th>工作内容</th>
                                <th width="120" v-if="$route.query.type == 'day'">日期</th>
                                <th width="270" v-if="$route.query.type == 'week'">日期</th>
                                <th width="100" v-if="$route.query.admin">姓名</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(item2,key,index) in item.content">
                                <template v-for="(item3,index3) in item2">
                                    <tr v-if="index3==0">
                                        <td :rowspan="item2.length" v-html="linght(filterTitle(key))"></td>
                                        <td>
                                            <div style=" white-space: pre-line;word-break: break-all;" v-html="linght(item3.contentDescription)"></div>
                                        </td>
                                        <td v-if="$route.query.type == 'day' || $route.query.type == 'week'">
                                            <template v-if="$route.query.type == 'day'">
                                                {{`${item3.year}-${item3.month}-${item3.day}`}}
                                            </template>
                                            <template v-if="$route.query.type == 'week'">
                                                {{item3.startDay|timeFilter}} - {{item3.endDay|timeFilter}}
                                            </template>
                                        </td>
                                        <td v-if="$route.query.admin">{{item3.nickName}}</td>
                                    </tr>
                                    <tr v-else>
                                        <td>
                                            <div style=" white-space: pre-line;word-break: break-all;" v-html="linght(item3.contentDescription)"></div>
                                        </td>
                                        <td v-if="$route.query.type == 'day' || $route.query.type == 'week'">
                                            <template v-if="$route.query.type == 'day'">
                                                {{`${item3.year}-${item3.month}-${item3.day}`}}
                                            </template>
                                            <template v-if="$route.query.type == 'week'">
                                                {{item3.startDay|timeFilter}} - {{item3.endDay|timeFilter}}
                                            </template>
                                        </td>
                                        <td v-if="$route.query.admin">{{item3.nickName}}</td>
                                    </tr>
                                </template>
                            </template>
                        </tbody>
                    </table>
                </template>
                <h2 class="summary-view-h2">工作计划</h2>
                <Tabs type="card">
                    <TabPane label="按人查看">
                        <table class="summary-table">
                            <thead>
                                <tr>
                                    <th width="180">系统</th>
                                    <th>工作计划内容</th>
                                    <th width="100" v-if="$route.query.admin">姓名</th>
                                </tr>
                            </thead>
                            <tbody v-if="$route.query.admin">
                                <template v-for="item in gzjhList">
                                    <tr v-for="(item2,index) in item.details">
                                        <template v-if="index==0">
                                            <td>{{item2.systemName}}</td>
                                            <td>
                                                <div style="white-space: pre-line;word-break: break-all;" v-html="linght(item2.gzjh)"></div>
                                            </td>
                                            <td :rowspan="item.details.length">{{item2.nickName}}</td>
                                        </template>
                                        <template v-else>
                                            <td>{{item2.systemName}}</td>
                                            <td>
                                                <div style="white-space: pre-line;word-break: break-all;" v-html="linght(item2.gzjh)"></div>
                                            </td>
                                        </template>
                                    </tr>
                                </template>
                            </tbody>
                            <tbody v-else>
                                <template v-for="item in gzjhList">
                                    <tr v-for="(item2,index) in item.details">
                                        <td>{{item2.systemName}}</td>
                                        <td>
                                            <div style="white-space: pre-line;word-break: break-all;" v-html="linght(item2.gzjh)"></div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </TabPane>
                    <TabPane label="按系统查看">
                        <table class="summary-table">
                            <thead>
                                <tr>
                                    <th width="180">系统</th>
                                    <th>工作计划内容</th>
                                    <th width="100" v-if="$route.query.admin">姓名</th>
                                </tr>
                            </thead>
                            <tbody v-if="$route.query.admin">
                                <template v-for="item in gzjhList2">
                                    <tr v-for="(item2,index) in item.details">
                                        <template v-if="index==0">
                                            <td :rowspan="item.details.length">{{item2.systemName}}</td>
                                            <td>
                                                <div style="white-space: pre-line;word-break: break-all;" v-html="linght(item2.gzjh)"></div>
                                            </td>
                                            <td>{{item2.nickName}}</td>
                                        </template>
                                        <template v-else>
                                            <td>
                                                <div style="white-space: pre-line;word-break: break-all;" v-html="linght(item2.gzjh)"></div>
                                            </td>
                                            <td>{{item2.nickName}}</td>
                                        </template>
                                    </tr>
                                </template>
                            </tbody>
                            <tbody v-else>
                                <template v-for="item in gzjhList">
                                    <tr v-for="(item2,index) in item.details">
                                        <td>{{item2.systemName}}</td>
                                        <td>
                                            <div style="white-space: pre-line;word-break: break-all;" v-html="linght(item2.gzjh)"></div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </TabPane>
                </Tabs>
            </div>
            <div class="summary-view-line"></div>
            <div style="text-align: center;">
                <Button type="primary" ghost @click="modal=true">生成markdown文件</Button>
                <Button type="primary" :disabled="disabled" @click="download(doctitle)" style="margin-left: 8px;">下载</Button>
            </div>
        </div>
        <Modal v-model="modal" title="生成markdown文件">
            <Input type="text" placeholder="文件标题" v-model="doctitle"/>
            <div slot="footer">
                <Button @click="modal=false">取消</Button>
                <Button type="primary" @click="onOk">确定</Button>
            </div>
        </Modal>
    </Card>
</template>
<script>
import {
    detailsDocumentday,
    mergeDocumentday,
    listModel,
    downDocument
} from "@/api/index";
import moment from "moment";
export default {
    data() {
        return {
            templateId: this.$route.query.id,
            modalWeek: false,
            title: '',
            keyword: '',
            time: '',
            type: 0,
            modal: false,
            disabled: true,
            doctitle: '',
            submitList: [],
            gzjhList: [],
            gzjhList2: []
        }
    },
    filters: {
        timeFilter(value) {
            return moment(value).format('YYYY年MM月DD日');
        }
    },
    methods: {
        filterTitle: function(value) {
            return _.find(this.modelList,['modelId', value]).modelName;
        },
        linght(val){
            if (this.keyword.length > 0) {
                let keywordArr = this.keyword.split("");
                val = val + "";
                keywordArr.forEach(item => {
                if (val.indexOf(item) !== -1 && item !== "") {
                    val = val.replace(
                    new RegExp(item,'g'),
                    '<font color="#f75353">' + item + "</font>"
                    );
                }
                });
                return val;
            } else {
                return val;
            }
        },
        onOk() {
            var postData = {
                nickName: JSON.parse(localStorage.getItem('userInfo')).nickName,
                userId: JSON.parse(localStorage.getItem('userInfo')).userId,
                time: moment().format('YYYY-MM-DD'),
                doctitle: this.doctitle,
                list: JSON.stringify(this.submitList),
                gzjh: JSON.stringify(this.gzjhList),
            }
            downDocument(postData).then(res => {
                if (res.code === 1) {
                    this.modal = false;
                    this.$Message.success('生成成功');
                    this.disabled = false;
                }
            })
        },
        download(fileName) {
            window.location.href = 'http://172.16.2.131:3333/download/markdown?fileName='+fileName;
        },
        init() {
            mergeDocumentday(this.$route.query.type,{mergeList: JSON.stringify(this.$route.query.mergeList),keyword: this.keyword}).then(res => {
                if (res.code == 1) {
                    this.$Message.success('查询成功');
                    if (res.data.length>0) {
                        this.title = '工作总结汇总';
                        this.submitList = [];
                        for (let i =0;i<res.data.length;i++) {
                            this.submitList.push({
                                systemId: res.data[i]._id.systemId,
                                systemName: res.data[i]._id.systemName,
                                content: _.groupBy(res.data[i].details,'contentTitle')
                            })
                        }
                    }
                    this.gzjhList = res.gzjh;
                    this.gzjhList2 = res.gzjh2;
                }
            })
        },
        toChinesNum(num){
            let cNum = ['零','一','二','三','四','五','六','七','八','九','十',
'十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
'二十一','二十二','二十三','二十四','二十五','二十六','二十七','二十八','二十九','三十',
'三十一','三十二','三十三','三十四','三十五','三十六','三十七','三十八','三十九','四十',
'四十一','四十二','四十三','四十四','四十五','四十六','四十七','四十八','四十九','五十',
'五十一','五十二','五十三','五十四','五十五','五十六','五十七','五十八','五十九','六十',
'六十一','六十二','六十三','六十四','六十五','六十六','六十七','六十八','六十九','七十',
'七十一','七十二','七十三','七十四','七十五','七十六','七十七','七十八','七十九','八十'];
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
        }
    },
    mounted() {
        listModel().then(res => {
            this.modelList = res.data;
            this.init();
        })
        this.type = JSON.parse(localStorage.getItem('userInfo')).type;
    }
}
</script>