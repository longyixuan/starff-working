<style lang="less">
@import './zlk.less';
</style>
<template>
    <div class="qdgf qdgf-view">
        <div class="qdgf-banner">{{ titleDes }}</div>
        <Layout style="padding: 42px 32px;background: #fff;">
            <Content style="padding-right: 20px">
                <mavon-editor :toolbarsFlag="false" :ishljs="true" :boxShadow="false" codeStyle="monokai" :toolbars="toolbars" ref="md" defaultOpen="preview" :editable="false" v-model="value" :subfield="false"></mavon-editor>
            </Content>
            <Sider width="288" :style="{background: '#fff'}" v-if="tocs.length>0">
                <Affix>
                    <div class="toc">
                        <div class="title">文章目录</div>
                        <!-- 遍历目录 -->
                        <ul class="catalog-list">
                            <li v-for="(toc, index) in tocs" :class="{ active: tocIndex == index }" :key="toc.href" class="catalog-list-item" @click="setToc(index)">
                                <!-- <a @click="scrollToPosition(toc.href)" v-html="toc.name"></a> -->
                                <div class="lev2" v-if="toc.lev == 2">
                                    <a :id="'toc'+toc.id" :href="toc.href">{{ toc.name }}</a>
                                </div>
                                <div class="lev3" v-if="toc.lev == 3">
                                    <a :id="'toc'+toc.id" :href="toc.href">{{ toc.name }}</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </Affix>
            </Sider>
        </Layout>
    </div>
</template>
<script>
import { mdDetail } from '@/api/index';
import { offsetDomTop, scrolltoToc } from '@/libs/mdHelp';

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
            tocs: [],
            tocIndex: 0,
            typeList: [],
            value: '',
            title: '',
            titleDes: '',
            renderHtml: '',
            menuList: [],
            mdListData: [],
            toolbars: {
                bold: false, // 粗体
                italic: false, // 斜体
                header: false, // 标题
                underline: false, // 下划线
                strikethrough: false, // 中划线
                mark: false, // 标记
                superscript: false, // 上角标
                subscript: false, // 下角标
                quote: false, // 引用
                ol: false, // 有序列表
                ul: false, // 无序列表
                link: false, // 链接
                imagelink: false, // 图片链接
                code: false, // code
                table: false, // 表格
                fullscreen: false, // 全屏编辑
                readmodel: false, // 沉浸式阅读
                htmlcode: false, // 展示html源码
                help: false, // 帮助
                /* 1.3.5 */
                undo: false, // 上一步
                redo: false, // 下一步
                trash: false, // 清空
                shortCut: true, //是否启用快捷键
                save: false, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true, // 导航目录
                /* 2.1.8 */
                alignleft: false, // 左对齐
                aligncenter: false, // 居中
                alignright: false, // 右对齐
                /* 2.2.1 */
                subfield: false, // 单双栏模式
                preview: false, // 预览
            },
        };
    },
    methods: {
        setToc(index) {
            this.tocIndex = index;
        },
        scrollToPosition(id) {
            var position = offsetDomTop(document.getElementById(id));
            //80是因为有着导航条的高度
            position.top = position.top - 80;
            scrolltoToc(position.top);
        },
        creatCopyBtn() {
            const codeDoms = document.querySelectorAll('pre');
            let i = document.createElement('span');
            i.setAttribute('class', 'el-icon-copy-document hljs-copy');
            i.setAttribute('data-clipboard-action', 'copy');
            Array.from(codeDoms).forEach((item, index) => {
                let dom = i.cloneNode(false);
                let i_text = document.createTextNode('复制');
                dom.appendChild(i_text);
                dom.setAttribute('data-clipboard-target', '#copy' + index);
                item.appendChild(dom);
                let child = item.children[0];
                child.setAttribute('id', 'copy' + index);
            });
        },
        visibleChange(tocs) {
            window.addEventListener('scroll', () => {
                for (let index = 0; index < tocs.length; index++) {
                    let element = tocs[index];
                    if (index>0) {
                        let top = document.getElementById(element.id).getBoundingClientRect().top;
                        if (top > 0 && document.getElementById(tocs[index-1].id).getBoundingClientRect().top < 0) {
                            this.tocIndex = index;
                        }
                    }
                }
            }, false);
        },
    },
    created() {
        mdDetail({ id: this.$route.query.id }).then((res) => {
            this.title = res.data.title;
            this.titleDes = res.data.titleDes;
            this.value = res.data.mdCode;
            this.renderHtml = res.data.htmlCode;
        });
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                const aArr = this.$refs.md.$refs.vShowContent.querySelectorAll('a');
                let tocs = [];
                for (var i = 0; i < aArr.length; i++) {
                    if (aArr[i].id) {
                        let id = aArr[i].id;
                        let tag = aArr[i].parentNode;
                        let name = aArr[i].parentNode.innerText;
                        if (tag.tagName === 'H2') {
                            tocs.push({
                                id: id,
                                href: '#' + id,
                                name: tag.innerText,
                                lev: 2
                            });
                        }
                        if (tag.tagName === 'H3') {
                            tocs.push({
                                id: id,
                                href: '#' + id,
                                name: tag.innerText,
                                lev: 3
                            });
                        }
                    }
                }
                this.tocs = tocs;
                this.visibleChange(tocs);
            }, 1000);
        });
    },
};
</script>
