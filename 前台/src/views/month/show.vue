<style lang="less">
@import './index.less';

</style>
<template>
    <div>
        <Card class="marginB-20" title="月总结">
            <h1 class="summary-view-h1" slot="title">
                {{title}}
                <div class="summary-view-time"><Icon type="md-calendar" size="26"/></div>
            </h1>
            <div class="qdgf">
                <mavon-editor :toolbarsFlag="false" :boxShadow="false" codeStyle="monokai" :toolbars="toolbars" defaultOpen="preview" :editable="false" v-model="value" :subfield="false"></mavon-editor>
            </div>
        </Card>
    </div>
</template>
<script>
import { mdMonthEdit, mdMonthAdd, mdMonthDetails } from '@/api/index';
import moment from "moment";
export default {
    data() {
        return {
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
        mdMonthDetails(){
            mdMonthDetails({
                documentId: this.$route.query.id
            }).then( res => {
                this.title = res.data.documentName;
                this.value = res.data.md;
            });
        }
    },
    mounted() {
        this.mdMonthDetails();
    },
};
</script>
