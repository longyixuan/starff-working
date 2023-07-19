<style lang="less">
@import '~simplemde/dist/simplemde.min.css';
@import '~font-awesome/css/font-awesome.css';
@import "./summary.less";
</style>
<template>
    <Card dis-hover title="工作总结">
        <Input v-model="title" placeholder="输入工作总结标题..." class="markdown-title"/>
        <vue-simplemde v-model="content" ref="markdownEditor" :configs="configs" @input="input" preview-class="markdown-body"/>
        <div class="markdown-footer">
            <span style="float: left;">
                <DatePicker :value="time" @on-change="onChange" format="yyyy-MM" type="month" placeholder="工作总结年月" style="width: 160px;margin-right: 10px"></DatePicker>
                <span style="color: #ed4014">标记工时提交日期</span>
            </span>
            <Button style="margin-right: 10px" @click="$router.push({name: 'summary'})">返回</Button>
            <Button type="primary" @click="save">保存</Button>
        </div>
    </Card>
</template>
<script>
    import {
        addDocument,
        getDocumentDetails
    } from "@/api/index";
    import VueSimplemde from 'vue-simplemde';
    export default {
        data() {
            return {
                title: '',
                time: '',
                content: '',
                contentHtml: '',
                configs: {
                    placeholder: '请使用 Markdown 格式书写 ;-)，代码片段黏贴时请注意使用高亮语法。',
                    spellChecker: false,
                    autoDownloadFontAwesome: false,
                    status: false,
                    tabSize: 4,
                    sanitize: true,
                    autosave: {
                        enabled: true,
                        uniqueId: "demo",
                        delay: 1000,
                    }
                }
            }
        },
        components: {
            VueSimplemde
        },
        methods: {
            save() {
                let postData = {
                    documentId: this.documentId,
                    contentHtml: this.contentHtml,
                    documentName: this.title,
                    userId: JSON.parse(localStorage.getItem('userInfo')).userId,
                    userName: JSON.parse(localStorage.getItem('userInfo')).userName,
                    nickName: JSON.parse(localStorage.getItem('userInfo')).nickName,
                    time: this.time,
                    content: this.content,
                }
                addDocument(postData).then(res => {
                    if (res.code === 1) {
                        this.$Message.success('保存成功')
                    }
                })
            },
            init() {
                if (!!this.documentId) {
                    getDocumentDetails(this.documentId).then(res => {
                        if (res.code == 1) {
                            this.contentHtml = res.data.contentHtml;
                            this.content = res.data.content;
                            this.title = res.data.documentName;
                            this.time = res.data.year+'-'+res.data.month;
                        }
                    })
                }
            },
            input(value) {
                this.contentHtml = this.$refs['markdownEditor'].simplemde.markdown(value);
            },
            onChange(val) {
                this.time = val;
            }
        },
        mounted() {
            this.documentId = this.$route.params.id;
            this.init();
        }
    }
</script>