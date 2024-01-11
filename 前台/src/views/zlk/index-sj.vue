<style lang="less">
@import './zlk.less';
</style>
<template>
    <Layout>
        <Sider :style="{ background: '#fff' }" width="220" ref="side">
            <Menu class="yggs-menu" :active-name="activeName" theme="light" ref="sj-menu" width="auto" :open-names="openName" @on-select="onSelect">
                <template v-for="item in menuList">
                    <template v-if="item.children.length===0">
                        <MenuItem :name="item.id" :key="item.id" replace :to="'/doc/sj?id='+item.id">{{item.name}}</MenuItem>
                    </template>
                    <template v-else>
                        <Submenu :name="item.id" :key="item.id">
                            <template slot="title">{{item.name}}</template>
                            <MenuItem :name="item2.id" :key="item2.id" replace :to="'/doc/sj?id='+item2.id" v-for="item2 in item.children">{{item2.name}}</MenuItem>
                        </Submenu>
                    </template>
                </template>
            </Menu>
        </Sider>
        <Layout :style="{ padding: '24px'}">
            <Content :style="{ minHeight: '280px', background: '#fff' }">
                <div class="qdgf qdgf-view">
                    <h1 class="h1-title">{{titleDes}} <span style="color: #A0A8A5; font-size: 14px;font-weight: 400;">（{{updateTime}}）</span></h1>
                    <Layout style="background: #fff;padding: 20px 12px 20px 64px;" v-if="title">
                        <Content style="padding-right: 20px;">
                            <mavon-editor :toolbarsFlag="false" :ishljs="true" :boxShadow="false" codeStyle="monokai" :toolbars="toolbars" ref="md" defaultOpen="preview" :editable="false" v-model="value" :subfield="false"></mavon-editor>
                        </Content>
                        <Sider width="288" :style="{background: '#fff'}" v-show="tocs.length>0">
                            <Affix>
                                <div class="toc">
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
                    <div class="zlk-empty" v-else>
                        <img class="img" src="@/assets/noresult.svg" alt="">
                        <div class="text">正在建设中...</div>
                    </div>
                </div>
            </Content>
        </Layout>
    </Layout>
</template>
<script>
import { mdShow,listZlkType } from '@/api/index';
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
            openName: [],
            activeName: '',
            type: 'sj',
            tocs: [],
            tocIndex: 0,
            typeList: [],
            value: '',
            title: '',
            titleDes: '',
            renderHtml: '',
            updateTime: '',
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
        onSelect(name) {
             mdShow({ id: name }).then((res2) => {
                if (res2.data) {
                    this.title = res2.data.title;
                    this.titleDes = res2.data.titleDes;
                    this.value = res2.data.mdCode;
                    this.renderHtml = res2.data.htmlCode;
                    this.$nextTick(() => {
                        this.createMl();
                    });
                } else {
                    this.title = '';
                    this.titleDes = '';
                    this.value = '';
                    this.renderHtml = '';
                }
            });
        },
        setToc(index) {
            this.tocIndex = index;
        },
        scrollToPosition(id) {
            var position = offsetDomTop(document.getElementById(id));
            //80是因为有着导航条的高度
            position.top = position.top - 80;
            scrolltoToc(position.top);
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
        getActiveName() {
            for (let index = 0; index < this.menuList.length; index++) {
                const element = this.menuList[index];
                if (element.children.length>0) {
                    this.openName.push(element.id);
                }
            }
            this.$nextTick(()=> {
                this.$refs['sj-menu'].updateOpened();
                this.$refs['sj-menu'].updateActiveName();
            });
        },
        createMl() {
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
                }
            }
            this.tocs = tocs;
            this.visibleChange(tocs);
        }
    },
    mounted() {
        let id = this.$route.query.id;
        listZlkType({type: this.type}).then((res) => {
            this.menuList = res.data;
            this.getActiveName();
            if (!this.$route.query.id) {
                if (this.menuList[0].children.length>0) {
                    id = this.menuList[0].children[0].id
                } else {
                    id = this.menuList[0].id
                }
            }
            this.activeName = id;
            mdShow({ id: this.$route.query.id }).then((res2) => {
                if (res2.data) {
                    this.title = res2.data.title;
                    this.titleDes = res2.data.titleDes;
                    this.value = res2.data.mdCode;
                    this.renderHtml = res2.data.htmlCode;
                    this.updateTime = res2.data.updateTime;
                    this.$nextTick(() => {
                        this.createMl();
                    });
                }
            });
        });
    },
};
</script>
