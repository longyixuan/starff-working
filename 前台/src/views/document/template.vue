<style lang="less">
    @import "./summary.less";
</style>
<template>
    <div>
        <Card class="marginB-20" title="工作总结标题/时间">
            <Input v-model="title" class="summary-input marginB-20" placeholder="样例：xxxx年xx月月终工作总结（员工姓名）"/>
            <DatePicker class="summary-input" :value="time" @on-change="onChange" format="yyyy-MM" type="month" placeholder="工作总结时间"></DatePicker>
        </Card>
        <Card title="本月工作总结" class="marginB-20">
            <div class="summary-template" v-for="(summary,index) in submitList">
                <Tag color="primary" size="large" class="summary-tag">{{index+1}}</Tag>
                <Tag color="warning"  size="large" class="summary-tag-right" @click.native="del(index)">
                    <Icon type="md-close" />
                </Tag>
                <Row class="marginB-20">
                    <Col span="24">
                        <Select placeholder="选择系统" v-model="summary.systemId">
                            <Option :value="item.id" v-for="item in sysList">
                                {{item.title}}
                            </Option>)
                        </Select>
                    </Col>
                </Row>
                <Row :gutter="16" class="marginB-20" v-for="(modalItem,index2) in summary.content">
                    <Col span="6">
                        <Input placeholder="填写模块名称" v-model="modalItem.contentTitle"></Input>
                    </Col>
                    <Col span="18">
                        <Input placeholder="填写工作内容" v-model="modalItem.contentDescription">
                            <Button type="primary" slot="append" @click="delList(index,index2)">删除本条记录</Button>
                        </Input>
                    </Col>
                </Row>
                <Row>
                    <Button type="primary" ghost @click="addModal(index)">添加模块</Button>
                </Row>
            </div>
            <div class="summary-template-add marginB-20" @click="addSummary">
                <Icon type="md-add" size="120" color="#999"/>
            </div>
        </Card>
        <Card title="下月工作计划" class="marginB-20">
            <div class="summary-template" v-for="(summary,index) in submitList2">
                <Tag color="primary" size="large" class="summary-tag">{{index+1}}</Tag>
                <Tag color="warning"  size="large" class="summary-tag-right" @click.native="del2(index)">
                    <Icon type="md-close" />
                </Tag>
                <Row class="marginB-20">
                    <Col span="24">
                        <Select placeholder="选择系统" v-model="summary.systemId">
                            <Option :value="item.id" v-for="item in sysList">
                                {{item.title}}
                            </Option>)
                        </Select>
                    </Col>
                </Row>
                <Row :gutter="16" class="marginB-20" v-for="(modalItem,index2) in summary.content">
                    <Col span="6">
                        <Input placeholder="填写模块名称" v-model="modalItem.contentTitle"></Input>
                    </Col>
                    <Col span="18">
                        <Input placeholder="填写工作内容" v-model="modalItem.contentDescription">
                            <Button type="primary" slot="append" @click="delList2(index,index2)">删除本条记录</Button>
                        </Input>
                    </Col>
                </Row>
                <Row>
                    <Button type="primary" ghost @click="addModal2(index)">添加模块</Button>
                </Row>
            </div>
            <div class="summary-template-add marginB-20" @click="addSummary2">
                <Icon type="md-add" size="120" color="#999"/>
            </div>
        </Card>
        <Row>
            <Button type="primary" size="large" long @click="submit">提交</Button>
        </Row>
    </div>
</template>
<script>
    import {
        getSystemList,
        getTemplateDetails,
        addTemplate
    } from "@/api/index";
    export default {
        data() {
            return {
                title: 'xxxx年xx月月终工作总结（员工姓名）',
                sysList: [],
                time: '',
                submitList: [],
                submitList2: []
            }
        },
        computed: {
            templateList() {
                var result = [];
                this.submitList.forEach(item => {
                    var content = [];
                    item.content.forEach(item2 => {
                        content.push(
                            {
                                contentTitle: item2.contentTitle,
                                contentDescription: item2.contentDescription
                            }
                        )
                    });
                    result.push(
                        {
                            systemId: item.systemId,
                            systemName: _.find(this.sysList,['id', item.systemId]).title,
                            content: content
                        }
                    )
                })
                return result;
            },
            templateList2() {
                var result = [];
                this.submitList2.forEach(item => {
                    var content = [];
                    item.content.forEach(item2 => {
                        content.push(
                            {
                                contentTitle: item2.contentTitle,
                                contentDescription: item2.contentDescription
                            }
                        )
                    });
                    result.push(
                        {
                            systemId: item.systemId,
                            systemName: _.find(this.sysList,['id', item.systemId]).title,
                            content: content
                        }
                    )
                })
                return result;
            }
        },
        methods: {
            onChange(val) {
                this.time = val;
            },
            submit() {
                var userInfo = JSON.parse(localStorage.getItem('userInfo'))
                var postData = {
                    templateId: this.templateId,
                    templateName: this.title,
                    userId: userInfo.userId,
                    userName: userInfo.userName,
                    nickName: userInfo.nickName,
                    templateList: this.templateList,
                    templateList2: this.templateList2,
                    time: this.time
                }
                addTemplate(postData).then(res => {
                    console.log(postData);
                })
            },
            init() {
                getSystemList().then(res => {
                    this.sysList = res.data;
                })
                if (!!this.templateId) {
                    getTemplateDetails(this.templateId).then(res => {
                        if (res.code == 1) {
                            this.title = res.data.templateName;
                            this.time = res.data.year+'-'+res.data.month;
                            this.submitList = res.data.templateList;
                            this.submitList2 = res.data.templateList2;
                        }
                    })
                }
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
            del(index) {
                this.submitList.splice(index,1);
            },
            delList2(index,index2) {
                this.submitList2[index].content.splice(index2,1);
            },
            addModal2(index) {
                this.submitList2[index].content.push({
                    contentTitle: '',
                    contentDescription: ''
                });
            },
            addSummary2() {
                this.submitList2.push(
                    {
                        systemId: '',
                        content: []
                    }
                )
            },
            del2(index) {
                this.submitList2.splice(index,1);
            },
            delList2(index,index2) {
                this.submitList2[index].content.splice(index2,1);
            }
        },
        mounted() {
            this.templateId = this.$route.params.id;
            this.init();
        }
    }
</script>