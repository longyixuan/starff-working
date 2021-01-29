<style lang="less">
    @import "./summary.less";
</style>
<template>
    <div>
        <Card class="marginB-20" title="工作总结标题/时间">
            <template slot="extra">
                <Button type="primary" @click="$router.go(-1)" style="margin-left: 10px">返回</Button>
            </template>
            <Input v-model="title" class="summary-input marginB-20" placeholder="样例：xxxx年xx月月终工作总结（员工姓名）"/>
            <DatePicker v-model="time" format="yyyy年MM月" @on-change="onChange" type="month" placeholder="工作总结时间"></DatePicker>
        </Card>
        <Card title="工作总结" class="marginB-20">
            <div class="summary-template" v-for="(summary,index) in submitList">
                <Tag color="primary" size="large" class="summary-tag">{{index+1}}</Tag>
                <Tag color="warning"  size="large" class="summary-tag-right" @click.native="del(index)">
                    <Icon type="md-close" />
                </Tag>
                <Row class="marginB-20" :gutter="20">
                    <Col span="24">
                        <Select placeholder="选择系统" v-model="summary.systemId" filterable>
                            <template v-for="item in sysList">
                                <Option :value="item.id" v-show="systems.includes(item.id)">{{item.title}}</Option>)
                            </template>
                        </Select>
                    </Col>
                    <!-- <Col span="4">
                        <Input v-model="summary.time" placeholder="工时"/>
                    </Col> -->
                </Row>
                <Row :gutter="16">
                    <Col span="24" class="marginB-20" v-for="(modalItem,index2) in summary.content">
                        <Card>
                            <div class="marginB-20">
                                <Select
                                    v-model="modalItem.contentTitle"
                                    filterable
                                    placeholder="填写模块名称"
                                    style="width: 400px;">
                                    <Option v-for="(option, index) in sysFilter(summary.systemId)" :value="option.modelId" :key="index">{{option.modelName}}</Option>
                                </Select>
                                下拉选项中没有的模块，请在系统模块管理中添加。
                            </div>
                            <Input class="marginB-20" type="textarea" :rows="4" placeholder="填写工作内容" v-model="modalItem.contentDescription"></Input>
                            <Button type="error" @click="delList(index,index2)">删除当前记录</Button>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Button type="primary" ghost @click="addModal(index)">添加记录</Button>
                </Row>
            </div>
            <div class="summary-template-add marginB-20" @click="addSummary">
                <Icon type="md-add" size="120" color="#999"/>
            </div>
        </Card>
        <Card class="marginB-20" title="工作计划">
            <div class="summary-template" v-for="(summary,index) in gzjh">
                <Tag color="primary" size="large" class="summary-tag">{{index+1}}</Tag>
                <Tag color="warning"  size="large" class="summary-tag-right" @click.native="delGzjh(index)">
                    <Icon type="md-close" />
                </Tag>
                <Row :gutter="20">
                    <Col class="marginB-20" span="24">
                        <Select placeholder="选择系统" v-model="summary.systemId" filterable>
                            <template v-for="item in sysList">
                                <Option :value="item.id" v-show="systems.includes(item.id)">{{item.title}}</Option>
                            </template>
                        </Select>
                    </Col>
                    <Col span="24">
                        <Input v-model="summary.gzjh" class="marginB-20" type="textarea" :rows="6" placeholder="填写工作内容"></Input>
                    </Col>
                </Row>
            </div>
            <div class="summary-template-add marginB-20" @click="addGzjh">
                <Icon type="md-add" size="120" color="#999"/>
            </div>
        </Card>
        <Row>
            <Button type="primary" size="large" long @click="submit">提交</Button>
        </Row>
        <Modal v-model="modal" :title="modalTitle">
            <Input v-model="value" placeholder="输入模块名称"/>
            <template slot="footer">
                <Button @click="modal=false">取消</Button>
                <Button type="primary" @click="addModalName">添加模块</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
    import {
        getSystemList,
        addDocumentday,
        detailsDocumentday,
        editDocumentday,
        seachModal,
        addModal,
        listModel
    } from "@/api/index";
    import moment from "moment";
    export default {
        data() {
            return {
                title: '',
                gzjh: [],
                modalTitle: '',
                value: '',
                id: '',
                modal: false,
                documentId: '',
                sysList: [],
                time: new Date(),
                modalList: [],
                systems: JSON.parse(localStorage.getItem('userInfo')).systems,
                submitList: []
            }
        },
        methods: {
            sysFilter(id){
                return _.filter(this.modelList,['systemId', id]);
            },
            add(index) {
                if (this.submitList[index].systemId) {
                    this.id = this.submitList[index].systemId;
                    this.modalTitle = _.find(this.sysList,['id',this.id]).title;
                    this.modal = true;
                } else {
                    this.$Message.error('请先选择系统');
                }
            },
            addModalName() {
                if (this.value=='') {
                    this.$Message.error('请填写模块名称');
                    return; 
                }
                let modalList = _.find(this.sysList,['id',this.id]).modal;
                modalList.push(this.value)
                let postData = {
                    systemId: this.id,
                    modalList: Array.from(new Set(modalList))
                }
                addModal(postData).then(res => {
                    if (res.code === 1) {
                        this.$Message.success('添加成功');
                        this.modal = false;
                        this.init();
                        this.value=='';
                    }
                })
            },
            onChange(value) {
                alert(value)
                this.title = `设计部${value}工作小结（${JSON.parse(localStorage.getItem('userInfo')).nickName}）`
            },
            setPostData(){
                var result = [];
                var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                this.submitList.forEach((item,index) => {
                    item.content.forEach(item2 => {
                        result.push({
                            documentId: this.documentId,
                            documentName: this.title,
                            userId: userInfo.userId,
                            userName: userInfo.userName,
                            nickName: userInfo.nickName,
                            year: moment(this.time).format('YYYY'),
                            month: moment(this.time).format('MM'),
                            systemId: item.systemId,
                            time: item.time,
                            systemName: _.find(this.sysList,['id',item.systemId]).title,
                            contentTitle: item2.contentTitle,
                            contentDescription: item2.contentDescription
                        })
                    })
                })
                return result;
            },
            setGzjh(){
                var result = [];
                this.gzjh.forEach((item,index) => {
                    result.push({
                        systemId: item.systemId,
                        systemName: _.find(this.sysList,['id',item.systemId]).title,
                        gzjh: item.gzjh
                    })
                })
                return result;
            },
            submit() {
                if (this.gzjh.length==0) {
                    this.$Message.error('请填写工作计划');
                    return;
                }
                var postData = {summaryName: this.title,list: JSON.stringify(this.setPostData()),gzjh: this.setGzjh()};
                if(this.documentId!='') {
                    editDocumentday(this.$route.query.type,postData).then(res => {
                        if (res.code == 1) {
                            // this.$Message.success('保存成功');
                            this.$router.go(-1);
                        } else {
                            this.$Message.error(res.msg);
                        }
                    })
                } else {
                    addDocumentday(this.$route.query.type,postData).then(res => {
                        if (res.code == 1) {
                            // this.$Message.success('保存成功');
                            this.$router.go(-1);
                        } else {
                            this.$Message.error(res.msg);
                        }
                    })
                }
            },
            init() {
                listModel().then(res => {
                    this.modelList = res.data;
                    getSystemList().then(res => {
                        this.sysList = res.data;
                    })
                })
            },
            addModal(index) {
                this.submitList[index].content.push({
                    contentTitle: '',
                    contentDescription: ''
                });
            },
            addSummary() {
                this.submitList.push(
                    {
                        systemId: '',
                        content: []
                    }
                )
            },
            addGzjh() {
                this.gzjh.push(
                    {
                        systemId: '',
                        gzjh: ''
                    }
                )
            },
            delGzjh(index) {
                this.gzjh.splice(index,1);
            },
            del(index) {
                this.submitList.splice(index,1);
            },
            delList(index,index2) {
                this.submitList[index].content.splice(index2,1);
            }
        },
        mounted() {
            this.init();
            this.documentId = this.$route.query.id;
            if (this.documentId!='') {
                detailsDocumentday(this.$route.query.type,{id:this.$route.query.id}).then(res => {
                    if (res.data.length>0) {
                        this.title = res.data[0].content[0].documentName;
                        this.time = new Date(res.data[0].content[0].year+'-'+res.data[0].content[0].month);
                        this.submitList = [];
                        for (let i =0;i<res.data.length;i++) {
                            this.submitList.push({
                                systemId: res.data[i]._id.systemId,
                                systemName: res.data[i]._id.systemName,
                                time: res.data[i]._id.time,
                                content: res.data[i].content
                            })
                        }
                    }
                    if (res.gzjh.length>0) {
                        this.gzjh = res.gzjh;
                    }
                })
            } else {
                if (this.$route.query.type == 'month') {
                    this.title = `设计部${moment().format('YYYY年MM月DD日')}工作总结（${JSON.parse(localStorage.getItem('userInfo')).nickName}）`
                }
            }
        }
    }
</script>