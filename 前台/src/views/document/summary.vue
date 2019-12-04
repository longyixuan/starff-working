<style lang="less" scoped>
@import "./summary.less";
</style>
<template>
    <Card>
        <Tabs value="tab1"  @on-click="changeTab">
            <TabPane label="我的工作总结" name="tab1"></TabPane>
            <TabPane label="总结汇总查询" name="tab2" @on-click="$router.push('summary-seach')"></TabPane>
            <Button size="small" type="primary" slot="extra">增加</Button>
        </Tabs>
        <List>
            <ListItem v-for="(item,index) in list" :key="item.documentId">{{item.documentName}}
                <template slot="action">
                    <li>
                        <a @click="show(item.documentId)">查看</a>
                    </li>
                    <li>
                        <template v-if="item.status">
                            编辑
                        </template>
                        <template v-else>
                            <a @click="edit(item.documentId)">编辑</a>
                        </template>
                    </li>
                    <li>
                        <template v-if="item.status">
                            <span style="color: #19be6b">已上报</span>
                        </template>
                        <template v-else>
                            <a @click="commit(index,item.documentId,item.userId)">上报</a>
                        </template>
                    </li>
                    <li>
                        <a href="">下载</a>
                    </li>
                </template>
            </ListItem>
            <div slot="footer" style="text-align: right;">
                <!-- <Page :total="100" show-elevator /> -->
            </div>
        </List>
    </Card>
</template>
<script>
    import {
        getDocumentList,
        commitDocument
    } from "@/api/index";
    export default {
        data() {
            return {
                list: []
            }
        },
        methods: {
            changeTab(name) {
                if (name=='tab2') {
                    this.$router.push({name:'summary-seach'})
                }
            },
            initList() {
                getDocumentList({userId: JSON.parse(localStorage.getItem('userInfo')).userId}).then(res => {
                    if (res.code==1) {
                        this.list = res.data;
                    }
                })
            },
            commit(indx,documentId,userId) {
                commitDocument({documentId: documentId, userId: userId}).then(res => {
                    if (res.code==1) {
                        this.list[indx].status = true;
                    }
                })
            },
            show(id) {
                this.$router.push({ name: 'summary-show', params: { id: id }})
            },
            edit(id) {
                this.$router.push({ name: 'summary-edit', params: { id: id }})
            }
        },
        mounted() {
            this.initList();
        }
    }
</script>