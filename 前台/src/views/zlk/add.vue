<style lang="less">
@import './zlk.less';

</style>
<template>
    <Card title="资料库">
        <div class="qdgf">
            <div style="margin-bottom: 20px">
                <Select v-model="title" style="width: 200px" placeholder="请选择目录" :disabled="id!=''">
                    <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </div>
            <mavon-editor :toolbars="toolbars" ref="md" defaultOpen="edit" :editable="true" v-model="value" :subfield="false" codeStyle="monokai" @navigationToggle="onAddUrl" :ishljs="true" @change="change" @save="save" @imgAdd="imgAdd" @imgDel="imgDel"> </mavon-editor>
            <Button type="primary" style="margin-top: 20px" @click="save(value, renderHtml)">保存</Button>
        </div>
    </Card>
</template>
<script>
import { listZlkType, imageAdd, mdAdd, mdUpdata, mdDetail } from '@/api/index';

export default {
    computed: {
        prop() {
            return {
                subfield: false, // 单双栏模式
                defaultOpen: 'preview', //edit： 默认展示编辑区域 ， preview： 默认展示预览区域
                editable: false,
                toolbarsFlag: false,
                scrollStyle: true,
                navigation: true,
            };
        },
    },
    data() {
        return {
            typeList: [],
            id: '',
            value: '',
            title: '',
            renderHtml: '',
            menuList: [],
            mdListData: [],
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
        };
    },
    methods: {
        listZlkType() {
            listZlkType().then((res) => {
                this.typeList = res.data;
            });
        },
        change(value, render) {
            this.renderHtml = render;
            // console.log(value, render)
        },
        imgAdd(pos, $file) {
            // 第一步.将图片上传到服务器.
            let formdata = new FormData();
            formdata.append('file', $file);
            console.log(pos, $file);
            imageAdd(formdata).then((res) => {
                let fileFormat = $file.name.split('.');
                this.$refs.md.$img2Url(pos, 'http://172.16.2.131:3333/' + res.data + '.' + fileFormat[fileFormat.length - 1]);
            });
        },
        imgDel(value, render) {
            console.log(value, render);
        },
        save(value, render) {
            if (this.title == '') {
                this.$Message.error('请选择目录');
            }
            if (this.value == '') {
                this.$Message.error('内容不可为空');
            }
            if (this.id) {
                mdUpdata({
                    id: this.id,
                    title: this.title,
                    user: JSON.parse(localStorage.getItem('userInfo')).userName,
                    mdCode: value,
                    htmlCode: render,
                }).then((res) => {
                    this.$Message.success('保存成功');
                });
            } else {
                mdAdd({
                    title: this.title,
                    user: JSON.parse(localStorage.getItem('userInfo')).userName,
                    mdCode: value,
                    htmlCode: render,
                }).then((res) => {
                    if (res.code === 1) {
                        this.$Message.success('保存成功');
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            }
        },
        onAddUrl() {},
    },
    mounted() {
        this.listZlkType();
        if (this.$route.query.id) {
            mdDetail({ id: this.$route.query.id }).then((res) => {
                this.title = res.data.title;
                this.value = res.data.mdCode;
                this.id = this.$route.query.id;
            });
        }
    },
};
</script>
