<style lang="less">
@import './index.less';
</style>
<template>
    <Card dis-hover title="图标库">
        <template slot="extra">
            <div><strong style="color: #ed4014">{{list.length}}</strong> 个图标</div>
        </template>
        <Alert type="warning">引入：https://t1.chei.com.cn/common/ch/chicon/iconfont.css，调用：{{demo}}</Alert>
        <div class="icon-search-warp">
            <div class="icon-search-left">
                <RadioGroup v-model="type" type="button" button-style="solid" @on-change="search">
                    <Radio label="">全部</Radio>
                    <Radio label="line">描边</Radio>
                    <Radio label="block">填充</Radio>
                </RadioGroup>
            </div>
            <div class="icon-search-center">
                <Input v-model="keywords" clearable placeholder="请输入关键词或图标名称" @on-enter="search" @on-clear="search" @on-change="search" style="width: 400px"/>
                <Button type="primary" @click="search" style="margin-left: 8px">搜索</Button>
                <span class="btn-line"></span>
                <!-- <Button type="primary" @click="addModal=true;">添加</Button> -->
                <Upload action="" :before-upload="beforeUpload" :show-upload-list="false" style="display: inline-block;">
                    <Button type="primary">上传JSON</Button>
                </Upload>
                <ColorPicker v-model="color" style="margin-left: 20px"/>
                <div style="display: inline-block;width: 200px;padding: 0 8px">
                    <div class="slider">
                        <span class="slider-text">{{fontSize}}px</span>
                        <Slider class="slider-block" v-model="fontSize" :min="12" :max="88"></Slider>
                    </div>
                </div>
            </div>
        </div>
        <!-- <RadioGroup v-model="tag" type="button" button-style="solid" @on-change="search" style="margin-bottom: 20px;">
            <Radio label="">全部</Radio>
            <Radio :label="item.id" v-for="item in tagList" :key="item.id">{{item.name}}</Radio>
        </RadioGroup> -->
        <div class="icon-list" v-if="list.length > 0">
            <div class="icon-list-block" v-for="item,index in list">
                <div class="chsifont list-item-view" v-html="'&#x'+item.code+';'" :style="{color: color,fontSize: fontSize+'px'}"></div>
                <div class="list-item-text">{{item.name}}</div>
                <!-- <div class="list-item-code">{{'&#x'+item.code+';'}}</div> -->
                <div class="list-item-action">
                    <Icon v-clipboard:copy="copyText(item.code,item.name)" v-clipboard:success="onCopySuccess" type="md-copy" size="16" title="复制"/>
                    <span class="btn-line small"></span>
                    <Icon type="md-create" size="16" title="修改" @click="edit(index)"/>
                    <!-- <Icon type="md-trash" size="16" title="删除" @click="del(item.id)"/> -->
                </div>
            </div>
        </div>
        <div class="icon-list-empty" v-else>
            <img class="img" src="@/assets/noresult.svg" alt="">
            <div class="text">暂无数据</div>
        </div>
        <Modal v-model="addModal" title="新增" width="800">
            <Form :label-width="80">
                <FormItem label="名称：" class="ivu-form-item-required">
                    <Input v-model="addForm.name" placeholder="请输入"/>
                </FormItem>
                <FormItem label="代码：" class="ivu-form-item-required">
                    <Input v-model="addForm.code" placeholder="请输入" />
                </FormItem>
                <FormItem label="预览：">
                    <span class="chsifont" v-html="'&#x'+addForm.code+';'"></span>
                </FormItem>
                <FormItem label="类型：" class="ivu-form-item-required">
                    <RadioGroup v-model="addForm.type">
                        <Radio label="line">描边</Radio>
                        <Radio label="block">填充</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="分类：">
                    <CheckboxGroup v-model="addForm.tag">
                        <Checkbox :label="item.id" v-for="item in tagList" :key="item.id">{{item.name}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="关键词：" class="ivu-form-item-required">
                    <Input v-model="addForm.keywords" placeholder="请输入" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="iconAdd">确定</Button>
                <Button type="default" style="margin-left: 8px;" @click="addModal=false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="editModal" title="修改" width="800">
            <Form :label-width="80">
                <FormItem label="名称：">
                    {{editForm.name}}
                </FormItem>
                <FormItem label="代码：">
                    {{editForm.code}}
                </FormItem>
                <FormItem label="预览：">
                    <span class="chsifont" v-html="'&#x'+editForm.code+';'"></span>
                </FormItem>
                <FormItem label="类型：">
                    <!-- <RadioGroup v-model="editForm.type">
                        <Radio label="line">描边风格</Radio>
                        <Radio label="block">填充风格</Radio>
                    </RadioGroup> -->
                    {{editForm.type=='line'?'描边':'填充'}}
                </FormItem>
                <!-- <FormItem label="分类：">
                    <CheckboxGroup v-model="editForm.tag">
                        <Checkbox :label="item.id" v-for="item in tagList" :key="item.id">{{item.name}}</Checkbox>
                    </CheckboxGroup>
                </FormItem> -->
                <FormItem label="关键词：" class="ivu-form-item-required">
                    <Input v-model="editForm.keywords" placeholder="请输入" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="iconEdit">确定</Button>
                <Button type="default" style="margin-left: 8px;" @click="editModal=false">取消</Button>
            </div>
        </Modal>
    </Card>
</template>
<script>
import { iconList, iconDel, getIconTagList, iconAdd, iconEdit, uploadIcon } from '@/api/index';
export default {
    name: 'icon-list',
    data() {
        return {
            demo: '<span class="ch-icon ch-icon-edit"></span>',
            color: '#141D19',
            fontSize: 48,
            type: '',
            keywords: '',
            list: [],
            modal: false,
            addModal: false,
            editModal: false,
            uploadModal: false,
            tag: '',
            tagList: [],
            sjList: [], //设计
            userName: '',
            addForm: {
                name: '',
                type: '',
                keywords: '',
                code: '',
                order: 0,
                tag: [],
                userName: ''
            },
            editForm: {
                id: '',
                name: '',
                type: '',
                keywords: '',
                code: '',
                order: 0,
                tag: [],
                userName: ''
            },
        };
    },
    methods: {
        beforeUpload(file) {
            let formdata = new FormData();
            formdata.append('file', file);
            formdata.append('userName', JSON.parse(localStorage.getItem('userInfo')).userName);
            uploadIcon(formdata).then((res) => {
                if (res.code ===1) {
                    this.$Message.success(res.msg);
                    this.iconList();
                }
            });
            return false;
        },
        iconAdd() {
            iconAdd(this.addForm).then((res) => {
                if (res.code ===1) {
                    this.$Message.success(res.msg);
                    this.addModal = false;
                    this.iconList();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        iconEdit() {
            iconEdit(this.editForm).then((res) => {
                if (res.code ===1) {
                    this.$Message.success(res.msg);
                    this.editModal = false;
                    this.iconList();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        copyText(code,name) {
            return `<i class="ch-icon ch-icon-${name}"></i>`;
        },
        iconList() {
            iconList({
                keywords: this.keywords,
                type: this.type,
                tag: this.tag,
                userName: this.userName
            }).then(res => {
                this.list = res.data;
            });
        },
        search() {
            this.iconList();
        },
        onCopySuccess() {
            this.$Message.success('复制成功');
        },
        edit(index) {
            this.editForm.id = this.list[index].id;
            this.editForm.name = this.list[index].name;
            this.editForm.type = this.list[index].type;
            this.editForm.keywords = this.list[index].keywords;
            this.editForm.code = this.list[index].code;
            this.editForm.order = this.list[index].order;
            this.editForm.tag = this.list[index].tag;
            this.editForm.userName = this.addForm.userName;
            this.editModal = true;

        },
        del(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除吗',
                onOk: () => {
                    iconDel({id: id}).then(res => {
                        if (res.code === 1) {
                            this.$Message.success('删除成功');
                            this.iconList();
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
            });
        },
    },
    mounted() {
        this.addForm.userName = JSON.parse(localStorage.getItem('userInfo')).userName;
        getIconTagList().then((res) => {
            this.tagList = res.data;
        });
        this.iconList();
    }
};
</script>
