<style lang="less">
    @import "./summary.less";
</style>
<template>
    <div>
        <Card class="marginB-20">
            <Input v-model="title" class="summary-input" placeholder="样例：xxxx年xx月月终工作总结（员工姓名）"/>
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
                <Row :gutter="16" class="marginB-20" v-for="(modalItem,index2) in summary.list">
                    <Col span="6">
                        <Input placeholder="填写模块名称" v-model="modalItem.title"></Input>
                    </Col>
                    <Col span="18">
                        <Input placeholder="填写工作内容" v-model="modalItem.content">
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
                <Row :gutter="16" class="marginB-20" v-for="(modalItem,index2) in summary.list">
                    <Col span="6">
                        <Input placeholder="填写模块名称" v-model="modalItem.title"></Input>
                    </Col>
                    <Col span="18">
                        <Input placeholder="填写工作内容" v-model="modalItem.content">
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
            <Button type="primary" size="large" long>提交</Button>
        </Row>
    </div>
</template>
<script>
    import {
        getSystemList
    } from "@/api/index";
    export default {
        data() {
            return {
                title: 'xxxx年xx月月终工作总结（员工姓名）',
                sysList: [],
                submitList: [],
                submitList2: []
            }
        },
        methods: {
            init() {
                getSystemList().then(res => {
                    this.sysList = res.data;
                })
            },
            addModal(index) {
                this.submitList[index].list.push({
                    title: '',
                    content: ''
                });
            },
            addSummary() {
                this.submitList.push(
                    {
                        systemId: '',
                        list: []
                    }
                )
            },
            del(index) {
                this.submitList.splice(index,1);
            },
            delList2(index,index2) {
                this.submitList2[index].list.splice(index2,1);
            },
            addModal2(index) {
                this.submitList2[index].list.push({
                    title: '',
                    content: ''
                });
            },
            addSummary2() {
                this.submitList2.push(
                    {
                        systemId: '',
                        list: []
                    }
                )
            },
            del2(index) {
                this.submitList2.splice(index,1);
            },
            delList2(index,index2) {
                this.submitList2[index].list.splice(index2,1);
            }
        },
        mounted() {
            this.init();
        }
    }
</script>