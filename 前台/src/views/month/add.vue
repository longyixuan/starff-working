<style lang="less">
@import './index.less';

</style>
<template>
    <div>
        <Card class="marginB-20" title="月总结">
            <template slot="extra">
                <Button type="primary" @click="$router.go(-1)" style="margin-left: 10px">返回</Button>
            </template>
            <Input v-model="title" class="summary-input marginB-20" placeholder="样例：xxxx年xx月月终工作总结（员工姓名）"/>
            <DatePicker class=" marginB-20" v-model="time" format="yyyy年MM月" @on-change="onChange" type="month" placeholder="工作总结时间"></DatePicker>
            <div class="qdgf">
                <mavon-editor @change="changeMd" :toolbars="toolbars" ref="md" defaultOpen="edit" :editable="true" v-model="value" :subfield="false" codeStyle="monokai" :ishljs="true"></mavon-editor>
            </div>
            <Button type="primary" style="margin-top: 20px" @click="save(value, renderHtml)">保存</Button>
        </Card>
    </div>
</template>
<script>
import { mdMonthEdit, mdMonthAdd, mdMonthDetails } from '@/api/index';
import moment from "moment";
export default {
    data() {
        return {
            documentId: '',
            title: '',
            value: '',
            renderHtml: '',
            time: new Date(),
            toolbars: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: true, // 帮助
                /* 1.3.5 */
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                shortCut: false, //是否启用快捷键
                save: true, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true, // 导航目录
                /* 2.1.8 */
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                /* 2.2.1 */
                subfield: true, // 单双栏模式
                preview: true, // 预览
            },
            userInfo: null
        };
    },
    methods: {
        onChange(value) {
            this.title = `设计部${value}工作小结（${JSON.parse(localStorage.getItem('userInfo')).nickName}）`
        },
        changeMd(value, render) {
            this.renderHtml = render;
        },
        save(value, render) {
            if (this.title == '') {
                this.$Message.error('请选择目录');
            }
            if (this.value == '') {
                this.$Message.error('内容不可为空');
            }
            if (this.id) {
                mdMonthEdit({
                    documentId: this.documentId,
                    documentName: this.title,
                    userId: this.userInfo.userId,
                    userName: this.userInfo.userName,
                    nickName: this.userInfo.nickName,
                    year: moment(this.time).format('YYYY'),
                    month: moment(this.time).format('MM'),
                    md: value,
                    html: render
                }).then((res) => {
                    this.$Message.success('保存成功');
                    this.$router.push({ 'path': '/summary/list'});
                });
            } else {
                mdMonthAdd({
                    documentName: this.title,
                    userId: this.userInfo.userId,
                    userName: this.userInfo.userName,
                    nickName: this.userInfo.nickName,
                    year: moment(this.time).format('YYYY'),
                    month: moment(this.time).format('MM'),
                    md: value,
                    html: render
                }).then((res) => {
                    if (res.code === 1) {
                        this.$Message.success('保存成功');
                        this.$router.push({ 'path': '/summary/list'});
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            }
        },
        mdMonthDetails(){
            mdMonthDetails({
                documentId: this.documentId
            }).then( res => {
                this.title = res.data.documentName;
                this.value = res.data.md;
                this.time = new Date(res.data.year +'-'+ res.data.month +'-01');
            });
        }
    },
    mounted() {
        this.documentId = this.$route.query.id;
         this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (this.documentId) {
            this.mdMonthDetails();
        } else {
            this.title = `设计部${moment().format('YYYY年MM月')}工作总结（${this.userInfo.nickName}）`;
        }
    },
};
</script>
